import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { BodyType, FuelType, TransmissionType, VehicleCondition } from '@prisma/client'

export class ListingFiltersDto {
  @ApiPropertyOptional({ description: 'Keyword search on title and description' })
  @IsOptional()
  @IsString()
  q?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  makeId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modelId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cityId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1970)
  yearMin?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(2030)
  yearMax?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileageMax?: number

  @ApiPropertyOptional({ enum: FuelType })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType

  @ApiPropertyOptional({ enum: TransmissionType })
  @IsOptional()
  @IsEnum(TransmissionType)
  transmission?: TransmissionType

  @ApiPropertyOptional({ enum: BodyType })
  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType

  @ApiPropertyOptional({ enum: VehicleCondition })
  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFeatured?: boolean

  @ApiPropertyOptional({ enum: ['createdAt', 'price', 'mileage', 'year'] })
  @IsOptional()
  @IsIn(['createdAt', 'price', 'mileage', 'year'])
  sortBy?: 'createdAt' | 'price' | 'mileage' | 'year'

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number
}
