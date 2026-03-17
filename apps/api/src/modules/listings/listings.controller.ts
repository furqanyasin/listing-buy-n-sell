import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { AddListingImagesDto } from './dto/add-listing-images.dto'
import { CreateListingDto } from './dto/create-listing.dto'
import { ListingFiltersDto } from './dto/listing-filters.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { ListingsService } from './listings.service'

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // ── Public endpoints ──────────────────────────────────────────────────────────

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active listings with filters and pagination' })
  findAll(@Query() filters: ListingFiltersDto) {
    return this.listingsService.findAll(filters)
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured listings for homepage' })
  findFeatured() {
    return this.listingsService.findFeatured()
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a single listing by ID' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id)
  }

  // ── Authenticated endpoints ──────────────────────────────────────────────────

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing (submitted as PENDING)' })
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateListingDto,
  ) {
    return this.listingsService.create(user.id, dto)
  }

  @Get('user/mine')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current user's own listings" })
  findMine(@CurrentUser() user: { id: string }) {
    return this.listingsService.findMine(user.id)
  }

  @Get('user/mine/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get one of the current user's listings by ID (any status, for edit form)" })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  findMineById(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.listingsService.findMineById(id, user.id)
  }

  @Post(':id/images')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Attach uploaded images to a listing (owner only)' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  addImages(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: AddListingImagesDto,
  ) {
    return this.listingsService.addImages(id, user.id, dto.images)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing (owner only)' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.id, dto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a listing (owner or admin)' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    await this.listingsService.remove(id, user.id, user.role === UserRole.ADMIN)
  }

  // ── Admin endpoints ──────────────────────────────────────────────────────────

  @Patch(':id/status')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update listing status (admin/editor only)' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.listingsService.updateStatus(id, dto.status, dto.rejectedReason)
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Get all listings regardless of status (admin/editor)' })
  findAllAdmin(@Query() filters: ListingFiltersDto) {
    return this.listingsService.findAllAdmin(filters)
  }
}
