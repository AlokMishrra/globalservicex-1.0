-- First, let's see what's currently in the admin_users table
SELECT 'Current admin_users table contents:' as info;
SELECT id, username, email, password_hash, role, full_name, is_active, created_at 
FROM admin_users;

-- Check if the table exists and has the right structure
SELECT 'Table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- Clean up and recreate admin user
DELETE FROM admin_users WHERE username = 'admin';

-- Insert admin user with explicit values
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  'admin123',
  'admin', 
  'System Administrator',
  true
);

-- Verify the insert worked
SELECT 'After insert:' as info;
SELECT id, username, email, password_hash, role, full_name, is_active 
FROM admin_users 
WHERE username = 'admin';

-- Test the exact query that the app will use
SELECT 'Testing app query:' as info;
SELECT id, username, email, password_hash, role, full_name, is_active, created_at, updated_at
FROM admin_users 
WHERE username = 'admin' AND is_active = true;
