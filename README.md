# 📚 Manhwa PDF Reader

A mobile-first web application for reading manhwa episodes converted from PDF files. Built with Next.js, Supabase, and optimized for touch interactions.

## ✨ Features

- **Admin Panel**: Upload PDF episodes with drag-and-drop interface
- **PDF Processing**: Automatic conversion from PDF to optimized WebP images
- **External Storage**: Integration with file upload API for image hosting
- **MPD Manifests**: Streaming-like episode manifests for optimal loading
- **Mobile-First Reader**: Swipe gestures, touch controls, and full-screen reading
- **Performance Optimized**: Image preloading, caching, and lazy loading
- **Responsive Design**: Works seamlessly across all devices
- **Security**: Prevents PDF downloading and unauthorized access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- External file storage API access

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Click "Connect to Supabase" in the top right of this interface
   - The database schema will be automatically created

3. **Configure environment variables:**
   - Update `.env.local` with your Supabase credentials
   - The upload API is pre-configured with the provided endpoint

4. **Run the development server:**
   ```bash
   npm run dev
   ```

### Database Setup

The application will automatically create the required database schema when you connect to Supabase. The schema includes:

- **Episodes table**: Stores episode metadata
- **Row Level Security**: Ensures secure access to data
- **Indexes**: Optimized for fast queries

## 📖 Usage

### Admin Panel (`/admin`)

1. Navigate to `/admin`
2. Fill in episode title and optional description
3. Drag and drop a PDF file or click to select
4. Click "Upload Episode" - the system will:
   - Convert PDF pages to optimized WebP images
   - Upload images to external storage
   - Generate and upload an MPD manifest file
   - Save episode metadata to the database

### Reading Episodes

1. Browse episodes on the homepage
2. Click on an episode to start reading
3. Use touch gestures:
   - **Swipe left/right**: Navigate between pages
   - **Tap left side**: Go to previous page
   - **Tap right side**: Go to next page
   - **Tap center**: Toggle controls visibility

### Features

- **Progress Tracking**: Automatically saves your reading position
- **Image Preloading**: Smooth page transitions
- **Responsive Controls**: Auto-hiding navigation controls
- **Performance Optimized**: WebP images with quality optimization

## 🛠️ Technology Stack

- **Frontend**: Next.js 13+ (App Router), React, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **PDF Processing**: pdf-poppler, Sharp
- **Image Storage**: External file upload API
- **Animations**: Framer Motion
- **Touch Gestures**: react-swipeable

## 🔧 Configuration

### External Storage API

The app uses a file upload API for storing processed images:
- **Endpoint**: `https://fileupload-api.gror5288.workers.dev/api/upload`
- **API Key**: Pre-configured in the code
- **Supported formats**: WebP, PNG, JPEG

### Optimization Settings

- **Image Quality**: 85% WebP compression
- **Smart Subsample**: Enabled for better compression
- **Preloading**: Next 2-3 pages for smooth navigation

## 📱 Mobile Optimization

- **Touch-First**: Optimized for mobile reading
- **PWA Ready**: Installable web app
- **Offline Capable**: Cached images for better performance
- **Portrait Mode**: Designed for mobile portrait orientation

## 🔒 Security Features

- **PDF Protection**: Original PDFs are not stored or accessible
- **RLS Security**: Database-level access control
- **Image URLs**: External storage with secure access
- **Admin Access**: Separate admin interface

## 🚀 Deployment

The application is configured for easy deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel, Netlify, or your preferred platform**

3. **Configure environment variables** on your hosting platform

## 📁 Project Structure

```
├── app/
│   ├── admin/              # Admin panel
│   ├── read/[episode_id]/  # Episode reader
│   ├── api/                # API routes
│   └── page.tsx            # Homepage
├── components/
│   ├── admin/              # Admin components
│   ├── reader/             # Reader components
│   ├── home/               # Homepage components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── supabase.ts         # Database client
│   ├── pdf-processor.ts    # PDF conversion logic
│   └── external-storage.ts # File upload integration
└── supabase/
    └── migrations/         # Database migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).