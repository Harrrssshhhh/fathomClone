import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

const OUT = 'Meeting_Intelligence_Project_Summary.pdf';

const BRAND = '#4f46e5';
const BRAND_LIGHT = '#eef2ff';
const TEXT = '#1f2937';
const MUTED = '#6b7280';
const LINE = '#e5e7eb';

const doc = new PDFDocument({ margin: 50, size: 'A4' });
doc.pipe(createWriteStream(OUT));

const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

let pageNum = 1;
function drawFooter() {
  const oldBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.fontSize(8).fillColor(MUTED).font('Helvetica').text(
    `Meeting Intelligence — Project Summary  |  Page ${pageNum}  |  https://fathomclone.netlify.app`,
    50,
    doc.page.height - 30,
    { align: 'center', width: pageW }
  );
  doc.page.margins.bottom = oldBottom;
  doc.fillColor(TEXT);
}
doc.on('pageAdded', () => { pageNum++; drawFooter(); });
drawFooter(); // first page

function h1(text) {
  doc.moveDown(0.5);
  doc.fillColor(BRAND).fontSize(22).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
  doc.fillColor(LINE).rect(50, doc.y, pageW, 1.5).fill();
  doc.moveDown(0.5);
  doc.fillColor(TEXT);
}

function h2(text) {
  doc.moveDown(0.6);
  doc.fillColor(BRAND).fontSize(14).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
  doc.fillColor(TEXT);
}

function h3(text) {
  doc.moveDown(0.4);
  doc.fillColor(TEXT).fontSize(11.5).font('Helvetica-Bold').text(text);
  doc.fillColor(TEXT);
}

function p(text, opts = {}) {
  doc.fontSize(10).font('Helvetica').fillColor(TEXT).text(text, { ...opts, lineGap: 3 });
  doc.moveDown(0.15);
}

function bullet(text) {
  doc.fontSize(10).font('Helvetica').fillColor(TEXT).text(`•  ${text}`, { indent: 12, lineGap: 3 });
  doc.moveDown(0.05);
}

function kvTable(rows, col1 = 150) {
  rows.forEach(([k, v]) => {
    doc.fontSize(10).font('Helvetica-Bold').fillColor(TEXT).text(k, 50, doc.y, { width: col1, continued: true });
    doc.font('Helvetica').fillColor(MUTED).text(`  ${v}`);
    doc.moveDown(0.08);
  });
}

function url(text) {
  doc.fontSize(10).font('Helvetica').fillColor(BRAND).text(text, { link: text, underline: true });
  doc.moveDown(0.1);
}

// ===== COVER =====
doc.moveDown(3);
doc.fillColor(BRAND).fontSize(34).font('Helvetica-Bold').text('Meeting Intelligence', { align: 'center' });
doc.moveDown(0.4);
doc.fillColor(TEXT).fontSize(16).font('Helvetica').text('Fathom-Inspired AI Meeting Notetaker', { align: 'center' });
doc.moveDown(0.6);
doc.fillColor(MUTED).fontSize(11).text('Project Summary & Walkthrough Guide', { align: 'center' });

doc.moveDown(2);
doc.fillColor(BRAND).rect(50, doc.y, pageW, 0.5).fill();
doc.moveDown(1);

kvTable([
  ['Live Demo', 'https://fathomclone.netlify.app/'],
  ['GitHub', 'https://github.com/Harrrssshhhh/fathomClone'],
  ['Framework', 'React 18 + Vite 5'],
  ['Language', 'TypeScript 5.6'],
  ['Styling', 'Tailwind CSS v4'],
  ['Routing', 'React Router v7'],
  ['Date', new Date().toISOString().slice(0, 10)],
]);

doc.addPage();

// ===== OVERVIEW =====
h1('1. Project Overview');
p('Meeting Intelligence is a polished AI meeting notetaker web application inspired by Fathom. It was built as a product rebuild challenge. All meeting data is realistic but fictional — recording and calendar integration are simulated, and no real audio is captured.');

h2('Key Highlights');
[
  'Meeting dashboard with searchable list, participant avatars, duration, and tags',
  'Speaker-attributed, timestamped, searchable transcript with highlight actions',
  'Simulated playback with waveform visualizer, timeline seek, and playback speed',
  'AI summaries across 5 templates: Standard, Executive, Sales, Engineering, Interview',
  'Per-meeting and global action items with completion toggles (localStorage persistence)',
  'Highlights that can be bookmarked and shared as public clips',
  'Global search across titles, participants, transcript, and action items',
  'Self-contained shareable clip links (data encoded in URL — no backend required)',
  'Simulated live recording session with live transcript feed on the Settings page',
  '6 seeded demo meetings including an 8-participant 60-minute product planning session',
].forEach(bullet);

