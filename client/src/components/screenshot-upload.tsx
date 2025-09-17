import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Upload,
  X,
  Image as ImageIcon,
  Clock,
  FileImage,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Screenshot = {
  id: string
  file: File | null
  url: string
  timeframe: string
  name: string
  order: number
}

type Timeframe = {
  value: string
  label: string
  priority: number
}

const timeframes: Timeframe[] = [
  { value: 'MN1', label: 'Monthly', priority: 1 },
  { value: 'W1', label: 'Weekly', priority: 2 },
  { value: 'D1', label: 'Daily', priority: 3 },
  { value: 'H4', label: '4 Hour', priority: 4 },
  { value: 'H1', label: '1 Hour', priority: 5 },
  { value: 'M30', label: '30 Min', priority: 6 },
  { value: 'M15', label: '15 Min', priority: 7 },
  { value: 'M5', label: '5 Min', priority: 8 },
  { value: 'M1', label: '1 Min', priority: 9 },
]

interface ScreenshotUploadProps {
  screenshots: Screenshot[]
  onScreenshotsChange: (screenshots: Screenshot[]) => void
  maxFiles?: number
}

export function ScreenshotUpload({ 
  screenshots, 
  onScreenshotsChange, 
  maxFiles = 8 
}: ScreenshotUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newScreenshots: Screenshot[] = []
    const remainingSlots = maxFiles - screenshots.length

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const id = `screenshot-${Date.now()}-${i}`
        const url = URL.createObjectURL(file)
        const name = file.name.replace(/\.[^/.]+$/, '') // Remove extension
        
        newScreenshots.push({
          id,
          file,
          url,
          timeframe: 'H1', // Default timeframe
          name,
          order: screenshots.length + i
        })
      }
    }

    if (newScreenshots.length > 0) {
      onScreenshotsChange([...screenshots, ...newScreenshots])
      console.log(`Added ${newScreenshots.length} screenshots`)
    }
  }, [screenshots, onScreenshotsChange, maxFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeScreenshot = (id: string) => {
    const updatedScreenshots = screenshots.filter(s => s.id !== id)
    // Clean up object URL
    const screenshot = screenshots.find(s => s.id === id)
    if (screenshot?.url.startsWith('blob:')) {
      URL.revokeObjectURL(screenshot.url)
    }
    onScreenshotsChange(updatedScreenshots)
    console.log('Screenshot removed:', id)
  }

  const updateScreenshot = (id: string, updates: Partial<Screenshot>) => {
    const updatedScreenshots = screenshots.map(screenshot => 
      screenshot.id === id ? { ...screenshot, ...updates } : screenshot
    )
    onScreenshotsChange(updatedScreenshots)
    console.log('Screenshot updated:', id, updates)
  }

  const moveScreenshot = (id: string, direction: 'up' | 'down') => {
    const currentIndex = screenshots.findIndex(s => s.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= screenshots.length) return

    const newScreenshots = [...screenshots]
    const [removed] = newScreenshots.splice(currentIndex, 1)
    newScreenshots.splice(newIndex, 0, removed)
    
    // Update order numbers
    const reorderedScreenshots = newScreenshots.map((s, index) => ({ ...s, order: index }))
    onScreenshotsChange(reorderedScreenshots)
    console.log('Screenshot moved:', direction)
  }

  // Sort screenshots by timeframe priority for display
  const sortedScreenshots = [...screenshots].sort((a, b) => {
    const aPriority = timeframes.find(tf => tf.value === a.timeframe)?.priority || 999
    const bPriority = timeframes.find(tf => tf.value === b.timeframe)?.priority || 999
    return aPriority - bPriority
  })

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Screenshots
            <Badge variant="secondary" className="text-xs">
              {screenshots.length}/{maxFiles}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            data-testid="upload-dropzone"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className={`h-8 w-8 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">
                  {dragOver ? 'Drop screenshots here' : 'Drag & drop screenshots'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Or click to browse • PNG, JPG up to 10MB each
                </p>
              </div>
              <Input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                id="screenshot-upload"
                data-testid="input-file-upload"
              />
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                disabled={screenshots.length >= maxFiles}
                data-testid="button-browse-files"
              >
                <label htmlFor="screenshot-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screenshot List */}
      {screenshots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Uploaded Screenshots</CardTitle>
            <p className="text-xs text-muted-foreground">
              Organize from higher to lower timeframes for optimal trade analysis flow
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedScreenshots.map((screenshot, index) => (
                <div 
                  key={screenshot.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover-elevate"
                  data-testid={`screenshot-item-${screenshot.id}`}
                >
                  {/* Preview */}
                  <div className="relative w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={screenshot.url}
                      alt={screenshot.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-preview-${screenshot.id}`}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={screenshot.name}
                        onChange={(e) => updateScreenshot(screenshot.id, { name: e.target.value })}
                        className="text-sm font-medium flex-1"
                        placeholder="Screenshot name"
                        data-testid={`input-name-${screenshot.id}`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <Select
                        value={screenshot.timeframe}
                        onValueChange={(value) => updateScreenshot(screenshot.id, { timeframe: value })}
                      >
                        <SelectTrigger 
                          className="w-32 h-7 text-xs"
                          data-testid={`select-timeframe-${screenshot.id}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map(tf => (
                            <SelectItem key={tf.value} value={tf.value}>
                              {tf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover-elevate"
                      onClick={() => moveScreenshot(screenshot.id, 'up')}
                      disabled={index === 0}
                      data-testid={`button-move-up-${screenshot.id}`}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover-elevate"
                      onClick={() => moveScreenshot(screenshot.id, 'down')}
                      disabled={index === screenshots.length - 1}
                      data-testid={`button-move-down-${screenshot.id}`}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover-elevate"
                      onClick={() => removeScreenshot(screenshot.id)}
                      data-testid={`button-remove-${screenshot.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}