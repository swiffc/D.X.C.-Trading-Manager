import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

type Asset = {
  id: string
  fileName: string
  url: string
  source: string
  page: number
  title: string
  caption: string
  extractedText: string
  isChart: boolean
  detectedPatterns: string[]
  width: number
  height: number
}

export const ChartExamples: React.FC<{ onlyCharts?: boolean }> = ({ onlyCharts = true }) => {
  const [assets, setAssets] = useState<Asset[] | null>(null)

  useEffect(() => {
    const load = async () => {
      const endpoint = onlyCharts ? '/api/assets/charts' : '/api/assets'
      const res = await fetch(endpoint)
      const data = await res.json()
      setAssets(data)
    }
    load()
  }, [onlyCharts])

  if (!assets) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No imported chart examples yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((a) => (
        <Card key={a.id} className="overflow-hidden">
          <CardHeader className="p-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="truncate" title={a.title || a.fileName}>{a.title || a.fileName}</span>
              {a.detectedPatterns?.length > 0 && (
                <Badge variant="outline">{a.detectedPatterns.join(', ')}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <div className="w-full aspect-video bg-black/10 rounded overflow-hidden">
              <img
                src={a.url}
                alt={a.title || a.fileName}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            {a.caption && <p className="text-xs text-muted-foreground">{a.caption}</p>}
            <div className="text-[10px] text-muted-foreground flex items-center justify-between">
              <span>{a.source} — p.{a.page}</span>
              {a.width > 0 && a.height > 0 && <span>{a.width}×{a.height}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


