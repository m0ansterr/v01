import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, Newspaper } from 'lucide-react'
import Link from 'next/link'

const newsItems = [
  {
    id: 1,
    title: 'Welcome to StoryVerse - The Future of Digital Reading',
    excerpt: 'We\'re excited to launch StoryVerse, a new platform dedicated to immersive digital storytelling experiences.',
    date: '2025-01-17',
    readTime: '3 min read',
    category: 'Announcement',
    featured: true
  },
  {
    id: 2,
    title: 'New Features: Enhanced Reading Experience',
    excerpt: 'Introducing progress tracking, bookmarks, and improved navigation for a better reading experience.',
    date: '2025-01-15',
    readTime: '2 min read',
    category: 'Features',
    featured: false
  },
  {
    id: 3,
    title: 'Community Guidelines and Best Practices',
    excerpt: 'Learn about our community standards and how to make the most of your StoryVerse experience.',
    date: '2025-01-12',
    readTime: '5 min read',
    category: 'Community',
    featured: false
  }
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                <Newspaper className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StoryVerse News
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest features, announcements, and community highlights
            </p>
          </div>

          {/* Featured Article */}
          {newsItems.filter(item => item.featured).map((item) => (
            <Card key={item.id} className="mb-12 border-0 shadow-xl bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-primary">Featured</Badge>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                  <Button>Read More</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Regular Articles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Latest Updates</h2>
            {newsItems.filter(item => !item.featured).map((item) => (
              <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                  <Button variant="outline" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-muted/50 to-muted/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get notified about new features, story releases, and community events. 
                Join our newsletter for the latest StoryVerse updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-input rounded-lg bg-background"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}