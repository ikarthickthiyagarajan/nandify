"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface NowPlayingBarProps {
  audioUrl?: string | null
  title?: string
  artist?: string
  imageUrl?: string
  isVisible?: boolean
  onClose?: () => void
}

export default function NowPlayingBar({
  audioUrl = null,
  title = "Voice Note",
  artist = "Karthick",
  imageUrl = "",
  isVisible = true,
  onClose,
}: NowPlayingBarProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isLiked, setIsLiked] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      cancelAnimationFrame(animationRef.current!)
    }
  }, [audioRef])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      cancelAnimationFrame(animationRef.current!)
    } else {
      audio.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    setIsPlaying(!isPlaying)
  }

  const whilePlaying = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  const changeRange = (value: number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const changeVolume = (value: number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = value[0] / 100
      setVolume(value[0])
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-black/80 to-black border-t border-neutral-800/50 backdrop-blur-md p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Now playing info */}
        <div className="flex items-center space-x-4 w-1/4">
          <div className="h-14 w-14 bg-neutral-800 rounded-md overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <img src={imageUrl || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#E3BC9A]/30 to-[#D4A989]/30 flex items-center justify-center">
                <span className="text-xl font-bold text-[#E3BC9A]">{artist[0]}</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{title}</h4>
            <p className="text-xs text-neutral-400 truncate">{artist}</p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "flex-shrink-0 text-neutral-400 hover:text-white transition-colors",
              isLiked && "text-[#E3BC9A]",
            )}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "#E3BC9A" : "none"} />
          </button>
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-lg px-4">
          <div className="flex items-center space-x-4">
            <button className="text-neutral-400 hover:text-white transition-colors">
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-white rounded-full h-8 w-8 flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="h-4 w-4 text-black" /> : <Play className="h-4 w-4 text-black ml-0.5" />}
            </button>
            <button className="text-neutral-400 hover:text-white transition-colors">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.01}
              onValueChange={changeRange}
              className="flex-1"
            />
            <span className="text-xs text-neutral-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <Volume2 className="h-4 w-4 text-neutral-400" />
          <Slider value={[volume]} max={100} step={1} onValueChange={changeVolume} className="w-24" />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl || undefined} />
    </div>
  )
}
