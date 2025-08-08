import { create } from 'zustand'

interface UIStore {
  // State
  sidebarOpen: boolean
  isTyping: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTyping: (typing: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  sidebarOpen: true,
  isTyping: false,
  theme: 'system',
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTyping: (typing) => set({ isTyping: typing }),
  setTheme: (theme) => set({ theme }),
}))