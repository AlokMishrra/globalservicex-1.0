import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types
export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  website?: string
  services: string[]
  budget?: string
  timeline?: string
  message?: string
  status: "new" | "contacted" | "converted" | "closed"
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  category: string
  author: string
  featured_image?: string
  status: "draft" | "published"
  views: number
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: number
  username: string
  email: string
  role: "admin" | "editor"
  full_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  is_active: boolean
  show_on_homepage: boolean
  created_by: number
  created_at: string
  updated_at: string
}
