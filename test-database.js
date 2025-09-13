// Simple test script to verify database connection and form submission
const { createClient } = require('@supabase/supabase-js')

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseConnection() {
  console.log('Testing database connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('form_submissions')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (err) {
    console.error('Database connection error:', err)
    return false
  }
}

async function testFormSubmission() {
  console.log('Testing form submission...')
  
  try {
    const testData = {
      form_id: 'test-form-123',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'This is a test submission'
      },
      user_email: 'test@example.com',
      user_name: 'Test User',
      user_phone: '1234567890',
      application_type: 'test',
      status: 'new',
      created_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([testData])
      .select()
      .single()
    
    if (error) {
      console.error('Form submission failed:', error)
      return false
    }
    
    console.log('✅ Form submission successful:', data)
    return true
  } catch (err) {
    console.error('Form submission error:', err)
    return false
  }
}

async function runTests() {
  console.log('Starting database tests...\n')
  
  const connectionTest = await testDatabaseConnection()
  if (!connectionTest) {
    console.log('❌ Database connection failed. Please check your Supabase credentials.')
    return
  }
  
  const submissionTest = await testFormSubmission()
  if (!submissionTest) {
    console.log('❌ Form submission failed. Please check your database schema.')
    return
  }
  
  console.log('\n✅ All tests passed! Database is working correctly.')
}

// Run the tests
runTests().catch(console.error)

