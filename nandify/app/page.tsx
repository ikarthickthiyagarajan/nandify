"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Home() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      if (password === "ALOHAMORA") {
        router.push("/nanditha")
      } else if (password === "KarthickHere") {
        router.push("/karthick")
      } else {
        setError("Incorrect password. Please try again.")
        setIsLoading(false)
      }
    }, 800) // Simulate loading for better UX
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0a0a0a] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#E3BC9A]/10 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E3BC9A]/10 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-neutral-800/50 shadow-xl bg-black/60 backdrop-blur-md text-white">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#E3BC9A]/20 rounded-full blur-md"></div>
                <div className="relative bg-gradient-to-br from-[#E3BC9A] to-[#D4A989] p-4 rounded-full">
                  <Music className="h-8 w-8 text-black" />
                </div>
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight">Nandify</CardTitle>
              <CardDescription className="text-neutral-400 mt-1">
                Your daily connection through music & moments
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-800/50 border-neutral-700/50 text-white focus:border-[#E3BC9A] h-12 pl-4 pr-10 rounded-md"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <div className="absolute right-3 top-3 text-neutral-500">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[#E3BC9A] hover:bg-[#D4A989] text-black font-medium h-12 rounded-md transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
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
                  Connecting...
                </div>
              ) : (
                "Enter Experience"
              )}
            </Button>
            <div className="text-xs text-neutral-500 text-center">A daily exchange between Nanditha & Karthick</div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-8 text-center text-neutral-500 z-10 max-w-md"
      >
        <p className="text-sm italic">"Every day is a new track in the playlist of our love story."</p>
      </motion.div>
    </div>
  )
}
