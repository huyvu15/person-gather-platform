import { Suspense } from 'react'
import { Heart, Search, Filter, Grid, List } from 'lucide-react'
import MemoryGrid from '@/components/MemoryGrid'
import { listImagesFromS3 } from '@/lib/s3'

async function getFavoriteImages() {
  try {
    // Mock favorite images - in real app, this would come from user's favorites
    const allImages = await listImagesFromS3()
    return allImages.slice(0, 8) // Mock: first 8 images as favorites
  } catch (error) {
    console.error('Error loading favorite images:', error)
    return []
  }
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-gray-600">Đang tải ảnh yêu thích...</p>
      </div>
    </div>
  )
}

export default async function FavoritesPage() {
  const favoriteImages = await getFavoriteImages()

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yêu thích</h1>
            <p className="text-gray-600">Những ảnh và kỷ niệm bạn đã yêu thích</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Grid className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ảnh yêu thích</p>
              <p className="text-2xl font-bold text-gray-900">{favoriteImages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bài viết yêu thích</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ghi chú yêu thích</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trong yêu thích..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              <Filter className="h-4 w-4 mr-1" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="pb-8">
        <Suspense fallback={<LoadingSpinner />}>
          {favoriteImages.length > 0 ? (
            <MemoryGrid images={favoriteImages} />
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Chưa có ảnh yêu thích</h3>
                <p className="mt-2 text-gray-500">Bắt đầu thích những ảnh bạn yêu thích để xem chúng ở đây</p>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
} 