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
        <GalleryViewer />
        <footer style={{ textAlign: "center", padding: "15px", fontSize: "14px", color: "#666" }}>
          © 2025–2026 Synoverge Technologies. All rights reserved.<br />
          Credits: Aman Khan (<a href="mailto:aman.khan@synoverge.com">aman.khan@synoverge.com</a>),
          Adarsh Jain (<a href="mailto:adarsh.jain@synoverge.com">adarsh.jain@synoverge.com</a>)
        </footer>

      </div>
    </>
  )
}

export default App
