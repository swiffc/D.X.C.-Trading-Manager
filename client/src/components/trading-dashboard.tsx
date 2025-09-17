import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TradeCard } from './trade-card'

type TradeStatus = 'live' | 'closed-profit' | 'closed-loss' | 'case-study'
type TradeType = 1 | 2 | 3 | 4
type ViewMode = 'grid' | 'list'
type SortBy = 'date' | 'pnl' | 'pair' | 'type'

interface Trade {
  id: string
  title: string
  pair: string
  tradeType: TradeType
  status: TradeStatus
  entry?: number
  exit?: number
  pnl?: number
  date: Date
  timeframe: string
  screenshots: { id: string; url: string; timeframe: string }[]
  confluences: string[]
  notes: string
  session?: string
}

interface TradingDashboardProps {
  activeSection: 'live-trades' | 'case-studies'
  selectedTradeType: number | null
  onNewTrade: () => void
}

// Mock data for demonstration
const mockTrades: Trade[] = [
  {
    id: '1',
    title: 'EURUSD M/W Pattern',
    pair: 'EURUSD',
    tradeType: 1,
    status: 'closed-profit',
    entry: 1.0850,
    exit: 1.0920,
    pnl: 2.4,
    date: new Date('2024-01-15'),
    timeframe: 'H1',
    screenshots: [
      { id: '1', url: '/api/placeholder/chart1.jpg', timeframe: 'H4' },
      { id: '2', url: '/api/placeholder/chart2.jpg', timeframe: 'H1' },
    ],
    confluences: ['13 EMA Respect', 'Asian High Sweep', 'London Session'],
    notes: 'Perfect Type 1 setup with clean M pattern formation',
    session: 'London'
  },
  {
    id: '2',
    title: 'GBPJPY Range Break',
    pair: 'GBPJPY',
    tradeType: 3,
    status: 'live',
    entry: 189.45,
    date: new Date('2024-01-16'),
    timeframe: 'H4',
    screenshots: [
      { id: '3', url: '/api/placeholder/chart3.jpg', timeframe: 'H4' },
      { id: '4', url: '/api/placeholder/chart4.jpg', timeframe: 'H1' },
    ],
    confluences: ['50 EMA Bounce', 'PDH Break', 'New York Open'],
    notes: 'Type 3 breakout setup with volume confirmation',
    session: 'New York'
  },
  {
    id: '3',
    title: 'USDJPY Reversal Study',
    pair: 'USDJPY',
    tradeType: 2,
    status: 'case-study',
    entry: 147.20,
    exit: 146.85,
    pnl: -0.8,
    date: new Date('2024-01-14'),
    timeframe: 'M30',
    screenshots: [
      { id: '5', url: '/api/placeholder/chart5.jpg', timeframe: 'D1' },
      { id: '6', url: '/api/placeholder/chart6.jpg', timeframe: 'H4' },
    ],
    confluences: ['Railroad Tracks', 'PDL Test', 'Asian Session'],
    notes: 'Failed reversal - need better confirmation signals',
    session: 'Asian'
  },
  {
    id: '4',
    title: 'AUDUSD Momentum',
    pair: 'AUDUSD',
    tradeType: 4,
    status: 'closed-loss',
    entry: 0.6720,
    exit: 0.6695,
    pnl: -1.2,
    date: new Date('2024-01-13'),
    timeframe: 'H1',
    screenshots: [
      { id: '7', url: '/api/placeholder/chart7.jpg', timeframe: 'H4' },
    ],
    confluences: ['Multi-TF Align', 'Brinks Timing'],
    notes: 'Type 4 momentum play - stopped out on pullback',
    session: 'London'
  }
]

