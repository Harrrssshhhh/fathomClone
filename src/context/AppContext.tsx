import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Meeting, ActionItem, Highlight, SharedClip, SummaryTemplate, UserPreferences, SearchResult } from '../types';
import { DEMO_MEETINGS, DEFAULT_USER_PREFERENCES } from '../data/fixtures';

interface AppState {
  meetings: Meeting[];
  preferences: UserPreferences;
  activeTemplate: SummaryTemplate;
  searchQuery: string;
}

interface AppContextValue extends AppState {
  getMeeting: (id: string) => Meeting | undefined;
  toggleActionItem: (meetingId: string, actionItemId: string) => void;
  addHighlight: (meetingId: string, highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  createSharedClip: (meetingId: string, clip: Omit<SharedClip, 'id' | 'createdAt'>) => SharedClip;
  setActiveTemplate: (template: SummaryTemplate) => void;
  setSearchQuery: (q: string) => void;
  globalSearch: (query: string) => SearchResult[];
  allActionItems: ActionItem[];
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'meeting-intelligence-state';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveState(meetings: Meeting[], preferences: UserPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ meetings, preferences }));
  } catch {}
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const saved = loadState();
  
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    // Merge saved action item completion state with fresh demo data
    if (!saved.meetings || saved.meetings.length === 0) return DEMO_MEETINGS;
    // Use demo meetings but overlay saved completion states
    return DEMO_MEETINGS.map(dm => {
      const savedMeeting = (saved.meetings as Meeting[]).find(sm => sm.id === dm.id);
      if (!savedMeeting) return dm;
      return {
        ...dm,
        actionItems: dm.actionItems.map(ai => {
          const savedAI = savedMeeting.actionItems.find(sai => sai.id === ai.id);
          return savedAI ? { ...ai, completed: savedAI.completed } : ai;
        }),
        highlights: savedMeeting.highlights.length > dm.highlights.length
          ? savedMeeting.highlights
          : dm.highlights,
        sharedClips: savedMeeting.sharedClips || [],
      };
    });
  });

  const [preferences] = useState<UserPreferences>(
    (saved as AppState).preferences || DEFAULT_USER_PREFERENCES
  );
  const [activeTemplate, setActiveTemplate] = useState<SummaryTemplate>('standard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveState(meetings, preferences);
  }, [meetings, preferences]);

  const getMeeting = useCallback((id: string) => {
    return meetings.find(m => m.id === id);
  }, [meetings]);

  const toggleActionItem = useCallback((meetingId: string, actionItemId: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return {
        ...m,
        actionItems: m.actionItems.map(ai =>
          ai.id === actionItemId ? { ...ai, completed: !ai.completed } : ai
        ),
      };
    }));
  }, []);

  const addHighlight = useCallback((meetingId: string, highlight: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlight,
      id: `hl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return { ...m, highlights: [...m.highlights, newHighlight] };
    }));
  }, []);

  const createSharedClip = useCallback((meetingId: string, clip: Omit<SharedClip, 'id' | 'createdAt'>): SharedClip => {
    const newClip: SharedClip = {
      ...clip,
      id: `clip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return { ...m, sharedClips: [...m.sharedClips, newClip] };
    }));
    return newClip;
  }, []);

  const globalSearch = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const meeting of meetings) {
      // Title match
      if (meeting.title.toLowerCase().includes(q)) {
        results.push({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          meetingDate: meeting.date,
          type: 'title',
          excerpt: meeting.title,
        });
      }

      // Participant match
      for (const p of meeting.participants) {
        if (p.name.toLowerCase().includes(q)) {
          results.push({
            meetingId: meeting.id,
            meetingTitle: meeting.title,
            meetingDate: meeting.date,
            type: 'participant',
            excerpt: `Participant: ${p.name} (${p.role || p.email})`,
            speakerName: p.name,
          });
          break;
        }
      }

      // Transcript match
      for (const seg of meeting.transcript) {
        if (seg.text.toLowerCase().includes(q)) {
          const idx = seg.text.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 40);
          const excerpt = (start > 0 ? '...' : '') + seg.text.slice(start, idx + q.length + 60) + (idx + q.length + 60 < seg.text.length ? '...' : '');
          results.push({
            meetingId: meeting.id,
            meetingTitle: meeting.title,
            meetingDate: meeting.date,
            type: 'transcript',
            excerpt,
            speakerName: seg.speakerName,
            timestamp: seg.startTime,
            segmentId: seg.id,
          });
          if (results.filter(r => r.meetingId === meeting.id && r.type === 'transcript').length >= 3) break;
        }
      }

      // Action item match
      for (const ai of meeting.actionItems) {
        if (ai.description.toLowerCase().includes(q) || ai.owner.toLowerCase().includes(q)) {
          results.push({
            meetingId: meeting.id,
            meetingTitle: meeting.title,
            meetingDate: meeting.date,
            type: 'action-item',
            excerpt: `Action: ${ai.description} — ${ai.owner}`,
          });
        }
      }
    }

    return results.slice(0, 20);
  }, [meetings]);

  const allActionItems = meetings.flatMap(m =>
    m.actionItems.map(ai => ({ ...ai, meetingTitle: m.title } as ActionItem & { meetingTitle: string }))
  );

  return (
    <AppContext.Provider value={{
      meetings,
      preferences,
      activeTemplate,
      searchQuery,
      getMeeting,
      toggleActionItem,
      addHighlight,
      createSharedClip,
      setActiveTemplate,
      setSearchQuery,
      globalSearch,
      allActionItems,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
