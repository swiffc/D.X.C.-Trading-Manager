import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Target, Calendar, Clock, TrendingUp, Shield, AlertTriangle, 
  CheckCircle, BarChart3, Zap, DollarSign, Activity, Eye, 
  Brain, Timer, Settings, BookOpen, LineChart, Compass
} from 'lucide-react'

const TradingPlan = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const tradingRules = [
    { rule: "Only trade with daily bias", priority: "HIGH", category: "Bias" },
    { rule: "Minimum 2:1 Risk-to-Reward ratio", priority: "HIGH", category: "Risk" },
    { rule: "Trade only during optimal sessions", priority: "HIGH", category: "Timing" },
    { rule: "Confirm with TDI signals", priority: "MEDIUM", category: "Confluence" },
    { rule: "Use execution checklist for every trade", priority: "HIGH", category: "Process" },
    { rule: "Maximum 2% risk per trade", priority: "HIGH", category: "Risk" },
    { rule: "No trading against D1 zone flips", priority: "HIGH", category: "Bias" },
    { rule: "Wait for EMA alignment", priority: "MEDIUM", category: "Technical" }
  ]

  const sessionPlan = [
    {
      session: "Pre-Market Analysis",
      time: "8:00 AM - 9:30 AM EST",
      tasks: [
        "Review overnight news and economic calendar",
        "Identify key levels (PDH/PDL, YH/YL, HOD/LOD)",
        "Determine daily bias using Weekly/Daily Dashboard",
        "Mark session timing alerts (Brinks timing)",
        "Set up TDI indicators and confirm settings"
      ]
    },
    {
      session: "Market Open",
      time: "9:30 AM - 11:00 AM EST",
      tasks: [
        "Monitor opening range formation",
        "Watch for stop hunt patterns",
        "Identify first reversal opportunities",
        "Execute Type 1-4 setups with bias alignment",
        "Use execution checklist for trade validation"
      ]
    },
    {
      session: "Mid-Day Session",
      time: "11:00 AM - 2:00 PM EST",
      tasks: [
        "Look for continuation patterns",
        "Monitor M&W and Half Batman setups",
        "Watch for ID50 Safety patterns",
        "Manage open positions",
        "Prepare for afternoon session"
      ]
    },
    {
      session: "Afternoon Session",
      time: "2:00 PM - 4:00 PM EST",
      tasks: [
        "Monitor closing range formation",
        "Look for end-of-day reversals",
        "Close positions before major news",
        "Review trade performance",
        "Plan for next session"
      ]
    }
  ]

  const weeklyPreparation = [
    {
      day: "Sunday",
      tasks: [
        "Review previous week's performance",
        "Analyze weekly bias patterns",
        "Identify key economic events for the week",
        "Update trading journal with lessons learned",
        "Set weekly trading goals and risk limits"
      ]
    },
    {
      day: "Monday",
      tasks: [
        "Determine weekly bias direction",
        "Identify Day 2/Day 3 patterns",
        "Mark FRD/FGD potential setups",
        "Set weekly key levels",
        "Plan high-probability trade scenarios"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            📋 BTMM Trading Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Your comprehensive daily and weekly trading plan based on BTMM methodology
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview">
              <Compass className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="rules">
              <Shield className="h-4 w-4 mr-1" />
              Trading Rules
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Calendar className="h-4 w-4 mr-1" />
              Daily Plan
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <BookOpen className="h-4 w-4 mr-1" />
              Weekly Prep
            </TabsTrigger>
            <TabsTrigger value="setups">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trade Setups
            </TabsTrigger>
            <TabsTrigger value="risk">
              <DollarSign className="h-4 w-4 mr-1" />
              Risk Plan
            </TabsTrigger>
            <TabsTrigger value="review">
              <LineChart className="h-4 w-4 mr-1" />
              Review Process
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-sm">Achieve consistent profitability through systematic BTMM pattern recognition and disciplined risk management.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Target</span>
                      <Badge variant="outline">+15% Account Growth</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Win Rate Target</span>
                      <Badge variant="outline">65%+</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk-to-Reward</span>
                      <Badge variant="outline">Minimum 2:1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Daily Risk</span>
                      <Badge variant="destructive">2% Account</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Key Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pattern Recognition Accuracy</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Risk Management Compliance</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Execution Checklist Usage</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Session Timing Adherence</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  BTMM Methodology Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold text-blue-600 mb-2">1. Bias Analysis</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Weekly/Daily bias determination</li>
                      <li>• Day 2/3 pattern recognition</li>
                      <li>• FRD/FGD identification</li>
                      <li>• Inside/Outside day analysis</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-600 mb-2">2. Pattern Recognition</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Type 1-4 trade setups</li>
                      <li>• M&W patterns</li>
                      <li>• Half Batman setups</li>
                      <li>• ID50 Safety patterns</li>
                    </ul>
                  </div>
                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <h3 className="font-semibold text-orange-600 mb-2">3. Execution</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Session timing optimization</li>
                      <li>• TDI confirmation</li>
                      <li>• Risk management</li>
                      <li>• Systematic validation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Core Trading Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tradingRules.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{item.rule}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={item.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                          {item.priority}
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Trading Violations & Consequences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                    <h3 className="font-semibold text-red-600 mb-2">⛔ Immediate Stop Trading</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Trading against daily bias</li>
                      <li>• Exceeding 2% daily risk limit</li>
                      <li>• Taking trades without execution checklist</li>
                      <li>• Revenge trading after losses</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-600 mb-2">⚠️ Warning Violations</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Trading without TDI confirmation</li>
                      <li>• Ignoring session timing rules</li>
                      <li>• Taking less than 2:1 R:R trades</li>
                      <li>• Not updating trading journal</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Plan Tab */}
          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Daily Trading Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sessionPlan.map((session, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{session.session}</h3>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.time}
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {session.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Preparation Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Weekly Preparation Routine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weeklyPreparation.map((day, index) => (
                    <div key={index} className="bg-secondary/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {day.day}
                      </h3>
                      <ul className="space-y-2">
                        {day.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Setups Tab */}
          <TabsContent value="setups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Preferred Trade Setups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">High Probability Setups</h3>
                    <div className="space-y-3">
                      <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                        <h4 className="font-semibold text-green-600">Type 1 - Trend Continuation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          EMA alignment + bias confirmation + key level bounce
                        </p>
                      </div>
                      <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                        <h4 className="font-semibold text-blue-600">M&W Pattern</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Consolidation break with EMA alignment and TDI confirmation
                        </p>
                      </div>
                      <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                        <h4 className="font-semibold text-purple-600">Half Batman</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reversal pattern at key levels with momentum divergence
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Setup Requirements</h3>
                    <div className="space-y-3">
                      <div className="bg-secondary/30 p-3 rounded">
                        <h4 className="font-semibold mb-2">✅ Required Confluences</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Daily bias alignment</li>
                          <li>• EMA structure confirmation</li>
                          <li>• Key level interaction</li>
                          <li>• Session timing optimization</li>
                          <li>• TDI signal confirmation</li>
                        </ul>
                      </div>
                      <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                        <h4 className="font-semibold text-red-600 mb-2">❌ Avoid These Setups</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Against daily bias</li>
                          <li>• Poor R:R ratio (&lt;2:1)</li>
                          <li>• No clear stop loss level</li>
                          <li>• During low liquidity periods</li>
                          <li>• Without TDI confirmation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Risk Management Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Position Sizing Rules</h3>
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Maximum risk per trade:</span>
                          <Badge variant="destructive">2% of account</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Maximum daily risk:</span>
                          <Badge variant="destructive">6% of account</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Minimum R:R ratio:</span>
                          <Badge variant="outline">2:1</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Maximum open positions:</span>
                          <Badge variant="outline">3 trades</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Stop Loss Strategy</h3>
                    <div className="space-y-3">
                      <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                        <h4 className="font-semibold text-red-600">Hard Stop Rules</h4>
                        <ul className="text-sm space-y-1 mt-2">
                          <li>• Always set stop loss before entry</li>
                          <li>• Never move stop loss against position</li>
                          <li>• Use key levels for stop placement</li>
                          <li>• Account for spread and slippage</li>
                        </ul>
                      </div>
                      <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                        <h4 className="font-semibold text-green-600">Profit Taking</h4>
                        <ul className="text-sm space-y-1 mt-2">
                          <li>• Take partial profits at 1:1 R:R</li>
                          <li>• Move stop to breakeven</li>
                          <li>• Trail stop using EMA or key levels</li>
                          <li>• Close before major news events</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Process Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Performance Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Daily Review</h3>
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Review all trades taken
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Analyze pattern recognition accuracy
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Check risk management compliance
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Update trading journal
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Identify improvement areas
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Weekly Review</h3>
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Calculate weekly P&L
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Review bias accuracy
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Analyze setup performance
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Update trading rules if needed
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Plan next week's strategy
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Performance Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Trade Analysis</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Did I follow my bias correctly?</li>
                            <li>• Was my pattern recognition accurate?</li>
                            <li>• Did I use proper risk management?</li>
                            <li>• Was my entry timing optimal?</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Process Improvement</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• What patterns am I missing?</li>
                            <li>• How can I improve my timing?</li>
                            <li>• Are my stops placed optimally?</li>
                            <li>• What rules need adjustment?</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TradingPlan
