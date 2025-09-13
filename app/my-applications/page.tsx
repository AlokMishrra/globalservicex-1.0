"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, User, Mail } from "lucide-react"
import UserApplications from "@/components/user-applications"
import { toast } from "@/hooks/use-toast"

export default function MyApplicationsPage() {
  const [email, setEmail] = useState("")
  const [showApplications, setShowApplications] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Error", "Please enter your email address")
      return
    }

    if (!email.includes('@')) {
      toast.error("Error", "Please enter a valid email address")
      return
    }

    setLoading(true)
    // Simulate a brief loading state
    setTimeout(() => {
      setShowApplications(true)
      setLoading(false)
      toast.success("Success", "Loading your applications...")
    }, 1000)
  }

  const handleClose = () => {
    setShowApplications(false)
    setEmail("")
  }

  if (showApplications) {
    return <UserApplications userEmail={email} onClose={handleClose} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">My Applications</CardTitle>
          <p className="text-gray-600">Enter your email to view your application history</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLookup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white h-12 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Looking up applications...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  View My Applications
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What you can view:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All your job applications</li>
              <li>• Form submissions</li>
              <li>• Application status updates</li>
              <li>• Submission history</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

