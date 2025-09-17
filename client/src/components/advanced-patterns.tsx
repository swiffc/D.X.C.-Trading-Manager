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
  Layers, Triangle, Hexagon, Octagon, Square
} from 'lucide-react'

interface PatternCriteria {
  id: string
  name: string
  description: string
  rules: string[]
  confluences: string[]
  timeframes: string[]
  locations: string[]
  isValid: boolean
  confidence: number
}

interface PatternAnalysis {
  pattern: PatternCriteria
  currentPrice: number
  emaLevels: {
    ema13: number
    ema50: number
    ema200: number
    ema800: number
  }
  tdiConfirmation: {
    rsiOutsideBand: boolean
    mblCrossing: boolean
    signalLine: 'bullish' | 'bearish' | 'neutral'
  }
}

const AdvancedPatterns = () => {
  const [selectedPattern, setSelectedPattern] = useState('mw-patterns')
  const [analysisData, setAnalysisData] = useState<PatternAnalysis | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [emaInputs, setEmaInputs] = useState({
    ema13: '',
    ema50: '',
    ema200: '',
    ema800: ''
  })

  // M&W Pattern Definitions
  const mwPatterns: PatternCriteria[] = [
    {
      id: 'mw-13ema-consolidation',
      name: 'M&W with 13 EMA Consolidation',
      description: 'First leg does not close above/below 13 but consolidates in a range of 8 or more candles',
      rules: [
        'First leg does not close above/below 13 EMA',
        'Consolidates in range of 8+ candles below/above 13 EMA',
        'Price shifts and closes above/below 13 EMA',
        'TDI confirmation required'
      ],
      confluences: ['13 EMA respect', 'TDI RSI outside band', 'MBL crossing signal line'],
      timeframes: ['15min', '1hr', '4hr'],
      locations: ['HOD/LOD', 'Level 3 reversal areas', 'YH/YL (blue tracer)', 'After SHH/SHL above/below Asian range', 'At EMAs (water, mayo)', 'After ADR completion'],
      isValid: false,
      confidence: 0
    },
    {
      id: 'mw-200ema-mayo',
      name: 'M&W off 200 EMA (Mayo/Water)',
      description: 'M&W pattern formation at 200 EMA with second leg closing above/below 13 EMA',
      rules: [
        'Same M&W pattern entry rules apply',
        'Formation occurs at 200 EMA level',
        'Second leg must close above/below 13 EMA',
        'Mayo/Water EMA confluence required'
      ],
      confluences: ['200 EMA bounce', '13 EMA close', 'Mayo/Water confluence'],
      timeframes: ['15min', '1hr', '4hr'],
      locations: ['200 EMA level', 'Mayo EMA', 'Water EMA'],
      isValid: false,
      confidence: 0
    },
    {
      id: '2nd-leg-asia',
      name: '2nd Leg Out of Asia',
      description: 'M setup with first leg created inside Asian session, pullback after midnight',
      rules: [
        'M setup with first leg inside Asian session',
        'Pullback happens after midnight',
        'RR, star, cord of words pattern on second leg',
        'First leg setup before/during London session (midnight-4am)',
        'Setup on 200, 800, or 3200 EMA'
      ],
      confluences: ['Asian session first leg', 'London session second leg', 'EMA confluence'],
      timeframes: ['15min', '1hr', '4hr'],
      locations: ['200 EMA', '800 EMA', '3200 EMA'],
      isValid: false,
      confidence: 0
    }
  ]

  // Half Batman Pattern Definitions
  const halfBatmanPatterns: PatternCriteria[] = [
    {
      id: 'half-batman-type1',
      name: 'Half Batman (Type 1&2)',
      description: 'Outside structure with first leg, price challenges but fails to reach first leg',
      rules: [
        'Outside structure, first leg formation',
        'Price closes above/below 13 EMA and comes back to challenge first leg',
        'Price fails to reach first leg high/low',
        'Entry trigger: shift candle',
        'Shift candle must close above/below apex (middle of structure)',
        'Price closes above/below 13 EMA with TDI confirmation'
      ],
      confluences: ['13 EMA interaction', 'TDI confirmation', 'Apex formation'],
      timeframes: ['15min', '1hr'],
      locations: ['Level 3 areas', 'Key reversal zones'],
      isValid: false,
      confidence: 0
    }
  ]

  // ID50 Pattern Definitions
  const id50Patterns: PatternCriteria[] = [
    {
      id: 'id50-safety',
      name: 'ID50 Safety (Level 1)',
      description: 'Inside Day 50 EMA bounce pattern with anchor present',
      rules: [
        'Must have anchor present on the left',
        '13/50 EMA crossover',
        'First pullback to 50 EMA',
        'Wait for price to trap at 50 EMA',
        'Entry trigger: RR, COW, morning/evening star at peak of second leg',
        'OR closing below 13 EMA'
      ],
      confluences: ['Anchor presence', '13/50 EMA cross', '50 EMA trap'],
      timeframes: ['15min'],
      locations: ['50 EMA level', 'Level 1 areas'],
      isValid: false,
      confidence: 0
    },
    {
      id: 'id50-h1',
      name: 'ID50 H1 (50/50 Bounce)',
      description: '50/50 bounce pattern on higher timeframes',
      rules: [
        'Level 1&3 pattern',
        'Formation on 1hr/4hr/Daily timeframes',
        '50 EMA bounce confirmation',
        'Candlestick pattern confirmation required'
      ],
      confluences: ['50 EMA bounce', 'Higher timeframe confluence'],
      timeframes: ['1hr', '4hr', 'Daily'],
      locations: ['50 EMA level', 'Level 3 areas'],
      isValid: false,
      confidence: 0
    }
  ]

  // Calculate pattern validity based on inputs
  const analyzePattern = (pattern: PatternCriteria) => {
    if (!priceInput || !emaInputs.ema13 || !emaInputs.ema50) return { ...pattern, isValid: false, confidence: 0 }
    
    const price = parseFloat(priceInput)
    const ema13 = parseFloat(emaInputs.ema13)
    const ema50 = parseFloat(emaInputs.ema50)
    const ema200 = parseFloat(emaInputs.ema200) || 0
    const ema800 = parseFloat(emaInputs.ema800) || 0
    
    let confidence = 0
    let isValid = false
    
    // Basic EMA relationship checks
    if (pattern.id.includes('13ema') && Math.abs(price - ema13) < 0.001) confidence += 25
    if (pattern.id.includes('50') && Math.abs(price - ema50) < 0.002) confidence += 25
    if (pattern.id.includes('200') && ema200 && Math.abs(price - ema200) < 0.003) confidence += 25
    
    // Pattern-specific validation
    switch (pattern.id) {
      case 'mw-13ema-consolidation':
        if (price > ema13 && ema13 > 0) confidence += 25
        break
      case 'half-batman-type1':
        if (price !== ema13 && Math.abs(price - ema13) < 0.002) confidence += 25
        break
      case 'id50-safety':
        if (Math.abs(price - ema50) < 0.001 && ema13 > ema50) confidence += 25
        break
    }
    
    isValid = confidence >= 50
    
    return { ...pattern, isValid, confidence }
  }

  const allPatterns = [...mwPatterns, ...halfBatmanPatterns, ...id50Patterns]
  const analyzedPatterns = allPatterns.map(analyzePattern)

  const getPatternIcon = (patternId: string) => {
    if (patternId.includes('mw')) return Triangle
    if (patternId.includes('batman')) return Hexagon
    if (patternId.includes('id50')) return Square
    return Octagon
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-green-600'
    if (confidence >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 75) return { variant: 'default' as const, text: 'High' }
    if (confidence >= 50) return { variant: 'secondary' as const, text: 'Medium' }
    return { variant: 'destructive' as const, text: 'Low' }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            BTMM Advanced Pattern Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Advanced entry patterns including M&W formations, Half Batman, ID50, and 2nd Leg Out of Asia setups.
          </p>
          
          {/* Price and EMA Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.00001"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="1.08500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ema13">13 EMA</Label>
              <Input
                id="ema13"
                type="number"
                step="0.00001"
                value={emaInputs.ema13}
                onChange={(e) => setEmaInputs(prev => ({ ...prev, ema13: e.target.value }))}
                placeholder="1.08450"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ema50">50 EMA</Label>
              <Input
                id="ema50"
                type="number"
                step="0.00001"
                value={emaInputs.ema50}
                onChange={(e) => setEmaInputs(prev => ({ ...prev, ema50: e.target.value }))}
                placeholder="1.08400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ema200">200 EMA</Label>
              <Input
                id="ema200"
                type="number"
                step="0.00001"
                value={emaInputs.ema200}
                onChange={(e) => setEmaInputs(prev => ({ ...prev, ema200: e.target.value }))}
                placeholder="1.08300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ema800">800 EMA</Label>
              <Input
                id="ema800"
                type="number"
                step="0.00001"
                value={emaInputs.ema800}
                onChange={(e) => setEmaInputs(prev => ({ ...prev, ema800: e.target.value }))}
                placeholder="1.08200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedPattern} onValueChange={setSelectedPattern} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mw-patterns">
            <Triangle className="h-4 w-4 mr-2" />
            M&W Patterns
          </TabsTrigger>
          <TabsTrigger value="half-batman">
            <Hexagon className="h-4 w-4 mr-2" />
            Half Batman
          </TabsTrigger>
          <TabsTrigger value="id50">
            <Square className="h-4 w-4 mr-2" />
            ID50 Patterns
          </TabsTrigger>
        </TabsList>

        {/* M&W Patterns */}
        <TabsContent value="mw-patterns" className="space-y-4">
          {mwPatterns.map((pattern) => {
            const analyzed = analyzedPatterns.find(p => p.id === pattern.id) || pattern
            const IconComponent = getPatternIcon(pattern.id)
            
            return (
              <Card key={pattern.id} className={`${analyzed.isValid ? 'ring-2 ring-green-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {pattern.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge {...getConfidenceBadge(analyzed.confidence)}>
                        {getConfidenceBadge(analyzed.confidence).text}
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(analyzed.confidence)}`}>
                        {analyzed.confidence}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Rules & Criteria</h4>
                      <ul className="text-xs space-y-1">
                        {pattern.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Optimal Locations</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.locations.map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                      
                      <h4 className="font-semibold mb-2 text-sm mt-3">Timeframes</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.timeframes.map((tf, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tf}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {analyzed.confidence > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pattern Confidence</span>
                        <span className={`text-sm ${getConfidenceColor(analyzed.confidence)}`}>
                          {analyzed.confidence}%
                        </span>
                      </div>
                      <Progress value={analyzed.confidence} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* Half Batman Patterns */}
        <TabsContent value="half-batman" className="space-y-4">
          {halfBatmanPatterns.map((pattern) => {
            const analyzed = analyzedPatterns.find(p => p.id === pattern.id) || pattern
            const IconComponent = getPatternIcon(pattern.id)
            
            return (
              <Card key={pattern.id} className={`${analyzed.isValid ? 'ring-2 ring-green-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {pattern.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge {...getConfidenceBadge(analyzed.confidence)}>
                        {getConfidenceBadge(analyzed.confidence).text}
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(analyzed.confidence)}`}>
                        {analyzed.confidence}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Rules & Criteria</h4>
                      <ul className="text-xs space-y-1">
                        {pattern.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Optimal Locations</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.locations.map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                      
                      <h4 className="font-semibold mb-2 text-sm mt-3">Timeframes</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.timeframes.map((tf, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tf}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {analyzed.confidence > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pattern Confidence</span>
                        <span className={`text-sm ${getConfidenceColor(analyzed.confidence)}`}>
                          {analyzed.confidence}%
                        </span>
                      </div>
                      <Progress value={analyzed.confidence} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* ID50 Patterns */}
        <TabsContent value="id50" className="space-y-4">
          {id50Patterns.map((pattern) => {
            const analyzed = analyzedPatterns.find(p => p.id === pattern.id) || pattern
            const IconComponent = getPatternIcon(pattern.id)
            
            return (
              <Card key={pattern.id} className={`${analyzed.isValid ? 'ring-2 ring-green-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {pattern.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge {...getConfidenceBadge(analyzed.confidence)}>
                        {getConfidenceBadge(analyzed.confidence).text}
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(analyzed.confidence)}`}>
                        {analyzed.confidence}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Rules & Criteria</h4>
                      <ul className="text-xs space-y-1">
                        {pattern.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Optimal Locations</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.locations.map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                      
                      <h4 className="font-semibold mb-2 text-sm mt-3">Timeframes</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.timeframes.map((tf, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tf}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {analyzed.confidence > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pattern Confidence</span>
                        <span className={`text-sm ${getConfidenceColor(analyzed.confidence)}`}>
                          {analyzed.confidence}%
                        </span>
                      </div>
                      <Progress value={analyzed.confidence} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>

      {/* TDI Confirmation Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            TDI Confirmation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
            <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              TDI Integration Requirements
            </h4>
            <ul className="text-sm space-y-1">
              <li>• RSI Outside Band confirmation for M&W patterns</li>
              <li>• MBL Crossing Signal Line detection for entries</li>
              <li>• Multi-timeframe TDI confluence validation</li>
              <li>• Integration with 13/50/200/800 EMA analysis</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              TDI indicator integration will be implemented in the next phase for complete pattern validation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedPatterns