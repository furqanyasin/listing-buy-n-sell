'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Upload, X, ImageIcon, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMakes, useModelsByMake, useCities } from '@/lib/hooks/use-reference'
import { createListingApi } from '@/lib/api/listings'
import { uploadImageApi, addListingImagesApi } from '@/lib/api/media'
import type { UploadedImage } from '@/lib/api/media'
import {
  listingStep1Schema,
  listingStep2Schema,
  type ListingStep1Data,
  type ListingStep2Data,
} from '@/lib/validators/listing.validators'
import { cn } from '@/lib/utils'

// ─── Types & Constants ────────────────────────────────────────────────────────

const STEPS = ['Vehicle Info', 'Pricing & Details', 'Photos'] as const
const CURRENT_YEAR = new Date().getFullYear()

const YEARS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, i) => CURRENT_YEAR - i)

const BODY_TYPES = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'HATCHBACK', label: 'Hatchback' },
  { value: 'PICKUP', label: 'Pickup / Truck' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'COUPE', label: 'Coupe' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
  { value: 'WAGON', label: 'Wagon' },
  { value: 'OTHER', label: 'Other' },
]

const FUEL_TYPES = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'CNG', label: 'CNG' },
  { value: 'LPG', label: 'LPG' },
]

// ─── Step 1: Vehicle Info ─────────────────────────────────────────────────────

