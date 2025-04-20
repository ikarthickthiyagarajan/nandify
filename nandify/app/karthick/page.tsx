"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Heart, Home, History, Search, Music2, Check, Mic, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import VoiceRecorder from "@/components/voice-recorder"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, updateDoc } from "firebase/firestore"
import NandifySidebar from "@/components/nandify-sidebar"
import NandifyLayout from "@/components/nandify-layout"

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

interface PendingEntry {
  id: string
  date: string
  formattedDate: string
}

export default function KarthickPage() {
  const [activeView, setActiveView] = useState("pending")
  const [pendingEntries, setPendingEntries] = useState<PendingEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<PendingEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [showNowPlaying, setShowNowPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<string | null>(null)
  const router = useRouter()

  const dayCount = Math.floor((new Date().getTime() - new Date("2023-01-01").getTime()) / (1000 * 3600 * 24))

  useEffect(() => {
    const fetchPendingEntries = async () => {
      try {
        // For demo purposes, create some mock entries
        const mockEntries: PendingEntry[] = [
          {
            id: format(new Date(), "yyyy-MM-dd"),
            date: format(new Date(), "yyyy-MM-dd"),
            formattedDate: format(new Date(), "MMMM d, yyyy"),
          },
        ]

        setPendingEntries(mockEntries)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching pending entries:", error)
        setLoading(false)
      }
    }

    fetchPendingEntries()
  }, [])

  const handleVoiceUpload = async (audioBlob: Blob) => {
    if (!selectedEntry) return

    try {
      setLoading(true)

      // In a real implementation, you would upload the audio to Firebase Storage
      // For this demo, we'll just update Firestore

      const entryRef = doc(db, "entries", selectedEntry.id)
      await updateDoc(entryRef, {
        voice_uploaded: true,
        completed: true,
      })

      setUploadComplete(true)
      setLoading(false)
    } catch (error) {
      console.error("Error uploading voice note:", error)
      setLoading(false)
    }
  }

  const selectEntry = (entry: PendingEntry) => {
    setSelectedEntry(entry)
  }

  const backToPending = () => {
    setSelectedEntry(null)
    setUploadComplete(false)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const playAudio = (audioUrl: string) => {
    setCurrentAudio(audioUrl)
    setShowNowPlaying(true)
  }

  const navItems = [
    { icon: Home, label: "Home", value: "pending" },
    { icon: Search, label: "Browse", value: "browse" },
    { icon: History, label: "History", value: "history" },
  ]

  return (
    <NandifyLayout showNowPlaying={showNowPlaying} audioUrl={currentAudio}>
      <NandifySidebar
        activeItem={activeView}
        onItemSelect={setActiveView}
        items={navItems}
        onLogout={handleLogout}
        userName="Karthick"
        dayCount={dayCount}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Top header */}
        <header className="bg-gradient-to-b from-[#121212] to-transparent p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Good {getTimeOfDay()}, Karthick</h1>
              <p className="text-neutral-400">Your admin dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white bg-black/30 hover:bg-black/50 rounded-full px-4"
              >
                Upgrade
              </Button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E3BC9A] to-[#D4A989] flex items-center justify-center text-black font-bold">
                K
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <ScrollArea className="flex-1">
          <div className="p-6 pt-0 pb-24">
            {selectedEntry ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="border-neutral-800/50 bg-neutral-900/50 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E3BC9A]/10 to-transparent rounded-full filter blur-xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" onClick={backToPending} className="text-white -ml-2">
                        ← Back
                      </Button>
                      <CardTitle className="text-xl text-white flex items-center gap-2">
                        <Music2 className="h-5 w-5 text-[#E3BC9A]" />
                        Record Voice Note
                      </CardTitle>
                      <div className="w-12"></div>
                    </div>
                    <CardDescription className="text-center text-neutral-400">
                      {selectedEntry.formattedDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block relative">
                          <div className="absolute inset-0 bg-[#E3BC9A]/20 rounded-full blur-md"></div>
                          <Heart className="h-12 w-12 text-[#E3BC9A] animate-pulse relative" />
                        </div>
                        <p className="mt-4 text-neutral-400">Processing...</p>
                      </div>
                    ) : uploadComplete ? (
                      <div className="text-center py-8">
                        <div className="bg-neutral-800/70 rounded-lg p-6 mb-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
                          <div className="flex items-center justify-center mb-4">
                            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="h-8 w-8 text-green-500" />
                            </div>
                          </div>
                          <p className="text-white text-lg mb-2">Voice Note Delivered</p>
                          <p className="text-neutral-400">Your voice note has been delivered to Nanditha</p>
                        </div>

                        <Button
                          onClick={backToPending}
                          className="mt-4 bg-[#E3BC9A] hover:bg-[#D4A989] text-black font-medium"
                        >
                          Back to Dashboard
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center mb-4">
                          <p className="text-white">Nanditha has shared 2 photos with you today</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800 relative group">
                            <img
                              src="/placeholder.svg?height=300&width=300"
                              alt="Nanditha's photo 1"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800 relative group">
                            <img
                              src="/placeholder.svg?height=300&width=300"
                              alt="Nanditha's photo 2"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </div>

                        <VoiceRecorder onUpload={handleVoiceUpload} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <>
                {activeView === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-neutral-800/50 bg-neutral-900/50 text-white overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E3BC9A]/10 to-transparent rounded-full filter blur-xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Mic className="h-5 w-5 text-[#E3BC9A]" />
                          Pending Voice Notes
                        </CardTitle>
                        <CardDescription className="text-neutral-400">
                          Nanditha is waiting for your voice notes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="text-center py-12">
                            <div className="inline-block relative">
                              <div className="absolute inset-0 bg-[#E3BC9A]/20 rounded-full blur-md"></div>
                              <Heart className="h-12 w-12 text-[#E3BC9A] animate-pulse relative" />
                            </div>
                            <p className="mt-4 text-neutral-400">Loading pending entries...</p>
                          </div>
                        ) : pendingEntries.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-neutral-400">No pending entries. All caught up!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {pendingEntries.map((entry) => (
                              <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between p-4 rounded-lg border border-neutral-800/50 hover:bg-neutral-800/50 cursor-pointer group"
                                onClick={() => selectEntry(entry)}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-neutral-800 rounded-md flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#E3BC9A]/20 to-[#D4A989]/20"></div>
                                    <Mic className="h-6 w-6 text-[#E3BC9A]" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-white">{entry.formattedDate}</p>
                                    <div className="flex items-center text-xs text-neutral-400 mt-1">
                                      <span>Nanditha uploaded 2 photos</span>
                                      <span className="mx-2">•</span>
                                      <span className="text-[#E3BC9A]">Waiting for response</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-[#E3BC9A] hover:bg-[#D4A989] text-black font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Mic className="h-4 w-4 mr-1" />
                                  Respond
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeView === "history" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-neutral-800/50 bg-neutral-900/50 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <History className="h-5 w-5 text-[#E3BC9A]" />
                          Your History
                        </CardTitle>
                        <CardDescription className="text-neutral-400">Past exchanges with Nanditha</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((_, index) => {
                            const date = new Date()
                            date.setDate(date.getDate() - (index + 1))

                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="flex items-center justify-between p-3 rounded-lg border border-neutral-800/50 hover:bg-neutral-800/50 cursor-pointer group"
                                onClick={() => playAudio("/placeholder-audio.mp3")}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
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
                                    <p className="font-medium text-white truncate">{format(date, "MMMM d, yyyy")}</p>
                                    <div className="flex items-center text-xs text-neutral-400 mt-1">
                                      <span>2 photos</span>
                                      <span className="mx-2">•</span>
                                      <span>1 voice note</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full bg-neutral-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Play className="h-4 w-4 ml-0.5" />
                                </Button>
                              </motion.div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeView === "browse" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-neutral-800/50 bg-neutral-900/50 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Search className="h-5 w-5 text-[#E3BC9A]" />
                          Browse Collections
                        </CardTitle>
                        <CardDescription className="text-neutral-400">Explore your shared moments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <p className="text-neutral-400">Coming soon! Browse feature will be available soon.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </NandifyLayout>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}
