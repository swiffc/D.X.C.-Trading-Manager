import { ScreenshotUpload } from '../screenshot-upload'
import { useState } from 'react'

type Screenshot = {
  id: string
  file: File | null
  url: string
  timeframe: string
  name: string
  order: number
}

// Mock data for demonstration
const mockScreenshots: Screenshot[] = [
  {
    id: 'ss1',
    file: null,
    url: '/api/placeholder/chart-h4.jpg',
    timeframe: 'H4',
    name: 'EURUSD H4 Overview',
    order: 0
  },
  {
    id: 'ss2', 
    file: null,
    url: '/api/placeholder/chart-h1.jpg',
    timeframe: 'H1',
    name: 'Entry Setup H1',
    order: 1
  },
  {
    id: 'ss3',
    file: null,
    url: '/api/placeholder/chart-m15.jpg', 
    timeframe: 'M15',
    name: 'Entry Trigger M15',
    order: 2
  }
]

export default function ScreenshotUploadExample() {
  const [screenshots, setScreenshots] = useState(mockScreenshots)

  return (
    <div className="max-w-2xl">
      <ScreenshotUpload
        screenshots={screenshots}
        onScreenshotsChange={setScreenshots}
        maxFiles={8}
      />
    </div>
  )
}