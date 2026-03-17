import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

export class ListingImageDto {
  @IsString()
  @IsNotEmpty()
  url!: string

  @IsString()
  @IsNotEmpty()
  publicId!: string

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number
}

export class AddListingImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingImageDto)
  images!: ListingImageDto[]
}
