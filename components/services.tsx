"use client"

import { useState } from "react"
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
    price: "Starting from ₹9,000",
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
    price: "Starting from ₹18,000",
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
    price: "Starting from ₹75,000",
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
    price: "Starting from ₹15,000/month",
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
    price: "Starting from ₹5,000",
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
    price: "Starting from ₹8,000",
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
    price: "Starting from ₹1,499",
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

  return (
    <section
      id="services"
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
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
        </div>

        {/* Mobile-First Service Cards */}
        <div className="space-y-4 sm:space-y-6 lg:hidden">
          {services.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedService === service.id

            return (
              <Card
                key={service.id}
                className={`transition-all duration-300 border-0 shadow-lg ${service.bgColor} backdrop-blur-sm`}
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
                        <div className={`text-sm font-bold ${service.iconColor} mt-1`}>{service.price}</div>
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
            )
          })}
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            const isExpanded = expandedService === service.id

            return (
              <Card
                key={service.id}
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
                      <div className={`text-lg font-bold ${service.iconColor} mt-1`}>{service.price}</div>
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
            )
          })}
        </div>

        {/* CTA Section - Mobile Optimized */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto shadow-xl border border-yellow-100">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Get Free Consultation & Guidance
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Not sure which service is right for you? Get free consultation and guidance from our experts to help grow
              your business. We'll analyze your needs and recommend the best solutions.
            </p>
            <Button
              onClick={openPopup}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Book Free Consultation
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
