import { Plus, Search, Filter, Calendar, Tag, Eye, Heart, Share2 } from 'lucide-react'

export default function PostsPage() {
  const posts = [
    {
      id: 1,
      title: 'Chuyến du lịch Đà Nẵng - Kỷ niệm đáng nhớ',
      excerpt: 'Một chuyến du lịch tuyệt vời đến thành phố biển xinh đẹp với những khoảnh khắc đáng nhớ cùng gia đình...',
      content: 'Đà Nẵng là một thành phố tuyệt vời với những bãi biển đẹp, ẩm thực phong phú và con người thân thiện. Chuyến đi này đã để lại cho tôi nhiều kỷ niệm đáng nhớ...',
      author: 'Nguyễn Văn A',
      publishedAt: new Date('2024-01-15'),
      readTime: '5 phút',
      tags: ['travel', 'vacation', 'family'],
      likes: 24,
      views: 156,
      image: '/api/placeholder/400/200'
    },
    {
      id: 2,
      title: 'Công việc và cuộc sống - Cân bằng như thế nào?',
      excerpt: 'Chia sẻ về cách tôi cân bằng giữa công việc và cuộc sống cá nhân trong thời đại hiện nay...',
      content: 'Trong thời đại công nghệ phát triển, việc cân bằng giữa công việc và cuộc sống trở nên quan trọng hơn bao giờ hết...',
      author: 'Nguyễn Văn A',
      publishedAt: new Date('2024-01-10'),
      readTime: '8 phút',
      tags: ['work', 'life', 'balance'],
      likes: 18,
      views: 89,
      image: '/api/placeholder/400/200'
    },
    {
      id: 3,
      title: 'Nhiếp ảnh cơ bản - Bắt đầu từ đâu?',
      excerpt: 'Hướng dẫn cho người mới bắt đầu với nhiếp ảnh, từ việc chọn máy ảnh đến các kỹ thuật cơ bản...',
      content: 'Nhiếp ảnh là một nghệ thuật tuyệt vời giúp chúng ta lưu giữ những khoảnh khắc đẹp trong cuộc sống...',
      author: 'Nguyễn Văn A',
      publishedAt: new Date('2024-01-05'),
      readTime: '12 phút',
      tags: ['photography', 'tutorial', 'beginner'],
      likes: 32,
      views: 234,
      image: '/api/placeholder/400/200'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bài viết</h1>
            <p className="text-gray-600">Chia sẻ những câu chuyện và kinh nghiệm của bạn</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Viết bài
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="aspect-video bg-gray-200 relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Intl.DateTimeFormat('vi-VN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }).format(post.publishedAt)}
                </div>
                <span>{post.readTime}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {post.likes}
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Share2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </article>
        ))}

        {/* Add New Post Card */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-primary-400 transition-colors cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Viết bài mới</h3>
            <p className="text-sm text-gray-500">Chia sẻ câu chuyện của bạn</p>
          </div>
        </div>
      </div>
    </div>
  )
} 