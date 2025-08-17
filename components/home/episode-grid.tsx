'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Search, Filter, Clock, Star } from 'lucide-react'
import Link from 'next/link'

interface Episode {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url?: string
  page_count: number
  created_at: string
  reading_progress?: number
}

export function EpisodeGrid() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchEpisodes()
    fetchCategories()
  }, [])

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('/api/public/episodes')
      if (response.ok) {
        const data = await response.json()
        setEpisodes(data)
      }
    } catch (error) {
      console.error('Failed to fetch episodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(['all', ...data])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          </div>
          <div className="w-full sm:w-48">
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[3/4] bg-muted animate-pulse"></div>
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? 's' : ''} found
        </p>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="text-xs"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Episodes Grid */}
      {filteredEpisodes.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No episodes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'No episodes have been uploaded yet'}
          </p>
          {!searchTerm && (
            <Link href="/admin">
              <Button>
                Upload Episodes
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEpisodes.map((episode) => (
            <Card key={episode.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl">
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                {episode.thumbnail_url ? (
                  <img
                    src={episode.thumbnail_url}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/read/${episode.id}`}>
                    <Button size="sm" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Now
                    </Button>
                  </Link>
                </div>
                {episode.reading_progress && episode.reading_progress > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(episode.reading_progress)}%
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {episode.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {episode.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {episode.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{episode.page_count} pages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>New</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}