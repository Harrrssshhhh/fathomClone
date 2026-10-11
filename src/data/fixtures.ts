import type { Meeting, Participant, TranscriptSegment, ActionItem, Highlight } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────
function makeParticipant(
  id: string, name: string, email: string,
  color: string, role?: string
): Participant {
  const parts = name.split(' ');
  const initials = parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return { id, name, email, avatarColor: color, initials, role };
}

function seg(
  id: string, meetingId: string, speakerId: string, speakerName: string,
  text: string, startTime: number, endTime: number
): TranscriptSegment {
  return { id, meetingId, speakerId, speakerName, text, startTime, endTime };
}

function actionItem(
  id: string, meetingId: string, description: string,
  owner: string, ownerParticipantId: string, dueDate: string,
  completed = false, timestampSeconds?: number
): ActionItem {
  return {
    id, meetingId, description, owner, ownerParticipantId, dueDate,
    completed, timestampSeconds,
    createdAt: new Date().toISOString(),
  };
}

function highlight(
  id: string, meetingId: string, transcriptSegmentId: string,
  timestamp: number, excerpt: string, speakerName: string, note?: string
): Highlight {
  return { id, meetingId, transcriptSegmentId, timestamp, excerpt, speakerName, note, createdAt: new Date().toISOString() };
}

// ─── Participants ──────────────────────────────────────────────────────────
const SARAH  = makeParticipant('p-sarah',   'Sarah Chen',      'sarah@acme.co',     '#6366f1', 'Head of Product');
const MARCUS = makeParticipant('p-marcus',  'Marcus Webb',     'marcus@acme.co',    '#0ea5e9', 'Engineering Lead');
const PRIYA  = makeParticipant('p-priya',   'Priya Kapoor',    'priya@acme.co',     '#f43f5e', 'UX Designer');
const JAMES  = makeParticipant('p-james',   'James Okafor',    'james@acme.co',     '#22c55e', 'Product Manager');
const ELENA  = makeParticipant('p-elena',   'Elena Vasquez',   'elena@acme.co',     '#f59e0b', 'Data Analyst');
const TOM    = makeParticipant('p-tom',     'Tom Lindqvist',   'tom@acme.co',       '#8b5cf6', 'Backend Engineer');
const NINA   = makeParticipant('p-nina',    'Nina Johansson',  'nina@acme.co',      '#06b6d4', 'Frontend Engineer');
const ALEX   = makeParticipant('p-alex',    'Alex Rivera',     'alex@acme.co',      '#ec4899', 'CEO');
const DIANA  = makeParticipant('p-diana',   'Diana Park',      'diana@client.io',   '#14b8a6', 'Client - VP Product');
const ROB    = makeParticipant('p-rob',     'Rob Ellison',     'rob@client.io',     '#f97316', 'Client - CTO');
const OMAR   = makeParticipant('p-omar',    'Omar Hussain',    'omar@acme.co',      '#a855f7', 'Sales Lead');
const KATE   = makeParticipant('p-kate',    'Kate Morrison',   'kate@acme.co',      '#84cc16', 'Customer Success');
const DAVID  = makeParticipant('p-david',   'David Nguyen',    'david@acme.co',     '#fb923c', 'DevOps Engineer');
const RACHEL = makeParticipant('p-rachel',  'Rachel Bloom',    'rachel@acme.co',    '#a78bfa', 'Scrum Master');
const CLAIRE = makeParticipant('p-claire',  'Claire Fontaine', 'claire@acme.co',    '#34d399', 'Sales Manager');
const BEN    = makeParticipant('p-ben',     'Ben Tremblay',    'ben@acme.co',       '#60a5fa', 'VP Engineering');

