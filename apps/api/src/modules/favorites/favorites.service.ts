import { Injectable, NotFoundException } from '@nestjs/common'
import { ListingStatus, Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

const LISTING_CARD_SELECT = {
  id: true,
  title: true,
  price: true,
  currency: true,
  year: true,
  mileage: true,
  fuelType: true,
  transmission: true,
  bodyType: true,
  condition: true,
  status: true,
  isFeatured: true,
  locationText: true,
  viewsCount: true,
  createdAt: true,
  make: { select: { id: true, name: true, slug: true, logoUrl: true } },
  model: { select: { id: true, name: true, slug: true } },
  city: { select: { id: true, name: true, slug: true, province: true } },
  images: {
    where: { isPrimary: true },
    select: { id: true, url: true, publicId: true, isPrimary: true, order: true },
    take: 1,
  },
} satisfies Prisma.ListingSelect

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Toggle ───────────────────────────────────────────────────────────────────

  async toggle(userId: string, listingId: string): Promise<{ isFavorited: boolean }> {
    const listing = await this.prisma.listing.findFirst({
      where: { id: listingId, status: ListingStatus.ACTIVE },
    })
    if (!listing) throw new NotFoundException('Listing not found')

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    })

    if (existing) {
      await this.prisma.favorite.delete({
        where: { userId_listingId: { userId, listingId } },
      })
      return { isFavorited: false }
    }

    await this.prisma.favorite.create({ data: { userId, listingId } })
    return { isFavorited: true }
  }

  // ── Find All (user's saved listings) ────────────────────────────────────────

  async findAll(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { listing: { select: LISTING_CARD_SELECT } },
    })
    return favorites.map((f) => f.listing)
  }

  // ── Get IDs (lightweight, for client-side toggle state) ──────────────────────

  async getIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { listingId: true },
    })
    return favorites.map((f) => f.listingId)
  }
}
