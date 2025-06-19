import { supabase } from "./supabase"
import type { Contact, BlogPost, AdminUser, Announcement } from "./supabase"

// AI Consultation interface
export interface AIConsultation {
  id: number
  business_name: string
  industry: string
  business_type: string
  target_audience?: string
  goals?: string
  budget?: string
  timeline?: string
  current_website?: string
  competitors?: string
  special_requirements?: string
  preferred_colors?: string
  design_style?: string
  recommendations?: any
  demo_website?: any
  status: "new" | "in_progress" | "completed" | "contacted"
  created_at: string
  updated_at: string
}

// Contact functions
export const createContact = async (contactData: Omit<Contact, "id" | "created_at" | "updated_at" | "status">) => {
  const { data, error } = await supabase.from("contacts").insert([contactData]).select().single()

  if (error) throw error
  return data
}

export const getContacts = async () => {
  const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const updateContactStatus = async (id: number, status: Contact["status"]) => {
  const { data, error } = await supabase
    .from("contacts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// AI Consultation functions
export const createAIConsultation = async (
  consultationData: Omit<AIConsultation, "id" | "created_at" | "updated_at" | "status">,
) => {
  const { data, error } = await supabase.from("ai_consultations").insert([consultationData]).select().single()

  if (error) throw error
  return data
}

export const getAIConsultations = async () => {
  const { data, error } = await supabase.from("ai_consultations").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const updateAIConsultationStatus = async (id: number, status: AIConsultation["status"]) => {
  const { data, error } = await supabase
    .from("ai_consultations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Blog functions
export const createBlogPost = async (postData: Omit<BlogPost, "id" | "created_at" | "updated_at" | "views">) => {
  const { data, error } = await supabase.from("blog_posts").insert([postData]).select().single()

  if (error) throw error
  return data
}

export const getBlogPosts = async (status?: "published" | "draft") => {
  let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) throw error

  // Increment views
  await supabase
    .from("blog_posts")
    .update({ views: data.views + 1 })
    .eq("id", data.id)

  return { ...data, views: data.views + 1 }
}

export const updateBlogPost = async (id: number, updates: Partial<BlogPost>) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteBlogPost = async (id: number) => {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) throw error
}

// User functions - Simplified authentication with better error handling
export const authenticateUser = async (username: string, password: string) => {
  try {
    console.log("Attempting to authenticate user:", username)

    // Query the admin_users table
    const { data: users, error: fetchError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)

    console.log("Database query result:", { users, fetchError })

    if (fetchError) {
      console.error("Database fetch error:", fetchError)
      throw new Error(`Database error: ${fetchError.message}`)
    }

    if (!users || users.length === 0) {
      console.error("No users found for username:", username)
      throw new Error("Invalid username or password")
    }

    const user = users[0]
    console.log("Found user:", { id: user.id, username: user.username, role: user.role })

    // Check password (simple comparison for demo)
    if (user.password_hash !== password) {
      console.error("Password mismatch for user:", username)
      throw new Error("Invalid username or password")
    }

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword as AdminUser
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

export const getUsers = async () => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username, email, role, full_name, is_active, created_at")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const createUser = async (
  userData: Omit<AdminUser, "id" | "created_at" | "updated_at"> & { password: string },
) => {
  const { password, ...userDataWithoutPassword } = userData
  const { data, error } = await supabase
    .from("admin_users")
    .insert([{ ...userDataWithoutPassword, password_hash: password }])
    .select("id, username, email, role, full_name, is_active, created_at")
    .single()

  if (error) throw error
  return data
}

export const updateUser = async (id: number, updates: Partial<AdminUser>) => {
  const { data, error } = await supabase
    .from("admin_users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, username, email, role, full_name, is_active, created_at")
    .single()

  if (error) throw error
  return data
}

export const deleteUser = async (id: number) => {
  const { error } = await supabase.from("admin_users").delete().eq("id", id)

  if (error) throw error
}

// Announcement functions
export const createAnnouncement = async (announcementData: Omit<Announcement, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("announcements").insert([announcementData]).select().single()

  if (error) throw error
  return data
}

export const getAnnouncements = async (homepageOnly = false) => {
  let query = supabase.from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false })

  if (homepageOnly) {
    query = query.eq("show_on_homepage", true)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export const updateAnnouncement = async (id: number, updates: Partial<Announcement>) => {
  const { data, error } = await supabase
    .from("announcements")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteAnnouncement = async (id: number) => {
  const { error } = await supabase.from("announcements").delete().eq("id", id)

  if (error) throw error
}

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    const [contactsResult, blogPostsResult, usersResult, consultationsResult] = await Promise.all([
      supabase.from("contacts").select("id, status", { count: "exact" }),
      supabase.from("blog_posts").select("id, views", { count: "exact" }),
      supabase.from("admin_users").select("id", { count: "exact" }),
      supabase.from("ai_consultations").select("id, status", { count: "exact" }),
    ])

    const totalContacts = contactsResult.count || 0
    const newContacts = contactsResult.data?.filter((c) => c.status === "new").length || 0
    const totalBlogPosts = blogPostsResult.count || 0
    const totalViews = blogPostsResult.data?.reduce((sum, post) => sum + post.views, 0) || 0
    const totalUsers = usersResult.count || 0
    const totalConsultations = consultationsResult.count || 0
    const newConsultations = consultationsResult.data?.filter((c) => c.status === "new").length || 0

    return {
      totalContacts,
      newContacts,
      totalBlogPosts,
      totalViews,
      totalUsers,
      totalConsultations,
      newConsultations,
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
    return {
      totalContacts: 0,
      newContacts: 0,
      totalBlogPosts: 0,
      totalViews: 0,
      totalUsers: 0,
      totalConsultations: 0,
      newConsultations: 0,
    }
  }
}

// Initialize database - create tables and admin user if they don't exist
export const initializeDatabase = async () => {
  try {
    // Check if admin_users table exists and has data
    const { data: users, error } = await supabase.from("admin_users").select("*").eq("username", "admin").limit(1)

    if (error && error.code === "42P01") {
      // Table doesn't exist, we need to create it via SQL
      console.log("admin_users table doesn't exist, please run the database setup script")
      return false
    }

    if (!users || users.length === 0) {
      console.log("No admin user found, please run the database setup script")
      return false
    }

    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    return false
  }
}

export interface Career {
  id: number
  name: string
  email: string
  phone: string
  type: string
  team: string
  why: string
  q1?: string
  q2?: string
  status: string
  resume?: string
  created_at: string
  updated_at: string
}

export const createCareer = async (careerData: Omit<Career, "id" | "created_at" | "updated_at" | "status">) => {
  const { data, error } = await supabase.from("careers").insert([careerData]).select().single()
  if (error) throw error
  return data
}

export const getCareers = async () => {
  const { data, error } = await supabase.from("careers").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data || []
}

export const deleteContact = async (id: number) => {
  const { error } = await supabase.from("contacts").delete().eq("id", id)
  if (error) throw error
}

export const deleteCareer = async (id: number) => {
  const { error } = await supabase.from("careers").delete().eq("id", id)
  if (error) throw error
}
