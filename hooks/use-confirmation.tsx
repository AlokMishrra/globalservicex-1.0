"use client"

import { useState } from "react"

interface ConfirmationOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info" | "success"
}

interface ConfirmationState extends ConfirmationOptions {
  open: boolean
  onConfirm: (() => void) | null
  loading: boolean
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "danger",
    onConfirm: null,
    loading: false,
  })

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        ...options,
        onConfirm: () => {
          setState(prev => ({ ...prev, loading: true }))
          resolve(true)
        },
        loading: false,
      })
    })
  }

  const cancel = () => {
    setState(prev => ({ ...prev, open: false, onConfirm: null, loading: false }))
  }

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }

  const close = () => {
    setState(prev => ({ ...prev, open: false, onConfirm: null, loading: false }))
  }

  return {
    ...state,
    confirm,
    cancel,
    setLoading,
    close,
  }
}
