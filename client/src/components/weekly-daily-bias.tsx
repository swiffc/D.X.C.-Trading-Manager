import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, BarChart3, Target, Eye, Zap, 
  Activity, CheckCircle, AlertTriangle, Settings,
  Layers, Triangle, Hexagon, Octagon, Square,
  Calendar, Clock, MapPin, Crosshair, ArrowUp, ArrowDown
} from 'lucide-react'

interface BiasPattern {
  id: string
  name: string
  type: 'bullish' | 'bearish' | 'neutral'
  strength: 'weak' | 'medium' | 'strong'
  description: string
  criteria: string[]
  timeframe: string
  probability: number
  isActive: boolean
}

interface WeeklyAnalysis {
  weekType: 'FRD' | 'FGD' | 'Inside' | 'Outside' | 'Neutral'
  bias: 'bullish' | 'bearish' | 'neutral'
  strength: number
  keyLevels: string[]
  expectedMove: number
}

interface DailyAnalysis {
  dayType: 'Day2' | 'Day3' | 'Inside' | 'Outside' | 'Neutral'
  bias: 'bullish' | 'bearish' | 'neutral'
  strength: number
  sessionFocus: string
  tradingPlan: string[]
}

const WeeklyDailyBias = () => {
  const [selectedTab, setSelectedTab] = useState('weekly-bias')
  const [weeklyData, setWeeklyData] = useState<WeeklyAnalysis>({
    weekType: 'Neutral',
    bias: 'neutral',
    strength: 0,
    keyLevels: [],
    expectedMove: 0
  })
  const [dailyData, setDailyData] = useState<DailyAnalysis>({
    dayType: 'Neutral',
    bias: 'neutral',
    strength: 0,
    sessionFocus: '',
    tradingPlan: []
  })

  // Weekly Bias Patterns
  const weeklyPatterns: BiasPattern[] = [
    {
      id: 'frd-week',
      name: 'First Reversal Day (FRD) Week',
      type: 'bullish',
      strength: 'strong',
      description: 'Weekly structure showing first reversal after downtrend',
      criteria: [
        'Previous week closed lower',
        'Current week opens with gap or strong momentum',
        'Price reclaims key weekly level',
        'Volume confirmation on reversal'
      ],
      timeframe: 'Weekly',
      probability: 75,
      isActive: false
    },
    {
      id: 'fgd-week',
      name: 'First Green Day (FGD) Week',
      type: 'bullish',
      strength: 'medium',
      description: 'First bullish week after bearish sequence',
      criteria: [
        'Multiple consecutive red weeks prior',
        'Weekly close above previous week high',
        'Strong momentum candle formation',
        'Key level reclaim'
      ],
      timeframe: 'Weekly',
      probability: 65,
      isActive: false
    },
    {
      id: 'inside-week',
      name: 'Inside Week Pattern',
      type: 'neutral',
      strength: 'medium',
      description: 'Consolidation week within previous week range',
      criteria: [
        'High lower than previous week high',
        'Low higher than previous week low',
        'Consolidation after strong move',
        'Potential breakout setup'
      ],
      timeframe: 'Weekly',
      probability: 50,
      isActive: false
    },
    {
      id: 'outside-week',
      name: 'Outside Week Pattern',
      type: 'bullish',
      strength: 'strong',
      description: 'Engulfing week pattern with strong momentum',
      criteria: [
        'High higher than previous week high',
        'Low lower than previous week low',
        'Strong directional close',
        'Volume expansion'
      ],
      timeframe: 'Weekly',
      probability: 80,
      isActive: false
    }
  ]

  // Daily Bias Patterns
  const dailyPatterns: BiasPattern[] = [
    {
      id: 'day2-setup',
      name: 'Day 2 Continuation Setup',
      type: 'bullish',
      strength: 'strong',
      description: 'Second day of trend continuation after initial move',
      criteria: [
        'Day 1 established clear direction',
        'Day 2 opens in direction of trend',
        'Pullback to key level (13/50 EMA)',
        'Continuation pattern formation'
      ],
      timeframe: 'Daily',
      probability: 70,
      isActive: false
    },
    {
      id: 'day3-reversal',
      name: 'Day 3 Reversal Pattern',
      type: 'bearish',
      strength: 'medium',
      description: 'Third day exhaustion and potential reversal',
      criteria: [
        'Two consecutive days in same direction',
        'Day 3 shows momentum divergence',
        'Key level rejection pattern',
        'Volume declining on extension'
      ],
      timeframe: 'Daily',
      probability: 60,
      isActive: false
    },
    {
      id: 'inside-day',
      name: 'Inside Day Compression',
      type: 'neutral',
      strength: 'medium',
      description: 'Consolidation day within previous day range',
      criteria: [
        'High lower than previous day high',
        'Low higher than previous day low',
        'Compression after volatility',
        'Breakout preparation'
      ],
      timeframe: 'Daily',
      probability: 55,
      isActive: false
    }
  ]

  // Generate trading recommendations based on bias
  const generateTradingPlan = (weeklyBias: string, dailyBias: string) => {
    const plans = []
    
    if (weeklyBias === 'bullish' && dailyBias === 'bullish') {
      plans.push('Focus on Type 1 & 2 long setups at key support levels')
      plans.push('Look for M&W patterns above Asian session lows')
      plans.push('Target PDH breaks with continuation')
      plans.push('Use 13/50 EMA as dynamic support')
    } else if (weeklyBias === 'bearish' && dailyBias === 'bearish') {
      plans.push('Focus on Type 1 & 2 short setups at key resistance')
      plans.push('Look for M&W patterns below Asian session highs')
      plans.push('Target PDL breaks with continuation')
      plans.push('Use 13/50 EMA as dynamic resistance')
    } else if (weeklyBias !== dailyBias) {
      plans.push('Conflicting bias - trade with caution')
      plans.push('Wait for clear directional confirmation')
      plans.push('Focus on scalping setups only')
      plans.push('Reduce position sizes')
    } else {
      plans.push('Neutral bias - range trading approach')
      plans.push('Trade bounces between key levels')
      plans.push('Look for breakout setups')
      plans.push('Use tight stops and quick profits')
    }
    
    return plans
  }

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'bullish': return 'text-green-600'
      case 'bearish': return 'text-red-600'
      case 'neutral': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case 'bullish': return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'bearish': return <ArrowDown className="h-4 w-4 text-red-500" />
      case 'neutral': return <Target className="h-4 w-4 text-yellow-500" />
      default: return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'strong': return { variant: 'destructive' as const, text: 'Strong' }
      case 'medium': return { variant: 'secondary' as const, text: 'Medium' }
      case 'weak': return { variant: 'outline' as const, text: 'Weak' }
      default: return { variant: 'outline' as const, text: 'Unknown' }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            BTMM Weekly & Daily Bias Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Comprehensive bias analysis for weekly and daily timeframes including Day 2/3 patterns, FRD/FGD setups, and inside day analysis.
          </p>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly-bias">
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Bias
          </TabsTrigger>
          <TabsTrigger value="daily-bias">
            <Clock className="h-4 w-4 mr-2" />
            Daily Bias
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <Layers className="h-4 w-4 mr-2" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="trading-plan">
            <Target className="h-4 w-4 mr-2" />
            Trading Plan
          </TabsTrigger>
        </TabsList>

        {/* Weekly Bias Analysis */}
        <TabsContent value="weekly-bias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Market Structure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-600 mb-2">Week Type</h4>
                  <p className="text-2xl font-bold">{weeklyData.weekType}</p>
                  <p className="text-sm text-muted-foreground mt-1">Current Classification</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-green-600 mb-2">Weekly Bias</h4>
                  <div className="flex items-center justify-center gap-2">
                    {getBiasIcon(weeklyData.bias)}
                    <p className={`text-2xl font-bold capitalize ${getBiasColor(weeklyData.bias)}`}>
                      {weeklyData.bias}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Directional Preference</p>
                </div>
                
                <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <h4 className="font-semibold text-orange-600 mb-2">Strength</h4>
                  <p className="text-2xl font-bold">{weeklyData.strength}%</p>
                  <Progress value={weeklyData.strength} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">Conviction Level</p>
                </div>
              </div>
              
              <div className="bg-gray-500/10 p-4 rounded-lg border border-gray-500/20">
                <h4 className="font-semibold mb-2">Weekly Analysis Guidelines</h4>
                <ul className="text-sm space-y-1">
                  <li>• FRD (First Reversal Day): Look for weekly reversal after downtrend</li>
                  <li>• FGD (First Green Day): First bullish week after bearish sequence</li>
                  <li>• Inside Week: Consolidation within previous week range</li>
                  <li>• Outside Week: Engulfing pattern with strong momentum</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Bias Analysis */}
        <TabsContent value="daily-bias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Daily Market Structure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold text-purple-600 mb-2">Day Type</h4>
                  <p className="text-2xl font-bold">{dailyData.dayType}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pattern Classification</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-green-600 mb-2">Daily Bias</h4>
                  <div className="flex items-center justify-center gap-2">
                    {getBiasIcon(dailyData.bias)}
                    <p className={`text-2xl font-bold capitalize ${getBiasColor(dailyData.bias)}`}>
                      {dailyData.bias}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Intraday Direction</p>
                </div>
                
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-600 mb-2">Session Focus</h4>
                  <p className="text-lg font-semibold">{dailyData.sessionFocus || 'London/NY'}</p>
                  <p className="text-sm text-muted-foreground mt-1">Primary Trading Window</p>
                </div>
              </div>
              
              <div className="bg-gray-500/10 p-4 rounded-lg border border-gray-500/20">
                <h4 className="font-semibold mb-2">Daily Pattern Guidelines</h4>
                <ul className="text-sm space-y-1">
                  <li>• Day 2: Continuation setup after initial directional move</li>
                  <li>• Day 3: Potential exhaustion and reversal patterns</li>
                  <li>• Inside Day: Compression setup for breakout trading</li>
                  <li>• Outside Day: Strong momentum with follow-through potential</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pattern Recognition */}
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Patterns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Weekly Patterns</h3>
              {weeklyPatterns.map((pattern) => (
                <Card key={pattern.id} className={`${pattern.isActive ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {getBiasIcon(pattern.type)}
                        {pattern.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge {...getStrengthBadge(pattern.strength)}>
                          {getStrengthBadge(pattern.strength).text}
                        </Badge>
                        <span className="text-sm font-medium">{pattern.probability}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Criteria</h4>
                      <ul className="text-xs space-y-1">
                        {pattern.criteria.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pattern.timeframe}</Badge>
                      <Badge variant="outline" className="capitalize">{pattern.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily Patterns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Daily Patterns</h3>
              {dailyPatterns.map((pattern) => (
                <Card key={pattern.id} className={`${pattern.isActive ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {getBiasIcon(pattern.type)}
                        {pattern.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge {...getStrengthBadge(pattern.strength)}>
                          {getStrengthBadge(pattern.strength).text}
                        </Badge>
                        <span className="text-sm font-medium">{pattern.probability}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Criteria</h4>
                      <ul className="text-xs space-y-1">
                        {pattern.criteria.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pattern.timeframe}</Badge>
                      <Badge variant="outline" className="capitalize">{pattern.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Trading Plan */}
        <TabsContent value="trading-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Bias-Based Trading Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Current Bias Summary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span className="font-medium">Weekly Bias:</span>
                      <div className="flex items-center gap-2">
                        {getBiasIcon(weeklyData.bias)}
                        <span className={`font-semibold capitalize ${getBiasColor(weeklyData.bias)}`}>
                          {weeklyData.bias}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <span className="font-medium">Daily Bias:</span>
                      <div className="flex items-center gap-2">
                        {getBiasIcon(dailyData.bias)}
                        <span className={`font-semibold capitalize ${getBiasColor(dailyData.bias)}`}>
                          {dailyData.bias}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Recommended Actions</h4>
                  <div className="space-y-2">
                    {generateTradingPlan(weeklyData.bias, dailyData.bias).map((plan, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-gray-500/10 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{plan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <h4 className="font-semibold text-yellow-600 mb-2">⚠️ Risk Management Reminders</h4>
                <ul className="text-sm space-y-1">
                  <li>• Always confirm bias with multiple timeframe analysis</li>
                  <li>• Reduce position sizes during conflicting bias periods</li>
                  <li>• Use proper stop losses based on key level analysis</li>
                  <li>• Monitor session timing for optimal entry/exit points</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WeeklyDailyBias