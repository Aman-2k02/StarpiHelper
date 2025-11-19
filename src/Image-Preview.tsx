import { useState, useEffect } from 'react';
import { Copy, Check, FileText, Upload, AlertCircle } from 'lucide-react';
import './ImageTileGallery.css';

const ImageTileGallery = ({ injectedJson }: { injectedJson?: string }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [jsonInputTitle, setJsonInputTitle] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(true);

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // For Vite
  const GIST_ID = import.meta.env.VITE_GIST_ID;
  const FILE_NAME = import.meta.env.VITE_FILE_NAME;

  useEffect(() => {
    if (injectedJson) {
      try {
        const parsed = JSON.parse(injectedJson);
        setData(Array.isArray(parsed) ? parsed : [parsed]);
        setShowInput(false);
      } catch {
        console.log("Invalid injected JSON");
      }
    }
  }, [injectedJson]);

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      setData(dataArray);
      setError('');
      setShowInput(false);

      appendToGist(dataArray, jsonInputTitle);
    } catch {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const copyToClipboard = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'file';
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const resetGallery = () => {
    setData([]);
    setJsonInput('');
    setShowInput(true);
    setError('');
  };

  const appendToGist = async (jsonData: any, title: string) => {
    const timestamp = new Date().toISOString();
    const jsonString = JSON.stringify(jsonData).replace(/"/g, '""');
    const newEntry = `"${timestamp}","${title}","${jsonString}"\n`;

    const getResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    const gistData = await getResponse.json();
    const currentContent = gistData.files[FILE_NAME]?.content || `"Timestamp","Title","JSON"\n`;

    const updatedContent = currentContent + newEntry;

    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: { content: updatedContent }
        }
      })
    });

    console.log("Gist updated successfully!");
  };

  return (
    <div className="gallery-container">
      <div className="gallery-wrapper">
        <div className="gallery-header">
          <h1 className="gallery-title">Asset Gallery</h1>
          {data.length > 0 && (
            <button onClick={resetGallery} className="btn-reset">
              Load New Data
            </button>
          )}
        </div>

        {/* JSON Input Section */}
        {showInput && (
          <div className="input-section">
            <div className="input-header">
              <Upload size={24} />
              <h2 className="input-title">Load JSON Data</h2>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here, e.g.:
[
  {
    "defaultImageURL": "https://example.com/image.jpg",
    "isResized": false,
    "imageURLs": ["https://example.com/image.jpg"]
  }
]'
              className="json-textarea"
            />

            <textarea
              value={jsonInputTitle}
              onChange={(e) => setJsonInputTitle(e.target.value)}
              placeholder='Title'
              className="json-textarea"
            />
            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <button onClick={handleJsonSubmit} className="btn-load">
              Load Gallery
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {data.length > 0 && (
          <div className="gallery-grid">
            {data.map((item: any, index) => {
              const defaultImageURL = item?.defaultImageURL ?? '';
              const imageURLs = Array.isArray(item?.imageURLs) ? item.imageURLs : [];
              const firstImageURL = imageURLs[0] ?? '';

              return (
                <div key={index} className="gallery-card">
                  <div className="preview-container">
                    {isImageUrl(firstImageURL) ? (
                      <img
                        src={firstImageURL}
                        alt={`Asset ${index + 1}`}
                        className="preview-image"
                      />
                    ) : (
                      <div className="preview-fallback">
                        <FileText size={64} strokeWidth={1.5} />
                        <p>PDF Document</p>
                      </div>
                    )}
                  </div>

                  <div className="card-content">
                    <p className="file-name" title={getFileName(defaultImageURL)}>
                      {getFileName(defaultImageURL)}
                    </p>

                    <button
                      onClick={() => copyToClipboard(defaultImageURL, index)}
                      className="btn-copy"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check size={18} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Copy URL
                        </>
                      )}
                    </button>

                    <div className="url-display">{defaultImageURL}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!showInput && data.length === 0 && (
          <div className="empty-state">
            <FileText size={64} />
            <p>No assets to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTileGallery;
