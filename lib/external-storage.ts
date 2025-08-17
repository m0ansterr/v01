import axios from 'axios'

const UPLOAD_API_URL = process.env.EXTERNAL_STORAGE_API_URL || 'https://fileupload-api.gror5288.workers.dev/api/upload'
const API_KEY = process.env.EXTERNAL_STORAGE_API_KEY || 'bae_wafa'

export interface UploadResponse {
  result: {
    links: {
      download: string
      stream: string
      telegram: string
    }
  }
}

export async function uploadImageToExternalAPI(
  imageBuffer: Buffer, 
  filename: string
): Promise<string> {
  try {
    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: 'image/webp' })
    formData.append('file', blob, filename)

    const response = await axios.post<UploadResponse>(UPLOAD_API_URL, formData, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    })

    if (response.status === 200 && response.data.result) {
      return response.data.result.links.stream
    } else {
      throw new Error('Failed to upload image')
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    if (axios.isAxiosError(error)) {
      throw new Error(`Image upload failed: ${error.message}`)
    }
    throw new Error('Image upload failed: Unknown error')
  }
}