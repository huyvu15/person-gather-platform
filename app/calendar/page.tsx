'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const events = [
    {
      id: 1,
      title: 'Họp team dự án',
      date: new Date(2024, 0, 15),
      time: '09:00 - 10:30',
      location: 'Phòng họp A',
      attendees: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
      type: 'work'
    },
    {
      id: 2,
      title: 'Du lịch Đà Nẵng',
      date: new Date(2024, 0, 20),
      time: '07:00 - 18:00',
      location: 'Đà Nẵng',
      attendees: ['Gia đình'],
      type: 'travel'
    },
    {
      id: 3,
      title: 'Sinh nhật mẹ',
      date: new Date(2024, 0, 25),
      time: '19:00 - 22:00',
      location: 'Nhà',
      attendees: ['Gia đình', 'Bạn bè'],
      type: 'personal'
    }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const getMonthName = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(date)
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch</h1>
            <p className="text-gray-600">Quản lý sự kiện và lịch trình của bạn</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Thêm sự kiện
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{getMonthName(currentDate)}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2" />
                }

                const isToday = day.toDateString() === new Date().toDateString()
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
                const dayEvents = getEventsForDate(day)

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 min-h-[80px] border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? 'bg-primary-50 border-primary-200' : ''
                    } ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {day.getDate()}
                    </div>
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded mb-1 truncate ${
                          event.type === 'work' ? 'bg-blue-100 text-blue-700' :
                          event.type === 'travel' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hôm nay</h3>
            <div className="space-y-3">
              {getEventsForDate(new Date()).map(event => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'work' ? 'bg-blue-500' :
                      event.type === 'travel' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                  </div>
                </div>
              ))}
              {getEventsForDate(new Date()).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Không có sự kiện nào hôm nay</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sắp tới</h3>
            <div className="space-y-3">
              {events
                .filter(event => event.date > new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Intl.DateTimeFormat('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                          }).format(event.date)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          {event.attendees.length} người
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'work' ? 'bg-blue-500' :
                        event.type === 'travel' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 