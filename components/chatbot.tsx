"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { createContact } from '@/lib/database'

const BOT_AVATAR = "/images/logo.svg"

const steps = [
  { key: "welcome", message: "Hi! I am Global Servicex Bot. How can I help you today?", input: false },
  { key: "language", message: "Please select your preferred language:", input: false, language: true },
  { key: "askName", message: "First, may I know your name?", input: true, field: "name" },
  { key: "askPhone", message: "Thanks! Can you share your phone number?", input: true, field: "phone" },
  { key: "main", message: "What would you like to do?", input: false, options: [
    { label: "Contact Us", value: "contact" },
    { label: "Free Consultant", value: "consultant" },
    { label: "Know More", value: "know" },
    { label: "Other", value: "other" },
    { label: "Get a Quote", value: "quote" },
    { label: "Pricing", value: "pricing" },
  ] },
]

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hinglish" },
  { code: "other", label: "Other" },
]

const MAIN_OPTIONS = [
  { key: "contact", label: "Contact Us" },
  { key: "consult", label: "Free Consultant" },
  { key: "know", label: "Know More" },
  { key: "other", label: "Other" },
]

// Placeholder website knowledge
const WEBSITE_KNOWLEDGE = [
  { q: /service|offer|provide/i, a: "We offer web development, app development, digital marketing, and growth consulting services." },
  { q: /ai|consultant/i, a: "Our AI Consultant helps you design and launch your own website with ease." },
  { q: /contact/i, a: "You can contact us via the Contact Us option or the popup on the website." },
  { q: /team|about/i, a: "Global Servicex is a leading digital agency with a passionate team." },
  { q: /price|cost|charge/i, a: "Our pricing is flexible and tailored to your needs. Contact us for a quote!" },
]

const PRICING_INFO = [
  { service: "Website Development", price: "₹10,000+" },
  { service: "Branding Package", price: "₹5,000+" },
  { service: "Marketing Campaign", price: "₹7,500+" },
]

const SERVICES = [
  { key: 'web', label: 'Web Development', price: '₹10,000+' },
  { key: 'branding', label: 'Branding', price: '₹5,000+' },
  { key: 'marketing', label: 'Marketing', price: '₹7,500+' },
  { key: 'consulting', label: 'Consulting', price: '₹8,000+' },
]

const SUPPORT_OPTIONS = [
  { key: 'order', label: 'Order Issue' },
  { key: 'support', label: 'Support' },
]

const LANGUAGE_TEMPLATES = {
  en: {
    welcome: "Hi! I am Global Servicex Bot. How can I help you today?",
    askName: "First, may I know your name?",
    askPhone: "Thanks! Can you share your phone number?",
    askService: "Which service are you interested in?",
    askDetails: (service: string) => `Please tell us more about your needs for ${service}.`,
    thankYou: "Thank you! Your request has been submitted. Our team will contact you soon.",
    askSupport: "Please describe your issue. Our support team will help you.",
    askOrder: "Please provide your order details.",
    selectLanguage: "Please select your preferred language:",
    showServices: "Here are our main services:",
    showPrices: SERVICES.map(s => `${s.label}: ${s.price}`).join("\n"),
  },
  hi: {
    welcome: "Namaste! Main Global Servicex Bot hoon. Kaise madad kar sakta hoon?",
    askName: "Aap apna naam dijiye.",
    askPhone: "Dhanyavaad! Apna phone number batayein.",
    askService: "Aap kis seva mein ruchi rakhte hain?",
    askDetails: (service: string) => `${service} ke liye apni jarurat batayein.`,
    thankYou: "Shukriya! Aapka request mil gaya. Hamari team jald sampark karegi.",
    askSupport: "Kripya apni samasya batayein. Hamari support team madad karegi.",
    askOrder: "Order ki jankari dein.",
    selectLanguage: "Apni pasandida bhasha chunein:",
    showServices: "Hamari mukhya sevayein yeh hain:",
    showPrices: SERVICES.map(s => `${s.label}: ${s.price}`).join("\n"),
  },
  hinglish: {
    welcome: "Hi! Main Global Servicex Bot hoon. Kaise help kar sakta hoon?",
    askName: "Aap apna naam dijiye, mai aapki help karunga.",
    askPhone: "Thank you! Apna phone number batayein.",
    askService: "Kaunsi service chahiye aapko?",
    askDetails: (service: string) => `${service} ke liye details batayein.`,
    thankYou: "Shukriya! Aapka request mil gaya. Team contact karegi.",
    askSupport: "Aapka issue kya hai? Support team madad karegi.",
    askOrder: "Order ki details dein.",
    selectLanguage: "Language select karein:",
    showServices: "Yeh hamari main services hain:",
    showPrices: SERVICES.map(s => `${s.label}: ${s.price}`).join("\n"),
  },
}

