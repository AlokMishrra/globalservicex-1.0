-- Create users table for admin panel access
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'editor', -- 'admin', 'editor'
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  is_active BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, role, full_name) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  'admin123', -- In production, this should be properly hashed
  'admin', 
  'System Administrator'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample editor user (password: editor123)
INSERT INTO admin_users (username, email, password_hash, role, full_name) 
VALUES (
  'editor', 
  'editor@globalservicex.com', 
  'editor123', -- In production, this should be properly hashed
  'editor', 
  'Content Editor'
) ON CONFLICT (username) DO NOTHING;

-- Add some sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, status) VALUES
(
  '10 Essential Web Development Trends for 2024',
  '10-essential-web-development-trends-2024',
  'Discover the latest web development trends that will shape the digital landscape in 2024.',
  'Web development is constantly evolving, and 2024 brings exciting new trends that developers and businesses need to know about. From AI integration to advanced frameworks, here are the top 10 trends shaping the future of web development...',
  'Web Development',
  'Admin',
  'published'
),
(
  'How to Generate Quality Leads for Your Business',
  'how-to-generate-quality-leads-business',
  'Learn proven strategies to generate high-quality leads that convert into customers.',
  'Lead generation is the lifeblood of any business. In this comprehensive guide, we will explore proven strategies and techniques to generate high-quality leads that actually convert into paying customers...',
  'Lead Generation',
  'Admin',
  'published'
),
(
  'The Complete Guide to Digital Marketing in India',
  'complete-guide-digital-marketing-india',
  'A comprehensive guide to digital marketing strategies that work in the Indian market.',
  'Digital marketing in India requires a unique approach that considers local preferences, languages, and cultural nuances. This complete guide covers everything you need to know...',
  'Digital Marketing',
  'Admin',
  'published'
);

-- Add sample announcement
INSERT INTO announcements (title, content, type, is_active, show_on_homepage, created_by) VALUES
(
  'New Year Special Offer - 30% Off All Services!',
  'Celebrate the new year with our special discount offer. Get 30% off on all our digital services including web development, app development, and digital marketing. Limited time offer!',
  'success',
  true,
  true,
  1
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_homepage ON announcements(show_on_homepage);
