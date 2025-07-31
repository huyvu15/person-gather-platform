'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Grid, List, Eye, EyeOff, Search, Filter, Sparkles, Camera, Heart } from 'lucide-react'
import MemoryGrid from '@/components/MemoryGrid'
import UploadModal from '@/components/UploadModal'
import ModernCarousel from '@/components/ModernCarousel'
import { S3Image } from '@/lib/s3'
import { useAuth } from '@/contexts/AuthContext'

interface Filters {
  dateRange?: string
  folder?: string
  tags?: string[]
  favorites?: boolean
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <motion.div 
          className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600 font-medium">Đang tải ảnh kỷ niệm...</p>
      </div>
    </div>
  )
}

export default function MemoriesPage() {
  const { user } = useAuth()
  const [images, setImages] = useState<S3Image[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDetails, setShowDetails] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [folders, setFolders] = useState<string[]>([])
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false)

  // Load images from API when component mounts or user changes
  useEffect(() => {
    const loadImages = async () => {
      if (!user?.id) {
        setImages([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Build query parameters for filters
        const params = new URLSearchParams()
        
        if (filters.folder && filters.folder !== 'all') {
          params.append('folder', filters.folder)
        }
        if (filters.dateRange && filters.dateRange !== 'all') {
          params.append('dateRange', filters.dateRange)
        }
        if (searchQuery) {
          params.append('search', searchQuery)
        }

        const response = await fetch(`/api/images?${params.toString()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id })
        })
        
        if (response.ok) {
          const imagesFromAPI = await response.json()
          setImages(imagesFromAPI)
          
          // Extract unique folders
          const uniqueFolders = Array.from(new Set(imagesFromAPI.map((img: S3Image) => img.folder))) as string[]
          setFolders(uniqueFolders)
        } else {
          console.error('Failed to load images')
          setImages([])
        }
      } catch (error) {
        console.error('Error loading images:', error)
        setImages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [user?.id, filters.folder, filters.dateRange, searchQuery])

  // Load folders when user changes
  useEffect(() => {
    const loadFolders = async () => {
      if (!user?.id) {
        setFolders([])
        return
      }

      try {
        const response = await fetch('/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id })
        })
        
        if (response.ok) {
          const foldersFromAPI = await response.json()
          setFolders(foldersFromAPI)
        } else {
          console.error('Failed to load folders')
          setFolders([])
        }
      } catch (error) {
        console.error('Error loading folders:', error)
        setFolders([])
      }
    }

    loadFolders()
  }, [user?.id])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterOpen && !(event.target as Element).closest('.filter-dropdown')) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterOpen])

  // Filter and search images
  const filteredImages = useMemo(() => {
    let filtered = images

    // Search filter (client-side for better UX)
    if (searchQuery) {
      filtered = filtered.filter(image => 
        image.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Date range filter (client-side)
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      filtered = filtered.filter(image => {
        const imageDate = image.lastModified
        if (isNaN(imageDate.getTime())) return true // Skip invalid dates
        
        switch (filters.dateRange) {
          case 'today':
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            return imageDate >= today
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return imageDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            return imageDate >= monthAgo
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
            return imageDate >= yearAgo
          default:
            return true
        }
      })
    }

    return filtered
  }, [images, searchQuery, filters])

  const handleUploadSuccess = (newImages: S3Image[]) => {
    setImages(prev => [...newImages, ...prev])
    setIsUploadModalOpen(false)
  }

  const handleDeleteImage = (deletedImageKey: string) => {
    setImages(prev => prev.filter(img => img.key !== deletedImageKey))
  }

  const handleFilterChange = (type: 'folder' | 'dateRange', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const handleOpenSlideshow = () => {
    setIsSlideshowOpen(true)
  }

  const handleCloseSlideshow = () => {
    setIsSlideshowOpen(false)
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Camera className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h3>
          <p className="text-gray-600">Đăng nhập để xem ảnh kỷ niệm của bạn</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-3">
        {/* Header with Stats */}
        <motion.div 
          className="mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Camera className="h-7 w-7" />
                Memories
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Quản lý và chia sẻ khoảnh khắc đáng nhớ</p>
            </div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{filteredImages.length}</div>
                <div className="text-xs text-gray-500">Ảnh</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-pink-600">{folders.length}</div>
                <div className="text-xs text-gray-500">Thư mục</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Combined Header Bar */}
        <motion.div 
          className="bg-white/90 backdrop-blur-xl rounded-xl shadow-soft border border-white/20 p-2 mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between space-x-2">
            {/* Search */}
            <motion.div 
              className="relative flex-1 max-w-xs"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm ảnh..."
                className="w-full pl-9 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/60 text-gray-700 placeholder-gray-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            {/* Filter */}
            <motion.div 
              className="relative filter-dropdown"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-white/60 transition-all duration-300 bg-white/50 text-xs"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Filter className="h-4 w-4 mr-1 text-purple-600" />
                <span className="font-medium text-gray-700">Bộ lọc</span>
              </motion.button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-4">
                      {/* Folder Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thư mục
                        </label>
                        <select
                          value={filters.folder || 'all'}
                          onChange={(e) => handleFilterChange('folder', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700"
                        >
                          <option value="all">Tất cả thư mục</option>
                          {folders.map(folder => (
                            <option key={folder} value={folder}>
                              {folder}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Range Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thời gian
                        </label>
                        <select
                          value={filters.dateRange || 'all'}
                          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700"
                        >
                          <option value="all">Tất cả thời gian</option>
                          <option value="today">Hôm nay</option>
                          <option value="week">Tuần này</option>
                          <option value="month">Tháng này</option>
                          <option value="year">Năm nay</option>
                        </select>
                      </div>

                      {/* Clear Filters */}
                      {(filters.folder || filters.dateRange) && (
                        <motion.button
                          onClick={clearFilters}
                          className="w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Xóa bộ lọc
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* View Mode Toggle */}
            <motion.div 
              className="flex items-center bg-gray-100 rounded-lg p-1"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
              >
                <Grid className="h-4 w-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
              >
                <List className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Details Toggle */}
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                showDetails 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {showDetails ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </motion.button>

            {/* Slideshow Button */}
            {filteredImages.length > 1 && (
              <motion.button
                onClick={handleOpenSlideshow}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-xs"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Slideshow
              </motion.button>
            )}

            {/* Upload */}
            <motion.button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-xs"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Upload className="h-4 w-4 mr-1" />
              <span>Tải lên</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft border border-white/20 p-8 pb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredImages.length > 0 ? (
            <MemoryGrid 
              images={filteredImages} 
              viewMode={viewMode}
              showDetails={showDetails}
              onDelete={handleDeleteImage}
              userId={user.id}
            />
          ) : (
            <motion.div 
              className="flex min-h-[400px] items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div 
                  className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Camera className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có ảnh kỷ niệm</h3>
                <p className="text-gray-600 mb-6">Hãy thêm ảnh vào thư mục S3 để xem chúng ở đây</p>
                <motion.button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="h-5 w-5 mr-2 inline" />
                  Tải lên ảnh đầu tiên
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Upload Modal */}
        <AnimatePresence>
          {isUploadModalOpen && (
            <UploadModal
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              userId={user.id}
            />
          )}
        </AnimatePresence>

        {/* Conveyor Belt Slideshow */}
        <ModernCarousel
          images={filteredImages}
          isOpen={isSlideshowOpen}
          onClose={handleCloseSlideshow}
        />
      </div>
    </motion.div>
  )
}