doc.addPage();

// ===== TECH STACK =====
h1('2. Tech Stack');
kvTable([
  ['Framework', 'React 18 + Vite 5'],
  ['Language', 'TypeScript 5.6'],
  ['Styling', 'Tailwind CSS v4 (PostCSS + Autoprefixer)'],
  ['Icons', 'Lucide React'],
  ['Routing', 'React Router v7'],
  ['State', 'React Context + localStorage'],
  ['Data', 'Static TypeScript fixtures'],
  ['Linting', 'ESLint 9 + typescript-eslint'],
  ['Deployment', 'Netlify'],
  ['Version Control', 'Git + GitHub'],
]);

h2('NPM Scripts');
kvTable([
  ['npm run dev', 'Start Vite dev server with hot reload'],
  ['npm run build', 'Type-check (tsc -b) and build for production'],
  ['npm run preview', 'Preview the production build locally'],
  ['npm run lint', 'Run ESLint across the project'],
]);

doc.addPage();

// ===== ROUTES =====
h1('3. App Routes & Pages');

h3('Main App (with sidebar)');
const routes = [
  ['/', 'HomePage', 'Dashboard overview'],
  ['/meetings', 'MeetingsPage', 'Searchable list of all meetings'],
  ['/meetings/:id', 'MeetingDetailPage', 'Transcript, summary, action items & player'],
  ['/search', 'SearchPage', 'Global search across meetings, transcripts & action items'],
  ['/action-items', 'ActionItemsPage', 'All action items across meetings'],
  ['/shared', 'SharedClipsPage', 'List of shared highlight clips'],
  ['/settings', 'SettingsPage', 'App settings & simulated recording'],
];
routes.forEach(([path, page, desc]) => {
  doc.fontSize(10).font('Helvetica-Bold').fillColor(BRAND).text(path, 50, doc.y, { width: 130, continued: true });
  doc.font('Helvetica-Bold').fillColor(TEXT).text(`  ${page}  `, { continued: true });
  doc.font('Helvetica').fillColor(MUTED).text(`— ${desc}`);
  doc.moveDown(0.1);
});

doc.moveDown(0.3);
h3('Public Page (no sidebar)');
doc.fontSize(10).font('Helvetica-Bold').fillColor(BRAND).text('/shared/:clipId', 50, doc.y, { width: 130, continued: true });
doc.font('Helvetica').fillColor(MUTED).text('SharedClipPage — public single-clip view, data encoded in URL');

doc.addPage();

// ===== WALKTHROUGH LINKS =====
h1('4. Walkthrough Links');
p('Use these direct links to navigate your live demo during a walkthrough video.');

h2('Main Pages');
[
  ['Home / Dashboard', 'https://fathomclone.netlify.app/'],
  ['All Meetings', 'https://fathomclone.netlify.app/meetings'],
  ['Global Search', 'https://fathomclone.netlify.app/search'],
  ['Action Items', 'https://fathomclone.netlify.app/action-items'],
  ['Shared Clips', 'https://fathomclone.netlify.app/shared'],
  ['Settings / Recording', 'https://fathomclone.netlify.app/settings'],
].forEach(([label, u]) => {
  doc.fontSize(10).font('Helvetica-Bold').fillColor(TEXT).text(`${label}: `, { continued: true });
  url(u);
});

h2('Individual Meetings');
[
  ['Q4 Product Planning (8 ppl, 60 min)', 'https://fathomclone.netlify.app/meetings/meet-001'],
  ['Client Discovery — Enterprise SaaS', 'https://fathomclone.netlify.app/meetings/meet-002'],
  ['Engineering Daily Standup', 'https://fathomclone.netlify.app/meetings/meet-003'],
  ['Onboarding Redesign — Design Review', 'https://fathomclone.netlify.app/meetings/meet-004'],
  ['Sales Follow-up — Vertex Systems', 'https://fathomclone.netlify.app/meetings/meet-005'],
  ['Sprint 23 Team Retrospective', 'https://fathomclone.netlify.app/meetings/meet-006'],
].forEach(([label, u]) => {
  doc.fontSize(10).font('Helvetica-Bold').fillColor(TEXT).text(`${label}: `, { continued: true });
  url(u);
});

