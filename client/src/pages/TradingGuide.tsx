import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Clock, TrendingUp, BarChart3, Target, Shield, AlertTriangle, 
  CheckCircle, Calendar, Zap, TrendingDown, ArrowUp, Settings,
  BookOpen, Timer, DollarSign, Activity, Eye, Brain
} from 'lucide-react'

const TradingGuide = () => {
  const [activeSection, setActiveSection] = useState('objectives')

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            📊 BTMM Pattern Recognition Trading Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive guide to trading strategies, setups, and risk management using BTMM methodology
          </p>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="objectives" className="text-xs">
              <Target className="h-4 w-4 mr-1" />
              Objectives
            </TabsTrigger>
            <TabsTrigger value="preparation" className="text-xs">
              <Calendar className="h-4 w-4 mr-1" />
              Preparation
            </TabsTrigger>
            <TabsTrigger value="bias" className="text-xs">
              <Brain className="h-4 w-4 mr-1" />
              Bias & DOL
            </TabsTrigger>
            <TabsTrigger value="setups" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              Trade Setups
            </TabsTrigger>
            <TabsTrigger value="patterns" className="text-xs">
              <TrendingUp className="h-4 w-4 mr-1" />
              Advanced Patterns
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-xs">
              <Shield className="h-4 w-4 mr-1" />
              Risk Management
            </TabsTrigger>
            <TabsTrigger value="timing" className="text-xs">
              <Clock className="h-4 w-4 mr-1" />
              Session Timing
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">
              <CheckCircle className="h-4 w-4 mr-1" />
              Execution
            </TabsTrigger>
          </TabsList>

          {/* Trading Objectives */}
          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Trading Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Primary Goal</h3>
                  <p>Trade in line with the trend and liquidity cycles to achieve consistent profitability.</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Focus Areas</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use Daily Bias and Draw on Liquidity (DOL) for market context</li>
                    <li>Identify high-probability setups using advanced entry patterns</li>
                    <li>Maintain strict risk management with 2:1 reward-to-risk ratios</li>
                    <li>Trade during optimal session timings for maximum liquidity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly and Daily Preparation */}
          <TabsContent value="preparation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Cycle Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-green-600">Day 2 - Level A1 Sell / Level V1 Buy</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• FRD/FGD (First Red/Green Day)</li>
                        <li>• Inside Day patterns</li>
                        <li>• False Break Reversal</li>
                        <li>• Session 1: Higher high</li>
                        <li>• Session 2: Higher low</li>
                        <li>• Session 3: 3 pushes into high for false break reversal</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-blue-600">Inside Day Reversal</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• Session 1: 1st push</li>
                        <li>• Session 2: 2nd push</li>
                        <li>• Session 3: 3rd push, break in structure, and 1-2-3 reversal</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-orange-600">Day 3 - Level A2 Sell / Level V2 Sell</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• Day 3 Breakouts</li>
                        <li>• Continuation patterns</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Key Level Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-secondary/30 p-3 rounded">
                      <h4 className="font-semibold mb-2">Critical Levels to Monitor</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Badge variant="outline">PDH/PDL</Badge>
                        <Badge variant="outline">YH/YL</Badge>
                        <Badge variant="outline">HOD/LOD</Badge>
                        <Badge variant="outline">HOW/LOW</Badge>
                        <Badge variant="outline">HOM/LOM</Badge>
                        <Badge variant="outline">ADR Boundaries</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                      <h4 className="font-semibold text-yellow-600 mb-2">⚠️ Important Checks</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Is high/low locked in?</li>
                        <li>• Is session high/low locked in?</li>
                        <li>• Avoid trading against D1 zone flips</li>
                        <li>• Align with higher timeframe trend</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Continue with other tabs... */}
          <TabsContent value="bias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Bias & Draw on Liquidity (DOL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Use this section to determine your daily bias and optimal trade setup based on BTMM and Stacey Burke logic.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    📊 Bias analysis components will be implemented in the interactive dashboard
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Setups Tab */}
          <TabsContent value="setups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Type 1-4 Trade Setups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                      <h4 className="font-semibold text-green-600">Type 1 - Trend Continuation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Strong trend with EMA alignment, trading in direction of bias
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">High Probability</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                      <h4 className="font-semibold text-blue-600">Type 2 - Pullback Entry</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Retracement to key level in trending market
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">Medium Probability</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-orange-500/10 p-3 rounded border border-orange-500/20">
                      <h4 className="font-semibold text-orange-600">Type 3 - Reversal</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Counter-trend trade at major support/resistance
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">Lower Probability</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                      <h4 className="font-semibold text-purple-600">Type 4 - Breakout</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Break of consolidation or key level with volume
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">Context Dependent</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Setup Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-secondary/30 p-3 rounded">
                    <h4 className="font-semibold mb-2">✅ Required Confluences</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Daily bias alignment</li>
                      <li>• EMA structure confirmation</li>
                      <li>• Key level interaction</li>
                      <li>• Proper risk-to-reward (min 2:1)</li>
                      <li>• Session timing optimization</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                    <h4 className="font-semibold text-red-600 mb-2">❌ Avoid These Conditions</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Trading against daily bias</li>
                      <li>• Poor risk-to-reward ratio</li>
                      <li>• No clear stop loss level</li>
                      <li>• During major news events</li>
                      <li>• Low liquidity periods</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    M&W Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-blue-600 mb-2">Pattern Recognition</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Consolidation phase identification</li>
                      <li>• EMA alignment confirmation</li>
                      <li>• Volume expansion on breakout</li>
                      <li>• TDI momentum confirmation</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <h4 className="font-semibold text-green-600 mb-2">Entry Criteria</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Break of consolidation high/low</li>
                      <li>• Retest of breakout level</li>
                      <li>• EMA support/resistance</li>
                      <li>• Bias alignment confirmation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Half Batman & ID50
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <h4 className="font-semibold text-purple-600 mb-2">Half Batman Setup</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Reversal pattern at key levels</li>
                      <li>• Momentum divergence signals</li>
                      <li>• Support/resistance interaction</li>
                      <li>• Counter-trend opportunity</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <h4 className="font-semibold text-orange-600 mb-2">ID50 Safety Pattern</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Inside day formation</li>
                      <li>• 50% retracement level</li>
                      <li>• Safety-first approach</li>
                      <li>• Conservative risk management</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Risk Management Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                      <h4 className="font-semibold text-red-600 mb-2">Position Sizing Rules</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Maximum 2% risk per trade</li>
                        <li>• Calculate position size before entry</li>
                        <li>• Account for spread and slippage</li>
                        <li>• Never risk more than planned</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                      <h4 className="font-semibold text-green-600 mb-2">Reward-to-Risk Ratios</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Minimum 2:1 R:R for all trades</li>
                        <li>• Target 3:1 or higher when possible</li>
                        <li>• Partial profit taking at 1:1</li>
                        <li>• Trail stops to protect profits</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                      <h4 className="font-semibold text-yellow-600 mb-2">Stop Loss Strategy</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Always set stop before entry</li>
                        <li>• Use key levels for stop placement</li>
                        <li>• Never move stop against position</li>
                        <li>• Honor stops without hesitation</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                      <h4 className="font-semibold text-blue-600 mb-2">Daily Risk Limits</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Maximum 6% daily drawdown</li>
                        <li>• Stop trading after 3 losses</li>
                        <li>• Maximum 3 open positions</li>
                        <li>• Review and adjust limits weekly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Timing Tab */}
          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Optimal Trading Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">🕘 Brinks Timing System</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Key reversal times based on institutional trading patterns
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-1">9:45 PM EST</Badge>
                        <p className="text-xs text-muted-foreground">Asian Open</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="mb-1">3:45 AM EST</Badge>
                        <p className="text-xs text-muted-foreground">London Open</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="mb-1">9:45 AM EST</Badge>
                        <p className="text-xs text-muted-foreground">NY Open</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">High Probability Sessions</h4>
                      <div className="space-y-2">
                        <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                          <h5 className="font-semibold text-green-600">London-NY Overlap</h5>
                          <p className="text-xs text-muted-foreground">8:00 AM - 12:00 PM EST</p>
                          <p className="text-xs mt-1">Highest liquidity and volatility</p>
                        </div>
                        <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                          <h5 className="font-semibold text-blue-600">NY Opening Range</h5>
                          <p className="text-xs text-muted-foreground">9:30 AM - 11:00 AM EST</p>
                          <p className="text-xs mt-1">Initial bias establishment</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Avoid Trading During</h4>
                      <div className="space-y-2">
                        <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                          <h5 className="font-semibold text-red-600">Low Liquidity Periods</h5>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• 12:00 PM - 2:00 PM EST (Lunch)</li>
                            <li>• After 4:00 PM EST (NY Close)</li>
                            <li>• Sunday evening gaps</li>
                            <li>• Major holiday sessions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Pre-Trade Execution Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Market Analysis ✅</h4>
                      <div className="space-y-2">
                        {[
                          'Daily bias determined and confirmed',
                          'Key levels identified (PDH/PDL, YH/YL)',
                          'Session timing optimal',
                          'Economic calendar reviewed',
                          'TDI signals aligned'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Trade Setup ✅</h4>
                      <div className="space-y-2">
                        {[
                          'Pattern recognition confirmed',
                          'EMA alignment verified',
                          'Entry level identified',
                          'Stop loss level set',
                          'Target levels calculated (min 2:1 R:R)'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold text-yellow-600 mb-2">⚠️ Final Validation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-sm space-y-1">
                        <li>• Position size calculated (max 2% risk)</li>
                        <li>• All confluences present</li>
                        <li>• No conflicting signals</li>
                      </ul>
                      <ul className="text-sm space-y-1">
                        <li>• Trading plan documented</li>
                        <li>• Risk management rules followed</li>
                        <li>• Emotional state checked</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TradingGuide