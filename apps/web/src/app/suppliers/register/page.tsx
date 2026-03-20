'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2 } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCities } from '@/lib/hooks/use-reference'
import { useRegisterDealer } from '@/lib/hooks/use-dealers'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, 'Business name is required').max(120),
  cityId: z.string().min(1, 'City is required'),
  phone: z.string().min(7, 'Phone number is required').max(20),
  address: z.string().max(200).optional(),
  whatsapp: z.string().max(20).optional(),
  website: z.string().url('Enter a valid URL (e.g. https://...)').optional().or(z.literal('')),
  description: z.string().max(2000).optional(),
})

type FormData = z.infer<typeof schema>

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealerRegisterPage() {
  const { data: cities = [] } = useCities()
  const registerDealer = useRegisterDealer()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    registerDealer.mutate({
      ...data,
      website: data.website || undefined,
    })
  }

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Become a Supplier</h1>
            <p className="text-surface-500 mt-1">
              Register your business to list unlimited machines and reach more buyers worldwide.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Details</CardTitle>
            <CardDescription>
              This information will appear on your public supplier profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Dealership name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Pakistan CNC Solutions"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* City + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Select onValueChange={(v) => setValue('cityId', v, { shouldValidate: true })}>
                    <SelectTrigger error={!!errors.cityId}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cityId && (
                    <p className="text-xs text-red-500">{errors.cityId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="03XX-XXXXXXX"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="e.g. Plot 12, Industrial Area, Lahore"
                  {...register('address')}
                />
              </div>

              {/* WhatsApp + Website */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="03XX-XXXXXXX"
                    {...register('whatsapp')}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourdealer.com"
                    {...register('website')}
                    className={errors.website ? 'border-red-500' : ''}
                  />
                  {errors.website && (
                    <p className="text-xs text-red-500">{errors.website.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">About Your Business</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Tell buyers about your business, machine specialties, years in industry..."
                  {...register('description')}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={registerDealer.isPending}
              >
                Create Supplier Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
