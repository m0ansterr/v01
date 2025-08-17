'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Star, Heart, Eye, Clock, Play, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Storybook {
  id: string
  episode_id: string
  title: string
  description: string
  category: string
  tags: string[]
  cover_image?: string
  pages: number
  reading_time: number
  rating: number
  created_at: string
  isCompleted?: boolean
  isOngoing?: boolean
  lastReadPage?: number
  totalLikes?: number
  totalViews?: number
}

export function StorybookGrid() {
  const [storybooks, setStorybooks] = useState<Storybook[]>([])
  const [loading, setLoading] = useState(true)
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchStorybooks()
    loadLikedBooks()
  }, [])

  const fetchStorybooks = async () => {
    try {
      const response = await fetch('/api/public/episodes')
      if (response.ok) {
        const data = await response.json()
        // Add mock data for demo
        const enhancedStorybooks = data.episodes.map((book: any) => ({
          ...book,
          isCompleted: Math.random() > 0.7,
          isOngoing: Math.random() > 0.5,
          lastReadPage: Math.floor(Math.random() * book.pages),
          totalLikes: Math.floor(Math.random() * 1000),
          totalViews: Math.floor(Math.random() * 5000),
          rating: Math.round((Math.random() * 4 + 1) * 10) / 10
        }))
        setStorybooks(enhancedStorybooks)
      }
    } catch (error) {
      console.error('Failed to fetch storybooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLikedBooks = () => {
    const liked = localStorage.getItem('likedBooks')
    if (liked) {
      setLikedBooks(new Set(JSON.parse(liked)))
    }
  }

  const toggleLike = (bookId: string) => {
    const newLiked = new Set(likedBooks)
    if (newLiked.has(bookId)) {
      newLiked.delete(bookId)
    } else {
      newLiked.add(bookId)
    }
    setLikedBooks(newLiked)
    localStorage.setItem('likedBooks', JSON.stringify([...newLiked]))
  }

  const getReadingProgress = (bookId: string) => {
    const progress = localStorage.getItem(`reading_progress_${bookId}`)
    return progress ? parseInt(progress) : 0
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                  <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Featured Storybooks
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover captivating tales that will transport you to magical worlds
        </p>
      </div>

      {/* Storybooks Grid */}
      {storybooks.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="mx-auto h-20 w-20 text-muted-foreground/50 mb-6" />
          <h3 className="text-2xl font-semibold mb-4">No storybooks available</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Be the first to discover amazing stories. Check back soon for new additions!
          </p>
          <Link href="/admin">
            <Button size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Add Storybooks
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {storybooks.map((storybook, index) => {
            const progress = getReadingProgress(storybook.episode_id)
            const progressPercent = storybook.pages > 0 ? (progress / storybook.pages) * 100 : 0
            const isLiked = likedBooks.has(storybook.episode_id)

            return (
              <motion.div
                key={storybook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-muted/20">
                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {storybook.cover_image ? (
                      <img
                        src={storybook.cover_image}
                        alt={storybook.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                        <BookOpen className="h-20 w-20 text-muted-foreground/30" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                      {storybook.isCompleted && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Completed
                        </Badge>
                      )}
                      {storybook.isOngoing && !storybook.isCompleted && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          Ongoing
                        </Badge>
                      )}
                    </div>

                    {/* Like Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleLike(storybook.episode_id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>

                    {/* Progress Bar */}
                    {progressPercent > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <Link href={`/storybook/${storybook.episode_id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <Eye className="mr-2 h-3 w-3" />
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/read/${storybook.episode_id}`}>
                          <Button size="sm" variant="secondary">
                            <Play className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 space-y-4">
                    {/* Title and Category */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {storybook.title}
                        </h3>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {storybook.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {storybook.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{storybook.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{storybook.totalLikes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-blue-500" />
                          <span>{storybook.totalViews}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reading Info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>{storybook.pages} pages</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{storybook.reading_time} min read</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {storybook.tags && storybook.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {storybook.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {storybook.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{storybook.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Progress Text */}
                    {progressPercent > 0 && (
                      <div className="text-xs text-primary font-medium">
                        {progressPercent === 100 ? 'Completed' : `${Math.round(progressPercent)}% read`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}