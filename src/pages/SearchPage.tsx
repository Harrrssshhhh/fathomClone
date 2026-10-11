import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, FileText, Users, AlignLeft, ListChecks, Clock } from 'lucide-react';
import type { SearchResult } from '../types';
import { formatDate, formatTime } from '../utils/formatters';

const TYPE_ICONS = {
  title: FileText,
  participant: Users,
  transcript: AlignLeft,
  summary: ListChecks,
  'action-item': ListChecks,
};

const TYPE_LABELS = {
  title: 'Meeting',
  participant: 'Participant',
  transcript: 'Transcript',
  summary: 'Summary',
  'action-item': 'Action item',
};

const TYPE_COLORS = {
  title: 'badge-blue',
  participant: 'badge-purple',
  transcript: 'badge-gray',
  summary: 'badge-green',
  'action-item': 'badge-yellow',
};

const TYPE_ACCENT = {
  title: 'bg-blue-500',
  participant: 'bg-purple-500',
  transcript: 'bg-gray-400',
  summary: 'bg-emerald-500',
  'action-item': 'bg-amber-500',
};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { globalSearch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); return; }
    const r = globalSearch(q);
    setResults(r);
    setSearchParams(q ? { q } : {}, { replace: true });
  }, [query, globalSearch]);

  const handleResultClick = (r: SearchResult) => {
    const params = new URLSearchParams();
    if (r.type === 'transcript' && r.segmentId) params.set('segment', r.segmentId);
    if (r.type === 'actions' as string) params.set('tab', 'actions');
    navigate(`/meetings/${r.meetingId}?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Search size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Search</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Find anything across your meetings</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search meetings, participants, transcript, action items…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs">
              Clear
            </button>
          )}
        </div>

        {query.length >= 2 && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <Search size={22} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No results for "{query}"</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try searching for a name, topic, or keyword from a meeting.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-400 mb-3">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            {results.map((r, i) => {
              const Icon = TYPE_ICONS[r.type];
              return (
                <div
                  key={i}
                  onClick={() => handleResultClick(r)}
                  className="card dark:bg-gray-900 dark:border-gray-800 px-4 py-3 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all group relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${TYPE_ACCENT[r.type]} opacity-80`} />
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={13} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge ${TYPE_COLORS[r.type]}`}>{TYPE_LABELS[r.type]}</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{r.meetingTitle}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(r.meetingDate)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{r.excerpt}</p>
                      {r.speakerName && r.timestamp !== undefined && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{r.speakerName}</span>
                          <span className="text-gray-200 dark:text-gray-700">·</span>
                          <span className="text-xs text-brand-500 font-mono flex items-center gap-0.5">
                            <Clock size={10} />{formatTime(r.timestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!query && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Search size={26} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm">Search across all meetings, transcripts, participants, and action items.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['calendar connection', 'retention', 'Vertex Systems', 'OAuth', 'Sarah Chen'].map(s => (
                <button key={s} onClick={() => setQuery(s)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
