'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { S3Image } from '@/lib/s3'
import MemoryCard from './MemoryCard'

interface MemoryGridProps {
  images: S3Image[]
  viewMode?: 'grid' | 'list'
  showDetails?: boolean
  onDelete?: (imageKey: string) => void
  userId?: string
}

export default function MemoryGrid({ 
  images, 
  viewMode = 'grid', 
  showDetails = true,
  onDelete,
  userId
}: MemoryGridProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())

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

  const handleDelete = useCallback(async (imageKey: string) => {
    if (!onDelete || !userId) return
    
    try {
      const response = await fetch('/api/images/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageKey,
          userId
        })
      })

      if (response.ok) {
        onDelete(imageKey)
      } else {
        const error = await response.json()
        alert('Lỗi khi xóa ảnh: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Lỗi khi xóa ảnh')
    }
  }, [onDelete, userId])

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
                onDelete={handleDelete}
                isLiked={likedImages.has(image.key)}
                viewMode={viewMode}
                showDetails={showDetails}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  )
} 