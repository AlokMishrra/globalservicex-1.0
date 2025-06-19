-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'editor',
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(255),
  website VARCHAR(255),
  services TEXT[] NOT NULL,
  budget VARCHAR(100),
  timeline VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL DEFAULT 'Admin',
  featured_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_active BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT false,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing admin users to avoid conflicts
DELETE FROM admin_users WHERE username IN ('admin', 'editor');

-- Insert admin user with exact credentials
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  'admin123',
  'admin', 
  'System Administrator',
  true
);

-- Insert editor user
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'editor', 
  'editor@globalservicex.com', 
  'editor123',
  'editor', 
  'Content Editor',
  true
);

-- Insert sample blog posts (only if they don't exist)
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, status, views) 
SELECT * FROM (VALUES 
  ('10 Essential Web Development Trends for 2024', '10-essential-web-development-trends-2024', 'Discover the latest web development trends that will shape the digital landscape in 2024.', 'Web development is constantly evolving, and 2024 brings exciting new trends that developers and businesses need to know about. From AI integration to advanced frameworks, here are the top 10 trends shaping the future of web development.', 'Web Development', 'Admin', 'published', 1250),
  ('How to Generate Quality Leads for Your Business', 'how-to-generate-quality-leads-business', 'Learn proven strategies to generate high-quality leads that convert into customers.', 'Lead generation is the lifeblood of any business. In this comprehensive guide, we will explore proven strategies and techniques to generate high-quality leads that actually convert into paying customers.', 'Lead Generation', 'Admin', 'published', 890),
  ('The Complete Guide to Digital Marketing in India', 'complete-guide-digital-marketing-india', 'A comprehensive guide to digital marketing strategies that work in the Indian market.', 'Digital marketing in India requires a unique approach that considers local preferences, languages, and cultural nuances. This complete guide covers everything you need to know.', 'Digital Marketing', 'Admin', 'published', 1100)
) AS new_posts(title, slug, excerpt, content, category, author, status, views)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = new_posts.slug);

-- Insert sample contacts
INSERT INTO contacts (name, email, phone, company, services, budget, message, status) 
SELECT * FROM (VALUES 
  ('Rajesh Kumar', 'rajesh@techstart.com', '+91 98765 43210', 'TechStart Solutions', ARRAY['Web Development', 'Digital Marketing'], '₹50,000 - ₹1,00,000', 'Looking for a complete website redesign and SEO optimization.', 'new'),
  ('Priya Sharma', 'priya@fashionhub.com', '+91 87654 32109', 'Fashion Hub', ARRAY['App Development', 'Branding'], '₹1,00,000 - ₹2,50,000', 'Need a mobile app for our fashion e-commerce business.', 'contacted'),
  ('Amit Patel', 'amit@digitalinnovations.com', '+91 76543 21098', 'Digital Innovations', ARRAY['Growth Counseling'], '₹25,000 - ₹50,000', 'Looking for growth counseling strategies.', 'new')
) AS new_contacts(name, email, phone, company, services, budget, message, status)
WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE email = new_contacts.email);

-- Insert sample announcement
INSERT INTO announcements (title, content, type, is_active, show_on_homepage, created_by) 
SELECT 'Welcome to Global Servicex!', 'We are excited to launch our new website with enhanced features. Contact us today for a free consultation!', 'success', true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'Welcome to Global Servicex!');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Final verification and show results
SELECT 'Database Setup Complete!' as message;

SELECT 'Admin Users Created:' as info;
SELECT id, username, password_hash as password, role, full_name, is_active 
FROM admin_users 
ORDER BY id;

SELECT 'Blog Posts Created:' as info;
SELECT COUNT(*) as total_posts FROM blog_posts;

SELECT 'Contacts Created:' as info;
SELECT COUNT(*) as total_contacts FROM contacts;

SELECT 'Announcements Created:' as info;
SELECT COUNT(*) as total_announcements FROM announcements;

-- Test the exact login query
SELECT 'Login Test for admin user:' as test;
SELECT id, username, role, full_name, is_active 
FROM admin_users 
WHERE username = 'admin' AND is_active = true;
