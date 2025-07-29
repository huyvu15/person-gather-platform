'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Image, 
  StickyNote, 
  Settings, 
  Upload,
  Folder,
  Calendar,
  BookOpen,
  Star,
  Sparkles,
  Heart,
  Camera
} from 'lucide-react'
import Auth from './Auth'

const navigation = [
  { 
    name: 'Trang chủ', 
    href: '/', 
    icon: Home,
    color: 'from-pink-400 to-purple-500',
    description: 'Quay về trang chủ'
  },
  { 
    name: 'Memories', 
    href: '/memories', 
    icon: Image,
    color: 'from-blue-400 to-cyan-500',
    description: 'Kho ảnh kỷ niệm'
  },
  { 
    name: 'Bài viết', 
    href: '/posts', 
    icon: BookOpen,
    color: 'from-green-400 to-emerald-500',
    description: 'Viết và chia sẻ'
  },
  { 
    name: 'Lịch', 
    href: '/calendar', 
    icon: Calendar,
    color: 'from-orange-400 to-red-500',
    description: 'Lịch trình và sự kiện'
  },
  { 
    name: 'Ghi chú', 
    href: '/notes', 
    icon: StickyNote,
    color: 'from-yellow-400 to-orange-500',
    description: 'Ghi chú nhanh'
  },
  { 
    name: 'Yêu thích', 
    href: '/favorites', 
    icon: Star,
    color: 'from-purple-400 to-pink-500',
    description: 'Nội dung yêu thích'
  },
  { 
    name: 'Cài đặt', 
    href: '/settings', 
    icon: Settings,
    color: 'from-gray-400 to-slate-500',
    description: 'Tùy chỉnh hệ thống'
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-xl border-r border-white/20 transition-all duration-500 ease-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <motion.div 
          className="flex h-20 items-center justify-between px-6 border-b border-white/20 bg-gradient-to-r from-purple-50 to-pink-50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {!isCollapsed && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                MyGather
              </h1>
            </motion.div>
          )}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            <motion.div 
              className={`w-5 h-5 border-2 border-purple-400 rounded-lg transition-all duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              animate={{ rotate: isCollapsed ? 180 : 0 }}
            >
              <div className="w-2 h-2 bg-purple-400 mx-auto mt-0.5 rounded-full"></div>
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <AnimatePresence>
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              const isHovered = hoveredItem === item.name
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'text-gray-600 hover:bg-white/60 hover:shadow-md'
                    }`}
                  >
                    {/* Background gradient on hover */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 transition-opacity duration-300`}
                      animate={{ opacity: isHovered && !isActive ? 0.1 : 0 }}
                    />
                    
                    {/* Icon */}
                    <motion.div
                      className={`relative z-10 p-2 rounded-xl ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-r from-purple-100 to-pink-100 group-hover:bg-white/80'
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon className={`h-5 w-5 ${
                        isActive ? 'text-white' : 'text-purple-600'
                      }`} />
                    </motion.div>
                    
                    {/* Text */}
                    {!isCollapsed && (
                      <motion.div 
                        className="ml-3 flex-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
                      >
                        <span className={`font-medium ${
                          isActive ? 'text-white' : 'text-gray-700'
                        }`}>
                          {item.name}
                        </span>
                        <p className={`text-xs ${
                          isActive ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute right-2 w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <motion.div 
            className="p-4 border-t border-white/20 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Thao tác nhanh
            </h3>
            <div className="space-y-2">
              <motion.button 
                className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-300 group"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
                  <Upload className="h-4 w-4 text-blue-600" />
                </div>
                <span className="ml-3">Tải lên ảnh</span>
              </motion.button>
              <motion.button 
                className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-300 group"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                  <Folder className="h-4 w-4 text-green-600" />
                </div>
                <span className="ml-3">Tạo thư mục</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Auth */}
        <motion.div 
          className="p-4 border-t border-white/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Auth 
            isLoggedIn={true}
            user={{
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@example.com',
              avatar: '/api/placeholder/40/40'
            }}
            isCollapsed={isCollapsed}
          />
        </motion.div>
      </div>
    </motion.div>
  )
} 