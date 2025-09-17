import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, DollarSign, TrendingUp, Shield, AlertTriangle } from 'lucide-react'

interface RiskCalculation {
  accountSize: number
  riskPercentage: number
  entryPrice: number
  stopLoss: number
  takeProfit: number
  positionSize: number
  riskAmount: number
  rewardAmount: number
  riskRewardRatio: number
  pipValue: number
  pipsRisk: number
  pipsReward: number
}

const RiskCalculator = () => {
  const [calculation, setCalculation] = useState<RiskCalculation>({
    accountSize: 10000,
    riskPercentage: 2,
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    positionSize: 0,
    riskAmount: 0,
    rewardAmount: 0,
    riskRewardRatio: 0,
    pipValue: 10, // Default for standard lot
    pipsRisk: 0,
    pipsReward: 0
  })

  const [pair, setPair] = useState('EURUSD')

  // Calculate position size and risk metrics
  useEffect(() => {
    const { accountSize, riskPercentage, entryPrice, stopLoss, takeProfit, pipValue } = calculation
    
    if (entryPrice > 0 && stopLoss > 0) {
      const riskAmount = (accountSize * riskPercentage) / 100
      const pipsRisk = Math.abs(entryPrice - stopLoss) * 10000 // Convert to pips
      const positionSize = riskAmount / (pipsRisk * pipValue / 10000)
      
      let pipsReward = 0
      let rewardAmount = 0
      let riskRewardRatio = 0
      
      if (takeProfit > 0) {
        pipsReward = Math.abs(takeProfit - entryPrice) * 10000
        rewardAmount = (pipsReward * pipValue * positionSize) / 10000
        riskRewardRatio = rewardAmount / riskAmount
      }

      setCalculation(prev => ({
        ...prev,
        positionSize: Math.round(positionSize * 100) / 100,
        riskAmount: Math.round(riskAmount * 100) / 100,
        rewardAmount: Math.round(rewardAmount * 100) / 100,
        riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
        pipsRisk: Math.round(pipsRisk * 10) / 10,
        pipsReward: Math.round(pipsReward * 10) / 10
      }))
    }
  }, [calculation.accountSize, calculation.riskPercentage, calculation.entryPrice, calculation.stopLoss, calculation.takeProfit, calculation.pipValue])

  const updateField = (field: keyof RiskCalculation, value: number) => {
    setCalculation(prev => ({ ...prev, [field]: value }))
  }

  const getRiskRewardColor = (ratio: number) => {
    if (ratio >= 2) return 'text-green-600'
    if (ratio >= 1.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskRewardBadge = (ratio: number) => {
    if (ratio >= 2) return { variant: 'default' as const, text: 'Excellent' }
    if (ratio >= 1.5) return { variant: 'secondary' as const, text: 'Good' }
    return { variant: 'destructive' as const, text: 'Poor' }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            BTMM Risk Management Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountSize">Account Size ($)</Label>
              <Input
                id="accountSize"
                type="number"
                value={calculation.accountSize}
                onChange={(e) => updateField('accountSize', parseFloat(e.target.value) || 0)}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="riskPercentage">Risk Per Trade (%)</Label>
              <Input
                id="riskPercentage"
                type="number"
                step="0.1"
                value={calculation.riskPercentage}
                onChange={(e) => updateField('riskPercentage', parseFloat(e.target.value) || 0)}
                placeholder="2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pair">Currency Pair</Label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={pair}
                onChange={(e) => setPair(e.target.value)}
              >
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="USDCHF">USDCHF</option>
                <option value="AUDUSD">AUDUSD</option>
                <option value="USDCAD">USDCAD</option>
                <option value="NZDUSD">NZDUSD</option>
                <option value="XAUUSD">XAUUSD</option>
              </select>
            </div>
          </div>

          <Separator />

          {/* Trade Setup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                value={calculation.entryPrice}
                onChange={(e) => updateField('entryPrice', parseFloat(e.target.value) || 0)}
                placeholder="1.08500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00001"
                value={calculation.stopLoss}
                onChange={(e) => updateField('stopLoss', parseFloat(e.target.value) || 0)}
                placeholder="1.08200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Input
                id="takeProfit"
                type="number"
                step="0.00001"
                value={calculation.takeProfit}
                onChange={(e) => updateField('takeProfit', parseFloat(e.target.value) || 0)}
                placeholder="1.09100"
              />
            </div>
          </div>

          <Separator />

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Position Size</span>
                </div>
                <div className="text-2xl font-bold">{calculation.positionSize.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Lots</div>
              </CardContent>
            </Card>

            <Card className="bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Risk Amount</span>
                </div>
                <div className="text-2xl font-bold text-red-600">${calculation.riskAmount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{calculation.pipsRisk} pips</div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Reward Amount</span>
                </div>
                <div className="text-2xl font-bold text-green-600">${calculation.rewardAmount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{calculation.pipsReward} pips</div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Risk:Reward</span>
                </div>
                <div className={`text-2xl font-bold ${getRiskRewardColor(calculation.riskRewardRatio)}`}>
                  1:{calculation.riskRewardRatio}
                </div>
                <Badge {...getRiskRewardBadge(calculation.riskRewardRatio)} className="text-xs">
                  {getRiskRewardBadge(calculation.riskRewardRatio).text}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* BTMM Guidelines */}
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              BTMM Risk Management Guidelines
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Target minimum 2:1 reward-to-risk ratio for all trades</li>
              <li>• Never risk more than 2% of account per trade</li>
              <li>• Place stop loss above/below key levels (PDH/PDL, EMA levels)</li>
              <li>• Use ADR boundaries for take profit targets</li>
              <li>• Avoid trading during night hours to minimize traps</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RiskCalculator
