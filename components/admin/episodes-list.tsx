"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Eye, Calendar, Image } from 'lucide-react'
import { Episode } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface EpisodesListProps {
  refresh: number
}

export function EpisodesList({ refresh }: EpisodesListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('/api/admin/episodes')
      if (response.ok) {
        const data = await response.json()
        setEpisodes(data.episodes)
      }
    } catch (error) {
      toast.error('Failed to fetch episodes')
    } finally {
      setLoading(false)
    }
  }

  const deleteEpisode = async (episodeId: string) => {
    if (!confirm('Are you sure you want to delete this episode?')) return

    try {
      const response = await fetch(`/api/admin/episodes?episode_id=${episodeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Episode deleted successfully')
        fetchEpisodes()
      } else {
        toast.error('Failed to delete episode')
      }
    } catch (error) {
      toast.error('Failed to delete episode')
    }
  }

  useEffect(() => {
    fetchEpisodes()
  }, [refresh])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading episodes...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Episodes ({episodes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {episodes.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No episodes uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium">{episode.title}</h3>
                    {episode.description && (
                      <p className="text-sm text-muted-foreground">
                        {episode.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Image className="h-3 w-3" />
                        <span>{episode.pages} pages</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(episode.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {episode.cover_image && (
                    <div className="ml-4 flex-shrink-0">
                      <img
                        src={episode.cover_image}
                        alt={episode.title}
                        className="h-16 w-12 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={episode.published ? "default" : "secondary"}>
                      {episode.published ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {episode.episode_id}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/read/${episode.episode_id}`, '_blank')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEpisode(episode.episode_id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}