import { PageWrapper } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Heart, MessageSquare, Eye } from 'lucide-react'

const stats = [
  { label: 'My Ads', value: '0', icon: Car, color: 'text-brand-500 bg-brand-50' },
  { label: 'Saved Cars', value: '0', icon: Heart, color: 'text-red-500 bg-red-50' },
  { label: 'Messages', value: '0', icon: MessageSquare, color: 'text-blue-500 bg-blue-50' },
  { label: 'Total Views', value: '0', icon: Eye, color: 'text-green-500 bg-green-50' },
]

export default function DashboardPage() {
  return (
    <PageWrapper contained>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">My Dashboard</h1>
        <p className="text-surface-500 mt-1">Welcome back! Here&apos;s an overview of your activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Ads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-surface-400">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No ads yet</p>
            <p className="text-sm mt-1">Post your first car listing to get started.</p>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
