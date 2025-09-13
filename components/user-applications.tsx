"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  FileText, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  User
} from "lucide-react"
import { getApplicationsByUser, getFormFieldLabels, type FormSubmission, type Career } from "@/lib/database"
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/date-utils"

interface UserApplicationsProps {
  userEmail: string
  onClose?: () => void
}

export default function UserApplications({ userEmail, onClose }: UserApplicationsProps) {
  const [applications, setApplications] = useState<{
    careers: Career[]
    formSubmissions: FormSubmission[]
  }>({ careers: [], formSubmissions: [] })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [fieldLabels, setFieldLabels] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    if (userEmail) {
      loadUserApplications()
    }
  }, [userEmail])

  const loadUserApplications = async () => {
    try {
      setLoading(true)
      const data = await getApplicationsByUser(userEmail)
      setApplications(data)
      
      // Load field labels for all form submissions
      const labelsMap: Record<string, Record<string, string>> = {}
      for (const submission of data.formSubmissions) {
        if (submission.form_id && !labelsMap[submission.form_id]) {
          labelsMap[submission.form_id] = await getFormFieldLabels(submission.form_id)
        }
      }
      setFieldLabels(labelsMap)
    } catch (error) {
      console.error("Error loading user applications:", error)
      toast.error("Error", "Failed to load your applications")
    } finally {
      setLoading(false)
    }
  }

  const formatFieldName = (fieldId: string, formId?: string) => {
    // First try to get the actual field label from the form definition
    if (formId && fieldLabels[formId] && fieldLabels[formId][fieldId]) {
      return fieldLabels[formId][fieldId]
    }
    
    // Fallback to common field names
    const commonFields: Record<string, string> = {
      'name': 'Full Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'message': 'Message',
      'coverLetter': 'Cover Letter',
      'resume': 'Resume/CV',
      'linkedin': 'LinkedIn Profile',
      'experience': 'Experience',
      'skills': 'Skills',
      'education': 'Education',
      'availability': 'Availability',
      'salary': 'Expected Salary',
      'references': 'References',
      'portfolio': 'Portfolio',
      'website': 'Website',
      'company': 'Company',
      'position': 'Position',
      'department': 'Department',
      'location': 'Location',
      'startDate': 'Start Date',
      'endDate': 'End Date',
      'reason': 'Reason for Leaving',
      'achievements': 'Achievements',
      'certifications': 'Certifications',
      'languages': 'Languages',
      'hobbies': 'Hobbies',
      'additional': 'Additional Information',
      'comments': 'Comments',
      'feedback': 'Feedback',
      'suggestions': 'Suggestions',
      'questions': 'Questions',
      'preferences': 'Preferences',
      'goals': 'Goals',
      'challenges': 'Challenges',
      'solutions': 'Solutions',
      'recommendations': 'Recommendations'
    }
    
    // If it's a common field, use the mapped name
    if (commonFields[fieldId]) {
      return commonFields[fieldId]
    }
    
    // Last resort: convert field_1757740858095 to a more readable name
    if (fieldId.startsWith('field_')) {
      const number = fieldId.replace('field_', '')
      return `Question ${number}`
    }
    
    // Default: capitalize first letter
    return fieldId.charAt(0).toUpperCase() + fieldId.slice(1)
  }

  const getDisplayName = (submission: FormSubmission) => {
    // First try the stored user_name
    if (submission.user_name) return submission.user_name
    
    // Try to extract name from form data
    const formData = submission.data
    if (formData) {
      // Look for common name field patterns
      const nameFields = ['name', 'full_name', 'fullName', 'Name', 'Full Name', 'user_name', 'field_name']
      for (const field of nameFields) {
        if (formData[field] && typeof formData[field] === 'string' && formData[field].trim()) {
          return formData[field].trim()
        }
      }
      
      // Look for any field that contains 'name' in the key
      for (const [key, value] of Object.entries(formData)) {
        if (key.toLowerCase().includes('name') && typeof value === 'string' && value.trim()) {
          return value.trim()
        }
      }
    }
    
    // Fallback to email or anonymous
    return submission.user_email || 'Anonymous User'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-green-500", icon: Clock, text: "New" },
      reviewed: { color: "bg-blue-500", icon: Eye, text: "Reviewed" },
      contacted: { color: "bg-yellow-500", icon: Phone, text: "Contacted" },
      accepted: { color: "bg-green-600", icon: CheckCircle, text: "Accepted" },
      rejected: { color: "bg-red-500", icon: XCircle, text: "Rejected" },
      in_progress: { color: "bg-purple-500", icon: Clock, text: "In Progress" },
      completed: { color: "bg-green-600", icon: CheckCircle, text: "Completed" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const filteredApplications = () => {
    let filtered = { ...applications }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered.careers = filtered.careers.filter(app => 
        app.name.toLowerCase().includes(term) ||
        app.type.toLowerCase().includes(term) ||
        app.team?.toLowerCase().includes(term)
      )
      filtered.formSubmissions = filtered.formSubmissions.filter(app => 
        app.application_type?.toLowerCase().includes(term) ||
        JSON.stringify(app.data).toLowerCase().includes(term)
      )
    }

    return filtered
  }

  const filtered = filteredApplications()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
          <p className="text-gray-600">Track all your job applications and form submissions</p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Applications</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by position, type, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Applications</p>
                <p className="text-2xl font-bold text-blue-900">
                  {applications.careers.length + applications.formSubmissions.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Career Applications</p>
                <p className="text-2xl font-bold text-green-900">{applications.careers.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Form Submissions</p>
                <p className="text-2xl font-bold text-purple-900">{applications.formSubmissions.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Applications */}
      {filtered.careers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            Career Applications ({filtered.careers.length})
          </h3>
          {filtered.careers.map((career) => (
            <Card key={`career-${career.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{career.name}</h4>
                      {getStatusBadge(career.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{career.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{career.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(career.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{career.type} - {career.team}</span>
                      </div>
                    </div>
                    {career.why && (
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <strong>Why join us:</strong> {career.why}
                      </p>
                    )}
                    {career.q1 && (
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <strong>Question 1:</strong> {career.q1}
                      </p>
                    )}
                    {career.q2 && (
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <strong>Question 2:</strong> {career.q2}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Submissions */}
      {filtered.formSubmissions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Form Submissions ({filtered.formSubmissions.length})
          </h3>
          {filtered.formSubmissions.map((submission) => (
            <Card key={`form-${submission.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">
                        {submission.application_type || 'Form Submission'}
                      </h4>
                      {getStatusBadge(submission.status || 'new')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(submission.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Form ID: {submission.form_id}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Your Submission:</p>
                      <div className="bg-gray-50 p-2 rounded text-sm">
                        <div className="space-y-2">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-medium">{formatFieldName(key, submission.form_id)}:</span>
                              <span className="ml-1 text-gray-600">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Applications */}
      {filtered.careers.length === 0 && filtered.formSubmissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No applications found matching your search." : "You haven't submitted any applications yet."}
            </p>
            {!searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                Apply for positions or submit forms to see them here.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
