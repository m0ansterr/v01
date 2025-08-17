import * as poppler from 'pdf-poppler'
import sharp from 'sharp'
import { uploadImageToExternalAPI } from './external-storage'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'

export interface ProcessedPage {
  pageNumber: number
  imageUrl: string
}

export interface MPDManifest {
  episode_id: string
  title: string
  cover: string
  pages: string[]
  total_pages: number
  published: boolean
  created_at: string
}

export async function processPDFToImages(
  pdfBuffer: Buffer,
  episodeId: string,
  title: string
): Promise<{ pages: ProcessedPage[], mpd: MPDManifest }> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-processing-'))
  const pdfPath = path.join(tempDir, 'input.pdf')
  
  try {
    // Save PDF to temp file
    await fs.writeFile(pdfPath, pdfBuffer)
    
    // Convert PDF pages to images
    const options = {
      format: 'png',
      out_dir: tempDir,
      out_prefix: 'page',
      page: null // Convert all pages
    }
    
    await poppler.convert(pdfPath, options)
    
    // Get list of generated images
    const files = await fs.readdir(tempDir)
    const imageFiles = files
      .filter(file => file.startsWith('page') && file.endsWith('.png'))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/page-(\d+)\.png/)?.[1] || '0')
        const bNum = parseInt(b.match(/page-(\d+)\.png/)?.[1] || '0')
        return aNum - bNum
      })
    
    const pages: ProcessedPage[] = []
    const pageUrls: string[] = []
    
    // Process each page
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i]
      const imagePath = path.join(tempDir, imageFile)
      
      // Convert to WebP and optimize
      const webpBuffer = await sharp(imagePath)
        .webp({ 
          quality: 85,
          effort: 6,
          smartSubsample: true
        })
        .toBuffer()
      
      // Upload to external API
      const filename = `${episodeId}-page-${i + 1}.webp`
      const imageUrl = await uploadImageToExternalAPI(webpBuffer, filename)
      
      pages.push({
        pageNumber: i + 1,
        imageUrl
      })
      
      pageUrls.push(imageUrl)
    }
    
    // Create MPD manifest
    const mpd: MPDManifest = {
      episode_id: episodeId,
      title,
      cover: pageUrls[0] || '',
      pages: pageUrls,
      total_pages: pageUrls.length,
      published: true,
      created_at: new Date().toISOString()
    }
    
    return { pages, mpd }
    
  } finally {
    // Clean up temp files
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch (error) {
      console.error('Error cleaning up temp files:', error)
    }
  }
}