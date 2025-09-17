import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, AlertTriangle, CheckCircle, Eye, Zap, 
  Globe, Sun, Moon, Activity, Timer, Bell
} from 'lucide-react'

interface SessionInfo {
  name: string
  startTime: string
  endTime: string
  timezone: string
  color: string
  icon: React.ElementType
  description: string
  isActive: boolean
  progress: number
}

interface BrinksTime {
  time: string
  description: string
  isActive: boolean
  nextOccurrence: Date
  type: 'brinks' | 'stop-hunt'
}

const SessionTiming = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York') // EST

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Session definitions (all times in EST)
  const sessions: SessionInfo[] = [
    {
      name: 'Asian Session',
      startTime: '17:00',
      endTime: '00:00',
      timezone: 'EST',
      color: 'bg-blue-500',
      icon: Moon,
      description: 'Preparation, low liquidity',
      isActive: false,
      progress: 0
    },
    {
      name: 'London Open',
      startTime: '02:00',
      endTime: '09:00',
      timezone: 'EST',
      color: 'bg-green-500',
      icon: Sun,
      description: 'High volatility, reversals, breakouts',
      isActive: false,
      progress: 0
    },
    {
      name: 'New York Open',
      startTime: '09:30',
      endTime: '17:00',
      timezone: 'EST',
      color: 'bg-orange-500',
      icon: Activity,
      description: 'Major liquidity, trend continuation/reversal',
      isActive: false,
      progress: 0
    },
    {
      name: 'Early NY Reversal',
      startTime: '09:30',
      endTime: '10:15',
      timezone: 'EST',
      color: 'bg-purple-500',
      icon: Zap,
      description: 'Liquidity sweeps, stop hunts',
      isActive: false,
      progress: 0
    },
    {
      name: 'Mid-Afternoon Reversal',
      startTime: '14:00',
      endTime: '15:00',
      timezone: 'EST',
      color: 'bg-red-500',
      icon: Eye,
      description: 'Session exhaustion, reversals',
      isActive: false,
      progress: 0
    }
  ]

  // Brinks timing and stop hunt times
  const brinksAndStopHuntTimes: BrinksTime[] = [
    {
      time: '21:45',
      description: 'Brinks Trade Timing - Liquidity spike, precise entries',
      isActive: false,
      nextOccurrence: new Date(),
      type: 'brinks'
    },
    {
      time: '03:45',
      description: 'Brinks Trade Timing - Liquidity spike, precise entries',
      isActive: false,
      nextOccurrence: new Date(),
      type: 'brinks'
    },
    {
      time: '09:45',
      description: 'Brinks Trade Timing - Liquidity spike, precise entries',
      isActive: false,
      nextOccurrence: new Date(),
      type: 'brinks'
    },
    {
      time: '19:00',
      description: 'Stop Hunt Window - DO NOT TRADE HERE!',
      isActive: false,
      nextOccurrence: new Date(),
      type: 'stop-hunt'
    },
    {
      time: '01:00',
      description: 'Stop Hunt Window - DO NOT TRADE HERE!',
      isActive: false,
      nextOccurrence: new Date(),
      type: 'stop-hunt'
    },
    {
      time: '19:00',
      description: 'Stop Hunt Window - DO NOT TRADE HERE!',
      isActive: false,
      nextOccurrence: new Date(),
      type: 'stop-hunt'
    }
  ]

  // Calculate if session is active and progress
  const calculateSessionStatus = (session: SessionInfo): SessionInfo => {
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = session.startTime.split(':').map(Number)
    const [endHour, endMinute] = session.endTime.split(':').map(Number)
    
    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute
    
    let isActive = false
    let progress = 0
    
    // Handle sessions that cross midnight
    if (startTimeInMinutes > endTimeInMinutes) {
      isActive = currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes <= endTimeInMinutes
      if (isActive) {
        const totalDuration = (24 * 60) - startTimeInMinutes + endTimeInMinutes
        const elapsed = currentTimeInMinutes >= startTimeInMinutes 
          ? currentTimeInMinutes - startTimeInMinutes
          : (24 * 60) - startTimeInMinutes + currentTimeInMinutes
        progress = (elapsed / totalDuration) * 100
      }
    } else {
      isActive = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes
      if (isActive) {
        const totalDuration = endTimeInMinutes - startTimeInMinutes
        const elapsed = currentTimeInMinutes - startTimeInMinutes
        progress = (elapsed / totalDuration) * 100
      }
    }
    
    return { ...session, isActive, progress: Math.min(100, Math.max(0, progress)) }
  }

  // Calculate Brinks timing status
  const calculateBrinksStatus = (brinksTime: BrinksTime): BrinksTime => {
    const now = currentTime
    const [hour, minute] = brinksTime.time.split(':').map(Number)
    
    const targetTime = new Date(now)
    targetTime.setHours(hour, minute, 0, 0)
    
    // If target time has passed today, set for tomorrow
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1)
    }
    
    // Check if within 15 minutes of the time
    const timeDiff = Math.abs(now.getTime() - targetTime.getTime())
    const isActive = timeDiff <= 15 * 60 * 1000 // 15 minutes in milliseconds
    
    return {
      ...brinksTime,
      isActive,
      nextOccurrence: targetTime
    }
  }

  const activeSessions = sessions.map(calculateSessionStatus)
  const activeBrinksTimes = brinksAndStopHuntTimes.map(calculateBrinksStatus)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: selectedTimezone
    })
  }

  const getTimeUntil = (targetTime: Date) => {
    const diff = targetTime.getTime() - currentTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            BTMM Session Timing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-mono font-bold">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Trading Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map((session, index) => {
              const IconComponent = session.icon
              return (
                <Card key={index} className={`${session.isActive ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium text-sm">{session.name}</span>
                      </div>
                      {session.isActive && (
                        <Badge variant="default" className="text-xs">
                          ACTIVE
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {session.startTime} - {session.endTime} {session.timezone}
                    </div>
                    <div className="text-xs mb-2">{session.description}</div>
                    {session.isActive && (
                      <Progress value={session.progress} className="h-2" />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Brinks Timing & Stop Hunt Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Brinks Trade Timing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBrinksTimes.filter(bt => bt.type === 'brinks').map((brinks, index) => (
                <div key={index} className={`p-3 rounded-lg border ${brinks.isActive ? 'bg-green-500/10 border-green-500' : 'bg-secondary/30'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{brinks.time} EST</span>
                    {brinks.isActive && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        <Bell className="h-3 w-3 mr-1" />
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {brinks.description}
                  </div>
                  {!brinks.isActive && (
                    <div className="text-xs text-muted-foreground">
                      Next: {getTimeUntil(brinks.nextOccurrence)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Stop Hunt Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBrinksTimes.filter(bt => bt.type === 'stop-hunt').map((stopHunt, index) => (
                <div key={index} className={`p-3 rounded-lg border ${stopHunt.isActive ? 'bg-red-500/10 border-red-500' : 'bg-secondary/30'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{stopHunt.time} EST</span>
                    {stopHunt.isActive && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        AVOID
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {stopHunt.description}
                  </div>
                  {!stopHunt.isActive && (
                    <div className="text-xs text-muted-foreground">
                      Next: {getTimeUntil(stopHunt.nextOccurrence)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            BTMM Session Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Optimal Trading Times</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Brinks Timing: 9:45 PM, 3:45 AM, 9:45 AM EST</li>
                <li>• London Session: 2:00 AM - 9:00 AM EST</li>
                <li>• NY Session: 9:30 AM - 5:00 PM EST</li>
                <li>• Early NY Reversal: 9:30 AM - 10:15 AM EST</li>
                <li>• Mid-Afternoon Reversal: 2:00 PM - 3:00 PM EST</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">❌ Avoid Trading</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Stop Hunt Times: 7 PM, 1 AM, 7 PM EST</li>
                <li>• Late Asia session (low liquidity)</li>
                <li>• Midday NY session (erratic price action)</li>
                <li>• Night hours to minimize traps</li>
                <li>• 12-candle window during stop hunt times</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionTiming