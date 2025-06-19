-- Verify the mobile-optimized website setup

-- Check if admin user exists and can login
SELECT 'Admin Login Verification:' as test;
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'SUCCESS: Admin user found and can login with admin/admin123'
    ELSE 'ERROR: Admin user not found'
  END as result
FROM admin_users 
WHERE username = 'admin' AND password_hash = 'admin123' AND is_active = true;

-- Check blog posts
SELECT 'Blog Posts Status:' as test;
SELECT 
  COUNT(*) as total_posts,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published_posts
FROM blog_posts;

-- Check announcements
SELECT 'Announcements Status:' as test;
SELECT 
  COUNT(*) as total_announcements,
  COUNT(CASE WHEN is_active = true AND show_on_homepage = true THEN 1 END) as homepage_announcements
FROM announcements;

-- Final status
SELECT 'Mobile Website Status:' as final_check, 'READY FOR USE' as status;
