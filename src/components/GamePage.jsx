import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './GamePage.module.css'

function GamePage() {
    const { id } = useParams()
    const [game, setGame] = useState(null)
    const [steamData, setSteamData] = useState(null)
    const [selectedScreenshot, setSelectedScreenshot] = useState(null)

    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3`)
            .then(res => res.json())
            .then(async data => {
                setGame(data)

                const storesRes = await fetch(`https://api.rawg.io/api/games/${id}/stores?key=1dd4eaf9b8ca4c46b9b1e5794e348ea3`)
                const storesData = await storesRes.json()

                const steamStore = storesData.results?.find(s => s.store_id === 1)
                const steamId = steamStore?.url?.match(/app\/(\d+)/)?.[1]

                if (steamId) {
                    try {
                        const steamRes = await fetch(`https://game-vault-api-cq77.onrender.com/api/steam/${steamId}`)
                        const steamParsed = await steamRes.json()
                        if (steamParsed[steamId]?.success) {
                            setSteamData(steamParsed[steamId].data)
                        }
                    } catch (err) {
                        console.log('Steam error:', err)
                    }
                }
            })
    }, [id])

    if (!game) return <p style={{ textAlign: 'center', padding: '60px', color: '#aaa', fontSize: '18px' }}>Loading...</p>

    const parseRequirements = (text) => {
        if (!text) return {}
        const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        const fields = {}
        const patterns = [
            { key: 'OS', regex: /OS:\s*([^:]+?)(?=\s*Processor:|$)/ },
            { key: 'Processor', regex: /Processor:\s*([^:]+?)(?=\s*Memory:|$)/ },
            { key: 'Memory', regex: /Memory:\s*([^:]+?)(?=\s*Graphics:|$)/ },
            { key: 'Graphics', regex: /Graphics:\s*([^:]+?)(?=\s*Storage:|$)/ },
            { key: 'Storage', regex: /Storage:\s*([^:]+?)(?=\s*Sound Card:|Additional Notes:|$)/ },
        ]
        patterns.forEach(({ key, regex }) => {
            const match = stripped.match(regex)
            if (match) fields[key] = match[1].trim()
        })
        return fields
    }

    const cleanSteamAbout = steamData?.about_the_game?.replace(/<[^>]+>/g, '').trim()
    const about = (cleanSteamAbout && cleanSteamAbout.length > 10)
        ? cleanSteamAbout
        : game.description_raw

    const steamScreenshots = steamData?.screenshots?.map(s => ({ id: s.id, image: s.path_full }))
    const rawgScreenshots = game.short_screenshots?.slice(1)
    const screenshots = (steamScreenshots && steamScreenshots.length > 0) ? steamScreenshots : rawgScreenshots

    const requirements = parseRequirements(
        steamData?.pc_requirements?.minimum ||
        game.platforms.find(p => p.platform.name === 'PC')?.requirements?.minimum
    )

    return (
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
                    <p>{about}</p>
                </div>

                {screenshots && screenshots.length > 0 && (
                    <div className={styles.screenshots}>
                        <h3>Screenshots</h3>
                        <div className={styles.screenshotsGrid}>
                            {screenshots.map((screenshot, index) => (
                                <img
                                    key={screenshot.id}
                                    src={screenshot.image}
                                    alt="screenshot"
                                    className={styles.screenshot}
                                    onClick={() => setSelectedScreenshot(index)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {Object.keys(requirements).length > 0 && (
                    <div className={styles.about}>
                        <h3>Minimum System Requirements</h3>
                        <div className={styles.specsGrid}>
                            {Object.entries(requirements).map(([label, value]) => (
                                <div key={label} className={styles.specItem}>
                                    <span className={styles.specLabel}>{label}</span>
                                    <span className={styles.specValue}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedScreenshot !== null && (
                <div className={styles.lightbox} onClick={() => setSelectedScreenshot(null)}>
                    <button className={styles.lightboxClose} onClick={() => setSelectedScreenshot(null)}>✕</button>
                    <button className={styles.lightboxPrev} onClick={(e) => { e.stopPropagation(); setSelectedScreenshot(prev => Math.max(0, prev - 1)) }}>‹</button>
                    <img src={screenshots[selectedScreenshot].image} className={styles.lightboxImage} alt="screenshot" />
                    <button className={styles.lightboxNext} onClick={(e) => { e.stopPropagation(); setSelectedScreenshot(prev => Math.min(screenshots.length - 1, prev + 1)) }}>›</button>
                </div>
            )}
        </div>
    )
}

export default GamePage