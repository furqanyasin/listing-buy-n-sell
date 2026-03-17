import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ListingStatus } from '@prisma/client'

export class UpdateStatusDto {
  @ApiProperty({ enum: ListingStatus })
  @IsEnum(ListingStatus)
  status: ListingStatus

  @ApiPropertyOptional({ example: 'Duplicate listing' })
  @IsOptional()
  @IsString()
  rejectedReason?: string
}
