import { Metadata } from 'next'
import { Post, User, ContentCategory } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://plot.gallery'
const siteName = 'Plot'
const defaultDescription = 'Discover and share amazing AI-generated art, photos, illustrations, and 3D renders from talented creators worldwide.'

// Base metadata for the site
export const baseMetadata: Metadata = {
  title: {
    default: `${siteName} - AI Art Gallery`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'AI art',
    'artificial intelligence',
    'generated art',
    'digital art',
    'Midjourney',
    'DALL-E',
    'Stable Diffusion',
    'AI photography',
    'AI illustrations',
    '3D renders',
    'creative AI',
    'art gallery',
    'AI-generated images'
  ],
  authors: [{ name: 'Plot Team' }],
  creator: 'Plot',
  publisher: 'Plot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName,
    title: `${siteName} - AI Art Gallery`,
    description: defaultDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteName} - AI Art Gallery`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - AI Art Gallery`,
    description: defaultDescription,
    images: ['/og-image.jpg'],
    creator: '@plotgallery',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

// Generate metadata for individual posts
export function generatePostMetadata(post: Post): Metadata {
  const title = `${post.title} by ${post.creator.name}`
  const description = `${post.description} Created with ${post.aiTool}. View and download this ${post.category} artwork on Plot.`
  const url = `${baseUrl}/posts/${post.id}`
  
  return {
    title,
    description,
    keywords: [
      ...post.tags,
      post.aiTool,
      post.category,
      'AI art',
      post.creator.name,
    ],
    authors: [{ name: post.creator.name }],
    creator: post.creator.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        {
          url: post.thumbnailUrl || post.imageUrl,
          width: 400,
          height: 300,
          alt: post.title,
        },
      ],
      publishedTime: post.uploadDate,
      authors: [post.creator.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.imageUrl],
      creator: `@${post.creator.name.replace(/\s+/g, '').toLowerCase()}`,
    },
  }
}

// Generate metadata for category pages
export function generateCategoryMetadata(category: ContentCategory): Metadata {
  const categoryNames = {
    photos: 'AI Photos',
    illustrations: 'AI Illustrations', 
    '3d': '3D Renders'
  }
  
  const categoryDescriptions = {
    photos: 'Explore stunning AI-generated photography and realistic images created by talented artists.',
    illustrations: 'Discover beautiful AI-generated illustrations, digital art, and creative designs.',
    '3d': 'Browse amazing 3D renders, models, and architectural visualizations created with AI.'
  }

  const title = categoryNames[category]
  const description = categoryDescriptions[category]
  const url = `${baseUrl}/${category}`

  return {
    title,
    description,
    keywords: [
      title.toLowerCase(),
      'AI art',
      'artificial intelligence',
      'generated art',
      category,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | ${siteName}`,
      description,
      siteName,
      images: [
        {
          url: `/og-${category}.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: [`/og-${category}.jpg`],
    },
  }
}

// Generate metadata for user/creator pages
export function generateUserMetadata(user: User): Metadata {
  const title = `${user.name} - AI Artist`
  const description = user.bio || `Discover amazing AI-generated art by ${user.name}. Browse their collection of creative works and follow for updates.`
  const url = `${baseUrl}/creators/${user.id}`

  return {
    title,
    description,
    keywords: [
      user.name,
      'AI artist',
      'AI art creator',
      'digital artist',
      'artificial intelligence',
    ],
    authors: [{ name: user.name }],
    creator: user.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'profile',
      url,
      title: `${title} | ${siteName}`,
      description,
      siteName,
      images: [
        {
          url: user.profilePicture,
          width: 400,
          height: 400,
          alt: `${user.name}'s profile picture`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${siteName}`,
      description,
      images: [user.profilePicture],
    },
  }
}

// Generate metadata for search pages
export function generateSearchMetadata(query?: string, category?: ContentCategory): Metadata {
  let title = 'Search AI Art'
  let description = 'Search and discover amazing AI-generated art, photos, illustrations, and 3D renders.'
  
  if (query) {
    title = `Search results for "${query}"`
    description = `Find AI-generated art related to "${query}". Browse photos, illustrations, and 3D renders created by talented artists.`
  }
  
  if (category) {
    const categoryName = {
      photos: 'Photos',
      illustrations: 'Illustrations',
      '3d': '3D Renders'
    }[category]
    
    title = query 
      ? `${categoryName} - Search results for "${query}"`
      : `Search ${categoryName}`
    
    description = query
      ? `Find AI-generated ${categoryName.toLowerCase()} related to "${query}".`
      : `Search and discover AI-generated ${categoryName.toLowerCase()}.`
  }

  const url = `${baseUrl}/search`

  return {
    title,
    description,
    keywords: [
      'search',
      'AI art',
      'find art',
      'discover',
      ...(query ? [query] : []),
      ...(category ? [category] : []),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | ${siteName}`,
      description,
      siteName,
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${siteName}`,
      description,
    },
    robots: {
      index: !query, // Don't index search result pages with queries
      follow: true,
    },
  }
}

// Generate JSON-LD structured data for posts
export function generatePostJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${baseUrl}/posts/${post.id}`,
    name: post.title,
    description: post.description,
    url: `${baseUrl}/posts/${post.id}`,
    contentUrl: post.imageUrl,
    thumbnailUrl: post.thumbnailUrl || post.imageUrl,
    uploadDate: post.uploadDate,
    dateCreated: post.uploadDate,
    datePublished: post.uploadDate,
    creator: {
      '@type': 'Person',
      name: post.creator.name,
      image: post.creator.profilePicture,
      url: `${baseUrl}/creators/${post.creator.id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
    keywords: post.tags.join(', '),
    genre: post.category,
    copyrightHolder: {
      '@type': 'Person',
      name: post.creator.name,
    },
    license: post.license.type === 'free' 
      ? 'https://creativecommons.org/licenses/by/4.0/'
      : `${baseUrl}/licenses/${post.license.type}`,
    isAccessibleForFree: post.license.type === 'free',
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: post.stats.views,
      },
      {
        '@type': 'InteractionCounter', 
        interactionType: 'https://schema.org/DownloadAction',
        userInteractionCount: post.stats.downloads,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction', 
        userInteractionCount: post.stats.favorites,
      },
    ],
  }
}

// Generate JSON-LD structured data for the website
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: siteName,
    description: defaultDescription,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
  }
}

// Generate JSON-LD for organization
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    description: defaultDescription,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/plotgallery',
      'https://github.com/plotgallery',
    ],
  }
}