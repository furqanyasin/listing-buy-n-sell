import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateReviewDto {
  @ApiPropertyOptional({ description: 'Target user ID (for seller reviews)' })
  @IsOptional()
  @IsString()
  targetUserId?: string

  @ApiPropertyOptional({ description: 'Target dealer ID (for dealer reviews)' })
  @IsOptional()
  @IsString()
  targetDealerId?: string

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string
}
