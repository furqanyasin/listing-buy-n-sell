import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Public } from './common/decorators/public.decorator'

@ApiTags('Health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'pw-clone-api',
    }
  }
}
