import * as crypto from 'crypto'
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthTokens, JwtPayload } from '@pw-clone/types'
import { PrismaService } from '../../prisma/prisma.service'
import { UsersService } from '../users/users.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

const REFRESH_TOKEN_BCRYPT_ROUNDS = 10

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // ─── Public Methods ──────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const existing = await this.usersService.findByEmail(dto.email)

    if (existing) {
      throw new ConflictException('An account with that email already exists')
    }

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.storeRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.usersService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash)

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.storeRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Find all refresh tokens for this user and remove the matching one
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    })

    for (const stored of storedTokens) {
      const matches = await bcrypt.compare(refreshToken, stored.token)
      if (matches) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } })
        return
      }
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId)

    if (!user) {
      throw new UnauthorizedException('Access denied')
    }

    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    })

    let matchedTokenId: string | null = null

    for (const stored of storedTokens) {
      const matches = await bcrypt.compare(refreshToken, stored.token)
      if (matches) {
        // Check token has not expired
        if (stored.expiresAt < new Date()) {
          await this.prisma.refreshToken.delete({ where: { id: stored.id } })
          throw new UnauthorizedException('Refresh token has expired')
        }
        matchedTokenId = stored.id
        break
      }
    }

    if (!matchedTokenId) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Rotate: delete old token, issue new pair
    await this.prisma.refreshToken.delete({ where: { id: matchedTokenId } })

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.storeRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email)

    // Always return the same response — don't leak whether email exists
    const genericMessage = 'If that email exists, a reset link has been sent'

    if (!user) {
      return { message: genericMessage }
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = await this.hashToken(rawToken)
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // +1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: tokenHash,
        resetTokenExpiry: expiry,
      },
    })

    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:3000')
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`

    if (this.config.get<string>('NODE_ENV') !== 'production') {
      this.logger.log(`[DEV] Password reset URL for ${user.email}: ${resetUrl}`)
    } else {
      // TODO: integrate email provider (e.g. SendGrid, AWS SES) for production
      this.logger.warn(`Password reset requested for ${user.email} — email sending not yet configured`)
    }

    return { message: genericMessage }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    // Find users whose reset token has not yet expired
    const users = await this.prisma.user.findMany({
      where: {
        resetToken: { not: null },
        resetTokenExpiry: { gt: new Date() },
      },
    })

    let matchedUserId: string | null = null

    for (const user of users) {
      if (!user.resetToken) continue
      const matches = await bcrypt.compare(dto.token, user.resetToken)
      if (matches) {
        matchedUserId = user.id
        break
      }
    }

    if (!matchedUserId) {
      throw new BadRequestException('Reset token is invalid or has expired')
    }

    const newPasswordHash = await bcrypt.hash(dto.password, 12)

    await this.prisma.user.update({
      where: { id: matchedUserId },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    // Invalidate all refresh tokens on password reset
    await this.prisma.refreshToken.deleteMany({ where: { userId: matchedUserId } })

    return { message: 'Password has been reset successfully' }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthTokens> {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role: role as JwtPayload['role'],
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ])

    return { accessToken, refreshToken }
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const tokenHash = await this.hashToken(token)

    const expiresInMs = this.parseExpiry(
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    )

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: tokenHash,
        expiresAt: new Date(Date.now() + expiresInMs),
      },
    })
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, REFRESH_TOKEN_BCRYPT_ROUNDS)
  }

  /**
   * Parse a JWT-style expiry string like "7d", "15m", "3600s" into milliseconds.
   */
  private parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1)
    const value = parseInt(expiry.slice(0, -1), 10)

    switch (unit) {
      case 's':
        return value * 1000
      case 'm':
        return value * 60 * 1000
      case 'h':
        return value * 60 * 60 * 1000
      case 'd':
        return value * 24 * 60 * 60 * 1000
      default:
        // Assume raw number is seconds
        return parseInt(expiry, 10) * 1000
    }
  }
}
