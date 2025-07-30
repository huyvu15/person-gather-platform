'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  Search, 
  Settings, 
  User, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Home,
  Briefcase,
  Heart,
  Edit,
  Trash2,
  X,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  allDay: boolean
  color: string
  category: string
  location?: string
  attendees: string[]
  isRecurring: boolean
  recurrence?: string
  isCompleted: boolean
  priority: string
  createdAt: string
  updatedAt: string
}

const colorOptions = [
  { name: 'blue', class: 'bg-blue-500', text: 'text-blue-500' },
  { name: 'green', class: 'bg-green-500', text: 'text-green-500' },
  { name: 'purple', class: 'bg-purple-500', text: 'text-purple-500' },
  { name: 'pink', class: 'bg-pink-500', text: 'text-pink-500' },
  { name: 'orange', class: 'bg-orange-500', text: 'text-orange-500' },
  { name: 'red', class: 'bg-red-500', text: 'text-red-500' },
  { name: 'yellow', class: 'bg-yellow-500', text: 'text-yellow-500' },
  { name: 'teal', class: 'bg-teal-500', text: 'text-teal-500' },
]

const categories = [
  'general', 'work', 'personal', 'family', 'health', 'travel', 'meeting', 'birthday'
]

const priorities = [
  { value: 'low', label: 'Thấp', icon: AlertCircle, color: 'text-green-500' },
  { value: 'medium', label: 'Trung bình', icon: Clock, color: 'text-yellow-500' },
  { value: 'high', label: 'Cao', icon: Star, color: 'text-red-500' },
]

const recurrences = [
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'yearly', label: 'Hàng năm' },
]

const timeSlots = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
]

// Calculate current week days
const getCurrentWeekDays = (date: Date = new Date()) => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay()) // Start from Sunday
  
  const days = []
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek)
    dayDate.setDate(startOfWeek.getDate() + i)
    
    days.push({
      day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: dayDate.getDate(),
      fullDate: dayDate
    })
  }
  
  return days
}

const calendars = [
  { name: 'My Calendar', color: 'bg-blue-400' },
  { name: 'Work', color: 'bg-green-400' },
  { name: 'Personal', color: 'bg-purple-400' },
  { name: 'Family', color: 'bg-orange-400' },
]

