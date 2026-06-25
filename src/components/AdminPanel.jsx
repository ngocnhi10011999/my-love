import { useEffect, useState } from 'react';
import { fetchGalleryImages, uploadImageToS3 } from '../services/s3.js';
import GalleryGrid from './GalleryGrid.jsx';
import Heart from './Heart.jsx';

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
      <div className="rounded-2xl border border-rose-200 bg-white/80 backdrop-blur p-4 flex flex-wrap items-center gap-3 shadow-sm shadow-rose-200/40">
        <label
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white cursor-pointer transition shadow-md shadow-rose-300/50 ${
            uploading
              ? 'bg-rose-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
          }`}
        >
          <Heart className="w-4 h-4" />
          {uploading
            ? `Uploading ${progress.done}/${progress.total}…`
            : 'Add memories'}
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
          className="px-4 py-2 rounded-full bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 disabled:opacity-50 transition"
        >
          Refresh
        </button>
        <span className="text-sm text-rose-500 ml-auto">
          {images.length} {images.length === 1 ? 'memory' : 'memories'}
        </span>
      </div>

      <GalleryGrid images={images} loading={loading} error={error} />
    </div>
  );
}
