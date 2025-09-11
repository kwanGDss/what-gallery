import { Suspense } from 'react'
import { SearchPageClient } from './SearchPageClient'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading search..." />
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}