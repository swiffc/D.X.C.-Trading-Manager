import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Clock, TrendingUp, BarChart3, Calendar, Target, Zap, Shield, TrendingDown, ArrowUp, Settings } from 'lucide-react'

type ConfluenceCategory = {
  id: string
  name: string
  icon: React.ElementType
  options: { id: string; label: string; description: string }[]
}

type TradeType = 1 | 2 | 3 | 4

// Type 1: M/W Patterns above/below Asian session (Safety Trade)
const type1Confluences: ConfluenceCategory[] = [
  {
    id: 'type1-ema',
    name: '13 EMA Rules',
    icon: TrendingUp,
    options: [
      { id: 'type1-13-ema-respect', label: '13 EMA Full Respect', description: 'Both legs strictly respect 13 EMA' },
      { id: 'type1-13-ema-tap', label: '13 EMA Tap', description: 'First leg taps but does not break 13 EMA' },
      { id: 'type1-no-touch-13', label: 'No Touch 13 EMA', description: 'Leg remains above/below 13 EMA entirely' },
    ]
  },
  {
    id: 'type1-timing',
    name: 'Session Timing',
    icon: Clock,
    options: [
      { id: 'type1-asian-hod-lod', label: 'Asian HOD/LOD', description: 'At session High/Low of Day' },
      { id: 'type1-brinks-timing', label: 'Brinks Timing', description: '9:45 PM, 3:45 AM, 9:45 AM EST' },
      { id: 'type1-london-session', label: 'London Session', description: '3:30 AM - 5:30 AM EST' },
      { id: 'type1-ny-session', label: 'NY Session', description: '9:30 AM - 11:00 AM EST' },
    ]
  },
  {
    id: 'type1-patterns',
    name: 'Rejection Patterns',
    icon: BarChart3,
    options: [
      { id: 'type1-railroad-tracks', label: 'Railroad Tracks', description: 'Strong reversal pattern at apex' },
      { id: 'type1-morning-star', label: 'Morning/Evening Star', description: 'Three-candle reversal confirmation' },
      { id: 'type1-cord-of-wood', label: 'Cord of Wood (COW)', description: 'Multiple rejection candles' },
    ]
  },
  {
    id: 'type1-levels',
    name: 'Key Levels',
    icon: Target,
    options: [
      { id: 'type1-stop-hunt-asian', label: 'Stop Hunt Above Asian Range', description: 'Liquidity sweep before reversal' },
      { id: 'type1-pdh-pdl', label: 'PDH/PDL Target', description: 'Previous day high/low interaction' },
      { id: 'type1-adr-completion', label: 'ADR Completion', description: 'Average daily range boundaries' },
    ]
  }
]

// Type 2: Asian 00 bounce and reverse trades  
const type2Confluences: ConfluenceCategory[] = [
  {
    id: 'type2-asian',
    name: 'Asian Range',
    icon: Shield,
    options: [
      { id: 'type2-asian-00-bounce', label: 'Asian 00 Bounce', description: 'Bounce off Asian range boundary' },
      { id: 'type2-asian-50-level', label: 'Asian 50% Level', description: 'Mid-level of Asian session range' },
      { id: 'type2-symmetrical-legs', label: 'Symmetrical Legs', description: 'M/W pattern with equal leg lengths' },
      { id: 'type2-extended-leg', label: 'Extended Second Leg', description: 'Second leg extends further than first' },
    ]
  },
  {
    id: 'type2-ema-bounce',
    name: 'EMA Interactions',
    icon: TrendingUp,
    options: [
      { id: 'type2-key-ema-levels', label: 'Key EMA Levels', description: 'Pattern at 13, 50, or 200 EMA' },
      { id: 'type2-ema-close-above', label: 'EMA Close Above/Below', description: 'Second leg closes above/below EMA' },
    ]
  },
  {
    id: 'type2-patterns',
    name: 'Apex Patterns',
    icon: BarChart3,
    options: [
      { id: 'type2-railroad-tracks', label: 'Railroad Tracks', description: 'Reversal pattern at apex formation' },
      { id: 'type2-morning-evening-star', label: 'Morning/Evening Star', description: 'Three-candle apex confirmation' },
    ]
  },
  {
    id: 'type2-timing',
    name: 'Session Alignment',
    icon: Clock,
    options: [
      { id: 'type2-london-session', label: 'London Session', description: '3:30 AM to 5:30 AM EST' },
      { id: 'type2-ny-session', label: 'NY Session', description: '9:30 AM to 11:00 AM EST' },
      { id: 'type2-brinks-timing', label: 'Brinks Timing', description: '9:45 PM, 3:45 AM, 9:45 AM EST' },
    ]
  }
]

// Type 3: Asian 50 Bounce and reverse trades
const type3Confluences: ConfluenceCategory[] = [
  {
    id: 'type3-ema-bounce',
    name: '50 EMA Interactions',
    icon: TrendingDown,
    options: [
      { id: 'type3-50-ema-bounce', label: '50 EMA Bounce', description: 'Pullback to 50 EMA after trend' },
      { id: 'type3-50-ema-rejection', label: '50 EMA Rejection', description: 'Candlestick rejection at 50 EMA' },
    ]
  },
  {
    id: 'type3-asian-range',
    name: 'Asian Range Bounce',
    icon: Shield,
    options: [
      { id: 'type3-asian-50-percent', label: 'Asian 50% Bounce', description: '50% level of Asian session range' },
      { id: 'type3-asian-high-low', label: 'Asian High/Low Bounce', description: 'Bounce off Asian range boundary' },
    ]
  },
  {
    id: 'type3-adr-levels',
    name: 'ADR & Key Levels',
    icon: Target,
    options: [
      { id: 'type3-adr-rejection', label: 'ADR Level Rejection', description: 'Rejection at ADR high/low' },
      { id: 'type3-pdh-pdl-rejection', label: 'PDH/PDL Rejection', description: 'Previous day level rejection' },
      { id: 'type3-yh-yl-rejection', label: 'YH/YL Rejection', description: 'Yearly high/low rejection' },
    ]
  },
  {
    id: 'type3-patterns',
    name: 'Rejection Patterns',
    icon: BarChart3,
    options: [
      { id: 'type3-railroad-tracks', label: 'Railroad Tracks', description: 'Rejection pattern confirmation' },
      { id: 'type3-pin-bar', label: 'Pin Bar', description: 'Pin bar rejection at key level' },
      { id: 'type3-morning-evening-star', label: 'Morning/Evening Star', description: 'Star pattern confirmation' },
    ]
  }
]

