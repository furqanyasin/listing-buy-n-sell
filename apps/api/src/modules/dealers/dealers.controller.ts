import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { CreateDealerDto } from './dto/create-dealer.dto'
import { UpdateDealerDto } from './dto/update-dealer.dto'
import { DealersService } from './dealers.service'

@ApiTags('Dealers')
@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  // ── Public ──────────────────────────────────────────────────────────────────

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all dealer profiles' })
  findAll() {
    return this.dealersService.findAll()
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get dealer profile with active listings' })
  @ApiParam({ name: 'slug', description: 'Dealer slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.dealersService.findBySlug(slug)
  }

  // ── Authenticated ────────────────────────────────────────────────────────────

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a dealer (upgrades role to DEALER)' })
  register(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateDealerDto,
  ) {
    return this.dealersService.register(user.id, dto)
  }

  @Get('me/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current user's dealer profile" })
  findMine(@CurrentUser() user: { id: string }) {
    return this.dealersService.findMine(user.id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update dealer profile (owner only)' })
  @ApiParam({ name: 'id', description: 'Dealer ID' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateDealerDto,
  ) {
    return this.dealersService.update(id, user.id, dto)
  }

  // ── Admin ────────────────────────────────────────────────────────────────────

  @Patch(':id/verify')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a dealer (admin only)' })
  @ApiParam({ name: 'id', description: 'Dealer ID' })
  verify(@Param('id') id: string) {
    return this.dealersService.verify(id)
  }
}
