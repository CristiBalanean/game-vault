import { useState, useEffect } from 'react'

function useBacklog() {
    const [backlog, setBacklog] = useState(() => {
        try {
            const stored = localStorage.getItem('gameBacklog')
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('gameBacklog', JSON.stringify(backlog))
    }, [backlog])

    const addGame = (game) => {
        setBacklog(prev => [...prev, game])
    }

    const removeGame = (id) => {
        setBacklog(prev => prev.filter(g => g.id !== id))
    }

    const isInBacklog = (id) => {
        return backlog.some(g => g.id === id)
    }

    const toggleGame = (game) => {
        isInBacklog(game.id) ? removeGame(game.id) : addGame(game)
    }

    return { backlog, addGame, removeGame, isInBacklog, toggleGame }
}

export default useBacklog