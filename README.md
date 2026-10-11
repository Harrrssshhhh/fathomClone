# Meeting Intelligence

A polished AI meeting notetaker web application inspired by Fathom — built as a 24-hour product rebuild challenge.

> **Demo mode**: All meeting data is realistic but fictional. Recording and calendar integration are simulated. No real audio is captured.

## Live Demo

> Deployment URL: *(see DEPLOYMENT section below)*

## Features

- **Meeting dashboard** — searchable list with participant avatars, duration, and tags
- **Transcript viewer** — speaker-attributed, timestamped, searchable, with highlight actions
- **Simulated playback** — waveform visualizer, timeline seek, playback speed, transparent disclaimer
- **AI summaries** — 5 templates: Standard, Executive, Sales, Engineering, Interview; switching changes content structure
- **Action items** — per-meeting and global view; completion toggle persisted in localStorage
- **Highlights** — bookmark transcript moments, share as public clips
- **Global search** — searches titles, participants, transcript, action items with type badges
- **Share dialog** — creates shareable clip links (device-local in demo; global in production)
- **Recording simulation** — Settings page simulates a live recording session with a live transcript feed
- **6 seeded demo meetings** including an 8-participant 60-minute product planning session

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Routing | React Router v6 |
| State | React Context + localStorage |
| Data | Static TypeScript fixtures |

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Environment Variables

No environment variables are required for the demo. For optional Supabase backend:

```
# .env.local (never commit this file)
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
├── components/
│   ├── AppSidebar.tsx
│   ├── meetings/MeetingCard.tsx
│   ├── player/SimulatedPlayer.tsx
│   ├── transcript/TranscriptPanel.tsx
│   ├── summary/SummaryPanel.tsx
│   ├── sharing/ShareDialog.tsx
│   └── ui/  (Avatar, EmptyState, Toast, TemplateSelector)
├── context/AppContext.tsx    # Global state + localStorage
├── data/fixtures.ts          # 6 seeded demo meetings
├── pages/                    # Route-level components
├── types/index.ts            # TypeScript entity types
└── utils/formatters.ts       # Date/time formatting
```

## Demo Data

Six fictional meetings, clearly labeled as demo data:

1. **Q4 Product Planning** — 8 participants, 60 minutes, 50 transcript segments
2. **Client Discovery** — 4 participants, 32 minutes  
3. **Engineering Standup** — 6 participants, 15 minutes
4. **Onboarding Design Review** — 5 participants, 45 minutes
5. **Sales Follow-up (Vertex Systems)** — 3 participants, 28 minutes
6. **Sprint 23 Retrospective** — 7 participants, 50 minutes

## Simulated Features (Disclosed)

| Feature | Status |
|---------|--------|
| Calendar OAuth | Simulated UI only |
| Audio recording | Not captured — visual simulation only |
| Live transcription | Static data shown in sequence |
| AI inference | Pre-written deterministic fixtures |
| Share links | Device-local in demo (localStorage) |

## Agent Logs

`.agent-logs/` contains the full session log of prompts and responses used to build this application, per the 8x assignment requirements.

## License

MIT — built as a product rebuild challenge. Not affiliated with or endorsed by Fathom.
