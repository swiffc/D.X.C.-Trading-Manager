import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfluenceSelector } from './confluence-selector'
import { ScreenshotUpload } from './screenshot-upload'
import { useToast } from '@/hooks/use-toast'
import { apiRequest } from '@/lib/queryClient'
import { Save, X, Loader2 } from 'lucide-react'

// Form validation schema  
const tradeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  pair: z.string().min(1, 'Currency pair is required'),
  tradeType: z.coerce.number().int().min(1).max(4, 'Invalid trade type'),
  status: z.enum(['live', 'closed-profit', 'closed-loss', 'case-study']),
  entry: z.string().optional(),
  exit: z.string().optional(),
  pnl: z.string().optional(),
  timeframe: z.string().min(1, 'Timeframe is required'),
  session: z.string().optional(),
  notes: z.string().default(''),
  // Bias-first fields for BTMM methodology
  biasLevel: z.coerce.number().int().min(1).max(3).optional(),
  emaCrossovers: z.array(z.string()).default([]),
  adr5: z.string().optional(),
  todayRange: z.string().optional(),
})

type TradeFormData = z.infer<typeof tradeFormSchema>

type Screenshot = {
  id: string
  file: File | null
  url: string
  timeframe: string
  name: string
  order: number
}

interface TradeFormProps {
  open: boolean
  onClose: () => void
  mode: 'live-trades' | 'case-studies'
  defaultTradeType?: number | null
}

const currencyPairs = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
  'EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'EURAUD', 'GBPAUD', 'XAUUSD'
]

const timeframes = [
  { value: 'MN1', label: 'Monthly' },
  { value: 'W1', label: 'Weekly' },
  { value: 'D1', label: 'Daily' },
  { value: 'H4', label: '4 Hour' },
  { value: 'H1', label: '1 Hour' },
  { value: 'M30', label: '30 Min' },
  { value: 'M15', label: '15 Min' },
  { value: 'M5', label: '5 Min' },
  { value: 'M1', label: '1 Min' },
]

const sessions = ['Asian', 'London', 'New York', 'Pacific']

const tradeTypeLabels = {
  1: 'Type 1: M/W Patterns above/below Asian session (Safety Trade)',
  2: 'Type 2: Asian 00 bounce and reverse trades',
  3: 'Type 3: Asian 50 Bounce and reverse trades',
  4: 'Type 4: Breakout, bounce off Asian 00 then continuation trades',
}

const emaCrossoverLabels = {
  '5/13': '5/13 EMA cross',
  '13/50': '13/50 EMA cross',
  '50/200': '50/200 EMA cross', 
  '200/800': '200/800 EMA cross',
  '50/800': '50/800 EMA cross',
}

// Enhanced automated note generation using BTMM bias-first methodology
function generateEnhancedNotes(
  confluences: string[], 
  tradeType: number,
  biasLevel?: number,
  emaCrossovers?: string[],
  adr5?: string,
  todayRange?: string
): string {
  let notes = ''
  
  // Bias-first section (market context)
  if (biasLevel || emaCrossovers?.length || adr5 || todayRange) {
    notes += '📊 BIAS-FIRST ANALYSIS:\n'
    
    if (biasLevel) {
      notes += `Bias Level: ${biasLevel} | `
    }
    
    if (emaCrossovers?.length) {
      const crossoverText = emaCrossovers.map(cross => emaCrossoverLabels[cross as keyof typeof emaCrossoverLabels] || cross).join(', ')
      notes += `EMA: ${crossoverText} | `
    }
    
    if (adr5) {
      notes += `ADR5: ${adr5} | `
    }
    
    if (todayRange && adr5) {
      const rangeRatio = (parseFloat(todayRange) / parseFloat(adr5)).toFixed(2)
      notes += `Range: ${todayRange} (${rangeRatio}x ADR)`
    } else if (todayRange) {
      notes += `Today's Range: ${todayRange}`
    }
    
    notes += '\n\n'
  }
  
  // Pattern-specific setup description
  const typeLabel = tradeTypeLabels[tradeType as keyof typeof tradeTypeLabels]
  notes += `🎯 SETUP: ${typeLabel}\n\n`
  
  // Confluences with pattern context
  if (confluences.length > 0) {
    notes += `✅ CONFLUENCES (${confluences.length}):\n`
    
    confluences.forEach(confluence => {
      // Transform confluence IDs to readable labels
      let label = confluence
      if (confluence.includes('railroad-tracks')) {
        label = '🚂 Railroad Tracks at apex'
      } else if (confluence.includes('morning-star') || confluence.includes('morning-evening-star')) {
        label = '⭐ Morning/Evening Star confirmation'
      } else if (confluence.includes('13-ema-respect')) {
        label = '📈 13 EMA Full Respect - both legs'
      } else if (confluence.includes('stop-hunt-asian')) {
        label = '🎣 Stop hunt above Asian range'
      } else if (confluence.includes('adr-completion')) {
        label = '🎯 Targeting ADR completion'
      } else if (confluence.includes('50-ema-bounce')) {
        label = '📊 50 EMA bounce setup'
      } else if (confluence.includes('asian-00-bounce')) {
        label = '🌏 Asian 00 boundary bounce'
      } else if (confluence.includes('brinks-timing')) {
        label = '⏰ Brinks timing alignment'
      } else {
        // Clean up the ID format
        label = confluence.replace(/-/g, ' ').replace(/type\d+\s+/g, '').replace(/^\w/, c => c.toUpperCase())
      }
      
      notes += `  • ${label}\n`
    })
    notes += '\n'
  }
  
  // Template sections
  notes += '📋 EXECUTION PLAN:\n'
  notes += '  Entry: [Price level and trigger]\n'
  notes += '  Stop Loss: [Risk management level]\n'
  notes += '  Target: [Profit objective]\n'
  notes += '  Risk/Reward: [R:R ratio]\n\n'
  
  notes += '🔍 MARKET CONDITIONS:\n'
  notes += '  Session: [Active trading session]\n'
  notes += '  Volatility: [Market environment]\n'
  notes += '  Structure: [Higher timeframe context]\n\n'
  
  notes += '💡 KEY OBSERVATIONS:\n'
  notes += '  [What gave conviction for this trade?]\n'
  notes += '  [Any additional confluence factors?]\n'
  notes += '  [Session timing relevance?]'
  
  return notes
}

