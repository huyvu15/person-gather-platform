'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Pin, 
  Archive, 
  Trash2, 
  Edit, 
  X,
  Tag,
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isPinned: boolean
  isArchived: boolean
  color: string
  createdAt: string
  updatedAt: string
}

const colorOptions = [
  { name: 'blue', class: 'bg-blue-500', text: 'text-blue-500' },
  { name: 'green', class: 'bg-green-500', text: 'text-green-500' },
  { name: 'purple', class: 'bg-purple-500', text: 'text-purple-500' },
  { name: 'pink', class: 'bg-pink-500', text: 'text-pink-500' },
  { name: 'orange', class: 'bg-orange-500', text: 'text-orange-500' },
  { name: 'yellow', class: 'bg-yellow-500', text: 'text-yellow-500' },
]

const categories = [
  'general', 'work', 'personal', 'ideas', 'todo', 'important'
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: [] as string[],
    color: 'blue'
  })

  // Load notes
  useEffect(() => {
    loadNotes()
  }, [])

  // Filter notes
  useEffect(() => {
    let filtered = notes

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory)
    }

    if (!showArchived) {
      filtered = filtered.filter(note => !note.isArchived)
    }

    setFilteredNotes(filtered)
  }, [notes, searchQuery, selectedCategory, showArchived])

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notes')
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      })

      if (response.ok) {
        const createdNote = await response.json()
        setNotes(prev => [createdNote, ...prev])
        setIsCreateModalOpen(false)
        setNewNote({ title: '', content: '', category: 'general', tags: [], color: 'blue' })
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const updateNote = async (note: Note) => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setNotes(prev => prev.map(n => n.id === note.id ? updatedNote : n))
        setEditingNote(null)
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== id))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const togglePin = async (note: Note) => {
    const updatedNote = { ...note, isPinned: !note.isPinned }
    await updateNote(updatedNote)
  }

  const toggleArchive = async (note: Note) => {
    const updatedNote = { ...note, isArchived: !note.isArchived }
    await updateNote(updatedNote)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <BookOpen className="h-8 w-8" />
                Ghi chú
              </h1>
              <p className="text-gray-600 mt-1">Lưu trữ và quản lý ý tưởng của bạn</p>
            </div>
            <motion.button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Tạo ghi chú
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft border border-white/20 p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between space-x-4">
            {/* Search */}
            <motion.div 
              className="relative flex-1 max-w-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm ghi chú..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 placeholder-gray-400 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            {/* Category Filter */}
            <motion.select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </motion.select>

            {/* Archive Toggle */}
            <motion.button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                showArchived 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Archive className="h-5 w-5 mr-2 inline" />
              {showArchived ? 'Đã lưu trữ' : 'Đã lưu trữ'}
            </motion.button>
          </div>
        </motion.div>

        {/* Notes Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <motion.div 
                className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 p-6 hover:shadow-lg transition-all duration-300 ${
                  note.isPinned ? 'ring-2 ring-purple-500' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colorOptions.find(c => c.name === note.color)?.class}`} />
                    <span className="text-xs text-gray-500 uppercase font-medium">
                      {note.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {note.isPinned && (
                      <Pin className="h-4 w-4 text-purple-500" />
                    )}
                    <motion.button
                      onClick={() => togglePin(note)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Pin className={`h-4 w-4 ${note.isPinned ? 'text-purple-500' : 'text-gray-400'}`} />
                    </motion.button>
                  </div>
                </div>

                {/* Note Content */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {note.content}
                  </p>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Note Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(note.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <motion.button
                      onClick={() => setEditingNote(note)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      onClick={() => toggleArchive(note)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Archive className="h-4 w-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded-lg hover:bg-red-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex min-h-[400px] items-center justify-center">
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
                  <BookOpen className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có ghi chú</h3>
                <p className="text-gray-600 mb-6">Bắt đầu tạo ghi chú đầu tiên của bạn</p>
                <motion.button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-5 w-5 mr-2 inline" />
                  Tạo ghi chú đầu tiên
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(isCreateModalOpen || editingNote) && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingNote ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
                    </h2>
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setEditingNote(null)
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
                        value={editingNote?.title || newNote.title}
                        onChange={(e) => {
                          if (editingNote) {
                            setEditingNote({ ...editingNote, title: e.target.value })
                          } else {
                            setNewNote({ ...newNote, title: e.target.value })
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700"
                        placeholder="Nhập tiêu đề ghi chú..."
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung
                      </label>
                      <textarea
                        value={editingNote?.content || newNote.content}
                        onChange={(e) => {
                          if (editingNote) {
                            setEditingNote({ ...editingNote, content: e.target.value })
                          } else {
                            setNewNote({ ...newNote, content: e.target.value })
                          }
                        }}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 resize-none"
                        placeholder="Nhập nội dung ghi chú..."
                      />
                    </div>

                    {/* Category and Color */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <select
                          value={editingNote?.category || newNote.category}
                          onChange={(e) => {
                            if (editingNote) {
                              setEditingNote({ ...editingNote, category: e.target.value })
                            } else {
                              setNewNote({ ...newNote, category: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Màu sắc
                        </label>
                        <div className="flex gap-2">
                          {colorOptions.map(color => (
                            <motion.button
                              key={color.name}
                              onClick={() => {
                                if (editingNote) {
                                  setEditingNote({ ...editingNote, color: color.name })
                                } else {
                                  setNewNote({ ...newNote, color: color.name })
                                }
                              }}
                              className={`w-8 h-8 rounded-full ${color.class} ${
                                (editingNote?.color || newNote.color) === color.name 
                                  ? 'ring-2 ring-gray-400' 
                                  : ''
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tags (phân cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={(editingNote?.tags || newNote.tags).join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          if (editingNote) {
                            setEditingNote({ ...editingNote, tags })
                          } else {
                            setNewNote({ ...newNote, tags })
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700"
                        placeholder="work, important, todo..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setEditingNote(null)
                      }}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        if (editingNote) {
                          updateNote(editingNote)
                        } else {
                          createNote()
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingNote ? 'Cập nhật' : 'Tạo ghi chú'}
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