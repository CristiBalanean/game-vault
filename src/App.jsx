import Header from "./components/Header.jsx"
import Card from "./components/Card.jsx"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const orderings = ['-rating', '-added', '-metacritic', '-released']
const randomOrdering = orderings[Math.floor(Math.random() * orderings.length)]

function App() {

  const [games, setGames] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const URL = `https://api.rawg.io/api/games?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3&page=${page}&ordering=${randomOrdering}`
  const navigate = useNavigate()

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true)
          const result = await fetch(URL)
          const data = await result.json()
          setGames(data.results)
          setLoading(false)
      }
      fetchData()
  }, [URL])

    return (
      <div>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>Loading...</p>
        ) : (
          <div className="grid">
            {games.map(game => (
              <Card
                key={game.id}
                title={game.name}
                genre={game.genres[0]?.name}
                platform={game.platforms[0]?.platform.name}
                rating={game.rating}
                image={game.background_image}
                onClick={() => navigate(`/game/${game.id}`)}
              />
            ))}
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