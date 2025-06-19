-- Clean up admin_users table to ensure no duplicates
DELETE FROM admin_users;

-- Insert only one admin user
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  'admin123',
  'admin', 
  'System Administrator',
  true
);

-- Verify we have exactly one admin user
SELECT id, username, email, role, full_name, is_active, created_at 
FROM admin_users 
WHERE username = 'admin';

-- Check total count
SELECT COUNT(*) as total_admin_users FROM admin_users;
