import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, ChevronRight, ListChecks, AlertCircle } from 'lucide-react';
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
  const overdue = allItems.filter(a => !a.completed && a.dueDate && new Date(a.dueDate) < new Date()).length;
  const progress = allItems.length > 0 ? Math.round((done / allItems.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
              <ListChecks size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Action Items</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{open} open · {done} completed{overdue > 0 && <span className="text-red-500"> · {overdue} overdue</span>}</p>
            </div>
          </div>
        </div>

        {allItems.length > 0 && (
          <div className="card dark:bg-gray-900 dark:border-gray-800 p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          {(['all', 'open', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                filter === f ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {f} {f === 'open' ? `(${open})` : f === 'completed' ? `(${done})` : `(${allItems.length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <Check size={22} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {filter === 'open' ? 'All caught up! No open action items.' : filter === 'completed' ? 'No completed items yet.' : 'No action items yet.'}
            </p>
          </div>
        ) : (
          <div className="card dark:bg-gray-900 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
            {filtered.map(ai => {
              const isOverdue = !ai.completed && ai.dueDate && new Date(ai.dueDate) < new Date();
              return (
                <div
                  key={ai.id}
                  className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${ai.completed ? 'opacity-60' : ''}`}
                >
                  <button
                    onClick={() => toggleActionItem(ai.meetingId, ai.id)}
                    className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      ai.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
                    }`}
                  >
                    {ai.completed && <Check size={11} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-800 dark:text-gray-200 leading-snug ${ai.completed ? 'line-through text-gray-400' : ''}`}>
                      {ai.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{ai.owner}</span>
                      <span className="text-gray-200 dark:text-gray-700">·</span>
                      <button
                        onClick={() => navigate(`/meetings/${ai.meetingId}`)}
                        className="text-xs text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                      >
                        {ai.meetingTitle}
                      </button>
                      {ai.dueDate && (
                        <>
                          <span className="text-gray-200 dark:text-gray-700">·</span>
                          <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                            {isOverdue && <AlertCircle size={11} />}
                            Due {new Date(ai.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </>
                      )}
                      {ai.timestampSeconds !== undefined && (
                        <>
                          <span className="text-gray-200 dark:text-gray-700">·</span>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
