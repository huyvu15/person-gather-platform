'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Image, 
  StickyNote, 
  Settings, 
  Upload,
  Folder,
  Calendar,
  BookOpen,
  Star
} from 'lucide-react'
import Auth from './Auth'

const navigation = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Memories', href: '/memories', icon: Image },
  { name: 'Bài viết', href: '/posts', icon: BookOpen },
  { name: 'Lịch', href: '/calendar', icon: Calendar },
  { name: 'Ghi chú', href: '/notes', icon: StickyNote },
  { name: 'Yêu thích', href: '/favorites', icon: Star },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`bg-white border-r border-neutral-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-neutral-900">MyGather</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            <div className={`w-4 h-4 border-2 border-neutral-600 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}>
              <div className="w-2 h-2 bg-neutral-600 mx-auto mt-0.5"></div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-500 mb-3">Thao tác nhanh</h3>
            <div className="space-y-2">
              <button className="flex items-center w-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                <Upload className="h-4 w-4 mr-3" />
                Tải lên ảnh
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                <Folder className="h-4 w-4 mr-3" />
                Tạo thư mục
              </button>
            </div>
          </div>
        )}

        {/* Auth */}
        <div className="p-4 border-t border-neutral-200">
          <Auth 
            isLoggedIn={true}
            user={{
              name: 'Nguyễn Văn A',
              email: 'user@example.com'
            }}
            onLogin={() => console.log('Login')}
            onLogout={() => console.log('Logout')}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  )
} 