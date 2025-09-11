-- Insert Categories
INSERT INTO categories (id, name, description, icon) VALUES 
('photos', 'Photos', 'AI-generated realistic photos and portraits', 'camera'),
('illustrations', 'Illustrations', 'Digital artwork and creative illustrations', 'palette'),
('3d', '3D', '3D renders and models created with AI', 'box')
ON CONFLICT (id) DO NOTHING;

-- Insert Users
INSERT INTO users (id, name, email, profile_picture, bio, verified) VALUES 
('user1', 'Alex Chen', 'alex@example.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Digital artist specializing in AI-generated portraits', true),
('user2', 'Maria Rodriguez', 'maria@example.com', 'https://images.unsplash.com/photo-1494790108755-2616b1e21a1e?w=150&h=150&fit=crop&crop=face', '3D artist and Midjourney enthusiast', false),
('user3', 'David Kim', 'david@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Illustration artist exploring AI creativity', true),
('user4', 'Emma Wilson', 'emma@example.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Photographer experimenting with AI enhancement', false),
('user5', 'James Park', 'james@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Concept artist and DALL-E explorer', true);

-- Insert Tags
INSERT INTO tags (name, category, popularity, color) VALUES 
('portrait', 'photos', 95, '#FF6B6B'),
('landscape', 'photos', 88, '#4ECDC4'),
('cyberpunk', 'illustrations', 92, '#45B7D1'),
('fantasy', 'illustrations', 87, '#96CEB4'),
('abstract', 'illustrations', 75, '#FFEAA7'),
('architecture', '3d', 83, '#DDA0DD'),
('character', '3d', 79, '#98D8C8'),
('sci-fi', null, 91, '#6C5CE7'),
('nature', 'photos', 85, '#A8E6CF'),
('futuristic', null, 78, '#FFB8B8');

-- Insert Posts
INSERT INTO posts (title, description, image_url, thumbnail_url, category, creator_id, ai_tool, featured) VALUES 
(
  'Neon Dreams Portrait',
  'A stunning cyberpunk portrait with vibrant neon lighting and futuristic aesthetics. Generated using advanced AI techniques.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  'photos',
  'user1',
  'Midjourney',
  true
),
(
  'Ethereal Forest Temple',
  'A mystical 3D rendered temple hidden deep in an enchanted forest, complete with magical lighting and atmospheric fog.',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
  '3d',
  'user2',
  'Blender AI',
  false
),
(
  'Abstract Cosmic Dance',
  'Flowing abstract forms in cosmic colors, representing the dance of celestial bodies through space and time.',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop',
  'illustrations',
  'user3',
  'DALL-E 3',
  true
),
(
  'Mountain Vista Sunrise',
  'A breathtaking landscape featuring snow-capped mountains bathed in golden sunrise light with dramatic clouds.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  'photos',
  'user4',
  'Stable Diffusion',
  false
),
(
  'Futuristic City Concept',
  'A detailed concept art of a futuristic metropolis with flying vehicles, towering skyscrapers, and advanced technology.',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
  'illustrations',
  'user5',
  'Midjourney',
  true
);

-- Get post IDs and tag IDs for linking (we'll use the first few for demonstration)
-- Link Post 1 (Neon Dreams) with portrait, cyberpunk, sci-fi tags
INSERT INTO post_tags (post_id, tag_id) 
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.title = 'Neon Dreams Portrait' 
AND t.name IN ('portrait', 'cyberpunk', 'sci-fi');

-- Link Post 2 (Forest Temple) with architecture, fantasy, nature tags  
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.title = 'Ethereal Forest Temple' 
AND t.name IN ('architecture', 'fantasy', 'nature');

-- Link Post 3 (Abstract Cosmic) with abstract, futuristic tags
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.title = 'Abstract Cosmic Dance' 
AND t.name IN ('abstract', 'futuristic');

-- Link Post 4 (Mountain Vista) with landscape, nature tags
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.title = 'Mountain Vista Sunrise' 
AND t.name IN ('landscape', 'nature');

-- Link Post 5 (Futuristic City) with architecture, sci-fi, futuristic tags
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.title = 'Futuristic City Concept' 
AND t.name IN ('architecture', 'sci-fi', 'futuristic');