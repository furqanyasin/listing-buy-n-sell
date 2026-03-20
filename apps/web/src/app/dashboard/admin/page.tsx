'use client'

import Link from 'next/link'
import { Users, Cog, FileText, Clock } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminStats } from '@/lib/hooks/use-admin'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const { data: stats, isLoading } = useAdminStats()

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/dashboard')
    }
  }, [user, router])

  if (!user || user.role !== 'ADMIN') return null

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers,
      icon: Users,
      href: '/dashboard/admin/users',
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings,
      icon: Cog,
      href: '/dashboard/admin/listings',
    },
    {
      title: 'Pending Review',
      value: stats?.pendingListings,
      icon: Clock,
      href: '/dashboard/admin/listings',
      highlight: true,
    },
    {
      title: 'Total Suppliers',
      value: stats?.totalDealers,
      icon: FileText,
      href: '/suppliers',
    },
  ]

  return (
    <PageWrapper contained>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-surface-900 mb-6">Admin Dashboard</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  card.highlight && stats?.pendingListings ? 'border-amber-200 bg-amber-50' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-surface-500">
                      {card.title}
                    </CardTitle>
                    <card.icon className="h-4 w-4 text-surface-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className={`text-2xl font-bold ${card.highlight ? 'text-amber-600' : 'text-surface-900'}`}>
                      {card.value ?? 0}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/listings"
            className="p-5 border border-surface-100 rounded-2xl hover:bg-surface-50 transition-colors"
          >
            <Cog className="h-6 w-6 text-brand-500 mb-3" />
            <p className="font-semibold text-surface-900">Listings Moderation</p>
            <p className="text-sm text-surface-500 mt-1">Approve or reject pending listings</p>
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="p-5 border border-surface-100 rounded-2xl hover:bg-surface-50 transition-colors"
          >
            <Users className="h-6 w-6 text-brand-500 mb-3" />
            <p className="font-semibold text-surface-900">User Management</p>
            <p className="text-sm text-surface-500 mt-1">Ban users, change roles</p>
          </Link>
          <Link
            href="/dashboard/admin/blog"
            className="p-5 border border-surface-100 rounded-2xl hover:bg-surface-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-brand-500 mb-3" />
            <p className="font-semibold text-surface-900">Blog Management</p>
            <p className="text-sm text-surface-500 mt-1">Create and publish posts</p>
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
