import { useState } from 'react'
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TradingDashboard } from "@/components/trading-dashboard"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      {/* <Route path="/" component={Home}/> */}
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState<'live-trades' | 'case-studies'>('live-trades')
  const [selectedTradeType, setSelectedTradeType] = useState<number | null>(null)

  const handleNewTrade = () => {
    console.log('New trade/study creation')
    // This will be implemented with a modal or form
  }

  // Custom sidebar width for trading application
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                selectedTradeType={selectedTradeType}
                onTradeTypeSelect={setSelectedTradeType}
              />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-hidden">
                  <TradingDashboard
                    activeSection={activeSection}
                    selectedTradeType={selectedTradeType}
                    onNewTrade={handleNewTrade}
                  />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
