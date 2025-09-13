"use client"

import * as React from "react"
import { AlertTriangle, Trash2, CheckCircle, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info" | "success"
  onConfirm: () => void
  loading?: boolean
}

const ConfirmationDialog = React.forwardRef<HTMLDivElement, ConfirmationDialogProps>(
  ({ 
    open, 
    onOpenChange, 
    title, 
    description, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "danger",
    onConfirm,
    loading = false
  }, ref) => {
    const icons = {
      danger: Trash2,
      warning: AlertTriangle,
      info: Info,
      success: CheckCircle,
    }

    const colors = {
      danger: "text-red-600",
      warning: "text-yellow-600", 
      info: "text-blue-600",
      success: "text-green-600",
    }

    const buttonVariants = {
      danger: "bg-red-500 hover:bg-red-600 text-white",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
      info: "bg-blue-500 hover:bg-blue-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white",
    }

    const Icon = icons[type]

    const handleConfirm = () => {
      onConfirm()
      onOpenChange(false)
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gray-100 ${colors[type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={buttonVariants[type]}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

ConfirmationDialog.displayName = "ConfirmationDialog"

export { ConfirmationDialog }
