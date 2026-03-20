import { Injectable, NotFoundException } from '@nestjs/common'
import { ListingStatus, UserRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Dashboard stats ──────────────────────────────────────────────────────────

  async getStats() {
    const [
      totalUsers,
      totalListings,
      pendingListings,
      activeListings,
      totalDealers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count(),
      this.prisma.listing.count({ where: { status: ListingStatus.PENDING } }),
      this.prisma.listing.count({ where: { status: ListingStatus.ACTIVE } }),
      this.prisma.dealer.count(),
    ])
    return { totalUsers, totalListings, pendingListings, activeListings, totalDealers }
  }

  // ── Listings ─────────────────────────────────────────────────────────────────

  async getPendingListings() {
    return this.prisma.listing.findMany({
      where: { status: ListingStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        createdAt: true,
        isFeatured: true,
        make: { select: { name: true } },
        model: { select: { name: true } },
        city: { select: { name: true } },
        seller: { select: { id: true, name: true, email: true } },
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
      },
    })
  }

  async approveListing(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.ACTIVE, rejectedReason: null },
    })
  }

  async rejectListing(id: string, reason?: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.REJECTED, rejectedReason: reason ?? null },
    })
  }

  async toggleFeatured(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    return this.prisma.listing.update({
      where: { id },
      data: { isFeatured: !listing.isFeatured },
    })
  }

  // ── Users ────────────────────────────────────────────────────────────────────

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          _count: { select: { listings: true } },
        },
      }),
      this.prisma.user.count(),
    ])
    return { data: users, total, page, limit }
  }

  async banUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, isActive: true },
    })
  }

  async changeUserRole(id: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    })
  }
}
