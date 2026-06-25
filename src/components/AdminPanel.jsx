import { useEffect, useState } from 'react';
import { fetchGalleryImages, uploadImageToS3 } from '../services/s3.js';
import GalleryGrid from './GalleryGrid.jsx';

export default function AdminPanel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      setImages(await fetchGalleryImages());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    try {
      for (const file of files) {
        await uploadImageToS3(file);
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <label
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-white cursor-pointer transition ${
            uploading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {uploading
            ? `Uploading ${progress.done}/${progress.total}…`
            : 'Upload images'}
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={reload}
          disabled={loading || uploading}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50"
        >
          Refresh
        </button>
        <span className="text-sm text-slate-500 ml-auto">
          {images.length} image{images.length === 1 ? '' : 's'}
        </span>
      </div>

      <GalleryGrid images={images} loading={loading} error={error} />
    </div>
  );
}
