# GameVault 🎮

A responsive web app for discovering and exploring games, built with React. Powered by the [RAWG API](https://rawg.io/apidocs) for game data and the [Steam API](https://store.steampowered.com/api/) for descriptions, screenshots, and system requirements.

## Features

- Browse games with genre, platform, and sort filters
- Search games with live suggestions as you type
- View detailed game pages with ratings, genres, platforms, developer info, and release date
- Game descriptions and screenshots pulled from Steam where available
- System requirements parsed and displayed in a clean grid
- Screenshot lightbox — click any screenshot to view fullscreen and scroll through
- Similar games section on each game page
- Store links — jump directly to Steam, GOG, Epic, PlayStation Store, and more
- Personal game backlog — save games and access them from any device visit
- Loading skeletons for a polished loading experience
- Error handling with retry on failed requests
- Adult content filtering
- Pagination to browse through the full game library
- Fully responsive — works on desktop and mobile

## Tech Stack

**Frontend**
- React
- React Router
- Vite
- CSS Modules
- Lucide React

**Backend**
- Node.js
- Express
- Deployed on Render

**APIs**
- RAWG API — game browsing and metadata
- Steam API — descriptions, screenshots, system requirements

## Getting Started

### Prerequisites
- Node.js installed

### Frontend
```bash
git clone https://github.com/cristibalanean/game-vault.git
cd game-vault
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend
```bash
git clone https://github.com/cristibalanean/game-vault-api.git
cd game-vault-api
npm install
node index.js
```

Backend runs on [http://localhost:3001](http://localhost:3001).

## Live Demo

[game-vault-tau-seven.vercel.app](https://game-vault-tau-seven.vercel.app)

## Roadmap

- [x] Filter games by genre
- [x] Filter games by platform
- [x] Sort by rating, popularity, Metacritic score, release date
- [x] Similar games section on game page
- [x] Store links on game page
- [x] Loading skeletons
- [x] Game backlog / wishlist
- [x] Error handling with retry
- [x] Adult content filtering
- [ ] User accounts and authentication
- [ ] Cloud-synced game backlog
- [ ] User ratings

## API Keys

This project uses the [RAWG API](https://rawg.io/apidocs). You'll need a free API key if you want to run it yourself — replace the key in the fetch calls or store it in a `.env` file.
