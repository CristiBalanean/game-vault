import Header from "./components/Header.jsx"
import Card from "./components/Card.jsx"
import SkeletonCard from "./components/SkeletonCard.jsx"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ADULT_TAGS } from './constants.js'
import useBacklog from './hooks/useBacklog.js'

const BACKEND = 'https://game-vault-api-cq77.onrender.com/api/rawg'

const ORDERINGS = [
  { label: 'Top Rated', value: '-rating' },
  { label: 'Most Popular', value: '-added' },
  { label: 'Metacritic', value: '-metacritic' },
  { label: 'Newest', value: '-released' },
  { label: 'Oldest', value: 'released' },
]

function App() {

  const [games, setGames] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [genres, setGenres] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [ordering, setOrdering] = useState('-added')
  const { isInBacklog, toggleGame } = useBacklog()

  const URL = `${BACKEND}?endpoint=games&page=${page}&ordering=${ordering}&exclude_additions=true&ratings_count=5${selectedGenre ? `&genres=${selectedGenre}` : ''}${selectedPlatform ? `&platforms=${selectedPlatform}` : ''}`
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BACKEND}?endpoint=genres`)
      .then(res => res.json())
      .then(data => setGenres(data.results || []))

    fetch(`${BACKEND}?endpoint=platforms&ordering=-games_count&page_size=20`)
      .then(res => res.json())
      .then(data => setPlatforms(data.results || []))
  }, [])

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true)
          setError(false)
          setGames([])
          try {
              const result = await fetch(URL)
              if (!result.ok) throw new Error('Failed to fetch')
              const data = await result.json()
              const filtered = (data.results || []).filter(game =>
                  !game.tags?.some(tag => ADULT_TAGS.includes(tag.slug))
              )
              setGames(filtered)
          } catch (err) {
              setError(true)
          } finally {
              setLoading(false)
          }
      }
      fetchData()
  }, [URL])

  const handleGenreSelect = (e) => {
    const value = e.target.value
    setSelectedGenre(value === 'all' ? null : value)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlatformSelect = (e) => {
    const value = e.target.value
    setSelectedPlatform(value === 'all' ? null : value)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOrderingSelect = (e) => {
    setOrdering(e.target.value)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="toolbar">
        <select className="genre-select" onChange={handleGenreSelect} value={selectedGenre || 'all'}>
          <option value="all">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.slug}>{genre.name}</option>
          ))}
        </select>
        <select className="genre-select" onChange={handlePlatformSelect} value={selectedPlatform || 'all'}>
          <option value="all">All Platforms</option>
          {platforms.map(platform => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
        <select className="genre-select" onChange={handleOrderingSelect} value={ordering}>
          {ORDERINGS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="error-state">
          <p>Something went wrong. Please try again.</p>
          <button onClick={() => setError(false) || setPage(p => p)}>Retry</button>
        </div>
      ) : (
        <div className="grid">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
            : games.map(game => (
                <Card
                  key={game.id}
                  title={game.name}
                  genre={game.genres?.[0]?.name}
                  platform={game.platforms?.[0]?.platform.name}
                  rating={game.rating}
                  image={game.background_image}
                  onClick={() => navigate(`/game/${game.id}`)}
                  inBacklog={isInBacklog(game.id)}
                  onToggleBacklog={() => toggleGame({
                    id: game.id,
                    name: game.name,
                    background_image: game.background_image,
                    genres: game.genres,
                    platforms: game.platforms,
                    rating: game.rating
                  })}
                />
              ))
          }
        </div>
      )}

      <div className="load-more">
        <button onClick={() => { setPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }} disabled={page === 1 || loading}>
            ← Previous
        </button>
        <span className="page-indicator">Page {page}</span>
        <button onClick={() => { setPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }} disabled={loading}>
            Next →
        </button>
      </div>
    </div>
  )
}

export default App