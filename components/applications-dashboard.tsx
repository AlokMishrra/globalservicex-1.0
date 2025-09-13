"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Users, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  ExternalLink
} from "lucide-react"
import { 
  getAllApplications, 
  updateFormSubmissionStatus, 
  updateContactStatus,
  deleteFormSubmission,
  getFormFieldLabels,
  type FormSubmission,
  type Career 
} from "@/lib/database"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useConfirmation } from "@/hooks/use-confirmation"
import { formatDate } from "@/lib/date-utils"

interface ApplicationsDashboardProps {
  onClose?: () => void
}

export default function ApplicationsDashboard({ onClose }: ApplicationsDashboardProps) {
  const [applications, setApplications] = useState<{
    careers: Career[]
    formSubmissions: FormSubmission[]
  }>({ careers: [], formSubmissions: [] })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [fieldLabels, setFieldLabels] = useState<Record<string, Record<string, string>>>({})
  const confirmation = useConfirmation()

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await getAllApplications()
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
      console.error("Error loading applications:", error)
      toast.error("Error", "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (type: 'career' | 'form', id: number, status: string) => {
    try {
      if (type === 'career') {
        await updateContactStatus(id, status as any)
      } else {
        await updateFormSubmissionStatus(id, status)
      }
      await loadApplications()
      toast.success("Status Updated", "Application status has been updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Error", "Failed to update status")
    }
  }

  const handleDeleteSubmission = async (submission: FormSubmission) => {
    const confirmed = await confirmation.confirm({
      title: "Delete Form Submission",
      description: `Are you sure you want to delete the submission from ${submission.user_name || submission.user_email || 'Anonymous User'}? This action cannot be undone.`,
      confirmText: "Delete",
      type: "danger"
    })

    if (confirmed) {
      try {
        confirmation.setLoading(true)
        await deleteFormSubmission(submission.id)
        await loadApplications()
        toast.success("Submission Deleted", "Form submission has been deleted successfully")
      } catch (error) {
        console.error("Error deleting submission:", error)
        toast.error("Error", "Failed to delete submission")
      } finally {
        confirmation.setLoading(false)
        confirmation.close()
      }
    }
  }

  const filteredApplications = () => {
    let filtered = { ...applications }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered.careers = filtered.careers.filter(app => 
        app.name.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.phone.includes(term)
      )
      filtered.formSubmissions = filtered.formSubmissions.filter(app => 
        app.user_name?.toLowerCase().includes(term) ||
        app.user_email?.toLowerCase().includes(term) ||
        app.user_phone?.includes(term)
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered.careers = filtered.careers.filter(app => app.status === statusFilter)
      filtered.formSubmissions = filtered.formSubmissions.filter(app => app.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== "all") {
      if (typeFilter === "careers") {
        filtered.formSubmissions = []
      } else if (typeFilter === "forms") {
        filtered.careers = []
      }
    }

    // Filter by selected user
    if (selectedUser) {
      filtered.careers = filtered.careers.filter(app => app.email === selectedUser)
      filtered.formSubmissions = filtered.formSubmissions.filter(app => app.user_email === selectedUser)
    }

    return filtered
  }

  const getUniqueUsers = () => {
    const users = new Set<string>()
    applications.careers.forEach(app => users.add(app.email))
    applications.formSubmissions.forEach(app => app.user_email && users.add(app.user_email))
    return Array.from(users)
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
      new: { color: "bg-green-500", icon: Clock },
      reviewed: { color: "bg-blue-500", icon: Eye },
      contacted: { color: "bg-yellow-500", icon: Phone },
      accepted: { color: "bg-green-600", icon: CheckCircle },
      rejected: { color: "bg-red-500", icon: XCircle },
      in_progress: { color: "bg-purple-500", icon: Clock },
      completed: { color: "bg-green-600", icon: CheckCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const filtered = filteredApplications()
  const uniqueUsers = getUniqueUsers()

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
          <h2 className="text-2xl font-bold text-gray-900">Applications Dashboard</h2>
          <p className="text-gray-600">Manage all job applications and form submissions</p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Close Dashboard
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Applications</p>
                <p className="text-2xl font-bold text-blue-900">
                  {applications.careers.length + applications.formSubmissions.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
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

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Unique Users</p>
                <p className="text-2xl font-bold text-orange-900">{uniqueUsers.length}</p>
              </div>
              <User className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="careers">Career Applications</SelectItem>
                  <SelectItem value="forms">Form Submissions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-filter">User</Label>
              <Select value={selectedUser || "all"} onValueChange={(value) => setSelectedUser(value === "all" ? null : value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(email => (
                    <SelectItem key={email} value={email}>{email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Applications ({filtered.careers.length + filtered.formSubmissions.length})</TabsTrigger>
          <TabsTrigger value="careers">Career Applications ({filtered.careers.length})</TabsTrigger>
          <TabsTrigger value="forms">Form Submissions ({filtered.formSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Career Applications */}
          {filtered.careers.map((career) => (
            <Card key={`career-${career.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-lg">{career.name}</h3>
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
                        <GraduationCap className="w-4 h-4" />
                        <span>{career.type} - {career.team}</span>
                      </div>
                    </div>
                    {career.why && (
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <strong>Why join us:</strong> {career.why}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={career.status}
                      onValueChange={(value) => handleStatusUpdate('career', career.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {career.resume && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Form Submissions */}
          {filtered.formSubmissions.map((submission) => (
            <Card key={`form-${submission.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-lg">
                        {getDisplayName(submission)}
                      </h3>
                      {getStatusBadge(submission.status || 'new')}
                      <Badge variant="outline">{submission.application_type || 'general'}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      {submission.user_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{submission.user_email}</span>
                        </div>
                      )}
                      {submission.user_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{submission.user_phone}</span>
                        </div>
                      )}
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
                      <p className="text-sm font-medium text-gray-700 mb-1">Form Data Preview:</p>
                      <div className="bg-gray-50 p-2 rounded text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(submission.data).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-medium">{formatFieldName(key, submission.form_id)}:</span>
                              <span className="ml-1 text-gray-600">{String(value).substring(0, 30)}{String(value).length > 30 ? '...' : ''}</span>
                            </div>
                          ))}
                          {Object.keys(submission.data).length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{Object.keys(submission.data).length - 3} more fields
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setShowSubmissionModal(true)
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Full Details
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs bg-red-500 hover:bg-red-600"
                          onClick={() => handleDeleteSubmission(submission)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={submission.status || 'new'}
                      onValueChange={(value) => handleStatusUpdate('form', submission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.careers.length === 0 && filtered.formSubmissions.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No applications found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="careers" className="space-y-4">
          {filtered.careers.map((career) => (
            <Card key={`career-${career.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-lg">{career.name}</h3>
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
                        <GraduationCap className="w-4 h-4" />
                        <span>{career.type} - {career.team}</span>
                      </div>
                    </div>
                    {career.why && (
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <strong>Why join us:</strong> {career.why}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={career.status}
                      onValueChange={(value) => handleStatusUpdate('career', career.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {career.resume && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          {filtered.formSubmissions.map((submission) => (
            <Card key={`form-${submission.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-lg">
                        {getDisplayName(submission)}
                      </h3>
                      {getStatusBadge(submission.status || 'new')}
                      <Badge variant="outline">{submission.application_type || 'general'}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      {submission.user_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{submission.user_email}</span>
                        </div>
                      )}
                      {submission.user_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{submission.user_phone}</span>
                        </div>
                      )}
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
                      <p className="text-sm font-medium text-gray-700 mb-1">Form Data Preview:</p>
                      <div className="bg-gray-50 p-2 rounded text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(submission.data).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-medium">{formatFieldName(key, submission.form_id)}:</span>
                              <span className="ml-1 text-gray-600">{String(value).substring(0, 30)}{String(value).length > 30 ? '...' : ''}</span>
                            </div>
                          ))}
                          {Object.keys(submission.data).length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{Object.keys(submission.data).length - 3} more fields
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setShowSubmissionModal(true)
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Full Details
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs bg-red-500 hover:bg-red-600"
                          onClick={() => handleDeleteSubmission(submission)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={submission.status || 'new'}
                      onValueChange={(value) => handleStatusUpdate('form', submission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Form Submission Details Modal */}
      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Form Submission Details
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Submission Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Submission Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Applicant:</strong> {getDisplayName(selectedSubmission)}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedSubmission.user_email || 'Not provided'}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedSubmission.user_phone || 'Not provided'}
                  </div>
                  <div>
                    <strong>Application Type:</strong> {selectedSubmission.application_type || 'general'}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedSubmission.status || 'new'}
                  </div>
                  <div>
                    <strong>Submitted:</strong> {new Date(selectedSubmission.created_at).toLocaleString()}
                  </div>
                  <div>
                    <strong>Form ID:</strong> {selectedSubmission.form_id}
                  </div>
                </div>
              </div>

              {/* Form Data */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Form Responses</h3>
                <div className="space-y-3">
                  {Object.entries(selectedSubmission.data).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {formatFieldName(key, submission.form_id)}
                          </h4>
                          <div className="text-sm text-gray-600">
                            {Array.isArray(value) ? (
                              <ul className="list-disc list-inside space-y-1">
                                {value.map((item, index) => (
                                  <li key={index}>{String(item)}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="whitespace-pre-wrap">{String(value)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => setShowSubmissionModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <Select
                  value={selectedSubmission.status || 'new'}
                  onValueChange={(value) => {
                    handleStatusUpdate('form', selectedSubmission.id, value)
                    setShowSubmissionModal(false)
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmation.open}
        onOpenChange={confirmation.close}
        title={confirmation.title}
        description={confirmation.description}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        onConfirm={confirmation.onConfirm || (() => {})}
        loading={confirmation.loading}
      />
    </div>
  )
}
