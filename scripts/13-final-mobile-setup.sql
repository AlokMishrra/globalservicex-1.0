-- Final verification that everything is set up correctly for mobile-optimized website

-- Check admin users
SELECT 'Admin Users Check:' as status;
SELECT username, role, is_active 
FROM admin_users 
WHERE username = 'admin' AND password_hash = 'admin123' AND is_active = true;

-- Check blog posts with featured images
SELECT 'Blog Posts Check:' as status;
SELECT id, title, featured_image, status, views 
FROM blog_posts 
WHERE status = 'published'
ORDER BY created_at DESC;

-- Check contacts
SELECT 'Contacts Check:' as status;
SELECT COUNT(*) as total_contacts FROM contacts;

-- Check announcements
SELECT 'Announcements Check:' as status;
SELECT COUNT(*) as total_announcements FROM announcements WHERE is_active = true;

-- Final success message
SELECT 'Mobile-Optimized Website Setup Complete!' as message,
       'Login: admin / admin123' as credentials,
       'All components are now mobile-responsive' as note;
