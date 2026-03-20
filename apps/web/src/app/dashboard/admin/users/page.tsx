'use client'

import { useState } from 'react'
import { Ban, Shield } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useBanUser, useAdminUsers, useChangeUserRole } from '@/lib/hooks/use-admin'

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  ADMIN: 'destructive',
  EDITOR: 'default',
  DEALER: 'secondary',
  USER: 'outline',
}

const ROLES = ['USER', 'DEALER', 'EDITOR', 'ADMIN']

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminUsers(page)
  const banMutation = useBanUser()
  const roleMutation = useChangeUserRole()

  const users = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <PageWrapper contained>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">
            User Management
            <span className="ml-3 text-base font-medium text-surface-400">({total} total)</span>
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${
                    !user.isActive ? 'bg-red-50 border-red-100' : 'border-surface-100 hover:bg-surface-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-surface-900 truncate">{user.name}</p>
                      {!user.isActive && (
                        <Badge variant="destructive" className="text-xs">Banned</Badge>
                      )}
                    </div>
                    <p className="text-sm text-surface-500">{user.email}</p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {user._count?.listings ?? 0} listings ·{' '}
                      {new Date(user.createdAt).toLocaleDateString('en-PK')}
                    </p>
                  </div>

                  <Badge variant={ROLE_VARIANT[user.role] ?? 'outline'}>{user.role}</Badge>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Role selector */}
                    <select
                      defaultValue={user.role}
                      onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                      className="text-xs border border-surface-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    <Button
                      size="sm"
                      variant={user.isActive ? 'destructive' : 'outline'}
                      className="gap-1.5"
                      onClick={() => banMutation.mutate(user.id)}
                      disabled={banMutation.isPending}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      {user.isActive ? 'Ban' : 'Unban'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 20 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-surface-500">
                  Page {page} of {Math.ceil(total / 20)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(total / 20)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}
