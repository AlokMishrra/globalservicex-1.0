"use client"

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Eye, 
  Copy, 
  Move, 
  Type, 
  Mail, 
  Phone, 
  Calendar, 
  CheckSquare, 
  List,
  Hash,
  FileText,
  Upload
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export interface FormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date' | 'file'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface FormData {
  id?: string
  title: string
  description: string
  fields: FormField[]
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

interface FormBuilderProps {
  onSave: (form: FormData) => void
  onUpdate?: (form: FormData) => void
  onDelete?: (formId: string) => void
  initialForm?: FormData
  onPreview?: (form: FormData) => void
  isEditing?: boolean
}

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'tel', label: 'Phone', icon: Phone },
  { type: 'textarea', label: 'Text Area', icon: FileText },
  { type: 'select', label: 'Dropdown', icon: List },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio', icon: CheckSquare },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'file', label: 'File Upload', icon: Upload },
]

export default function FormBuilder({ onSave, onUpdate, onDelete, initialForm, onPreview, isEditing = false }: FormBuilderProps) {
  const [form, setForm] = useState<FormData>(initialForm || {
    title: '',
    description: '',
    fields: [],
    isPublished: false
  })
  
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [draggedField, setDraggedField] = useState<FormField | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    }
    
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
    
    setEditingField(newField)
    toast.success("Field Added", "New field has been added to your form")
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
    
    if (editingField?.id === fieldId) {
      setEditingField({ ...editingField, ...updates })
    }
  }

  const deleteField = (fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
    
    if (editingField?.id === fieldId) {
      setEditingField(null)
    }
    
    toast.success("Field Deleted", "Field has been removed from your form")
  }

  const duplicateField = (field: FormField) => {
    const newField: FormField = {
      ...field,
      id: `field_${Date.now()}`,
      label: `${field.label} (Copy)`
    }
    
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
    
    toast.success("Field Duplicated", "Field has been duplicated")
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    setForm(prev => {
      const newFields = [...prev.fields]
      const [movedField] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, movedField)
      return { ...prev, fields: newFields }
    })
  }

  const handleDragStart = (e: React.DragEvent, field: FormField) => {
    setDraggedField(field)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedField) return

    const draggedIndex = form.fields.findIndex(field => field.id === draggedField.id)
    if (draggedIndex !== targetIndex) {
      moveField(draggedIndex, targetIndex)
    }
    setDraggedField(null)
  }

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Validation Error", "Please enter a form title")
      return
    }
    
    if (form.fields.length === 0) {
      toast.error("Validation Error", "Please add at least one field to your form")
      return
    }

    const formToSave = {
      ...form,
      updatedAt: new Date().toISOString()
    }
    
    if (isEditing && onUpdate) {
      onUpdate(formToSave)
      toast.success("Form Updated", "Your form has been updated successfully")
    } else {
      onSave(formToSave)
      toast.success("Form Saved", "Your form has been saved successfully")
    }
  }

  const handleDelete = () => {
    if (onDelete && form.id) {
      onDelete(form.id)
      setShowDeleteConfirm(false)
      toast.success("Form Deleted", "The form has been deleted successfully")
    }
  }

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder,
      required: field.required,
      className: "w-full"
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return <Input type={field.type} {...commonProps} />
      
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />
      
      case 'select':
        return (
          <Select>
            <SelectTrigger>
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
                <Checkbox id={`${field.id}_${index}`} />
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
                <input type="radio" name={field.id} id={`${field.id}_${index}`} />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      
      case 'date':
        return <Input type="date" {...commonProps} />
      
      case 'file':
        return <Input type="file" {...commonProps} />
      
      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Form Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="form-title">Form Title *</Label>
              <Input
                id="form-title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-description">Description</Label>
              <Input
                id="form-description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter form description"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Form" : "Save Form"}
            </Button>
            {onPreview && (
              <Button onClick={() => onPreview(form)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
            <Button 
              onClick={() => setForm(prev => ({ ...prev, isPublished: !prev.isPublished }))}
              variant={form.isPublished ? "default" : "outline"}
              className={form.isPublished ? "bg-green-500" : ""}
            >
              {form.isPublished ? "Published" : "Publish"}
            </Button>
            {isEditing && onDelete && (
              <Button 
                onClick={() => setShowDeleteConfirm(true)} 
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Form
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Field Types */}
      <Card>
        <CardHeader>
          <CardTitle>Add Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {FIELD_TYPES.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addField(type)}
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs text-center">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields ({form.fields.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {form.fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No fields added yet. Click on a field type above to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.fields.map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, field)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Move className="w-4 h-4 text-gray-400" />
                      <Badge variant="outline">{field.type}</Badge>
                      <span className="font-medium">{field.label}</span>
                      {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingField(field)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateField(field)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteField(field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {renderFieldPreview(field)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Field Editor Dialog */}
      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          {editingField && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field-label">Field Label *</Label>
                  <Input
                    id="field-label"
                    value={editingField.label}
                    onChange={(e) => updateField(editingField.id, { label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={editingField.placeholder || ''}
                    onChange={(e) => updateField(editingField.id, { placeholder: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-required"
                  checked={editingField.required}
                  onCheckedChange={(checked) => updateField(editingField.id, { required: checked as boolean })}
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

              {(editingField.type === 'select' || editingField.type === 'radio' || editingField.type === 'checkbox') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {editingField.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(editingField.options || [])]
                            newOptions[index] = e.target.value
                            updateField(editingField.id, { options: newOptions })
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newOptions = editingField.options?.filter((_, i) => i !== index) || []
                            updateField(editingField.id, { options: newOptions })
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newOptions = [...(editingField.options || []), 'New Option']
                        updateField(editingField.id, { options: newOptions })
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button onClick={() => setEditingField(null)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this form? This action cannot be undone and will also delete all associated submissions.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
