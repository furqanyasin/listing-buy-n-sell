import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { User } from '@prisma/client'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getMe(@CurrentUser() user: { id: string }): Promise<Omit<User, 'passwordHash' | 'resetToken' | 'verifyToken'>> {
    const found = await this.usersService.findById(user.id)

    if (!found) {
      throw new NotFoundException('User not found')
    }

    // Strip sensitive fields before returning
    const { passwordHash: _pw, resetToken: _rt, verifyToken: _vt, ...safeUser } = found
    return safeUser
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ): Promise<Omit<User, 'passwordHash' | 'resetToken' | 'verifyToken'>> {
    const updated = await this.usersService.update(user.id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
    })

    const { passwordHash: _pw, resetToken: _rt, verifyToken: _vt, ...safeUser } = updated
    return safeUser
  }
}
