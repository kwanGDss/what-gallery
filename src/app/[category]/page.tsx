import { CategoryPageClient } from './CategoryPageClient'
import { ContentCategory } from '@/types'

// Generate static paths for all categories at build time
export function generateStaticParams() {
  const categories: ContentCategory[] = ['photos', 'illustrations', '3d']
  return categories.map((category) => ({
    category: category,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: ContentCategory }> }) {
  const { category } = await params
  return <CategoryPageClient category={category} />
}