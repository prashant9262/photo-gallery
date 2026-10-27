import { useState, useEffect } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

/**
 * useFetchPhotos — custom hook that fetches 30 photos from the Picsum API.
 *
 * Returns:
 *   photos  — array of photo objects from the API
 *   loading — boolean, true while the fetch is in-flight
 *   error   — Error object if the request failed, otherwise null
 */
function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // AbortController lets us cancel the fetch if the component unmounts
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`HTTP error — status: ${response.status}`)
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        // Ignore abort errors that occur when the component unmounts
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        // Only clear loading if the request was not aborted
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    // Cleanup: cancel the in-flight fetch when the component unmounts
    return () => {
      controller.abort()
    }
  }, []) // Empty dependency array — fetch only on initial mount

  return { photos, loading, error }
}

export default useFetchPhotos
