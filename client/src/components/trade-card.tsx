import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MoreVertical,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit3,
  Trash2,
  ImageIcon,
  BarChart3,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

type TradeStatus = 'live' | 'closed-profit' | 'closed-loss' | 'case-study'
type TradeType = 1 | 2 | 3 | 4

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

interface TradeCardProps {
  trade: Trade
  onView: (trade: Trade) => void
  onEdit: (trade: Trade) => void
  onDelete: (tradeId: string) => void
}

const tradeTypeColors: Record<TradeType, string> = {
  1: 'bg-trading-type1',
  2: 'bg-trading-type2', 
  3: 'bg-trading-type3',
  4: 'bg-trading-type4',
}

const statusColors: Record<TradeStatus, string> = {
  'live': 'bg-yellow-500',
  'closed-profit': 'bg-green-500',
  'closed-loss': 'bg-red-500',
  'case-study': 'bg-blue-500',
}

const statusLabels: Record<TradeStatus, string> = {
  'live': 'Live',
  'closed-profit': 'Closed +',
  'closed-loss': 'Closed -',
  'case-study': 'Study',
}

export function TradeCard({ trade, onView, onEdit, onDelete }: TradeCardProps) {
  const [imageError, setImageError] = useState(false)
  const primaryScreenshot = trade.screenshots[0]

  const handleAction = (action: () => void, event?: React.MouseEvent) => {
    event?.stopPropagation()
    console.log(`Action triggered for trade ${trade.id}`)
    action()
  }

  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all duration-200 group"
      onClick={() => onView(trade)}
      data-testid={`trade-card-${trade.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${tradeTypeColors[trade.tradeType]}`} />
              {trade.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="text-xs"
                data-testid={`badge-pair-${trade.pair}`}
              >
                {trade.pair}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs text-white ${statusColors[trade.status]}`}
                data-testid={`badge-status-${trade.status}`}
              >
                {statusLabels[trade.status]}
              </Badge>
              {trade.pnl !== undefined && (
                <Badge 
                  variant={trade.pnl >= 0 ? "default" : "destructive"}
                  className="text-xs"
                  data-testid={`badge-pnl-${trade.pnl >= 0 ? 'profit' : 'loss'}`}
                >
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl}%
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity hover-elevate"
                onClick={(e) => e.stopPropagation()}
                data-testid={`button-menu-${trade.id}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => handleAction(() => onView(trade), e)}
                data-testid={`menu-view-${trade.id}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => handleAction(() => onEdit(trade), e)}
                data-testid={`menu-edit-${trade.id}`}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Trade
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => handleAction(() => onDelete(trade.id), e)}
                data-testid={`menu-delete-${trade.id}`}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Screenshot Preview */}
        <div className="mb-4 rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
          {primaryScreenshot && !imageError ? (
            <img
              src={primaryScreenshot.url}
              alt={`${trade.title} screenshot`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              data-testid={`img-screenshot-${trade.id}`}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm">No screenshot</span>
            </div>
          )}
        </div>

        {/* Trade Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(trade.date, 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {trade.timeframe}
            </div>
          </div>

          {trade.entry && trade.exit && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Entry: {trade.entry}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span>Exit: {trade.exit}</span>
              </div>
            </div>
          )}

          {/* Confluences */}
          {trade.confluences.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Confluences:</p>
              <div className="flex flex-wrap gap-1">
                {trade.confluences.slice(0, 3).map((confluence, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {confluence}
                  </Badge>
                ))}
                {trade.confluences.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{trade.confluences.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Screenshots count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart3 className="h-3 w-3" />
              {trade.screenshots.length} screenshot{trade.screenshots.length !== 1 ? 's' : ''}
            </div>
            {trade.session && (
              <Badge variant="secondary" className="text-xs">
                {trade.session}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}