import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Activity,
  BookOpen,
  Search,
  Settings,
  FolderOpen,
  Plus,
  Home,
  Brain,
  Calendar,
  Shield,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Eye,
  DollarSign,
  Timer,
  LineChart,
  Sparkles
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type TradeType = {
  id: number
  name: string
  description: string
  icon: React.ElementType
  color: string
  count: number
}

const tradeTypes: TradeType[] = [
  {
    id: 1,
    name: 'Type 1: M/W Patterns',
    description: '13 EMA Rules & Asian Session',
    icon: TrendingUp,
    color: 'bg-trading-type1',
    count: 12
  },
  {
    id: 2,
    name: 'Type 2: Asian Bounce',
    description: '00/50 Bounce & Reverse',
    icon: Activity,
    color: 'bg-trading-type2',
    count: 8
  },
  {
    id: 3,
    name: 'Type 3: EMA Bounce',
    description: '50 EMA & ADR Rejection',
    icon: BarChart3,
    color: 'bg-trading-type3',
    count: 15
  },
  {
    id: 4,
    name: 'Type 4: Custom Setup',
    description: 'Advanced Patterns',
    icon: BookOpen,
    color: 'bg-trading-type4',
    count: 5
  }
]

const mainNavItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Trading Guide', url: '/guide', icon: BookOpen },
  { title: 'Trading Plan', url: '/plan', icon: Target },
]

const btmmFeatures = [
  { title: 'Smart Execution', icon: Sparkles, component: 'smart-execution' },
  { title: 'Weekly/Daily Bias', icon: Calendar, component: 'weekly-daily-bias' },
  { title: 'Advanced Patterns', icon: Brain, component: 'advanced-patterns' },
  { title: 'Key Levels', icon: Eye, component: 'key-levels' },
  { title: 'Risk Calculator', icon: Shield, component: 'risk-calculator' },
  { title: 'Session Timing', icon: Clock, component: 'session-timing' },
  { title: 'Execution Checklist', icon: CheckCircle, component: 'execution-checklist' },
  { title: 'TDI Integration', icon: Zap, component: 'tdi-integration' },
]

const analysisTools = [
  { title: 'Pattern Scanner', icon: Search, component: 'pattern-scanner' },
  { title: 'Performance Analytics', icon: LineChart, component: 'performance-analytics' },
  { title: 'Trade Journal', icon: FolderOpen, component: 'trade-journal' },
]

interface AppSidebarProps {
  activeSection: 'live-trades' | 'case-studies'
  onSectionChange: (section: 'live-trades' | 'case-studies') => void
  selectedTradeType: number | null
  onTradeTypeSelect: (typeId: number | null) => void
  activeComponent?: string
  onComponentChange?: (component: string) => void
}

export function AppSidebar({ 
  activeSection, 
  onSectionChange, 
  selectedTradeType, 
  onTradeTypeSelect,
  activeComponent,
  onComponentChange
}: AppSidebarProps) {
  const [expandedType, setExpandedType] = useState<number | null>(null)

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">TradeVault</h2>
            <p className="text-xs text-muted-foreground">Screenshot Manager</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-testid={`nav-${item.title.toLowerCase()}`}>
                    <a href={item.url} className="hover-elevate">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Toggle */}
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-2 p-2">
              <Button
                variant={activeSection === 'live-trades' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSectionChange('live-trades')}
                data-testid="button-live-trades"
                className="text-xs"
              >
                Live Trades
              </Button>
              <Button
                variant={activeSection === 'case-studies' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSectionChange('case-studies')}
                data-testid="button-case-studies"
                className="text-xs"
              >
                Case Studies
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* BTMM Features */}
        <SidebarGroup>
          <SidebarGroupLabel>BTMM Analysis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {btmmFeatures.map((feature) => (
                <SidebarMenuItem key={feature.component}>
                  <SidebarMenuButton
                    onClick={() => onComponentChange?.(feature.component)}
                    data-testid={`btmm-${feature.component}`}
                    className={`hover-elevate ${
                      activeComponent === feature.component ? 'bg-sidebar-accent' : ''
                    }`}
                  >
                    <feature.icon className="h-4 w-4" />
                    <span className="text-sm">{feature.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analysis Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Analysis Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisTools.map((tool) => (
                <SidebarMenuItem key={tool.component}>
                  <SidebarMenuButton
                    onClick={() => onComponentChange?.(tool.component)}
                    data-testid={`tool-${tool.component}`}
                    className={`hover-elevate ${
                      activeComponent === tool.component ? 'bg-sidebar-accent' : ''
                    }`}
                  >
                    <tool.icon className="h-4 w-4" />
                    <span className="text-sm">{tool.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trade Types */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            Trade Types
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-5 w-5 hover-elevate"
              data-testid="button-add-trade"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tradeTypes.map((type) => (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      onTradeTypeSelect(selectedTradeType === type.id ? null : type.id)
                      setExpandedType(expandedType === type.id ? null : type.id)
                    }}
                    data-testid={`trade-type-${type.id}`}
                    className={`hover-elevate ${
                      selectedTradeType === type.id ? 'bg-sidebar-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`h-2 w-2 rounded-full ${type.color}`} />
                      <type.icon className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{type.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {type.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {type.count}
                      </Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}