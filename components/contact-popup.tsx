"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useContactPopup } from "@/hooks/use-contact-popup"
import { Send, Phone, Mail, MapPin, Clock, CreditCard, Calendar } from "lucide-react"
import { createContact } from "@/lib/database"
import { toast } from "@/hooks/use-toast"

const services = [
  "Web Development",
  "App Development",
  "Software Solutions",
  "Lead Generation",
  "Branding & Design",
  "Digital Marketing",
  "Growth Counseling",
  "Free Consultation",
]

const budgetRanges = [
  "Under ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,50,000",
  "₹2,50,000 - ₹5,00,000",
  "Above ₹5,00,000",
]

const paymentOptions = [
  "Full Payment",
  "EMI - 3 Months (0% Interest)",
  "EMI - 6 Months (2% Interest)",
  "EMI - 12 Months (5% Interest)",
  "Custom Payment Plan",
]

export default function ContactPopup() {
  const { isOpen, closePopup } = useContactPopup()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    services: [] as string[],
    budget: "",
    timeline: "",
    paymentOption: "",
    message: "",
    agreeToTerms: false,
  })

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked ? [...prev.services, service] : prev.services.filter((s) => s !== service),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || '',
        website: formData.website || '',
        services: formData.services,
        budget: formData.budget || '',
        timeline: formData.timeline || '',
        message: `${formData.message}\n\nPayment Preference: ${formData.paymentOption}` || '',
      })

      toast.success(
        "Inquiry Submitted Successfully! 🎉",
        "Thank you for your interest! Our team will contact you within 24 hours with a detailed proposal and payment options.",
      )

      closePopup()

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        services: [],
        budget: "",
        timeline: "",
        paymentOption: "",
        message: "",
        agreeToTerms: false,
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast.error(
        "Submission Failed",
        "There was an error submitting your inquiry. Please try again or contact us directly.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closePopup}>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <CreditCard className="w-6 h-6 text-yellow-600" />
            Get Your Free Consultation
          </DialogTitle>
          <p className="text-sm sm:text-base text-gray-600">
            Fill out the form below and we'll get back to you within 24 hours with flexible payment options
          </p>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Enter your full name"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="Enter your email"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website URL (if any)
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Services Required *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white">
                  {services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      <Checkbox
                        id={service}
                        checked={formData.services.includes(service)}
                        onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                      />
                      <Label htmlFor={service} className="text-sm cursor-pointer">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium">
                    Budget Range
                  </Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-sm font-medium">
                    Project Timeline
                  </Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}
                  >
                    <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="2-3-months">2-3 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentOption" className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-yellow-600" />
                  Payment Preference
                </Label>
                <Select
                  value={formData.paymentOption}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentOption: value }))}
                >
                  <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-yellow-500">
                    <SelectValue placeholder="Choose payment option" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Project Details
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us more about your project requirements..."
                  rows={4}
                  className="resize-none transition-all duration-200 focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
                  required
                  className="mt-1 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the Terms & Conditions and Privacy Policy *
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 h-12 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                disabled={!formData.agreeToTerms || formData.services.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 border shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                <Phone className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm sm:text-base">Phone</div>
                  <div className="text-gray-600 text-sm">
                    <a
                      href="https://wa.me/917248316506"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-500 underline"
                      title="Chat on WhatsApp"
                    >
                      +91 7248316506
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                <Mail className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm sm:text-base">Email</div>
                  <div className="text-gray-600 text-sm">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=globalservicex369@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-500 underline"
                      title="Send Email via Gmail"
                    >
                      globalservicex369@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                <MapPin className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm sm:text-base">Address</div>
                  <div className="text-gray-600 text-sm">
                    Dehradun Road, 247667, Uttarakhand
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                Business Hours
              </h4>
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                <div>Saturday: 10:00 AM - 5:00 PM</div>
                <div>Sunday: Closed</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Quick Response Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-yellow-700">
                We guarantee to respond to all inquiries within 24 hours during business days with detailed proposals
                and flexible payment options.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 sm:p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Flexible Payment Options
              </h4>
              <p className="text-xs sm:text-sm text-green-700">
                EMI options available with 0% interest for 3 months. Custom payment plans for larger projects.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
