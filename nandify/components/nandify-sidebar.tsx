"use client"

import type React from "react"

import { useState } from "react"
import { LogOut, Library, PlusCircle, Heart, Music, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: React.ElementType
  label: string
  value: string
}

interface NandifySidebarProps {
  activeItem: string
  onItemSelect: (value: string) => void
  items: NavItem[]
  onLogout: () => void
  userName: string
  dayCount: number
}

export default function NandifySidebar({
  activeItem,
  onItemSelect,
  items,
  onLogout,
  userName,
  dayCount,
}: NandifySidebarProps) {
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true)
  const [isHovering, setIsHovering] = useState("")

  // Mock playlists for the sidebar
  const playlists = [
    { id: "1", name: "First Month Together" },
    { id: "2", name: "Special Moments" },
    { id: "3", name: "Anniversary Collection" },
    { id: "4", name: "Favorite Exchanges" },
    { id: "5", name: "Memorable Days" },
  ]

  return (
    <div className="w-64 bg-black h-screen flex flex-col">
      {/* Logo and main navigation */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E3BC9A] to-[#D4A989] flex items-center justify-center">
            <Music className="h-5 w-5 text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">Nandify</h1>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <motion.button
              key={item.value}
              onClick={() => onItemSelect(item.value)}
              onMouseEnter={() => setIsHovering(item.value)}
              onMouseLeave={() => setIsHovering("")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all",
                activeItem === item.value ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white",
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform", isHovering === item.value && "scale-110")} />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Library section */}
      <div className="flex-1 px-2 flex flex-col min-h-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-medium"
          >
            <Library className="h-5 w-5" />
            <span>Your Library</span>
          </button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white rounded-full">
              <PlusCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white rounded-full">
              {isLibraryExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isLibraryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 py-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-neutral-400 hover:text-white"
                    >
                      <div className="h-10 w-10 bg-neutral-800 rounded flex items-center justify-center flex-shrink-0">
                        <Heart className="h-4 w-4 text-neutral-500" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="truncate">{playlist.name}</p>
                        <p className="text-xs text-neutral-500">Playlist • {userName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User section */}
      <div className="p-4 border-t border-neutral-800">
        <div className="mb-4">
          <p className="text-xs text-neutral-400 mb-1">Day {dayCount}</p>
          <p className="text-xs text-neutral-400">of your love story</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E3BC9A] to-[#D4A989] flex items-center justify-center text-black font-bold">
              {userName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-neutral-400 hover:text-white rounded-full h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
