import styles from './Backlog.module.css'
import Card from './Card.jsx'
import { useNavigate } from 'react-router-dom'
import useBacklog from '../hooks/useBacklog.js'
import { Bookmark } from 'lucide-react'

function Backlog() {
    const navigate = useNavigate()
    const { backlog, isInBacklog, toggleGame } = useBacklog()

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>My Backlog</h1>

            {backlog.length === 0 ? (
                <div className={styles.empty}>
                    <Bookmark size={48} color="#444" />
                    <p>No games saved yet.</p>
                    <button onClick={() => navigate('/')}>Browse Games</button>
                </div>
            ) : (
                <div className="grid">
                    {backlog.map(game => (
                        <Card
                            key={game.id}
                            title={game.name}
                            genre={game.genres?.[0]?.name}
                            platform={game.platforms?.[0]?.platform.name}
                            rating={game.rating}
                            image={game.background_image}
                            onClick={() => navigate(`/game/${game.id}`)}
                            inBacklog={isInBacklog(game.id)}
                            onToggleBacklog={() => toggleGame(game)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Backlog