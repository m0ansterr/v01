"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Eye, Calendar, Image, Edit, Star, Heart, BookOpen } from 'lucide-react'
import { Episode } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'

interface StorybooksListProps {
  refresh: number
}

export function StorybooksList({ refresh }: StorybooksListProps) {
  const [storybooks, setStorybooks] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStorybooks = async () => {
    try {
      const response = await fetch('/api/admin/episodes')
      if (response.ok) {
        const data = await response.json()
        setStorybooks(data.episodes)
      }
    } catch (error) {
      toast.error('Failed to fetch storybooks')
    } finally {
      setLoading(false)
    }
  }

  const deleteStorybook = async (episodeId: string) => {
    if (!confirm('Are you sure you want to delete this storybook?')) return

    try {
      const response = await fetch(`/api/admin/episodes?episode_id=${episodeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Storybook deleted successfully')
        fetchStorybooks()
      } else {
        toast.error('Failed to delete storybook')
      }
    } catch (error) {
      toast.error('Failed to delete storybook')
    }
  }

  useEffect(() => {
    fetchStorybooks()
  }, [refresh])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Storybooks ({storybooks.length})</span>
          </div>
          <Button size="sm" onClick={fetchStorybooks}>
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {storybooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No storybooks yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first storybook to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storybooks.map((storybook, index) => (
              <motion.div
                key={storybook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {storybook.cover_image ? (
                      <img
                        src={storybook.cover_image}
                        alt={storybook.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Actions */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(`/read/${storybook.episode_id}`, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteStorybook(storybook.episode_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant={storybook.published ? "default" : "secondary"}>
                        {storybook.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {storybook.title}
                      </h3>
                      {storybook.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {storybook.description}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Image className="h-3 w-3" />
                          <span>{storybook.pages} pages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{storybook.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(storybook.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {storybook.tags && storybook.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {storybook.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {storybook.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{storybook.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* ID */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {storybook.episode_id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}