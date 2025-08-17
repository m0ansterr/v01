"use client"

import { useState, useEffect } from 'react'
import { SwipeReader } from '@/components/reader/swipe-reader'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MPDManifest {
  episode_id: string
  title: string
  cover: string
  pages: string[]
  total_pages: number
  published: boolean
  created_at: string
}

interface PageProps {
  params: { episode_id: string }
}

export default function ReadPage({ params }: PageProps) {
  const [manifest, setManifest] = useState<MPDManifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const response = await fetch(`/api/public/${params.episode_id}/mpd`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Episode not found')
          } else {
            setError('Failed to load episode')
          }
          return
        }

        const data = await response.json()
        setManifest(data)
      } catch (error) {
        console.error('Failed to fetch manifest:', error)
        setError('Failed to load episode')
      } finally {
        setLoading(false)
      }
    }

    fetchManifest()
  }, [params.episode_id])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading episode...</p>
        </div>
      </div>
    )
  }

  if (error || !manifest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'Episode not found'}
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
    <SwipeReader
      pages={manifest.pages}
      title={manifest.title}
      episodeId={manifest.episode_id}
    />
  )
}