function Step1({
  defaultValues,
  onNext,
}: {
  defaultValues: Partial<ListingStep1Data>
  onNext: (data: ListingStep1Data) => void
}) {
  const { data: makes = [] } = useMakes()
  const [selectedMakeId, setSelectedMakeId] = useState(defaultValues.makeId ?? '')
  const { data: models = [] } = useModelsByMake(selectedMakeId || null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingStep1Data>({
    resolver: zodResolver(listingStep1Schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      {/* Make + Model */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Make *</Label>
          <Select
            defaultValue={defaultValues.makeId}
            onValueChange={(v) => {
              setSelectedMakeId(v)
              setValue('makeId', v, { shouldValidate: true })
              setValue('modelId', '', { shouldValidate: false })
            }}
          >
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
          {errors.makeId && <p className="text-xs text-red-500">{errors.makeId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Model *</Label>
          <Select
            defaultValue={defaultValues.modelId}
            disabled={!selectedMakeId}
            onValueChange={(v) => setValue('modelId', v, { shouldValidate: true })}
          >
            <SelectTrigger error={!!errors.modelId}>
              <SelectValue placeholder={selectedMakeId ? 'Select model' : 'Select make first'} />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.modelId && <p className="text-xs text-red-500">{errors.modelId.message}</p>}
        </div>
      </div>

      {/* Year + Condition */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Year *</Label>
          <Select
            defaultValue={defaultValues.year?.toString()}
            onValueChange={(v) => setValue('year', Number(v), { shouldValidate: true })}
          >
            <SelectTrigger error={!!errors.year}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Condition *</Label>
          <Select
            defaultValue={defaultValues.condition}
            onValueChange={(v) =>
              setValue('condition', v as 'NEW' | 'USED', { shouldValidate: true })
            }
          >
            <SelectTrigger error={!!errors.condition}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USED">Used</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-xs text-red-500">{errors.condition.message}</p>}
        </div>
      </div>

      {/* Body Type + Fuel Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Body Type *</Label>
          <Select
            defaultValue={defaultValues.bodyType}
            onValueChange={(v) =>
              setValue('bodyType', v as ListingStep1Data['bodyType'], { shouldValidate: true })
            }
          >
            <SelectTrigger error={!!errors.bodyType}>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bodyType && <p className="text-xs text-red-500">{errors.bodyType.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Fuel Type *</Label>
          <Select
            defaultValue={defaultValues.fuelType}
            onValueChange={(v) =>
              setValue('fuelType', v as ListingStep1Data['fuelType'], { shouldValidate: true })
            }
          >
            <SelectTrigger error={!!errors.fuelType}>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fuelType && <p className="text-xs text-red-500">{errors.fuelType.message}</p>}
        </div>
      </div>

      {/* Transmission + Mileage */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Transmission *</Label>
          <Select
            defaultValue={defaultValues.transmission}
            onValueChange={(v) =>
              setValue('transmission', v as 'AUTOMATIC' | 'MANUAL', { shouldValidate: true })
            }
          >
            <SelectTrigger error={!!errors.transmission}>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AUTOMATIC">Automatic</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && (
            <p className="text-xs text-red-500">{errors.transmission.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mileage">Mileage (km) *</Label>
          <Input
            id="mileage"
            type="number"
            min={0}
            placeholder="e.g. 45000"
            {...register('mileage', { valueAsNumber: true })}
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-xs text-red-500">{errors.mileage.message}</p>}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1.5">
        <Label htmlFor="color">Color *</Label>
        <Input
          id="color"
          placeholder="e.g. Silver, White, Black..."
          {...register('color')}
          className={errors.color ? 'border-red-500' : ''}
        />
        {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

// ─── Step 2: Pricing & Details ────────────────────────────────────────────────

function Step2({
  defaultValues,
  onBack,
  onNext,
}: {
  defaultValues: Partial<ListingStep2Data>
  onBack: () => void
  onNext: (data: ListingStep2Data) => void
}) {
  const { data: cities = [] } = useCities()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingStep2Data>({
    resolver: zodResolver(listingStep2Schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Ad Title *</Label>
        <Input
          id="title"
          placeholder="e.g. Toyota Corolla 2020 — Excellent Condition"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe your vehicle — service history, modifications, reason for sale..."
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
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

      {/* City + Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>City *</Label>
          <Select
            defaultValue={defaultValues.cityId}
            onValueChange={(v) => setValue('cityId', v, { shouldValidate: true })}
          >
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
          {errors.cityId && <p className="text-xs text-red-500">{errors.cityId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="locationText">Area / Location</Label>
          <Input
            id="locationText"
            placeholder="e.g. DHA Phase 5"
            {...register('locationText')}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

// ─── Step 3: Photos ───────────────────────────────────────────────────────────

interface PhotoFile {
  file: File
  preview: string
  uploaded?: UploadedImage
  uploading?: boolean
  error?: boolean
}

function Step3({
  onBack,
  onSubmit,
  isSubmitting,
}: {
  onBack: () => void
  onSubmit: (images: UploadedImage[]) => void
  isSubmitting: boolean
}) {
  const [photos, setPhotos] = useState<PhotoFile[]>([])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newPhotos: PhotoFile[] = Array.from(files)
      .slice(0, 20 - photos.length) // max 20 photos
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  async function handleSubmit() {
    const uploaded: UploadedImage[] = []

    // Upload any photos that haven't been uploaded yet
    const updated = [...photos]
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].uploaded) {
        uploaded.push(updated[i].uploaded!)
        continue
      }
      updated[i] = { ...updated[i], uploading: true, error: false }
      setPhotos([...updated])
      try {
        const result = await uploadImageApi(updated[i].file)
        updated[i] = { ...updated[i], uploading: false, uploaded: result }
        setPhotos([...updated])
        uploaded.push(result)
      } catch {
        updated[i] = { ...updated[i], uploading: false, error: true }
        setPhotos([...updated])
        toast.error(`Failed to upload image ${i + 1}. Please try again.`)
        return
      }
    }

    onSubmit(uploaded)
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        className={cn(
          'border-2 border-dashed border-surface-200 rounded-xl p-8 text-center',
          'hover:border-brand-400 hover:bg-brand-50/30 transition-colors cursor-pointer',
        )}
        onClick={() => document.getElementById('photo-input')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
      >
        <input
          id="photo-input"
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
        <ImageIcon className="h-10 w-10 mx-auto mb-3 text-surface-300" />
        <p className="font-medium text-surface-700">Click or drag photos here</p>
        <p className="text-sm text-surface-400 mt-1">JPEG, PNG, WebP — max 10 MB each, up to 20</p>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {photos.map((photo, idx) => (
            <div
              key={photo.preview}
              className="relative aspect-square rounded-lg overflow-hidden bg-surface-100 group"
            >
              <Image
                src={photo.preview}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {/* Primary badge */}
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-brand-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
              {/* Upload status */}
              {photo.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white animate-bounce" />
                </div>
              )}
              {photo.uploaded && (
                <div className="absolute bottom-1 right-1">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
              )}
              {photo.error && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <span className="text-xs text-red-600 font-medium">Failed</span>
                </div>
              )}
              {/* Remove button */}
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(idx)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={photos.length === 0}>
          Post Ad
        </Button>
      </div>

      {photos.length === 0 && (
        <p className="text-xs text-surface-400 text-center">
          At least one photo is required to post an ad.
        </p>
      )}
    </div>
  )
}

// ─── Progress Stepper ─────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, idx) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors',
              idx < step
                ? 'bg-brand-500 text-white'
                : idx === step
                  ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                  : 'bg-surface-100 text-surface-400',
            )}
          >
            {idx < step ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
          </div>
          <span
            className={cn(
              'text-sm font-medium hidden sm:block',
              idx === step ? 'text-surface-900' : 'text-surface-400',
            )}
          >
            {label}
          </span>
          {idx < STEPS.length - 1 && (
            <div
              className={cn(
                'h-px flex-1 min-w-[2rem]',
                idx < step ? 'bg-brand-500' : 'bg-surface-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PostAdPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [step1Data, setStep1Data] = useState<Partial<ListingStep1Data>>({})
  const [step2Data, setStep2Data] = useState<Partial<ListingStep2Data>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleStep1(data: ListingStep1Data) {
    setStep1Data(data)
    setStep(1)
  }

  function handleStep2(data: ListingStep2Data) {
    setStep2Data(data)
    setStep(2)
  }

  async function handleSubmit(images: UploadedImage[]) {
    setIsSubmitting(true)
    try {
      const listing = await createListingApi({
        ...(step1Data as ListingStep1Data),
        ...(step2Data as ListingStep2Data),
        currency: 'PKR',
        imageIds: [],
      })

      if (images.length > 0) {
        await addListingImagesApi(
          listing.id,
          images.map((img, idx) => ({ ...img, isPrimary: idx === 0, order: idx })),
        )
      }

      toast.success('Your ad has been submitted for review!')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to post ad. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Post Your Car</h1>
          <p className="text-surface-500 mt-1">Fill in the details to list your vehicle for sale.</p>
        </div>

        <Stepper step={step} />

        <Card>
          <CardContent className="p-6">
            {step === 0 && <Step1 defaultValues={step1Data} onNext={handleStep1} />}
            {step === 1 && (
              <Step2
                defaultValues={step2Data}
                onBack={() => setStep(0)}
                onNext={handleStep2}
              />
            )}
            {step === 2 && (
              <Step3
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
