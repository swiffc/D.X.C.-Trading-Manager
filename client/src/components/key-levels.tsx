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
  Calendar, Clock, MapPin, Crosshair
} from 'lucide-react'

interface KeyLevel {
  id: string
  name: string
  type: 'support' | 'resistance' | 'pivot'
  price: number
  timeframe: string
  strength: 'weak' | 'medium' | 'strong'
  description: string
  lastTested: string
  testCount: number
  isActive: boolean
}

interface LevelCalculation {
  pdh: number | null
  pdl: number | null
  yh: number | null
  yl: number | null
  hod: number | null
  lod: number | null
  adr: number | null
  currentPrice: number
}

const KeyLevels = () => {
  const [selectedTab, setSelectedTab] = useState('current-levels')
  const [priceInputs, setPriceInputs] = useState({
    currentPrice: '',
    pdh: '',
    pdl: '',
    yh: '',
    yl: '',
    hod: '',
    lod: '',
    adr: ''
  })
  const [calculatedLevels, setCalculatedLevels] = useState<LevelCalculation>({
    pdh: null,
    pdl: null,
    yh: null,
    yl: null,
    hod: null,
    lod: null,
    adr: null,
    currentPrice: 0
  })

  // Key Level Definitions based on BTMM methodology
  const keyLevelTypes = [
    {
      id: 'pdh-pdl',
      name: 'Previous Day High/Low (PDH/PDL)',
      description: 'Critical daily levels for intraday trading',
      importance: 'High',
      usage: 'Primary support/resistance for Type 1-4 setups'
    },
    {
      id: 'yh-yl',
      name: 'Yesterday High/Low (YH/YL)',
      description: 'Blue tracer levels for reversal setups',
      importance: 'High',
      usage: 'Key reversal zones, especially for M&W patterns'
    },
    {
      id: 'hod-lod',
      name: 'High/Low of Day (HOD/LOD)',
      description: 'Current session extremes',
      importance: 'Medium',
      usage: 'Dynamic levels that update throughout the session'
    },
    {
      id: 'adr',
      name: 'Average Daily Range (ADR)',
      description: 'Expected daily movement based on 5-day average',
      importance: 'Medium',
      usage: 'Target setting and range expectations'
    },
    {
      id: 'asian-range',
      name: 'Asian Session Range',
      description: 'High and low of Asian trading session',
      importance: 'High',
      usage: 'Stop hunt levels and breakout confirmation'
    },
    {
      id: 'london-open',
      name: 'London Open Levels',
      description: 'Key levels at London session open',
      importance: 'High',
      usage: 'Session transition and momentum shifts'
    }
  ]

  // Calculate key levels based on inputs
  const calculateLevels = () => {
    const current = parseFloat(priceInputs.currentPrice) || 0
    const pdh = parseFloat(priceInputs.pdh) || null
    const pdl = parseFloat(priceInputs.pdl) || null
    const yh = parseFloat(priceInputs.yh) || null
    const yl = parseFloat(priceInputs.yl) || null
    const hod = parseFloat(priceInputs.hod) || null
    const lod = parseFloat(priceInputs.lod) || null
    const adr = parseFloat(priceInputs.adr) || null

    setCalculatedLevels({
      pdh,
      pdl,
      yh,
      yl,
      hod,
      lod,
      adr,
      currentPrice: current
    })
  }

  // Generate dynamic key levels based on current price
  const generateKeyLevels = (): KeyLevel[] => {
    const levels: KeyLevel[] = []
    const { currentPrice, pdh, pdl, yh, yl, hod, lod } = calculatedLevels

    if (pdh) {
      levels.push({
        id: 'pdh',
        name: 'Previous Day High',
        type: currentPrice < pdh ? 'resistance' : 'support',
        price: pdh,
        timeframe: 'Daily',
        strength: 'strong',
        description: 'Key resistance level from previous trading day',
        lastTested: '1 day ago',
        testCount: 3,
        isActive: Math.abs(currentPrice - pdh) / currentPrice < 0.005
      })
    }

    if (pdl) {
      levels.push({
        id: 'pdl',
        name: 'Previous Day Low',
        type: currentPrice > pdl ? 'support' : 'resistance',
        price: pdl,
        timeframe: 'Daily',
        strength: 'strong',
        description: 'Key support level from previous trading day',
        lastTested: '1 day ago',
        testCount: 2,
        isActive: Math.abs(currentPrice - pdl) / currentPrice < 0.005
      })
    }

    if (yh) {
      levels.push({
        id: 'yh',
        name: 'Yesterday High (Blue Tracer)',
        type: currentPrice < yh ? 'resistance' : 'support',
        price: yh,
        timeframe: 'Daily',
        strength: 'strong',
        description: 'Blue tracer level for M&W reversal setups',
        lastTested: '2 hours ago',
        testCount: 1,
        isActive: Math.abs(currentPrice - yh) / currentPrice < 0.003
      })
    }

    if (yl) {
      levels.push({
        id: 'yl',
        name: 'Yesterday Low (Blue Tracer)',
        type: currentPrice > yl ? 'support' : 'resistance',
        price: yl,
        timeframe: 'Daily',
        strength: 'strong',
        description: 'Blue tracer level for M&W reversal setups',
        lastTested: '4 hours ago',
        testCount: 2,
        isActive: Math.abs(currentPrice - yl) / currentPrice < 0.003
      })
    }

    if (hod) {
      levels.push({
        id: 'hod',
        name: 'High of Day',
        type: 'resistance',
        price: hod,
        timeframe: 'Intraday',
        strength: 'medium',
        description: 'Current session high - dynamic resistance',
        lastTested: '30 minutes ago',
        testCount: 1,
        isActive: Math.abs(currentPrice - hod) / currentPrice < 0.002
      })
    }

    if (lod) {
      levels.push({
        id: 'lod',
        name: 'Low of Day',
        type: 'support',
        price: lod,
        timeframe: 'Intraday',
        strength: 'medium',
        description: 'Current session low - dynamic support',
        lastTested: '45 minutes ago',
        testCount: 1,
        isActive: Math.abs(currentPrice - lod) / currentPrice < 0.002
      })
    }

    return levels.sort((a, b) => Math.abs(currentPrice - a.price) - Math.abs(currentPrice - b.price))
  }

  const keyLevels = generateKeyLevels()

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'weak': return 'text-green-600'
      default: return 'text-gray-600'
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'support': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'resistance': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      case 'pivot': return <Target className="h-4 w-4 text-blue-500" />
      default: return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  const getDistanceFromPrice = (levelPrice: number) => {
    if (!calculatedLevels.currentPrice) return 0
    return ((levelPrice - calculatedLevels.currentPrice) / calculatedLevels.currentPrice * 100)
  }

  useEffect(() => {
    calculateLevels()
  }, [priceInputs])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-primary" />
            BTMM Key Level Detection System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Automatic detection and analysis of critical support/resistance levels including PDH/PDL, YH/YL, HOD/LOD, and ADR calculations.
          </p>
          
          {/* Price Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.00001"
                value={priceInputs.currentPrice}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, currentPrice: e.target.value }))}
                placeholder="1.08500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdh">PDH</Label>
              <Input
                id="pdh"
                type="number"
                step="0.00001"
                value={priceInputs.pdh}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, pdh: e.target.value }))}
                placeholder="1.08750"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdl">PDL</Label>
              <Input
                id="pdl"
                type="number"
                step="0.00001"
                value={priceInputs.pdl}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, pdl: e.target.value }))}
                placeholder="1.08200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yh">YH (Blue Tracer)</Label>
              <Input
                id="yh"
                type="number"
                step="0.00001"
                value={priceInputs.yh}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, yh: e.target.value }))}
                placeholder="1.08650"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yl">YL (Blue Tracer)</Label>
              <Input
                id="yl"
                type="number"
                step="0.00001"
                value={priceInputs.yl}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, yl: e.target.value }))}
                placeholder="1.08150"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hod">HOD</Label>
              <Input
                id="hod"
                type="number"
                step="0.00001"
                value={priceInputs.hod}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, hod: e.target.value }))}
                placeholder="1.08600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lod">LOD</Label>
              <Input
                id="lod"
                type="number"
                step="0.00001"
                value={priceInputs.lod}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, lod: e.target.value }))}
                placeholder="1.08300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adr">ADR5</Label>
              <Input
                id="adr"
                type="number"
                step="0.00001"
                value={priceInputs.adr}
                onChange={(e) => setPriceInputs(prev => ({ ...prev, adr: e.target.value }))}
                placeholder="0.00450"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current-levels">
            <MapPin className="h-4 w-4 mr-2" />
            Active Levels
          </TabsTrigger>
          <TabsTrigger value="level-types">
            <Layers className="h-4 w-4 mr-2" />
            Level Types
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
        </TabsList>

        {/* Active Levels */}
        <TabsContent value="current-levels" className="space-y-4">
          {keyLevels.length > 0 ? (
            keyLevels.map((level) => {
              const distance = getDistanceFromPrice(level.price)
              const isNearby = Math.abs(distance) < 0.5
              
              return (
                <Card key={level.id} className={`${level.isActive ? 'ring-2 ring-blue-500' : ''} ${isNearby ? 'bg-yellow-500/5' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getTypeIcon(level.type)}
                        {level.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge {...getStrengthBadge(level.strength)}>
                          {getStrengthBadge(level.strength).text}
                        </Badge>
                        {level.isActive && (
                          <Badge variant="default">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Price Level</p>
                        <p className="text-lg font-mono">{level.price.toFixed(5)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Distance</p>
                        <p className={`text-lg font-mono ${distance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {distance > 0 ? '+' : ''}{distance.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Test Count</p>
                        <p className="text-lg">{level.testCount}x</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Tested</p>
                        <p className="text-sm text-muted-foreground">{level.lastTested}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Description</p>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{level.timeframe}</Badge>
                      <Badge variant="outline" className="capitalize">{level.type}</Badge>
                      {isNearby && (
                        <Badge variant="secondary">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Nearby
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Enter price data to see active key levels</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Level Types */}
        <TabsContent value="level-types" className="space-y-4">
          {keyLevelTypes.map((levelType) => (
            <Card key={levelType.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {levelType.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{levelType.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Importance Level</h4>
                    <Badge variant={levelType.importance === 'High' ? 'destructive' : 'secondary'}>
                      {levelType.importance}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Trading Usage</h4>
                    <p className="text-xs text-muted-foreground">{levelType.usage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Analysis */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Level Analysis & Confluence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculatedLevels.adr && (
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-blue-600 mb-2">ADR Analysis</h4>
                    <p className="text-sm mb-2">Average Daily Range: {calculatedLevels.adr.toFixed(5)}</p>
                    {calculatedLevels.currentPrice > 0 && calculatedLevels.pdl && (
                      <div className="text-xs space-y-1">
                        <p>• Current range used: {((calculatedLevels.currentPrice - calculatedLevels.pdl) / calculatedLevels.adr * 100).toFixed(1)}% of ADR</p>
                        <p>• Remaining upside potential: {(calculatedLevels.adr - (calculatedLevels.currentPrice - calculatedLevels.pdl)).toFixed(5)} pips</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-green-600 mb-2">Level Confluence Detection</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Multiple timeframe level alignment analysis</li>
                    <li>• EMA confluence with key levels</li>
                    <li>• Historical level strength validation</li>
                    <li>• Session-based level importance weighting</li>
                  </ul>
                </div>
                
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                  <h4 className="font-semibold text-orange-600 mb-2">Trading Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Watch for M&W patterns at YH/YL blue tracer levels</li>
                    <li>• Use PDH/PDL as primary support/resistance for Type 1-4 setups</li>
                    <li>• Monitor HOD/LOD for intraday momentum shifts</li>
                    <li>• Consider ADR completion for profit target placement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default KeyLevels