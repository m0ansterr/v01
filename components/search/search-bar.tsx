'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function SearchBar() {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for magical stories, adventures, romance..."
            className="pl-12 pr-4 py-3 text-lg border-2 border-muted focus:border-primary rounded-xl bg-background/50 backdrop-blur-sm"
          />
          <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-pulse" />
        </div>
        
        <Button size="lg" className="px-6 rounded-xl">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </motion.div>
  )
}