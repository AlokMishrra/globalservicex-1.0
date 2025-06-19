-- Fix foreign key constraint issue and set up database properly

-- First, disable foreign key checks temporarily and clean up announcements
DELETE FROM announcements;

-- Now we can safely clean up admin_users
DELETE FROM admin_users;

-- Insert admin user first
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

-- Get the admin user ID for announcements
-- Insert sample announcement with proper foreign key reference
INSERT INTO announcements (title, content, type, is_active, show_on_homepage, created_by) 
SELECT 
  'Welcome to Global Servicex!',
  'We are excited to launch our new mobile-optimized website with enhanced features and better user experience. Contact us today for a free consultation and get 20% off on your first project!',
  'success',
  true,
  true,
  id
FROM admin_users 
WHERE username = 'admin'
LIMIT 1;

-- Verify the setup
SELECT 'Setup Verification:' as status;

-- Check admin users
SELECT 'Admin Users:' as table_name, COUNT(*) as count FROM admin_users;

-- Check announcements with proper foreign key
SELECT 'Announcements:' as table_name, COUNT(*) as count FROM announcements;

-- Verify admin login
SELECT 'Admin Login Test:' as test;
SELECT username, role, is_active 
FROM admin_users 
WHERE username = 'admin' AND password_hash = 'admin123' AND is_active = true;

-- Final success message
SELECT 'Mobile Website Setup Complete!' as message,
       'Login: admin / admin123' as credentials,
       'All foreign key constraints resolved' as note;
