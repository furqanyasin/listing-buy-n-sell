import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BlogPostStatus } from '@prisma/client'

export class CreateBlogPostDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase kebab-case' })
  slug: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  excerpt?: string

  @ApiProperty()
  @IsString()
  @MinLength(10)
  body: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  coverImage?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiPropertyOptional({ enum: BlogPostStatus })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus
}
