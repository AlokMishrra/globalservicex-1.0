"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Calendar, ArrowRight, Star, Zap, Shield, Headphones } from "lucide-react"
import { useContactPopup } from "@/hooks/use-contact-popup"

const pricingPlans = [
  {
    id: "starter",
    name: "Starter Package",
    description: "Perfect for small businesses and startups",
    price: 25000,
    originalPrice: 35000,
    popular: false,
    features: [
      "Responsive Website (5 pages)",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Mobile Optimization",
      "1 Month Support",
      "Social Media Integration",
    ],
    emiOptions: [
      { months: 3, amount: 8500, interest: 0 },
      { months: 6, amount: 4500, interest: 2 },
    ],
  },
  {
    id: "professional",
    name: "Professional Package",
    description: "Ideal for growing businesses",
    price: 75000,
    originalPrice: 95000,
    popular: true,
    features: [
      "Custom Web Application",
      "Advanced SEO & Analytics",
      "E-commerce Integration",
      "Payment Gateway Setup",
      "3 Months Support",
      "Content Management System",
      "Performance Optimization",
      "Security Features",
    ],
    emiOptions: [
      { months: 3, amount: 25500, interest: 0 },
      { months: 6, amount: 13000, interest: 2 },
      { months: 12, amount: 7000, interest: 5 },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Package",
    description: "Complete solution for large businesses",
    price: 150000,
    originalPrice: 200000,
    popular: false,
    features: [
      "Full-Stack Application",
      "Custom Software Development",
      "API Development & Integration",
      "Database Design & Optimization",
      "6 Months Support",
      "Advanced Security Features",
      "Performance Monitoring",
      "Dedicated Project Manager",
      "Training & Documentation",
    ],
    emiOptions: [
      { months: 3, amount: 51000, interest: 0 },
      { months: 6, amount: 26000, interest: 2 },
      { months: 12, amount: 14000, interest: 5 },
      { months: 24, amount: 7500, interest: 8 },
    ],
  },
]

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { openPopup } = useContactPopup()

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full text-yellow-800 text-sm font-medium mb-4">
            <CreditCard className="w-4 h-4 mr-2" />
            Flexible Pricing Plans
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Choose Your Perfect Plan</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Affordable pricing with flexible EMI options. No hidden costs, transparent pricing, and 100% satisfaction
            guarantee.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative pricing-card card-hover transition-all duration-500 border-0 shadow-xl ${
                plan.popular
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 ring-2 ring-yellow-400 scale-105"
                  : "bg-white hover:shadow-2xl"
              } ${selectedPlan === plan.id ? "ring-2 ring-blue-400" : ""}`}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 text-sm font-semibold animate-bounce-in">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                    <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.id && (
                  <div className="animate-fade-in space-y-4 border-t pt-6">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      EMI Options Available
                    </h4>
                    <div className="grid gap-3">
                      {plan.emiOptions.map((emi, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                        >
                          <div>
                            <span className="font-semibold text-gray-900">{emi.months} Months</span>
                            {emi.interest === 0 && (
                              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                                0% Interest
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">₹{emi.amount.toLocaleString()}/month</div>
                            {emi.interest > 0 && <div className="text-xs text-gray-600">{emi.interest}% interest</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      openPopup()
                    }}
                    className={`w-full py-3 font-semibold transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl animate-glow"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    }`}
                  >
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlan(selectedPlan === plan.id ? null : plan.id)
                    }}
                    className="w-full border-2 hover:bg-gray-50 transition-all duration-200"
                  >
                    {selectedPlan === plan.id ? "Hide" : "View"} EMI Options
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">100% Secure</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
