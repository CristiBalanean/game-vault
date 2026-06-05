const BASE = 'https://game-vault-api-cq77.onrender.com/api/rawg'

export const rawg = (path, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetch(`${BASE}/${path}${query ? `?${query}` : ''}`).then(res => res.json())
}