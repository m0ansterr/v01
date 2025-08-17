"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight, Home, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SwipeReaderProps {
  pages: string[]
  title: string
  episodeId: string
}

export function SwipeReader({ pages, title, episodeId }: SwipeReaderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<number, boolean>>({})
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      pages.forEach((url, index) => {
        const img = new Image()
        img.onload = () => {
          setImageLoadStatus(prev => ({ ...prev, [index]: true }))
        }
        img.src = url
      })
    }
    preloadImages()
  }, [pages])

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentPage])

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection('left')
      setCurrentPage(currentPage - 1)
      setShowControls(true)
    }
  }, [currentPage])

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setDirection('right')
      setCurrentPage(currentPage + 1)
      setShowControls(true)
    }
  }, [currentPage, pages.length])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextPage,
    onSwipedRight: goToPreviousPage,
    trackMouse: true,
    preventScrollOnSwipe: true
  })

  const handleImageClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    
    if (clickX < width / 2) {
      goToPreviousPage()
    } else {
      goToNextPage()
    }
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const progress = ((currentPage + 1) / pages.length) * 100

  // Save reading progress to localStorage
  useEffect(() => {
    localStorage.setItem(`reading_progress_${episodeId}`, currentPage.toString())
  }, [currentPage, episodeId])

  // Load reading progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`reading_progress_${episodeId}`)
    if (savedProgress) {
      setCurrentPage(parseInt(savedProgress, 10))
    }
  }, [episodeId])

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      <div {...swipeHandlers} className="h-full w-full relative">
        {/* Header */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
            >
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.history.back()}
                >
                  <Home className="h-5 w-5" />
                </Button>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-medium truncate">{title}</h1>
                  <p className="text-sm text-gray-400">
                    {currentPage + 1} / {pages.length}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleControls}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Image Display */}
        <div className="h-full w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ 
                opacity: 0,
                x: direction === 'right' ? 50 : -50
              }}
              animate={{ 
                opacity: 1,
                x: 0
              }}
              exit={{ 
                opacity: 0,
                x: direction === 'right' ? -50 : 50
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full relative"
            >
              {imageLoadStatus[currentPage] ? (
                <img
                  src={pages[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  className="h-full w-full object-contain cursor-pointer select-none"
                  onClick={handleImageClick}
                  onLoad={() => setImageLoadStatus(prev => ({ ...prev, [currentPage]: true }))}
                  draggable={false}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Areas (invisible but clickable) */}
          <div
            className="absolute left-0 top-0 w-1/2 h-full z-[1] cursor-w-resize"
            onClick={goToPreviousPage}
            title="Previous page"
          />
          <div
            className="absolute right-0 top-0 w-1/2 h-full z-[1] cursor-e-resize"
            onClick={goToNextPage}
            title="Next page"
          />
        </div>

        {/* Bottom Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4"
            >
              <div className="space-y-4">
                <Progress value={progress} className="w-full h-1" />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                    className={cn(
                      "text-white",
                      currentPage === 0 && "opacity-50"
                    )}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Page {currentPage + 1} of {pages.length}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextPage}
                    disabled={currentPage === pages.length - 1}
                    className={cn(
                      "text-white",
                      currentPage === pages.length - 1 && "opacity-50"
                    )}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}