import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReviewDto } from './dto/create-review.dto'

const REVIEW_SELECT = {
  id: true,
  rating: true,
  body: true,
  createdAt: true,
  reviewer: { select: { id: true, name: true, avatarUrl: true } },
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    if (!dto.targetUserId && !dto.targetDealerId) {
      throw new BadRequestException('Must provide targetUserId or targetDealerId')
    }
    if (dto.targetUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.targetUserId } })
      if (!user) throw new NotFoundException('Target user not found')
      if (dto.targetUserId === reviewerId) throw new BadRequestException('Cannot review yourself')
    }
    if (dto.targetDealerId) {
      const dealer = await this.prisma.dealer.findUnique({ where: { id: dto.targetDealerId } })
      if (!dealer) throw new NotFoundException('Target dealer not found')
    }

    return this.prisma.review.create({
      data: {
        reviewerId,
        targetUserId: dto.targetUserId,
        targetDealerId: dto.targetDealerId,
        rating: dto.rating,
        body: dto.body,
      },
      select: REVIEW_SELECT,
    })
  }

  async findForUser(targetUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } })
    if (!user) throw new NotFoundException('User not found')

    const reviews = await this.prisma.review.findMany({
      where: { targetUserId },
      orderBy: { createdAt: 'desc' },
      select: REVIEW_SELECT,
    })

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

    return { reviews, averageRating: avg, count: reviews.length }
  }

  async findForDealer(targetDealerId: string) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id: targetDealerId } })
    if (!dealer) throw new NotFoundException('Dealer not found')

    const reviews = await this.prisma.review.findMany({
      where: { targetDealerId },
      orderBy: { createdAt: 'desc' },
      select: REVIEW_SELECT,
    })

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

    return { reviews, averageRating: avg, count: reviews.length }
  }
}
