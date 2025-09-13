"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Code,
  Smartphone,
  Settings,
  TrendingUp,
  Palette,
  Megaphone,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useContactPopup } from "@/hooks/use-contact-popup"
import Link from "next/link"

const services = [
  {
    id: "web-development",
    icon: Code,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Fast Loading",
      "Mobile Friendly",
      "CMS Integration",
      "E-commerce Ready",
    ],
    technologies: ["React", "Next.js", "Node.js", "MongoDB"],
  },
  {
    id: "app-development",
    icon: Smartphone,
    title: "App Development",
    description: "Native and cross-platform mobile applications for iOS and Android",
    gradient: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    features: [
      "Native Performance",
      "Cross Platform",
      "Push Notifications",
      "Offline Support",
      "App Store Optimization",
      "Analytics Integration",
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    id: "software-solutions",
    icon: Settings,
    title: "Software Solutions",
    description: "Custom software development and enterprise solutions",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    features: [
      "Custom Development",
      "Enterprise Grade",
      "Scalable Architecture",
      "API Integration",
      "Database Design",
      "Cloud Deployment",
    ],
    technologies: ["Python", "Java", "C#", "AWS", "Azure"],
  },
  {
    id: "lead-generation",
    icon: TrendingUp,
    title: "Lead Generation",
    description: "Strategic lead generation campaigns to grow your customer base",
    gradient: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    features: [
      "Targeted Campaigns",
      "Quality Leads",
      "CRM Integration",
      "Lead Scoring",
      "Performance Tracking",
      "ROI Optimization",
    ],
    technologies: ["Google Ads", "Facebook Ads", "LinkedIn", "HubSpot"],
  },
  {
    id: "branding",
    icon: Palette,
    title: "Branding & Design",
    description: "Modern branding, logo, and design packages for your business",
    gradient: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    features: [
      "Logo Design",
      "Brand Guidelines",
      "Marketing Materials",
      "Social Media Assets",
      "Print Design",
      "Brand Strategy",
    ],
    technologies: ["Adobe Creative Suite", "Figma", "Sketch"],
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Result-driven digital marketing and growth campaigns",
    gradient: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    features: [
      "SEO Optimization",
      "Social Media Marketing",
      "Content Marketing",
      "Email Campaigns",
      "PPC Advertising",
      "Analytics & Reporting",
    ],
    technologies: ["Google Analytics", "SEMrush", "Mailchimp", "Hootsuite"],
  },
  {
    id: "consulting",
    icon: TrendingUp,
    title: "Growth Consulting",
    description: "Expert business and growth consulting for startups and SMEs",
    gradient: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
    features: [
      "Business Analysis",
      "Growth Strategy",
      "Market Research",
      "Competitive Analysis",
      "Performance Metrics",
      "Action Planning",
    ],
    technologies: ["Business Intelligence", "Market Analysis Tools"],
  },
]

export default function Services() {
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const { openPopup } = useContactPopup()

  // Animation on scroll
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('.animate-fadein').forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('opacity-100', 'translate-y-0')
        }
      })
    }
    window.addEventListener('scroll', reveal)
    reveal()
    return () => window.removeEventListener('scroll', reveal)
  }, [])

  return (
    <section
      id="services"
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden animate-fadein opacity-0 translate-y-8 transition-all duration-1000"
    >
      {/* Background decorative elements - Mobile Optimized */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-5 sm:top-20 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-yellow-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-5 sm:bottom-20 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-blue-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <Sparkles className="absolute top-20 left-1/4 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400 animate-bounce" />
        <Sparkles className="absolute bottom-20 right-1/4 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-400 animate-bounce delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-yellow-100 rounded-full text-yellow-800 text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Our Premium Services
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
            Comprehensive Digital Solutions for Your Business
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            We offer a comprehensive range of digital services to help your business grow and succeed in today's
            competitive market with cutting-edge technology and proven strategies. Discover more at <Link href="/" className="text-yellow-600 underline font-semibold">Global Servicex</Link>.
          </p>
          {/* Animated gradient bar for visual appeal */}
          <div className="mx-auto mt-6 w-48 h-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 animate-pulse transition-all duration-700"></div>
        </div>

        {/* Mobile-First Service Cards */}
        <div className="space-y-4 sm:space-y-6 lg:hidden">
          {services.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedService === service.id

            return (
              <div key={service.id}>
                {/* Invisible anchor for accurate scrolling */}
                <div id={service.id} style={{ scrollMarginTop: '100px' }} aria-hidden="true"></div>
                <Card
                  className={`animate-fadein opacity-0 translate-y-8 transition-all duration-1000 transition-transform border-0 shadow-lg ${service.bgColor} backdrop-blur-sm`}
                >
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900">{service.title}</CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPopup()
                          }}
                          className={`bg-gradient-to-r ${service.gradient} text-white text-xs px-3 py-1`}
                        >
                          Quote
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>

                    {isExpanded && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm flex items-center mb-3">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Key Features
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {service.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                                  <span className="text-gray-700 text-xs">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-900 text-sm flex items-center mb-3">
                              <Settings className="w-4 h-4 text-blue-500 mr-2" />
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {service.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 ${service.bgColor} border border-gray-200 rounded-full text-xs font-medium ${service.iconColor}`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            openPopup()
                          }}
                          className={`w-full bg-gradient-to-r ${service.gradient} text-white font-semibold py-3 text-sm`}
                        >
                          Get Quote for {service.title}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedService === service.id

            return (
              <div key={service.id}>
                {/* Invisible anchor for accurate scrolling */}
                <div id={service.id} style={{ scrollMarginTop: '100px' }} aria-hidden="true"></div>
                <Card
                  className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg ${
                    isExpanded ? "xl:col-span-3 shadow-2xl" : ""
                  } ${service.bgColor} backdrop-blur-sm`}
                  onClick={() => setExpandedService(isExpanded ? null : service.id)}
                >
                  <CardHeader className="relative">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                      </div>
                      {!isExpanded && (
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 mb-4 text-base leading-relaxed">
                      {service.description}
                    </CardDescription>

                    {isExpanded && (
                      <div className="space-y-8 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-lg flex items-center">
                              <Check className="w-5 h-5 text-green-500 mr-2" />
                              Key Features
                            </h4>
                            <ul className="space-y-3">
                              {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                                  <span className="text-gray-700 font-medium">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-lg flex items-center">
                              <Settings className="w-5 h-5 text-blue-500 mr-2" />
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {service.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className={`px-4 py-2 ${service.bgColor} border border-gray-200 rounded-full text-sm font-medium ${service.iconColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-200">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              openPopup()
                            }}
                            className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg text-white font-semibold py-4 text-lg transition-all duration-300 transform hover:scale-105`}
                          >
                            Get Quote for {service.title}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isExpanded && (
                      <Button
                        variant="outline"
                        className={`w-full mt-4 border-2 ${service.iconColor} hover:bg-gradient-to-r ${service.gradient} hover:text-white hover:border-transparent transition-all duration-300`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
