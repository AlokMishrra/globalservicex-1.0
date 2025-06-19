"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactPopup from "@/components/contact-popup"
import { getBlogPosts } from "@/lib/database"
import { supabase } from "@/lib/supabase"
import type { BlogPost } from "@/lib/supabase"

const categories = [
  "All",
  "Web Development",
  "App Development",
  "Digital Marketing",
  "Lead Generation",
  "Branding",
  "Growth",
  "Software Solutions",
]

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadBlogPosts()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("blog_posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, () => {
        loadBlogPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(blogPosts)
    } else {
      setFilteredPosts(blogPosts.filter((post) => post.category === selectedCategory))
    }
  }, [blogPosts, selectedCategory])

  const loadBlogPosts = async () => {
    try {
      const data = await getBlogPosts("published")
      setBlogPosts(data || [])
    } catch (error) {
      console.error("Error loading blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-yellow-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                Stay updated with the latest insights, tips, and trends in digital marketing, web development, and
                business growth.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories Filter - Mobile Optimized */}
            <div className="mb-8 sm:mb-12">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Category
                  </span>
                  <span className="text-sm text-gray-500">({selectedCategory})</span>
                </Button>
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden grid grid-cols-2 gap-2 mt-4">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`text-sm ${selectedCategory === category ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}`}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowFilters(false)
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Grid - Mobile Optimized */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No blog posts found for the selected category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video overflow-hidden bg-gray-200">
                      <img
                        src={post.featured_image || "/placeholder.svg?height=300&width=500"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{post.views} views</span>
                      </div>
                      <CardTitle className="line-clamp-2 hover:text-yellow-600 transition-colors text-base sm:text-lg">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700 p-1 sm:p-2"
                          >
                            <span className="hidden sm:inline">Read More</span>
                            <ArrowRight className="w-4 h-4 sm:ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <ContactPopup />
    </div>
  )
}
