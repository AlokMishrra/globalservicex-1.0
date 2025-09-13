"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { submitForm, getSubmissionStatus } from "@/lib/database"
import type { FormData, FormField } from "@/components/form-builder"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

interface FormRendererProps {
  form: FormData
  onSubmit?: (data: any) => void
  showTitle?: boolean
}

export default function FormRenderer({ form, onSubmit, showTitle = true }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submissionStatus, setSubmissionStatus] = useState<'none' | 'applied' | 'rejected' | 'deleted'>('none')
  const [userEmail, setUserEmail] = useState<string>('')

  // Check submission status when component mounts or email changes
  useEffect(() => {
    const checkStatus = async () => {
      if (userEmail && form.id) {
        try {
          const statusInfo = await getSubmissionStatus(form.id, userEmail)
          if (!statusInfo.canApply) {
            setSubmissionStatus('applied')
          } else if (statusInfo.status === 'rejected') {
            setSubmissionStatus('rejected')
          } else if (statusInfo.status === 'deleted') {
            setSubmissionStatus('deleted')
          } else {
            setSubmissionStatus('none')
          }
        } catch (error) {
          console.error('Error checking submission status:', error)
        }
      }
    }
    checkStatus()
  }, [userEmail, form.id])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Track email for submission status checking
    if (fieldId.toLowerCase().includes('email') && typeof value === 'string') {
      setUserEmail(value)
    }
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    form.fields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        newErrors[field.id] = `${field.label} is required`
      }
      
      // Email validation
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address'
        }
      }
      
      // Phone validation
      if (field.type === 'tel' && formData[field.id]) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(formData[field.id].replace(/[\s\-\(\)]/g, ''))) {
          newErrors[field.id] = 'Please enter a valid phone number'
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Validation Error", "Please fill in all required fields correctly")
      return
    }

    // Check if user has already applied
    if (submissionStatus === 'applied') {
      toast.warning("Already Applied", "You have already submitted an application for this position. Please wait for our response.")
      return
    }
    
    setSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Extract user information from form data - try multiple possible field names
        const userInfo = {
          email: formData.email || formData.field_email || formData.user_email || 
                 formData['email'] || formData['Email'] || formData['EMAIL'] ||
                 Object.values(formData).find((value, index) => 
                   Object.keys(formData)[index].toLowerCase().includes('email')
                 ),
          name: formData.name || formData.field_name || formData.user_name || 
                formData['name'] || formData['Name'] || formData['NAME'] ||
                formData['full_name'] || formData['fullName'] || formData['Full Name'] ||
                Object.values(formData).find((value, index) => 
                  Object.keys(formData)[index].toLowerCase().includes('name')
                ),
          phone: formData.phone || formData.field_phone || formData.user_phone || 
                 formData['phone'] || formData['Phone'] || formData['PHONE'] ||
                 formData['mobile'] || formData['Mobile'] || formData['contact'] ||
                 Object.values(formData).find((value, index) => 
                   Object.keys(formData)[index].toLowerCase().includes('phone') ||
                   Object.keys(formData)[index].toLowerCase().includes('mobile') ||
                   Object.keys(formData)[index].toLowerCase().includes('contact')
                 ),
          applicationType: form.type === 'job' ? 'job_application' : 'general'
        }
        
        console.log('Extracted user info:', userInfo)
        
        await submitForm(form.id!, formData, userInfo)
        setSubmissionStatus('applied')
      }
      
      toast.success("Application Submitted Successfully!", "Your application has been received and we'll get back to you within 24 hours.")
      setFormData({})
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error("Submission Failed", "There was an error submitting your form. Please try again or contact us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      className: `w-full ${errors[field.id] ? 'border-red-500' : ''}`,
      value: formData[field.id] || '',
      onChange: (e: any) => handleInputChange(field.id, e.target.value)
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return <Input type={field.type} {...commonProps} />
      
      case 'textarea':
        return (
          <Textarea 
            {...commonProps} 
            rows={4}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        )
      
      case 'select':
        return (
          <Select 
            value={formData[field.id] || ''} 
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger className={errors[field.id] ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${field.id}_${index}`}
                  checked={formData[field.id]?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.id] || []
                    if (checked) {
                      handleInputChange(field.id, [...currentValues, option])
                    } else {
                      handleInputChange(field.id, currentValues.filter((v: string) => v !== option))
                    }
                  }}
                />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={field.id} 
                  id={`${field.id}_${index}`}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="text-yellow-500 focus:ring-yellow-500"
                />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      
      case 'date':
        return <Input type="date" {...commonProps} />
      
      case 'file':
        return (
          <div>
            <Input 
              type="file" 
              {...commonProps}
              onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        )
      
      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            {form.title}
          </CardTitle>
          {form.description && (
            <p className="text-center text-gray-600 mt-2">
              {form.description}
            </p>
          )}
        </CardHeader>
      )}
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {renderField(field)}
              
              {errors[field.id] && (
                <p className="text-sm text-red-500">{errors[field.id]}</p>
              )}
            </div>
          ))}
          
          {/* Submission Status Display */}
          {submissionStatus === 'applied' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Application Submitted</h3>
                  <p className="text-sm text-green-700">Your application has been received and is under review. We'll get back to you within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          {submissionStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Application Rejected</h3>
                  <p className="text-sm text-red-700">Your previous application was not selected. You can submit a new application below.</p>
                </div>
              </div>
            </div>
          )}

          {submissionStatus === 'deleted' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Application Removed</h3>
                  <p className="text-sm text-yellow-700">Your previous application was removed. You can submit a new application below.</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            {submissionStatus === 'applied' ? (
              <Button 
                type="button" 
                disabled
                className="w-full bg-gray-400 text-white font-semibold py-3 cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Application Submitted
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : submissionStatus === 'rejected' || submissionStatus === 'deleted' ? (
                  'Re-apply Now'
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

