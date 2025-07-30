'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react'

interface GameScore {
  id: string
  score: number
  gameType: string
  duration?: number
  moves?: number
  maxTile?: number
  createdAt: string
}

interface GameStats {
  scores: GameScore[]
  bestScore: number
  totalGames: number
  gameType: string
}

export default function GameStats() {
  const [stats, setStats] = useState<GameStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchGameStats()
    }
  }, [user?.id])

  const fetchGameStats = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/game/scores?userId=${user.id}&gameType=2048&limit=5`)
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching game stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-800">2048 Game Stats</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Best Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.bestScore}</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Games Played</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalGames}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Games</h4>
        {stats.scores.length === 0 ? (
          <p className="text-gray-500 text-sm">No games played yet. Start playing to see your stats!</p>
        ) : (
          <div className="space-y-2">
            {stats.scores.map((score) => (
              <motion.div
                key={score.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {score.score}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Score: {score.score}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(score.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {score.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(score.duration)}
                    </div>
                  )}
                  {score.maxTile && (
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {score.maxTile}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
} 