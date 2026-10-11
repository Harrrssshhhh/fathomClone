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
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Search</h1>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search meetings, participants, transcript, action items…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
              Clear
            </button>
          )}
        </div>

        {query.length >= 2 && results.length === 0 && (
          <div className="text-center py-12">
            <Search size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No results for "{query}"</p>
            <p className="text-sm text-gray-400 mt-1">Try searching for a name, topic, or keyword from a meeting.</p>
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
                  className="card px-4 py-3 cursor-pointer hover:shadow-sm hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={13} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge ${TYPE_COLORS[r.type]}`}>{TYPE_LABELS[r.type]}</span>
                        <span className="text-xs font-semibold text-gray-700 truncate">{r.meetingTitle}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(r.meetingDate)}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug">{r.excerpt}</p>
                      {r.speakerName && r.timestamp !== undefined && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{r.speakerName}</span>
                          <span className="text-gray-200">·</span>
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
          <div className="text-center py-12 text-gray-400">
            <Search size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Search across all meetings, transcripts, participants, and action items.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['calendar connection', 'retention', 'Vertex Systems', 'OAuth', 'Sarah Chen'].map(s => (
                <button key={s} onClick={() => setQuery(s)} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors">
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
