-- Update form_submissions table to add user tracking columns
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS application_type VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_user_email ON form_submissions(user_email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_application_type ON form_submissions(application_type);

-- Update existing form_submissions to have default values
UPDATE form_submissions 
SET 
  status = 'new',
  application_type = 'general'
WHERE status IS NULL OR application_type IS NULL;
