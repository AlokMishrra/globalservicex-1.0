"use client"

import { create } from "zustand"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastStore {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto remove after duration
    setTimeout(() => {
      get().removeToast(id)
    }, toast.duration || 5000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

// Helper function for easy usage
export const toast = {
  success: (title: string, description?: string) =>
    useToast.getState().addToast({ title, description, type: "success" }),
  error: (title: string, description?: string) => useToast.getState().addToast({ title, description, type: "error" }),
  warning: (title: string, description?: string) =>
    useToast.getState().addToast({ title, description, type: "warning" }),
  info: (title: string, description?: string) => useToast.getState().addToast({ title, description, type: "info" }),
}
