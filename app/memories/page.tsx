'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { Upload, Grid, List, Eye, EyeOff } from 'lucide-react'
import MemoryGrid from '@/components/MemoryGrid'
import SearchAndFilter from '@/components/SearchAndFilter'
import UploadModal from '@/components/UploadModal'
import { S3Image } from '@/lib/s3'

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
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-neutral-600">Đang tải ảnh kỷ niệm...</p>
      </div>
    </div>
  )
}

export default function MemoriesPage() {
  const [images, setImages] = useState<S3Image[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDetails, setShowDetails] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load images from API when component mounts
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/images')
        if (response.ok) {
          const imagesFromAPI = await response.json()
          setImages(imagesFromAPI)
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
  }, [])

  // Filter and search images
  const filteredImages = useMemo(() => {
    let filtered = images

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(image => 
        image.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply other filters
    if (filters.dateRange) {
      // Add date filtering logic here
    }

    if (filters.folder) {
      filtered = filtered.filter(image => 
        image.key.includes(filters.folder!)
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      // Add tag filtering logic here
    }

    if (filters.favorites) {
      // Add favorites filtering logic here
    }

    return filtered
  }, [images, searchQuery, filters])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleUploadSuccess = (newImages: S3Image[]) => {
    setImages(prev => [...newImages, ...prev])
    setIsUploadModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Memories ✨
              </h1>
              <p className="text-neutral-600 mt-2">Quản lý và xem ảnh kỷ niệm của bạn</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Upload className="h-4 w-4 mr-2" />
                Tải lên
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter 
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {/* View Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                {filteredImages.length} ảnh
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-neutral-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Details Toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  showDetails 
                    ? 'bg-gradient-accent text-white shadow-glow-accent' 
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-white'
                }`}
              >
                {showDetails ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredImages.length > 0 ? (
            <MemoryGrid 
              images={filteredImages} 
              viewMode={viewMode}
              showDetails={showDetails}
            />
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center animate-bounce-gentle">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900">Chưa có ảnh kỷ niệm</h3>
                <p className="mt-2 text-neutral-500">Hãy thêm ảnh vào thư mục S3 để xem chúng ở đây</p>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mt-4 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  Tải lên ảnh đầu tiên
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
          />
        )}
      </div>
    </div>
  )
} 