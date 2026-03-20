'use client'

import { Bell, CheckCheck } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useMarkAllRead, useMarkRead, useNotifications } from '@/lib/hooks/use-notifications'
import type { Notification } from '@pw-clone/types'

const TYPE_LABELS: Record<string, string> = {
  NEW_MESSAGE: 'New Message',
  LISTING_APPROVED: 'Listing Approved',
  LISTING_REJECTED: 'Listing Rejected',
  LISTING_EXPIRING: 'Listing Expiring',
  NEW_REVIEW: 'New Review',
  SYSTEM: 'System',
}

function NotificationItem({ notif }: { notif: Notification }) {
  const markRead = useMarkRead()
  const isRead = !!notif.readAt

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl border transition-colors',
        isRead ? 'border-surface-100 bg-white' : 'border-brand-100 bg-brand-50',
      )}
      onClick={() => {
        if (!isRead) markRead.mutate(notif.id)
      }}
    >
      <div
        className={cn(
          'w-2 h-2 rounded-full mt-2 shrink-0',
          isRead ? 'bg-surface-200' : 'bg-brand-500',
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-surface-900 text-sm">{notif.title}</p>
          <span className="text-xs text-surface-400 shrink-0">
            {new Date(notif.createdAt).toLocaleDateString('en-PK', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {notif.body && <p className="text-sm text-surface-500 mt-0.5">{notif.body}</p>}
        <p className="text-xs text-surface-400 mt-1">{TYPE_LABELS[notif.type] ?? notif.type}</p>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications()
  const markAllRead = useMarkAllRead()

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-surface-500 mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notif={notif} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-surface-400">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No notifications yet</p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
