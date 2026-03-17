import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits' })
  phone?: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string
}
