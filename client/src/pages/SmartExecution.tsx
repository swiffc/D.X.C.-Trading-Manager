import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Target,
  Brain,
  Clock,
  TrendingUp,
  TrendingDown,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity
} from 'lucide-react'
import { ChartExamples } from '@/components/examples/ChartExamples'

const SmartExecution = () => {
  const [tab, setTab] = useState('overview')

  const sessionTimes = [
    { name: 'Asian', time: '11:00 PM - 8:00 AM' },
    { name: 'London', time: '08:30 AM - 2:00 PM' },
    { name: 'New York', time: '02:30 PM - 10:30 PM' }
  ]

  const londonWindows = [
    { label: 'Morning Window', time: '09:15 - 11:15' },
    { label: 'Afternoon Window', time: '14:15 - 15:15' },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SMART EXECUTION — BTMM Simplified</h1>
          <p className="text-muted-foreground">Core principles, sessions, patterns, and levels organized for fast reference and execution.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="overview"><Target className="h-4 w-4 mr-1" />Overview</TabsTrigger>
            <TabsTrigger value="disclaimer"><Shield className="h-4 w-4 mr-1" />Disclaimer</TabsTrigger>
            <TabsTrigger value="psychology"><Brain className="h-4 w-4 mr-1" />Psychology</TabsTrigger>
            <TabsTrigger value="btmm"><BookOpen className="h-4 w-4 mr-1" />BTMM Basics</TabsTrigger>
            <TabsTrigger value="sessions"><Clock className="h-4 w-4 mr-1" />Sessions</TabsTrigger>
            <TabsTrigger value="patterns"><TrendingUp className="h-4 w-4 mr-1" />Patterns</TabsTrigger>
            <TabsTrigger value="entries"><Activity className="h-4 w-4 mr-1" />Entries</TabsTrigger>
            <TabsTrigger value="levels"><Calendar className="h-4 w-4 mr-1" />Levels</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />What You’ll Use</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">Process</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Live in the now; follow the checklist</li>
                    <li>• Trade beliefs you trust and can execute</li>
                    <li>• Focus on timing, pattern, pushes</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold mb-2">Edge</h3>
                  <ul className="text-sm space-y-1">
                    <li>• M & W patterns from Asian box</li>
                    <li>• London/NY session windows</li>
                    <li>• EMA structure + TDI confirm</li>
                  </ul>
                </div>
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                  <h3 className="font-semibold mb-2">Risk</h3>
                  <ul className="text-sm space-y-1">
                    <li>• SL: 23–30 pips typical</li>
                    <li>• Min 2:1 R:R targets</li>
                    <li>• Stand down if pattern unclear</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disclaimer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-destructive" />Educational Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>Nothing presented here is trading advice. All content is for educational purposes only. Trading involves risk of loss. Past performance is not indicative of future results. Use discretionary funds only.</p>
                  <div className="bg-yellow-500/10 p-4 rounded border border-yellow-500/20">
                    <h4 className="font-semibold text-yellow-700 mb-2">CFTC Rule 4.41</h4>
                    <p>Hypothetical or simulated performance results have limitations and are designed with the benefit of hindsight. No representation is made that any account will achieve profits or losses similar to those shown.</p>
                  </div>
                  <p>Participation implies agreement to hold harmless any person associated with this material from losses resulting from your participation.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="psychology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" />Two Pillars</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold text-blue-600 mb-2">1. Live in the Now</h3>
                  <p className="text-sm">Pay attention to the process, not future goals. Trade what is on the screen, not what you hope to see.</p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold text-green-600 mb-2">2. Belief</h3>
                  <p className="text-sm">Trade a method you believe in. Confidence in your strategy affects execution quality and outcomes.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="btmm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />BTMM Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded">
                  <h4 className="font-semibold mb-2">Market Maker Objectives</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Induce traders then reverse to hit stops</li>
                    <li>• Create panic via spikes, news, quick moves</li>
                    <li>• Hunt liquidity around obvious highs/lows</li>
                  </ul>
                </div>
                <div className="bg-secondary/30 p-4 rounded">
                  <h4 className="font-semibold mb-2">Where Moves Cluster</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Beginning/end of week</li>
                    <li>• Beginning/end of day</li>
                    <li>• Session opens and closes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Sessions & Timing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sessionTimes.map((s) => (
                    <div key={s.name} className="bg-primary/5 p-3 rounded border border-primary/10 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{s.name} Session</span>
                        <Badge variant="outline">{s.time}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <h4 className="font-semibold text-green-700 mb-2">London Setup Windows</h4>
                    <ul className="text-sm space-y-1">
                      {londonWindows.map(w => (
                        <li key={w.label}>• {w.label}: {w.time}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-blue-700 mb-2">Asian Box</h4>
                    <p className="text-sm">On M15, mark 11:00 PM - 8:00 AM. Watch for first break out of the box during London/NY to set the day’s HOW/LOW and form M or W.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />M & W Formations</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold text-blue-700 mb-2">Appearances</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Out of Asian box into London</li>
                    <li>• Second leg forms after London open</li>
                    <li>• Or forms later in New York</li>
                    <li>• Shapes can be disguised—confirm with TDI</li>
                  </ul>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="font-semibold text-purple-700 mb-2">Scenarios</h3>
                  <ul className="text-sm space-y-1">
                    <li>• First leg in Asian, second leg after breakout</li>
                    <li>• Clear W/M formed directly out of box</li>
                    <li>• Hidden patterns validated by TDI shape</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Imported Chart Examples (Auto‑detected)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartExamples onlyCharts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Entry Triggers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <h4 className="font-semibold text-green-700 mb-2">Candles & Confluence</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Shift candle at leg completion</li>
                      <li>• Retest rejection at EMA/level</li>
                      <li>• TDI confirmation (RSI bands, MBL cross)</li>
                    </ul>
                  </div>
                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <h4 className="font-semibold text-orange-700 mb-2">Stops & Targets</h4>
                    <ul className="text-sm space-y-1">
                      <li>• SL 23–30 pips beyond invalidation</li>
                      <li>• Min 2:1 R:R, manage at 1:1</li>
                      <li>• Close before major news</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-secondary/30 p-4 rounded">
                  <h4 className="font-semibold mb-2">London “Trapping” Setups (Safety Trades)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Type 1: M/W pinning EMA200 out of Asian box</li>
                    <li>• Type 2: Clear M/W out of box with EMA interaction</li>
                    <li>• Type 3: After PFH/PFL, pattern at EMA50/200</li>
                    <li>• Note: EMA 13/50/200/800 context improves timing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Levels & Weekly Cycle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded">
                  <h4 className="font-semibold mb-2">Definition</h4>
                  <p className="text-sm">Levels are the market cycle in sequences of consolidation + rise/drop, typically unfolding over 2.5–5 days and ~1×ADR per level (3 levels ≈ 3×ADR). Always begin counting from the Peak Formation (PFH/PFL).</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded border">
                    <h4 className="font-semibold mb-1">Level 1</h4>
                    <p className="text-sm">First consolidation after 13/50 EMA cross confirms L1.</p>
                  </div>
                  <div className="p-4 rounded border">
                    <h4 className="font-semibold mb-1">Level 2</h4>
                    <p className="text-sm">Second consolidation after 50/200 EMA cross confirms L2.</p>
                  </div>
                  <div className="p-4 rounded border">
                    <h4 className="font-semibold mb-1">Level 3</h4>
                    <p className="text-sm">Expect a multi‑session M or W and stop‑hunt behavior.</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-700 mb-2">Multi‑TF Mapping</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 3 levels + reset on M15 ≈ 1 level on H1</li>
                    <li>• 3 levels + reset on H1 ≈ 1 level on H4</li>
                    <li>• Repeat mapping up to Daily/Weekly</li>
                  </ul>
                </div>
                <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                  <h4 className="font-semibold text-yellow-700 mb-2">Key Notes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Prioritize pattern, timing, pushes over perfect level count</li>
                    <li>• Reversals often mid‑week (Wed/Thu); traps Fri→Mon</li>
                    <li>• Draw levels top‑down: D1 → H4 → H1 → M15 for entries</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SmartExecution


