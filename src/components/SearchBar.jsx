/**
 * SearchBar — controlled input that calls onSearch as the user types.
 *
 * Props:
 *   query    — current search string (controlled value)
 *   onSearch — callback (from useCallback in App) invoked with the new value
 */
function SearchBar({ query, onSearch }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        {/* Search icon */}
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </span>

        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by author name…"
          aria-label="Search photos by author name"
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  )
}

export default SearchBar
