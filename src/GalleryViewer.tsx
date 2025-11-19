import { useState } from "react";
import Papa from "papaparse";
import { Copy, Check } from "lucide-react";
import { toast } from "react-toastify";

const GalleryTableViewer = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
  const GIST_ID = import.meta.env.VITE_GIST_ID;
  const FILE_NAME = import.meta.env.VITE_FILE_NAME;

  const fetchLatestGistContent = async () => {
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch Gist");
      const gistData = await res.json();
      const fileContent = gistData.files[FILE_NAME]?.content;
      if (!fileContent) throw new Error("File not found in Gist");
      return fileContent;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchGistData = async () => {
    setLoading(true);
    setError("");
    try {
      const text = await fetchLatestGistContent();
      if (!text) toast.error("No Data Found !", { position: "top-right" });
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      const processedEntries = parsed.data.map((row: any) => {
        let jsonData = null;
        try {
          jsonData = JSON.parse(row.JSON.replace(/""/g, '"'));
        } catch {
          jsonData = row.JSON;
        }
        return {
          timestamp: row.Timestamp,
          title: row.Title,
          json: jsonData,
        };
      });

      setEntries(processedEntries.reverse());
    } catch (err) {
      console.error(err);
      setError("Failed to load data from Gist");
    } finally {
      setLoading(false);
    }
  };

  const copyJsonToClipboard = async (jsonData: any, index: number) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Gallery Table Viewer</h2>

      <button
        onClick={fetchGistData}
        className="btn btn-primary mb-3"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Gallery from Gist"}
      </button>

      {error && <p className="text-danger">{error}</p>}

      {entries.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{ width: "25%" }}>Timestamp</th>
                <th style={{ width: "25%" }}>Title</th>
                <th style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.timestamp}</td>
                  <td>{entry.title}</td>

                  <td>
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                      onClick={() => copyJsonToClipboard(entry.json, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check size={16} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} /> Copy JSON
                        </>
                      )}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default GalleryTableViewer;
