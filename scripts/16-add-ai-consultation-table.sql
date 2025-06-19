-- Create AI consultation table to store user consultations
CREATE TABLE IF NOT EXISTS ai_consultations (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  target_audience TEXT,
  goals TEXT,
  budget VARCHAR(100),
  timeline VARCHAR(100),
  current_website VARCHAR(500),
  competitors TEXT,
  special_requirements TEXT,
  preferred_colors VARCHAR(255),
  design_style VARCHAR(100),
  recommendations JSONB,
  demo_website JSONB,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_consultations_status ON ai_consultations(status);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_created_at ON ai_consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_industry ON ai_consultations(industry);

-- Add AI consultation data to existing contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS consultation_id INTEGER REFERENCES ai_consultations(id);

-- Insert sample AI consultation data
INSERT INTO ai_consultations (
  business_name, 
  industry, 
  business_type, 
  target_audience, 
  goals, 
  budget, 
  design_style,
  recommendations,
  demo_website,
  status
) VALUES (
  'TechStart Solutions',
  'Technology',
  'Startup',
  'Small business owners and entrepreneurs',
  'Increase online presence and generate more leads through digital marketing',
  '₹50,000 - ₹1,00,000',
  'Modern & Minimalist',
  '[{"category": "Web Development", "title": "Custom Business Website", "priority": "high"}]'::jsonb,
  '{"name": "TechStart Solutions", "design": "Modern & Minimalist", "colors": ["#3B82F6", "#1E40AF"]}'::jsonb,
  'completed'
);

-- Verify the table was created successfully
SELECT 'AI Consultations Table Created Successfully!' as message;
SELECT COUNT(*) as total_consultations FROM ai_consultations;