// ─── Summaries helper ─────────────────────────────────────────────────────
function makeSummaries(meetingId: string, data: {
  standard: { overview: string; sections: {title:string;content:string}[] };
  executive: { overview: string; sections: {title:string;content:string}[] };
  sales: { overview: string; sections: {title:string;content:string}[] };
  engineering: { overview: string; sections: {title:string;content:string}[] };
  interview: { overview: string; sections: {title:string;content:string}[] };
}): Meeting['summaries'] {
  const now = new Date().toISOString();
  return {
    standard:    { meetingId, template: 'standard',    generatedAt: now, ...data.standard },
    executive:   { meetingId, template: 'executive',   generatedAt: now, ...data.executive },
    sales:       { meetingId, template: 'sales',       generatedAt: now, ...data.sales },
    engineering: { meetingId, template: 'engineering', generatedAt: now, ...data.engineering },
    interview:   { meetingId, template: 'interview',   generatedAt: now, ...data.interview },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MEETING 1 — Product Planning (60 min, 8 participants)
// ═══════════════════════════════════════════════════════════════════════════
const M1_ID = 'meet-001';
const m1Transcript: TranscriptSegment[] = [
  seg('m1-s1',  M1_ID, 'p-sarah',  'Sarah Chen',     'Good morning everyone. Let\'s get started. We\'ve got a lot to cover for Q4 planning. I want to make sure we leave today with clear priorities and owners for every major initiative.', 10, 38),
  seg('m1-s2',  M1_ID, 'p-alex',   'Alex Rivera',    'Thanks for organizing this, Sarah. Before we dive in, I want to set some context. The board met last week and they\'re pushing hard for us to hit 10,000 paying customers by end of Q1. That changes our calculus somewhat.', 42, 78),
  seg('m1-s3',  M1_ID, 'p-james',  'James Okafor',   'That\'s aggressive. We\'re at 6,200 right now. Getting to 10k in one quarter means we need both growth and retention firing at the same time.', 80, 102),
  seg('m1-s4',  M1_ID, 'p-marcus', 'Marcus Webb',    'From an engineering standpoint, we have some real capacity constraints. Tom and Nina are still wrapping up the v2 API migration. I can\'t promise new features until mid-November at the earliest without cutting scope somewhere.', 105, 140),
  seg('m1-s5',  M1_ID, 'p-elena',  'Elena Vasquez',  'I pulled the retention data this morning. Our 90-day cohort retention dropped from 71% to 64% over the last two quarters. That\'s the number I\'d fix before pouring more money into acquisition.', 143, 172),
  seg('m1-s6',  M1_ID, 'p-sarah',  'Sarah Chen',     'Elena, what\'s driving that drop? Is it activation, feature adoption, or something else?', 174, 188),
  seg('m1-s7',  M1_ID, 'p-elena',  'Elena Vasquez',  'Mostly activation. Users who don\'t connect a calendar within 48 hours of signing up have a 23% lower retention rate. It\'s the classic dead-on-arrival problem. They sign up, they don\'t see value, they leave.', 190, 225),
  seg('m1-s8',  M1_ID, 'p-priya',  'Priya Kapoor',   'We redesigned the onboarding flow in the mockups I shared last week. The calendar connection step is now step two, not step five. I\'m confident we can increase calendar connection rate by 30-40% with that change alone.', 228, 265),
  seg('m1-s9',  M1_ID, 'p-marcus', 'Marcus Webb',    'Priya, how long is the frontend work on that? Nina, do you have a read?', 267, 278),
  seg('m1-s10', M1_ID, 'p-nina',   'Nina Johansson', 'If the designs are final by end of week, I can have it in staging within ten days. Testing and edge cases add another week. So realistically, mid-November for production.', 280, 310),
  seg('m1-s11', M1_ID, 'p-james',  'James Okafor',   'Okay. So if we ship the new onboarding mid-November, and it actually moves retention by 7 points, we still need a growth push. Omar, what\'s the pipeline looking like?', 313, 342),
  seg('m1-s12', M1_ID, 'p-omar',   'Omar Hussain',   'We have 280 leads in the pipeline right now. About 60 of those are qualified enterprise. If we close 40% of the enterprise cohort, that\'s 24 accounts, which at our average contract size is about $180k ARR. Not enough by itself, but meaningful.', 345, 390),
  seg('m1-s13', M1_ID, 'p-alex',   'Alex Rivera',    'What about the PLG motion? Product-led growth. If onboarding is better, does that alone lift our organic signups?', 392, 415),
  seg('m1-s14', M1_ID, 'p-sarah',  'Sarah Chen',     'It should. Better onboarding means better activation, which means better word-of-mouth. But it\'s not a Q4 play — the effects compound over three to six months.', 418, 445),
  seg('m1-s15', M1_ID, 'p-tom',    'Tom Lindqvist',  'Can I raise the API migration issue? We\'re at 78% complete, but the remaining 22% is the hard part — legacy webhook handlers and the billing integration. If we deprioritize that to ship onboarding faster, we\'re carrying significant technical debt into Q1.', 447, 495),
  seg('m1-s16', M1_ID, 'p-marcus', 'Marcus Webb',    'Tom is right. And there\'s a dependency — the new onboarding flow needs the v2 API endpoints for the calendar OAuth. We can\'t ship one without the other.', 498, 525),
  seg('m1-s17', M1_ID, 'p-priya',  'Priya Kapoor',   'Oh, I wasn\'t aware of that dependency. Can we build the new onboarding against the v1 API temporarily and migrate later?', 527, 548),
  seg('m1-s18', M1_ID, 'p-tom',    'Tom Lindqvist',  'Technically yes, but it would double the work. We\'d be building the integration twice. I\'d rather just finish the v2 migration first. It\'s maybe three weeks away if we focus.', 550, 580),
  seg('m1-s19', M1_ID, 'p-ben',    'Ben Tremblay',   'So the sequencing question is: do we prioritize API migration, then onboarding? Or parallelize with some risk? I\'ve seen the parallel approach blow up before when there are undiscovered API contract differences.', 582, 618),
  seg('m1-s20', M1_ID, 'p-marcus', 'Marcus Webb',    'My recommendation is sequential. Finish the API migration by November 1st. Then Nina takes the onboarding. We ship to production by December 1st. That gives us December to measure impact.', 620, 655),
  seg('m1-s21', M1_ID, 'p-james',  'James Okafor',   'December 1st for onboarding means we only have one month of data before Q4 closes. That\'s not enough to validate.', 657, 675),
  seg('m1-s22', M1_ID, 'p-sarah',  'Sarah Chen',     'I hear both sides. Let me propose a compromise. Marcus, can your team do a focused sprint on the calendar OAuth piece of the v2 API first — just that part — so Nina can start onboarding earlier?', 677, 712),
  seg('m1-s23', M1_ID, 'p-tom',    'Tom Lindqvist',  'That\'s actually feasible. The calendar OAuth is about 30% of the remaining v2 work. I could have that isolated and done in two weeks if David can help with the infrastructure side.', 715, 748),
  seg('m1-s24', M1_ID, 'p-david',  'David Nguyen',   'I can do that. I\'ve been working on the staging environment anyway. We can set up an isolated v2 environment for just the OAuth piece.', 750, 770),
  seg('m1-s25', M1_ID, 'p-sarah',  'Sarah Chen',     'Great. So Tom and David scope the OAuth extraction this week. Nina starts onboarding design handoff next week. Let\'s target November 15th for onboarding in production. Elena, can you set up a retention cohort so we see impact in real time?', 772, 820),
  seg('m1-s26', M1_ID, 'p-elena',  'Elena Vasquez',  'Already on it. I\'ll set up A/B cohorts — old onboarding versus new — and we\'ll track calendar connection rate, day-7 retention, and day-30 retention. I\'ll have a dashboard ready before launch.', 822, 858),
  seg('m1-s27', M1_ID, 'p-alex',   'Alex Rivera',    'This is the right call. One more thing before we close — the AI summarization feature. We\'ve been promising it to enterprise customers. What\'s the status?', 860, 890),
  seg('m1-s28', M1_ID, 'p-marcus', 'Marcus Webb',    'It\'s in beta. About 200 users have access. The quality is good but the latency is too high — averaging 40 seconds per meeting. We need to optimize the prompting pipeline before general availability.', 892, 925),
  seg('m1-s29', M1_ID, 'p-sarah',  'Sarah Chen',     'Can we do a limited enterprise release at current latency with a disclaimer? Some of our enterprise prospects are asking specifically about this feature.', 927, 952),
  seg('m1-s30', M1_ID, 'p-omar',   'Omar Hussain',   'Two of my biggest enterprise deals are blocked on AI summarization. If we can give them even a limited version, I think I can close both before end of Q4.', 954, 980),
  seg('m1-s31', M1_ID, 'p-marcus', 'Marcus Webb',    'Alright. Let\'s do a controlled enterprise release — opt-in, clearly labeled as beta, with a feedback mechanism. I\'ll work with Tom on the latency issue in parallel.', 982, 1015),
  seg('m1-s32', M1_ID, 'p-priya',  'Priya Kapoor',   'I\'ll design a proper beta badge and in-product feedback widget this week. Users should feel like they\'re part of something, not that the product is broken.', 1017, 1042),
  seg('m1-s33', M1_ID, 'p-kate',   'Kate Morrison',  'From a customer success perspective, I\'d like to proactively reach out to the enterprise accounts before they discover the beta. Set expectations, get their buy-in. Can I get a heads-up one week before launch?', 1045, 1080),
  seg('m1-s34', M1_ID, 'p-sarah',  'Sarah Chen',     'Absolutely, Kate. That\'s exactly the right approach. Marcus will flag you when enterprise beta is ready to ship. James, can you write up the decisions we\'ve made today for the company wiki?', 1082, 1115),
  seg('m1-s35', M1_ID, 'p-james',  'James Okafor',   'Yes, I\'ll have a writeup in Notion by end of day. Should I include the Q4 targets explicitly?', 1117, 1135),
  seg('m1-s36', M1_ID, 'p-alex',   'Alex Rivera',    'Yes, and the board metrics we\'re tracking. Everything should be transparent internally. Alright, any final questions before we close?', 1137, 1158),
  seg('m1-s37', M1_ID, 'p-nina',   'Nina Johansson', 'Quick question — are we doing a design review before the new onboarding goes to production, or just Priya sign-off?', 1160, 1178),
  seg('m1-s38', M1_ID, 'p-priya',  'Priya Kapoor',   'I\'d like at least a 30-minute design review with Sarah and James before we ship. I\'ll schedule it after the first build is in staging.', 1180, 1200),
  seg('m1-s39', M1_ID, 'p-ben',    'Ben Tremblay',   'One more thing — should we do a load test on the new onboarding flow before December? The calendar OAuth adds a new external API call on every signup.', 1202, 1228),
  seg('m1-s40', M1_ID, 'p-david',  'David Nguyen',   'Good call, Ben. I\'ll set up a load test environment. We should simulate 500 concurrent signups given the growth targets. If OAuth fails under load, we need to know before it hits production.', 1230, 1262),
  seg('m1-s41', M1_ID, 'p-sarah',  'Sarah Chen',     'Perfect. That\'s everything. Thanks everyone — this was a great session. Lots of decisions made, clear owners, clear dates. Let\'s hold each other accountable. See you at standup tomorrow.', 1264, 1295),
  seg('m1-s42', M1_ID, 'p-james',  'James Okafor',   'Will the meeting recording be available for the folks who couldn\'t join live?', 1297, 1310),
  seg('m1-s43', M1_ID, 'p-sarah',  'Sarah Chen',     'Yes, this is being recorded. I\'ll share the link and the summary as soon as it\'s processed. Thanks everyone!', 1312, 1332),
  seg('m1-s44', M1_ID, 'p-marcus', 'Marcus Webb',    'Just to confirm — Tom, you\'re kicking off the OAuth extraction sprint this week, correct?', 1334, 1350),
  seg('m1-s45', M1_ID, 'p-tom',    'Tom Lindqvist',  'Confirmed. David and I will sync tomorrow morning to scope it. I\'ll have an estimate by Wednesday.', 1352, 1368),
  seg('m1-s46', M1_ID, 'p-marcus', 'Marcus Webb',    'Great. That\'s the critical path right there. Alright, have a good rest of the day everyone.', 1370, 1385),
  seg('m1-s47', M1_ID, 'p-alex',   'Alex Rivera',    'Thanks team. Let\'s make Q4 count.', 1387, 1398),
  seg('m1-s48', M1_ID, 'p-kate',   'Kate Morrison',  'Before we drop off — Elena, can you share that retention data with me directly? I want to brief the enterprise accounts on what we\'re working on.', 1400, 1422),
  seg('m1-s49', M1_ID, 'p-elena',  'Elena Vasquez',  'Sure Kate, I\'ll send you the dashboard link. The 23% drop in non-calendar users is the headline number. Very compelling for the customer conversation.', 1424, 1448),
  seg('m1-s50', M1_ID, 'p-kate',   'Kate Morrison',  'Perfect. That\'s exactly the story. Talk soon, everyone.', 1450, 1462),
];

const m1Actions: ActionItem[] = [
  actionItem('m1-a1', M1_ID, 'Extract and isolate calendar OAuth piece of v2 API migration', 'Tom Lindqvist', 'p-tom', '2026-10-18', false, 715),
  actionItem('m1-a2', M1_ID, 'Set up isolated v2 staging environment for OAuth component', 'David Nguyen', 'p-david', '2026-10-20', false, 750),
  actionItem('m1-a3', M1_ID, 'Begin onboarding redesign handoff to Nina after OAuth ready', 'Priya Kapoor', 'p-priya', '2026-10-25', false, 1017),
  actionItem('m1-a4', M1_ID, 'Write Q4 planning decisions and board targets to company wiki', 'James Okafor', 'p-james', '2026-10-11', true, 1117),
  actionItem('m1-a5', M1_ID, 'Set up A/B retention cohorts for new onboarding measurement', 'Elena Vasquez', 'p-elena', '2026-11-14', false, 822),
  actionItem('m1-a6', M1_ID, 'Design beta badge and in-product feedback widget for AI summarization', 'Priya Kapoor', 'p-priya', '2026-10-18', false, 1017),
  actionItem('m1-a7', M1_ID, 'Set up load test for 500 concurrent signups on new onboarding flow', 'David Nguyen', 'p-david', '2026-11-10', false, 1230),
  actionItem('m1-a8', M1_ID, 'Schedule design review with Sarah and James for onboarding before production', 'Priya Kapoor', 'p-priya', '2026-11-15', false, 1180),
  actionItem('m1-a9', M1_ID, 'Send retention dashboard link to Kate Morrison', 'Elena Vasquez', 'p-elena', '2026-10-11', true, 1424),
  actionItem('m1-a10', M1_ID, 'Notify Kate 1 week before enterprise beta AI summarization launch', 'Marcus Webb', 'p-marcus', '2026-10-24', false, 1045),
];

const m1Highlights: Highlight[] = [
  highlight('m1-h1', M1_ID, 'm1-s5',  143, 'Our 90-day cohort retention dropped from 71% to 64% over the last two quarters.', 'Elena Vasquez', 'Critical retention metric — board needs to see this'),
  highlight('m1-h2', M1_ID, 'm1-s7',  190, 'Users who don\'t connect a calendar within 48 hours have a 23% lower retention rate.', 'Elena Vasquez', 'Key insight driving onboarding change'),
  highlight('m1-h3', M1_ID, 'm1-s20', 620, 'Finish the API migration by November 1st. Then Nina takes the onboarding. We ship to production by December 1st.', 'Marcus Webb', 'Agreed timeline — sequential approach'),
  highlight('m1-h4', M1_ID, 'm1-s30', 954, 'Two of my biggest enterprise deals are blocked on AI summarization.', 'Omar Hussain', 'Revenue dependency on AI feature'),
];

const m1Summaries = makeSummaries(M1_ID, {
  standard: {
    overview: 'The Q4 product planning session focused on achieving 10,000 paying customers by end of Q1. Key topics included retention metrics, the onboarding redesign, v2 API migration sequencing, and enterprise beta release of AI summarization.',
    sections: [
      { title: 'Key Discussion Points', content: '• Board has set a target of 10,000 paying customers by end of Q1 (currently at 6,200)\n• 90-day retention dropped from 71% to 64%, driven primarily by poor calendar activation\n• Users who don\'t connect a calendar within 48 hours have 23% lower retention\n• v2 API migration is 78% complete; remaining 22% includes legacy webhooks and billing integration\n• AI summarization is in beta (200 users), quality is good but latency averages 40 seconds' },
      { title: 'Decisions Made', content: '• Sequential approach for API migration: OAuth extraction first (2 weeks), then onboarding redesign\n• Target November 15th for new onboarding in production\n• Enterprise beta release of AI summarization with opt-in, beta label, and feedback widget\n• Load test of new onboarding flow (500 concurrent signups) before production launch' },
      { title: 'Open Questions', content: '• Will 7-point retention improvement be enough to hit Q1 growth targets without additional acquisition push?\n• Can AI summarization latency be reduced below 40 seconds before general availability?\n• How will board respond if Q4 retention improvements are slower than projected?' },
      { title: 'Next Steps', content: '• Tom + David: Scope OAuth extraction this week, estimate by Wednesday\n• Priya + Nina: Onboarding handoff after OAuth ready (~Oct 25)\n• Elena: Set up A/B retention cohorts before new onboarding launches\n• James: Q4 decisions in company wiki by end of day\n• Marcus: Flag Kate 1 week before enterprise beta AI summarization ships' },
    ],
  },
  executive: {
    overview: 'Q4 planning session established path to 10k paying customer goal. Critical blocker is a 7-point retention deficit driven by poor onboarding activation. Team has a clear sequential plan: API migration → onboarding redesign → measurement. Revenue risk from two enterprise deals blocked on AI summarization resolved with controlled beta release.',
    sections: [
      { title: 'Business Situation', content: 'Current state: 6,200 paying customers vs Q1 board target of 10,000. Root cause of growth gap is retention (71% → 64%), not acquisition. The fix is an onboarding redesign that moves calendar connection from step 5 to step 2.' },
      { title: 'Key Decisions', content: '• Prioritize API migration (done Nov 1) → onboarding (live Nov 15) → measure impact\n• Release AI summarization as controlled enterprise beta immediately — two deals depend on it\n• Load test infrastructure before any production launch' },
      { title: 'Financial Implications', content: 'Omar Hussain has two enterprise deals (est. ~$180k ARR from the full pipeline) blocked on AI summarization. Controlled beta could unblock these this quarter. Retention improvement is the longer-term revenue lever.' },
      { title: 'Risks', content: '• Sequential API/onboarding approach compresses testing window to December only\n• AI summarization latency (40s) may create poor enterprise user experience in beta\n• Load test gap: calendar OAuth adds new external API call on every signup path' },
    ],
  },
  sales: {
    overview: 'Enterprise sales pipeline has 280 leads (60 qualified enterprise). Two high-value enterprise deals are directly blocked on AI summarization feature. A controlled beta release has been approved and will be available within weeks.',
    sections: [
      { title: 'Pipeline & Revenue Outlook', content: '• 280 leads in pipeline, 60 qualified enterprise\n• ~40% close rate on enterprise cohort projected → 24 accounts → ~$180k ARR\n• Two specific deals blocked on AI summarization; controlled beta approved to unblock' },
      { title: 'Competitive Context', content: 'Enterprise prospects are specifically asking about AI summarization. Releasing even a labeled beta with the 40-second latency gives sales a concrete answer and a demo-able feature.' },
      { title: 'Customer Success Handoff', content: 'Kate Morrison to proactively brief enterprise accounts on AI summarization beta before launch. Will frame as early access / co-development opportunity to set positive expectations.' },
      { title: 'Sales Action Items', content: '• Omar: Brief the two enterprise deals on AI summarization beta timeline\n• Kate: Prepare enterprise account messaging using 23% retention data point\n• Get 1-week advance notice from Marcus before beta ships' },
    ],
  },
  engineering: {
    overview: 'Two major engineering tracks for Q4: (1) v2 API migration completion with OAuth extraction as the critical path, and (2) onboarding redesign dependent on the OAuth component. AI summarization latency optimization runs as a third parallel track.',
    sections: [
      { title: 'Technical Decisions', content: '• Sequential approach chosen over parallel: OAuth extraction (2 wks) → onboarding handoff → Nov 15 prod\n• Tom + David will isolate calendar OAuth from the broader v2 migration first\n• New onboarding will be built against v2 API only (not v1 bridge)\n• Load test: 500 concurrent signups before production launch' },
      { title: 'Technical Debt & Risk', content: '• 22% of v2 migration remains: legacy webhook handlers + billing integration\n• Calendar OAuth adds one new external API call per signup — latency and reliability implications\n• AI summarization pipeline averages 40s per meeting; target is reduction before GA' },
      { title: 'Sprint Priorities (by team)', content: 'Tom (Backend): OAuth extraction → remaining v2 migration → AI summarization latency\nNina (Frontend): Onboarding redesign (starts ~Oct 25)\nDavid (DevOps): Isolated v2 OAuth staging environment → load test setup\nMarcus: Architecture oversight + enterprise beta coordination' },
      { title: 'Dependencies', content: '• Onboarding redesign BLOCKED on calendar OAuth API readiness\n• Enterprise AI beta BLOCKED on Priya\'s beta badge and feedback widget (due Oct 18)\n• Production launch BLOCKED on load test passing (500 concurrent signups)' },
    ],
  },
  interview: {
    overview: 'N/A — This was a product planning meeting, not an interview. Summary below uses Standard Meeting Notes format instead.',
    sections: [
      { title: 'Meeting Summary', content: 'Q4 product planning session with 8 participants. See Standard Meeting Notes template for the full summary of this session.' },
    ],
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MEETING 2 — Client Discovery (32 min, 4 participants)
// ═══════════════════════════════════════════════════════════════════════════
const M2_ID = 'meet-002';
const m2Transcript: TranscriptSegment[] = [
  seg('m2-s1',  M2_ID, 'p-sarah',  'Sarah Chen',   'Thanks for making time, Diana, Rob. We\'ve been looking forward to understanding your team\'s workflow better. The goal today is listening — we want to understand your pain points before we talk about solutions.', 5, 32),
  seg('m2-s2',  M2_ID, 'p-diana',  'Diana Park',   'Appreciate that approach. Honestly, most vendors skip straight to the demo. So we run about 40 product reviews per week across the organization — different teams, different formats. Right now it\'s all in Google Docs and Notion. The problem is: nothing connects.', 34, 78),
  seg('m2-s3',  M2_ID, 'p-rob',    'Rob Ellison',  'From an engineering perspective, I\'ll add — we lose about two hours per engineer per week just on meeting follow-up. That\'s writing up notes, distributing them, chasing action items in Slack. It\'s an enormous productivity sink.', 80, 112),
  seg('m2-s4',  M2_ID, 'p-james',  'James Okafor', 'Rob, when you say meeting follow-up, is that mostly internal engineering standups, or cross-functional meetings too?', 114, 128),
  seg('m2-s5',  M2_ID, 'p-rob',    'Rob Ellison',  'Mostly cross-functional. The standups are quick, 15 minutes. But the design reviews, the client calls, the sprint planning sessions — those generate a lot of documentation work. And the documentation quality varies wildly depending on who\'s running it.', 130, 168),
  seg('m2-s6',  M2_ID, 'p-diana',  'Diana Park',   'That\'s the core issue. We need consistency. If Sarah runs a product review, her notes are excellent. If someone else runs it, you get bullet points and no context. We\'ve tried templates, we\'ve tried training, it just doesn\'t stick.', 170, 210),
  seg('m2-s7',  M2_ID, 'p-sarah',  'Sarah Chen',   'How do action items get tracked today? Is there a system, or is it more ad hoc?', 212, 225),
  seg('m2-s8',  M2_ID, 'p-diana',  'Diana Park',   'Almost entirely ad hoc. After a meeting, someone will post a Slack message with a list of actions. Some get picked up, some get lost. We have no visibility into completion. It\'s one of my biggest frustrations.', 227, 262),
  seg('m2-s9',  M2_ID, 'p-rob',    'Rob Ellison',  'I\'d add — we also have a compliance requirement. Any decision made in a product review needs to be traceable. We\'ve had incidents where a decision was made in a meeting, it wasn\'t documented properly, and six months later no one could remember why we did what we did.', 264, 305),
  seg('m2-s10', M2_ID, 'p-james',  'James Okafor', 'That\'s a really important point, Rob. Audit trails for product decisions. That\'s something our platform addresses directly. Can I ask — how many people are in your organization would be affected by a tool like this?', 307, 340),
  seg('m2-s11', M2_ID, 'p-diana',  'Diana Park',   'Directly? Probably 120 people. Developers, product managers, designers. Executives are in a lot of these meetings too but they\'re more consumers of the output than producers.', 342, 370),
  seg('m2-s12', M2_ID, 'p-rob',    'Rob Ellison',  'What does your pricing look like for that scale? Just ballpark — I know you probably have tiers.', 372, 388),
  seg('m2-s13', M2_ID, 'p-sarah',  'Sarah Chen',   'At 120 seats in our Enterprise tier, you\'re looking at roughly $18-22 per user per month, depending on the features enabled. But let\'s not get hung up on numbers today — I want to make sure we\'re solving the right problem first.', 390, 428),
  seg('m2-s14', M2_ID, 'p-diana',  'Diana Park',   'Fair. One more thing I want to mention — we use Zoom, Google Meet, and occasionally Teams depending on the client. Any solution has to work across all three without us having to manage separate integrations.', 430, 462),
  seg('m2-s15', M2_ID, 'p-james',  'James Okafor', 'We support all three natively. And the data is unified in one place regardless of the platform. I\'ll send you our integration docs after the call.', 464, 485),
  seg('m2-s16', M2_ID, 'p-sarah',  'Sarah Chen',   'Diana, Rob — based on what you\'ve shared, I think we have a really strong fit here. The consistency problem, the action item tracking, the audit trail — those are exactly the problems we\'ve built for. Can we schedule a proper demo for next week?', 487, 525),
  seg('m2-s17', M2_ID, 'p-diana',  'Diana Park',   'Yes. Let\'s do it. I\'d like to include our Head of Engineering and one of our senior PMs as well. They\'ll ask the hard questions.', 527, 548),
  seg('m2-s18', M2_ID, 'p-sarah',  'Sarah Chen',   'Perfect. We welcome the hard questions. James will send you a booking link. Thank you both for your time today — this was really valuable.', 550, 572),
  seg('m2-s19', M2_ID, 'p-rob',    'Rob Ellison',  'Before we go — do you have a case study from a company similar to ours? SaaS, engineering-heavy, around 500 people?', 574, 590),
  seg('m2-s20', M2_ID, 'p-sarah',  'Sarah Chen',   'We do. Meridian Labs is a great fit — similar size, engineering-heavy, deployed to 200 seats. I\'ll include the case study in the follow-up email. Rob, Diana, thanks again. Looking forward to the demo.', 592, 625),
];

const m2Actions: ActionItem[] = [
  actionItem('m2-a1', M2_ID, 'Send integration docs for Zoom, Google Meet, and Teams to Diana and Rob', 'James Okafor', 'p-james', '2026-10-06', true, 464),
  actionItem('m2-a2', M2_ID, 'Send booking link for demo with Head of Engineering and senior PM', 'James Okafor', 'p-james', '2026-10-06', true, 550),
  actionItem('m2-a3', M2_ID, 'Include Meridian Labs case study in follow-up email to client', 'Sarah Chen', 'p-sarah', '2026-10-06', true, 592),
  actionItem('m2-a4', M2_ID, 'Prepare full demo focused on: consistency, action items, and audit trail use cases', 'Sarah Chen', 'p-sarah', '2026-10-13', false, 487),
];

const m2Highlights: Highlight[] = [
  highlight('m2-h1', M2_ID, 'm2-s3',  80,  'We lose about two hours per engineer per week just on meeting follow-up.', 'Rob Ellison', 'Strong pain point — quantified ROI for sales'),
  highlight('m2-h2', M2_ID, 'm2-s9',  264, 'We have a compliance requirement — any decision made in a product review needs to be traceable.', 'Rob Ellison', 'Audit trail is a must-have, not nice-to-have'),
];

const m2Summaries = makeSummaries(M2_ID, {
  standard: {
    overview: 'Client discovery call with Diana Park (VP Product) and Rob Ellison (CTO) from a 500-person SaaS company. They run 40 product reviews per week using Google Docs and Notion. Core pain points: inconsistent note quality, ad hoc action item tracking, no audit trail for product decisions.',
    sections: [
      { title: 'Client Pain Points', content: '• Inconsistent meeting documentation — quality depends entirely on who runs the meeting\n• Action items tracked ad hoc via Slack; no visibility into completion\n• No audit trail for product decisions — compliance requirement for traceability\n• Engineers lose ~2 hours/week on meeting follow-up (documentation, chasing action items)\n• Uses Zoom, Google Meet, and Teams — needs cross-platform support' },
      { title: 'Key Discoveries', content: '• ~120 direct users (developers, PMs, designers)\n• Executives are consumers of meeting output, not producers\n• Templates and training have failed to solve the consistency problem\n• Platform decision traceability is a compliance requirement, not just a preference' },
      { title: 'Commercial Discussion', content: '• Ballpark pricing shared: $18-22/user/month for Enterprise tier at 120 seats\n• Client open to moving forward; wants to include Head of Engineering and senior PM in demo' },
      { title: 'Next Steps', content: '• James: Send integration docs and demo booking link\n• Sarah: Send Meridian Labs case study in follow-up email\n• Sarah: Prepare full demo focused on consistency, action item tracking, and audit trail\n• Demo scheduled for week of Oct 13 with expanded client team' },
    ],
  },
  executive: {
    overview: 'Strong-fit enterprise discovery call. Client (500-person SaaS, ~120 seats) has quantified pain: 2h/engineer/week in meeting overhead. Compliance requirement for decision traceability is a compelling hook. Demo scheduled.',
    sections: [
      { title: 'Opportunity Size', content: '120 seats × ~$20/user/month = ~$2,400/month ARR ($28.8k annually). Strong expansion potential given 500-person total org.' },
      { title: 'Win Conditions', content: '• Cross-platform support (Zoom + Meet + Teams) ✓ — confirmed supported\n• Action item visibility and completion tracking ✓ — core feature\n• Audit trail / decision traceability ✓ — key differentiator to highlight in demo' },
      { title: 'Competitive Risk', content: 'Client is clearly evaluating multiple vendors (discovery posture, pricing question). Differentiate on the audit trail and consistency angle, which is less common in the market.' },
    ],
  },
  sales: {
    overview: 'Qualified enterprise discovery. 120-seat opportunity at ~$2.4k/month. Pain is quantified, compliance angle is strong, cross-platform requirement is met. Demo set for next week.',
    sections: [
      { title: 'Qualification Summary', content: '• Champion: Diana Park (VP Product)\n• Economic buyer likely: Rob Ellison (CTO)\n• Users: 120 developers, PMs, designers\n• Decision timeline: implied Q4 given demo urgency\n• Budget: not confirmed, but receptive to $18-22/user/month' },
      { title: 'Demo Prep Checklist', content: '• Lead with consistency problem — Priya\'s "template doesn\'t stick" resonates\n• Show action item tracking with completion status and Slack integration\n• Demo audit trail / decision history — this is the compliance hook\n• Have Meridian Labs case study ready — Rob asked specifically' },
      { title: 'Next Steps', content: '• Send integration docs and case study today\n• Book demo for next week with Head of Engineering + senior PM in the room\n• Confirm pricing authority of Rob vs Diana before the demo' },
    ],
  },
  engineering: {
    overview: 'Client uses Zoom, Google Meet, and Teams. All three are supported natively. Client asked about integration docs — sent post-call. No engineering-specific technical requirements surfaced beyond cross-platform and audit trail.',
    sections: [
      { title: 'Technical Requirements', content: '• Multi-platform: Zoom ✓, Google Meet ✓, Microsoft Teams ✓\n• Audit trail for decisions: supported via timestamped transcript + summary archive\n• No mention of SSO, data residency, or on-prem requirements yet — worth surfacing in demo' },
    ],
  },
  interview: {
    overview: 'N/A — this was a sales discovery call. Summary uses Sales Call format.',
    sections: [{ title: 'Note', content: 'This meeting was a client discovery call. Please see the Sales Call summary template.' }],
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MEETING 3 — Engineering Standup (15 min, 6 participants)
// ═══════════════════════════════════════════════════════════════════════════
const M3_ID = 'meet-003';
const m3Transcript: TranscriptSegment[] = [
  seg('m3-s1',  M3_ID, 'p-rachel', 'Rachel Bloom',    'Good morning team. Quick standup — let\'s keep it tight. Marcus, you start.', 5, 16),
  seg('m3-s2',  M3_ID, 'p-marcus', 'Marcus Webb',     'Yesterday: reviewed Tom\'s OAuth extraction PR. Today: pair with Tom on the webhook handler refactor. Blocker: need David to provision the new staging creds by 10 AM or I\'m blocked.', 18, 42),
  seg('m3-s3',  M3_ID, 'p-david',  'David Nguyen',    'Already done. I sent the creds to your Slack DM this morning.', 44, 52),
  seg('m3-s4',  M3_ID, 'p-marcus', 'Marcus Webb',     'Oh, great. Didn\'t see it. No blocker then.', 54, 60),
  seg('m3-s5',  M3_ID, 'p-rachel', 'Rachel Bloom',    'Tom, you\'re up.', 62, 65),
  seg('m3-s6',  M3_ID, 'p-tom',    'Tom Lindqvist',   'Yesterday: finished the OAuth extraction — it\'s in review. Today: tackling the billing webhook handler. I need the test data set from Elena to verify the edge cases.', 66, 90),
  seg('m3-s7',  M3_ID, 'p-elena',  'Elena Vasquez',   'I\'ll send you the test dataset right after this standup. It\'s already exported, just need to share the folder.', 92, 105),
  seg('m3-s8',  M3_ID, 'p-rachel', 'Rachel Bloom',    'Nina?', 107, 108),
  seg('m3-s9',  M3_ID, 'p-nina',   'Nina Johansson',  'Yesterday: built the new progress indicator for the onboarding flow. Today: working on the calendar permission request screen. No blockers, but I want to flag — the Figma spec has an inconsistency in the mobile breakpoint. Priya, are you available for a quick sync at 2 PM?', 109, 145),
  seg('m3-s10', M3_ID, 'p-rachel', 'Rachel Bloom',    'Priya\'s not on this standup but I\'ll send her a message. David?', 147, 158),
  seg('m3-s11', M3_ID, 'p-david',  'David Nguyen',    'Yesterday: provisioned the staging creds and set up the monitoring for the new OAuth environment. Today: setting up the load test framework — should have the first draft by end of day. No blockers.', 159, 192),
  seg('m3-s12', M3_ID, 'p-rachel', 'Rachel Bloom',    'Good. Elena?', 194, 197),
  seg('m3-s13', M3_ID, 'p-elena',  'Elena Vasquez',   'Yesterday: finished setting up the A/B cohort framework for the onboarding experiment. Today: validating the event tracking is firing correctly in staging. Blocker: I need the feature flag name from Marcus so I can target the right cohort.', 199, 235),
  seg('m3-s14', M3_ID, 'p-marcus', 'Marcus Webb',     'Flag name is "onboarding_v2_calendar_first" — I\'ll put it in the engineering channel right now.', 237, 252),
  seg('m3-s15', M3_ID, 'p-rachel', 'Rachel Bloom',    'Great. Quick note — sprint retrospective is Friday at 3 PM. Please don\'t reschedule — we\'ve already moved it twice. Any blockers or questions before we close?', 254, 280),
  seg('m3-s16', M3_ID, 'p-tom',    'Tom Lindqvist',   'Just a heads up — the billing webhook refactor is more complex than I estimated. It might bleed into tomorrow. I\'ll flag if it does.', 282, 300),
  seg('m3-s17', M3_ID, 'p-marcus', 'Marcus Webb',     'That\'s fine — it\'s not on the critical path this week. Thanks everyone. Good standup.', 302, 316),
];

const m3Actions: ActionItem[] = [
  actionItem('m3-a1', M3_ID, 'Share test dataset folder with Tom for billing webhook edge cases', 'Elena Vasquez', 'p-elena', '2026-10-09', true, 92),
  actionItem('m3-a2', M3_ID, 'Post feature flag name "onboarding_v2_calendar_first" to engineering channel', 'Marcus Webb', 'p-marcus', '2026-10-09', true, 237),
  actionItem('m3-a3', M3_ID, 'Sync with Priya on Figma mobile breakpoint inconsistency', 'Nina Johansson', 'p-nina', '2026-10-09', false, 109),
];

const m3Highlights: Highlight[] = [
  highlight('m3-h1', M3_ID, 'm3-s13', 199, 'Blocker: I need the feature flag name from Marcus so I can target the right cohort.', 'Elena Vasquez'),
];

const m3Summaries = makeSummaries(M3_ID, {
  standard: {
    overview: 'Daily engineering standup. Team is on track with OAuth extraction and onboarding implementation. Minor blockers resolved during the call.',
    sections: [
      { title: 'Team Status', content: '• Marcus: OAuth PR reviewed, pairing with Tom on webhook refactor. Blocker (staging creds) self-resolved.\n• Tom: OAuth extraction in review. Moving to billing webhook. Needs test data from Elena (delivered).\n• Nina: Progress indicator done, working on calendar permission screen. Flagged Figma mobile inconsistency.\n• David: Staging provisioned, starting load test framework. No blockers.\n• Elena: A/B cohorts set up, validating event tracking. Needed feature flag name (provided by Marcus).' },
      { title: 'Decisions Made', content: '• Feature flag name confirmed: "onboarding_v2_calendar_first"\n• Billing webhook refactor may extend into next day — not on critical path this week' },
      { title: 'Next Steps', content: '• Elena: Share test dataset with Tom immediately post-standup\n• Marcus: Post feature flag name to engineering channel\n• Nina: Sync with Priya at 2 PM on Figma mobile breakpoint\n• All: Sprint retrospective Friday 3 PM — do not reschedule' },
    ],
  },
  executive: {
    overview: 'Engineering team on track. No critical blockers. OAuth extraction in review, onboarding development progressing. Load test framework starting today.',
    sections: [
      { title: 'Status', content: 'Green across all tracks. Minor coordination items resolved live in the meeting. Billing webhook refactor may take an extra day — not critical path.' },
    ],
  },
  sales: {
    overview: 'Internal engineering standup — not applicable to sales context.',
    sections: [{ title: 'Note', content: 'This was an internal engineering standup. No sales-relevant content.' }],
  },
  engineering: {
    overview: 'All active engineering tracks are progressing. OAuth extraction is in code review. Onboarding frontend work is underway. A/B experiment infrastructure is ready pending event validation.',
    sections: [
      { title: 'Track Status', content: '• Auth/API (Tom): OAuth extraction ✅ in review. Billing webhook WIP, may take 2 days.\n• Frontend (Nina): Progress indicator ✅. Calendar permission screen WIP. Figma spec has mobile inconsistency — syncing with Priya.\n• DevOps (David): Staging creds provisioned ✅. Load test framework starting today.\n• Data (Elena): A/B cohort framework ✅. Event tracking validation WIP.' },
      { title: 'Dependencies Resolved', content: '• Staging creds delivered to Marcus (DM, pre-standup)\n• Test dataset for billing webhook edge cases: Elena → Tom (post-standup)\n• Feature flag name "onboarding_v2_calendar_first": Marcus → engineering channel' },
    ],
  },
  interview: {
    overview: 'N/A — internal standup meeting.',
    sections: [{ title: 'Note', content: 'Internal engineering standup. Not applicable to interview format.' }],
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MEETING 4 — Design Review (45 min, 5 participants)
// ═══════════════════════════════════════════════════════════════════════════
const M4_ID = 'meet-004';
const m4Transcript: TranscriptSegment[] = [
  seg('m4-s1',  M4_ID, 'p-priya',  'Priya Kapoor',   'Okay everyone, I\'m sharing my screen now. Today we\'re reviewing the new onboarding flow — five screens, complete with micro-interactions. I\'ll walk through each screen and I want honest feedback, not politeness.', 8, 40),
  seg('m4-s2',  M4_ID, 'p-sarah',  'Sarah Chen',     'Before we start — quick framing: the goal of this redesign is to increase calendar connection rate. If anything we see today doesn\'t serve that goal, it shouldn\'t be there.', 42, 60),
  seg('m4-s3',  M4_ID, 'p-priya',  'Priya Kapoor',   'Screen one: Welcome. We\'ve gone from a text-heavy welcome page to a single value proposition and one CTA. "Connect your calendar. Never miss a follow-up." Clean, direct. The animation here is a subtle calendar icon that resolves into a checkmark.', 62, 100),
  seg('m4-s4',  M4_ID, 'p-james',  'James Okafor',   'I like the brevity. My concern is: does the user know what the product does from this screen? Someone who just signed up through a Google ad might not have context.', 102, 122),
  seg('m4-s5',  M4_ID, 'p-priya',  'Priya Kapoor',   'Good point. I can add a one-line product descriptor under the logo. Something like "AI meeting notes, automatically." Short enough not to clutter, enough context to anchor.', 124, 145),
  seg('m4-s6',  M4_ID, 'p-nina',   'Nina Johansson', 'The animation timing feels slightly too fast on my machine. If it\'s too fast on a slow connection, users might miss it and just see a static screen.', 147, 165),
  seg('m4-s7',  M4_ID, 'p-priya',  'Priya Kapoor',   'I can add a prefer-reduced-motion check and also add a 200ms delay on the animation start. That should help.', 167, 180),
  seg('m4-s8',  M4_ID, 'p-sarah',  'Sarah Chen',     'Screen two is the critical one. Let\'s spend time here.', 182, 192),
  seg('m4-s9',  M4_ID, 'p-priya',  'Priya Kapoor',   'Screen two: Calendar Connection. We\'re asking for Google Calendar or Outlook sync upfront. The key design decision here was showing a preview of what happens after — a sample meeting list with AI summaries. We\'re showing value before asking for access.', 194, 235),
  seg('m4-s10', M4_ID, 'p-marcus', 'Marcus Webb',    'I love the value-first approach. One technical concern: we\'re showing a mock meeting list. If the real meeting list looks different — different card density, different colors — that sets a wrong expectation.', 237, 262),
  seg('m4-s11', M4_ID, 'p-priya',  'Priya Kapoor',   'That\'s a fair point. I can use actual app screenshots rather than a designed mock. Nina, can you give me three screenshots from the staging build that look polished?', 264, 285),
  seg('m4-s12', M4_ID, 'p-nina',   'Nina Johansson', 'Sure. I\'ll have them by tomorrow morning. The staging build is looking clean now that the new card design is in.', 287, 302),
  seg('m4-s13', M4_ID, 'p-james',  'James Okafor',   'What\'s the permission scope we\'re requesting? Users are very sensitive about calendar access. We should be explicit.', 304, 322),
  seg('m4-s14', M4_ID, 'p-priya',  'Priya Kapoor',   'Read-only. We only read calendar events to know when meetings start. We don\'t write, we don\'t modify. I have a small permission explainer at the bottom of screen two that says exactly that.', 324, 350),
  seg('m4-s15', M4_ID, 'p-marcus', 'Marcus Webb',    'Good. Can we add a link to the privacy policy from that permission explainer? Enterprise customers will want that.', 352, 366),
  seg('m4-s16', M4_ID, 'p-priya',  'Priya Kapoor',   'Already in the design. Small "Privacy Policy" link in the explainer text.', 368, 378),
  seg('m4-s17', M4_ID, 'p-sarah',  'Sarah Chen',     'Excellent. Screens three, four, five?', 380, 388),
  seg('m4-s18', M4_ID, 'p-priya',  'Priya Kapoor',   'Screen three is a success state — calendar connected, showing the first synced meeting. Screen four is the notification preferences screen. Screen five is the dashboard, with a tooltip highlighting "Your first meeting is here."', 390, 430),
  seg('m4-s19', M4_ID, 'p-james',  'James Okafor',   'The notification preferences screen — is that required? It\'s adding friction right after we got the calendar connection. Could we move it to settings and just use smart defaults?', 432, 455),
  seg('m4-s20', M4_ID, 'p-priya',  'Priya Kapoor',   'You\'re probably right. The research shows notification preferences screens have high skip rates. Smart defaults — daily digest on, real-time for action items assigned to you — and we let users change later. I\'ll cut screen four.', 457, 492),
  seg('m4-s21', M4_ID, 'p-sarah',  'Sarah Chen',     'Good call. Four screens is better than five. Nina, how does removing the preferences screen affect your implementation timeline?', 494, 512),
  seg('m4-s22', M4_ID, 'p-nina',   'Nina Johansson', 'It actually saves half a day. I was dreading that screen — the toggle interactions were fiddly. Happy to cut it.', 514, 530),
  seg('m4-s23', M4_ID, 'p-marcus', 'Marcus Webb',    'Smart defaults need to be documented for the backend. I need to know exactly what the defaults are so the API initializes new users correctly.', 532, 550),
  seg('m4-s24', M4_ID, 'p-priya',  'Priya Kapoor',   'I\'ll write them up in the design doc. Daily summary digest: on. Real-time alerts for action items assigned to you: on. Everything else: off.', 552, 572),
  seg('m4-s25', M4_ID, 'p-sarah',  'Sarah Chen',     'Perfect. Overall — this is a really strong revision, Priya. The value-first calendar screen is the right call. My only ask is we do one more round of the mobile views before sign-off. Nina flagged an inconsistency in the Figma spec.', 574, 612),
  seg('m4-s26', M4_ID, 'p-nina',   'Nina Johansson', 'Specifically the 375px breakpoint — the CTA button was overflowing the card container. Easy fix but needs to be in the spec before I implement.', 614, 635),
  seg('m4-s27', M4_ID, 'p-priya',  'Priya Kapoor',   'I\'ll fix that breakpoint today. I\'ll push an updated Figma link to the design channel by 5 PM.', 637, 650),
  seg('m4-s28', M4_ID, 'p-sarah',  'Sarah Chen',     'Great. Decision: design is approved pending mobile fix and real screenshots on screen two. Priya, once those are done, you\'re clear to proceed with handoff.', 652, 675),
];

const m4Actions: ActionItem[] = [
  actionItem('m4-a1', M4_ID, 'Add one-line product descriptor to Welcome screen ("AI meeting notes, automatically.")', 'Priya Kapoor', 'p-priya', '2026-10-10', true, 124),
  actionItem('m4-a2', M4_ID, 'Fix 375px CTA breakpoint overflow in Figma spec and push updated link to design channel', 'Priya Kapoor', 'p-priya', '2026-10-09', true, 637),
  actionItem('m4-a3', M4_ID, 'Provide three polished screenshots from staging build for Calendar Connection screen', 'Nina Johansson', 'p-nina', '2026-10-10', true, 287),
  actionItem('m4-a4', M4_ID, 'Document notification smart defaults in design doc for Marcus (daily digest: on, action item alerts: on)', 'Priya Kapoor', 'p-priya', '2026-10-10', false, 552),
  actionItem('m4-a5', M4_ID, 'Remove notification preferences screen (screen 4) from onboarding flow; use smart defaults', 'Priya Kapoor', 'p-priya', '2026-10-09', true, 457),
];

const m4Highlights: Highlight[] = [
  highlight('m4-h1', M4_ID, 'm4-s9',  194, 'We\'re showing value before asking for access — showing a sample meeting list with AI summaries on the calendar connection screen.', 'Priya Kapoor', 'Key design principle — value before ask'),
  highlight('m4-h2', M4_ID, 'm4-s20', 457, 'Notification preferences screens have high skip rates. Smart defaults, let users change later. I\'ll cut screen four.', 'Priya Kapoor', 'Less friction = better activation'),
];

const m4Summaries = makeSummaries(M4_ID, {
  standard: {
    overview: 'Design review of the new 5-screen onboarding flow. The design was approved pending two fixes: a mobile breakpoint correction and real app screenshots on the calendar connection screen. Screen 4 (notification preferences) was cut in favor of smart defaults.',
    sections: [
      { title: 'Design Decisions', content: '• Welcome screen: Add one-line product descriptor ("AI meeting notes, automatically.")\n• Calendar Connection screen (screen 2): Use real app screenshots instead of mocks; privacy policy link confirmed present\n• Notification preferences screen (screen 4): REMOVED — smart defaults instead\n• Smart defaults: daily digest on, action item real-time alerts on, all else off\n• Animation: add 200ms delay + prefers-reduced-motion check' },
      { title: 'Approvals and Sign-offs', content: 'Design approved pending:\n1. Mobile fix: 375px breakpoint CTA overflow (Priya → today)\n2. Real screenshots from staging (Nina → tomorrow morning)\nOnce done, Priya proceeds with handoff to Nina.' },
      { title: 'Next Steps', content: '• Priya: Fix breakpoint, push updated Figma by 5 PM\n• Nina: Send three staging screenshots to Priya by tomorrow morning\n• Priya: Document notification smart defaults for Marcus in design doc\n• Marcus: Initialize new user API with documented smart defaults' },
    ],
  },
  executive: {
    overview: 'Onboarding redesign design review completed. Design approved. Scope reduced by one screen. Handoff proceeds to development.',
    sections: [
      { title: 'Status', content: 'Design approved pending two minor fixes (both completing today/tomorrow). Scope intentionally reduced: 5 screens → 4 screens by removing notification preferences screen. This saves half a day of dev time and reduces onboarding friction.' },
    ],
  },
  sales: {
    overview: 'Internal design review — not a sales meeting.',
    sections: [{ title: 'Note', content: 'Internal design review meeting. The new onboarding design will improve customer activation rate, which directly improves sales conversion from trials.' }],
  },
  engineering: {
    overview: 'Onboarding redesign approved. Implementation scope is 4 screens (not 5). Smart defaults need to be implemented in new user initialization API. Mobile breakpoint fix required before handoff is final.',
    sections: [
      { title: 'Implementation Notes', content: '• 4 screens total (welcome, calendar connection, success state, dashboard with tooltip)\n• Animation: 200ms delay + prefers-reduced-motion check on welcome screen\n• Smart defaults to implement in new user API: daily_digest=true, action_item_realtime=true, all_others=false\n• Screenshot assets: Nina provides 3 screenshots from staging for screen 2 (tomorrow)' },
      { title: 'Handoff Conditions', content: '• BLOCKED until: Priya fixes 375px breakpoint in Figma\n• Nina can begin implementation after Figma is updated (expected today)' },
    ],
  },
  interview: {
    overview: 'N/A — design review meeting.',
    sections: [{ title: 'Note', content: 'Internal design review. Not applicable to interview format.' }],
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MEETING 5 — Sales Follow-up (28 min, 3 participants)
// ═══════════════════════════════════════════════════════════════════════════
const M5_ID = 'meet-005';
const m5Transcript: TranscriptSegment[] = [
  seg('m5-s1',  M5_ID, 'p-omar',   'Omar Hussain',  'Thanks for jumping on a quick call, Claire. I wanted to debrief the Vertex Systems call — I think we\'re in a good position but there are some concerns we need to address.', 5, 28),
  seg('m5-s2',  M5_ID, 'p-claire', 'Claire Fontaine','Walk me through it. What did they say?', 30, 37),
  seg('m5-s3',  M5_ID, 'p-omar',   'Omar Hussain',  'Their main blocker is data security. They want to know exactly where meeting data is stored, who has access, and whether we can sign a DPA before they run a pilot. Their legal team flagged this specifically.', 39, 72),
  seg('m5-s4',  M5_ID, 'p-claire', 'Claire Fontaine','That\'s standard for enterprise. We have the DPA ready — it\'s in the legal folder. Have you sent it over yet?', 74, 90),
  seg('m5-s5',  M5_ID, 'p-omar',   'Omar Hussain',  'Not yet. I wanted to brief you first and make sure our security posture answers their specific concerns. They asked about: data encryption at rest and in transit, third-party sub-processors, and our SOC 2 status.', 92, 130),
  seg('m5-s6',  M5_ID, 'p-claire', 'Claire Fontaine','SOC 2 Type II is in progress — we expect the report in December. For now, we have our security one-pager and the sub-processor list. Data is AES-256 at rest, TLS 1.3 in transit. That answers two of the three.', 132, 168),
  seg('m5-s7',  M5_ID, 'p-kate',   'Kate Morrison', 'Sorry to jump in — I\'ve handled this exact situation with two other enterprise accounts. The SOC 2 gap is manageable if you frame it right: "Type II in progress, expected December, we can share the current controls documentation." Most legal teams accept that with a DPA.', 170, 210),
  seg('m5-s8',  M5_ID, 'p-omar',   'Omar Hussain',  'That\'s helpful, Kate. Can you send me the current controls documentation? I\'d like to include it in the security package I send Vertex.', 212, 230),
  seg('m5-s9',  M5_ID, 'p-kate',   'Kate Morrison', 'I\'ll send it over this afternoon. Also — do you want me to join the next Vertex call? Having customer success on the call can signal that we\'re invested in their long-term success, not just closing the deal.', 232, 262),
  seg('m5-s10', M5_ID, 'p-omar',   'Omar Hussain',  'Yes, that\'s a great idea. They asked about onboarding support specifically. Having you there would be perfect.', 264, 280),
  seg('m5-s11', M5_ID, 'p-claire', 'Claire Fontaine','One more thing — what\'s their timeline for a decision?', 282, 292),
  seg('m5-s12', M5_ID, 'p-omar',   'Omar Hussain',  'They want to make a decision by end of October. They\'re trying to include it in their Q4 budget. So we have about three weeks.', 294, 318),
  seg('m5-s13', M5_ID, 'p-claire', 'Claire Fontaine','Okay. Priority one this week: security package. That unblocks the pilot. Once they\'re in a pilot, we have a much better chance of converting. Omar, let\'s set a target — security package out by Wednesday?', 320, 352),
  seg('m5-s14', M5_ID, 'p-omar',   'Omar Hussain',  'Wednesday works. I\'ll compile the DPA, the sub-processor list, the security one-pager, and the controls documentation Kate is sending. Full security package by Wednesday.', 354, 380),
  seg('m5-s15', M5_ID, 'p-kate',   'Kate Morrison', 'And I\'ll block time on my calendar for the Vertex call next week. Omar, send me the invite when you have it.', 382, 398),
  seg('m5-s16', M5_ID, 'p-claire', 'Claire Fontaine','Good. If they come back asking about on-prem deployment — which they might — we don\'t support it. Be upfront. Don\'t overpromise.', 400, 420),
  seg('m5-s17', M5_ID, 'p-omar',   'Omar Hussain',  'Understood. I\'ll keep it clean. One last thing — what\'s the competitive situation here? Did they mention anyone else they\'re evaluating?', 422, 440),
  seg('m5-s18', M5_ID, 'p-claire', 'Claire Fontaine','They mentioned Fireflies and Otter.ai by name. Fireflies is strong on integration breadth. We win on AI quality and the decision audit trail angle. Lead with that in the follow-up.', 442, 470),
  seg('m5-s19', M5_ID, 'p-omar',   'Omar Hussain',  'Perfect. AI quality and the audit trail. That\'s the message. Alright, thanks both. Let\'s move fast on this one — the window is narrow.', 472, 492),
];

const m5Actions: ActionItem[] = [
  actionItem('m5-a1', M5_ID, 'Compile and send security package to Vertex Systems (DPA, sub-processor list, security one-pager, controls doc)', 'Omar Hussain', 'p-omar', '2026-10-15', false, 354),
  actionItem('m5-a2', M5_ID, 'Send current SOC 2 controls documentation to Omar', 'Kate Morrison', 'p-kate', '2026-10-11', false, 232),
  actionItem('m5-a3', M5_ID, 'Block time for Vertex Systems next call; wait for Omar\'s invite', 'Kate Morrison', 'p-kate', '2026-10-14', false, 382),
];

const m5Highlights: Highlight[] = [
  highlight('m5-h1', M5_ID, 'm5-s7',  170, '"Type II in progress, expected December, we can share the current controls documentation." Most legal teams accept that with a DPA.', 'Kate Morrison', 'Good framing for SOC 2 gap objection'),
  highlight('m5-h2', M5_ID, 'm5-s18', 442, 'Fireflies is strong on integration breadth. We win on AI quality and the decision audit trail angle.', 'Claire Fontaine', 'Competitive positioning — use in follow-up'),
];

const m5Summaries = makeSummaries(M5_ID, {
  standard: {
    overview: 'Internal sales debrief on the Vertex Systems enterprise deal. Main blocker is data security concerns (DPA, SOC 2, sub-processors). Plan is to send a full security package by Wednesday to unblock the pilot. Decision timeline is end of October.',
    sections: [
      { title: 'Deal Status', content: '• Prospect: Vertex Systems\n• Stage: Pre-pilot; security concerns are the gating blocker\n• Decision timeline: End of October (Q4 budget cycle)\n• Competition: Fireflies (integration breadth), Otter.ai\n• Win angle: AI quality + decision audit trail' },
      { title: 'Security Concerns to Address', content: '• Data encryption: AES-256 at rest, TLS 1.3 in transit ✅ (answer ready)\n• Sub-processor list: available ✅\n• SOC 2: Type II in progress, expected December — framing: "share current controls documentation + DPA" ✓\n• DPA: ready to send' },
      { title: 'Next Steps', content: '• Omar: Security package (DPA + sub-processors + one-pager + controls doc) by Wednesday Oct 15\n• Kate: Send controls documentation to Omar today\n• Kate: Join next Vertex call to discuss onboarding support\n• Omar: Avoid any on-prem promises — not supported' },
    ],
  },
  executive: {
    overview: 'Enterprise deal (Vertex Systems) is actionable. Security package unblocks the pilot. Three-week window to close. Kate joining next call to strengthen onboarding commitment.',
    sections: [
      { title: 'Deal Summary', content: 'Vertex Systems is in Q4 budget cycle with a decision deadline of end of October. Pilot is blocked only by data security review — solvable with the existing security package. Competitive win angle: AI quality and audit trail vs. Fireflies/Otter.ai.' },
    ],
  },
  sales: {
    overview: 'Vertex Systems deal debrief. Main blocker resolved with security package plan. Timeline is tight — end of October. Kate joining next call. Lead with AI quality and audit trail differentiators.',
    sections: [
      { title: 'MEDDIC Analysis', content: '• Metrics: not yet quantified for Vertex — ask on next call\n• Economic Buyer: unknown — surface in next call\n• Decision Criteria: data security, AI quality, support quality\n• Decision Process: pilot → approval by legal + procurement\n• Identify Pain: meeting follow-up overhead (inferred, not yet confirmed for Vertex specifically)\n• Champion: Omar\'s contact (name not shared in call)' },
      { title: 'Competitive Strategy', content: 'Fireflies: strong on integrations. Counter with AI summary quality demo and decision audit trail — both are features Fireflies lacks at the same level. Otter: weaker AI, weaker enterprise support. Kate joining reinforces the support story.' },
      { title: 'Security Package (due Wednesday)', content: '1. DPA (ready in legal folder)\n2. Sub-processor list\n3. Security one-pager (encryption specs)\n4. Current SOC 2 controls documentation (Kate → Omar today)' },
    ],
  },
  engineering: {
    overview: 'N/A — sales follow-up call. No engineering decisions made. Note: SOC 2 Type II report expected December.',
    sections: [{ title: 'Note', content: 'Sales follow-up call. Not applicable to engineering format.' }],
  },
  interview: {
    overview: 'N/A — sales meeting.',
    sections: [{ title: 'Note', content: 'Sales follow-up call. Not applicable to interview format.' }],
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MEETING 6 — Team Retrospective (50 min, 7 participants)
// ═══════════════════════════════════════════════════════════════════════════
const M6_ID = 'meet-006';
const m6Transcript: TranscriptSegment[] = [
  seg('m6-s1',  M6_ID, 'p-rachel', 'Rachel Bloom',    'Welcome to the Sprint 23 retrospective. We\'re using the classic Start/Stop/Continue format. I\'ll facilitate. Let\'s agree on one rule: we talk about systems and processes, not about individuals. Everyone okay with that?', 10, 40),
  seg('m6-s2',  M6_ID, 'p-marcus', 'Marcus Webb',     'Agreed.', 42, 44),
  seg('m6-s3',  M6_ID, 'p-rachel', 'Rachel Bloom',    'Let\'s start with "What went well?" — things we should continue doing.', 46, 58),
  seg('m6-s4',  M6_ID, 'p-nina',   'Nina Johansson',  'The async PR review process we started this sprint worked really well. People were leaving comments before the review meetings, so the actual review sessions were shorter and more productive.', 60, 88),
  seg('m6-s5',  M6_ID, 'p-tom',    'Tom Lindqvist',   'Agreed. I\'d add: the daily blocker thread in Slack has been genuinely useful. It\'s the first thing I check in the morning. Things that used to wait until standup now get resolved the night before.', 90, 118),
  seg('m6-s6',  M6_ID, 'p-elena',  'Elena Vasquez',   'From my side — the collaboration with the product team on defining experiment metrics before the sprint started made my work much cleaner. I wasn\'t guessing what to measure. That\'s something we should do every sprint.', 120, 152),
  seg('m6-s7',  M6_ID, 'p-ben',    'Ben Tremblay',    'I want to call out the engineering estimates this sprint. We were 94% on-time for committed stories. That\'s the best we\'ve been in six months. Something about how we broke down the stories this time worked better.', 154, 188),
  seg('m6-s8',  M6_ID, 'p-rachel', 'Rachel Bloom',    'That\'s worth noting. David, anything from the infrastructure side?', 190, 200),
  seg('m6-s9',  M6_ID, 'p-david',  'David Nguyen',    'The staging environment has been stable — no outages this sprint. That\'s a first in three sprints. The investment in the observability tooling is paying off.', 202, 225),
  seg('m6-s10', M6_ID, 'p-rachel', 'Rachel Bloom',    'Excellent. Now "What should we stop doing?" — things that aren\'t working.', 227, 242),
  seg('m6-s11', M6_ID, 'p-nina',   'Nina Johansson',  'I\'ll go first since I brought it up before: the way we handle design-to-dev handoff. Specs are never complete when development starts. We end up making implementation decisions on the fly, which creates inconsistency.', 244, 278),
  seg('m6-s12', M6_ID, 'p-priya',  'Priya Kapoor',    'I hear you, Nina, and I take responsibility. I\'ve been handing off incomplete specs because of time pressure. The solution isn\'t just more time for design — it\'s getting earlier feedback from engineering on feasibility while I\'m still designing.', 280, 318),
  seg('m6-s13', M6_ID, 'p-marcus', 'Marcus Webb',     'What if we had a 30-minute "design feasibility check" at the midpoint of design, before handoff? Engineering reviews the spec early, flags any concerns. Reduces the last-minute scramble.', 320, 350),
  seg('m6-s14', M6_ID, 'p-priya',  'Priya Kapoor',    'I\'d love that. Would you actually show up to it?', 352, 360),
  seg('m6-s15', M6_ID, 'p-marcus', 'Marcus Webb',     'For major features, yes. We can make it a lightweight standing meeting — opt-in for the engineer who will implement.', 362, 378),
  seg('m6-s16', M6_ID, 'p-tom',    'Tom Lindqvist',   'I\'d opt in. The OAuth extraction would have gone much smoother if we\'d caught the API contract issue a week earlier.', 380, 396),
  seg('m6-s17', M6_ID, 'p-elena',  'Elena Vasquez',   'I want to raise something that might be uncomfortable: the data requests process. I get ad hoc requests from every direction — Slack, email, Notion comments — and there\'s no prioritization. I\'m constantly context-switching.', 398, 432),
  seg('m6-s18', M6_ID, 'p-ben',    'Ben Tremblay',    'That\'s a real problem. We should funnel all data requests through a single ticket system. Not to add bureaucracy, but so Elena can prioritize against sprint work.', 434, 460),
  seg('m6-s19', M6_ID, 'p-elena',  'Elena Vasquez',   'Yes please. Even a simple Notion form that creates a Linear ticket would work.', 462, 478),
  seg('m6-s20', M6_ID, 'p-rachel', 'Rachel Bloom',    'Let\'s commit to that. Ben, can you set that up?', 480, 490),
  seg('m6-s21', M6_ID, 'p-ben',    'Ben Tremblay',    'I\'ll have a Notion form linked to Linear by Monday.', 492, 504),
  seg('m6-s22', M6_ID, 'p-rachel', 'Rachel Bloom',    'Good. Now "What should we start doing?" — new practices to try.', 506, 520),
  seg('m6-s23', M6_ID, 'p-david',  'David Nguyen',    'Post-mortems for near-misses, not just outages. This sprint we had two situations that could have become incidents but didn\'t. We never discussed them. I\'d like us to document near-misses so we learn from them proactively.', 522, 558),
  seg('m6-s24', M6_ID, 'p-marcus', 'Marcus Webb',     'Strong yes. Blame-free near-miss post-mortems. Document, share, learn. I\'ll add a near-miss section to our incident template.', 560, 578),
  seg('m6-s25', M6_ID, 'p-nina',   'Nina Johansson',  'I\'d like us to start accessibility testing earlier. Right now it\'s the last thing we do before a release. We should be running automated a11y checks on every PR.', 580, 604),
  seg('m6-s26', M6_ID, 'p-david',  'David Nguyen',    'That\'s doable. I can add axe-core to the CI pipeline this week. Won\'t catch everything but it\'s a good first layer.', 606, 622),
  seg('m6-s27', M6_ID, 'p-tom',    'Tom Lindqvist',   'One more: I\'d like to start doing brief technical spikes on new integrations before we commit to implementation. We went into the OAuth integration without a spike and hit unexpected complexity.', 624, 654),
  seg('m6-s28', M6_ID, 'p-marcus', 'Marcus Webb',     'Agreed. Time-boxed spikes, maximum two days. Let\'s make that the standard for any new external integration.', 656, 672),
  seg('m6-s29', M6_ID, 'p-rachel', 'Rachel Bloom',    'Excellent retrospective everyone. Let me summarize the commitments: mid-sprint design feasibility check, single channel for data requests, near-miss post-mortems, a11y CI integration, and technical spikes for integrations. These are process changes, not just intentions. I\'ll follow up on each one in two weeks. Anything else before we close?', 674, 726),
  seg('m6-s30', M6_ID, 'p-priya',  'Priya Kapoor',    'Just a quick appreciation note — the team collaboration on the onboarding design review this week was genuinely excellent. Everyone came prepared and the feedback was constructive. Made a hard review feel good.', 728, 756),
  seg('m6-s31', M6_ID, 'p-rachel', 'Rachel Bloom',    'Noted, and agreed. Thanks everyone. See you at standup Monday.', 758, 770),
];

const m6Actions: ActionItem[] = [
  actionItem('m6-a1', M6_ID, 'Set up Notion form linked to Linear for data requests — single channel for all requests to Elena', 'Ben Tremblay', 'p-ben', '2026-10-13', false, 492),
  actionItem('m6-a2', M6_ID, 'Add near-miss section to incident post-mortem template', 'Marcus Webb', 'p-marcus', '2026-10-13', false, 560),
  actionItem('m6-a3', M6_ID, 'Add axe-core a11y checks to CI pipeline', 'David Nguyen', 'p-david', '2026-10-16', false, 606),
  actionItem('m6-a4', M6_ID, 'Schedule recurring 30-min design feasibility check for major features (mid-design, before handoff)', 'Rachel Bloom', 'p-rachel', '2026-10-13', false, 320),
  actionItem('m6-a5', M6_ID, 'Document standard: time-boxed technical spike (max 2 days) for any new external integration', 'Marcus Webb', 'p-marcus', '2026-10-14', false, 656),
];

const m6Highlights: Highlight[] = [
  highlight('m6-h1', M6_ID, 'm6-s7',  154, 'We were 94% on-time for committed stories. That\'s the best we\'ve been in six months.', 'Ben Tremblay', 'Celebrate this milestone'),
  highlight('m6-h2', M6_ID, 'm6-s13', 320, '"Design feasibility check" at midpoint of design — engineering reviews spec early, flags concerns. Reduces last-minute scramble.', 'Marcus Webb', 'New process to implement'),
  highlight('m6-h3', M6_ID, 'm6-s23', 522, 'Post-mortems for near-misses, not just outages. Document near-misses so we learn proactively.', 'David Nguyen'),
];

const m6Summaries = makeSummaries(M6_ID, {
  standard: {
    overview: 'Sprint 23 retrospective using Start/Stop/Continue format. Team is at 94% story delivery — best in six months. Key process changes committed: design feasibility check, single data request channel, near-miss post-mortems, a11y CI checks, and technical spikes for integrations.',
    sections: [
      { title: 'Continue (What Went Well)', content: '• Async PR review with pre-meeting comments → shorter, more productive review sessions\n• Daily blocker Slack thread → blockers resolved faster, often overnight\n• Pre-sprint metric definition with product team → cleaner experiment measurement\n• 94% on-time story delivery → best in six months\n• Stable staging environment → first sprint without infrastructure outage in three sprints' },
      { title: 'Stop (What Isn\'t Working)', content: '• Incomplete specs at design handoff → implementation decisions made on the fly\n• Ad hoc data requests to Elena from multiple channels → constant context-switching, no prioritization' },
      { title: 'Start (New Practices)', content: '• 30-min design feasibility check at design midpoint (before handoff) → engineering flags concerns early\n• Single channel for data requests (Notion form → Linear ticket) → Elena can prioritize properly\n• Blame-free near-miss post-mortems (not just incident post-mortems)\n• Automated a11y checks (axe-core) on every PR in CI\n• Time-boxed technical spikes (max 2 days) for any new external integration' },
      { title: 'Commitments and Owners', content: '• Ben: Notion form + Linear integration by Monday Oct 13\n• Marcus: Near-miss section in incident template by Oct 13\n• David: axe-core in CI pipeline by Oct 16\n• Rachel: Schedule recurring design feasibility check by Oct 13\n• Marcus: Document technical spike standard by Oct 14' },
    ],
  },
  executive: {
    overview: 'Sprint 23 retrospective. Team velocity is at its best in six months (94% delivery). Five concrete process improvements committed with owners and dates.',
    sections: [
      { title: 'Team Health Indicators', content: '• Story delivery: 94% (best in 6 months)\n• Infrastructure stability: 0 outages this sprint\n• Team morale: constructive retro tone, appreciation noted' },
      { title: 'Process Improvements', content: '5 concrete changes with owners: design feasibility check, data request channel, near-miss post-mortems, a11y CI checks, technical spikes. Rachel will follow up in 2 weeks.' },
    ],
  },
  sales: {
    overview: 'N/A — internal team retrospective.',
    sections: [{ title: 'Note', content: 'Internal engineering retrospective. Not applicable to sales format.' }],
  },
  engineering: {
    overview: 'Sprint 23 retro. 94% story delivery. Five process improvements: design feasibility check, data request centralization, near-miss post-mortems, a11y CI (axe-core), and technical spike standard for external integrations.',
    sections: [
      { title: 'Process Changes (Committed)', content: '1. Design feasibility check: 30 min, midpoint of design, Rachel schedules recurring meeting\n2. Data requests: Notion form → Linear ticket, Ben implements by Monday\n3. Near-miss post-mortems: Marcus adds section to incident template\n4. a11y CI: David adds axe-core to CI pipeline this week\n5. Technical spikes: time-boxed at 2 days for new external integrations — to be documented by Marcus' },
      { title: 'Metrics', content: 'Sprint 23 velocity: 94% on-time delivery. Sprint 22: ~75% (inferred from "best in 6 months"). Staging uptime: 100% this sprint.' },
    ],
  },
  interview: {
    overview: 'N/A — internal retrospective.',
    sections: [{ title: 'Note', content: 'Team retrospective. Not applicable to interview format.' }],
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// ASSEMBLED MEETINGS
// ═══════════════════════════════════════════════════════════════════════════
export const DEMO_MEETINGS: Meeting[] = [
  {
    id: M1_ID,
    title: 'Q4 Product Planning',
    date: '2026-10-11T09:00:00Z',
    durationMinutes: 60,
    status: 'completed',
    participants: [SARAH, MARCUS, PRIYA, JAMES, ELENA, TOM, NINA, ALEX, KATE, DAVID, BEN],
    platform: 'zoom',
    summaries: m1Summaries,
    actionItems: m1Actions,
    highlights: m1Highlights,
    transcript: m1Transcript,
    sharedClips: [],
    tags: ['planning', 'q4', 'product', 'strategy'],
    isDemo: true,
  },
  {
    id: M2_ID,
    title: 'Client Discovery — Enterprise SaaS',
    date: '2026-10-08T14:00:00Z',
    durationMinutes: 32,
    status: 'completed',
    participants: [SARAH, JAMES, DIANA, ROB],
    platform: 'zoom',
    summaries: m2Summaries,
    actionItems: m2Actions,
    highlights: m2Highlights,
    transcript: m2Transcript,
    sharedClips: [],
    tags: ['sales', 'discovery', 'enterprise', 'client'],
    isDemo: true,
  },
  {
    id: M3_ID,
    title: 'Engineering Daily Standup',
    date: '2026-10-09T09:30:00Z',
    durationMinutes: 15,
    status: 'completed',
    participants: [MARCUS, TOM, NINA, DAVID, ELENA, RACHEL],
    platform: 'meet',
    summaries: m3Summaries,
    actionItems: m3Actions,
    highlights: m3Highlights,
    transcript: m3Transcript,
    sharedClips: [],
    tags: ['standup', 'engineering', 'daily'],
    isDemo: true,
  },
  {
    id: M4_ID,
    title: 'Onboarding Redesign — Design Review',
    date: '2026-10-09T14:00:00Z',
    durationMinutes: 45,
    status: 'completed',
    participants: [PRIYA, SARAH, JAMES, NINA, MARCUS],
    platform: 'meet',
    summaries: m4Summaries,
    actionItems: m4Actions,
    highlights: m4Highlights,
    transcript: m4Transcript,
    sharedClips: [],
    tags: ['design', 'onboarding', 'review', 'ux'],
    isDemo: true,
  },
  {
    id: M5_ID,
    title: 'Sales Follow-up — Vertex Systems',
    date: '2026-10-07T11:00:00Z',
    durationMinutes: 28,
    status: 'completed',
    participants: [OMAR, CLAIRE, KATE],
    platform: 'meet',
    summaries: m5Summaries,
    actionItems: m5Actions,
    highlights: m5Highlights,
    transcript: m5Transcript,
    sharedClips: [],
    tags: ['sales', 'enterprise', 'security', 'deal'],
    isDemo: true,
  },
  {
    id: M6_ID,
    title: 'Sprint 23 Team Retrospective',
    date: '2026-10-10T15:00:00Z',
    durationMinutes: 50,
    status: 'completed',
    participants: [RACHEL, MARCUS, NINA, TOM, ELENA, DAVID, BEN, PRIYA],
    platform: 'teams',
    summaries: m6Summaries,
    actionItems: m6Actions,
    highlights: m6Highlights,
    transcript: m6Transcript,
    sharedClips: [],
    tags: ['retrospective', 'process', 'engineering', 'agile'],
    isDemo: true,
  },
];

export const DEFAULT_USER_PREFERENCES = {
  defaultTemplate: 'standard' as const,
  theme: 'light' as const,
  playbackSpeed: 1,
};
