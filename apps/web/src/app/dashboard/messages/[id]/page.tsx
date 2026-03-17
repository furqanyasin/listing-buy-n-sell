'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Send } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useConversation, useSendMessage, useMarkRead } from '@/lib/hooks/use-conversations'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'
import type { Message } from '@pw-clone/types'

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `${(price / 10_000_000).toFixed(1)} Crore`
  if (price >= 100_000) return `${(price / 100_000).toFixed(1)} Lakh`
  return price.toLocaleString('en-PK')
}

function MessageBubble({ message, isMine }: { message: Message; isMine: boolean }) {
  return (
    <div className={cn('flex gap-2 max-w-[75%]', isMine ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0 mt-0.5">
        {message.sender.avatarUrl ? (
          <Image
            src={message.sender.avatarUrl}
            alt={message.sender.name}
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
        ) : (
          message.sender.name.charAt(0).toUpperCase()
        )}
      </div>

      <div>
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
            isMine
              ? 'bg-brand-600 text-white rounded-tr-sm'
              : 'bg-surface-100 text-surface-900 rounded-tl-sm',
          )}
        >
          {message.body}
        </div>
        <p className={cn('text-[10px] mt-1 text-surface-400', isMine ? 'text-right' : 'text-left')}>
          {new Date(message.createdAt).toLocaleTimeString('en-PK', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {isMine && message.readAt && ' · Read'}
        </p>
      </div>
    </div>
  )
}

export default function MessageThreadPage() {
  const { id } = useParams<{ id: string }>()
  const userId = useAuthStore((s) => s.user?.id ?? '')
  const { data: conv, isLoading, isError } = useConversation(id)
  const sendMessage = useSendMessage(id)
  const markRead = useMarkRead(id)
  const [body, setBody] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = conv?.messages ?? []
  const other = conv ? (conv.buyer.id === userId ? conv.seller : conv.buyer) : null

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Mark as read when thread opens / new messages arrive
  useEffect(() => {
    if (conv && conv.unreadCount > 0) {
      markRead.mutate()
    }
  }, [conv?.unreadCount]) // eslint-disable-next-line -- intentional: only re-run when unreadCount changes

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || sendMessage.isPending) return
    sendMessage.mutate(trimmed, { onSuccess: () => setBody('') })
  }

  if (isLoading) {
    return (
      <PageWrapper contained>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </PageWrapper>
    )
  }

  if (isError || !conv) {
    return (
      <PageWrapper contained>
        <div className="max-w-2xl mx-auto text-center py-20 text-surface-400">
          <p className="font-medium">Conversation not found.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/messages">Back to Messages</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const primaryImage = conv.listing.images?.[0]

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200 shrink-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/messages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          {/* Listing preview */}
          <Link
            href={`/cars/${conv.listing.id}`}
            className="flex items-center gap-3 flex-1 min-w-0 group"
          >
            <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-surface-100 shrink-0">
              {primaryImage && (
                <Image src={primaryImage.url} alt={conv.listing.title} fill className="object-cover" sizes="48px" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">
                {conv.listing.title}
              </p>
              <p className="text-xs text-brand-600 font-medium">
                PKR {formatPrice(Number(conv.listing.price))}
              </p>
            </div>
          </Link>

          {/* Other participant */}
          {other && (
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-surface-800">{other.name}</p>
              <p className="text-xs text-surface-400">
                {conv.buyer.id === userId ? 'Seller' : 'Buyer'}
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-12 text-surface-400 text-sm">
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isMine={msg.senderId === userId} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Send form */}
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 pt-4 border-t border-surface-200 shrink-0"
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!body.trim() || sendMessage.isPending}
            className="shrink-0 h-10 w-10 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </PageWrapper>
  )
}
