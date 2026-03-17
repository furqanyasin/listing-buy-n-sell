import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BodyType, FuelType, TransmissionType, VehicleCondition } from '@prisma/client'

const CURRENT_YEAR = new Date().getFullYear()

export class CreateListingDto {
  @ApiProperty({ example: 'Toyota Corolla 2020 - Excellent Condition' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Well maintained, single owner, all documents clear.' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: 3200000 })
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty({ example: 'make-cuid' })
  @IsString()
  @IsNotEmpty()
  makeId: string

  @ApiProperty({ example: 'model-cuid' })
  @IsString()
  @IsNotEmpty()
  modelId: string

  @ApiProperty({ example: 2020 })
  @IsInt()
  @Min(1970)
  @Max(CURRENT_YEAR + 1)
  year: number

  @ApiProperty({ example: 45000 })
  @IsInt()
  @Min(0)
  mileage: number

  @ApiProperty({ enum: FuelType })
  @IsEnum(FuelType)
  fuelType: FuelType

  @ApiProperty({ enum: TransmissionType })
  @IsEnum(TransmissionType)
  transmission: TransmissionType

  @ApiProperty({ enum: BodyType })
  @IsEnum(BodyType)
  bodyType: BodyType

  @ApiProperty({ example: 'Pearl White' })
  @IsString()
  @IsNotEmpty()
  color: string

  @ApiProperty({ enum: VehicleCondition })
  @IsEnum(VehicleCondition)
  condition: VehicleCondition

  @ApiProperty({ example: 'city-cuid' })
  @IsString()
  @IsNotEmpty()
  cityId: string

  @ApiPropertyOptional({ example: 'DHA Phase 5, Lahore' })
  @IsOptional()
  @IsString()
  locationText?: string
}
