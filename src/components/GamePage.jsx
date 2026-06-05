import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './GamePage.module.css'
import GamePageSkeleton from './GamePageSkeleton.jsx'
import useBacklog from '../hooks/useBacklog.js'
import { Bookmark, ChevronLeft, ExternalLink } from 'lucide-react'
import React from 'react'

const STORE_NAMES = {
    1: 'Steam',
    2: 'Xbox Store',
    3: 'PlayStation Store',
    4: 'App Store',
    5: 'GOG',
    6: 'Nintendo Store',
    7: 'Xbox 360 Store',
    8: 'Google Play',
    9: 'itch.io',
    11: 'Epic Games',
}

function GamePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState(null)
    const [steamData, setSteamData] = useState(null)
    const [selectedScreenshot, setSelectedScreenshot] = useState(null)
    const [similarGames, setSimilarGames] = useState([])
    const [storeLinks, setStoreLinks] = useState([])
    const [error, setError] = useState(false)
    const { isInBacklog, toggleGame } = useBacklog()
    const BACKEND = 'https://game-vault-api-cq77.onrender.com/api/rawg'

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setGame(null)
        setSteamData(null)
        setSimilarGames([])
        setSelectedScreenshot(null)
        setStoreLinks([])
        setError(false)

        fetch(`${BACKEND}?endpoint=games/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(async data => {
                setGame(data)

                const storesRes = await fetch(`${BACKEND}?endpoint=games/${id}/stores`)
                const storesData = await storesRes.json()

                if (storesData.results) {
                    setStoreLinks(storesData.results.filter(s => STORE_NAMES[s.store_id]))
                }

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

                try {
                    const suggestedRes = await fetch(`${BACKEND}?endpoint=games/${id}/game-series&page_size=6`)
                    const suggestedData = await suggestedRes.json()
                    setSimilarGames(suggestedData.results || [])
                } catch (err) {
                    console.log('Suggested games error:', err)
                }
            })
            .catch(() => setError(true))
    }, [id])

    if (error) return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>Something went wrong loading this game.</p>
            <button
                onClick={() => { setError(false); setGame(null) }}
                style={{ background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontSize: '15px', cursor: 'pointer' }}
            >
                Retry
            </button>
        </div>
    )

    if (!game) return <GamePageSkeleton />

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
        game.platforms?.find(p => p.platform.name === 'PC')?.requirements?.minimum
    )

    const saved = isInBacklog(parseInt(id))

    const handleToggle = () => {
        toggleGame({
            id: parseInt(id),
            name: game.name,
            background_image: game.background_image,
            genres: game.genres,
            platforms: game.platforms,
            rating: game.rating
        })
    }

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <ChevronLeft size={18} /> Back
            </button>
            <div className={styles.page}>
                <div className={styles.leftColumn}>
                    {game.background_image
                        ? <img className={styles.image} alt={game.name} src={game.background_image} />
                        : <div className={styles.imagePlaceholder}>🎮 No image available</div>
                    }
                    {similarGames.length > 0 && (
                        <div className={styles.similarSection}>
                            <h3 className={styles.similarTitle}>Similar Games</h3>
                            <div className={styles.similarGrid}>
                                {similarGames.map(g => (
                                    <div key={g.id} className={styles.similarCard} onClick={() => navigate(`/game/${g.id}`)}>
                                        {g.background_image
                                            ? <img src={g.background_image} alt={g.name} className={styles.similarImage} />
                                            : <div className={styles.similarImagePlaceholder}>🎮</div>
                                        }
                                        <div className={styles.similarInfo}>
                                            <p className={styles.similarName}>{g.name}</p>
                                            <p className={styles.similarRating}>⭐ {g.rating || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{game.name}</h1>
                        <button
                            className={`${styles.bookmarkBtn} ${saved ? styles.bookmarkActive : ''}`}
                            onClick={handleToggle}
                        >
                            <Bookmark size={20} fill={saved ? '#6c63ff' : 'none'} />
                            <span>{saved ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>
                    <div className={styles.ratingRow}>
                        <span className={styles.rating}>⭐ {game.rating || 'N/A'}</span>
                        {game.metacritic && <span className={styles.metacritic}>Metacritic: {game.metacritic}</span>}
                    </div>
                    {game.genres?.length > 0 && (
                        <div className={styles.genres}>
                            {game.genres.map(g => <span className={styles.genreTag} key={g.id}>{g.name}</span>)}
                        </div>
                    )}
                    {game.platforms?.length > 0 && (
                        <div className={styles.platforms}>
                            {game.platforms.map(p => (
                                <span key={p.platform.id} className={styles.platformTag}>
                                    {p.platform.name}
                                </span>
                            ))}
                        </div>
                    )}
                    {game.developers?.length > 0 && (
                        <p className={styles.developer}>Developer: {game.developers.map(d => d.name).join(', ')}</p>
                    )}
                    {game.released && <p className={styles.released}>Released: {game.released}</p>}

                    {storeLinks.length > 0 && (
                        <div className={styles.storeLinks}>
                            <h3>Available On</h3>
                            <div className={styles.storeButtons}>
                                {storeLinks.map(store => {
                                    const storeId = store.store_id
                                    const storeName = STORE_NAMES[storeId]
                                    const storeUrl = store.url
                                    const linkEl = React.createElement(
                                        'a',
                                        {
                                            key: storeId,
                                            href: storeUrl,
                                            target: '_blank',
                                            rel: 'noopener noreferrer',
                                            className: styles.storeBtn
                                        },
                                        storeName,
                                        React.createElement(ExternalLink, { size: 13 })
                                    )
                                    return linkEl
                                })}
                            </div>
                        </div>
                    )}

                    <div className={styles.about}>
                        <h3>About</h3>
                        <p>{about || 'No description available for this game.'}</p>
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
        </div>
    )
}

export default GamePage