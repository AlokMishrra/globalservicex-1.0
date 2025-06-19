-- Create users table for admin panel access
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'editor', -- 'admin', 'editor'
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  is_active BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: globalservicex2024)
INSERT INTO admin_users (username, email, password_hash, role, full_name) 
VALUES (
  'admin', 
  'admin@globalservicex.com', 
  '$2b$10$rQZ9qJ8YvZ5K5K5K5K5K5O', -- This would be properly hashed in real implementation
  'admin', 
  'System Administrator'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample editor user
INSERT INTO admin_users (username, email, password_hash, role, full_name) 
VALUES (
  'editor', 
  'editor@globalservicex.com', 
  '$2b$10$rQZ9qJ8YvZ5K5K5K5K5K5O', -- This would be properly hashed in real implementation
  'editor', 
  'Content Editor'
) ON CONFLICT (username) DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_homepage ON announcements(show_on_homepage);
