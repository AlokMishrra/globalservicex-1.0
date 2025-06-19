-- First, ensure the admin_users table exists
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

-- Delete any existing admin users to avoid conflicts
DELETE FROM admin_users WHERE username = 'admin';

-- Insert the admin user with the credentials requested
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  'admin123',
  'admin', 
  'System Administrator',
  true
);

-- Insert a sample editor user as well
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) 
VALUES (
  'editor', 
  'editor@globalservicex.com', 
  'editor123',
  'editor', 
  'Content Editor',
  true
) ON CONFLICT (username) DO NOTHING;

-- Verify the users were created successfully
SELECT id, username, email, role, full_name, is_active, created_at 
FROM admin_users 
ORDER BY created_at;
