import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

// DTOs and service will be built in Phase 2 (Authentication Module)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() _body: unknown) {
    // TODO: Phase 2 — Auth Module
    return { message: 'Auth module coming in Phase 2' }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() _body: unknown) {
    // TODO: Phase 2 — Auth Module
    return { message: 'Auth module coming in Phase 2' }
  }
}
