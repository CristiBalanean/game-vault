import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './GamePage.module.css'

function GamePage (){
    const { id } = useParams()
    const [game, setGame] = useState(null)

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3`)
            .then(res => res.json())
            .then(data => setGame(data))
    }, [id])

    if(!game) return <p style={{ textAlign: 'center', padding: '60px', color: '#aaa', fontSize: '18px' }}>Loading...</p>

    const parseRequirements = (text) => {
        if (!text) return {}
        const fields = {}
        const patterns = [
            { key: 'OS', regex: /OS:\s*([^\n]+)/ },
            { key: 'Processor', regex: /Processor:\s*([^\n]+)/ },
            { key: 'Memory', regex: /Memory:\s*([^\n]+)/ },
            { key: 'Graphics', regex: /Graphics:\s*([^\n]+)/ },
            { key: 'Storage', regex: /Storage:\s*([^\n]+)/ },
        ]
        patterns.forEach(({ key, regex }) => {
            const match = text.match(regex)
            if (match) fields[key] = match[1].trim()
        })
        return fields
    }

    return(
         <div className={styles.page}>
            <img className={styles.image} alt={game.name} src={game.background_image} />
            <div className={styles.content}>
                <h1 className={styles.title}>{game.name}</h1>
                <div className={styles.ratingRow}>
                    <span className={styles.rating}>⭐ {game.rating}</span>
                    <span className={styles.metacritic}>Metacritic: {game.metacritic}</span>
                </div>
                <div className={styles.genres}>
                    {game.genres.map(g => <span className={styles.genreTag} key={g.id}>{g.name}</span>)}
                </div>
                <div className={styles.platforms}>
                    {game.platforms.map(p => (
                        <span key={p.platform.id} className={styles.platformTag}>
                            {p.platform.name}
                        </span>
                    ))}
                </div>
                <p className={styles.developer}>Developer: {game.developers.map(d => d.name).join(', ')}</p>
                <p className={styles.released}>Released: {game.released}</p>
                <div className={styles.about}>
                    <h3>About</h3>
                    <p>{game.description_raw}</p>
                </div>
                {(() => {
                    const reqs = parseRequirements(
                        game.platforms.find(p => p.platform.name === 'PC')?.requirements?.minimum
                    )
                    return Object.keys(reqs).length > 0 && (
                        <div className={styles.about}>
                            <h3>Minimum System Requirements</h3>
                            <div className={styles.specsGrid}>
                                {Object.entries(reqs).map(([label, value]) => (
                                    <div key={label} className={styles.specItem}>
                                        <span className={styles.specLabel}>{label}</span>
                                        <span className={styles.specValue}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })()}
            </div>
        </div>
    );
}

export default GamePage;