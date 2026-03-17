import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ConversationsService } from './conversations.service'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { SendMessageDto } from './dto/send-message.dto'

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find or create a conversation for a listing' })
  findOrCreate(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.findOrCreate(user.id, dto)
  }

  @Get()
  @ApiOperation({ summary: "Get current user's conversations" })
  findAll(@CurrentUser() user: { id: string }) {
    return this.conversationsService.findAll(user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation with its messages' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.conversationsService.findOne(id, user.id)
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: SendMessageDto,
  ) {
    return this.conversationsService.sendMessage(id, user.id, dto)
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark all incoming messages as read" })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async markRead(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    await this.conversationsService.markRead(id, user.id)
  }
}
