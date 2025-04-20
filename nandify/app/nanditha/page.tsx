"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Heart, Clock, Home, History, Search, Music2, Calendar, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import PhotoUploader from "@/components/photo-uploader"
import EntryList from "@/components/entry-list"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, getDocs, doc, setDoc, Timestamp } from "firebase/firestore"
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

export default function NandithaPage() {
  const [activeView, setActiveView] = useState("upload")
  const [todayEntry, setTodayEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [showNowPlaying, setShowNowPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<string | null>(null)
  const router = useRouter()

  const today = format(new Date(), "yyyy-MM-dd")
  const dayCount = Math.floor((new Date().getTime() - new Date("2023-01-01").getTime()) / (1000 * 3600 * 24))

  useEffect(() => {
    const checkTodayEntry = async () => {
      try {
        const entriesRef = collection(db, "entries")
        const q = query(entriesRef, where("date", "==", today))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          setTodayEntry(querySnapshot.docs[0].data())
          if (querySnapshot.docs[0].data().photos_uploaded) {
            setUploadComplete(true)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error checking today's entry:", error)
        setLoading(false)
      }
    }

    checkTodayEntry()
  }, [today])

  const handlePhotoUpload = async (files: File[]) => {
    try {
      setLoading(true)

      // In a real implementation, you would upload the files to Firebase Storage
      // For this demo, we'll just update Firestore

      const entryRef = doc(db, "entries", today)
      await setDoc(
        entryRef,
        {
          date: today,
          photos_uploaded: true,
          voice_uploaded: false,
          completed: false,
          timestamp: Timestamp.now(),
        },
        { merge: true },
      )

      setUploadComplete(true)
      setLoading(false)
    } catch (error) {
      console.error("Error uploading photos:", error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  const playAudio = (audioUrl: string) => {
    setCurrentAudio(audioUrl)
    setShowNowPlaying(true)
  }

  const navItems = [
    { icon: Home, label: "Home", value: "upload" },
    { icon: Search, label: "Browse", value: "browse" },
    { icon: History, label: "History", value: "history" },
  ]

  // Featured cards for the browse section
  const featuredCards = [
    {
      title: "First Month",
      description: "Your first month together",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
    },
    { title: "Special Days", description: "Memorable moments", icon: Heart, color: "from-purple-500 to-indigo-500" },
    { title: "Recent Exchanges", description: "Latest connections", icon: Clock, color: "from-[#E3BC9A] to-[#D4A989]" },
    { title: "Calendar View", description: "View by date", icon: Calendar, color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <NandifyLayout showNowPlaying={showNowPlaying} audioUrl={currentAudio}>
      <NandifySidebar
        activeItem={activeView}
        onItemSelect={setActiveView}
        items={navItems}
        onLogout={handleLogout}
        userName="Nanditha"
        dayCount={dayCount}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Top header */}
        <header className="bg-gradient-to-b from-[#121212] to-transparent p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Good {getTimeOfDay()}, Nanditha</h1>
              <p className="text-neutral-400">Your daily exchange awaits</p>
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
                N
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <ScrollArea className="flex-1">
          <div className="p-6 pt-0 pb-24">
            {activeView === "upload" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <Card className="border-neutral-800/50 bg-neutral-900/50 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E3BC9A]/10 to-transparent rounded-full filter blur-xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Music2 className="h-5 w-5 text-[#E3BC9A]" />
                      Today's Exchange
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                      {format(new Date(), "EEEE, MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block relative">
                          <div className="absolute inset-0 bg-[#E3BC9A]/20 rounded-full blur-md"></div>
                          <Heart className="h-12 w-12 text-[#E3BC9A] animate-pulse relative" />
                        </div>
                        <p className="mt-4 text-neutral-400">Loading your exchange...</p>
                      </div>
                    ) : uploadComplete ? (
                      <div className="py-6">
                        <div className="bg-neutral-800/70 rounded-lg p-6 mb-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E3BC9A] to-transparent"></div>
                          <p className="text-white text-lg mb-2">Photos Uploaded Successfully</p>
                          <p className="text-neutral-400">
                            Your photos have been sent. Awaiting Karthick's voice note.
                          </p>
                        </div>

                        {todayEntry && todayEntry.voice_uploaded && (
                          <div className="mt-6">
                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                              <Music2 className="h-4 w-4 text-[#E3BC9A]" />
                              Your note for {format(new Date(), "MMMM d")} is here
                            </h3>
                            <div className="bg-neutral-800/70 rounded-lg p-4">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-md bg-gradient-to-br from-[#E3BC9A] to-[#D4A989] flex items-center justify-center text-black font-bold">
                                  K
                                </div>
                                <div>
                                  <p className="text-white font-medium">Karthick</p>
                                  <p className="text-sm text-neutral-400">Voice Note • Today</p>
                                </div>
                              </div>
                              <div
                                onClick={() => playAudio("/placeholder-audio.mp3")}
                                className="bg-neutral-700/50 rounded-md p-3 flex items-center gap-3 cursor-pointer hover:bg-neutral-700/70 transition-colors"
                              >
                                <div className="h-10 w-10 bg-[#E3BC9A] rounded-full flex items-center justify-center">
                                  <Heart className="h-5 w-5 text-black" />
                                </div>
                                <div className="flex-1">
                                  <div className="h-1 w-full bg-neutral-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#E3BC9A] w-3/4"></div>
                                  </div>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs text-neutral-400">1:45</span>
                                    <span className="text-xs text-neutral-400">2:30</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <PhotoUploader onUpload={handlePhotoUpload} />
                    )}
                  </CardContent>
                </Card>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Recently Played</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => {
                      const date = new Date()
                      date.setDate(date.getDate() - item)

                      return (
                        <Card
                          key={item}
                          className="bg-neutral-800/50 border-neutral-700/30 hover:bg-neutral-800 transition-colors cursor-pointer group"
                          onClick={() => playAudio("/placeholder-audio.mp3")}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-square bg-neutral-900 rounded-md mb-4 overflow-hidden relative">
                              <img
                                src={`/placeholder.svg?height=200&width=200`}
                                alt="Cover"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2 h-10 w-10 bg-[#E3BC9A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                                <Heart className="h-5 w-5 text-black" />
                              </div>
                            </div>
                            <h3 className="font-medium text-white truncate">Voice Note</h3>
                            <p className="text-sm text-neutral-400 truncate">{format(date, "MMMM d, yyyy")}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {activeView === "browse" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Featured Collections</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {featuredCards.map((card, index) => (
                      <div key={index} className="h-32 rounded-lg overflow-hidden relative cursor-pointer group">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-80 group-hover:opacity-90 transition-opacity`}
                        ></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                          <card.icon className="h-8 w-8 text-white/90" />
                          <div>
                            <h3 className="font-bold text-white text-lg">{card.title}</h3>
                            <p className="text-sm text-white/80">{card.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Made For You</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Card
                        key={item}
                        className="bg-neutral-800/50 border-neutral-700/30 hover:bg-neutral-800 transition-colors cursor-pointer group"
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square bg-neutral-900 rounded-md mb-4 overflow-hidden relative">
                            <div
                              className={`absolute inset-0 bg-gradient-to-br from-[#E3BC9A]/30 to-[#D4A989]/30 flex items-center justify-center`}
                            >
                              <Heart className="h-10 w-10 text-[#E3BC9A]/50" />
                            </div>
                            <div className="absolute bottom-2 right-2 h-10 w-10 bg-[#E3BC9A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                              <Heart className="h-5 w-5 text-black" />
                            </div>
                          </div>
                          <h3 className="font-medium text-white truncate">Collection {item}</h3>
                          <p className="text-sm text-neutral-400 truncate">Special moments</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeView === "history" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <Card className="border-neutral-800/50 bg-neutral-900/50 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-[#E3BC9A]" />
                      Your History
                    </CardTitle>
                    <CardDescription className="text-neutral-400">Past exchanges with Karthick</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EntryList onPlayAudio={playAudio} />
                  </CardContent>
                </Card>
              </motion.div>
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
