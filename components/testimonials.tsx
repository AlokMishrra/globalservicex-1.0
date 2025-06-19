"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechStart Solutions",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Global Servicex transformed our business with their exceptional web development and marketing services. Our online presence has grown tremendously!",
  },
  {
    name: "Priya Sharma",
    company: "Fashion Hub",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "The team at Global Servicex is incredibly professional. They helped us build a beautiful e-commerce platform that increased our sales by 300%.",
  },
  {
    name: "Amit Patel",
    company: "Digital Innovations",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Their growth counseling services provided us with valuable insights. We implemented their strategies and saw immediate improvements in our business metrics.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-md">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 opacity-50 absolute -top-2 -left-2" />
                  <p className="text-gray-600 italic pl-4 sm:pl-6 text-sm sm:text-base leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
