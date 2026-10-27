/**
 * PhotoCard — renders a single photo with the author name and a heart toggle button.
 *
 * Props:
 *   photo        — photo object { id, author, download_url }
 *   isFavourite  — boolean, whether this photo is currently a favourite
 *   onToggle     — callback invoked with photo.id when the heart is clicked
 */
function PhotoCard({ photo, isFavourite, onToggle }) {
  const { id, author, download_url } = photo

  // Use a smaller image for rendering performance (600×400 from Picsum)
  const imgSrc = `https://picsum.photos/id/${id}/600/400`

  return (
    <article
      className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-violet-500/20 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1"
      aria-label={`Photo by ${author}`}
    >
      {/* Photo */}
      <div className="relative overflow-hidden aspect-video bg-slate-700">
        <img
          src={imgSrc}
          alt={`Photo by ${author}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Heart button overlay */}
        <button
          id={`fav-btn-${id}`}
          onClick={() => onToggle(id)}
          aria-label={isFavourite ? `Remove photo by ${author} from favourites` : `Add photo by ${author} to favourites`}
          aria-pressed={isFavourite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 ${
            isFavourite
              ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/40'
              : 'bg-slate-900/60 text-slate-300 hover:bg-rose-500/80 hover:text-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? 0 : 2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Author name */}
      <div className="px-4 py-3">
        <p className="text-slate-100 text-sm font-medium truncate" title={author}>
          {author}
        </p>
      </div>
    </article>
  )
}

export default PhotoCard
