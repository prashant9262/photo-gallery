/**
 * favouritesReducer — manages the favourites list using immutable state updates.
 *
 * Supported action types:
 *   TOGGLE_FAVOURITE — adds the photo ID if not present, removes it if already present.
 *   LOAD_FAVOURITES  — replaces the entire state (used to rehydrate from localStorage).
 */

export const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE'
export const LOAD_FAVOURITES = 'LOAD_FAVOURITES'

/**
 * @param {string[]} state  — array of favourite photo IDs
 * @param {{ type: string, payload: string | string[] }} action
 * @returns {string[]}
 */
function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE: {
      const id = action.payload
      // Remove if already a favourite; otherwise add it
      if (state.includes(id)) {
        return state.filter((favId) => favId !== id)
      }
      return [...state, id]
    }

    case LOAD_FAVOURITES: {
      // Replace state entirely with data loaded from localStorage
      return Array.isArray(action.payload) ? action.payload : []
    }

    default:
      return state
  }
}

export default favouritesReducer
