import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { Roles } from '../../common/decorators/roles.decorator'
import { AdminService } from './admin.service'

class RejectListingDto {
  @IsOptional()
  @IsString()
  reason?: string
}

class ChangeRoleDto {
  @IsEnum(UserRole)
  role: UserRole
}

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard stats (total users, listings, etc.)' })
  getStats() {
    return this.adminService.getStats()
  }

  @Get('listings/pending')
  @ApiOperation({ summary: 'Get all listings pending approval' })
  getPendingListings() {
    return this.adminService.getPendingListings()
  }

  @Patch('listings/:id/approve')
  @ApiOperation({ summary: 'Approve a listing' })
  approveListing(@Param('id') id: string) {
    return this.adminService.approveListing(id)
  }

  @Patch('listings/:id/reject')
  @ApiOperation({ summary: 'Reject a listing with optional reason' })
  rejectListing(@Param('id') id: string, @Body() dto: RejectListingDto) {
    return this.adminService.rejectListing(id, dto.reason)
  }

  @Patch('listings/:id/featured')
  @ApiOperation({ summary: 'Toggle featured status of a listing' })
  toggleFeatured(@Param('id') id: string) {
    return this.adminService.toggleFeatured(id)
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users (paginated)' })
  getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getUsers(Number(page) || 1, Number(limit) || 20)
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Toggle user active/banned status' })
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id)
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Change user role' })
  changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
    return this.adminService.changeUserRole(id, dto.role)
  }
}
