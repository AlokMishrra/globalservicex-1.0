-- Create careers table for job/internship applications
CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'team' or 'internship'
  team VARCHAR(100),
  why TEXT,
  q1 TEXT,
  q2 TEXT,
  status VARCHAR(50) DEFAULT 'new', -- e.g., 'new', 'reviewed', 'accepted', 'rejected'
  resume TEXT, -- base64 or file URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 