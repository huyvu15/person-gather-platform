'use client'

import { useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, Download, Trash2 } from 'lucide-react'
import { S3Image } from '@/lib/s3'

interface MemoryCardProps {
  image: S3Image
  onLike?: (key: string) => void
  onDelete?: (key: string) => void
  isLiked?: boolean
  viewMode?: 'grid' | 'list'
  showDetails?: boolean
}

const MemoryCard = memo(function MemoryCard({ 
  image, 
  onLike, 
  onDelete,
  isLiked = false, 
  viewMode = 'grid',
  showDetails = true
}: MemoryCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = useCallback((date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return 'Ngày không xác định'
      }
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj)
    } catch (error) {
      return 'Ngày không xác định'
    }
  }, [])

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = image.url
    link.download = image.key.split('/').pop() || 'memory.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [image.url, image.key])

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onLike?.(image.key)
  }, [onLike, image.key])

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!onDelete) return
    
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')
    if (!confirmed) return
    
    setIsDeleting(true)
    try {
      onDelete(image.key)
    } catch (error) {
      console.error('Error deleting image:', error)
    } finally {
      setIsDeleting(false)
    }
  }, [onDelete, image.key])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setImageError(true)
  }, [])

  if (viewMode === 'list') {
    return (
      <motion.div
        className={`memory-card group cursor-pointer`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click để xem chi tiết"
      >
        <div className={`flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 transition-all duration-300 ${
          isHovered ? 'hover:shadow-glow hover:-translate-y-1' : ''
        }`}>
          <div className="relative w-20 h-20 overflow-hidden rounded-xl bg-neutral-100 flex-shrink-0">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
                <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ) : (
              <img
                src={image.url}
                alt={`Memory ${image.key}`}
                className={`h-full w-full object-cover transition-all duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-neutral-900 truncate">
                  {image.key.split('/').pop()}
                </h3>
                {showDetails && (
                  <div className="flex items-center space-x-4 mt-1 text-xs text-neutral-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(image.lastModified)}
                    </span>
                    <span>{formatFileSize(image.size)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-white/50 rounded-xl transition-all duration-300"
                  title="Tải xuống"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 disabled:opacity-50"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                
                {onLike && (
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isLiked 
                        ? 'bg-gradient-accent text-white shadow-glow-accent' 
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                    }`}
                    title={isLiked ? 'Đã thích' : 'Thích'}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`memory-card group cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click để xem chi tiết"
    >
      <div className={`relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 shadow-soft border border-white/20 transition-all duration-300 ${
        isHovered ? 'hover:shadow-glow hover:-translate-y-1' : ''
      }`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
            <div className="text-center text-neutral-500">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Lỗi tải ảnh</p>
            </div>
          </div>
        ) : (
          <img
            src={image.url}
            alt={`Memory ${image.key}`}
            className={`h-full w-full object-cover transition-all duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${isHovered ? 'group-hover:scale-110' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {showDetails && (
          <div className="memory-overlay">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(image.lastModified)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownload}
                    className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
                    title="Tải xuống"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-full bg-red-500/20 p-2 backdrop-blur-sm transition-all hover:bg-red-500/30 hover:scale-110 disabled:opacity-50"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onLike && (
                    <button
                      onClick={handleLike}
                      className={`rounded-full p-2 transition-all hover:scale-110 ${
                        isLiked 
                          ? 'bg-gradient-accent text-white shadow-glow-accent' 
                          : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                      }`}
                      title={isLiked ? 'Đã thích' : 'Thích'}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-2 text-xs opacity-75">
                {formatFileSize(image.size)}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
})

export default MemoryCard 