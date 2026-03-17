import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'

const BCRYPT_ROUNDS = 12

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: {
    name: string
    email: string
    phone?: string
    password: string
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        passwordHash,
      },
    })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    })
  }
}
