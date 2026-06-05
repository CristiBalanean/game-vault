import Header from './Header.jsx'
import { Outlet, useNavigate } from 'react-router-dom'

const BACKEND = 'https://game-vault-api-cq77.onrender.com/api/rawg'

function Layout() {
  const navigate = useNavigate()

  const handleSearch = async (query) => {
    const result = await fetch(`${BACKEND}/games?search=${query}&page_size=1`)
    const data = await result.json()
    if (data.results.length > 0) {
      navigate(`/game/${data.results[0].id}`)
    } else {
      navigate('/not-found')
    }
  }

  return (
    <div>
      <Header onSearch={handleSearch} />
      <Outlet />
    </div>
  )
}

export default Layout