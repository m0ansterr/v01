'use client'

import { StorybookGrid } from '@/components/home/storybook-grid'
import { SearchBar } from '@/components/search/search-bar'
import { Button } from '@/components/ui/button'
import { BookOpen, Upload, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StoryVerse
                </h1>
                <p className="text-xs text-muted-foreground">Digital Stories</p>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">
                News
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary mr-3 animate-pulse" />
              <h2 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                StoryVerse
              </h2>
              <Sparkles className="h-8 w-8 text-secondary ml-3 animate-pulse delay-500" />
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Dive into enchanting digital storybooks with immersive reading experiences. 
              Discover tales that come alive with stunning visuals, interactive elements, and seamless navigation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { icon: BookOpen, text: 'Interactive Stories', color: 'text-blue-600' },
                { icon: Search, text: 'Smart Search', color: 'text-green-600' },
                { icon: Sparkles, text: 'Immersive Experience', color: 'text-purple-600' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border"
                >
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-y bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Find Your Next Adventure</h3>
                <p className="text-muted-foreground">Search through our collection of amazing storybooks</p>
              </div>
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Storybooks Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StorybookGrid />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 mt-20 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StoryVerse
            </span>
          </div>
          <div className="flex justify-center space-x-8 mb-6">
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/news" className="hover:text-primary transition-colors">News</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>
          <p className="text-sm">© 2025 StoryVerse. Crafted with ❤️ using Next.js and Supabase.</p>
          <p className="text-xs mt-2">Where stories come alive in the digital realm</p>
        </div>
      </footer>
    </div>
  )
}