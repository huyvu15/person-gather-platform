'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { S3Image } from '@/lib/s3'
import MemoryCard from './MemoryCard'
import ImageModal from './ImageModal'

interface MemoryGridProps {
  images: S3Image[]
  viewMode?: 'grid' | 'list'
  showDetails?: boolean
}

export default function MemoryGrid({ images, viewMode = 'grid', showDetails = true }: MemoryGridProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<S3Image | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLike = useCallback((imageKey: string) => {
    setLikedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(imageKey)) {
        newSet.delete(imageKey)
      } else {
        newSet.add(imageKey)
      }
      return newSet
    })
  }, [])

  const handleViewImage = useCallback((image: S3Image) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }, [])

  // Memoize empty state
  const emptyState = useMemo(() => (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900">Chưa có ảnh kỷ niệm</h3>
        <p className="mt-2 text-neutral-500">Hãy thêm ảnh vào thư mục S3 để xem chúng ở đây</p>
      </div>
    </div>
  ), [])

  if (images.length === 0) {
    return emptyState
  }

  const gridClasses = viewMode === 'list' 
    ? 'grid-cols-1 gap-4' 
    : 'grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

  return (
    <>
      <motion.div 
        className={`grid ${gridClasses} pb-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: Math.min(index * 0.05, 0.5) // Limit delay to prevent too much lag
              }}
            >
              <MemoryCard
                image={image}
                onLike={handleLike}
                isLiked={likedImages.has(image.key)}
                onView={handleViewImage}
                viewMode={viewMode}
                showDetails={showDetails}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLike={handleLike}
        isLiked={selectedImage ? likedImages.has(selectedImage.key) : false}
      />
    </>
  )
} 