h2('Suggested Walkthrough Flow');
[
  'Open Home (/) to show the dashboard overview',
  'Go to Meetings list (/meetings) and use search / tags',
  'Open Q4 Product Planning (/meetings/meet-001)',
  'Scroll the transcript, switch summary templates (Standard, Executive, Sales, Engineering, Interview)',
  'Highlight a transcript line and use Share to generate a public clip link',
  'Open the shared clip link in a new tab to show the public view',
  'Visit Action Items (/action-items) and toggle completion',
  'Try Global Search (/search) for a keyword',
  'Open Settings (/settings) to show the simulated live recording',
].forEach(bullet);

doc.addPage();

// ===== DEMO DATA =====
h1('5. Demo Meetings');
const meetings = [
  ['meet-001', 'Q4 Product Planning', '8 participants', '60 min', 'zoom', 'planning, q4, product, strategy'],
  ['meet-002', 'Client Discovery — Enterprise SaaS', '4 participants', '32 min', 'zoom', 'sales, discovery, enterprise, client'],
  ['meet-003', 'Engineering Daily Standup', '6 participants', '15 min', 'meet', 'standup, engineering, daily'],
  ['meet-004', 'Onboarding Redesign — Design Review', '5 participants', '45 min', 'meet', 'design, onboarding, review, ux'],
  ['meet-005', 'Sales Follow-up — Vertex Systems', '3 participants', '28 min', 'meet', 'sales, enterprise, security, deal'],
  ['meet-006', 'Sprint 23 Team Retrospective', '7 participants', '50 min', 'teams', 'retro, sprint, team'],
];
meetings.forEach(([id, title, ppl, dur, plat, tags]) => {
  h3(title);
  kvTable([
    ['ID', id],
    ['Participants', ppl],
    ['Duration', dur],
    ['Platform', plat],
    ['Tags', tags],
  ], 100);
});

doc.addPage();

// ===== PROJECT STRUCTURE =====
h1('6. Project Structure');
const structure = [
  'src/',
  '├── components/',
  '│   ├── AppSidebar.tsx',
  '│   ├── meetings/MeetingCard.tsx',
  '│   ├── player/SimulatedPlayer.tsx',
  '│   ├── transcript/TranscriptPanel.tsx',
  '│   ├── summary/SummaryPanel.tsx',
  '│   ├── sharing/ShareDialog.tsx',
  '│   └── ui/ (Avatar, EmptyState, Toast, TemplateSelector)',
  '├── context/AppContext.tsx     # Global state + localStorage',
  '├── data/fixtures.ts           # 6 seeded demo meetings',
  '├── hooks/useTheme.ts          # Theme (dark/light) hook',
  '├── pages/                     # Route-level components',
  '├── types/index.ts             # TypeScript entity types',
  '└── utils/',
  '    ├── clipSharing.ts         # Share-link generation & encoding',
  '    └── formatters.ts          # Date/time formatting',
];
doc.fontSize(9.5).font('Courier').fillColor(TEXT);
structure.forEach((line) => doc.text(line, { lineGap: 1 }));
doc.moveDown(0.5);
doc.font('Helvetica').fillColor(TEXT);

doc.addPage();

// ===== SIMULATED FEATURES =====
h1('7. Simulated Features (Disclosed)');
p('The following features are simulated for the demo and clearly labeled in the app:');
kvTable([
  ['Calendar OAuth', 'Simulated UI only'],
  ['Audio recording', 'Not captured — visual simulation only'],
  ['Live transcription', 'Static data shown in sequence'],
  ['AI inference', 'Pre-written deterministic fixtures'],
  ['Share links', 'Device-local in demo; data encoded in URL'],
]);

doc.moveDown(1);
h2('Environment Variables');
p('No environment variables are required for the demo. For an optional Supabase backend, create .env.local:');
doc.fontSize(9).font('Courier').fillColor(TEXT).text('VITE_SUPABASE_URL=your-project-url\nVITE_SUPABASE_ANON_KEY=your-anon-key');
doc.moveDown(0.3);
doc.font('Helvetica').fillColor(TEXT);

doc.moveDown(1);
h2('License');
p('MIT — built as a product rebuild challenge. Not affiliated with or endorsed by Fathom.');

doc.end();
console.log(`PDF generated: ${OUT}`);