// Type 4: Breakout, bounce off Asian 00 then continuation trades
const type4Confluences: ConfluenceCategory[] = [
  {
    id: 'type4-breakout',
    name: 'Breakout Patterns',
    icon: ArrowUp,
    options: [
      { id: 'type4-50-ema-continuation', label: '50 EMA Continuation', description: 'Retracement to 50 EMA after breakout' },
      { id: 'type4-breakout-pullback', label: 'Breakout Pullback', description: 'Retest of breakout level' },
      { id: 'type4-200-ema-trend', label: '200 EMA Trend Continuation', description: 'Long-term trend continuation' },
    ]
  },
  {
    id: 'type4-levels',
    name: 'Breakout Levels',
    icon: Target,
    options: [
      { id: 'type4-pdh-pdl-break', label: 'PDH/PDL Breakout', description: 'Breaking previous day high/low' },
      { id: 'type4-adr-boundary', label: 'ADR Boundary Break', description: 'Breaking ADR high/low' },
      { id: 'type4-asian-high-low', label: 'Asian High/Low Break', description: 'Breaking Asian session extremes' },
    ]
  },
  {
    id: 'type4-confirmation',
    name: 'Continuation Patterns',
    icon: Zap,
    options: [
      { id: 'type4-rejection-pattern', label: 'Rejection Pattern', description: 'Candlestick confirmation at retracement' },
      { id: 'type4-liquidity-sweep', label: 'Liquidity Sweep', description: 'Clearing liquidity before continuation' },
    ]
  },
  {
    id: 'type4-timing',
    name: 'Breakout Timing',
    icon: Clock,
    options: [
      { id: 'type4-london-breakout', label: 'London Breakout', description: '3:30 AM to 5:30 AM EST' },
      { id: 'type4-ny-continuation', label: 'NY Continuation', description: '9:30 AM to 11:00 AM EST' },
      { id: 'type4-brinks-timing', label: 'Brinks Timing', description: '9:45 PM, 3:45 AM, 9:45 AM EST' },
    ]
  }
]

// Pattern-specific confluence getter
const getConfluencesByType = (tradeType: TradeType): ConfluenceCategory[] => {
  switch (tradeType) {
    case 1:
      return type1Confluences
    case 2:
      return type2Confluences
    case 3:
      return type3Confluences
    case 4:
      return type4Confluences
    default:
      return type1Confluences
  }
}

interface ConfluenceSelectorProps {
  selectedConfluences: string[]
  onConfluenceChange: (confluences: string[]) => void
  autoGeneratedNotes: string
  onNotesChange: (notes: string) => void
  tradeType: TradeType
}

export function ConfluenceSelector({ 
  selectedConfluences, 
  onConfluenceChange, 
  autoGeneratedNotes,
  onNotesChange,
  tradeType 
}: ConfluenceSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  
  // Get pattern-specific confluences
  const confluenceCategories = getConfluencesByType(tradeType)

  const handleConfluenceToggle = (confluenceId: string) => {
    const newConfluences = selectedConfluences.includes(confluenceId)
      ? selectedConfluences.filter(id => id !== confluenceId)
      : [...selectedConfluences, confluenceId]
    
    onConfluenceChange(newConfluences)
    console.log('Confluence selection changed:', confluenceId)
  }

  const getConfluenceLabel = (confluenceId: string) => {
    for (const category of confluenceCategories) {
      const option = category.options.find(opt => opt.id === confluenceId)
      if (option) return option.label
    }
    return confluenceId
  }

  return (
    <div className="space-y-4">
      {/* Selected Confluences Summary */}
      {selectedConfluences.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Selected Confluences</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedConfluences.map(confluenceId => (
                <Badge 
                  key={confluenceId} 
                  variant="default" 
                  className="text-xs"
                  data-testid={`selected-confluence-${confluenceId}`}
                >
                  {getConfluenceLabel(confluenceId)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confluence Categories */}
      <div className="space-y-3">
        {confluenceCategories.map(category => {
          const categorySelections = selectedConfluences.filter(id => 
            category.options.some(opt => opt.id === id)
          )
          
          return (
            <Card key={category.id} className="">
              <CardHeader 
                className="pb-3 cursor-pointer hover-elevate" 
                onClick={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
                data-testid={`category-header-${category.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                    {categorySelections.length > 0 && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {categorySelections.length}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedCategory === category.id && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {category.options.map(option => (
                      <div key={option.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={selectedConfluences.includes(option.id)}
                          onCheckedChange={() => handleConfluenceToggle(option.id)}
                          data-testid={`checkbox-${option.id}`}
                        />
                        <div className="flex-1 space-y-1">
                          <label 
                            htmlFor={option.id}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {option.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Auto-generated Notes */}
      {autoGeneratedNotes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Generated Analysis Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={autoGeneratedNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Analysis notes will be generated based on selected confluences..."
              className="min-h-24 resize-none"
              data-testid="textarea-notes"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Notes are automatically generated based on your confluence selections and can be edited.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}