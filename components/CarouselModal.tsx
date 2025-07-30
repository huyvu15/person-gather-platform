'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Heart, Share2, RotateCw, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react'
import { S3Image } from '@/lib/s3'

interface CarouselModalProps {
  images: S3Image[]
  currentImageIndex: number
  isOpen: boolean
  onClose: () => void
  onLike?: (key: string) => void
  isLiked?: boolean
}

export default function CarouselModal({ 
  images, 
  currentImageIndex, 
  isOpen, 
  onClose, 
  onLike, 
  isLiked = false 
}: CarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const currentImage = images[currentIndex]

  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  // Update current index when prop changes
  useEffect(() => {
    setCurrentIndex(currentImageIndex)
  }, [currentImageIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious()
    } else if (e.key === 'ArrowRight') {
      goToNext()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [goToPrevious, goToNext, onClose])

  // Always add keyboard event listener, regardless of modal state
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Early return after all hooks
  if (!isOpen || !currentImage) return null

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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentImage.url
    link.download = currentImage.key.split('/').pop() || 'memory.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRotate = () => setRotation(prev => prev + 90)
  const handleReset = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1.005) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1.005) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.005 : 0.005
    setScale(prev => Math.max(0.95, Math.min(1.1, prev + delta)))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
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
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRotate}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Xoay"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-3 px-4">
                <span className="text-white text-sm">Zoom</span>
                <input
                  type="range"
                  min="0.95"
                  max="1.1"
                  step="0.005"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((scale - 0.95) / 0.15) * 100}%, rgba(255,255,255,0.2) ${((scale - 0.95) / 0.15) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
              </div>
              
              <button
                onClick={handleReset}
                className="px-3 py-1 text-white text-sm hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Đặt lại"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="h-6 w-6" />
            </motion.button>
            
            <motion.button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="h-6 w-6" />
            </motion.button>
          </>
        )}

        {/* Image Container */}
        <div 
          className="flex-1 flex items-center justify-center p-4 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : scale > 1.005 ? 'grab' : 'default' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={currentImage.url}
                alt={`Memory ${currentImage.key}`}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
                }}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-2">
              {images.map((image, index) => (
                <motion.button
                  key={image.key}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
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
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="text-white text-sm">
              <p>Ngày tạo: {formatDate(currentImage.lastModified)}</p>
              <p>Kích thước: {formatFileSize(currentImage.size)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Tải xuống"
              >
                <Download className="h-4 w-4" />
              </button>
              
              <button
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Chia sẻ"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
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
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 