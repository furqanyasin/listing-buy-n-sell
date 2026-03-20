import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BlogPostStatus, Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'

const CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  category: true,
  tags: true,
  viewsCount: true,
  publishedAt: true,
  createdAt: true,
  author: { select: { id: true, name: true, avatarUrl: true } },
} satisfies Prisma.BlogPostSelect

const DETAIL_SELECT = {
  ...CARD_SELECT,
  body: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.BlogPostSelect

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    return this.prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        ...(category ? { category } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      select: CARD_SELECT,
    })
  }

  async findAllAdmin() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: { ...CARD_SELECT, status: true },
    })
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: BlogPostStatus.PUBLISHED },
      select: DETAIL_SELECT,
    })
    if (!post) throw new NotFoundException('Blog post not found')

    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    })
    return post
  }

  async findCategories(): Promise<string[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: { status: BlogPostStatus.PUBLISHED, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    })
    return posts.map((p) => p.category as string)
  }

  async create(authorId: string, dto: CreateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } })
    if (existing) throw new BadRequestException('Slug already in use')

    return this.prisma.blogPost.create({
      data: {
        authorId,
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        body: dto.body,
        coverImage: dto.coverImage,
        category: dto.category,
        tags: dto.tags ?? [],
        status: dto.status ?? BlogPostStatus.DRAFT,
        publishedAt: dto.status === BlogPostStatus.PUBLISHED ? new Date() : null,
      },
      select: DETAIL_SELECT,
    })
  }

  async update(id: string, authorId: string, isAdmin: boolean, dto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Blog post not found')
    if (post.authorId !== authorId && !isAdmin) throw new ForbiddenException()

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } })
      if (existing) throw new BadRequestException('Slug already in use')
    }

    const data: Prisma.BlogPostUpdateInput = { ...dto }
    if (dto.status === BlogPostStatus.PUBLISHED && post.status !== BlogPostStatus.PUBLISHED) {
      data.publishedAt = new Date()
    }

    return this.prisma.blogPost.update({ where: { id }, data, select: DETAIL_SELECT })
  }

  async remove(id: string, authorId: string, isAdmin: boolean) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Blog post not found')
    if (post.authorId !== authorId && !isAdmin) throw new ForbiddenException()
    await this.prisma.blogPost.delete({ where: { id } })
  }

  async findById(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id }, select: DETAIL_SELECT })
    if (!post) throw new NotFoundException('Blog post not found')
    return post
  }
}
