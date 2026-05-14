# CorchoApp Frontend

React frontend for **CorchoApp**, a neighborhood community board where residents can post notes, offer help, leave comments, and thank their neighbors.

Built with **React 19** + **Vite**. Designed with a cork board aesthetic — rotated cards, pins, and tape.

**Frontend:** https://corcho-api-front.vercel.app · **API:** https://web-production-0771b3.up.railway.app/api

> Connects to [CorchoApp API](../CorchoAppApi/README.md) — make sure the backend is running before starting the frontend.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Pages](#pages)
- [Components & Hooks](#components--hooks)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Design](#design)
- [Deploy](#deploy)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | JavaScript (ES2022+) |
| Framework | React 19 |
| Bundler | Vite |
| Routing | React Router DOM v7 |
| HTTP client | Axios |
| Icons | Lucide React |
| Auth state | Context API + localStorage |
| Animations | Lottie |
| Deploy | Vercel |

---

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Landing.jsx` | Welcome screen with login / register buttons |
| `/login` | `Login.jsx` | Login and register form |
| `/dashboard` | `Dashboard.jsx` | Note feed with search and category filter |
| `/notes/:id` | `NoteDetail.jsx` | Note detail, comments, resolve and thanks |
| `/notes/new` | `CreateNote.jsx` | Create a new note |
| `/profile/:id` | `UserProfile.jsx` | User profile with inline editing |
| `/community` | `Community.jsx` | Community stats and top helpers |
| `*` | `NotFound.jsx` | 404 page |

---

## Components & Hooks

### Components

| Component | Description |
|---|---|
| `NoteCard` | Note card with rotation, avatar, category badge and time ago |
| `CategoryScrollableRow` | Horizontal scroll row with category icons |
| `MenuBar` | Fixed bottom navigation bar |
| `SearchBar` | Search input for the dashboard |
| `Toast` | Confirmation message (auto-dismisses after 3 seconds) |
| `ResolveModal` | Modal to select a helper and give thanks |
| `DeleteConfirmModal` | Confirmation modal for destructive actions |
| `Avatar` | User avatar with initial letter |
| `Tape` | Decorative tape element for the cork style |
| `BackButton` | Back navigation button |
| `EditActions` | Save / cancel buttons for inline editing |
| `LoadingScreen` | Loading state screen |

### Custom Hooks

| Hook | Description |
|---|---|
| `useTypewriter` | Animates text letter by letter with a configurable interval |
| `useToast` | Manages toast state (message, visibility, auto-dismiss after 3s) |

---

## Getting Started

### Requirements

- Node.js >= 18
- CorchoApp API running at `http://localhost:8000`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd CorchoAppFront

# Install dependencies
npm install

# Create the environment file
cp .env.example .env
# Set VITE_API_URL in .env (see below)

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the root of `CorchoAppFront/`:

```env
VITE_API_URL=http://localhost:8000/api
```

- This is the base URL for all API requests.
- For production, replace it with your deployed API URL (e.g. Railway).
- Variables must start with `VITE_` to be accessible in React.

---

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx        # Token and user state, shared across all pages
├── hooks/
│   └── useTypewriter.jsx      # Custom hook for typewriter text animation
├── components/
│   ├── NoteCard.jsx
│   ├── MenuBar.jsx
│   ├── CategoryScrollableRow.jsx
│   ├── Toast.jsx
│   ├── ResolveModal.jsx
│   └── ...
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── NoteDetail.jsx
│   ├── CreateNote.jsx
│   ├── UserProfile.jsx
│   ├── Community.jsx
│   └── NotFound.jsx
├── App.jsx                    # Router setup and page transitions
└── main.jsx                   # React entry point
```

---

## Design

- **Style**: cork board aesthetic — square cards with slight rotation, pins, tape
- **Fonts**: Figtree (body) · Jaro (display titles) — Google Fonts
- **Palette**: `#F97316` orange · `#FFF7ED` warm cream · `#68DD9E` mint green · `#68A7DD` sky blue
- **Mobile-first**: base width 390px
- **Animations**: spring effect `cubic-bezier(0.34, 1.56, 0.64, 1)` on card entry
- **Inspiration**: Airbnb + Nextdoor visual style

---

## Deploy

The frontend is deployed on **Vercel**.

Since this is a Single Page Application (SPA), all routes are handled by React Router — not the server. A `vercel.json` file is required so Vercel always serves `index.html` regardless of the route:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Without this file, navigating directly to `/dashboard` or refreshing the page returns a 404, because Vercel looks for a physical file that does not exist.

---
