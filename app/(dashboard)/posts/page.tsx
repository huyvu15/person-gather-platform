'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  X,
  Tag,
  Calendar,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Globe,
  Star,
  Trash2,
  Grid3X3,
  List,
  User
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl: string | null
  category: string
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

const categories = [
  'general', 'travel', 'technology', 'lifestyle', 'food', 'photography', 'work', 'personal'
]

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPublished, setShowPublished] = useState(false) // Thay đổi từ true thành false
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid') // Thêm view mode
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: 'general',
    tags: [] as string[],
    isPublished: false,
    isFeatured: false
  })

  // Load posts
  useEffect(() => {
    loadPosts()
  }, [])

  // Filter posts
  useEffect(() => {
    let filtered = posts

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Chỉ lọc theo isPublished nếu showPublished = true
    if (showPublished) {
      filtered = filtered.filter(post => post.isPublished)
    }

    console.log('Filtering posts:', { 
      totalPosts: posts.length, 
      filteredPosts: filtered.length, 
      showPublished, 
      selectedCategory 
    }) // Debug log

    setFilteredPosts(filtered)
  }, [posts, searchQuery, selectedCategory, showPublished])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)
      if (showPublished) params.append('published', 'true')
      params.append('userId', user?.id || '')

      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        console.error('Failed to load posts:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createPost = async () => {
    try {
      const postData = {
        ...newPost,
        userId: user?.id
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const createdPost = await response.json()
        console.log('Created post:', createdPost) // Debug log
        setPosts(prev => [createdPost, ...prev])
        setIsCreateModalOpen(false)
        setNewPost({ 
          title: '', 
          content: '', 
          excerpt: '', 
          imageUrl: '', 
          category: 'general', 
          tags: [] as string[],
          isPublished: false,
          isFeatured: false
        })
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const updatePost = async (post: Post) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })

      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p))
        setEditingPost(null)
      }
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPosts(prev => prev.filter(post => post.id !== id))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const togglePublish = async (post: Post) => {
    const updatedPost = { ...post, isPublished: !post.isPublished }
    await updatePost(updatedPost)
  }

  const toggleFeatured = async (post: Post) => {
    const updatedPost = { ...post, isFeatured: !post.isFeatured }
    await updatePost(updatedPost)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} phút`
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        {/* Header */}
        <motion.div 
          className="mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <BookOpen className="h-8 w-8" />
                Bài viết
              </h1>
              <p className="text-gray-600 mt-1">Chia sẻ những câu chuyện và kinh nghiệm của bạn</p>
            </div>
            <motion.button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Viết bài
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft border border-white/20 p-4 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between space-x-3">
            {/* Search */}
            <motion.div 
              className="relative flex-1 max-w-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700 placeholder-gray-400 text-sm transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            {/* Category Filter */}
            <motion.select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl bg-white/50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
              whileHover={{ scale: 1.01 }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </motion.select>

            {/* Published Toggle */}
            <motion.button
              onClick={() => setShowPublished(!showPublished)}
              className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                showPublished 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="h-4 w-4 mr-1 inline" />
              {showPublished ? 'Đã xuất bản' : 'Tất cả'}
            </motion.button>

            {/* View Mode Toggle */}
            <motion.button
              onClick={() => setViewMode(viewMode === 'grid' ? 'feed' : 'grid')}
              className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {viewMode === 'grid' ? (
                <>
                  <Grid3X3 className="h-4 w-4 mr-1 inline" />
                  Grid
                </>
              ) : (
                <>
                  <List className="h-4 w-4 mr-1 inline" />
                  Feed
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Posts Container */}
        <motion.div 
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "max-w-2xl mx-auto space-y-6"
          }
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          key={viewMode} // Thêm key để trigger re-render khi view mode thay đổi
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <motion.div 
                className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              viewMode === 'grid' ? (
                // Grid View
                <motion.article
                  key={post.id}
                  className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    post.isFeatured ? 'ring-2 ring-yellow-500' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {post.isFeatured && (
                        <div className="p-1 bg-yellow-500 rounded-full">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <motion.button
                        onClick={() => toggleFeatured(post)}
                        className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star className={`h-4 w-4 ${post.isFeatured ? 'text-yellow-500' : 'text-gray-400'}`} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 uppercase font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {post.isPublished ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
                            Đã xuất bản
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                            Bản nháp
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.updatedAt)}
                      </div>
                      <span>{getReadTime(post.content)}</span>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.viewCount}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          onClick={() => togglePublish(post)}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Globe className="h-4 w-4 text-gray-600" />
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingPost(post)}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </motion.button>
                        <motion.button
                          onClick={() => deletePost(post.id)}
                          className="p-1 rounded-lg hover:bg-red-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ) : (
                // Feed View (Instagram style)
                <motion.article
                  key={post.id}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">mygather</div>
                        <div className="text-xs text-gray-500">{formatDate(post.updatedAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <motion.button
                        onClick={() => toggleFeatured(post)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star className={`h-4 w-4 ${post.isFeatured ? 'text-yellow-500' : 'text-gray-400'}`} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart className="h-6 w-6 text-gray-600" />
                        </motion.button>
                        <motion.button
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Share2 className="h-6 w-6 text-gray-600" />
                        </motion.button>
                      </div>
                      <motion.button
                        onClick={() => togglePublish(post)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          post.isPublished 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      </motion.button>
                    </div>

                    {/* Likes */}
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                      {post.viewCount} lượt xem
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                      <span className="font-semibold text-gray-900 mr-2">mygather</span>
                      <span className="text-gray-900">{post.title}</span>
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-blue-600 text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Comments */}
                    <div className="text-sm text-gray-500 mb-3">
                      Xem tất cả {post.viewCount} lượt xem
                    </div>

                    {/* Add comment */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                      <input
                        type="text"
                        placeholder="Thêm bình luận..."
                        className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-400"
                      />
                      <motion.button
                        className="text-blue-600 text-sm font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Đăng
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              )
            ))
          ) : (
            <div className="col-span-full flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center"
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
                  <BookOpen className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài viết</h3>
                <p className="text-gray-600 mb-6">Bắt đầu viết bài đầu tiên của bạn</p>
                <motion.button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-5 w-5 mr-2 inline" />
                  Viết bài đầu tiên
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(isCreateModalOpen || editingPost) && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingPost ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                    </h2>
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setEditingPost(null)
                      }}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={editingPost?.title || newPost.title}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost({ ...editingPost, title: e.target.value })
                          } else {
                            setNewPost({ ...newPost, title: e.target.value })
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700"
                        placeholder="Nhập tiêu đề bài viết..."
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung
                      </label>
                      <textarea
                        value={editingPost?.content || newPost.content}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost({ ...editingPost, content: e.target.value })
                          } else {
                            setNewPost({ ...newPost, content: e.target.value })
                          }
                        }}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700 resize-none"
                        placeholder="Nhập nội dung bài viết..."
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tóm tắt (tùy chọn)
                      </label>
                      <textarea
                        value={editingPost?.excerpt || newPost.excerpt}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost({ ...editingPost, excerpt: e.target.value })
                          } else {
                            setNewPost({ ...newPost, excerpt: e.target.value })
                          }
                        }}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700 resize-none"
                        placeholder="Tóm tắt ngắn gọn về bài viết..."
                      />
                    </div>

                    {/* Image URL and Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          URL hình ảnh (tùy chọn)
                        </label>
                        <input
                          type="url"
                          value={editingPost?.imageUrl || newPost.imageUrl}
                          onChange={(e) => {
                            if (editingPost) {
                              setEditingPost({ ...editingPost, imageUrl: e.target.value })
                            } else {
                              setNewPost({ ...newPost, imageUrl: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <select
                          value={editingPost?.category || newPost.category}
                          onChange={(e) => {
                            if (editingPost) {
                              setEditingPost({ ...editingPost, category: e.target.value })
                            } else {
                              setNewPost({ ...newPost, category: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tags (phân cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={(editingPost?.tags || newPost.tags).join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          if (editingPost) {
                            setEditingPost({ ...editingPost, tags })
                          } else {
                            setNewPost({ ...newPost, tags })
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 text-gray-700"
                        placeholder="travel, vacation, family..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setEditingPost(null)
                      }}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        if (editingPost) {
                          updatePost(editingPost)
                        } else {
                          createPost()
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingPost ? 'Cập nhật' : 'Tạo bài viết'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 