"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Award, Zap, Target, Rocket, Smartphone } from "lucide-react"
import { useContactPopup } from "@/hooks/use-contact-popup"
import AIConsultant from "@/components/ai-consultant"
import { useEffect, useState } from "react"

export default function Hero() {
  const { openPopup } = useContactPopup()
  const [showClientOnly, setShowClientOnly] = useState(false)

  useEffect(() => {
    setShowClientOnly(true)
  }, [])

  return (
    <section className="pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-yellow-50 via-white to-blue-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-green-200 rounded-full opacity-10 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-yellow-100 rounded-full text-yellow-800 text-xs sm:text-sm font-medium mb-4">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                #1 Digital Solutions Provider
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Grow Your Business with{" "}
                <span className="text-yellow-600 relative">
                  Global Servicex
                  {showClientOnly && (
                    <svg
                      className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3"
                      viewBox="0 0 300 12"
                      fill="none"
                    >
                      <path
                        d="M1 6C50 1 100 11 150 6C200 1 250 11 299 6"
                        stroke="#EAB308"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                We provide comprehensive digital solutions including web development, app development, software
                solutions, lead generation, branding, marketing, and growth counseling to help your business thrive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                onClick={openPopup}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <AIConsultant />
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/50 rounded-lg p-3 sm:p-0 sm:bg-transparent">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold text-sm sm:text-base">4.9/5</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/50 rounded-lg p-3 sm:p-0 sm:bg-transparent">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-gray-700 font-semibold text-sm sm:text-base">500+ Clients</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/50 rounded-lg p-3 sm:p-0 sm:bg-transparent">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-gray-700 font-semibold text-sm sm:text-base">Award Winning</span>
              </div>
            </div>
          </div>

          {/* Visual Section - Mobile Optimized */}
          <div className="relative animate-fade-in-right mt-8 lg:mt-0">
            {/* Main illustration */}
            <div className="relative z-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {/* Web Development Icon */}
                <div className="bg-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-lg sm:rounded-xl mx-auto mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Web Dev</h3>
                </div>

                {/* Mobile App Icon */}
                <div className="bg-green-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-green-500 rounded-lg sm:rounded-xl mx-auto mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Mobile Apps</h3>
                </div>

                {/* Marketing Icon */}
                <div className="bg-purple-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-purple-500 rounded-lg sm:rounded-xl mx-auto mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Marketing</h3>
                </div>

                {/* Growth Icon */}
                <div className="bg-orange-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-orange-500 rounded-lg sm:rounded-xl mx-auto mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">Growth</h3>
                </div>
              </div>

              {/* Central connecting element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Only render floating elements on client to avoid hydration mismatch */}
            {showClientOnly && (
              <>
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-yellow-200 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-blue-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
                <div className="absolute -top-4 left-4 sm:-top-8 sm:left-8 bg-white rounded-lg shadow-lg p-2 sm:p-3 lg:p-4 animate-bounce">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">500+ Projects</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
