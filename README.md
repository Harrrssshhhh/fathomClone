# Meeting Intelligence

A polished AI meeting notetaker web application inspired by Fathom, built as part of a 24-hour product rebuild challenge.

> **Demo mode:** Meeting data is realistic but fictional. Audio recording, live transcription, calendar integration, AI summaries, and clip sharing are simulated where indicated. No real audio is captured.

## Live Demo

- **Deployed Application:** https://fathomclone.netlify.app/
- **Public Repository:** https://github.com/Harrrssshhhh/fathomClone
- **Walkthrough Video:** `ADD_YOUR_WALKTHROUGH_VIDEO_URL_HERE`


## Features

- **Meeting Dashboard** — Searchable meeting list with participant avatars, meeting duration, and tags.
- **Transcript Viewer** — Timestamped, speaker-attributed transcripts with search and highlighting actions.
- **Simulated Playback** — Interactive waveform, timeline seeking, playback-speed controls, and a clear simulation disclaimer.
- **AI Summaries** — Five summary templates: Standard, Executive, Sales, Engineering, and Interview. Each template changes the summary structure and content.
- **Action Items** — View action items by meeting or globally, toggle completion, and persist changes using localStorage.
- **Highlights** — Bookmark transcript moments and create shareable highlight clips.
- **Global Search** — Search across meeting titles, participants, transcripts, and action items with categorized results.
- **Share Dialog** — Generate shareable clip links. In demo mode, sharing is device-local and is not guaranteed to work across devices.
- **Recording Simulation** — Simulate a live recording session with a live-style transcript feed in Settings.
- **Demo Meetings** — Six fictional meetings, including an eight-participant, 60-minute product planning session.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS v4, PostCSS, Autoprefixer |
| Icons | Lucide React |
| Routing | React Router v7 |
| State Management | React Context |
| Persistence | localStorage |
| Demo Data | Static TypeScript fixtures |
| Linting | ESLint 9 + typescript-eslint |

## Prerequisites

- Node.js 20 or later recommended
- npm 9 or later

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_PUBLIC_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your actual repository URL and project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, typically `http://localhost:5173/`.

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

### 6. Run the linter

```bash
npm run lint
```

## Environment Variables

No environment variables are required for the demo.

An optional Supabase backend can be configured using the following environment variables if the integration has been implemented:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Create a local `.env.local` file for these values. Never commit secret credentials to the repository.

**Note:** Adding these variables alone does not enable backend functionality. Supabase authentication, database operations, and storage must be implemented separately.

## Project Structure

```text
src/
├── components/
│   ├── AppSidebar.tsx
│   ├── meetings/
│   │   └── MeetingCard.tsx
│   ├── player/
│   │   └── SimulatedPlayer.tsx
│   ├── transcript/
│   │   └── TranscriptPanel.tsx
│   ├── summary/
│   │   └── SummaryPanel.tsx
│   ├── sharing/
│   │   └── ShareDialog.tsx
│   └── ui/
│       ├── Avatar
│       ├── EmptyState
│       ├── Toast
│       └── TemplateSelector
├── context/
│   └── AppContext.tsx
├── data/
│   └── fixtures.ts
├── pages/
├── types/
│   └── index.ts
└── utils/
    ├── clipSharing.ts
    └── formatters.ts
```

## Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Meeting dashboard overview |
| `/meetings` | MeetingsPage | Searchable meeting list |
| `/meetings/:id` | MeetingDetailPage | Transcript, summaries, action items, and player |
| `/search` | SearchPage | Global search across meetings and related content |
| `/action-items` | ActionItemsPage | Action items across all meetings |
| `/shared` | SharedClipsPage | List of shared highlight clips |
| `/shared/:clipId` | SharedClipPage | Individual shared clip view |
| `/settings` | SettingsPage | Application settings and simulated recording |

## Demo Data

The application includes six fictional meetings:

1. **Q4 Product Planning** — 8 participants, 60 minutes, 50 transcript segments.
2. **Client Discovery** — 4 participants, 32 minutes.
3. **Engineering Standup** — 6 participants, 15 minutes.
4. **Onboarding Design Review** — 5 participants, 45 minutes.
5. **Sales Follow-up (Vertex Systems)** — 3 participants, 28 minutes.
6. **Sprint 23 Retrospective** — 7 participants, 50 minutes.

All meeting content is seeded demonstration data and does not represent actual recorded conversations.

## Demo Limitations

| Feature | Implementation |
|---|---|
| Calendar Integration | Simulated interface; no real OAuth connection |
| Audio Recording | Not implemented; no real audio is captured |
| Live Transcription | Simulated transcript feed using predefined data |
| AI Summaries | Prewritten deterministic demo content |
| Clip Sharing | Device-local persistence; cross-device access is not guaranteed |
| Data Persistence | Browser localStorage for supported user changes |

These limitations are disclosed to distinguish implemented demo interactions from production integrations.

## Agent Logs

The `.agent-logs/` directory contains the available agent session logs documenting prompts, responses, and development activity for the rebuild challenge.

Ensure the required logs are committed to the public repository, as specified by the assignment. Do not include API keys, passwords, or other sensitive credentials in these logs.

## License

This project is licensed under the MIT License.

Meeting Intelligence is an independent product rebuild challenge project inspired by Fathom. It is not affiliated with, endorsed by, or sponsored by Fathom.

