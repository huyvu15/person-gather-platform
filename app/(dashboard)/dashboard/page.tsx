'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { 
  StickyNote, 
  FileText, 
  Calendar, 
  Heart, 
  TrendingUp,
  Clock,
  Star,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'

interface DashboardStats {
  notes: number
  posts: number
  events: number
  memories: number
  totalViews: number
  totalLikes: number
  weeklyActivity: number
  monthlyGrowth: number
}

interface ChartData {
  weeklyData: any[]
  categoryDistribution: any[]
  monthlyData: any[]
  activityData: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    notes: 0,
    posts: 0,
    events: 0,
    memories: 0,
    totalViews: 0,
    totalLikes: 0,
    weeklyActivity: 0,
    monthlyGrowth: 0
  })
  const [chartData, setChartData] = useState<ChartData>({
    weeklyData: [],
    categoryDistribution: [],
    monthlyData: [],
    activityData: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/dashboard/stats?userId=${user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setStats(data.stats)
        setChartData(data.charts)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Fallback to mock data if API fails
        setStats({
          notes: 24,
          posts: 12,
          events: 8,
          memories: 45,
          totalViews: 1250,
          totalLikes: 340,
          weeklyActivity: 85,
          monthlyGrowth: 28
        })
        setChartData({
          weeklyData: [
            { day: 'Mon', notes: 4, posts: 2, events: 3, views: 120 },
            { day: 'Tue', notes: 3, posts: 1, events: 5, views: 150 },
            { day: 'Wed', notes: 6, posts: 3, events: 2, views: 180 },
            { day: 'Thu', notes: 2, posts: 4, events: 4, views: 200 },
            { day: 'Fri', notes: 5, posts: 2, events: 6, views: 220 },
            { day: 'Sat', notes: 7, posts: 1, events: 3, views: 190 },
            { day: 'Sun', notes: 4, posts: 3, events: 5, views: 160 },
          ],
          categoryDistribution: [
            { name: 'Notes', value: 35, color: '#3B82F6' },
            { name: 'Posts', value: 25, color: '#10B981' },
            { name: 'Events', value: 20, color: '#F59E0B' },
            { name: 'Memories', value: 20, color: '#EF4444' },
          ],
          monthlyData: [
            { month: 'Jan', growth: 12, posts: 8, events: 15 },
            { month: 'Feb', growth: 18, posts: 12, events: 22 },
            { month: 'Mar', growth: 25, posts: 15, events: 28 },
            { month: 'Apr', growth: 22, posts: 18, events: 25 },
            { month: 'May', growth: 30, posts: 20, events: 35 },
            { month: 'Jun', growth: 28, posts: 25, events: 32 },
          ],
          activityData: [
            { time: '00:00', activity: 5 },
            { time: '04:00', activity: 2 },
            { time: '08:00', activity: 15 },
            { time: '12:00', activity: 25 },
            { time: '16:00', activity: 30 },
            { time: '20:00', activity: 20 },
            { time: '24:00', activity: 8 },
          ]
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.id])

  const statCards = [
    {
      title: 'Total Notes',
      value: stats.notes,
      icon: StickyNote,
      color: 'from-blue-500 to-cyan-500',
      change: '+2 this week',
      trend: 'up'
    },
    {
      title: 'Published Posts',
      value: stats.posts,
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      change: '+1 this week',
      trend: 'up'
    },
    {
      title: 'Upcoming Events',
      value: stats.events,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      change: 'Next: Tomorrow',
      trend: 'stable'
    },
    {
      title: 'Memories',
      value: stats.memories,
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      change: '+3 this week',
      trend: 'up'
    }
  ]

  const recentActivities = [
    {
      type: 'note',
      title: 'Meeting Notes',
      time: '2 hours ago',
      icon: StickyNote,
      color: 'text-blue-500'
    },
    {
      type: 'post',
      title: 'New Blog Post Published',
      time: '4 hours ago',
      icon: FileText,
      color: 'text-green-500'
    },
    {
      type: 'event',
      title: 'Team Meeting',
      time: 'Tomorrow at 10:00 AM',
      icon: Calendar,
      color: 'text-purple-500'
    },
    {
      type: 'memory',
      title: 'Vacation Photos Added',
      time: '1 day ago',
      icon: Heart,
      color: 'text-orange-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your content today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className={`h-5 w-5 ${
                  stat.trend === 'up' ? 'text-green-500' : 
                  stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
              <p className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>{stat.change}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Activity Chart */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Weekly Activity</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="views" 
                stackId="1" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="events" 
                stackId="1" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Content Distribution</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Growth */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Monthly Growth</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="growth" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="posts" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Activity */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Daily Activity</h2>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#EC4899" 
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EC4899', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                >
                  <div className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/40"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            <Star className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'New Note', icon: StickyNote, color: 'from-blue-500 to-cyan-500', href: '/notes' },
              { title: 'Write Post', icon: FileText, color: 'from-green-500 to-emerald-500', href: '/posts' },
              { title: 'Add Event', icon: Calendar, color: 'from-purple-500 to-pink-500', href: '/calendar' },
              { title: 'Upload Memory', icon: Heart, color: 'from-orange-500 to-red-500', href: '/memories' }
            ].map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.title}
                  className="p-4 rounded-xl bg-gradient-to-r hover:shadow-lg transition-all duration-300 text-black/50 text-center"
                  style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{action.title}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 