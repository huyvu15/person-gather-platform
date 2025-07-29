'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, ChevronDown, X, Calendar, Folder, Tag, Star } from 'lucide-react'

interface SearchAndFilterProps {
  onSearchChange?: (query: string) => void
  onFilterChange?: (filters: any) => void
}

export default function SearchAndFilter({ onSearchChange, onFilterChange }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: '',
    folder: '',
    tags: [] as string[],
    favorites: false,
  })
  const filterRef = useRef<HTMLDivElement>(null)

  const folders = ['memories', 'family', 'travel', 'work', 'personal']
  const tags = ['important', 'family', 'travel', 'work', 'personal', 'vacation']

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: '',
      folder: '',
      tags: [],
      favorites: false,
    }
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)
  }

  const activeFiltersCount = [
    filters.dateRange,
    filters.folder,
    filters.tags.length,
    filters.favorites
  ].filter(Boolean).length

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm ảnh..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 hover:bg-white transition-all duration-300"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-3 border border-neutral-200 rounded-xl bg-white/50 hover:bg-white transition-all duration-300 hover:shadow-soft"
          >
            <Filter className="h-4 w-4 mr-2 text-neutral-600" />
            <span className="text-neutral-700">Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-gradient-accent text-white text-xs rounded-full shadow-glow-accent">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Dropdown Content */}
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-soft z-50 animate-slide-down">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-neutral-900">Bộ lọc</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {/* Date Range */}
                <div className="mb-4">
                  <label className="flex items-center text-xs font-medium text-neutral-700 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    Khoảng thời gian
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                  </select>
                </div>

                {/* Folder Filter */}
                <div className="mb-4">
                  <label className="flex items-center text-xs font-medium text-neutral-700 mb-2">
                    <Folder className="h-3 w-3 mr-1" />
                    Thư mục
                  </label>
                  <select
                    value={filters.folder}
                    onChange={(e) => handleFilterChange('folder', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
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
                <div className="mb-4">
                  <label className="flex items-center text-xs font-medium text-neutral-700 mb-2">
                    <Tag className="h-3 w-3 mr-1" />
                    Tags
                  </label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {tags.map((tag) => (
                      <label key={tag} className="flex items-center hover:bg-neutral-50 rounded-lg p-1 transition-colors">
                        <input
                          type="checkbox"
                          checked={filters.tags.includes(tag)}
                          onChange={(e) => {
                            const newTags = e.target.checked
                              ? [...filters.tags, tag]
                              : filters.tags.filter(t => t !== tag)
                            handleFilterChange('tags', newTags)
                          }}
                          className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <span className="ml-2 text-xs text-neutral-700 capitalize">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Favorites */}
                <div className="mb-4">
                  <label className="flex items-center hover:bg-neutral-50 rounded-lg p-1 transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.favorites}
                      onChange={(e) => handleFilterChange('favorites', e.target.checked)}
                      className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <Star className="h-3 w-3 ml-2 text-neutral-600" />
                    <span className="ml-2 text-xs font-medium text-neutral-700">Chỉ hiển thị yêu thích</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 