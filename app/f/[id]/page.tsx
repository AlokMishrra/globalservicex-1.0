"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFormByPartialId } from "@/lib/database"

interface ShortFormPageProps {
  params: {
    id: string
  }
}

export default function ShortFormPage({ params }: ShortFormPageProps) {
  const router = useRouter()

  useEffect(() => {
    const redirectToForm = async () => {
      try {
        // Find the form by matching the partial ID
        const form = await getFormByPartialId(params.id)
        
        if (form && form.id) {
          // Redirect to the full form page
          router.push(`/form/${form.id}`)
        } else {
          // If form not found, redirect to home
          router.push('/')
        }
      } catch (error) {
        console.error('Error redirecting to form:', error)
        router.push('/')
      }
    }

    redirectToForm()
  }, [params.id, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to form...</p>
      </div>
    </div>
  )
}
