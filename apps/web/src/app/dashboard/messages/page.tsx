'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useConversations } from '@/lib/hooks/use-conversations'
import { useAuthStore } from '@/store/auth.store'
import type { ConversationListItem } from '@pw-clone/types'

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

function ConversationRow({
  conv,
  userId,
}: {
  conv: ConversationListItem
  userId: string
}) {
  const other = conv.buyer.id === userId ? conv.seller : conv.buyer
  const primaryImage = conv.listing.images?.[0]

  return (
    <Link
      href={`/dashboard/messages/${conv.id}`}
      className="flex items-center gap-3 p-4 rounded-xl border border-surface-100 hover:bg-surface-50 transition-colors"
    >
      {/* Listing thumbnail */}
      <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-surface-100 shrink-0">
        {primaryImage ? (
          <Image src={primaryImage.url} alt={conv.listing.title} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="w-full h-full bg-surface-200" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="font-medium text-surface-900 text-sm truncate">{other.name}</p>
          {conv.lastMessage && (
            <span className="text-xs text-surface-400 shrink-0">
              {formatTime(conv.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-xs text-surface-500 truncate">{conv.listing.title}</p>
        {conv.lastMessage && (
          <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? 'text-surface-900 font-medium' : 'text-surface-400'}`}>
            {conv.lastMessage.senderId === userId ? 'You: ' : ''}
            {conv.lastMessage.body}
          </p>
        )}
      </div>

      {/* Unread badge */}
      {conv.unreadCount > 0 && (
        <Badge className="shrink-0 min-w-[20px] h-5 flex items-center justify-center text-[10px] px-1.5">
          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
        </Badge>
      )}
    </Link>
  )
}

export default function MessagesPage() {
  const { data: conversations = [], isLoading } = useConversations()
  const userId = useAuthStore((s) => s.user?.id ?? '')

  return (
    <PageWrapper contained>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Messages</h1>
        <p className="text-surface-500 mt-1">Your conversations with buyers and sellers.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 text-surface-400">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No conversations yet</p>
          <p className="text-sm mt-1">Start a conversation from any car listing page.</p>
          <Button asChild className="mt-6">
            <Link href="/machines">Browse Machines</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <ConversationRow key={conv.id} conv={conv} userId={userId} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
