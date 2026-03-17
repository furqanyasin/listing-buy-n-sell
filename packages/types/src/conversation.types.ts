// ─── Conversation & Messaging Types ──────────────────────────────────────────

import type { ListingImage } from './listing.types'

export interface MessageSender {
  id: string
  name: string
  avatarUrl: string | null
}

export interface Message {
  id: string
  body: string
  senderId: string
  readAt: string | null
  createdAt: string
  sender: MessageSender
}

export interface ConversationListing {
  id: string
  title: string
  price: number
  images: ListingImage[]
}

export interface ConversationListItem {
  id: string
  createdAt: string
  updatedAt: string
  listing: ConversationListing
  buyer: MessageSender
  seller: MessageSender
  lastMessage: Omit<Message, 'sender'> | null
  unreadCount: number
}

export interface ConversationDetail extends ConversationListItem {
  messages: Message[]
}
