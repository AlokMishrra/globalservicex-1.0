"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Sparkles,
  Zap,
  Palette,
  Code,
  Smartphone,
  TrendingUp,
  Users,
  Send,
  Download,
  Wand2,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createAIConsultation } from "@/lib/database"
import { useContactPopup } from "@/hooks/use-contact-popup"

interface AIRecommendation {
  category: string
  title: string
  description: string
  features: string[]
  estimatedCost: string
  timeline: string
  priority: "high" | "medium" | "low"
  icon: any
}

interface DemoWebsite {
  name: string
  description: string
  features: string[]
  pages: string[]
  design: string
  colors: string[]
  preview: string
}

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { openPopup } = useContactPopup()
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    businessType: "",
    targetAudience: "",
    goals: "",
    budget: "",
    timeline: "",
    currentWebsite: "",
    competitors: "",
    specialRequirements: "",
    preferredColors: "",
    designStyle: "",
  })
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [demoWebsite, setDemoWebsite] = useState<DemoWebsite | null>(null)
  const [subdomain, setSubdomain] = useState("")

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Education",
    "Real Estate",
    "Food & Restaurant",
    "Fashion",
    "Travel & Tourism",
    "Manufacturing",
    "Consulting",
    "Non-profit",
    "Other",
  ]

  const businessTypes = [
    "Startup",
    "Small Business",
    "Medium Enterprise",
    "Large Corporation",
    "Freelancer",
    "Agency",
    "E-commerce Store",
    "Service Provider",
    "SaaS Company",
    "Blog/Content Site",
  ]

  const designStyles = [
    "Modern & Minimalist",
    "Bold & Colorful",
    "Professional & Corporate",
    "Creative & Artistic",
    "Tech & Futuristic",
    "Elegant & Luxury",
    "Fun & Playful",
    "Classic & Traditional",
  ]

  const generateRecommendations = async () => {
    setLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiRecommendations: AIRecommendation[] = [
      {
        category: "Web Development",
        title: "Custom Business Website",
        description: `A professional ${formData.designStyle.toLowerCase()} website tailored for ${formData.industry.toLowerCase()} industry`,
        features: [
          "Responsive Design",
          "SEO Optimization",
          "Contact Forms",
          "Social Media Integration",
          "Analytics Setup",
          "Mobile Optimization",
        ],
        estimatedCost: formData.budget === "Under ₹25,000" ? "₹20,000 - ₹30,000" : "₹35,000 - ₹50,000",
        timeline: formData.timeline === "ASAP" ? "2-3 weeks" : "3-4 weeks",
        priority: "high",
        icon: Code,
      },
      {
        category: "Digital Marketing",
        title: "AI-Powered Marketing Strategy",
        description: `Comprehensive digital marketing plan targeting ${formData.targetAudience}`,
        features: [
          "SEO Strategy",
          "Social Media Marketing",
          "Content Marketing",
          "PPC Campaigns",
          "Email Marketing",
          "Analytics & Reporting",
        ],
        estimatedCost: "₹15,000 - ₹25,000/month",
        timeline: "Ongoing",
        priority: "high",
        icon: TrendingUp,
      },
      {
        category: "Branding",
        title: "Complete Brand Identity",
        description: "Professional branding package including logo, colors, and brand guidelines",
        features: [
          "Logo Design",
          "Brand Guidelines",
          "Color Palette",
          "Typography",
          "Business Cards",
          "Social Media Assets",
        ],
        estimatedCost: "₹12,000 - ₹20,000",
        timeline: "1-2 weeks",
        priority: "medium",
        icon: Palette,
      },
    ]

    if (formData.businessType.includes("E-commerce")) {
      aiRecommendations.push({
        category: "E-commerce",
        title: "Online Store Development",
        description: "Full-featured e-commerce platform with payment integration",
        features: [
          "Product Catalog",
          "Shopping Cart",
          "Payment Gateway",
          "Inventory Management",
          "Order Tracking",
          "Customer Accounts",
        ],
        estimatedCost: "₹50,000 - ₹1,00,000",
        timeline: "4-6 weeks",
        priority: "high",
        icon: Smartphone,
      })
    }

    setRecommendations(aiRecommendations)
    setLoading(false)
    setStep(3)
  }

  const generateDemoWebsite = async () => {
    setLoading(true)

    // Simulate AI website generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const colors = formData.preferredColors.split(",").map((c) => c.trim()) || [
      "#3B82F6",
      "#1E40AF",
      "#F59E0B",
      "#FFFFFF",
    ]

    const demo: DemoWebsite = {
      name: formData.businessName || "Your Business",
      description: `A ${formData.designStyle.toLowerCase()} website designed for ${formData.industry.toLowerCase()} businesses`,
      features: [
        "Hero Section with Call-to-Action",
        "About Us Section",
        "Services/Products Showcase",
        "Testimonials",
        "Contact Form",
        "Footer with Social Links",
      ],
      pages: ["Home", "About", "Services", "Portfolio", "Contact", "Blog"],
      design: formData.designStyle,
      colors: colors,
      preview: `data:image/svg+xml;base64,${btoa(`
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="400" fill="${colors[0] || "#f3f4f6"}"/>
          <rect x="50" y="50" width="500" height="60" fill="${colors[1] || "#ffffff"}" rx="8"/>
          <text x="300" y="85" textAnchor="middle" fill="${colors[2] || "#1f2937"}" fontFamily="Arial" fontSize="24" fontWeight="bold">${formData.businessName || "Your Business"}</text>
          <rect x="50" y="130" width="240" height="120" fill="${colors[3] || "#e5e7eb"}" rx="8"/>
          <rect x="310" y="130" width="240" height="120" fill="${colors[3] || "#e5e7eb"}" rx="8"/>
          <rect x="50" y="270" width="500" height="80" fill="${colors[1] || "#ffffff"}" rx="8"/>
          <text x="300" y="315" textAnchor="middle" fill="${colors[2] || "#1f2937"}" fontFamily="Arial" fontSize="16">${formData.designStyle} Design Preview</text>
        </svg>
      `)}`,
    }

    setDemoWebsite(demo)

    // Save consultation to database
    try {
      await createAIConsultation({
        business_name: formData.businessName,
        industry: formData.industry,
        business_type: formData.businessType,
        target_audience: formData.targetAudience,
        goals: formData.goals,
        budget: formData.budget,
        timeline: formData.timeline,
        current_website: formData.currentWebsite,
        competitors: formData.competitors,
        special_requirements: formData.specialRequirements,
        preferred_colors: formData.preferredColors,
        design_style: formData.designStyle,
        recommendations: recommendations,
        demo_website: demo,
      })
    } catch (error) {
      console.error("Error saving consultation:", error)
    }

    setLoading(false)
    setStep(4)

    toast.success("Demo Website Generated! 🎉", "Your AI-powered demo website is ready for preview")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 2) {
      generateRecommendations()
    }
  }

  const resetConsultant = () => {
    setStep(1)
    setFormData({
      businessName: "",
      industry: "",
      businessType: "",
      targetAudience: "",
      goals: "",
      budget: "",
      timeline: "",
      currentWebsite: "",
      competitors: "",
      specialRequirements: "",
      preferredColors: "",
      designStyle: "",
    })
    setRecommendations([])
    setDemoWebsite(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse">
          <Bot className="w-5 h-5 mr-2" />
          AI Business Consultant
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Bot className="w-8 h-8 text-purple-600" />
            AI Business Consultant
            <Wand2 className="w-6 h-6 text-pink-500" />
          </DialogTitle>
          <p className="text-center text-gray-600">
            Get personalized recommendations and create your demo website with AI
          </p>
        </DialogHeader>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to AI Business Consultant</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Our AI will analyze your business needs and create personalized recommendations along with a custom demo
                website tailored specifically for your business.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Smart Analysis</h4>
                    <p className="text-sm text-gray-600">AI analyzes your business to provide tailored solutions</p>
                  </CardContent>
                </Card>
                <Card className="border-pink-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Rocket className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Custom Recommendations</h4>
                    <p className="text-sm text-gray-600">Get personalized service recommendations and pricing</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Demo Website</h4>
                    <p className="text-sm text-gray-600">See your website come to life with AI-generated demo</p>
                  </CardContent>
                </Card>
              </div>
              <Button
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
              >
                Start AI Consultation
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Business Information Form */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                    required
                    placeholder="Enter your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under ₹25,000">Under ₹25,000</SelectItem>
                      <SelectItem value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</SelectItem>
                      <SelectItem value="Above ₹2,50,000">Above ₹2,50,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                  required
                  placeholder="e.g., Young professionals, Small business owners, Students"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Business Goals *</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                  required
                  placeholder="What do you want to achieve with your digital presence?"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="designStyle">Preferred Design Style</Label>
                  <Select
                    value={formData.designStyle}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, designStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select design style" />
                    </SelectTrigger>
                    <SelectContent>
                      {designStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredColors">Preferred Colors</Label>
                  <Input
                    id="preferredColors"
                    value={formData.preferredColors}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preferredColors: e.target.value }))}
                    placeholder="e.g., Blue, White, Gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialRequirements: e.target.value }))}
                  placeholder="Any specific features or requirements you need?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subdomain" className="font-semibold text-gray-700">Choose your subdomain</label>
                <input
                  id="subdomain"
                  type="text"
                  className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-yellow-500"
                  placeholder="yourbrand"
                  value={subdomain}
                  onChange={e => setSubdomain(e.target.value.replace(/[^a-z0-9-]/g, ""))}
                />
                <span className="text-xs text-gray-500">Your site will be hosted at: <span className="font-mono text-yellow-700">{subdomain || "yourbrand"}.globalservicex.com</span></span>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      AI is analyzing...
                    </div>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Get AI Recommendations
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: AI Recommendations */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Recommendations</h3>
              <p className="text-gray-600">Based on your business profile, here are our personalized recommendations</p>
            </div>

            <div className="grid gap-6">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon
                return (
                  <Card
                    key={index}
                    className={`border-l-4 ${
                      rec.priority === "high"
                        ? "border-l-green-500 bg-green-50"
                        : rec.priority === "medium"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                    } hover:shadow-lg transition-shadow`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              rec.priority === "high"
                                ? "bg-green-100"
                                : rec.priority === "medium"
                                  ? "bg-yellow-100"
                                  : "bg-blue-100"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                rec.priority === "high"
                                  ? "text-green-600"
                                  : rec.priority === "medium"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <Badge
                              variant="secondary"
                              className={
                                rec.priority === "high"
                                  ? "bg-green-100 text-green-800"
                                  : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }
                            >
                              {rec.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{rec.estimatedCost}</div>
                          <div className="text-sm text-gray-600">{rec.timeline}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{rec.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {rec.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Form
              </Button>
              <Button
                onClick={generateDemoWebsite}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Demo Website...
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Demo Website
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Demo Website */}
        {step === 4 && demoWebsite && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your AI-Generated Demo Website</h3>
              <p className="text-gray-600">Here's a preview of your custom website design</p>
            </div>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  {demoWebsite.name}
                </CardTitle>
                <p className="text-gray-600">{demoWebsite.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <img
                    src={demoWebsite.preview || "/placeholder.svg"}
                    alt="Website Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      Website Features
                    </h4>
                    <ul className="space-y-2">
                      {demoWebsite.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      Website Pages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {demoWebsite.pages.map((page, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                          {page}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    Color Scheme
                  </h4>
                  <div className="flex gap-3">
                    {demoWebsite.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-sm font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back to Recommendations
              </Button>
              <Button
                onClick={() => {
                  toast.success("Demo Downloaded! 📁", "Your demo website specifications have been prepared")
                }}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Demo Specs
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  openPopup()
                  toast.info("Contact Us", "Our team will reach out to discuss your project!")
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Start This Project
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button variant="ghost" onClick={resetConsultant} className="text-gray-600">
                Start New Consultation
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
