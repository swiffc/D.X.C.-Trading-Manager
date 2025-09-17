import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CheckCircle, XCircle, AlertTriangle, Clock, Target, 
  TrendingUp, BarChart3, Eye, Zap, Activity, Settings,
  Layers, Triangle, Hexagon, Octagon, Square, MapPin,
  Calendar, Crosshair, ArrowUp, ArrowDown, Play, Pause
} from 'lucide-react'

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  isRequired: boolean
  isCompleted: boolean
  priority: 'high' | 'medium' | 'low'
  validationCriteria?: string[]
}

interface TradeSetup {
  tradeType: number
  bias: 'bullish' | 'bearish' | 'neutral'
  pattern: string
  keyLevel: string
  riskReward: number
  sessionTiming: string
}

const ExecutionChecklist = () => {
  const [selectedTab, setSelectedTab] = useState('pre-trade')
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [tradeSetup, setTradeSetup] = useState<TradeSetup>({
    tradeType: 1,
    bias: 'neutral',
    pattern: '',
    keyLevel: '',
    riskReward: 0,
    sessionTiming: ''
  })
  const [completionScore, setCompletionScore] = useState(0)
  const [canExecute, setCanExecute] = useState(false)

  // Pre-Trade Checklist Items
  const preTradeChecklist: ChecklistItem[] = [
    {
      id: 'market-bias',
      category: 'Market Analysis',
      title: 'Weekly & Daily Bias Confirmed',
      description: 'Verify weekly and daily bias alignment using FRD/FGD analysis',
      isRequired: true,
      isCompleted: false,
      priority: 'high',
      validationCriteria: [
        'Weekly bias clearly defined (bullish/bearish/neutral)',
        'Daily bias supports or conflicts identified',
        'Day 2/3 pattern analysis completed'
      ]
    },
    {
      id: 'key-levels',
      category: 'Technical Analysis',
      title: 'Key Levels Identified',
      description: 'Mark PDH/PDL, YH/YL, HOD/LOD, and session boundaries',
      isRequired: true,
      isCompleted: false,
      priority: 'high',
      validationCriteria: [
        'PDH/PDL levels marked on chart',
        'YH/YL blue tracer levels identified',
        'Current ADR5 completion calculated',
        'Session high/low boundaries noted'
      ]
    },
    {
      id: 'ema-alignment',
      category: 'Technical Analysis',
      title: 'EMA Alignment Verified',
      description: 'Check 13, 50, 200 EMA positioning and crossovers',
      isRequired: true,
      isCompleted: false,
      priority: 'high',
      validationCriteria: [
        '13 EMA position relative to price',
        '50 EMA trend direction confirmed',
        '200 EMA major trend alignment',
        'Recent crossover events noted'
      ]
    },
    {
      id: 'session-timing',
      category: 'Timing',
      title: 'Session Timing Optimal',
      description: 'Verify Brinks timing and session overlap windows',
      isRequired: true,
      isCompleted: false,
      priority: 'high',
      validationCriteria: [
        'Current session identified (Asian/London/NY)',
        'Brinks timing windows noted (9:45 PM/3:45 AM/9:45 AM)',
        'Stop hunt periods avoided',
        'High volatility windows targeted'
      ]
    },
    {
      id: 'pattern-confirmation',
      category: 'Pattern Recognition',
      title: 'Entry Pattern Confirmed',
      description: 'Validate M&W, Half Batman, or ID50 pattern setup',
      isRequired: true,
      isCompleted: false,
      priority: 'high',
      validationCriteria: [
        'Pattern type clearly identified',
        'Pattern completion criteria met',
        'Confluence factors present',
        'Pattern invalidation level set'
      ]
    },
    {
      id: 'risk-management',
      category: 'Risk Management',
      title: 'Risk Parameters Set',
      description: 'Calculate position size, stop loss, and take profit levels',
      isRequired: true,
      isCompleted: false,
      priority: 'high',
      validationCriteria: [
        'Position size calculated (1-2% account risk)',
        'Stop loss placement optimized',
        'Minimum 2:1 risk-reward ratio',
        'Take profit levels identified'
      ]
    },
    {
      id: 'tdi-confirmation',
      category: 'Indicators',
      title: 'TDI Confirmation',
      description: 'Verify TDI RSI and MBL signal alignment',
      isRequired: false,
      isCompleted: false,
      priority: 'medium',
      validationCriteria: [
        'RSI outside upper/lower bands',
        'MBL crossing signal line',
        'Momentum divergence noted',
        'Volatility band expansion'
      ]
    }
  ]

  // During-Trade Checklist Items
  const duringTradeChecklist: ChecklistItem[] = [
    {
      id: 'entry-execution',
      category: 'Execution',
      title: 'Entry Executed at Optimal Level',
      description: 'Trade entered at planned price with proper timing',
      isRequired: true,
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'stop-loss-set',
      category: 'Risk Management',
      title: 'Stop Loss Immediately Set',
      description: 'Protective stop loss order placed upon entry',
      isRequired: true,
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'position-monitoring',
      category: 'Management',
      title: 'Position Actively Monitored',
      description: 'Price action and key levels continuously watched',
      isRequired: true,
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'partial-profits',
      category: 'Management',
      title: 'Partial Profit Strategy',
      description: 'Consider taking partial profits at key resistance/support',
      isRequired: false,
      isCompleted: false,
      priority: 'medium'
    }
  ]

  // Post-Trade Checklist Items
  const postTradeChecklist: ChecklistItem[] = [
    {
      id: 'trade-journal',
      category: 'Documentation',
      title: 'Trade Documented in Journal',
      description: 'Complete trade analysis and screenshots captured',
      isRequired: true,
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'performance-review',
      category: 'Analysis',
      title: 'Performance Analysis',
      description: 'Review what worked and what could be improved',
      isRequired: true,
      isCompleted: false,
      priority: 'high'
    },
    {
      id: 'pattern-validation',
      category: 'Learning',
      title: 'Pattern Outcome Validation',
      description: 'Assess pattern performance and confluence effectiveness',
      isRequired: true,
      isCompleted: false,
      priority: 'medium'
    }
  ]

  useEffect(() => {
    // Initialize checklist based on selected tab
    let items: ChecklistItem[] = []
    switch (selectedTab) {
      case 'pre-trade':
        items = [...preTradeChecklist]
        break
      case 'during-trade':
        items = [...duringTradeChecklist]
        break
      case 'post-trade':
        items = [...postTradeChecklist]
        break
    }
    setChecklistItems(items)
  }, [selectedTab])

  useEffect(() => {
    // Calculate completion score
    const totalItems = checklistItems.length
    const completedItems = checklistItems.filter(item => item.isCompleted).length
    const requiredItems = checklistItems.filter(item => item.isRequired).length
    const completedRequiredItems = checklistItems.filter(item => item.isRequired && item.isCompleted).length
    
    const score = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    setCompletionScore(score)
    
    // Check if trade can be executed (all required items completed)
    setCanExecute(requiredItems > 0 && completedRequiredItems === requiredItems)
  }, [checklistItems])

  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    )
  }

  const resetChecklist = () => {
    setChecklistItems(prev => 
      prev.map(item => ({ ...item, isCompleted: false }))
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getCompletionColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            BTMM Execution Checklist Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              Systematic trade validation and execution workflow ensuring all BTMM criteria are met.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className={`text-2xl font-bold ${getCompletionColor(completionScore)}`}>
                  {completionScore}%
                </p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              <Progress value={completionScore} className="w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pre-trade">
            <Eye className="h-4 w-4 mr-2" />
            Pre-Trade
          </TabsTrigger>
          <TabsTrigger value="during-trade">
            <Play className="h-4 w-4 mr-2" />
            During Trade
          </TabsTrigger>
          <TabsTrigger value="post-trade">
            <BarChart3 className="h-4 w-4 mr-2" />
            Post-Trade
          </TabsTrigger>
        </TabsList>

        {/* Pre-Trade Checklist */}
        <TabsContent value="pre-trade" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pre-Trade Analysis & Setup</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetChecklist}
              >
                Reset All
              </Button>
              <Button 
                variant={canExecute ? "default" : "secondary"} 
                size="sm"
                disabled={!canExecute}
              >
                {canExecute ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Ready to Execute
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Complete Required Items
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {checklistItems.map((item) => (
              <Card key={item.id} className={`${item.isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={item.isCompleted}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {item.title}
                          </h4>
                          {item.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {getPriorityIcon(item.priority)}
                            <span className="ml-1 capitalize">{item.priority}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${item.isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {item.description}
                      </p>
                      
                      {item.validationCriteria && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Validation Criteria:</p>
                          <ul className="text-xs space-y-1">
                            {item.validationCriteria.map((criteria, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="h-1 w-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                <span className={item.isCompleted ? 'line-through text-muted-foreground' : ''}>
                                  {criteria}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {item.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {canExecute && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <h4 className="font-semibold">All Required Criteria Met</h4>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Your trade setup has passed all required validation checks. You may proceed with execution.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* During Trade Checklist */}
        <TabsContent value="during-trade" className="space-y-4">
          <h3 className="text-lg font-semibold">Trade Execution & Management</h3>
          
          <div className="space-y-4">
            {checklistItems.map((item) => (
              <Card key={item.id} className={`${item.isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={item.isCompleted}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {item.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {getPriorityIcon(item.priority)}
                            <span className="ml-1 capitalize">{item.priority}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${item.isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {item.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Post-Trade Checklist */}
        <TabsContent value="post-trade" className="space-y-4">
          <h3 className="text-lg font-semibold">Post-Trade Analysis & Learning</h3>
          
          <div className="space-y-4">
            {checklistItems.map((item) => (
              <Card key={item.id} className={`${item.isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={item.isCompleted}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {item.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {getPriorityIcon(item.priority)}
                            <span className="ml-1 capitalize">{item.priority}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${item.isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {item.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ExecutionChecklist