import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { BlogService } from './blog.service'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published blog posts (optionally filtered by category)' })
  findAll(@Query('category') category?: string) {
    return this.blogService.findAll(category)
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get distinct categories of published posts' })
  findCategories() {
    return this.blogService.findCategories()
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Get all blog posts regardless of status (admin/editor)' })
  findAllAdmin() {
    return this.blogService.findAllAdmin()
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a published blog post by slug (increments views)' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug)
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create a blog post (admin/editor only)' })
  create(
    @CurrentUser() user: { id: string; role: UserRole },
    @Body() dto: CreateBlogPostDto,
  ) {
    return this.blogService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update a blog post (author or admin)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: UserRole },
    @Body() dto: UpdateBlogPostDto,
  ) {
    return this.blogService.update(id, user.id, user.role === UserRole.ADMIN, dto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blog post (author or admin)' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.blogService.remove(id, user.id, user.role === UserRole.ADMIN)
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Get a blog post by ID (admin/editor, any status)' })
  findById(
    @Param('id') id: string,
  ) {
    return this.blogService.findById(id)
  }
}
