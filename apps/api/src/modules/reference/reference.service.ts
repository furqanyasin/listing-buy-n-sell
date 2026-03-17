import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  getMakes() {
    return this.prisma.make.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
      },
    })
  }

  getModelsByMake(makeId: string) {
    return this.prisma.vehicleModel.findMany({
      where: { makeId, isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        makeId: true,
        name: true,
        slug: true,
      },
    })
  }

  getCities() {
    return this.prisma.city.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        province: true,
      },
    })
  }
}
