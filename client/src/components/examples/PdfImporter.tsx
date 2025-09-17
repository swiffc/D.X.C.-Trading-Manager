import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import * as pdfjsLib from 'pdfjs-dist'

// Vite compat for pdfjs worker
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker&url'
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

type DetectedAsset = {
  blob: Blob
  width: number
  height: number
  page: number
  source: string
  extractedText: string
  isChart: boolean
  detectedPatterns: string[]
}

const MAX_WIDTH = 1600
const TARGET_WIDTH = 1280

function looksLikeChart(extractedText: string, width: number, height: number): boolean {
  const t = extractedText.toLowerCase()
  const hasChartTerms = /(open|high|low|close|volume|ema|rsi|tdi|adr|pips|session|asian|london|new york|ny)/.test(t)
  const landscape = width >= height
  return hasChartTerms && landscape
}

function detectPatterns(extractedText: string): string[] {
  const t = extractedText.toLowerCase()
  const patterns: string[] = []
  if (/\bm\b|m pattern|double top/.test(t)) patterns.push('M')
  if (/\bw\b|w pattern|double bottom/.test(t)) patterns.push('W')
  if (/half\s*b(at)?man|id50/.test(t)) patterns.push('Half Batman/ID50')
  if (/ema\s*50|ema\s*200|ema\s*800|13\s*ema/.test(t)) patterns.push('EMA Context')
  return Array.from(new Set(patterns))
}

async function renderPageToImage(page: any): Promise<{ blob: Blob, width: number, height: number }> {
  const viewport = page.getViewport({ scale: 2 })
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const scale = Math.min(MAX_WIDTH / viewport.width, 2)
  const v = page.getViewport({ scale })
  canvas.width = v.width
  canvas.height = v.height
  await page.render({ canvasContext: ctx, viewport: v }).promise
  // Resize to target width for storage
  const resizeScale = TARGET_WIDTH / canvas.width
  const outW = Math.min(TARGET_WIDTH, canvas.width)
  const outH = Math.round(canvas.height * resizeScale)
  const off = document.createElement('canvas')
  off.width = outW
  off.height = outH
  const octx = off.getContext('2d')!
  octx.drawImage(canvas, 0, 0, outW, outH)
  const blob: Blob = await new Promise(resolve => off.toBlob(b => resolve(b as Blob), 'image/jpeg', 0.9))
  return { blob, width: outW, height: outH }
}

export const PdfImporter: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [importing, setImporting] = useState(false)
  const [detected, setDetected] = useState<DetectedAsset[]>([])

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setImporting(true)
    setDetected([])
    let processed: DetectedAsset[] = []
    for (let file of files) {
      const arrayBuf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p)
        const textContent = await page.getTextContent()
        const extractedText = textContent.items.map((it: any) => it.str).join(' ')
        const { blob, width, height } = await renderPageToImage(page)
        const isChart = looksLikeChart(extractedText, width, height)
        if (isChart) {
          processed.push({ blob, width, height, page: p, source: file.name, extractedText, isChart, detectedPatterns: detectPatterns(extractedText) })
        }
        setProgress(Math.round(((p / pdf.numPages) * 100)))
      }
    }
    setDetected(processed)
    setImporting(false)
  }

  const uploadAll = async () => {
    for (const a of detected) {
      const form = new FormData()
      form.append('file', a.blob, 'chart.jpg')
      form.append('source', a.source)
      form.append('page', String(a.page))
      form.append('extractedText', a.extractedText)
      form.append('isChart', 'true')
      form.append('width', String(a.width))
      form.append('height', String(a.height))
      form.append('detectedPatterns', JSON.stringify(a.detectedPatterns))
      await fetch('/api/assets', { method: 'POST', body: form })
    }
    // Refresh current list consumers via simple reload (or state bus if added later)
    window.location.reload()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Import Charts from PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input aria-label="Select PDF files" ref={inputRef} type="file" accept="application/pdf" multiple onChange={handleSelect} className="hidden" />
          <Button variant="outline" onClick={() => inputRef.current?.click()}>Select PDFs</Button>
          <Button onClick={uploadAll} disabled={detected.length === 0}>Upload {detected.length > 0 ? `(${detected.length})` : ''}</Button>
        </div>
        {importing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <div className="text-xs text-muted-foreground">Processing… {progress}%</div>
          </div>
        )}
        {detected.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {detected.map((d, i) => (
              <div key={i} className="border rounded p-2 space-y-2">
                <div className="w-full aspect-video bg-black/10 rounded overflow-hidden">
                  <img alt={`Preview ${d.source} p.${d.page}`} src={URL.createObjectURL(d.blob)} className="w-full h-full object-contain" />
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>{d.source} — p.{d.page}</span>
                  <span>{d.width}×{d.height}</span>
                </div>
                {d.detectedPatterns.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {d.detectedPatterns.map((p) => <Badge key={p} variant="outline">{p}</Badge>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


