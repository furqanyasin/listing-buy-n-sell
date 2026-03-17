import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ListingStatus, Prisma, UserRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDealerDto } from './dto/create-dealer.dto'
import { UpdateDealerDto } from './dto/update-dealer.dto'

// ─── Slug helper ──────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ─── Prisma select shapes ─────────────────────────────────────────────────────

// Note: Dealer.listings doesn't exist in schema — listings belong to User.
// We fetch active listing count via user._count.listings and surface it as listingsCount.
const DEALER_SELECT = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  coverUrl: true,
  address: true,
  phone: true,
  whatsapp: true,
  website: true,
  description: true,
  isVerified: true,
  isFeatured: true,
  createdAt: true,
  city: { select: { id: true, name: true, slug: true, province: true } },
  user: {
    select: {
      _count: {
        select: { listings: { where: { status: ListingStatus.ACTIVE } } },
      },
    },
  },
} satisfies Prisma.DealerSelect

const LISTING_SELECT = {
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

// ─── Transform: flatten user._count into listingsCount ────────────────────────

function transform<T extends { user: { _count: { listings: number } } }>(
  dealer: T,
): Omit<T, 'user'> & { listingsCount: number } {
  const { user, ...rest } = dealer
  return { ...rest, listingsCount: user._count.listings }
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class DealersService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Register ────────────────────────────────────────────────────────────────

  async register(userId: string, dto: CreateDealerDto) {
    const existing = await this.prisma.dealer.findUnique({ where: { userId } })
    if (existing) throw new ConflictException('You already have a dealer profile')

    const base = slugify(dto.name)
    if (!base) throw new BadRequestException('Dealer name produces an invalid slug')

    let slug = base
    let n = 1
    while (await this.prisma.dealer.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`
    }

    const [dealer] = await this.prisma.$transaction([
      this.prisma.dealer.create({
        data: {
          userId,
          name: dto.name,
          slug,
          cityId: dto.cityId,
          phone: dto.phone,
          address: dto.address,
          whatsapp: dto.whatsapp,
          website: dto.website,
          description: dto.description,
        },
        select: DEALER_SELECT,
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.DEALER },
      }),
    ])

    return transform(dealer)
  }

  // ── Find All (public) ────────────────────────────────────────────────────────

  async findAll() {
    const dealers = await this.prisma.dealer.findMany({
      orderBy: [{ isFeatured: 'desc' }, { isVerified: 'desc' }, { createdAt: 'desc' }],
      select: DEALER_SELECT,
    })
    return dealers.map(transform)
  }

  // ── Find By Slug (public, includes active listings) ──────────────────────────

  async findBySlug(slug: string) {
    // Fetch dealer with userId so we can look up their listings
    const raw = await this.prisma.dealer.findUnique({
      where: { slug },
      select: {
        ...DEALER_SELECT,
        userId: true,
      },
    })
    if (!raw) throw new NotFoundException('Dealer not found')

    const listings = await this.prisma.listing.findMany({
      where: { userId: raw.userId, status: ListingStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: LISTING_SELECT,
    })

    const { userId: _uid, user, ...rest } = raw
    return {
      ...rest,
      listingsCount: user._count.listings,
      listings,
    }
  }

  // ── Find My Dealer ───────────────────────────────────────────────────────────

  async findMine(userId: string) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId },
      select: DEALER_SELECT,
    })
    if (!dealer) throw new NotFoundException('You do not have a dealer profile yet')
    return transform(dealer)
  }

  // ── Update (owner) ───────────────────────────────────────────────────────────

  async update(dealerId: string, userId: string, dto: UpdateDealerDto) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id: dealerId } })
    if (!dealer) throw new NotFoundException('Dealer not found')
    if (dealer.userId !== userId) throw new ForbiddenException('Not your dealer profile')

    const updated = await this.prisma.dealer.update({
      where: { id: dealerId },
      data: { ...dto },
      select: DEALER_SELECT,
    })
    return transform(updated)
  }

  // ── Verify (admin) ───────────────────────────────────────────────────────────

  async verify(dealerId: string) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id: dealerId } })
    if (!dealer) throw new NotFoundException('Dealer not found')

    return this.prisma.dealer.update({
      where: { id: dealerId },
      data: { isVerified: true },
      select: { id: true, name: true, slug: true, isVerified: true },
    })
  }
}
