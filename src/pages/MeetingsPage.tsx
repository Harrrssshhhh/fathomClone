import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MeetingCard } from '../components/meetings/MeetingCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Video, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

type SortField = 'date' | 'duration' | 'participants';
type FilterPlatform = 'all' | 'zoom' | 'meet' | 'teams';

const PLATFORM_DOT: Record<string, string> = {
  all: 'bg-gray-400',
  zoom: 'bg-blue-500',
  meet: 'bg-emerald-500',
  teams: 'bg-indigo-500',
};

const PLATFORM_LABEL: Record<string, string> = {
  all: 'All',
  zoom: 'Zoom',
  meet: 'Google Meet',
  teams: 'Teams',
};

export function MeetingsPage() {
  const { meetings } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [platform, setPlatform] = useState<FilterPlatform>('all');

  const filtered = meetings
    .filter(m => {
      const q = query.toLowerCase();
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.participants.some(p => p.name.toLowerCase().includes(q)) ||
        m.tags?.some(t => t.includes(q)) ||
        m.transcript.some(s => s.text.toLowerCase().includes(q))
      );
    })
    .filter(m => platform === 'all' || m.platform === platform)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'duration') return b.durationMinutes - a.durationMinutes;
      if (sortBy === 'participants') return b.participants.length - a.participants.length;
      return 0;
    });

  const platformCounts = meetings.reduce<Record<string, number>>((acc, m) => {
    acc[m.platform] = (acc[m.platform] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Video size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meetings</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{meetings.length} recorded meetings</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings, participants, transcript…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-gray-400 mr-1" />
            {(['all', 'zoom', 'meet', 'teams'] as FilterPlatform[]).map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  platform === p
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${PLATFORM_DOT[p]}`} />
                {PLATFORM_LABEL[p]}
                {platformCounts[p] !== undefined && (
                  <span className={`ml-0.5 ${platform === p ? 'opacity-70' : 'opacity-50'}`}>{platformCounts[p]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <ArrowUpDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortField)}
              className="input w-auto text-xs py-1.5 pl-8 pr-8 appearance-none cursor-pointer"
            >
              <option value="date">Sort: Date</option>
              <option value="duration">Sort: Duration</option>
              <option value="participants">Sort: Participants</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          query ? (
            <EmptyState
              icon={<Search size={22} />}
              title="No results found"
              description={`No meetings match "${query}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon={<Video size={22} />}
              title="No meetings yet"
              description="Connect your calendar to start recording meetings."
            />
          )
        ) : (
          <>
            {query && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(m => (
                <MeetingCard key={m.id} meeting={m} onClick={() => navigate(`/meetings/${m.id}`)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
