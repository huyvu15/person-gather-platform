import { Suspense } from 'react'
import { Camera, Heart, Users, Calendar, Folder, Upload, TrendingUp, Clock } from 'lucide-react'
import { listImagesFromS3 } from '@/lib/s3'

async function getStats() {
  try {
    const images = await listImagesFromS3()
    return {
      totalImages: images.length,
      totalSize: images.reduce((acc, img) => acc + img.size, 0),
      recentImages: images.slice(0, 6),
      folders: ['memories', 'family', 'travel', 'work'], // Mock data
      todayUploads: Math.floor(Math.random() * 10) + 1,
      weeklyGrowth: Math.floor(Math.random() * 20) + 5
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    return {
      totalImages: 0,
      totalSize: 0,
      recentImages: [],
      folders: [],
      todayUploads: 0,
      weeklyGrowth: 0
    }
  }
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-neutral-600">Đang tải...</p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Chào mừng trở lại! 👋
          </h1>
          <p className="text-neutral-600 mt-2">Đây là tổng quan về dữ liệu của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-white/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Tổng ảnh</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-white/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-success rounded-xl">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Thư mục</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.folders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-white/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-warning rounded-xl">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Hôm nay</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.todayUploads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-white/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-accent rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Tăng trưởng</p>
                <p className="text-2xl font-bold text-neutral-900">+{stats.weeklyGrowth}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Images */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Ảnh gần đây</h2>
            <a href="/memories" className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:scale-105 transition-transform">
              Xem tất cả →
            </a>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            {stats.recentImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.recentImages.map((image) => (
                  <div key={image.key} className="aspect-square rounded-xl overflow-hidden bg-neutral-100 hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                    <img
                      src={image.url}
                      alt="Recent memory"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center animate-bounce-gentle">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-sm font-medium text-neutral-900">Chưa có ảnh</h3>
                <p className="mt-1 text-sm text-neutral-500">Bắt đầu tải lên ảnh đầu tiên của bạn</p>
              </div>
            )}
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105">
                <Upload className="h-4 w-4 mr-2" />
                Tải lên ảnh
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-neutral-300 text-neutral-700 bg-white/50 rounded-xl hover:bg-white transition-all duration-300 hover:scale-105">
                <Folder className="h-4 w-4 mr-2" />
                Tạo thư mục mới
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Thư mục</h3>
            <div className="space-y-2">
              {stats.folders.map((folder) => (
                <div key={folder} className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer hover:scale-105">
                  <div className="flex items-center">
                    <Folder className="h-4 w-4 text-neutral-500 mr-2" />
                    <span className="text-sm font-medium text-neutral-700 capitalize">{folder}</span>
                  </div>
                  <span className="text-xs text-neutral-500">0 ảnh</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 