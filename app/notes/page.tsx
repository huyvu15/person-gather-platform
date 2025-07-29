import { Plus, Search, Filter, Calendar, Tag } from 'lucide-react'

export default function NotesPage() {
  const notes = [
    {
      id: 1,
      title: 'Ghi chú về chuyến du lịch',
      content: 'Chuyến du lịch đến Đà Nẵng thật tuyệt vời. Cần lưu lại những địa điểm đã ghé thăm...',
      tags: ['travel', 'vacation'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Công việc tuần này',
      content: 'Cần hoàn thành dự án A, họp với team B vào thứ 4...',
      tags: ['work', 'important'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ghi chú</h1>
            <p className="text-gray-600">Quản lý và tạo ghi chú cá nhân</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Tạo ghi chú
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
              placeholder="Tìm kiếm ghi chú..."
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

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Intl.DateTimeFormat('vi-VN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).format(note.updatedAt)}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Note Card */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-primary-400 transition-colors cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo ghi chú mới</h3>
            <p className="text-sm text-gray-500">Bắt đầu viết ghi chú của bạn</p>
          </div>
        </div>
      </div>
    </div>
  )
} 