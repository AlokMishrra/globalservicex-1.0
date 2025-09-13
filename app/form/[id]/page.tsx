"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, FileText, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getFormById } from "@/lib/database"
import FormRenderer from "@/components/form-renderer"
import type { FormData } from "@/components/form-builder"

interface FormPageProps {
  params: {
    id: string
  }
}

export default function FormPage({ params }: FormPageProps) {
  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true)
        const formData = await getFormById(params.id)
        
        if (!formData) {
          setError("Form not found")
          return
        }

        if (!formData.is_published) {
          setError("This form is not available for public access")
          return
        }

        setForm(formData)
      } catch (err) {
        console.error('Error loading form:', err)
        setError("Failed to load form. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Available</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/careers">
                    <FileText className="w-4 h-4 mr-2" />
                    View Careers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{form.title}</h1>
                <p className="text-sm text-gray-600">Global Servicex</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Published
            </Badge>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <FormRenderer form={form} showTitle={false} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 Global Servicex. All rights reserved.</p>
            <p className="mt-1">
              Need help? <Link href="/contact" className="text-yellow-600 hover:text-yellow-700">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
