'use client'

import { useState } from 'react'
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
  Heart
} from 'lucide-react'

interface Event {
  id: string
  title: string
  start: string
  end: string
  color: string
  day: string
}

const events: Event[] = [
  { id: '1', title: 'Morning Standup', start: '08:30', end: '09:30', color: 'bg-blue-500', day: 'MON' },
  { id: '2', title: 'Client Call', start: '10:00', end: '11:00', color: 'bg-yellow-500', day: 'MON' },
  { id: '3', title: 'Team Meeting', start: '09:00', end: '10:00', color: 'bg-blue-500', day: 'TUE' },
  { id: '4', title: 'Lunch with Sarah', start: '12:30', end: '13:30', color: 'bg-green-500', day: 'TUE' },
  { id: '5', title: 'Team Training', start: '09:30', end: '11:30', color: 'bg-green-500', day: 'WED' },
  { id: '6', title: 'Team Brainstorm', start: '13:00', end: '14:30', color: 'bg-purple-500', day: 'WED' },
  { id: '7', title: 'Product Demo', start: '11:00', end: '12:00', color: 'bg-pink-500', day: 'THU' },
  { id: '8', title: 'Budget Review', start: '13:30', end: '15:00', color: 'bg-yellow-500', day: 'THU' },
  { id: '9', title: 'Client Presentation', start: '11:00', end: '12:30', color: 'bg-orange-500', day: 'FRI' },
  { id: '10', title: 'Marketing Meeting', start: '13:00', end: '14:00', color: 'bg-teal-500', day: 'FRI' },
  { id: '11', title: 'Investor Meeting', start: '10:30', end: '12:00', color: 'bg-red-500', day: 'SAT' },
]

const timeSlots = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
]

const days = [
  { day: 'SUN', date: 3 },
  { day: 'MON', date: 4 },
  { day: 'TUE', date: 5 },
  { day: 'WED', date: 6 },
  { day: 'THU', date: 7 },
  { day: 'FRI', date: 8 },
  { day: 'SAT', date: 9 },
]

const calendars = [
  { name: 'My Calendar', color: 'bg-blue-400' },
  { name: 'Work', color: 'bg-green-400' },
  { name: 'Personal', color: 'bg-purple-400' },
  { name: 'Family', color: 'bg-orange-400' },
]

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const getEventsForDayAndTime = (day: string, time: string) => {
    return events.filter(event => {
      if (event.day !== day) return false
      const eventStart = event.start
      const eventEnd = event.end
      const timeSlot = time
      
      // Simple time comparison (in real app, you'd use proper time parsing)
      return eventStart <= timeSlot && eventEnd > timeSlot
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 800\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23FF6B6B\'/%3E%3Cstop offset=\'50%25\' stop-color=\'%23FFE66D\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23FF8E53\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'1200\' height=\'800\' fill=\'url(%23a)\'/%3E%3C/svg%3E")'
        }}
      />

      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar */}
        <motion.div 
          className="w-80 bg-white/20 backdrop-blur-xl border-r border-white/30 p-6 flex flex-col"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Create Button */}
          <motion.button
            className="w-full bg-blue-500 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 mb-8 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-5 w-5" />
            Create
          </motion.button>

          {/* Mini Calendar */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">March 2025</h3>
              <div className="flex gap-2">
                <motion.button
                  className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </motion.button>
                <motion.button
                  className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-gray-600 font-medium py-1">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                <motion.button
                  key={date}
                  className={`text-center py-1 rounded-lg transition-all duration-200 ${
                    date === 5 
                      ? 'bg-blue-500 text-white font-semibold' 
                      : 'hover:bg-white/50 text-gray-700'
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
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
                  <span className="text-sm text-gray-700">{calendar.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating Action Button */}
          <motion.button
            className="absolute bottom-6 left-6 w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <motion.div 
            className="bg-white/20 backdrop-blur-xl border-b border-white/30 p-6 flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 rounded-lg hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </motion.button>
              <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-white/50 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
              </div>
              <motion.button
                className="p-2 rounded-lg hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="h-5 w-5 text-gray-700" />
              </motion.button>
              <motion.div
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold"
                whileHover={{ scale: 1.1 }}
              >
                U
              </motion.div>
            </div>
          </motion.div>

          {/* Calendar Navigation */}
          <motion.div 
            className="bg-white/20 backdrop-blur-xl border-b border-white/30 p-6 flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>

            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 rounded-lg hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </motion.button>
              <h2 className="text-xl font-bold text-gray-800">March 5</h2>
              <motion.button
                className="p-2 rounded-lg hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </motion.button>
            </div>

            <div className="flex gap-2">
              {(['day', 'week', 'month'] as const).map((view) => (
                <motion.button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentView === view
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Calendar Grid */}
          <div className="flex-1 p-6">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl h-full overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b border-white/30">
                <div className="p-4"></div>
                {days.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className={`p-4 text-center ${
                      day.date === 5 ? 'bg-blue-500 text-white' : 'text-gray-700'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className={`text-lg font-bold ${
                      day.date === 5 ? 'text-white' : 'text-gray-800'
                    }`}>
                      {day.date}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-8 h-full">
                <div className="border-r border-white/30">
                  {timeSlots.map((time, index) => (
                    <motion.div
                      key={time}
                      className="h-16 border-b border-white/20 flex items-center justify-end pr-4 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      {time}
                    </motion.div>
                  ))}
                </div>

                {/* Calendar Cells */}
                {days.map((day, dayIndex) => (
                  <div key={day.day} className="border-r border-white/30 last:border-r-0">
                    {timeSlots.map((time, timeIndex) => {
                      const dayEvents = getEventsForDayAndTime(day.day, time)
                      return (
                        <motion.div
                          key={`${day.day}-${time}`}
                          className="h-16 border-b border-white/20 relative p-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + dayIndex * 0.1 + timeIndex * 0.05 }}
                        >
                          {dayEvents.map((event, eventIndex) => (
                            <motion.div
                              key={event.id}
                              className={`${event.color} text-white text-xs p-1 rounded-lg mb-1 shadow-sm`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.8 + eventIndex * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="text-white/80 text-xs">
                                {event.start} - {event.end}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 