export function TradingDashboard({
  activeSection,
  selectedTradeType,
  onNewTrade,
}: TradingDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [statusFilter, setStatusFilter] = useState<TradeStatus | 'all'>('all')
  const [pairFilter, setPairFilter] = useState<string>('all')

  // Filter trades based on active section
  const sectionTrades = mockTrades.filter(trade => {
    if (activeSection === 'live-trades') {
      return trade.status === 'live' || trade.status === 'closed-profit' || trade.status === 'closed-loss'
    } else {
      return trade.status === 'case-study'
    }
  })

  // Apply filters
  const filteredTrades = sectionTrades.filter(trade => {
    const matchesSearch = trade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.pair.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTradeType ? trade.tradeType === selectedTradeType : true
    const matchesStatus = statusFilter === 'all' ? true : trade.status === statusFilter
    const matchesPair = pairFilter === 'all' ? true : trade.pair === pairFilter
    
    return matchesSearch && matchesType && matchesStatus && matchesPair
  })

  // Sort trades
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.date.getTime() - a.date.getTime()
      case 'pnl':
        return (b.pnl || 0) - (a.pnl || 0)
      case 'pair':
        return a.pair.localeCompare(b.pair)
      case 'type':
        return a.tradeType - b.tradeType
      default:
        return 0
    }
  })

  // Get unique pairs for filter
  const availablePairs = Array.from(new Set(sectionTrades.map(trade => trade.pair))).sort()

  // Calculate summary stats
  const stats = {
    total: filteredTrades.length,
    live: filteredTrades.filter(t => t.status === 'live').length,
    winners: filteredTrades.filter(t => t.pnl && t.pnl > 0).length,
    losers: filteredTrades.filter(t => t.pnl && t.pnl < 0).length,
    totalPnl: filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0),
  }

  const handleTradeAction = (action: string, trade?: Trade) => {
    console.log(`${action} action:`, trade?.id || 'new')
    // These will be implemented with actual functionality
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="dashboard-title">
            {activeSection === 'live-trades' ? 'Live Trades' : 'Case Studies'}
          </h1>
          <p className="text-muted-foreground">
            {activeSection === 'live-trades' 
              ? 'Active and completed trading positions'
              : 'Educational trade analysis and studies'
            }
          </p>
        </div>
        <Button 
          onClick={onNewTrade}
          className="gap-2"
          data-testid="button-new-trade"
        >
          <Plus className="h-4 w-4" />
          New {activeSection === 'live-trades' ? 'Trade' : 'Study'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold" data-testid="stat-total">{stats.total}</p>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {activeSection === 'live-trades' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Live</p>
                  <p className="text-2xl font-bold text-yellow-500" data-testid="stat-live">{stats.live}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Winners</p>
                <p className="text-2xl font-bold text-green-500" data-testid="stat-winners">{stats.winners}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Losers</p>
                <p className="text-2xl font-bold text-red-500" data-testid="stat-losers">{stats.losers}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
                }`} data-testid="stat-pnl">
                  {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className={`h-4 w-4 ${
                stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades by title or pair..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TradeStatus | 'all')}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {activeSection === 'live-trades' ? (
                    <>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="closed-profit">Closed +</SelectItem>
                      <SelectItem value="closed-loss">Closed -</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="case-study">Studies</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Select value={pairFilter} onValueChange={setPairFilter}>
                <SelectTrigger className="w-32" data-testid="select-pair-filter">
                  <SelectValue placeholder="Pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  {availablePairs.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger className="w-32" data-testid="select-sort">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="pnl">P&L</SelectItem>
                  <SelectItem value="pair">Pair</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                  data-testid="button-grid-view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Type Filter Indicator */}
      {selectedTradeType && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <div className={`h-2 w-2 rounded-full bg-trading-type${selectedTradeType}`} />
            Filtering: Type {selectedTradeType}
          </Badge>
        </div>
      )}

      {/* Trades Grid/List */}
      <div className="flex-1 overflow-auto">
        {sortedTrades.length === 0 ? (
          <Card className="h-48">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground" data-testid="empty-state">
                  {searchTerm || statusFilter !== 'all' || pairFilter !== 'all' || selectedTradeType
                    ? 'No trades match your filters'
                    : `No ${activeSection === 'live-trades' ? 'trades' : 'studies'} yet`
                  }
                </p>
                <Button variant="outline" onClick={onNewTrade}>
                  Create your first {activeSection === 'live-trades' ? 'trade' : 'study'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {sortedTrades.map(trade => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onView={(trade) => handleTradeAction('view', trade)}
                onEdit={(trade) => handleTradeAction('edit', trade)}
                onDelete={(tradeId) => handleTradeAction('delete', { id: tradeId } as Trade)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}