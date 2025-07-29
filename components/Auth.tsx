'use client'

import { useState } from 'react'
import { User, LogOut, LogIn, UserPlus, Settings } from 'lucide-react'

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
        <button
          onClick={onLogin}
          className="flex items-center px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <LogIn className="h-4 w-4 mr-2" />
          {!isCollapsed && <span>Đăng nhập</span>}
        </button>
        {!isCollapsed && (
          <button
            onClick={onLogin}
            className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Đăng ký
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors w-full"
        title={isCollapsed ? user?.name : undefined}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" />
          </div>
        )}
        {!isCollapsed && (
          <span className="text-sm font-medium text-neutral-700 truncate">
            {user?.name || 'User'}
          </span>
        )}
      </button>

      {showDropdown && !isCollapsed && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <button className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              <User className="h-4 w-4 mr-2" />
              Hồ sơ
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </button>
          </div>
          
          <div className="border-t border-neutral-100 pt-1">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 