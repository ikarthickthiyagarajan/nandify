"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface PhotoUploaderProps {
  onUpload: (files: File[]) => void
}

export default function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      // Limit to 2 photos
      const newFiles = files.slice(0, 2 - selectedFiles.length)

      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      setSelectedFiles([...selectedFiles, ...newFiles])
      setPreviews([...previews, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    const newPreviews = [...previews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index])

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 2) {
      setUploading(true)

      // Simulate upload delay
      setTimeout(() => {
        onUpload(selectedFiles)
      }, 1500)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      // Limit to 2 photos
      const newFiles = imageFiles.slice(0, 2 - selectedFiles.length)

      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      setSelectedFiles([...selectedFiles, ...newFiles])
      setPreviews([...previews, ...newPreviews])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white mb-2">Share Today's Moments</h3>
        <p className="text-neutral-400">Upload 2 photos of yourself to share with Karthick</p>
      </div>

      <div className="relative" onDragEnter={handleDrag}>
        <div className={`grid grid-cols-2 gap-4 ${dragActive ? "opacity-50" : ""}`}>
          {previews.map((preview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-lg overflow-hidden border border-neutral-700 group"
            >
              <img
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  onClick={() => removeFile(index)}
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {Array.from({ length: 2 - previews.length }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-square rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <div className="flex flex-col items-center p-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-700/50 flex items-center justify-center mb-3">
                    {index === 0 ? (
                      <Camera className="h-6 w-6 text-neutral-400" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-neutral-400" />
                    )}
                  </div>
                  <span className="text-sm text-neutral-400 mb-1">
                    {index === 0 ? "Add first photo" : "Add second photo"}
                  </span>
                  <span className="text-xs text-neutral-500">Click or drag & drop</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Drag overlay */}
        {dragActive && (
          <div
            className="absolute inset-0 bg-black/60 border-2 border-dashed border-[#E3BC9A] rounded-lg flex items-center justify-center z-10"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className="h-10 w-10 text-[#E3BC9A] mx-auto mb-2" />
              <p className="text-white text-lg">Drop photos here</p>
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} multiple />

      <Button
        onClick={handleSubmit}
        disabled={selectedFiles.length !== 2 || uploading}
        className="w-full mt-4 bg-[#E3BC9A] hover:bg-[#D4A989] text-black font-medium h-12 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading...
          </div>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Share Photos
          </>
        )}
      </Button>

      {selectedFiles.length < 2 && (
        <p className="text-xs text-center text-neutral-400 mt-2">Please upload 2 photos to continue</p>
      )}
    </div>
  )
}
