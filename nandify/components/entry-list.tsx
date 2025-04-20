"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Heart, ImageIcon, Mic, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, orderBy } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Entry {
  id: string
  date: string
  photos_uploaded: boolean
  voice_uploaded: boolean
  completed: boolean
}

interface EntryListProps {
  onPlayAudio?: (audioUrl: string) => void
}

export default function EntryList({ onPlayAudio }: EntryListProps) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesRef = collection(db, "entries")
        const q = query(entriesRef, where("completed", "==", true), orderBy("date", "desc"))

        // For demo purposes, create some mock entries
        const mockEntries: Entry[] = [
          {
            id: "2023-04-18",
            date: "2023-04-18",
            photos_uploaded: true,
            voice_uploaded: true,
            completed: true,
          },
          {
            id: "2023-04-17",
            date: "2023-04-17",
            photos_uploaded: true,
            voice_uploaded: true,
            completed: true,
          },
          {
            id: "2023-04-16",
            date: "2023-04-16",
            photos_uploaded: true,
            voice_uploaded: true,
            completed: true,
          },
          {
            id: "2023-04-15",
            date: "2023-04-15",
            photos_uploaded: true,
            voice_uploaded: true,
            completed: true,
          },
          {
            id: "2023-04-14",
            date: "2023-04-14",
            photos_uploaded: true,
            voice_uploaded: true,
            completed: true,
          },
        ]

        setEntries(mockEntries)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching entries:", error)
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const viewEntry = (entry: Entry) => {
    setSelectedEntry(entry)
  }

  const closeEntry = () => {
    setSelectedEntry(null)
  }

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
      if (onPlayAudio) {
        onPlayAudio("/placeholder-audio.mp3")
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-[#E3BC9A]/20 rounded-full blur-md"></div>
          <Heart className="h-12 w-12 text-[#E3BC9A] animate-pulse relative" />
        </div>
        <p className="mt-4 text-neutral-400">Loading your history...</p>
      </div>
    )
  }

  if (selectedEntry) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Button variant="ghost" onClick={closeEntry} className="text-white mb-2 -ml-2">
          ← Back to history
        </Button>

        <h3 className="text-xl font-medium text-white">
          Exchange - {format(new Date(selectedEntry.date), "MMMM d, yyyy")}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800 relative group">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Your photo 1"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800 relative group">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Your photo 2"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="bg-neutral-800/70 rounded-lg p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-[#E3BC9A] to-[#D4A989] flex items-center justify-center text-black font-bold">
              K
            </div>
            <div>
              <p className="text-white font-medium">Karthick</p>
              <p className="text-sm text-neutral-400">Voice Note • {format(new Date(selectedEntry.date), "MMM d")}</p>
            </div>
          </div>
          <div
            onClick={() => onPlayAudio && onPlayAudio("/placeholder-audio.mp3")}
            className="bg-neutral-700/50 rounded-md p-3 flex items-center gap-3 cursor-pointer hover:bg-neutral-700/70 transition-colors"
          >
            <div className="h-10 w-10 bg-[#E3BC9A] rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-black ml-0.5" />
            </div>
            <div className="flex-1">
              <div className="h-1 w-full bg-neutral-600 rounded-full overflow-hidden">
                <div className="h-full bg-[#E3BC9A] w-0"></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-neutral-400">0:00</span>
                <span className="text-xs text-neutral-400">2:30</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-400">No completed entries yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800/50 hover:bg-neutral-800/50 cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => viewEntry(entry)}>
                <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Thumbnail"
                    className="h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{format(new Date(entry.date), "MMMM d, yyyy")}</p>
                  <div className="flex items-center text-xs text-neutral-400 mt-1">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    <span>2 photos</span>
                    <span className="mx-2">•</span>
                    <Mic className="h-3 w-3 mr-1" />
                    <span>1 voice note</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-neutral-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handlePlay(entry.id)}
              >
                {playingId === entry.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
