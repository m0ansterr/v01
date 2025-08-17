import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Image, Grid, List } from 'lucide-react'
import Link from 'next/link'

export default function GalleryPage() {
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
              <Button variant="ghost" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore beautiful artwork and illustrations from our storybook collection
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <Image className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold mb-4">Gallery Coming Soon</h3>
            <p className="text-muted-foreground mb-8">
              We're working on creating a beautiful gallery to showcase artwork from all our storybooks. 
              Check back soon for stunning visuals and illustrations!
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Stories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}