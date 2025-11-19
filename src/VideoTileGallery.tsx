import { useState, useEffect } from 'react';
import { Copy, Check, Upload, AlertCircle } from 'lucide-react';
import './VideoTileGallery.css';

interface VideoItem {
  title: string;
  url: string;
}

const VideoTileGallery = ({ injectedHtml }: { injectedHtml?: string }) => {
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedUrlIndex, setCopiedUrlIndex] = useState<number | null>(null);
  const [htmlInput, setHtmlInput] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(true);

  const parseHtmlToVideos = (htmlString: string) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      const links = Array.from(tempDiv.querySelectorAll('li a'));
      const videoArray: VideoItem[] = links.map(link => ({
        title: link.textContent || 'Untitled Video',
        url: link.getAttribute('href') || ''
      }));
      setVideos(videoArray);
      setError('');
      setShowInput(false);
    } catch (err) {
      setError('Invalid HTML input. Please check your input.');
    }
  };

  const handleHtmlSubmit = () => {
    parseHtmlToVideos(htmlInput);
  };

  useEffect(() => {
    if (injectedHtml) {
      parseHtmlToVideos(injectedHtml);
    }
  }, [injectedHtml]);

  const copyToClipboard = async (text: string, type: 'title' | 'url', index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'title') setCopiedTitleIndex(index);
      else setCopiedUrlIndex(index);

      setTimeout(() => {
        if (type === 'title') setCopiedTitleIndex(null);
        else setCopiedUrlIndex(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetGallery = () => {
    setVideos([]);
    setHtmlInput('');
    setShowInput(true);
    setError('');
  };

  return (
    <div className="gallery-container">
      <div className="gallery-wrapper">
        <div className="gallery-header">
          <h1 className="gallery-title">Video Gallery</h1>
          {videos.length > 0 && (
            <button onClick={resetGallery} className="btn-reset">
              Load New Data
            </button>
          )}
        </div>

        {/* HTML Input Section */}
        {showInput && (
          <div className="input-section">
            <div className="input-header">
              <Upload size={24} />
              <h2 className="input-title">Load HTML Data</h2>
            </div>

            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder='Paste your <ul><li><a> HTML here'
              className="json-textarea"
            />

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <button onClick={handleHtmlSubmit} className="btn-load">
              Load Gallery
            </button>
          </div>
        )}

        {/* Video Table */}
        {videos.length > 0 && (
          <table className="video-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Copy Title</th>
                <th>URL</th>
                <th>Copy URL</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{video.title}</td>
                  <td>
                    <button
                      onClick={() => copyToClipboard(video.title, 'title', index)}
                      className="btn-copy"
                    >
                      {copiedTitleIndex === index ? (
                        <>
                          <Check size={16} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} /> Copy
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      {video.url}
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => copyToClipboard(video.url, 'url', index)}
                      className="btn-copy"
                    >
                      {copiedUrlIndex === index ? (
                        <>
                          <Check size={16} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} /> Copy
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Empty State */}
        {!showInput && videos.length === 0 && (
          <div className="empty-state">
            <p>No videos to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTileGallery;
