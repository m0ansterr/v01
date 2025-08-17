import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { processPDFToImages } from '@/lib/pdf-processor'
import { uploadImageToExternalAPI } from '@/lib/external-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const tagsJson = formData.get('tags') as string
    const readingTimeStr = formData.get('reading_time') as string

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'File, title, and category are required' },
        { status: 400 }
      )
    }

    let tags: string[] = []
    try {
      tags = JSON.parse(tagsJson || '[]')
    } catch (error) {
      tags = []
    }

    const readingTime = parseInt(readingTimeStr) || 5

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Generate episode ID
    const episodeId = `ep-${Date.now()}`
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const pdfBuffer = Buffer.from(arrayBuffer)
    
    // Process PDF to images
    const { pages, mpd } = await processPDFToImages(pdfBuffer, episodeId, title)
    
    // Upload MPD manifest as JSON file
    const mpdBuffer = Buffer.from(JSON.stringify(mpd, null, 2))
    const mpdUrl = await uploadImageToExternalAPI(mpdBuffer, `${episodeId}-manifest.json`)
    
    // Save episode to database
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: episode, error } = await supabase
      .from('episodes')
      .insert({
        episode_id: episodeId,
        title,
        description,
        category,
        tags,
        cover_image: pages[0]?.imageUrl,
        pages: pages.length,
        reading_time: readingTime,
        mpd_url: mpdUrl,
        published: true
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save episode to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      episode,
      pages_processed: pages.length
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    )
  }
}