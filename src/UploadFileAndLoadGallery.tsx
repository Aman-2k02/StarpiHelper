import { useState } from "react";
import ImageTileGallery from "./Image-Preview";

const UploadMedia = () => {
  const [jsonData, setJsonData] = useState<string>("");

const handleFileUpload = async (e: any) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("file", files[i]); // keep this as-is
  }

  try {

    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    console.log(json)
    setJsonData(JSON.stringify(json)); // works same as before
  } catch (err) {
    console.error("Upload error:", err);
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Media Files</h2>

      <input 
        type="file" 
        multiple 
        onChange={handleFileUpload}
        style={{ marginBottom: 20 }} 
          name="file" 
      />

      {/* Inject uploaded-result JSON into Gallery */}
      {jsonData && <ImageTileGallery injectedJson={jsonData} />}
    </div>
  );
};

export default UploadMedia;
