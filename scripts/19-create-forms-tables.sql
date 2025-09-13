-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id SERIAL PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_published ON forms(is_published);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);

-- Insert some sample forms
INSERT INTO forms (title, description, fields, is_published) VALUES 
(
  'Job Application Form',
  'Standard job application form for all positions',
  '[
    {
      "id": "field_name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true
    },
    {
      "id": "field_email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "required": true
    },
    {
      "id": "field_phone",
      "type": "tel",
      "label": "Phone Number",
      "placeholder": "Enter your phone number",
      "required": true
    },
    {
      "id": "field_experience",
      "type": "select",
      "label": "Years of Experience",
      "required": true,
      "options": ["0-1 years", "1-3 years", "3-5 years", "5+ years"]
    },
    {
      "id": "field_cover_letter",
      "type": "textarea",
      "label": "Cover Letter",
      "placeholder": "Tell us why you want to join our team...",
      "required": true
    },
    {
      "id": "field_resume",
      "type": "file",
      "label": "Resume/CV",
      "required": true
    }
  ]'::jsonb,
  true
),
(
  'Internship Application',
  'Application form specifically for internship positions',
  '[
    {
      "id": "field_name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true
    },
    {
      "id": "field_email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "required": true
    },
    {
      "id": "field_university",
      "type": "text",
      "label": "University/College",
      "placeholder": "Enter your university name",
      "required": true
    },
    {
      "id": "field_major",
      "type": "text",
      "label": "Major/Field of Study",
      "placeholder": "Enter your major",
      "required": true
    },
    {
      "id": "field_graduation",
      "type": "date",
      "label": "Expected Graduation Date",
      "required": true
    },
    {
      "id": "field_skills",
      "type": "textarea",
      "label": "Relevant Skills",
      "placeholder": "List your technical and soft skills...",
      "required": true
    },
    {
      "id": "field_availability",
      "type": "select",
      "label": "Availability",
      "required": true,
      "options": ["Full-time (40 hours/week)", "Part-time (20 hours/week)", "Flexible"]
    }
  ]'::jsonb,
  true
);

-- Grant necessary permissions
GRANT ALL ON forms TO authenticated;
GRANT ALL ON form_submissions TO authenticated;
GRANT USAGE ON SEQUENCE form_submissions_id_seq TO authenticated;

