"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactPopup from "@/components/contact-popup"
import { getBlogPostBySlug } from "@/lib/database"
import type { BlogPost } from "@/lib/supabase"
import Image from 'next/image'

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      loadBlogPost(params.slug as string)
    }
  }, [params.slug])

  const loadBlogPost = async (slug: string) => {
    try {
      const data = await getBlogPostBySlug(slug)
      setPost(data)
    } catch (error) {
      console.error("Error loading blog post:", error)
      setError("Blog post not found")
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
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <article className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8 text-yellow-600 hover:text-yellow-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <header className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {post.category}
                </Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} views</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
              {post.excerpt && <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>}
            </header>

            {post.featured_image && (
              <div className="mb-8">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  width={1200}
                  height={500}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-yellow-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help With Your Project?</h3>
                <p className="text-gray-600 mb-6">
                  Get free consultation and guidance from our experts to help grow your business.
                </p>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Get Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <ContactPopup />
    </div>
  )
}
