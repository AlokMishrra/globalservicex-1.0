-- Drop and recreate all tables to ensure clean setup
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table first (referenced by announcements)
CREATE TABLE admin_users (
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
CREATE TABLE contacts (
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
CREATE TABLE blog_posts (
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
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_active BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
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

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, status, views) VALUES
(
  '10 Essential Web Development Trends for 2024',
  '10-essential-web-development-trends-2024',
  'Discover the latest web development trends that will shape the digital landscape in 2024.',
  'Web development is constantly evolving, and 2024 brings exciting new trends that developers and businesses need to know about. From AI integration to advanced frameworks, here are the top 10 trends shaping the future of web development.

1. AI-Powered Development Tools
Artificial Intelligence is revolutionizing how we build websites. AI-powered code completion, automated testing, and intelligent debugging tools are becoming standard in modern development workflows.

2. Progressive Web Apps (PWAs)
PWAs continue to gain traction as they offer native app-like experiences through web browsers. They provide offline functionality, push notifications, and improved performance.

3. Serverless Architecture
Serverless computing allows developers to focus on code without managing infrastructure. This trend is growing as it offers scalability and cost-effectiveness.

4. WebAssembly (WASM)
WebAssembly enables high-performance applications in web browsers by allowing code written in languages like C++ and Rust to run at near-native speed.

5. Micro-Frontends
Breaking down large frontend applications into smaller, manageable pieces allows teams to work independently and deploy features faster.',
  'Web Development',
  'Admin',
  'published',
  1250
),
(
  'How to Generate Quality Leads for Your Business',
  'how-to-generate-quality-leads-business',
  'Learn proven strategies to generate high-quality leads that convert into customers.',
  'Lead generation is the lifeblood of any business. In this comprehensive guide, we will explore proven strategies and techniques to generate high-quality leads that actually convert into paying customers.

Understanding Lead Quality vs Quantity
Not all leads are created equal. A high-quality lead is someone who has a genuine interest in your product or service and has the potential to become a paying customer.

1. Content Marketing Strategy
Create valuable, relevant content that addresses your target audience pain points. Blog posts, whitepapers, ebooks, and webinars can attract potential customers.

2. Search Engine Optimization (SEO)
Optimize your website and content for search engines to attract organic traffic. Target long-tail keywords that your potential customers are searching for.

3. Social Media Marketing
Use social media platforms to engage with your audience, share valuable content, and build relationships. LinkedIn is particularly effective for B2B lead generation.',
  'Lead Generation',
  'Admin',
  'published',
  890
),
(
  'The Complete Guide to Digital Marketing in India',
  'complete-guide-digital-marketing-india',
  'A comprehensive guide to digital marketing strategies that work in the Indian market.',
  'Digital marketing in India requires a unique approach that considers local preferences, languages, and cultural nuances. This complete guide covers everything you need to know about succeeding in the Indian digital landscape.

Understanding the Indian Market
India has over 700 million internet users, making it one of the largest digital markets in the world. However, the market is diverse with different languages, cultures, and economic backgrounds.

Key Strategies for Success:
1. Localization is crucial
2. Mobile-first approach
3. Regional language content
4. Understanding local festivals and events
5. Building trust through testimonials and reviews',
  'Digital Marketing',
  'Admin',
  'published',
  1100
);

-- Insert sample contacts
INSERT INTO contacts (name, email, phone, company, services, budget, message, status) VALUES
(
  'Rajesh Kumar',
  'rajesh@techstart.com',
  '+91 98765 43210',
  'TechStart Solutions',
  ARRAY['Web Development', 'Digital Marketing'],
  '₹50,000 - ₹1,00,000',
  'Looking for a complete website redesign and SEO optimization for our tech startup.',
  'new'
),
(
  'Priya Sharma',
  'priya@fashionhub.com',
  '+91 87654 32109',
  'Fashion Hub',
  ARRAY['App Development', 'Branding'],
  '₹1,00,000 - ₹2,50,000',
  'Need a mobile app for our fashion e-commerce business with modern branding.',
  'contacted'
),
(
  'Amit Patel',
  'amit@digitalinnovations.com',
  '+91 76543 21098',
  'Digital Innovations',
  ARRAY['Growth Counseling', 'Lead Generation'],
  '₹25,000 - ₹50,000',
  'Looking for growth counseling and lead generation strategies for our B2B business.',
  'new'
);

-- Insert sample announcement
INSERT INTO announcements (title, content, type, is_active, show_on_homepage, created_by) VALUES
(
  'Welcome to Global Servicex!',
  'We are excited to launch our new website with enhanced features and better user experience. Contact us today for a free consultation and get 20% off on your first project!',
  'success',
  true,
  true,
  1
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_announcements_homepage ON announcements(show_on_homepage);

-- Final verification
SELECT 'Setup Complete! Summary:' as status;
SELECT 'Admin Users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'Announcements', COUNT(*) FROM announcements;

-- Show admin credentials
SELECT 'Admin Login Credentials:' as info;
SELECT username, password_hash as password, role, full_name 
FROM admin_users 
WHERE role = 'admin';
