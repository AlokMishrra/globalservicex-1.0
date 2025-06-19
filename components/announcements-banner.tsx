"use client"

import { useState, useEffect } from "react"
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { getAnnouncements } from "@/lib/database"
import { supabase } from "@/lib/supabase"
import type { Announcement } from "@/lib/supabase"

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
}

const colorMap = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
}

const ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'success',
    message: "🎉 Big News! Global Servicex launches India's most affordable digital solutions for startups & small businesses. Get your website, branding, or marketing package at never-before prices! Limited time offer.",
  },
]

export default function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  useEffect(() => {
    // Load initial announcements
    loadAnnouncements()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("announcements")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () => {
        loadAnnouncements()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements(true)
      setAnnouncements(data || [])
    } catch (error) {
      console.error("Error loading announcements:", error)
    }
  }

  const dismissAnnouncement = (id: number) => {
    setDismissedIds((prev) => [...prev, id])
  }

  const visibleAnnouncements = announcements.filter((announcement) => !dismissedIds.includes(announcement.id))

  if (visibleAnnouncements.length === 0) return null

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => {
        const Icon = iconMap[announcement.type]
        const colorClass = colorMap[announcement.type]

        return (
          <div key={announcement.id} className={`border rounded-lg p-3 sm:p-4 ${colorClass} animate-fade-in`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 sm:space-x-3 flex-1">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm sm:text-base">{announcement.title}</h4>
                  <p className="mt-1 text-xs sm:text-sm opacity-90 leading-relaxed">{announcement.content}</p>
                </div>
              </div>
              <button
                onClick={() => dismissAnnouncement(announcement.id)}
                className="flex-shrink-0 ml-2 sm:ml-4 opacity-70 hover:opacity-100 transition-opacity p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
