-- Delete existing admin users to avoid conflicts
DELETE FROM admin_users WHERE username IN ('admin', 'editor');

-- Insert admin user with correct credentials
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  'admin123', -- Simple password for demo (in production, this should be properly hashed)
  'admin', 
  'System Administrator',
  true
);

-- Verify the admin user was created
SELECT username, email, role, full_name, is_active FROM admin_users WHERE username = 'admin';
