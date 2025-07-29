'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, LogIn, UserPlus, Settings, Heart, Crown } from 'lucide-react'

interface AuthProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogin?: () => void
  onLogout?: () => void
  isCollapsed?: boolean
}

export default function Auth({ isLoggedIn = false, user, onLogin, onLogout, isCollapsed = false }: AuthProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={onLogin}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
            <LogIn className="h-4 w-4 text-purple-600" />
          </div>
          {!isCollapsed && <span className="ml-2">Đăng nhập</span>}
        </motion.button>
        {!isCollapsed && (
          <motion.button
            onClick={onLogin}
            className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Đăng ký
          </motion.button>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 w-full group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={isCollapsed ? user?.name : undefined}
      >
        {user?.avatar ? (
          <motion.img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full ring-2 ring-purple-200 group-hover:ring-purple-300 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
          />
        ) : (
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold"
            whileHover={{ scale: 1.1 }}
          >
            <User className="h-5 w-5" />
          </motion.div>
        )}
        {!isCollapsed && (
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        )}
        {!isCollapsed && (
          <motion.div
            animate={{ rotate: showDropdown ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 border-2 border-gray-300 rounded-full"
          >
            <div className="w-1.5 h-1.5 bg-gray-400 mx-auto mt-0.5 rounded-full"></div>
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && !isCollapsed && (
          <motion.div 
            className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 py-3 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full ring-2 ring-purple-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                    <User className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="py-2">
              <motion.button 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 mr-3">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                Hồ sơ
              </motion.button>
              <motion.button 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 mr-3">
                  <Settings className="h-4 w-4 text-green-600" />
                </div>
                Cài đặt
              </motion.button>
              <motion.button 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 mr-3">
                  <Heart className="h-4 w-4 text-yellow-600" />
                </div>
                Yêu thích
              </motion.button>
              <motion.button 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 mr-3">
                  <Crown className="h-4 w-4 text-purple-600" />
                </div>
                Premium
              </motion.button>
            </div>
            
            {/* Logout */}
            <div className="border-t border-white/20 pt-2">
              <motion.button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-red-100 to-pink-100 mr-3">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                Đăng xuất
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 