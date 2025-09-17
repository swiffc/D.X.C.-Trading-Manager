import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, BarChart3, Target, Eye, Zap, Activity, 
  CheckCircle, AlertTriangle, Settings, Layers, 
  Triangle, Hexagon, Octagon, Square, MapPin,
  Calendar, Clock, Crosshair, ArrowUp, ArrowDown, Signal
} from 'lucide-react'

interface TDISignal {
  id: string
  type: 'entry' | 'exit' | 'confirmation'
  strength: 'weak' | 'medium' | 'strong'
  direction: 'bullish' | 'bearish' | 'neutral'
  description: string
  criteria: string[]
  isActive: boolean
  timestamp: string
}

interface TDISettings {
  rsiPeriod: number
  pricePeriod: number
  signalPeriod: number
  upperBand: number
  lowerBand: number
  mblPeriod: number
}

const TDIIntegration = () => {
  const [selectedTab, setSelectedTab] = useState('signals')
  const [rsiValue, setRsiValue] = useState(50)
  const [mblValue, setMblValue] = useState(50)
  const [signalLineValue, setSignalLineValue] = useState(50)
  const [upperBand, setUpperBand] = useState(68)
  const [lowerBand, setLowerBand] = useState(32)
  const [volatilityBand, setVolatilityBand] = useState(1.6185)
  
  const [tdiSettings, setTdiSettings] = useState<TDISettings>({
    rsiPeriod: 13,
    pricePeriod: 2,
    signalPeriod: 7,
    upperBand: 68,
    lowerBand: 32,
    mblPeriod: 34
  })

  const [activeSignals, setActiveSignals] = useState<TDISignal[]>([])

  // TDI Signal Detection Logic
  const detectTDISignals = () => {
    const signals: TDISignal[] = []

    // RSI Outside Bands Signal
    if (rsiValue > upperBand) {
      signals.push({
        id: 'rsi-overbought',
        type: 'confirmation',
        strength: 'strong',
        direction: 'bearish',
        description: 'RSI Above Upper Band - Overbought Condition',
        criteria: [
          `RSI (${rsiValue}) > Upper Band (${upperBand})`,
          'Potential reversal or pullback signal',
          'Look for bearish pattern confirmation',
          'Consider short entries with proper risk management'
        ],
        isActive: true,
        timestamp: new Date().toLocaleTimeString()
      })
    } else if (rsiValue < lowerBand) {
      signals.push({
        id: 'rsi-oversold',
        type: 'confirmation',
        strength: 'strong',
        direction: 'bullish',
        description: 'RSI Below Lower Band - Oversold Condition',
        criteria: [
          `RSI (${rsiValue}) < Lower Band (${lowerBand})`,
          'Potential reversal or bounce signal',
          'Look for bullish pattern confirmation',
          'Consider long entries with proper risk management'
        ],
        isActive: true,
        timestamp: new Date().toLocaleTimeString()
      })
    }

    // MBL Crossing Signal Line
    if (Math.abs(mblValue - signalLineValue) < 2) {
      const direction = mblValue > signalLineValue ? 'bullish' : 'bearish'
      signals.push({
        id: 'mbl-cross',
        type: 'entry',
        strength: 'medium',
        direction: direction,
        description: `MBL ${direction === 'bullish' ? 'Above' : 'Below'} Signal Line - Momentum Shift`,
        criteria: [
          `MBL (${mblValue.toFixed(2)}) crossing Signal Line (${signalLineValue.toFixed(2)})`,
          `${direction === 'bullish' ? 'Bullish' : 'Bearish'} momentum developing`,
          'Confirm with price action and key levels',
          'Watch for continuation or reversal'
        ],
        isActive: true,
        timestamp: new Date().toLocaleTimeString()
      })
    }

    // Volatility Band Expansion
    if (volatilityBand > 2.0) {
      signals.push({
        id: 'volatility-expansion',
        type: 'confirmation',
        strength: 'medium',
        direction: 'neutral',
        description: 'Volatility Band Expansion - Increased Market Activity',
        criteria: [
          `Volatility Band (${volatilityBand.toFixed(4)}) > 2.0`,
          'Increased market volatility detected',
          'Expect larger price movements',
          'Adjust position sizes accordingly'
        ],
        isActive: true,
        timestamp: new Date().toLocaleTimeString()
      })
    }

    // Momentum Divergence Detection
    if (rsiValue > 50 && mblValue < signalLineValue) {
      signals.push({
        id: 'bearish-divergence',
        type: 'exit',
        strength: 'medium',
        direction: 'bearish',
        description: 'Bearish Momentum Divergence Detected',
        criteria: [
          'RSI showing strength while MBL weakening',
          'Potential momentum divergence',
          'Consider taking profits on long positions',
          'Watch for reversal confirmation'
        ],
        isActive: true,
        timestamp: new Date().toLocaleTimeString()
      })
    } else if (rsiValue < 50 && mblValue > signalLineValue) {
      signals.push({
        id: 'bullish-divergence',
        type: 'exit',
        strength: 'medium',
        direction: 'bullish',
        description: 'Bullish Momentum Divergence Detected',
        criteria: [
          'RSI showing weakness while MBL strengthening',
          'Potential momentum divergence',
          'Consider taking profits on short positions',
          'Watch for reversal confirmation'
        ],
        isActive: true,
        timestamp: new Date().toLocaleTimeString()
      })
    }

    setActiveSignals(signals)
  }

  useEffect(() => {
    detectTDISignals()
  }, [rsiValue, mblValue, signalLineValue, upperBand, lowerBand, volatilityBand])

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'entry': return 'bg-green-100 text-green-800'
      case 'exit': return 'bg-red-100 text-red-800'
      case 'confirmation': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
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

  const getRSIZone = (value: number) => {
    if (value > upperBand) return { zone: 'Overbought', color: 'text-red-600' }
    if (value < lowerBand) return { zone: 'Oversold', color: 'text-green-600' }
    return { zone: 'Neutral', color: 'text-gray-600' }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Signal className="h-5 w-5 text-primary" />
            TDI (Traders Dynamic Index) Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Advanced TDI indicator integration for BTMM pattern confirmation, momentum analysis, and trade validation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-600 mb-1">RSI Value</h4>
              <p className="text-xl font-bold">{rsiValue}</p>
              <p className={`text-xs ${getRSIZone(rsiValue).color}`}>
                {getRSIZone(rsiValue).zone}
              </p>
            </div>
            
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-600 mb-1">MBL</h4>
              <p className="text-xl font-bold">{mblValue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Market Base Line</p>
            </div>
            
            <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <h4 className="font-semibold text-orange-600 mb-1">Signal Line</h4>
              <p className="text-xl font-bold">{signalLineValue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Trade Signal</p>
            </div>
            
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-600 mb-1">Volatility</h4>
              <p className="text-xl font-bold">{volatilityBand.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">Band Width</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signals">
            <Signal className="h-4 w-4 mr-2" />
            Live Signals
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="integration">
            <Layers className="h-4 w-4 mr-2" />
            BTMM Integration
          </TabsTrigger>
        </TabsList>

        {/* Live Signals */}
        <TabsContent value="signals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active TDI Signals</h3>
            <Badge variant="outline">
              {activeSignals.length} Active Signal{activeSignals.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {activeSignals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold text-muted-foreground mb-2">No Active Signals</h4>
                <p className="text-sm text-muted-foreground">
                  TDI indicators are in neutral territory. Monitor for signal development.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeSignals.map((signal) => (
                <Card key={signal.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getDirectionIcon(signal.direction)}
                        <h4 className="font-semibold">{signal.description}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSignalTypeColor(signal.type)}>
                          {signal.type.charAt(0).toUpperCase() + signal.type.slice(1)}
                        </Badge>
                        <Badge {...getStrengthBadge(signal.strength)}>
                          {getStrengthBadge(signal.strength).text}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{signal.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Signal Criteria:</h5>
                      <ul className="text-sm space-y-1">
                        {signal.criteria.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TDI Analysis */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TDI Component Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* RSI Analysis */}
              <div className="space-y-3">
                <h4 className="font-semibold">RSI Analysis</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Current RSI Value</Label>
                    <Input 
                      type="number" 
                      value={rsiValue} 
                      onChange={(e) => setRsiValue(Number(e.target.value))}
                      className="w-20"
                      min="0"
                      max="100"
                    />
                  </div>
                  <Progress value={rsiValue} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Oversold ({lowerBand})</span>
                    <span>Neutral (50)</span>
                    <span>Overbought ({upperBand})</span>
                  </div>
                </div>
              </div>

              {/* MBL vs Signal Line */}
              <div className="space-y-3">
                <h4 className="font-semibold">MBL vs Signal Line</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Market Base Line (MBL)</Label>
                    <Input 
                      type="number" 
                      value={mblValue} 
                      onChange={(e) => setMblValue(Number(e.target.value))}
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Signal Line</Label>
                    <Input 
                      type="number" 
                      value={signalLineValue} 
                      onChange={(e) => setSignalLineValue(Number(e.target.value))}
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="p-3 bg-gray-500/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Relationship:</strong> MBL is {mblValue > signalLineValue ? 'above' : 'below'} Signal Line
                    ({Math.abs(mblValue - signalLineValue).toFixed(2)} points difference)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mblValue > signalLineValue 
                      ? 'Bullish momentum - Consider long bias' 
                      : 'Bearish momentum - Consider short bias'
                    }
                  </p>
                </div>
              </div>

              {/* Volatility Analysis */}
              <div className="space-y-3">
                <h4 className="font-semibold">Volatility Band Analysis</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Volatility Band Width</Label>
                    <Input 
                      type="number" 
                      value={volatilityBand} 
                      onChange={(e) => setVolatilityBand(Number(e.target.value))}
                      step="0.0001"
                      className="w-24"
                    />
                  </div>
                  <div className="p-3 bg-gray-500/10 rounded-lg">
                    <p className="text-sm">
                      <strong>Volatility Status:</strong> {volatilityBand > 2.0 ? 'High' : volatilityBand > 1.5 ? 'Medium' : 'Low'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {volatilityBand > 2.0 
                        ? 'High volatility - Expect larger price movements' 
                        : 'Normal volatility - Standard position sizing appropriate'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TDI Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RSI Period</Label>
                  <Input 
                    type="number" 
                    value={tdiSettings.rsiPeriod}
                    onChange={(e) => setTdiSettings(prev => ({...prev, rsiPeriod: Number(e.target.value)}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price Period</Label>
                  <Input 
                    type="number" 
                    value={tdiSettings.pricePeriod}
                    onChange={(e) => setTdiSettings(prev => ({...prev, pricePeriod: Number(e.target.value)}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signal Period</Label>
                  <Input 
                    type="number" 
                    value={tdiSettings.signalPeriod}
                    onChange={(e) => setTdiSettings(prev => ({...prev, signalPeriod: Number(e.target.value)}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>MBL Period</Label>
                  <Input 
                    type="number" 
                    value={tdiSettings.mblPeriod}
                    onChange={(e) => setTdiSettings(prev => ({...prev, mblPeriod: Number(e.target.value)}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upper Band</Label>
                  <Input 
                    type="number" 
                    value={upperBand}
                    onChange={(e) => setUpperBand(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lower Band</Label>
                  <Input 
                    type="number" 
                    value={lowerBand}
                    onChange={(e) => setLowerBand(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-blue-600 mb-2">Default BTMM Settings</h4>
                <p className="text-sm text-blue-600">
                  RSI: 13, Price: 2, Signal: 7, MBL: 34, Bands: 68/32
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setTdiSettings({
                      rsiPeriod: 13,
                      pricePeriod: 2,
                      signalPeriod: 7,
                      upperBand: 68,
                      lowerBand: 32,
                      mblPeriod: 34
                    })
                    setUpperBand(68)
                    setLowerBand(32)
                  }}
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BTMM Integration */}
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>BTMM Pattern Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-green-600 mb-2">✅ M&W Pattern Confirmation</h4>
                  <ul className="text-sm space-y-1">
                    <li>• RSI outside bands (68/32) for momentum confirmation</li>
                    <li>• MBL crossing signal line for directional bias</li>
                    <li>• Volatility expansion for breakout validation</li>
                    <li>• Divergence detection for exit timing</li>
                  </ul>
                </div>
                
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-600 mb-2">✅ Half Batman Integration</h4>
                  <ul className="text-sm space-y-1">
                    <li>• TDI confirmation at apex formation</li>
                    <li>• RSI divergence for shift candle validation</li>
                    <li>• MBL direction for bias confirmation</li>
                    <li>• Volatility bands for breakout strength</li>
                  </ul>
                </div>
                
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold text-purple-600 mb-2">✅ ID50 Safety Confirmation</h4>
                  <ul className="text-sm space-y-1">
                    <li>• RSI oversold/overbought for bounce confirmation</li>
                    <li>• MBL alignment with 50 EMA direction</li>
                    <li>• Signal line cross for entry timing</li>
                    <li>• Volatility contraction for compression setups</li>
                  </ul>
                </div>
                
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                  <h4 className="font-semibold text-orange-600 mb-2">⚠️ Risk Management Integration</h4>
                  <ul className="text-sm space-y-1">
                    <li>• High volatility = Reduce position size</li>
                    <li>• Divergence signals = Consider profit taking</li>
                    <li>• RSI extreme readings = Tight stops</li>
                    <li>• MBL/Signal alignment = Trend following bias</li>
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

export default TDIIntegration
