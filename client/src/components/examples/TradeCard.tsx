import { TradeCard } from '../trade-card'

const mockTrade = {
  id: '1',
  title: 'EURUSD M/W Pattern',
  pair: 'EURUSD',
  tradeType: 1 as const,
  status: 'closed-profit' as const,
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
}

export default function TradeCardExample() {
  return (
    <div className="max-w-sm">
      <TradeCard
        trade={mockTrade}
        onView={(trade) => console.log('View trade:', trade.id)}
        onEdit={(trade) => console.log('Edit trade:', trade.id)}
        onDelete={(tradeId) => console.log('Delete trade:', tradeId)}
      />
    </div>
  )
}