import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ReviewsService } from './reviews.service'
import { CreateReviewDto } from './dto/create-review.dto'

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a review for a user or dealer' })
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, dto)
  }

  @Get('user/:userId')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a user (with avg rating)' })
  findForUser(@Param('userId') userId: string) {
    return this.reviewsService.findForUser(userId)
  }

  @Get('dealer/:dealerId')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a dealer (with avg rating)' })
  findForDealer(@Param('dealerId') dealerId: string) {
    return this.reviewsService.findForDealer(dealerId)
  }
}
