'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCw } from 'lucide-react'
import { S3Image } from '@/lib/s3'

interface ConveyorBeltProps {
  images: S3Image[]
  isOpen: boolean
  onClose: () => void
  onLike?: (key: string) => void
  isLiked?: boolean
}

export default function ConveyorBelt({ 
  images, 
  isOpen, 
  onClose, 
  onLike, 
  isLiked = false 
}: ConveyorBeltProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(3000) // 3 seconds per image
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  // Auto-play functionality
  useEffect(() => {
    if (!isOpen || !isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (direction === 'forward') {
          return prev >= images.length - 1 ? 0 : prev + 1
        } else {
          return prev <= 0 ? images.length - 1 : prev - 1
        }
      })
    }, speed)

    return () => clearInterval(interval)
  }, [isOpen, isPlaying, images.length, speed, direction])

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      setIsPlaying(true)
    }
  }, [isOpen])

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev >= images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const handleReverse = useCallback(() => {
    setDirection(prev => prev === 'forward' ? 'backward' : 'forward')
  }, [])

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === ' ') {
      e.preventDefault()
      handlePlayPause()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [handlePrevious, handleNext, handlePlayPause, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  const formatDate = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return 'Ngày không xác định'
      }
      
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Ngày không xác định'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex flex-col max-w-6xl max-h-[90vh] mx-auto my-8">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4 text-white">
              <h3 className="text-lg font-medium truncate max-w-md">
                {currentImage.key.split('/').pop()}
              </h3>
              <span className="text-sm opacity-75">{formatFileSize(currentImage.size)}</span>
              <span className="text-sm opacity-75">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Speed Control */}
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">Tốc độ:</span>
                <select
                  value={speed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="px-2 py-1 bg-white/20 text-white rounded text-sm"
                >
                  <option value={1000}>Nhanh (1s)</option>
                  <option value={2000}>Trung bình (2s)</option>
                  <option value={3000}>Chậm (3s)</option>
                  <option value={5000}>Rất chậm (5s)</option>
                </select>
              </div>

              {/* Direction Control */}
              <button
                onClick={handleReverse}
                className={`p-2 rounded-lg transition-colors ${
                  direction === 'forward' 
                    ? 'text-white hover:bg-white hover:bg-opacity-20' 
                    : 'bg-blue-500 text-white'
                }`}
                title={direction === 'forward' ? 'Tiến' : 'Lùi'}
              >
                <RotateCw className="h-4 w-4" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Image Container */}
        {/* <div className="flex-1 flex items-center justify-center p-4 bg-white rounded-2xl"> */}
        <div className="flex items-center justify-center bg-white rounded-2xl w-[1200px] h-[800px] mx-auto my-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, x: direction === 'forward' ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'forward' ? -100 : 100 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={currentImage.url}
                alt={`Memory ${currentImage.key}`}
                // className="max-w-full max-h-full object-contain select-none rounded-lg"
                className="w-auto h-[550px] object-contain select-none rounded-lg"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Conveyor Belt Preview */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-1 0">
          <div className="flex space-x-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-0">
            {images.map((image, index) => (
              <motion.button
                key={image.key}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex 
                    ? 'border-white scale-110' 
                    : 'border-transparent hover:border-white/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
          <motion.button
            onClick={handlePrevious}
            className="p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
        </div> */}

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
          <motion.button
            onClick={handleNext}
            className="p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Footer */}
        <div className="absolute -bottom-10 left-0 right-0 z-10 bg-black bg-opacity-20 backdrop-blur-sm rounded-b-2xl p-y-1 px-4">
          <div className="flex items-center justify-between p-3">
            <div className="text-white text-sm">
              {/* <p>Ngày tạo: {formatDate(currentImage.lastModified)}</p> */}
              {/* <p>Kích thước: {formatFileSize(currentImage.size)}</p> */}
              <p className="mt-1">
                {isPlaying ? '🔄 Đang phát' : '⏸️ Đã tạm dừng'} - 
                {direction === 'forward' ? ' ⬅️ Tiến' : ' ➡️ Lùi'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {onLike && (
                <button
                  onClick={() => onLike(currentImage.key)}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                  title={isLiked ? 'Đã thích' : 'Thích'}
                >
                  ❤️
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Đóng"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 