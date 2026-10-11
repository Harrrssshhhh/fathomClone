import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, ChevronRight, Filter } from 'lucide-react';
import { formatTime } from '../utils/formatters';
import type { ActionItem } from '../types';

type Filter = 'all' | 'open' | 'completed';

export function ActionItemsPage() {
  const { meetings, toggleActionItem } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('open');

  const allItems: (ActionItem & { meetingTitle: string })[] = meetings.flatMap(m =>
    m.actionItems.map(ai => ({ ...ai, meetingTitle: m.title }))
  ).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return 0;
  });

  const filtered = allItems.filter(ai => {
    if (filter === 'open') return !ai.completed;
    if (filter === 'completed') return ai.completed;
    return true;
  });

  const open = allItems.filter(a => !a.completed).length;
  const done = allItems.filter(a => a.completed).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Action Items</h1>
            <p className="text-sm text-gray-500 mt-0.5">{open} open · {done} completed</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
          {(['all', 'open', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f} {f === 'open' ? `(${open})` : f === 'completed' ? `(${done})` : `(${allItems.length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Check size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {filter === 'open' ? 'All caught up! No open action items.' : 'No completed items yet.'}
            </p>
          </div>
        ) : (
          <div className="card divide-y divide-gray-100 overflow-hidden">
            {filtered.map(ai => (
              <div
                key={ai.id}
                className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group ${ai.completed ? 'opacity-60' : ''}`}
              >
                <button
                  onClick={() => toggleActionItem(ai.meetingId, ai.id)}
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    ai.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-brand-500'
                  }`}
                >
                  {ai.completed && <Check size={11} />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-gray-800 leading-snug ${ai.completed ? 'line-through text-gray-400' : ''}`}>
                    {ai.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-medium text-gray-600">{ai.owner}</span>
                    <span className="text-gray-200">·</span>
                    <button
                      onClick={() => navigate(`/meetings/${ai.meetingId}`)}
                      className="text-xs text-brand-500 hover:text-brand-700 transition-colors"
                    >
                      {ai.meetingTitle}
                    </button>
                    {ai.dueDate && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className={`text-xs ${!ai.completed && new Date(ai.dueDate) < new Date() ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                          Due {new Date(ai.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </>
                    )}
                    {ai.timestampSeconds !== undefined && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400 font-mono">{formatTime(ai.timestampSeconds)}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/meetings/${ai.meetingId}?tab=actions`)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
