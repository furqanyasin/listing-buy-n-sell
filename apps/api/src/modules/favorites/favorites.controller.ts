import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { FavoritesService } from './favorites.service'

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':listingId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle favorite (add if not saved, remove if saved)' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  toggle(
    @CurrentUser() user: { id: string },
    @Param('listingId') listingId: string,
  ) {
    return this.favoritesService.toggle(user.id, listingId)
  }

  @Get()
  @ApiOperation({ summary: "Get current user's saved listings" })
  findAll(@CurrentUser() user: { id: string }) {
    return this.favoritesService.findAll(user.id)
  }

  @Get('ids')
  @ApiOperation({ summary: "Get IDs of current user's favorited listings (lightweight)" })
  getIds(@CurrentUser() user: { id: string }) {
    return this.favoritesService.getIds(user.id)
  }
}
