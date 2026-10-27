import { useState, useReducer, useCallback, useMemo, useEffect } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos.js'
import favouritesReducer, { TOGGLE_FAVOURITE, LOAD_FAVOURITES } from './reducers/favouritesReducer.js'
import SearchBar from './components/SearchBar.jsx'
import PhotoGrid from './components/PhotoGrid.jsx'

const STORAGE_KEY = 'photo-gallery-favourites'

/**
 * Safely read favourites from localStorage.
 * Returns an empty array if the stored value is missing or invalid JSON.
 */
function loadFavouritesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  // ─── Search state ────────────────────────────────────────────────────────────
  const [query, setQuery] = useState('')

  // ─── Fetch photos via custom hook (Requirement 6) ────────────────────────────
  const { photos, loading, error } = useFetchPhotos()

  // ─── Favourites managed with useReducer (Requirement 5) ──────────────────────
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [], // start empty; we'll rehydrate from localStorage in an effect below
  )

  // Rehydrate favourites from localStorage after initial render
  useEffect(() => {
    const saved = loadFavouritesFromStorage()
    if (saved.length > 0) {
      dispatch({ type: LOAD_FAVOURITES, payload: saved })
    }
  }, [])

  // Persist favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  }, [favourites])

  // ─── useCallback for the search handler (Requirement 7) ──────────────────────
  //
  // useCallback memoises the function reference so that SearchBar does not
  // receive a new function object on every render, avoiding unnecessary
  // re-renders of the input component.
  const handleSearch = useCallback((value) => {
    setQuery(value)
  }, []) // No external dependencies — setQuery is stable from useState

  // ─── useCallback for the favourite toggle handler ─────────────────────────────
  //
  // Similarly memoised so PhotoCard components do not re-render unnecessarily.
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: TOGGLE_FAVOURITE, payload: id })
  }, []) // dispatch is stable from useReducer

  // ─── useMemo for filtered photos (Requirement 7) ──────────────────────────────
  //
  // Recalculates the filtered list only when `photos` or `query` changes.
  // Without useMemo this filtering would run on every render, even when
  // neither value has changed (e.g. after a re-render triggered by something
  // unrelated, such as a favourites toggle).-
  const filteredPhotos = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return photos
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    )
  }, [photos, query])

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h18m-18 0a.75.75 0 01-.75-.75V4.5A.75.75 0 013 3.75h18a.75.75 0 01.75.75V9a.75.75 0 01-.75.75m-18 0h18"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-100 tracking-tight">
              Photo Gallery
            </h1>
          </div>

          {/* Favourites counter */}
          {favourites.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-rose-400 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {favourites.length} favourite{favourites.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <p className="text-slate-400 text-sm">
            Browse beautiful photos · Search by author · Save your favourites
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <SearchBar query={query} onSearch={handleSearch} />
        </div>

        {/* Loading state */}
        {loading && (
          <div
            className="flex flex-col items-center justify-center py-24"
            aria-live="polite"
            aria-busy="true"
          >
            <div
              className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin"
              role="status"
              aria-label="Loading photos"
            />
            <p className="mt-4 text-slate-400 text-sm">Loading photos…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            role="alert"
            aria-live="assertive"
          >
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-red-400 font-medium text-lg">Failed to load photos</p>
            <p className="text-slate-500 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Gallery — only shown when data is available */}
        {!loading && !error && (
          <>
            {/* Result count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-500 text-sm">
                {query.trim()
                  ? `${filteredPhotos.length} result${filteredPhotos.length !== 1 ? 's' : ''} for "${query.trim()}"`
                  : `${photos.length} photos`}
              </p>
            </div>

            <PhotoGrid
              photos={filteredPhotos}
              favourites={favourites}
              onToggle={handleToggleFavourite}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 py-6">
        <p className="text-center text-slate-600 text-xs">
          Photos via{' '}
          <a
            href="https://picsum.photos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Picsum Photos
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
