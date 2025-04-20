"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Send, Trash, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface VoiceRecorderProps {
  onUpload: (audioBlob: Blob) => void
}

export default function VoiceRecorder({ onUpload }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingLevel, setRecordingLevel] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        chunksRef.current.push(event.data)
      })

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" })
        const audioUrl = URL.createObjectURL(audioBlob)

        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)
        chunksRef.current = []

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      })

      // Start recording
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      // Simulate audio levels
      const simulateAudioLevels = () => {
        setRecordingLevel(Math.random() * 0.8 + 0.2)
        animationFrameRef.current = requestAnimationFrame(simulateAudioLevels)
      }

      animationFrameRef.current = requestAnimationFrame(simulateAudioLevels)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleUpload = () => {
    if (audioBlob) {
      setIsUploading(true)

      // Simulate upload delay
      setTimeout(() => {
        onUpload(audioBlob)
      }, 1500)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white mb-2">Record Your Response</h3>
        <p className="text-neutral-400">Record a voice note for Nanditha</p>
      </div>

      {audioUrl ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-neutral-800/70 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-[#E3BC9A] border-0 text-black hover:bg-[#D4A989] hover:text-black"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <div className="flex-1">
                <div className="h-1.5 w-full bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E3BC9A]"
                    style={{
                      width: isPlaying ? "100%" : "0%",
                      transition: "width 10s linear",
                      transitionPlayState: isPlaying ? "running" : "paused",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-neutral-400">{formatTime(recordingTime)}</span>
                </div>
              </div>
            </div>
            <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} className="hidden" />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={cancelRecording}
              className="flex-1 border-neutral-700 text-white hover:bg-neutral-800 hover:text-white"
            >
              <Trash className="h-4 w-4 mr-2" />
              Discard
            </Button>

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 bg-[#E3BC9A] hover:bg-[#D4A989] text-black font-medium"
            >
              {isUploading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            {isRecording && (
              <div className="absolute inset-0 -m-4">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#E3BC9A]/10"></div>
                <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-[#E3BC9A]/5 animation-delay-200"></div>
                <div className="absolute inset-0 -m-8 animate-ping rounded-full bg-[#E3BC9A]/5 animation-delay-400"></div>
              </div>
            )}

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant="outline"
              size="lg"
              className={`rounded-full h-24 w-24 border-2 ${
                isRecording
                  ? "border-red-400 text-red-500 animate-pulse hover:bg-neutral-800/70"
                  : "border-[#E3BC9A] text-[#E3BC9A] hover:bg-neutral-800/70"
              }`}
            >
              {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          </div>

          {isRecording ? (
            <div className="text-center space-y-3">
              <p className="text-red-500 animate-pulse">Recording... Click to stop</p>
              <div className="w-64 h-8 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E3BC9A]/30 via-[#E3BC9A] to-[#E3BC9A]/30"
                  style={{
                    width: `${recordingLevel * 100}%`,
                    transition: "width 0.2s ease-in-out",
                  }}
                ></div>
              </div>
              <p className="text-sm text-neutral-400">{formatTime(recordingTime)}</p>
            </div>
          ) : (
            <p className="text-center text-sm text-neutral-400">
              Click the microphone to start recording your voice note
            </p>
          )}
        </div>
      )}
    </div>
  )
}
