import { useState } from 'react'
import './App.css'
import ImageTileGallery from './Image-Preview'
import VideoTileGallery from './VideoTileGallery'
import './VideoTileGallery.css'
import './ImageTileGallery.css'
import GalleryViewer from './GalleryViewer'

function App() {
  return (
    <>
      <div className="page-layout">
        <ImageTileGallery />
        <VideoTileGallery />
        <GalleryViewer/>
      </div>
    </>
  )
}

export default App
