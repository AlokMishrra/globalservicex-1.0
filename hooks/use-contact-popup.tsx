"use client"

import { create } from "zustand"

interface ContactPopupStore {
  isOpen: boolean
  openPopup: () => void
  closePopup: () => void
}

export const useContactPopup = create<ContactPopupStore>((set) => ({
  isOpen: false,
  openPopup: () => set({ isOpen: true }),
  closePopup: () => set({ isOpen: false }),
}))
