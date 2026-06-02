import styles from './Header.module.css'
import { Gamepad2, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function Header({ onSearch }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const debounceTimer = useRef(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    // clear previous timer
    clearTimeout(debounceTimer.current)

    // wait 400ms after user stops typing
    debounceTimer.current = setTimeout(async () => {
      const result = await fetch(`https://api.rawg.io/api/games?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3&search=${query}&page_size=5`)
      const data = await result.json()
      setSuggestions(data.results || [])
    }, 400)

    return () => clearTimeout(debounceTimer.current)
  }, [query])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSuggestions([])
      setSearching(true)
      await onSearch(query)
      setSearching(false)
      setQuery('')
    }
  }

  const handleSuggestionClick = (game) => {
    setSuggestions([])
    setQuery('')
    navigate(`/game/${game.id}`)
  }

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Gamepad2 color="#6c63ff" size={26} />
          <h1>GameVault</h1>
        </div>
        <div className={styles.searchWrapper}>
          <form className={styles.searchBar} onSubmit={handleSubmit}>
            <Search size={16} color="#aaa" />
            <input
                type="text"
                placeholder={searching ? 'Searching...' : 'Search games...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={searching}
                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                onFocus={() => {
                    if (query.trim().length >= 2) {
                        fetch(`https://api.rawg.io/api/games?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3&search=${query}&page_size=5`)
                            .then(res => res.json())
                            .then(data => setSuggestions(data.results || []))
                    }
                }}
            />
          </form>
          {suggestions.length > 0 && (
            <div className={styles.dropdown}>
              {suggestions.map(game => (
                <div
                  key={game.id}
                  className={styles.suggestion}
                  onClick={() => handleSuggestionClick(game)}
                >
                  <img src={game.background_image} alt={game.name} className={styles.suggestionImage} />
                  <span>{game.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.right}></div>
      </div>
    </div>
  )
}

export default Header