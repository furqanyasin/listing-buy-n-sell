'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Camera, User } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useUpdateProfile, useChangePassword } from '@/lib/hooks/use-user'
import { uploadImageApi } from '@/lib/api/media'
import { toast } from 'sonner'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: user, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) })

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) })

  // Prefill profile form
  useEffect(() => {
    if (!user) return
    resetProfile({ name: user.name, phone: user.phone ?? '' })
  }, [user, resetProfile])

  function onProfileSubmit(data: ProfileFormData) {
    updateProfile.mutate({ name: data.name, phone: data.phone || undefined })
  }

  function onPasswordSubmit(data: PasswordFormData) {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => resetPassword() },
    )
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { url } = await uploadImageApi(file)
      updateProfile.mutate({ avatarUrl: url })
    } catch {
      toast.error('Failed to upload avatar')
    }
  }

  if (isLoading) {
    return (
      <PageWrapper contained>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-surface-900">Account Settings</h1>
        </div>

        {/* Avatar */}
        <Card className="mb-5">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-brand-50 overflow-hidden border border-surface-200">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-7 w-7 text-brand-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow hover:bg-brand-700 transition-colors"
                  title="Change avatar"
                >
                  <Camera className="h-3 w-3" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="font-semibold text-surface-900">{user?.name}</p>
                <p className="text-sm text-surface-500">{user?.email}</p>
                <p className="text-xs text-surface-400 mt-0.5 capitalize">{user?.role?.toLowerCase()} account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile form */}
        <Card className="mb-5">
          <CardHeader>
            <CardTitle className="text-base">Profile Information</CardTitle>
            <CardDescription>Update your name and phone number.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...regProfile('name')}
                  className={profileErrors.name ? 'border-red-500' : ''}
                />
                {profileErrors.name && (
                  <p className="text-xs text-red-500">{profileErrors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="bg-surface-50 text-surface-400"
                />
                <p className="text-xs text-surface-400">Email cannot be changed.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="03XX-XXXXXXX"
                  {...regProfile('phone')}
                />
              </div>

              <Button type="submit" isLoading={updateProfile.isPending}>
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
            <CardDescription>Must be at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...regPassword('currentPassword')}
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...regPassword('newPassword')}
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...regPassword('confirmPassword')}
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" isLoading={changePassword.isPending}>
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
