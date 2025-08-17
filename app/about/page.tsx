import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Heart, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About StoryVerse
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Where digital storytelling meets immersive experiences. We're passionate about bringing stories to life 
              through innovative technology and beautiful design.
            </p>
          </div>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Immersive Reading</h3>
                <p className="text-muted-foreground">
                  We create reading experiences that transport you into the story with intuitive navigation and beautiful visuals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="p-3 bg-red-50 rounded-full w-fit mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                <p className="text-muted-foreground">
                  Built for readers, by readers. Every feature is designed with the community's feedback and needs in mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="p-3 bg-purple-50 rounded-full w-fit mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
                <p className="text-muted-foreground">
                  We're constantly pushing the boundaries of what digital reading can be with cutting-edge technology.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      StoryVerse was born from a simple belief: digital stories should be as engaging and 
                      immersive as physical books, if not more so. We started as a small team of developers 
                      and designers who were passionate about both technology and storytelling.
                    </p>
                    <p>
                      Today, we're building a platform that not only preserves the magic of reading but 
                      enhances it with modern technology. From touch-friendly navigation to progress tracking, 
                      every feature is crafted to make your reading journey unforgettable.
                    </p>
                    <p>
                      Join us as we continue to innovate and create the future of digital storytelling, 
                      one page at a time.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                    <Users className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Mobile-First Design',
                  description: 'Optimized for touch devices with intuitive swipe gestures and responsive layouts.'
                },
                {
                  title: 'Progress Tracking',
                  description: 'Never lose your place with automatic progress saving and reading statistics.'
                },
                {
                  title: 'Beautiful Typography',
                  description: 'Carefully chosen fonts and layouts that make reading a pleasure on any screen.'
                },
                {
                  title: 'Fast Performance',
                  description: 'Lightning-fast page loads and smooth transitions for uninterrupted reading.'
                }
              ].map((feature, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discover amazing stories and join our growing community of readers.
            </p>
            <Link href="/">
              <Button size="lg" className="px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}