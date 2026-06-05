import styles from './Header.module.css'
import { Gamepad2, Search, X, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ADULT_TAGS } from '../constants.js'

const BACKEND = 'https://game-vault-api-cq77.onrender.com/api/rawg'

function Header({ onSearch }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [searchExpanded, setSearchExpanded] = useState(false)
  const debounceTimer = useRef(null)
  const inputRef = useRef(null)

  const filterAdult = (results) =>
    (results || []).filter(game => !game.tags?.some(tag => ADULT_TAGS.includes(tag.slug)))

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      const result = await fetch(`${BACKEND}/games?search=${query}&page_size=5`)
      const data = await result.json()
      setSuggestions(filterAdult(data.results))
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

  const handleSearchIconClick = () => {
    setSearchExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleCollapse = () => {
    setSearchExpanded(false)
    setQuery('')
    setSuggestions([])
  }

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestions([])
      if (!query.trim()) setSearchExpanded(false)
    }, 150)
  }

  return (
    <div className={styles.header}>
      <div className={`${styles.inner} ${searchExpanded ? styles.searchActive : ''}`}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Gamepad2 color="#6c63ff" size={26} />
          <h1>GameVault</h1>
        </div>
        <div className={`${styles.searchWrapper} ${searchExpanded ? styles.expanded : ''}`}>
          <form className={styles.searchBar} onSubmit={handleSubmit}>
            <Search size={16} color="#aaa" onClick={!searchExpanded ? handleSearchIconClick : undefined} style={!searchExpanded ? { cursor: 'pointer' } : {}} />
            <input
              ref={inputRef}
              type="text"
              placeholder={searching ? 'Searching...' : 'Search games...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={searching}
              onBlur={handleBlur}
              onFocus={() => {
                if (query.trim().length >= 2) {
                  fetch(`${BACKEND}/games?search=${query}&page_size=5`)
                    .then(res => res.json())
                    .then(data => setSuggestions(filterAdult(data.results)))
                }
              }}
            />
            {searchExpanded && (
              <X size={16} color="#aaa" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={handleCollapse} />
            )}
          </form>
          {suggestions.length > 0 && (
            <div className={styles.dropdown}>
              {suggestions.map(game => (
                <div key={game.id} className={styles.suggestion} onClick={() => handleSuggestionClick(game)}>
                  <img src={game.background_image} alt={game.name} className={styles.suggestionImage} />
                  <span>{game.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.right}>
          <div className={styles.backlogLink} onClick={() => navigate('/backlog')}>
            <Bookmark size={16} color="#aaa" />
            <span>My Backlog</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header