"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Megaphone,
  Settings,
  UserPlus,
  Save,
  X,
  AlertCircle,
  Upload,
  ImageIcon,
  Bot,
} from "lucide-react"
import {
  authenticateUser,
  getContacts,
  updateContactStatus,
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getUsers,
  createUser,
  deleteUser,
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  getDashboardStats,
  getAIConsultations,
  updateAIConsultationStatus,
  type AIConsultation,
  getCareers,
  type Career,
  deleteContact,
  deleteCareer,
} from "@/lib/database"
import { createImagePreview, checkStorageAvailability, compressImage } from "@/lib/storage"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import type { Contact, BlogPost, AdminUser, Announcement } from "@/lib/supabase"
import Image from 'next/image'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [storageAvailable, setStorageAvailable] = useState(false)

  // Data states
  const [contacts, setContacts] = useState<Contact[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [aiConsultations, setAIConsultations] = useState<AIConsultation[]>([])
  const [careers, setCareers] = useState<Career[]>([])
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalBlogPosts: 0,
    totalViews: 0,
    totalUsers: 0,
    totalConsultations: 0,
    newConsultations: 0,
  })

  // Form states
  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft" as "draft" | "published",
    featured_image: "",
  })
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
    full_name: "",
    is_active: true,
  })
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "success" | "error",
    show_on_homepage: false,
  })

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editUploadingImage, setEditUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [editImagePreview, setEditImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData()
      setupRealTimeSubscriptions()
      checkStorage()
      getCareers().then(setCareers)
    }
  }, [isLoggedIn])

  const checkStorage = async () => {
    const available = await checkStorageAvailability()
    setStorageAvailable(available)
    if (!available) {
      toast.info(
        "Using Local Storage",
        "Images will be stored as compressed data for demo purposes. This ensures reliable image handling.",
      )
    }
  }

  const setupRealTimeSubscriptions = () => {
    const contactsChannel = supabase
      .channel("admin_contacts")
      .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, loadContacts)
      .subscribe()

    const blogChannel = supabase
      .channel("admin_blog_posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, loadBlogPosts)
      .subscribe()

    const usersChannel = supabase
      .channel("admin_users")
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_users" }, loadUsers)
      .subscribe()

    const announcementsChannel = supabase
      .channel("admin_announcements")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, loadAnnouncements)
      .subscribe()

    const consultationsChannel = supabase
      .channel("admin_consultations")
      .on("postgres_changes", { event: "*", schema: "public", table: "ai_consultations" }, loadAIConsultations)
      .subscribe()

    return () => {
      supabase.removeChannel(contactsChannel)
      supabase.removeChannel(blogChannel)
      supabase.removeChannel(usersChannel)
      supabase.removeChannel(announcementsChannel)
      supabase.removeChannel(consultationsChannel)
    }
  }

  const loadAllData = async () => {
    await Promise.all([
      loadContacts(),
      loadBlogPosts(),
      loadUsers(),
      loadAnnouncements(),
      loadAIConsultations(),
      loadStats(),
    ])
  }

  const loadContacts = async () => {
    try {
      const data = await getContacts()
      setContacts(data || [])
    } catch (error) {
      console.error("Error loading contacts:", error)
    }
  }

  const loadBlogPosts = async () => {
    try {
      const data = await getBlogPosts()
      setBlogPosts(data || [])
    } catch (error) {
      console.error("Error loading blog posts:", error)
    }
  }

  const loadUsers = async () => {
    try {
      if (currentUser?.role === "admin") {
        const data = await getUsers()
        setUsers(data || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements()
      setAnnouncements(data || [])
    } catch (error) {
      console.error("Error loading announcements:", error)
    }
  }

  const loadAIConsultations = async () => {
    try {
      const data = await getAIConsultations()
      setAIConsultations(data || [])
    } catch (error) {
      console.error("Error loading AI consultations:", error)
    }
  }

  const loadStats = async () => {
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError("")

    try {
      const user = await authenticateUser(loginData.username, loginData.password)
      setCurrentUser(user)
      setIsLoggedIn(true)
      toast.success("Login Successful! 🎉", "Welcome to the admin panel")
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Invalid username or password. Please try again.")
      toast.error("Login Failed", "Invalid username or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, isEdit = false) => {
    try {
      if (isEdit) {
        setEditUploadingImage(true)
      } else {
        setUploadingImage(true)
      }

      // Create preview immediately
      const preview = await createImagePreview(file)
      if (isEdit) {
        setEditImagePreview(preview)
      } else {
        setImagePreview(preview)
      }

      // Compress and upload image
      const compressedImageUrl = await compressImage(file, 800, 0.7)

      if (isEdit && editingPost) {
        setEditingPost((prev) => (prev ? { ...prev, featured_image: compressedImageUrl } : null))
      } else {
        setNewPost((prev) => ({ ...prev, featured_image: compressedImageUrl }))
      }

      toast.success("Image Processed! 📸", "Your image has been compressed and is ready to use")
    } catch (error) {
      console.error("Error processing image:", error)
      toast.error("Upload Failed", "Error processing image. Please try again with a different image.")
    } finally {
      if (isEdit) {
        setEditUploadingImage(false)
      } else {
        setUploadingImage(false)
      }
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const slug =
        newPost.slug ||
        newPost.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

      await createBlogPost({
        ...newPost,
        slug,
        author: currentUser?.full_name || currentUser?.username || "Admin",
      })

      setNewPost({ title: "", slug: "", excerpt: "", content: "", category: "", status: "draft", featured_image: "" })
      setImagePreview("")
      toast.success("Blog Post Created! 📝", "Your blog post has been created successfully")
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Creation Failed", "Error creating blog post. Please check your input and try again.")
    }
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return

    try {
      await updateBlogPost(editingPost.id, editingPost)
      setEditingPost(null)
      setEditImagePreview("")
      toast.success("Post Updated! ✏️", "Blog post has been updated successfully")
    } catch (error) {
      console.error("Error updating post:", error)
      toast.error("Update Failed", "Error updating blog post. Please check your input and try again.")
    }
  }

  const handleDeletePost = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(id)
        toast.success("Post Deleted! 🗑️", "Blog post has been deleted successfully")
      } catch (error) {
        console.error("Error deleting post:", error)
        toast.error("Deletion Failed", "Error deleting blog post. Please try again.")
      }
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser?.role !== "admin") return

    try {
      await createUser(newUser)
      setNewUser({ username: "", email: "", password: "", role: "editor", full_name: "", is_active: true })
      toast.success("User Created! 👤", "New user has been created successfully")
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Creation Failed", "Error creating user. Please try again.")
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (currentUser?.role !== "admin") return
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id)
        toast.success("User Deleted! 🗑️", "User has been deleted successfully")
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Deletion Failed", "Error deleting user. Please try again.")
      }
    }
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAnnouncement({
        ...newAnnouncement,
        created_by: currentUser?.id || 1,
        is_active: true,
      })
      setNewAnnouncement({ title: "", content: "", type: "info", show_on_homepage: false })
      toast.success("Announcement Created! 📢", "Your announcement has been created successfully")
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast.error("Creation Failed", "Error creating announcement. Please try again.")
    }
  }

  const handleUpdateContactStatus = async (id: number, status: Contact["status"]) => {
    try {
      await updateContactStatus(id, status)
      toast.success("Status Updated! 📋", "Contact status has been updated successfully")
    } catch (error) {
      console.error("Error updating contact:", error)
      toast.error("Update Failed", "Error updating contact status. Please try again.")
    }
  }

  const handleUpdateConsultationStatus = async (id: number, status: AIConsultation["status"]) => {
    try {
      await updateAIConsultationStatus(id, status)
      toast.success("Consultation Updated! 🤖", "AI consultation status has been updated successfully")
    } catch (error) {
      console.error("Error updating consultation:", error)
      toast.error("Update Failed", "Error updating consultation status. Please try again.")
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">GS</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Global Servicex Admin</CardTitle>
            <p className="text-gray-600">Please login to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  placeholder="Enter your username"
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="Enter your password"
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              {loginError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{loginError}</span>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white h-12 font-semibold transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canAccessUsers = currentUser?.role === "admin"
  const canAccessAnnouncements = currentUser?.role === "admin"

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Global Servicex Admin</h1>
              <p className="text-sm text-gray-600">
                Welcome, {currentUser?.full_name || currentUser?.username} ({currentUser?.role})
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Images: Compressed Storage</span>
              </div>
              <Button
                onClick={() => {
                  setIsLoggedIn(false)
                  toast.info("Logged Out", "You have been logged out successfully")
                }}
                variant="outline"
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Contacts</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalContacts}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">New Inquiries</p>
                  <p className="text-3xl font-bold text-green-900">{stats.newContacts}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Blog Posts</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalBlogPosts}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Total Views</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-600 font-medium">AI Consultations</p>
                  <p className="text-3xl font-bold text-pink-900">{stats.totalConsultations}</p>
                </div>
                <Bot className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          {canAccessUsers && (
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-indigo-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className={`grid w-full ${canAccessUsers ? "grid-cols-6" : "grid-cols-4"} bg-white shadow-sm`}>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Blog
            </TabsTrigger>
            <TabsTrigger
              value="ai-consultations"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              AI Consultations
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Settings
            </TabsTrigger>
            {canAccessUsers && (
              <TabsTrigger value="users" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                Users
              </TabsTrigger>
            )}
            {canAccessAnnouncements && (
              <TabsTrigger
                value="announcements"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              >
                Announcements
              </TabsTrigger>
            )}
            <TabsTrigger value="careers" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Careers
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Contact Inquiries ({contacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{contact.name}</h3>
                          <p className="text-gray-600">{contact.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={contact.status === "new" ? "default" : "secondary"}
                            className={contact.status === "new" ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {contact.status}
                          </Badge>
                          <Select
                            value={contact.status}
                            onValueChange={(value) => handleUpdateContactStatus(contact.id, value as Contact["status"])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="ml-2"
                            onClick={async () => {
                              try {
                                await deleteContact(contact.id)
                                setContacts(contacts.filter(c => c.id !== contact.id))
                                toast.success("Contact deleted")
                              } catch (e) {
                                toast.error("Failed to delete contact")
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <strong>Email:</strong> {contact.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {contact.phone}
                          </p>
                          <p>
                            <strong>Budget:</strong> {contact.budget || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Services:</strong> {contact.services.join(", ")}
                          </p>
                          <p>
                            <strong>Date:</strong> {new Date(contact.created_at).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Timeline:</strong> {contact.timeline || "Not specified"}
                          </p>
                        </div>
                      </div>
                      {contact.message && (
                        <div>
                          <p>
                            <strong>Message:</strong>
                          </p>
                          <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">{contact.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No contact inquiries yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Consultations Tab */}
          <TabsContent value="ai-consultations" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-pink-600" />
                  AI Consultations ({aiConsultations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {aiConsultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-purple-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{consultation.business_name}</h3>
                          <p className="text-gray-600">
                            {consultation.industry} • {consultation.business_type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={consultation.status === "new" ? "default" : "secondary"}
                            className={consultation.status === "new" ? "bg-purple-500 hover:bg-purple-600" : ""}
                          >
                            {consultation.status}
                          </Badge>
                          <Select
                            value={consultation.status}
                            onValueChange={(value) =>
                              handleUpdateConsultationStatus(consultation.id, value as AIConsultation["status"])
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <strong>Target Audience:</strong> {consultation.target_audience}
                          </p>
                          <p>
                            <strong>Budget:</strong> {consultation.budget || "Not specified"}
                          </p>
                          <p>
                            <strong>Design Style:</strong> {consultation.design_style || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Timeline:</strong> {consultation.timeline || "Not specified"}
                          </p>
                          <p>
                            <strong>Date:</strong> {new Date(consultation.created_at).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Recommendations:</strong>{" "}
                            {(() => {
                              if (!consultation.recommendations) return "0 items"
                              let recs = consultation.recommendations
                              if (typeof recs === "string") {
                                try {
                                  recs = JSON.parse(recs)
                                } catch {
                                  return "Invalid data"
                                }
                              }
                              return Array.isArray(recs) ? `${recs.length} items` : "0 items"
                            })()}
                          </p>
                        </div>
                      </div>
                      {consultation.goals && (
                        <div>
                          <p>
                            <strong>Goals:</strong>
                          </p>
                          <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">{consultation.goals}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {aiConsultations.length === 0 && (
                    <div className="text-center py-12">
                      <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No AI consultations yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab - Enhanced with better image handling */}
          <TabsContent value="blog" className="space-y-6">
            {/* Create New Post */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Create New Blog Post
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={newPost.slug}
                        onChange={(e) => setNewPost((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="Auto-generated from title"
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Enhanced Featured Image Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      Featured Image
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Compressed Storage
                      </Badge>
                    </Label>
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? "Processing..." : "Upload Image"}
                      </Button>
                      {(imagePreview || newPost.featured_image) && (
                        <div className="flex items-center gap-2">
                          <Image
                            src={imagePreview || newPost.featured_image || "/placeholder.svg"}
                            alt="Featured"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewPost((prev) => ({ ...prev, featured_image: "" }))
                              setImagePreview("")
                            }}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-green-600">
                      Images are automatically compressed for optimal performance and storage.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) => setNewPost((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="App Development">App Development</SelectItem>
                          <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                          <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                          <SelectItem value="Branding">Branding</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                          <SelectItem value="Software Solutions">Software Solutions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newPost.status}
                        onValueChange={(value) =>
                          setNewPost((prev) => ({ ...prev, status: value as "draft" | "published" }))
                        }
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, excerpt: e.target.value }))}
                      rows={2}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                      rows={10}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Posts ({blogPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            {post.featured_image && (
                              <Image
                                src={post.featured_image ? post.featured_image : "/placeholder.svg"}
                                alt={post.title}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold">{post.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {post.category} • By {post.author} • {new Date(post.created_at).toLocaleDateString()} •{" "}
                                {post.views} views
                              </p>
                              {post.excerpt && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Blog Post</DialogTitle>
                              </DialogHeader>
                              {editingPost && (
                                <form onSubmit={handleUpdatePost} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                      id="edit-title"
                                      value={editingPost.title}
                                      onChange={(e) =>
                                        setEditingPost((prev) => (prev ? { ...prev, title: e.target.value } : null))
                                      }
                                    />
                                  </div>

                                  {/* Edit Featured Image */}
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                      Featured Image
                                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                        Compressed Storage
                                      </Badge>
                                    </Label>
                                    <div className="flex items-center gap-4">
                                      <input
                                        ref={editFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0]
                                          if (file) handleImageUpload(file, true)
                                        }}
                                        className="hidden"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => editFileInputRef.current?.click()}
                                        disabled={editUploadingImage}
                                      >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {editUploadingImage ? "Processing..." : "Upload Image"}
                                      </Button>
                                      {editingPost.featured_image && (
                                        <div className="flex items-center gap-2">
                                          <Image
                                            src={editingPost.featured_image ? editingPost.featured_image : "/placeholder.svg"}
                                            alt="Featured"
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 object-cover rounded"
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setEditingPost((prev) => (prev ? { ...prev, featured_image: "" } : null))
                                            }
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-category">Category</Label>
                                      <Select
                                        value={editingPost.category}
                                        onValueChange={(value) =>
                                          setEditingPost((prev) => (prev ? { ...prev, category: value } : null))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Web Development">Web Development</SelectItem>
                                          <SelectItem value="App Development">App Development</SelectItem>
                                          <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                          <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                                          <SelectItem value="Branding">Branding</SelectItem>
                                          <SelectItem value="Growth">Growth</SelectItem>
                                          <SelectItem value="Software Solutions">Software Solutions</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Status</Label>
                                      <Select
                                        value={editingPost.status}
                                        onValueChange={(value) =>
                                          setEditingPost((prev) =>
                                            prev ? { ...prev, status: value as "draft" | "published" } : null,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="draft">Draft</SelectItem>
                                          <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-excerpt">Excerpt</Label>
                                    <Textarea
                                      id="edit-excerpt"
                                      value={editingPost.excerpt || ""}
                                      onChange={(e) =>
                                        setEditingPost((prev) => (prev ? { ...prev, excerpt: e.target.value } : null))
                                      }
                                      rows={2}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-content">Content</Label>
                                    <Textarea
                                      id="edit-content"
                                      value={editingPost.content}
                                      onChange={(e) =>
                                        setEditingPost((prev) => (prev ? { ...prev, content: e.target.value } : null))
                                      }
                                      rows={8}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                      <Save className="w-4 h-4 mr-2" />
                                      Update Post
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setEditingPost(null)}>
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {blogPosts.length === 0 && <p className="text-center text-gray-500 py-8">No blog posts yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab (Admin Only) */}
          {canAccessUsers && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-username">Username *</Label>
                        <Input
                          id="new-username"
                          value={newUser.username}
                          onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email *</Label>
                        <Input
                          id="new-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password *</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-role">Role *</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) =>
                            setNewUser((prev) => ({ ...prev, role: value as "admin" | "editor" }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-fullname">Full Name</Label>
                      <Input
                        id="new-fullname"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-active"
                        checked={newUser.is_active}
                        onCheckedChange={(checked) =>
                          setNewUser((prev) => ({ ...prev, is_active: checked as boolean }))
                        }
                      />
                      <Label htmlFor="new-active">Active User</Label>
                    </div>
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{user.full_name || user.username}</h3>
                            <p className="text-sm text-gray-600">
                              @{user.username} • {user.email} • {user.role}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={user.is_active ? "default" : "secondary"}>
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {user.id !== currentUser?.id && (
                              <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && <p className="text-center text-gray-500 py-8">No users found.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Announcements Tab (Admin Only) */}
          {canAccessAnnouncements && (
            <TabsContent value="announcements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Announcement</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcement-title">Title *</Label>
                      <Input
                        id="announcement-title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement-content">Content *</Label>
                      <Textarea
                        id="announcement-content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-type">Type</Label>
                        <Select
                          value={newAnnouncement.type}
                          onValueChange={(value) =>
                            setNewAnnouncement((prev) => ({
                              ...prev,
                              type: value as "info" | "warning" | "success" | "error",
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id="show-homepage"
                          checked={newAnnouncement.show_on_homepage}
                          onCheckedChange={(checked) =>
                            setNewAnnouncement((prev) => ({ ...prev, show_on_homepage: checked as boolean }))
                          }
                        />
                        <Label htmlFor="show-homepage">Show on Homepage</Label>
                      </div>
                    </div>
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Megaphone className="w-4 h-4 mr-2" />
                      Create Announcement
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Announcements ({announcements.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              <Badge
                                variant="outline"
                                className={
                                  announcement.type === "success"
                                    ? "border-green-500 text-green-700"
                                    : announcement.type === "warning"
                                      ? "border-yellow-500 text-yellow-700"
                                      : announcement.type === "error"
                                        ? "border-red-500 text-red-700"
                                        : "border-blue-500 text-blue-700"
                                }
                              >
                                {announcement.type}
                              </Badge>
                              {announcement.show_on_homepage && <Badge variant="secondary">Homepage</Badge>}
                            </div>
                            <p className="text-gray-600 mb-2">{announcement.content}</p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(announcement.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAnnouncement(announcement.id, { is_active: false })}
                            >
                              Deactivate
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteAnnouncement(announcement.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No active announcements.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Careers Tab */}
          <TabsContent value="careers" className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Career Applications</h2>
              {careers.length === 0 && <div>No career applications found.</div>}
              {careers.map((career) => (
                <Card key={career.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{career.name} ({career.type})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><b>Email:</b> {career.email}</div>
                    <div><b>Phone:</b> {career.phone}</div>
                    <div><b>Team:</b> {career.team}</div>
                    <div><b>Why:</b> {career.why}</div>
                    {career.q1 && <div><b>Q1:</b> {career.q1}</div>}
                    {career.q2 && <div><b>Q2:</b> {career.q2}</div>}
                    <div><b>Status:</b> {career.status}</div>
                    <div><b>Submitted:</b> {new Date(career.created_at).toLocaleString()}</div>
                    {career.resume && (
                      <Button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = career.resume
                          link.download = `${career.name}-resume`;
                          link.click()
                        }}
                        className="mt-2"
                      >
                        Download Resume
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={async () => {
                        try {
                          await deleteCareer(career.id)
                          setCareers(careers.filter(c => c.id !== career.id))
                          toast.success("Career application deleted")
                        } catch (e) {
                          toast.error("Failed to delete application")
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    defaultValue="Global Servicex"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    defaultValue="Empowering businesses with innovative digital solutions"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    defaultValue="info@globalservicex.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    defaultValue="+91 98765 43210"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-300 transform hover:scale-105"
                  onClick={() => toast.success("Settings Saved! ⚙️", "Your settings have been saved successfully")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
