'use client'

import { useState } from 'react'
import { Calendar, Folder, Tag, Star, Filter } from 'lucide-react'

interface FilterPanelProps {
  onFilterChange?: (filters: any) => void
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    dateRange: '',
    folder: '',
    tags: [] as string[],
    favorites: false,
  })

  const folders = ['memories', 'family', 'travel', 'work', 'personal']
  const tags = ['important', 'family', 'travel', 'work', 'personal', 'vacation']

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Filter className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Khoảng thời gian
        </label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Tất cả thời gian</option>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
      </div>

      {/* Folder Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Folder className="h-4 w-4 inline mr-1" />
          Thư mục
        </label>
        <select
          value={filters.folder}
          onChange={(e) => handleFilterChange('folder', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Tất cả thư mục</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder.charAt(0).toUpperCase() + folder.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="h-4 w-4 inline mr-1" />
          Tags
        </label>
        <div className="space-y-2">
          {tags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={(e) => {
                  const newTags = e.target.checked
                    ? [...filters.tags, tag]
                    : filters.tags.filter(t => t !== tag)
                  handleFilterChange('tags', newTags)
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Favorites */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.favorites}
            onChange={(e) => handleFilterChange('favorites', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <Star className="h-4 w-4 ml-2 text-gray-600" />
          <span className="ml-2 text-sm font-medium text-gray-700">Chỉ hiển thị yêu thích</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const clearedFilters = {
            dateRange: '',
            folder: '',
            tags: [],
            favorites: false,
          }
          setFilters(clearedFilters)
          onFilterChange?.(clearedFilters)
        }}
        className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  )
} 