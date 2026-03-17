'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMakes, useModelsByMake, useCities } from '@/lib/hooks/use-reference'
import { useMyListing, useUpdateListing } from '@/lib/hooks/use-listings'
import { listingFullSchema, type ListingFormData } from '@/lib/validators/listing.validators'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, i) => CURRENT_YEAR - i)

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: listing, isLoading, isError } = useMyListing(id)
  const updateMutation = useUpdateListing(id)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ListingFormData>({ resolver: zodResolver(listingFullSchema) })

  const selectedMakeId = watch('makeId')
  const { data: makes = [] } = useMakes()
  const { data: models = [] } = useModelsByMake(selectedMakeId)
  const { data: cities = [] } = useCities()

  // Prefill form once listing data loads
  useEffect(() => {
    if (!listing) return
    reset({
      makeId: listing.make.id,
      modelId: listing.model.id,
      year: listing.year,
      condition: listing.condition,
      bodyType: listing.bodyType,
      fuelType: listing.fuelType,
      transmission: listing.transmission,
      mileage: listing.mileage,
      color: listing.color ?? '',
      title: listing.title,
      description: listing.description ?? '',
      price: listing.price,
      cityId: listing.city.id,
      locationText: listing.locationText ?? '',
    })
  }, [listing, reset])

  function onSubmit(data: ListingFormData) {
    updateMutation.mutate(
      {
        ...data,
        locationText: data.locationText || undefined,
      },
      {
        onSuccess: () => router.push('/dashboard'),
      },
    )
  }

  if (isLoading) {
    return (
      <PageWrapper contained>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </PageWrapper>
    )
  }

  if (isError || !listing) {
    return (
      <PageWrapper contained>
        <div className="max-w-2xl mx-auto text-center py-20 text-surface-400">
          <p className="font-medium">Listing not found</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Edit Listing</h1>
            <p className="text-surface-500 text-sm mt-0.5 truncate max-w-md">{listing.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Make + Model */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Make *</Label>
                  <Controller
                    name="makeId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger error={!!errors.makeId}>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          {makes.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.makeId && (
                    <p className="text-xs text-red-500">{errors.makeId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Model *</Label>
                  <Controller
                    name="modelId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedMakeId}
                      >
                        <SelectTrigger error={!!errors.modelId}>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.modelId && (
                    <p className="text-xs text-red-500">{errors.modelId.message}</p>
                  )}
                </div>
              </div>

              {/* Year + Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Year *</Label>
                  <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger error={!!errors.year}>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Condition *</Label>
                  <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger error={!!errors.condition}>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USED">Used</SelectItem>
                          <SelectItem value="NEW">New</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Body + Fuel + Transmission */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Body Type *</Label>
                  <Controller
                    name="bodyType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger error={!!errors.bodyType}>
                          <SelectValue placeholder="Body" />
                        </SelectTrigger>
                        <SelectContent>
                          {['SEDAN','SUV','HATCHBACK','PICKUP','VAN','TRUCK','COUPE','CONVERTIBLE','WAGON','OTHER'].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v.charAt(0) + v.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Fuel *</Label>
                  <Controller
                    name="fuelType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger error={!!errors.fuelType}>
                          <SelectValue placeholder="Fuel" />
                        </SelectTrigger>
                        <SelectContent>
                          {['PETROL','DIESEL','HYBRID','ELECTRIC','CNG','LPG'].map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Transmission *</Label>
                  <Controller
                    name="transmission"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger error={!!errors.transmission}>
                          <SelectValue placeholder="Trans" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                          <SelectItem value="MANUAL">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Mileage + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mileage">Mileage (km) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min={0}
                    {...register('mileage', { valueAsNumber: true })}
                    className={errors.mileage ? 'border-red-500' : ''}
                  />
                  {errors.mileage && (
                    <p className="text-xs text-red-500">{errors.mileage.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    placeholder="e.g. White"
                    {...register('color')}
                    className={errors.color ? 'border-red-500' : ''}
                  />
                  {errors.color && (
                    <p className="text-xs text-red-500">{errors.color.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. 2021 Toyota Corolla GLi in excellent condition"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the car's condition, history, and any extras..."
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (PKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={1}
                    placeholder="e.g. 3500000"
                    {...register('price', { valueAsNumber: true })}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
                    )}
                  />
                  {errors.cityId && (
                    <p className="text-xs text-red-500">{errors.cityId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="locationText">Specific Location</Label>
                <Input
                  id="locationText"
                  placeholder="e.g. Model Town, Lahore"
                  {...register('locationText')}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              isLoading={updateMutation.isPending}
            >
              Save Changes
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