export function TradeForm({ open, onClose, mode, defaultTradeType = null }: TradeFormProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState('details')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      title: '',
      pair: '',
      tradeType: defaultTradeType || 1,
      status: mode === 'case-studies' ? 'case-study' : 'live',
      entry: '',
      exit: '',
      pnl: '',
      timeframe: 'H1',
      session: '',
      notes: '',
      biasLevel: undefined,
      emaCrossovers: [],
      adr5: '',
      todayRange: '',
    },
  })

  const watchedTradeType = form.watch('tradeType')
  const watchedBiasLevel = form.watch('biasLevel')
  const watchedEmaCrossovers = form.watch('emaCrossovers')
  const watchedAdr5 = form.watch('adr5')
  const watchedTodayRange = form.watch('todayRange')
  
  // Auto-generate notes with enhanced BTMM methodology
  const autoGeneratedNotes = useMemo(() => {
    return generateEnhancedNotes(
      selectedConfluences, 
      watchedTradeType,
      watchedBiasLevel,
      watchedEmaCrossovers,
      watchedAdr5,
      watchedTodayRange
    )
  }, [selectedConfluences, watchedTradeType, watchedBiasLevel, watchedEmaCrossovers, watchedAdr5, watchedTodayRange])

  const createTradeMutation = useMutation({
    mutationFn: async (data: TradeFormData & { 
      confluences: string[]
      screenshots: Screenshot[]
    }) => {
      // First create the trade
      const tradeResponse = await apiRequest('POST', '/api/trades', {
        ...data,
        userId: 'user-1', // TODO: Get from auth context
        entry: data.entry ? parseFloat(data.entry) : undefined,
        exit: data.exit ? parseFloat(data.exit) : undefined,
        pnl: data.pnl ? parseFloat(data.pnl) : undefined,
      })
      
      const trade = await tradeResponse.json()
      
      // Then upload screenshots if any
      if (data.screenshots.length > 0) {
        const formData = new FormData()
        
        data.screenshots.forEach((screenshot, index) => {
          if (screenshot.file) {
            formData.append('files', screenshot.file)
            formData.append(`names[${index}]`, screenshot.name)
            formData.append(`timeframes[${index}]`, screenshot.timeframe)
            formData.append(`orders[${index}]`, index.toString())
          }
        })
        
        formData.append('tradeId', trade.id)
        
        // For file uploads, we need to use fetch directly since apiRequest expects JSON
        const uploadResponse = await fetch(`/api/trades/${trade.id}/screenshots`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload screenshots')
        }
      }
      
      return trade
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `${mode === 'case-studies' ? 'Case study' : 'Trade'} created successfully`,
      })
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] })
      handleClose()
    },
    onError: (error) => {
      console.error('Error creating trade:', error)
      toast({
        title: 'Error',
        description: 'Failed to create trade. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: TradeFormData) => {
    createTradeMutation.mutate({
      ...data,
      confluences: selectedConfluences,
      screenshots,
    })
  }

  const handleClose = () => {
    form.reset()
    setScreenshots([])
    setSelectedConfluences([])
    setCurrentTab('details')
    onClose()
  }

  const handleNotesChange = (notes: string) => {
    form.setValue('notes', notes)
  }

  const canProceedToNext = (tab: string) => {
    switch (tab) {
      case 'details':
        const { title, pair, tradeType, timeframe } = form.getValues()
        return title && pair && tradeType && timeframe
      case 'screenshots':
        return true // Screenshots are optional
      case 'confluences':
        return true // Can submit without confluences
      default:
        return true
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Create New {mode === 'case-studies' ? 'Case Study' : 'Trade'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'case-studies' 
              ? 'Document a trade setup for educational analysis and future reference.'
              : 'Record a live trading position with screenshots and confluence analysis.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details" data-testid="tab-details">
                  Details
                  {canProceedToNext('details') && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">✓</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="screenshots" data-testid="tab-screenshots">
                  Screenshots
                  {screenshots.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">{screenshots.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="confluences" data-testid="tab-confluences">
                  Analysis
                  {selectedConfluences.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">{selectedConfluences.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., EURUSD M/W Pattern"
                              {...field}
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pair"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency Pair *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-pair">
                                <SelectValue placeholder="Select pair" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencyPairs.map(pair => (
                                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tradeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade Type *</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-trade-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(tradeTypeLabels).map(([type, label]) => (
                                <SelectItem key={type} value={type}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Timeframe *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-timeframe">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeframes.map(tf => (
                                <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bias-First Analysis Fields */}
                  <div className="border-t pt-4 mt-6">
                    <h3 className="text-sm font-medium text-foreground mb-4">📊 Bias-First Analysis</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="biasLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bias Level (1-3)</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                              value={field.value?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-bias-level">
                                  <SelectValue placeholder="Select bias strength" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Level 1 - Weak Bias</SelectItem>
                                <SelectItem value="2">Level 2 - Moderate Bias</SelectItem>
                                <SelectItem value="3">Level 3 - Strong Bias</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Market bias strength assessment</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="session"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trading Session</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-session">
                                  <SelectValue placeholder="Select session" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sessions.map(session => (
                                  <SelectItem key={session} value={session}>{session}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="emaCrossovers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EMA Crossovers</FormLabel>
                            <FormDescription>Select active EMA crossovers observed</FormDescription>
                            <div className="grid grid-cols-5 gap-2 mt-2">
                              {Object.entries(emaCrossoverLabels).map(([key, label]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`ema-${key}`}
                                    checked={field.value?.includes(key) || false}
                                    onChange={(e) => {
                                      const current = field.value || []
                                      if (e.target.checked) {
                                        field.onChange([...current, key])
                                      } else {
                                        field.onChange(current.filter(item => item !== key))
                                      }
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    data-testid={`checkbox-ema-${key}`}
                                  />
                                  <label htmlFor={`ema-${key}`} className="text-xs cursor-pointer">
                                    {key}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="adr5"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ADR5 (5-Day Average)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="90.5"
                                  {...field}
                                  data-testid="input-adr5"
                                />
                              </FormControl>
                              <FormDescription>Average daily range in pips</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="todayRange"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Today's Range</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="135.0"
                                  {...field}
                                  data-testid="input-today-range"
                                />
                              </FormControl>
                              <FormDescription>Current range in pips</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {mode === 'live-trades' && (
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="entry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.00001"
                                placeholder="1.0850"
                                {...field}
                                data-testid="input-entry"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="exit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exit Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.00001"
                                placeholder="1.0920"
                                {...field}
                                data-testid="input-exit"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pnl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>P&L (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="2.4"
                                {...field}
                                data-testid="input-pnl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="session"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading Session</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-session">
                              <SelectValue placeholder="Select session" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sessions.map(session => (
                              <SelectItem key={session} value={session}>{session}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="screenshots" className="mt-4">
                  <ScreenshotUpload
                    screenshots={screenshots}
                    onScreenshotsChange={setScreenshots}
                    maxFiles={8}
                  />
                </TabsContent>

                <TabsContent value="confluences" className="mt-4">
                  <ConfluenceSelector
                    selectedConfluences={selectedConfluences}
                    onConfluenceChange={setSelectedConfluences}
                    autoGeneratedNotes={autoGeneratedNotes}
                    onNotesChange={handleNotesChange}
                  />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div className="flex items-center gap-2">
                {currentTab !== 'details' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (currentTab === 'screenshots') setCurrentTab('details')
                      if (currentTab === 'confluences') setCurrentTab('screenshots')
                    }}
                    data-testid="button-previous"
                  >
                    Previous
                  </Button>
                )}
                
                {currentTab !== 'confluences' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (currentTab === 'details' && canProceedToNext('details')) {
                        setCurrentTab('screenshots')
                      } else if (currentTab === 'screenshots') {
                        setCurrentTab('confluences')
                      }
                    }}
                    disabled={!canProceedToNext(currentTab)}
                    data-testid="button-next"
                  >
                    Next
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  data-testid="button-cancel"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={createTradeMutation.isPending || !canProceedToNext('details')}
                  data-testid="button-save"
                >
                  {createTradeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {createTradeMutation.isPending ? 'Creating...' : `Create ${mode === 'case-studies' ? 'Study' : 'Trade'}`}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}