const { createClient } = require('@supabase/supabase-js')

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ixqjqjqjqjqjqjqjqjqj.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupFormsTables() {
  console.log('Setting up forms tables...')
  
  try {
    // Create forms table
    console.log('Creating forms table...')
    const { error: formsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS forms (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          fields JSONB NOT NULL DEFAULT '[]',
          is_published BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (formsError) {
      console.error('Error creating forms table:', formsError)
      return false
    }
    
    // Create form_submissions table
    console.log('Creating form_submissions table...')
    const { error: submissionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS form_submissions (
          id SERIAL PRIMARY KEY,
          form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
          data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (submissionsError) {
      console.error('Error creating form_submissions table:', submissionsError)
      return false
    }
    
    // Create indexes
    console.log('Creating indexes...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_forms_published ON forms(is_published);
        CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
        CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
      `
    })
    
    if (indexError) {
      console.error('Error creating indexes:', indexError)
      return false
    }
    
    // Insert sample forms
    console.log('Inserting sample forms...')
    const { error: sampleError } = await supabase
      .from('forms')
      .insert([
        {
          title: 'Job Application Form',
          description: 'Standard job application form for all positions',
          fields: [
            {
              id: 'field_name',
              type: 'text',
              label: 'Full Name',
              placeholder: 'Enter your full name',
              required: true
            },
            {
              id: 'field_email',
              type: 'email',
              label: 'Email Address',
              placeholder: 'Enter your email',
              required: true
            },
            {
              id: 'field_phone',
              type: 'tel',
              label: 'Phone Number',
              placeholder: 'Enter your phone number',
              required: true
            },
            {
              id: 'field_experience',
              type: 'select',
              label: 'Years of Experience',
              required: true,
              options: ['0-1 years', '1-3 years', '3-5 years', '5+ years']
            },
            {
              id: 'field_cover_letter',
              type: 'textarea',
              label: 'Cover Letter',
              placeholder: 'Tell us why you want to join our team...',
              required: true
            },
            {
              id: 'field_resume',
              type: 'file',
              label: 'Resume/CV',
              required: true
            }
          ],
          is_published: true
        }
      ])
    
    if (sampleError) {
      console.error('Error inserting sample forms:', sampleError)
      return false
    }
    
    console.log('✅ Forms tables setup completed successfully!')
    return true
    
  } catch (error) {
    console.error('Error setting up forms tables:', error)
    return false
  }
}

// Run the setup
setupFormsTables().then(success => {
  if (success) {
    console.log('🎉 Database setup completed!')
    process.exit(0)
  } else {
    console.log('❌ Database setup failed!')
    process.exit(1)
  }
})
