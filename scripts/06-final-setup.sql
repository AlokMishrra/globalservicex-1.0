-- Ensure all tables exist and are properly set up
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

CREATE TABLE IF NOT EXISTS announcements (
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

-- Clear existing admin users and insert fresh ones
DELETE FROM admin_users;

-- Insert admin user with correct credentials
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

-- Add sample blog posts if they don't exist
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
Breaking down large frontend applications into smaller, manageable pieces allows teams to work independently and deploy features faster.

6. Enhanced Security Measures
With increasing cyber threats, implementing robust security measures like Content Security Policy (CSP) and Subresource Integrity (SRI) is crucial.

7. Voice User Interfaces
Voice search and voice commands are becoming more prevalent, requiring websites to optimize for voice interactions.

8. Motion UI and Animations
Subtle animations and micro-interactions enhance user experience and make websites more engaging.

9. Dark Mode Design
Dark mode is no longer optional. Users expect this feature for better accessibility and reduced eye strain.

10. Sustainable Web Development
Green coding practices and optimizing for energy efficiency are becoming important considerations in web development.',
  'Web Development',
  'Admin',
  'published',
  1250
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (title, slug, excerpt, content, category, author, status, views) VALUES
(
  'How to Generate Quality Leads for Your Business',
  'how-to-generate-quality-leads-business',
  'Learn proven strategies to generate high-quality leads that convert into customers.',
  'Lead generation is the lifeblood of any business. In this comprehensive guide, we will explore proven strategies and techniques to generate high-quality leads that actually convert into paying customers.

Understanding Lead Quality vs Quantity
Not all leads are created equal. A high-quality lead is someone who has a genuine interest in your product or service and has the potential to become a paying customer. Focus on quality over quantity for better ROI.

1. Content Marketing Strategy
Create valuable, relevant content that addresses your target audience''s pain points. Blog posts, whitepapers, ebooks, and webinars can attract potential customers and establish your authority in the industry.

2. Search Engine Optimization (SEO)
Optimize your website and content for search engines to attract organic traffic. Target long-tail keywords that your potential customers are searching for.

3. Social Media Marketing
Use social media platforms to engage with your audience, share valuable content, and build relationships. LinkedIn is particularly effective for B2B lead generation.

4. Email Marketing
Build an email list and nurture leads through targeted email campaigns. Personalized emails have higher open rates and conversion rates.

5. Pay-Per-Click (PPC) Advertising
Use Google Ads and social media advertising to target specific demographics and interests. PPC can provide immediate results when done correctly.

6. Landing Page Optimization
Create dedicated landing pages for your campaigns with clear calls-to-action. A/B test different elements to improve conversion rates.

7. Lead Magnets
Offer valuable resources like ebooks, templates, or free trials in exchange for contact information. This helps build your email list with interested prospects.

8. Referral Programs
Encourage satisfied customers to refer others to your business. Word-of-mouth marketing is highly effective and cost-efficient.

9. Networking and Events
Attend industry events, conferences, and networking meetings to connect with potential customers face-to-face.

10. Marketing Automation
Use automation tools to nurture leads through the sales funnel with personalized content and timely follow-ups.

Measuring Success
Track key metrics like conversion rates, cost per lead, and customer lifetime value to measure the effectiveness of your lead generation efforts.',
  'Lead Generation',
  'Admin',
  'published',
  890
) ON CONFLICT (slug) DO NOTHING;

-- Add sample announcement
INSERT INTO announcements (title, content, type, is_active, show_on_homepage, created_by) VALUES
(
  'Welcome to Global Servicex!',
  'We are excited to launch our new website with enhanced features and better user experience. Contact us today for a free consultation!',
  'success',
  true,
  true,
  1
) ON CONFLICT DO NOTHING;

-- Verify everything is set up correctly
SELECT 'Admin Users:' as table_name, count(*) as count FROM admin_users
UNION ALL
SELECT 'Blog Posts:', count(*) FROM blog_posts
UNION ALL
SELECT 'Announcements:', count(*) FROM announcements;
