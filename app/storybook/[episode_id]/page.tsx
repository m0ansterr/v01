"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  Star, 
  Eye, 
  Clock, 
  Play, 
  Bookmark,
  Share2,
  Download,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface StorybookDetails {
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
  totalLikes?: number
  totalViews?: number
  episodes?: Array<{
    id: string
    title: string
    pages: number
    isRead: boolean
  }>
}

interface PageProps {
  params: { episode_id: string }
}

export default function StorybookDetailsPage({ params }: PageProps) {
  const [storybook, setStorybook] = useState<StorybookDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    fetchStorybookDetails()
    loadUserPreferences()
  }, [params.episode_id])

  const fetchStorybookDetails = async () => {
    try {
      const response = await fetch(`/api/public/episodes`)
      if (response.ok) {
        const data = await response.json()
        const book = data.episodes.find((ep: any) => ep.episode_id === params.episode_id)
        if (book) {
          // Enhance with mock data
          const enhancedBook = {
            ...book,
            isCompleted: Math.random() > 0.7,
            isOngoing: Math.random() > 0.5,
            totalLikes: Math.floor(Math.random() * 1000),
            totalViews: Math.floor(Math.random() * 5000),
            episodes: [
              { id: '1', title: 'Chapter 1: The Beginning', pages: 25, isRead: true },
              { id: '2', title: 'Chapter 2: The Journey', pages: 30, isRead: true },
              { id: '3', title: 'Chapter 3: The Challenge', pages: 28, isRead: false },
              { id: '4', title: 'Chapter 4: The Resolution', pages: 32, isRead: false },
            ]
          }
          setStorybook(enhancedBook)
        }
      }
    } catch (error) {
      console.error('Failed to fetch storybook details:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserPreferences = () => {
    const liked = localStorage.getItem('likedBooks')
    const bookmarked = localStorage.getItem('bookmarkedBooks')
    const progress = localStorage.getItem(`reading_progress_${params.episode_id}`)
    
    if (liked) {
      setIsLiked(JSON.parse(liked).includes(params.episode_id))
    }
    if (bookmarked) {
      setIsBookmarked(JSON.parse(bookmarked).includes(params.episode_id))
    }
    if (progress && storybook) {
      setReadingProgress((parseInt(progress) / storybook.pages) * 100)
    }
  }

  const toggleLike = () => {
    const liked = JSON.parse(localStorage.getItem('likedBooks') || '[]')
    if (isLiked) {
      const filtered = liked.filter((id: string) => id !== params.episode_id)
      localStorage.setItem('likedBooks', JSON.stringify(filtered))
      toast.success('Removed from favorites')
    } else {
      liked.push(params.episode_id)
      localStorage.setItem('likedBooks', JSON.stringify(liked))
      toast.success('Added to favorites')
    }
    setIsLiked(!isLiked)
  }

  const toggleBookmark = () => {
    const bookmarked = JSON.parse(localStorage.getItem('bookmarkedBooks') || '[]')
    if (isBookmarked) {
      const filtered = bookmarked.filter((id: string) => id !== params.episode_id)
      localStorage.setItem('bookmarkedBooks', JSON.stringify(filtered))
      toast.success('Removed from reading list')
    } else {
      bookmarked.push(params.episode_id)
      localStorage.setItem('bookmarkedBooks', JSON.stringify(bookmarked))
      toast.success('Added to reading list')
    }
    setIsBookmarked(!isBookmarked)
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    localStorage.setItem(`rating_${params.episode_id}`, rating.toString())
    toast.success(`Rated ${rating} stars`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!storybook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Storybook not found</h2>
            <p className="text-muted-foreground mb-4">
              The storybook you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleBookmark}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cover and Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Cover Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                  {storybook.cover_image ? (
                    <img
                      src={storybook.cover_image}
                      alt={storybook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {storybook.isCompleted ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Completed
                      </Badge>
                    ) : storybook.isOngoing ? (
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        Ongoing
                      </Badge>
                    ) : (
                      <Badge variant="secondary">New</Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href={`/read/${storybook.episode_id}`} className="block">
                    <Button size="lg" className="w-full">
                      <Play className="mr-2 h-5 w-5" />
                      Start Reading
                    </Button>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={toggleLike}>
                      <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                    <Button variant="outline" onClick={toggleBookmark}>
                      <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>

                {/* Reading Progress */}
                {readingProgress > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Reading Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(readingProgress)}%
                        </span>
                      </div>
                      <Progress value={readingProgress} className="h-2" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">{storybook.title}</h1>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <Badge variant="outline">{storybook.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{storybook.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{storybook.totalViews?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{storybook.totalLikes?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{storybook.pages}</div>
                    <div className="text-sm text-muted-foreground">Pages</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{storybook.reading_time}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{storybook.rating}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About this Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {storybook.description || 'No description available for this storybook.'}
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              {storybook.tags && storybook.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {storybook.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Episodes/Chapters */}
              {storybook.episodes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Episodes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {storybook.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${episode.isRead ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                            <div>
                              <h4 className="font-medium">{episode.title}</h4>
                              <p className="text-sm text-muted-foreground">{episode.pages} pages</p>
                            </div>
                          </div>
                          <Button size="sm" variant={episode.isRead ? "outline" : "default"}>
                            {episode.isRead ? 'Re-read' : 'Read'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rating */}
              <Card>
                <CardHeader>
                  <CardTitle>Rate this Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= userRating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}