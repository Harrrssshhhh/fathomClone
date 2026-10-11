import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MeetingCard } from '../components/meetings/MeetingCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Video, TrendingUp, CheckSquare, Zap, ArrowRight } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export function HomePage() {
  const { meetings } = useApp();
  const navigate = useNavigate();

  const sorted = [...meetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = sorted.slice(0, 3);
  const totalMeetings = meetings.length;
  const totalMinutes = meetings.reduce((s, m) => s + m.durationMinutes, 0);
  const openTasks = meetings.flatMap(m => m.actionItems).filter(a => !a.completed).length;
  const totalHighlights = meetings.flatMap(m => m.highlights).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Good morning 👋</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your meetings.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total meetings', value: totalMeetings, icon: Video, color: 'text-brand-600 bg-brand-50' },
            { label: 'Meeting time', value: formatDuration(totalMinutes), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
            { label: 'Open tasks', value: openTasks, icon: CheckSquare, color: 'text-yellow-600 bg-yellow-50' },
            { label: 'Highlights saved', value: totalHighlights, icon: Zap, color: 'text-purple-600 bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className="card px-5 py-4">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={18} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Meetings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent meetings</h2>
          <button
            onClick={() => navigate('/meetings')}
            className="btn-ghost text-brand-600 hover:text-brand-700 text-xs"
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={<Video size={22} />}
            title="No meetings yet"
            description="Your recorded meetings will appear here."
            action={<button className="btn-primary">Connect calendar</button>}
          />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {recent.map(m => (
              <MeetingCard key={m.id} meeting={m} onClick={() => navigate(`/meetings/${m.id}`)} />
            ))}
          </div>
        )}

        {/* Open Action Items preview */}
        {openTasks > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Open action items</h2>
              <button onClick={() => navigate('/action-items')} className="btn-ghost text-brand-600 text-xs">
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="card divide-y divide-gray-100">
              {meetings.flatMap(m => m.actionItems.filter(a => !a.completed).map(a => ({ ...a, meetingTitle: m.title, meetingId: m.id })))
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/meetings/${task.meetingId}?tab=actions`)}>
                    <div className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">{task.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{task.owner}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{task.meetingTitle}</span>
                      </div>
                    </div>
                    {task.dueDate && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(task.dueDate) < new Date() ? (
                          <span className="text-red-500">Overdue</span>
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
