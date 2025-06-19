"use client"

import { create } from "zustand"

interface CareerPopupStore {
  isOpen: boolean
  openPopup: () => void
  closePopup: () => void
}

export const useCareerPopup = create<CareerPopupStore>((set) => ({
  isOpen: false,
  openPopup: () => set({ isOpen: true }),
  closePopup: () => set({ isOpen: false }),
})) 