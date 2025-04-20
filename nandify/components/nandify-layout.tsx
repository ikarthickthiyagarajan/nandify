"use client"

import type React from "react"
import NowPlayingBar from "@/components/ui/now-playing-bar"

interface NandifyLayoutProps {
  children: React.ReactNode
  showNowPlaying?: boolean
  audioUrl?: string
}

export default function NandifyLayout({
  children,
  showNowPlaying = false,
  audioUrl = "/placeholder-audio.mp3",
}: NandifyLayoutProps) {
  return (
    <div className="flex h-screen bg-black text-white">
      {children}
      {showNowPlaying && <NowPlayingBar audioUrl={audioUrl} />}
    </div>
  )
}
