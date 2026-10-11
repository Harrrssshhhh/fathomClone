import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MeetingCard } from '../components/meetings/MeetingCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Video, TrendingUp, CheckSquare, Zap, ArrowRight, Plus, Mic, Sparkles } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomePage() {
  const { meetings } = useApp();
  const navigate = useNavigate();

  const sorted = [...meetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = sorted.slice(0, 3);
  const totalMeetings = meetings.length;
  const totalMinutes = meetings.reduce((s, m) => s + m.durationMinutes, 0);
  const openTasks = meetings.flatMap(m => m.actionItems).filter(a => !a.completed).length;
  const totalHighlights = meetings.flatMap(m => m.highlights).length;

  const stats = [
    { label: 'Total meetings', value: totalMeetings, icon: Video, gradient: 'from-brand-500 to-indigo-600' },
    { label: 'Meeting time', value: formatDuration(totalMinutes), icon: TrendingUp, gradient: 'from-emerald-500 to-green-600' },
    { label: 'Open tasks', value: openTasks, icon: CheckSquare, gradient: 'from-amber-500 to-orange-600' },
    { label: 'Highlights saved', value: totalHighlights, icon: Zap, gradient: 'from-purple-500 to-fuchsia-600' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your meetings.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="card dark:bg-gray-900 dark:border-gray-800 px-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => navigate('/settings')}
            className="card dark:bg-gray-900 dark:border-gray-800 p-4 flex items-center gap-3 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
              <Mic size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Record a meeting</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Start simulated recording</div>
            </div>
            <ArrowRight size={14} className="text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/meetings')}
            className="card dark:bg-gray-900 dark:border-gray-800 p-4 flex items-center gap-3 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
              <Video size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Browse meetings</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{totalMeetings} recorded</div>
            </div>
            <ArrowRight size={14} className="text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/search')}
            className="card dark:bg-gray-900 dark:border-gray-800 p-4 flex items-center gap-3 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
              <Sparkles size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">AI search</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Find anything discussed</div>
            </div>
            <ArrowRight size={14} className="text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Recent Meetings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent meetings</h2>
          <button
            onClick={() => navigate('/meetings')}
            className="btn-ghost text-brand-600 hover:text-brand-700 dark:text-brand-400 text-xs"
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={<Video size={22} />}
            title="No meetings yet"
            description="Your recorded meetings will appear here."
            action={<button className="btn-primary"><Plus size={14} /> Connect calendar</button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map(m => (
              <MeetingCard key={m.id} meeting={m} onClick={() => navigate(`/meetings/${m.id}`)} />
            ))}
          </div>
        )}

        {/* Open Action Items preview */}
        {openTasks > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Open action items</h2>
              <button onClick={() => navigate('/action-items')} className="btn-ghost text-brand-600 dark:text-brand-400 text-xs">
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="card dark:bg-gray-900 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
              {meetings.flatMap(m => m.actionItems.filter(a => !a.completed).map(a => ({ ...a, meetingTitle: m.title, meetingId: m.id })))
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => navigate(`/meetings/${task.meetingId}?tab=actions`)}>
                    <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{task.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{task.owner}</span>
                        <span className="text-gray-200 dark:text-gray-600">·</span>
                        <span className="text-xs text-gray-400 truncate">{task.meetingTitle}</span>
                      </div>
                    </div>
                    {task.dueDate && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(task.dueDate) < new Date() ? (
                          <span className="text-red-500 font-medium">Overdue</span>
                        ) : (
                          new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        )}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
