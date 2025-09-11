const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function seedData() {
  console.log('🌱 Starting database seeding...')

  try {
    // Insert Categories
    console.log('📁 Inserting categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        { id: 'photos', name: 'Photos', description: 'AI-generated realistic photos and portraits', icon: 'camera' },
        { id: 'illustrations', name: 'Illustrations', description: 'Digital artwork and creative illustrations', icon: 'palette' },
        { id: '3d', name: '3D', description: '3D renders and models created with AI', icon: 'box' }
      ])
    
    if (categoriesError) throw categoriesError
    console.log('✅ Categories inserted')

    // Insert Users
    console.log('👥 Inserting users...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          name: 'Alex Chen',
          email: 'alex@example.com',
          profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Digital artist specializing in AI-generated portraits',
          verified: true
        },
        {
          name: 'Maria Rodriguez',
          email: 'maria@example.com',
          profile_picture: 'https://images.unsplash.com/photo-1494790108755-2616b1e21a1e?w=150&h=150&fit=crop&crop=face',
          bio: '3D artist and Midjourney enthusiast',
          verified: false
        },
        {
          name: 'David Kim',
          email: 'david@example.com',
          profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'Illustration artist exploring AI creativity',
          verified: true
        },
        {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          profile_picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          bio: 'Photographer experimenting with AI enhancement',
          verified: false
        },
        {
          name: 'James Park',
          email: 'james@example.com',
          profile_picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          bio: 'Concept artist and DALL-E explorer',
          verified: true
        }
      ])
      .select()
    
    if (usersError) throw usersError
    console.log('✅ Users inserted')

    // Insert Tags
    console.log('🏷️ Inserting tags...')
    const { data: tagsData, error: tagsError } = await supabase
      .from('tags')
      .upsert([
        { name: 'portrait', category: 'photos', popularity: 95, color: '#FF6B6B' },
        { name: 'landscape', category: 'photos', popularity: 88, color: '#4ECDC4' },
        { name: 'cyberpunk', category: 'illustrations', popularity: 92, color: '#45B7D1' },
        { name: 'fantasy', category: 'illustrations', popularity: 87, color: '#96CEB4' },
        { name: 'abstract', category: 'illustrations', popularity: 75, color: '#FFEAA7' },
        { name: 'architecture', category: '3d', popularity: 83, color: '#DDA0DD' },
        { name: 'character', category: '3d', popularity: 79, color: '#98D8C8' },
        { name: 'sci-fi', category: null, popularity: 91, color: '#6C5CE7' },
        { name: 'nature', category: 'photos', popularity: 85, color: '#A8E6CF' },
        { name: 'futuristic', category: null, popularity: 78, color: '#FFB8B8' }
      ])
      .select()
    
    if (tagsError) throw tagsError
    console.log('✅ Tags inserted')

    // Insert Posts using actual user IDs
    console.log('📸 Inserting posts...')
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .insert([
        {
          title: 'Neon Dreams Portrait',
          description: 'A stunning cyberpunk portrait with vibrant neon lighting and futuristic aesthetics. Generated using advanced AI techniques.',
          image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
          thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          category: 'photos',
          creator_id: users[0].id,
          ai_tool: 'Midjourney',
          featured: true,
          views: 1247,
          downloads: 89,
          favorites: 156
        },
        {
          title: 'Ethereal Forest Temple',
          description: 'A mystical 3D rendered temple hidden deep in an enchanted forest, complete with magical lighting and atmospheric fog.',
          image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop',
          thumbnail_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
          category: '3d',
          creator_id: users[1].id,
          ai_tool: 'Blender AI',
          featured: false,
          views: 892,
          downloads: 67,
          favorites: 123
        },
        {
          title: 'Abstract Cosmic Dance',
          description: 'Flowing abstract forms in cosmic colors, representing the dance of celestial bodies through space and time.',
          image_url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop',
          thumbnail_url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop',
          category: 'illustrations',
          creator_id: users[2].id,
          ai_tool: 'DALL-E 3',
          featured: true,
          views: 2156,
          downloads: 234,
          favorites: 321
        },
        {
          title: 'Mountain Vista Sunrise',
          description: 'A breathtaking landscape featuring snow-capped mountains bathed in golden sunrise light with dramatic clouds.',
          image_url: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=800&h=1200&fit=crop',
          thumbnail_url: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=400&h=600&fit=crop',
          category: 'photos',
          creator_id: users[3].id,
          ai_tool: 'Stable Diffusion',
          featured: false,
          views: 1756,
          downloads: 198,
          favorites: 289
        },
        {
          title: 'Futuristic City Concept',
          description: 'A detailed concept art of a futuristic metropolis with flying vehicles, towering skyscrapers, and advanced technology.',
          image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1200&fit=crop',
          thumbnail_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
          category: 'illustrations',
          creator_id: users[4].id,
          ai_tool: 'Midjourney',
          featured: true,
          views: 3421,
          downloads: 445,
          favorites: 567
        }
      ])
      .select()
    
    if (postsError) throw postsError
    console.log('✅ Posts inserted')

    // Create post-tag relationships
    console.log('🔗 Linking posts with tags...')
    
    // Get all tags for reference
    const { data: allTags } = await supabase.from('tags').select('*')
    const tagMap = {}
    allTags.forEach(tag => tagMap[tag.name] = tag.id)

    const postTagRelations = [
      // Post 1: Neon Dreams - portrait, cyberpunk, sci-fi
      { post_title: 'Neon Dreams Portrait', tags: ['portrait', 'cyberpunk', 'sci-fi'] },
      // Post 2: Forest Temple - architecture, fantasy, nature
      { post_title: 'Ethereal Forest Temple', tags: ['architecture', 'fantasy', 'nature'] },
      // Post 3: Abstract Cosmic - abstract, futuristic
      { post_title: 'Abstract Cosmic Dance', tags: ['abstract', 'futuristic'] },
      // Post 4: Mountain Vista - landscape, nature
      { post_title: 'Mountain Vista Sunrise', tags: ['landscape', 'nature'] },
      // Post 5: Futuristic City - architecture, sci-fi, futuristic
      { post_title: 'Futuristic City Concept', tags: ['architecture', 'sci-fi', 'futuristic'] }
    ]

    for (const relation of postTagRelations) {
      const post = postsData.find(p => p.title === relation.post_title)
      if (post) {
        const postTagInserts = relation.tags.map(tagName => ({
          post_id: post.id,
          tag_id: tagMap[tagName]
        })).filter(item => item.tag_id) // Only add if tag exists

        const { error: linkError } = await supabase
          .from('post_tags')
          .upsert(postTagInserts)

        if (linkError) console.error(`Error linking tags for ${relation.post_title}:`, linkError)
        else console.log(`✅ Linked tags for ${relation.post_title}`)
      }
    }

    console.log('🎉 Database seeding completed successfully!')

    // Verify the data
    const { data: postCount } = await supabase.from('posts').select('*', { count: 'exact' })
    console.log(`📊 Total posts in database: ${postCount.length}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding
seedData()