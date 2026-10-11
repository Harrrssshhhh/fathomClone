export interface Participant {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  role?: string;
}

export interface TranscriptSegment {
  id: string;
  meetingId: string;
  speakerId: string;
  speakerName: string;
  text: string;
  startTime: number; // seconds from meeting start
  endTime: number;
  isHighlighted?: boolean;
}

export type SummaryTemplate =
  | 'standard'
  | 'executive'
  | 'sales'
  | 'engineering'
  | 'interview';

export interface SummarySection {
  title: string;
  content: string;
}

export interface Summary {
  meetingId: string;
  template: SummaryTemplate;
  overview: string;
  sections: SummarySection[];
  generatedAt: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  owner: string;
  ownerParticipantId?: string;
  dueDate?: string;
  completed: boolean;
  transcriptSegmentId?: string;
  timestampSeconds?: number;
  createdAt: string;
}

export interface Highlight {
  id: string;
  meetingId: string;
  transcriptSegmentId: string;
  timestamp: number;
  excerpt: string;
  speakerName: string;
  note?: string;
  createdAt: string;
}

export interface SharedClip {
  id: string;
  meetingId: string;
  meetingTitle: string;
  startTime: number;
  endTime: number;
  transcriptExcerpt: string;
  speakerName: string;
  createdAt: string;
  expiresAt?: string;
}

export type MeetingStatus = 'completed' | 'processing' | 'live' | 'scheduled';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  status: MeetingStatus;
  participants: Participant[];
  platform: 'zoom' | 'meet' | 'teams' | 'other';
  summaries: Record<SummaryTemplate, Summary>;
  actionItems: ActionItem[];
  highlights: Highlight[];
  transcript: TranscriptSegment[];
  sharedClips: SharedClip[];
  tags?: string[];
  isDemo: boolean;
}

export interface UserPreferences {
  defaultTemplate: SummaryTemplate;
  theme: 'light' | 'dark';
  playbackSpeed: number;
}

export interface SearchResult {
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  type: 'title' | 'participant' | 'transcript' | 'summary' | 'action-item';
  excerpt: string;
  speakerName?: string;
  timestamp?: number;
  segmentId?: string;
}
