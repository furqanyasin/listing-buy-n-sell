import { IsOptional, IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator'

export class CreateDealerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string

  @IsString()
  @IsNotEmpty()
  cityId!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone!: string

  @IsString()
  @IsOptional()
  @MaxLength(200)
  address?: string

  @IsString()
  @IsOptional()
  @MaxLength(20)
  whatsapp?: string

  @IsUrl()
  @IsOptional()
  website?: string

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string
}
