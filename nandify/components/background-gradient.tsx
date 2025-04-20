"use client"

import { useEffect, useRef } from "react"

export default function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Create gradient
    const createGradient = () => {
      // Nude/neutral color palette
      const colors = [
        { stop: 0, color: "#121212" },
        { stop: 0.3, color: "#1E1E1E" },
        { stop: 0.6, color: "#2A2520" },
        { stop: 0.8, color: "#302B25" },
        { stop: 1, color: "#121212" },
      ]

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.max(canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)

      colors.forEach(({ stop, color }) => {
        gradient.addColorStop(stop, color)
      })

      return gradient
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = createGradient()
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle noise texture
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        // Add very subtle noise
        const noise = Math.random() * 5 - 2.5
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
      }

      ctx.putImageData(imageData, 0, 0)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}
