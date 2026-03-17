import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { SendMessageDto } from './dto/send-message.dto'

// ─── Select shapes ─────────────────────────────────────────────────────────────

const PARTICIPANT_SELECT = { select: { id: true, name: true, avatarUrl: true } }

const LISTING_PREVIEW_SELECT = {
  select: {
    id: true,
    title: true,
    price: true,
    userId: true,
    images: {
      where: { isPrimary: true },
      select: { id: true, url: true, publicId: true, isPrimary: true, order: true },
      take: 1,
    },
  },
}

const MESSAGE_SELECT = {
  id: true,
  body: true,
  senderId: true,
  readAt: true,
  createdAt: true,
  sender: PARTICIPANT_SELECT,
} satisfies Prisma.MessageSelect

// ─── Helper to build the conversation list select with dynamic userId ──────────

function convListSelect(userId: string) {
  return {
    id: true,
    createdAt: true,
    updatedAt: true,
    listing: LISTING_PREVIEW_SELECT,
    buyer: PARTICIPANT_SELECT,
    seller: PARTICIPANT_SELECT,
    messages: {
      orderBy: { createdAt: 'desc' as const },
      take: 1,
      select: { id: true, body: true, createdAt: true, senderId: true, readAt: true },
    },
    _count: {
      select: {
        messages: { where: { readAt: null, senderId: { not: userId } } },
      },
    },
  } satisfies Prisma.ConversationSelect
}

// ─── Transform: flatten lastMessage + unreadCount ─────────────────────────────

function transformConversation<
  T extends {
    messages: { id: string; body: string; createdAt: Date; senderId: string; readAt: Date | null }[]
    _count: { messages: number }
  },
>(conv: T) {
  const { messages, _count, ...rest } = conv
  return {
    ...rest,
    lastMessage: messages[0] ?? null,
    unreadCount: _count.messages,
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Find or create conversation ──────────────────────────────────────────────

  async findOrCreate(buyerId: string, dto: CreateConversationDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { id: true, userId: true },
    })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.userId === buyerId) {
      throw new BadRequestException('You cannot start a conversation about your own listing')
    }

    const existing = await this.prisma.conversation.findUnique({
      where: { listingId_buyerId: { listingId: dto.listingId, buyerId } },
      select: { id: true },
    })
    if (existing) return { id: existing.id, isNew: false }

    const conv = await this.prisma.conversation.create({
      data: { listingId: dto.listingId, buyerId, sellerId: listing.userId },
      select: { id: true },
    })
    return { id: conv.id, isNew: true }
  }

  // ── Find all conversations for a user ────────────────────────────────────────

  async findAll(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      orderBy: { updatedAt: 'desc' },
      select: convListSelect(userId),
    })
    return conversations.map(transformConversation)
  }

  // ── Find one conversation ─────────────────────────────────────────────────────

  async findOne(id: string, userId: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
      select: {
        ...convListSelect(userId),
        messages: {
          orderBy: { createdAt: 'asc' as const },
          select: MESSAGE_SELECT,
        },
      },
    })
    if (!conv) throw new NotFoundException('Conversation not found')
    if (conv.buyer.id !== userId && conv.seller.id !== userId) {
      throw new ForbiddenException('Not your conversation')
    }
    return transformConversation(conv)
  }

  // ── Send message ──────────────────────────────────────────────────────────────

  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    })
    if (!conv) throw new NotFoundException('Conversation not found')
    if (conv.buyerId !== senderId && conv.sellerId !== senderId) {
      throw new ForbiddenException('Not your conversation')
    }

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: { conversationId, senderId, body: dto.body },
        select: MESSAGE_SELECT,
      }),
      // Touch updatedAt so the conversation floats to top of list
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
        select: { id: true },
      }),
    ])

    return message
  }

  // ── Mark messages as read ──────────────────────────────────────────────────

  async markRead(conversationId: string, userId: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    })
    if (!conv) throw new NotFoundException('Conversation not found')
    if (conv.buyerId !== userId && conv.sellerId !== userId) {
      throw new ForbiddenException('Not your conversation')
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    })
  }
}