export default function CalendarPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(() => {
    // Set to current date to show current week
    const now = new Date()
    console.log('Initial currentDate:', now.toISOString())
    return now
  })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [currentWeekDays, setCurrentWeekDays] = useState(getCurrentWeekDays())
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    color: 'blue',
    category: 'general',
    location: '',
    attendees: [] as string[],
    isRecurring: false,
    recurrence: '',
    priority: 'medium'
  })

  // Update current week days when currentDate changes
  useEffect(() => {
    const newWeekDays = getCurrentWeekDays(currentDate)
    setCurrentWeekDays(newWeekDays)
  }, [currentDate])

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Load events
  useEffect(() => {
    loadEvents()
  }, [currentDate])

  // Filter events
  useEffect(() => {
    let filtered = events

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, selectedCategory])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      
      // Calculate current week dates using currentDate
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()) // Start from Sunday
      startOfWeek.setHours(0, 0, 0, 0)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // End on Saturday
      endOfWeek.setHours(23, 59, 59, 999)

      const params = new URLSearchParams()
      params.append('startDate', startOfWeek.toISOString())
      params.append('endDate', endOfWeek.toISOString())
      params.append('userId', user?.id || '')

      const response = await fetch(`/api/events?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        console.error('Failed to load events:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createEvent = async () => {
    try {
      // Validate required fields
      if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
        alert('Vui lòng nhập tiêu đề, ngày bắt đầu và ngày kết thúc')
        return
      }

      // Validate date range
      const startDate = new Date(newEvent.startDate)
      const endDate = new Date(newEvent.endDate)
      
      if (startDate >= endDate) {
        alert('Ngày kết thúc phải sau ngày bắt đầu')
        return
      }

      // Format datetime for API
      const eventData = {
        ...newEvent,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: user?.id
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        const createdEvent = await response.json()
        
        // Reload events from API instead of just adding to state
        await loadEvents()
        
        setIsCreateModalOpen(false)
        setNewEvent({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          allDay: false,
          color: 'blue',
          category: 'general',
          location: '',
          attendees: [],
          isRecurring: false,
          recurrence: '',
          priority: 'medium'
        })
      } else {
        const errorData = await response.json()
        console.error('Error creating event:', errorData)
        alert(`Lỗi: ${errorData.error || 'Không thể tạo sự kiện'}`)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Có lỗi xảy ra khi tạo sự kiện')
    }
  }

  const updateEvent = async (event: Event) => {
    try {
      // Format datetime for API
      const formattedEvent = {
        ...event,
        startDate: new Date(event.startDate).toISOString(),
        endDate: new Date(event.endDate).toISOString()
      }

      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedEvent)
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        
        // Reload events from API
        await loadEvents()
        
        setEditingEvent(null)
      } else {
        const errorData = await response.json()
        console.error('Error updating event:', errorData)
        alert(`Lỗi: ${errorData.error || 'Không thể cập nhật sự kiện'}`)
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Có lỗi xảy ra khi cập nhật sự kiện')
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Reload events from API
        await loadEvents()
      } else {
        const errorData = await response.json()
        console.error('Error deleting event:', errorData)
        alert(`Lỗi: ${errorData.error || 'Không thể xóa sự kiện'}`)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Có lỗi xảy ra khi xóa sự kiện')
    }
  }

  const toggleComplete = async (event: Event) => {
    const updatedEvent = { ...event, isCompleted: !event.isCompleted }
    await updateEvent(updatedEvent)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEventsForDayAndTime = (day: string, time: string) => {
    const filtered = filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate)
      
      // Get the day of week for the event date (using local time)
      const eventDayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
      
      // Check if event is on the same day of week
      if (eventDayOfWeek !== day) {
        return false
      }
      
      // If it's an all-day event, show it
      if (event.allDay) {
        return true
      }
      
      // For time-based events, check if they overlap with the time slot
      // Convert time slot to 24-hour format for comparison
      const timeMatch = time.match(/(\d+)\s*(AM|PM)/)
      if (!timeMatch) {
        return false
      }
      
      let slotHour = parseInt(timeMatch[1])
      const period = timeMatch[2]
      
      if (period === 'PM' && slotHour !== 12) slotHour += 12
      if (period === 'AM' && slotHour === 12) slotHour = 0
      
      // Get event start and end hours (using local time)
      const eventStartHour = eventDate.getHours()
      const eventEndDate = new Date(event.endDate)
      const eventEndHour = eventEndDate.getHours()
      
      // Check if event overlaps with time slot
      const overlaps = eventStartHour <= slotHour && eventEndHour > slotHour
      
      return overlaps
    })
    
    return filtered
  }

  const getPriorityIcon = (priority: string) => {
    const priorityInfo = priorities.find(p => p.value === priority)
    return priorityInfo?.icon || Clock
  }

  const getPriorityColor = (priority: string) => {
    const priorityInfo = priorities.find(p => p.value === priority)
    return priorityInfo?.color || 'text-gray-500'
  }

  // Thêm function để tạo sự kiện từ ô lịch
  const createEventFromCell = async (day: string, time: string) => {
    // Convert day and time to datetime
    const dayIndex = currentWeekDays.findIndex(d => d.day === day)
    if (dayIndex === -1) return

    // Set date to current week + day offset using currentDate
    const targetDate = new Date(currentDate)
    targetDate.setDate(currentDate.getDate() + dayIndex - currentDate.getDay())

    // Parse time
    const timeMatch = time.match(/(\d+)\s*(AM|PM)/)
    if (!timeMatch) return

    let hour = parseInt(timeMatch[1])
    const period = timeMatch[2]
    
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0

    // Set start time
    const startDate = new Date(targetDate)
    startDate.setHours(hour, 0, 0, 0)

    // Set end time (1 hour later)
    const endDate = new Date(startDate)
    endDate.setHours(hour + 1, 0, 0, 0)

    // Create event directly
    const newEventData = {
      title: `Event at ${time}`,
      description: `Created from ${day} at ${time}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      allDay: false,
      color: 'blue',
      category: 'general',
      location: '',
      attendees: [],
      isRecurring: false,
      recurrence: '',
      priority: 'medium',
      userId: user?.id
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEventData)
      })

      if (response.ok) {
        const createdEvent = await response.json()
        await loadEvents() // Reload events to show on UI
      } else {
        const errorData = await response.json()
        console.error('Error creating event from cell:', errorData)
      }
    } catch (error) {
      console.error('Error creating event from cell:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar */}
        <motion.div 
          className="w-80 bg-white/80 backdrop-blur-xl border-r border-white/40 p-6 flex flex-col shadow-xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Calendar
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your events & schedule</p>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This Week</p>
                <p className="text-2xl font-bold">{events.length} Events</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-1">
                <motion.button
                  className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToPreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </motion.button>
                <motion.button
                  className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToNextWeek}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-gray-500 font-medium py-1">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                <motion.button
                  key={date}
                  className={`text-center py-1 rounded-lg transition-all duration-200 ${
                    date === currentDate.getDate() 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg' 
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {date}
                </motion.button>
              ))}
            </div>
          </div>

          {/* My Calendars */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">My calendars</h4>
            <div className="space-y-2">
              {calendars.map((calendar, index) => (
                <motion.div
                  key={calendar.name}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 transition-colors cursor-pointer border border-transparent hover:border-white/40"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <div className={`w-3 h-3 rounded-full ${calendar.color} shadow-sm`} />
                  <span className="text-sm text-gray-700 font-medium">{calendar.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating Action Button */}
          <motion.button
            onClick={() => setIsCreateModalOpen(true)}
            className="absolute bottom-6 left-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl border-b border-white/40 p-6 flex items-center justify-between shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-6">
              <motion.button
                className="p-2 rounded-xl hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </motion.button>
              
              {/* Navigation */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={goToPreviousWeek}
                  className="p-2 rounded-xl hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </motion.button>
                
                <motion.button
                  onClick={goToToday}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Today
                </motion.button>
                
                <motion.button
                  onClick={goToNextWeek}
                  className="p-2 rounded-xl hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </motion.button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/60 text-gray-700 placeholder-gray-400 transition-all duration-300 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>

              <motion.select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </motion.select>

              <motion.button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </motion.button>
            </div>
          </motion.div>

          {/* Calendar Grid */}
          <div className="flex-1 p-6 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <motion.div 
                  className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-4">
                {/* Time Column */}
                <div className="space-y-4">
                  <div className="h-16 flex items-center justify-center">
                    <div className="text-sm font-semibold text-gray-500">Time</div>
                  </div>
                  {timeSlots.map(time => (
                    <div key={time} className="h-20 flex items-center text-sm text-gray-500 font-medium">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Days Columns */}
                {currentWeekDays.map(day => (
                  <div key={day.day} className="space-y-4">
                    <div className="h-16 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-700">{day.day}</div>
                        <div className="text-xs text-gray-500">{day.date}</div>
                      </div>
                    </div>
                    {timeSlots.map(time => (
                      <motion.div 
                        key={`${day.day}-${time}`} 
                        className="h-20 border border-gray-200 rounded-xl p-2 relative hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 cursor-pointer group"
                        onClick={() => createEventFromCell(day.day, time)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        title={`Click to create event at ${time} on ${day.day}`}
                      >
                        {/* Add event hint */}
                        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                            <Plus className="h-3 w-3 inline mr-1" />
                            Add Event
                          </div>
                        </div> */}
                        
                        {/* Empty state hint */}
                        {getEventsForDayAndTime(day.day, time).length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="text-xs text-purple-500 font-medium">+ Add Event</span>
                          </div>
                        )}
                        
                        {getEventsForDayAndTime(day.day, time).map((event, index) => (
                          <motion.div
                            key={`${event.id}-${day.day}-${time}-${index}`}
                            className={`absolute left-1 right-1 p-2 rounded-lg text-xs text-white cursor-pointer shadow-lg ${
                              colorOptions.find(c => c.name === event.color)?.class || 'bg-gradient-to-r from-purple-500 to-pink-500'
                            } ${event.isCompleted ? 'opacity-60' : ''}`}
                            style={{ 
                              top: `${index * 24}px`,
                              zIndex: index + 1
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            onClick={(e) => {
                              e.stopPropagation() // Prevent triggering cell click
                              setEditingEvent(event)
                            }}
                            title={`${event.title} - ${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-white/80 text-xs">
                              {formatTime(event.startDate)} - {formatTime(event.endDate)}
                            </div>
                            {event.isCompleted && (
                              <CheckCircle className="h-3 w-3 absolute top-1 right-1" />
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Event Modal */}
        <AnimatePresence>
          {(isCreateModalOpen || editingEvent) && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/40"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {editingEvent ? 'Edit Event' : 'New Event'}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        {editingEvent ? 'Update your event details' : 'Create a new event for your schedule'}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setEditingEvent(null)
                      }}
                      className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </motion.button>
                  </div>

                  {/* Show selected time info */}
                  {!editingEvent && newEvent.startDate && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-3 text-purple-700">
                        <Clock className="h-5 w-5" />
                        <div>
                          <span className="text-sm font-medium">Event will be created at:</span>
                          <div className="text-sm opacity-80">
                            {formatDate(newEvent.startDate)} at {formatTime(newEvent.startDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={editingEvent?.title || newEvent.title}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, title: e.target.value })
                          } else {
                            setNewEvent({ ...newEvent, title: e.target.value })
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                        placeholder="Enter event title..."
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description (optional)
                      </label>
                      <textarea
                        value={editingEvent?.description || newEvent.description}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, description: e.target.value })
                          } else {
                            setNewEvent({ ...newEvent, description: e.target.value })
                          }
                        }}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 resize-none transition-all duration-300"
                        placeholder="Describe your event..."
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Start Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editingEvent?.startDate || newEvent.startDate}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, startDate: e.target.value })
                            } else {
                              setNewEvent({ ...newEvent, startDate: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editingEvent?.endDate || newEvent.endDate}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, endDate: e.target.value })
                            } else {
                              setNewEvent({ ...newEvent, endDate: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* All Day Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="allDay"
                        checked={editingEvent?.allDay || newEvent.allDay}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, allDay: e.target.checked })
                          } else {
                            setNewEvent({ ...newEvent, allDay: e.target.checked })
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                        All Day Event
                      </label>
                    </div>

                    {/* Category and Color */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Category
                        </label>
                        <select
                          value={editingEvent?.category || newEvent.category}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, category: e.target.value })
                            } else {
                              setNewEvent({ ...newEvent, category: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Color
                        </label>
                        <div className="flex gap-3">
                          {colorOptions.map(color => (
                            <motion.button
                              key={color.name}
                              onClick={() => {
                                if (editingEvent) {
                                  setEditingEvent({ ...editingEvent, color: color.name })
                                } else {
                                  setNewEvent({ ...newEvent, color: color.name })
                                }
                              }}
                              className={`w-10 h-10 rounded-full ${color.class} shadow-lg ${
                                (editingEvent?.color || newEvent.color) === color.name 
                                  ? 'ring-3 ring-purple-400' 
                                  : ''
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Location and Priority */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Location (optional)
                        </label>
                        <input
                          type="text"
                          value={editingEvent?.location || newEvent.location}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, location: e.target.value })
                            } else {
                              setNewEvent({ ...newEvent, location: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                          placeholder="Enter location..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Priority
                        </label>
                        <select
                          value={editingEvent?.priority || newEvent.priority}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, priority: e.target.value })
                            } else {
                              setNewEvent({ ...newEvent, priority: e.target.value })
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                        >
                          {priorities.map(priority => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Recurring Event */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isRecurring"
                          checked={editingEvent?.isRecurring || newEvent.isRecurring}
                          onChange={(e) => {
                            if (editingEvent) {
                              setEditingEvent({ ...editingEvent, isRecurring: e.target.checked })
                            } else {
                              setNewEvent({ ...newEvent, isRecurring: e.target.checked })
                            }
                          }}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                          Recurring Event
                        </label>
                      </div>

                      {(editingEvent?.isRecurring || newEvent.isRecurring) && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Recurrence Pattern
                          </label>
                          <select
                            value={editingEvent?.recurrence || newEvent.recurrence}
                            onChange={(e) => {
                              if (editingEvent) {
                                setEditingEvent({ ...editingEvent, recurrence: e.target.value })
                              } else {
                                setNewEvent({ ...newEvent, recurrence: e.target.value })
                              }
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 text-gray-700 transition-all duration-300"
                          >
                            <option value="">Select pattern</option>
                            {recurrences.map(recurrence => (
                              <option key={recurrence.value} value={recurrence.value}>
                                {recurrence.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    {editingEvent && (
                      <motion.button
                        onClick={() => deleteEvent(editingEvent.id)}
                        className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="h-4 w-4 mr-2 inline" />
                        Delete
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setEditingEvent(null)
                      }}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        if (editingEvent) {
                          updateEvent(editingEvent)
                        } else {
                          createEvent()
                        }
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 