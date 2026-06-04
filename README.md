# GameVault 🎮

A responsive web app for discovering and exploring games, built with React. Powered by the [RAWG API](https://rawg.io/apidocs) for game data and the [Steam API](https://store.steampowered.com/api/) for descriptions, screenshots, and system requirements.

> ⚠️ **Work in Progress** — new features are actively being developed. See the roadmap below.

## Features

- Browse a curated list of top-rated games
- Search games with live suggestions as you type
- View detailed game pages with ratings, genres, platforms, developer info, and release date
- Game descriptions and screenshots pulled from Steam where available
- System requirements parsed and displayed in a clean grid
- Screenshot lightbox — click any screenshot to view fullscreen and scroll through
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

- [ ] User accounts and authentication
- [ ] Personal game backlog
- [ ] User ratings
- [ ] Filter games by genre
- [ ] Sort by rating, release date, Metacritic score
- [ ] Similar games section on game page
- [ ] Loading skeletons

## API Keys

This project uses the [RAWG API](https://rawg.io/apidocs). You'll need a free API key if you want to run it yourself — replace the key in the fetch calls or store it in a `.env` file.
