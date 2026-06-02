import Header from './Header.jsx'
import { Outlet, useNavigate } from 'react-router-dom'

function Layout() {
  const navigate = useNavigate()

  const handleSearch = async (query) => {
    const result = await fetch(`https://api.rawg.io/api/games?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3&search=${query}&page_size=1`)
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