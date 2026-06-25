import Fancybox from './Fancybox.jsx';
import Heart from './Heart.jsx';

export default function GalleryGrid({ images, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-rose-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        Failed to load images: {error}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white/70 p-12 text-center text-rose-500 flex flex-col items-center gap-3">
        <Heart className="w-10 h-10 text-rose-300" />
        <p>No memories here yet.</p>
      </div>
    );
  }

  return (
    <Fancybox options={{ Carousel: { infinite: false } }}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <a
            key={img.key}
            href={img.url}
            data-fancybox="gallery"
            data-caption={img.key}
            className="group relative block aspect-square overflow-hidden rounded-2xl border-2 border-white bg-rose-100 shadow-md shadow-rose-200/60 ring-1 ring-rose-200 hover:ring-rose-400 hover:shadow-rose-300/70 hover:-translate-y-0.5 transition"
          >
            <img
              src={img.url}
              alt={img.key}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <span className="pointer-events-none absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-white drop-shadow-md">
              <Heart className="w-5 h-5" />
            </span>
          </a>
        ))}
      </div>
    </Fancybox>
  );
}
