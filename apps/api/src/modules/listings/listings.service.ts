import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ListingStatus, Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { ListingFiltersDto } from './dto/listing-filters.dto'
import { UpdateListingDto } from './dto/update-listing.dto'

// Shared select for list views (lighter payload)
const LIST_SELECT = {
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

// Full select for detail view
const DETAIL_SELECT = {
  ...LIST_SELECT,
  description: true,
  color: true,
  viewsCount: true,
  featuredUntil: true,
  expiresAt: true,
  updatedAt: true,
  seller: {
    select: { id: true, name: true, phone: true, avatarUrl: true, createdAt: true },
  },
  images: {
    select: { id: true, url: true, publicId: true, isPrimary: true, order: true },
    orderBy: { order: 'asc' as const },
  },
} satisfies Prisma.ListingSelect

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Create ──────────────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        makeId: dto.makeId,
        modelId: dto.modelId,
        year: dto.year,
        mileage: dto.mileage,
        fuelType: dto.fuelType,
        transmission: dto.transmission,
        bodyType: dto.bodyType,
        color: dto.color,
        condition: dto.condition,
        cityId: dto.cityId,
        locationText: dto.locationText,
        status: ListingStatus.PENDING,
      },
      select: DETAIL_SELECT,
    })
  }

  // ─── Find All (public, paginated + filtered) ──────────────────────────────────

  async findAll(filters: ListingFiltersDto) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 24
    const skip = (page - 1) * limit

    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
      ...(filters.q && {
        OR: [
          { title: { contains: filters.q, mode: 'insensitive' } },
          { description: { contains: filters.q, mode: 'insensitive' } },
        ],
      }),
      ...(filters.makeId && { makeId: filters.makeId }),
      ...(filters.modelId && { modelId: filters.modelId }),
      ...(filters.cityId && { cityId: filters.cityId }),
      ...(filters.fuelType && { fuelType: filters.fuelType }),
      ...(filters.transmission && { transmission: filters.transmission }),
      ...(filters.bodyType && { bodyType: filters.bodyType }),
      ...(filters.condition && { condition: filters.condition }),
      ...(filters.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
      ...((filters.yearMin !== undefined || filters.yearMax !== undefined) && {
        year: {
          ...(filters.yearMin !== undefined && { gte: filters.yearMin }),
          ...(filters.yearMax !== undefined && { lte: filters.yearMax }),
        },
      }),
      ...((filters.priceMin !== undefined || filters.priceMax !== undefined) && {
        price: {
          ...(filters.priceMin !== undefined && { gte: filters.priceMin }),
          ...(filters.priceMax !== undefined && { lte: filters.priceMax }),
        },
      }),
      ...(filters.mileageMax !== undefined && { mileage: { lte: filters.mileageMax } }),
    }

    const sortBy = filters.sortBy ?? 'createdAt'
    const sortOrder = filters.sortOrder ?? 'desc'
    const orderBy: Prisma.ListingOrderByWithRelationInput = { [sortBy]: sortOrder }

    const [total, listings] = await this.prisma.$transaction([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: LIST_SELECT,
      }),
    ])

    return {
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    }
  }

  // ─── Featured (for homepage) ──────────────────────────────────────────────────

  async findFeatured(limit = 8) {
    return this.prisma.listing.findMany({
      where: { status: ListingStatus.ACTIVE, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: LIST_SELECT,
    })
  }

  // ─── Find One (public) ────────────────────────────────────────────────────────

  async findOne(id: string) {
    const listing = await this.prisma.listing.findFirst({
      where: { id, status: ListingStatus.ACTIVE },
      select: DETAIL_SELECT,
    })

    if (!listing) throw new NotFoundException('Listing not found')

    // Increment views asynchronously (fire and forget)
    void this.prisma.listing.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    })

    return listing
  }

  // ─── Find Mine (owner's listings, all statuses) ───────────────────────────────

  findMine(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: LIST_SELECT,
    })
  }

  // ─── Update (owner only) ──────────────────────────────────────────────────────

  async update(id: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.userId !== userId) throw new ForbiddenException('Not your listing')

    return this.prisma.listing.update({
      where: { id },
      data: { ...dto },
      select: DETAIL_SELECT,
    })
  }

  // ─── Remove (owner or admin) ──────────────────────────────────────────────────

  async remove(id: string, userId: string, isAdmin = false) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (!isAdmin && listing.userId !== userId) {
      throw new ForbiddenException('Not your listing')
    }

    await this.prisma.listing.delete({ where: { id } })
  }

  // ─── Add Images (owner only) ──────────────────────────────────────────────────

  async addImages(
    listingId: string,
    userId: string,
    images: { url: string; publicId: string; isPrimary?: boolean; order?: number }[],
  ) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.userId !== userId) throw new ForbiddenException('Not your listing')

    const existingCount = await this.prisma.listingImage.count({ where: { listingId } })
    const data = images.map((img, idx) => ({
      listingId,
      url: img.url,
      publicId: img.publicId,
      isPrimary: img.isPrimary ?? (existingCount === 0 && idx === 0),
      order: img.order ?? existingCount + idx,
    }))

    await this.prisma.listingImage.createMany({ data })
    return this.prisma.listingImage.findMany({
      where: { listingId },
      orderBy: { order: 'asc' },
    })
  }

  // ─── Update Status (admin only) ───────────────────────────────────────────────

  async updateStatus(id: string, status: ListingStatus, rejectedReason?: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')

    return this.prisma.listing.update({
      where: { id },
      data: {
        status,
        ...(rejectedReason !== undefined && { rejectedReason }),
      },
      select: { id: true, status: true, rejectedReason: true },
    })
  }

  // ─── Admin: Find All (any status) ─────────────────────────────────────────────

  async findAllAdmin(filters: ListingFiltersDto) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 24
    const skip = (page - 1) * limit

    const where: Prisma.ListingWhereInput = {
      ...(filters.q && {
        OR: [
          { title: { contains: filters.q, mode: 'insensitive' } },
          { description: { contains: filters.q, mode: 'insensitive' } },
        ],
      }),
      ...(filters.makeId && { makeId: filters.makeId }),
      ...(filters.cityId && { cityId: filters.cityId }),
    }

    const [total, listings] = await this.prisma.$transaction([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { ...LIST_SELECT, status: true, userId: true },
      }),
    ])

    return {
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    }
  }
}
