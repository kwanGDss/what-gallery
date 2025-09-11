import { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'Discover AI Art',
  description: 'Explore amazing AI-generated photos, illustrations, and 3D renders from creators worldwide',
}

export default function HomePageRoute() {
  return <HomePage />
}