function validatePhone(phone: string) {
  // Indian mobile: 10 digits, starts with 6-9
  return /^([6-9][0-9]{9})$/.test(phone)
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: "bot", text: steps[0].message },
  ])
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({ name: "", phone: "", language: "en" })
  const [input, setInput] = useState("")
  const [botTyping, setBotTyping] = useState(false)
  const [botAvatar, setBotAvatar] = useState(BOT_AVATAR)
  const [mainOption, setMainOption] = useState<string | null>(null)
  const [error, setError] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [flow, setFlow] = useState<'main'|'service'|'serviceDetails'|'support'|'order'|'thankyou'|null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [serviceDetails, setServiceDetails] = useState("")
  const [supportDetails, setSupportDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const lang = userData.language === 'hi' ? 'hi' : userData.language === 'hinglish' ? 'hinglish' : 'en'
  const T = LANGUAGE_TEMPLATES[lang]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  // Fallback to SVG if PNG fails
  useEffect(() => {
    setBotAvatar(BOT_AVATAR)
  }, [])

  // Helper to reset chat
  const resetChat = () => {
    setStep(1)
    setMainOption(null)
    setFlow(null)
    setSelectedService(null)
    setServiceDetails("")
    setSupportDetails("")
    setSubmitted(false)
    setUserData({ name: "", phone: "", language: lang })
    setMessages([{ from: "bot", text: T.welcome }])
  }

  // Main send handler
  const handleSend = async () => {
    if (!input.trim()) return
    setError("")
    // Name
    if (step === 2) {
      setMessages((msgs) => [...msgs, { from: "user", text: input }])
      setUserData((d) => ({ ...d, name: input }))
      setBotTyping(true)
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { from: "bot", text: T.askPhone }])
        setStep(3)
        setBotTyping(false)
      }, 800)
      setInput("")
      return
    }
    // Phone
    if (step === 3) {
      if (!validatePhone(input)) {
        setError(lang === 'en' ? "Please enter a valid 10-digit Indian mobile number (starts with 6-9)." : lang === 'hi' ? "Sahi 10-ank ka phone number dijiye (6-9 se shuru)." : "Valid 10-digit number dijiye (6-9 se shuru).")
        return
      }
      setMessages((msgs) => [...msgs, { from: "user", text: input }])
      setUserData((d) => ({ ...d, phone: input }))
      setBotTyping(true)
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { from: "bot", text: T.showServices }])
        setMessages((msgs) => [...msgs, { from: "bot", text: T.showPrices }])
        setStep(4)
        setBotTyping(false)
      }, 800)
      setInput("")
      return
    }
    // Service details
    if (flow === 'serviceDetails' && selectedService) {
      setMessages((msgs) => [...msgs, { from: "user", text: input }])
      setServiceDetails(input)
      setBotTyping(true)
      setInput("")
      // Submit to backend
      setTimeout(async () => {
        await createContact({
          name: userData.name,
          email: "-",
          phone: userData.phone,
          services: [selectedService],
          message: `Service: ${selectedService}\nDetails: ${input}`,
        })
        setMessages((msgs) => [...msgs, { from: "bot", text: T.thankYou }])
        setFlow('thankyou')
        setSubmitted(true)
        setBotTyping(false)
      }, 1200)
      return
    }
    // Support/Order details
    if ((flow === 'support' || flow === 'order')) {
      setMessages((msgs) => [...msgs, { from: "user", text: input }])
      setSupportDetails(input)
      setBotTyping(true)
      setInput("")
      setTimeout(async () => {
        await createContact({
          name: userData.name,
          email: "-",
          phone: userData.phone,
          services: [flow],
          message: `Support/Order: ${input}`,
        })
        setMessages((msgs) => [...msgs, { from: "bot", text: T.thankYou }])
        setFlow('thankyou')
        setSubmitted(true)
        setBotTyping(false)
      }, 1200)
      return
    }
  }

  // Service selection handler
  const handleServiceSelect = (serviceKey: string) => {
    setSelectedService(serviceKey)
    setMessages((msgs) => [...msgs, { from: "user", text: SERVICES.find(s => s.key === serviceKey)?.label || serviceKey }])
    setBotTyping(true)
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: T.askDetails(SERVICES.find(s => s.key === serviceKey)?.label || serviceKey) }])
      setFlow('serviceDetails')
      setBotTyping(false)
    }, 800)
  }

  // Support/Order selection handler
  const handleSupportSelect = (key: string) => {
    setFlow(key as 'support'|'order')
    setMessages((msgs) => [...msgs, { from: "user", text: SUPPORT_OPTIONS.find(o => o.key === key)?.label || key }])
    setBotTyping(true)
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: key === 'support' ? T.askSupport : T.askOrder }])
      setBotTyping(false)
    }, 800)
  }

  const handleLanguageSelect = (code: string) => {
    setUserData((d) => ({ ...d, language: code }))
    setMessages((msgs) => [...msgs, { from: "user", text: LANGUAGES.find(l => l.code === code)?.label || code }])
    setBotTyping(true)
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: steps[2].message }])
      setStep(2)
      setBotTyping(false)
    }, 700)
  }

  const handleMainOption = (key: string) => {
    setMainOption(key)
    setMessages((msgs) => [...msgs, { from: "user", text: MAIN_OPTIONS.find(o => o.key === key)?.label || key }])
    setBotTyping(true)
    setTimeout(() => {
      if (key === "contact") {
        setMessages((msgs) => [...msgs, { from: "bot", text: "You can contact us via the popup or call us at +91 98765 43210." }])
      } else if (key === "consult") {
        setMessages((msgs) => [...msgs, { from: "bot", text: "A free consultant will reach out to you soon!" }])
      } else if (key === "know") {
        setMessages((msgs) => [...msgs, { from: "bot", text: "Ask me anything about our services, team, or website!" }])
      } else if (key === "other") {
        setMessages((msgs) => [...msgs, { from: "bot", text: "You can chat with me about anything!" }])
      }
      setStep(5)
      setBotTyping(false)
    }, 900)
  }

  // Language response simulation (UI only)
  const getBotText = (text: string) => {
    if (userData.language === "hi") return `👉 (Hinglish) ${text}`
    if (userData.language === "other") return `🌐 (Other language) ${text}`
    return text
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg p-3 flex items-center justify-center animate-bounce hover:scale-110 transition-all"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        <span className="relative w-10 h-10 flex items-center justify-center">
          <span className="bg-yellow-500 text-white text-lg font-extrabold rounded-full border-2 border-white shadow-md flex items-center justify-center w-10 h-10" style={{fontSize:'18px'}}>GS</span>
        </span>
      </button>
      {/* Chat Window */}
      {open && (
        <div className="fixed z-50 bottom-24 right-6 w-80 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-yellow-200 flex flex-col animate-fade-in">
          <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-2xl">
            <span className="bg-yellow-500 text-white text-lg font-extrabold rounded-full border-2 border-white shadow-md flex items-center justify-center w-10 h-10" style={{fontSize:'18px'}}>GS</span>
            <span className="font-bold text-yellow-700 text-lg">Global Servicex Bot</span>
            <button className="ml-auto text-gray-400 hover:text-red-500" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-white to-yellow-50" style={{ maxHeight: 400 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}>
                {msg.from === "bot" && (
                  <span className="bg-yellow-500 text-white text-xs font-bold rounded-full border-2 border-white shadow-md flex items-center justify-center w-7 h-7" style={{fontSize:'13px'}}>GS</span>
                )}
                <div className={`px-4 py-2 rounded-2xl shadow text-sm ${msg.from === "bot" ? "bg-yellow-100 text-yellow-900" : "bg-blue-100 text-blue-900"}`}>{msg.from === "bot" ? getBotText(msg.text) : msg.text}</div>
              </div>
            ))}
            {botTyping && (
              <div className="flex justify-start items-center gap-2">
                <span className="bg-yellow-500 text-white text-xs font-bold rounded-full border-2 border-white shadow-md flex items-center justify-center w-7 h-7" style={{fontSize:'13px'}}>GS</span>
                <div className="px-4 py-2 rounded-2xl shadow text-sm bg-yellow-100 text-yellow-900 animate-pulse">Typing...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t bg-white rounded-b-2xl flex flex-col gap-2">
            {/* Language selection */}
            {step === 1 && (
              <div className="flex flex-col gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`rounded-full px-4 py-2 font-semibold border ${userData.language === lang.code ? "bg-yellow-400 text-white" : "bg-white text-yellow-700 border-yellow-300"} hover:bg-yellow-100 transition-all`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
            {/* Name input */}
            {step === 2 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-yellow-400"
                  placeholder={T.askName}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
                  autoFocus
                />
                <button
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-4 py-2 font-bold hover:scale-105 transition-all"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            )}
            {/* Phone input */}
            {step === 3 && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-yellow-400"
                    placeholder={T.askPhone}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
                    autoFocus
                  />
                  <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-4 py-2 font-bold hover:scale-105 transition-all"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                </div>
                {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
              </div>
            )}
            {/* Service selection */}
            {step === 4 && !flow && (
              <div className="flex flex-col gap-2">
                {SERVICES.map(service => (
                  <button
                    key={service.key}
                    className="rounded-full px-4 py-2 font-semibold border bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-100 transition-all"
                    onClick={() => handleServiceSelect(service.key)}
                  >
                    {service.label} ({service.price})
                  </button>
                ))}
                <button
                  className="rounded-full px-4 py-2 font-semibold border bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-100 transition-all"
                  onClick={() => setFlow('support')}
                >
                  {SUPPORT_OPTIONS[1].label}
                </button>
                <button
                  className="rounded-full px-4 py-2 font-semibold border bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-100 transition-all"
                  onClick={() => setFlow('order')}
                >
                  {SUPPORT_OPTIONS[0].label}
                </button>
              </div>
            )}
            {/* Service details input */}
            {flow === 'serviceDetails' && selectedService && !submitted && (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-yellow-400"
                  placeholder={T.askDetails(SERVICES.find(s => s.key === selectedService)?.label || selectedService)}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
                  autoFocus
                />
                <button
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-4 py-2 font-bold hover:scale-105 transition-all"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            )}
            {/* Support/Order details input */}
            {(flow === 'support' || flow === 'order') && !submitted && (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-yellow-400"
                  placeholder={flow === 'support' ? T.askSupport : T.askOrder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
                  autoFocus
                />
                <button
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-4 py-2 font-bold hover:scale-105 transition-all"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            )}
            {/* Thank you and reset */}
            {flow === 'thankyou' && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-green-600 font-bold text-lg">{T.thankYou}</div>
                <button
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full shadow"
                  onClick={resetChat}
                >
                  {lang === 'en' ? 'Start Over' : lang === 'hi' ? 'Phir Se Shuru Karein' : 'Dobara Shuru Karein'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
} 