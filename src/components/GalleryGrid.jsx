import Fancybox from './Fancybox.jsx';

export default function GalleryGrid({ images, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
        Failed to load images: {error}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        No images yet.
      </div>
    );
  }

  return (
    <Fancybox options={{ Carousel: { infinite: false } }}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img) => (
          <a
            key={img.key}
            href={img.url}
            data-fancybox="gallery"
            data-caption={img.key}
            className="group block aspect-square overflow-hidden rounded-lg bg-slate-100"
          >
            <img
              src={img.url}
              alt={img.key}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </Fancybox>
  );
}
