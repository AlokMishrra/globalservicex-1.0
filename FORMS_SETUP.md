# Forms Database Setup

## Issue: Form Saving Error

The form saving error occurs because the required database tables don't exist yet.

## Solution: Set up the database tables

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `scripts/manual-setup-forms.sql`
4. Click "Run" to execute the script
5. Refresh your admin panel - the forms should now work!

### Option 2: Using Command Line (if psql is available)

```bash
psql -h your-supabase-host -p 5432 -d postgres -U postgres -f scripts/manual-setup-forms.sql
```

## What the script does:

1. **Creates `forms` table** - Stores form definitions with JSONB fields
2. **Creates `form_submissions` table** - Stores form submission data
3. **Creates indexes** - For better query performance
4. **Sets permissions** - Allows authenticated users to access tables
5. **Inserts sample forms** - Two pre-built forms for job applications and internships

## After setup:

- ✅ Form builder will work in admin panel
- ✅ Forms can be created, edited, and published
- ✅ Form submissions will be tracked
- ✅ Career page will have working application forms

## Troubleshooting:

If you still see errors after running the script:
1. Check that the tables exist in your Supabase dashboard
2. Verify the RLS (Row Level Security) policies allow access
3. Make sure your Supabase credentials are correct in `.env.local`

## Features Available After Setup:

- 🏗️ **Drag & Drop Form Builder** - Create custom forms with various field types
- 📋 **Form Management** - Edit, duplicate, delete, and publish forms
- 📊 **Form Submissions** - Track and manage form responses
- 🎯 **Career Integration** - Job applications use published forms
- 📱 **Mobile Responsive** - Works on all device sizes

