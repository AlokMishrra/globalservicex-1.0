"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  QrCode, 
  Check,
  Mail,
  MessageSquare,
  Link as LinkIcon
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { FormData } from "@/components/form-builder"

interface FormShareProps {
  form: FormData
  baseUrl?: string
}

export default function FormShare({ form, baseUrl = "https://globalservicex.in" }: FormShareProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  
  const formUrl = `${baseUrl}/form/${form.id}`
  const shortUrl = `${baseUrl}/f/${form.id?.slice(0, 8)}` // Short URL for easier sharing

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied!", `${type} has been copied to clipboard`)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Copy Failed", "Failed to copy to clipboard")
    }
  }

  const shareViaEmail = () => {
    const subject = `Form: ${form.title}`
    const body = `Hi,\n\nI'd like to share this form with you:\n\n${form.title}\n${form.description}\n\nYou can access it here: ${formUrl}\n\nBest regards`
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  const shareViaWhatsApp = () => {
    const message = `Check out this form: ${form.title}\n\n${formUrl}`
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, '_blank')
  }

  const generateQRCode = () => {
    // Simple QR code generation using a service
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formUrl)}`
    return qrUrl
  }

  if (!form.isPublished) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Form must be published to share</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Share2 className="w-5 h-5" />
          Share Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form URL */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-green-800">Form URL</Label>
          <div className="flex gap-2">
            <Input 
              value={formUrl} 
              readOnly 
              className="bg-white border-green-300 text-sm"
            />
            <Button
              size="sm"
              onClick={() => copyToClipboard(formUrl, "Form URL")}
              className="bg-green-600 hover:bg-green-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(formUrl, '_blank')}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Short URL */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-green-800">Short URL</Label>
          <div className="flex gap-2">
            <Input 
              value={shortUrl} 
              readOnly 
              className="bg-white border-green-300 text-sm"
            />
            <Button
              size="sm"
              onClick={() => copyToClipboard(shortUrl, "Short URL")}
              className="bg-green-600 hover:bg-green-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-green-800">Quick Share</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={shareViaEmail}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={shareViaWhatsApp}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-green-800">QR Code</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-100"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code for {form.title}
                </DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <img 
                    src={generateQRCode()} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Scan this QR code to access the form on mobile devices
                </p>
                <Button
                  onClick={() => copyToClipboard(formUrl, "Form URL")}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Form Info */}
        <div className="pt-2 border-t border-green-200">
          <div className="flex items-center justify-between text-xs text-green-700">
            <span>Form ID: {form.id?.slice(0, 8)}...</span>
            <Badge variant="default" className="bg-green-500 text-white">
              Published
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
