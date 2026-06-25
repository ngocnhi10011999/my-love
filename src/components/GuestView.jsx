import { useEffect, useState } from 'react';
import { fetchGalleryImages } from '../services/s3.js';
import GalleryGrid from './GalleryGrid.jsx';

export default function GuestView() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchGalleryImages()
      .then((items) => !cancelled && setImages(items))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return <GalleryGrid images={images} loading={loading} error={error} />;
}
