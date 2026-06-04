import Header from "./components/Header.jsx"
import Card from "./components/Card.jsx"
import SkeletonCard from "./components/SkeletonCard.jsx"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ADULT_TAGS } from './constants.js'

const orderings = ['-rating', '-added', '-metacritic', '-released']
const randomOrdering = orderings[Math.floor(Math.random() * orderings.length)]
const ADULT_TAGS = ['nsfw', 'adult', 'hentai', 'nudity', 'sexual-content', '18+', 'eroge', 'porn']

function App() {

  const [games, setGames] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)

  const URL = `https://api.rawg.io/api/games?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3&page=${page}&ordering=${randomOrdering}&exclude_additions=true&ratings_count=5${selectedGenre ? `&genres=${selectedGenre}` : ''}`
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://api.rawg.io/api/genres?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3')
      .then(res => res.json())
      .then(data => setGenres(data.results || []))
  }, [])

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true)
          const result = await fetch(URL)
          const data = await result.json()
          const filtered = (data.results || []).filter(game =>
              !game.tags?.some(tag => ADULT_TAGS.includes(tag.slug))
          )
          setGames(filtered)
          setLoading(false)
      }
      fetchData()
  }, [URL])

  const handleGenreSelect = (e) => {
    const value = e.target.value
    setSelectedGenre(value === 'all' ? null : value)
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
      </div>

      <div className="grid">
        {loading
          ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
          : games.map(game => (
              <Card
                key={game.id}
                title={game.name}
                genre={game.genres[0]?.name}
                platform={game.platforms[0]?.platform.name}
                rating={game.rating}
                image={game.background_image}
                onClick={() => navigate(`/game/${game.id}`)}
              />
            ))
        }
      </div>
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