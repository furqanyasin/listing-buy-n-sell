import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Body() dto: RegisterDto) {
    const tokens = await this.authService.register(dto)
    return {
      success: true,
      message: 'Account created successfully',
      data: tokens,
    }
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto) {
    const tokens = await this.authService.login(dto)
    return {
      success: true,
      message: 'Logged in successfully',
      data: tokens,
    }
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    // Decode the token without verification to extract the userId for lookup.
    // Full integrity check happens inside refreshTokens() via bcrypt comparison.
    const decoded = this.decodeRefreshToken(dto.refreshToken)
    const tokens = await this.authService.refreshTokens(decoded.id, dto.refreshToken)
    return {
      success: true,
      message: 'Tokens refreshed successfully',
      data: tokens,
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate the provided refresh token' })
  async logout(
    @CurrentUser() user: { id: string },
    @Body() dto: RefreshTokenDto,
  ) {
    await this.authService.logout(user.id, dto.refreshToken)
    return {
      success: true,
      message: 'Logged out successfully',
    }
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto)
    return {
      success: true,
      message: result.message,
    }
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a valid reset token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto)
    return {
      success: true,
      message: result.message,
    }
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private decodeRefreshToken(token: string): { id: string } {
    try {
      // JWT is base64url encoded; decode payload without verification
      const parts = token.split('.')
      if (parts.length !== 3) {
        return { id: '' }
      }
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64url').toString('utf8'),
      ) as { sub?: string }
      return { id: payload.sub ?? '' }
    } catch {
      return { id: '' }
    }
  }
}
