-- Check current state of admin_users table
SELECT 'Current admin_users table:' as status;
SELECT * FROM admin_users;

-- If no admin user exists, create one
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
SELECT 'admin', 'admin@globalservicex.com', 'admin123', 'admin', 'System Administrator', true
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

-- Final verification
SELECT 'Final verification - Admin user exists:' as status;
SELECT id, username, email, password_hash, role, full_name, is_active, created_at 
FROM admin_users 
WHERE username = 'admin' AND is_active = true;

-- Count total users
SELECT 'Total users in system:' as status, COUNT(*) as count FROM admin_users;
