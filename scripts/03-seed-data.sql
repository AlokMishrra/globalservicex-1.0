-- Add some sample contacts for testing
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

-- Update blog post views for realistic data
UPDATE blog_posts SET views = 1250 WHERE title = '10 Essential Web Development Trends for 2024';
UPDATE blog_posts SET views = 890 WHERE title = 'How to Generate Quality Leads for Your Business';
UPDATE blog_posts SET views = 1100 WHERE title = 'The Complete Guide to Digital Marketing in India';
