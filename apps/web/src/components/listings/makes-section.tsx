'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Car } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMakes } from '@/lib/hooks/use-reference'
import { cn } from '@/lib/utils'

export function MakesSection() {
  const { data: makes, isLoading } = useMakes()

  const display = isLoading ? null : makes?.slice(0, 12)

  return (
    <section className="bg-surface-100 py-14">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">
          Browse by Brand
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))
            : display?.map((make) => (
                <Link
                  key={make.id}
                  href={`/cars?makeId=${make.id}`}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-xl',
                    'bg-white border border-surface-200 shadow-card',
                    'hover:shadow-card-hover hover:border-brand-200 transition-all duration-200',
                    'group text-center',
                  )}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    {make.logoUrl ? (
                      <Image
                        src={make.logoUrl}
                        alt={make.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <Car className="h-7 w-7 text-surface-400 group-hover:text-brand-500 transition-colors" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-surface-700 group-hover:text-brand-600 transition-colors leading-tight">
                    {make.name}
                  </span>
                </Link>
              ))}
        </div>

        {!isLoading && makes && makes.length > 12 && (
          <div className="text-center mt-6">
            <Link
              href="/cars"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              View all {makes.length} brands →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
