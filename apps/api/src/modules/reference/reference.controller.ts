import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Public } from '../../common/decorators/public.decorator'
import { ReferenceService } from './reference.service'

@ApiTags('Reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('makes')
  @Public()
  @ApiOperation({ summary: 'Get all active vehicle makes' })
  getMakes() {
    return this.referenceService.getMakes()
  }

  @Get('makes/:makeId/models')
  @Public()
  @ApiOperation({ summary: 'Get all active models for a make' })
  @ApiParam({ name: 'makeId', description: 'Make ID' })
  getModelsByMake(@Param('makeId') makeId: string) {
    return this.referenceService.getModelsByMake(makeId)
  }

  @Get('cities')
  @Public()
  @ApiOperation({ summary: 'Get all active cities' })
  getCities() {
    return this.referenceService.getCities()
  }
}
