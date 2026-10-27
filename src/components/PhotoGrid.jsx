import PhotoCard from './PhotoCard.jsx'

/**
 * PhotoGrid — renders the grid of PhotoCard components.
 *
 * Props:
 *   photos      — array of photo objects to display
 *   favourites  — array of favourite photo IDs
 *   onToggle    — callback to toggle a favourite, invoked with photo.id
 */
function PhotoGrid({ photos, favourites, onToggle }) {
  // No photos match the search query
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-slate-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 12h18M3 21h18M3 3h18"
          />
        </svg>
        <p className="text-slate-400 text-lg font-medium">No photos found.</p>
        <p className="text-slate-600 text-sm mt-1">Try a different author name.</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      aria-label="Photo gallery grid"
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavourite={favourites.includes(photo.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export default PhotoGrid
