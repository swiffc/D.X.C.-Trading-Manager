import { AppSidebar } from '../app-sidebar'
import { useState } from 'react'

export default function AppSidebarExample() {
  const [activeSection, setActiveSection] = useState<'live-trades' | 'case-studies'>('live-trades')
  const [selectedTradeType, setSelectedTradeType] = useState<number | null>(1)

  return (
    <div className="h-screen w-64">
      <AppSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        selectedTradeType={selectedTradeType}
        onTradeTypeSelect={setSelectedTradeType}
      />
    </div>
  )
}