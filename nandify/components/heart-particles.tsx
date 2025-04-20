"use client"

import { useEffect, useRef } from "react"

interface Heart {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

export default function HeartParticles() {
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

    // Create hearts
    const hearts: Heart[] = []
    const colors = ["#ff6b81", "#ff4757", "#ff7979", "#f368e0", "#ff9ff3"]

    for (let i = 0; i < 20; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 5,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Draw heart function
    const drawHeart = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save()
      ctx.beginPath()
      ctx.translate(x, y)
      ctx.scale(size, size)

      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-0.5, -0.3, -1, 0.1, 0, 0.5)
      ctx.bezierCurveTo(1, 0.1, 0.5, -0.3, 0, 0)

      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.fill()
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      hearts.forEach((heart) => {
        heart.y -= heart.speed
        heart.opacity -= 0.002

        // Reset heart when it goes off screen or becomes transparent
        if (heart.y < -20 || heart.opacity <= 0) {
          heart.y = canvas.height + 20
          heart.x = Math.random() * canvas.width
          heart.opacity = Math.random() * 0.5 + 0.2
        }

        drawHeart(heart.x, heart.y, heart.size / 30, heart.color, heart.opacity)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}
