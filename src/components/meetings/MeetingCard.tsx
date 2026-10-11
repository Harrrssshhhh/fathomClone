import type { Meeting } from '../../types';
import { formatDate, formatDuration, truncate } from '../../utils/formatters';
import { Avatar } from '../ui/Avatar';
import { Clock, Users } from 'lucide-react';

const PLATFORM_LABELS: Record<string, string> = { zoom: 'Zoom', meet: 'Google Meet', teams: 'Teams', other: 'Other' };

const PLATFORM_ACCENT: Record<string, string> = {
  zoom: 'bg-blue-500',
  meet: 'bg-emerald-500',
  teams: 'bg-indigo-500',
  other: 'bg-gray-500',
};

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const incomplete = meeting.actionItems.filter(a => !a.completed).length;
  const shownParticipants = meeting.participants.slice(0, 4);
  const extra = meeting.participants.length - 4;
  const overview = meeting.summaries.standard?.overview ?? '';

  return (
    <div
      onClick={onClick}
      className="card dark:bg-gray-900 dark:border-gray-800 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 group relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${PLATFORM_ACCENT[meeting.platform] || 'bg-gray-500'} opacity-80`} />

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors flex-1">
          {meeting.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {meeting.isDemo && (
            <span className="badge bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs">Demo</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>{formatDate(meeting.date)}</span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {formatDuration(meeting.durationMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} />
          {meeting.participants.length}
        </span>
        <span className="badge badge-gray text-[10px] py-0">{PLATFORM_LABELS[meeting.platform]}</span>
      </div>

      {overview && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {truncate(overview, 120)}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-1.5">
          {shownParticipants.map(p => (
            <Avatar key={p.id} name={p.name} color={p.avatarColor} size="sm" />
          ))}
          {extra > 0 && (
            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs text-gray-500 font-medium">
              +{extra}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {incomplete > 0 && (
          <span className="badge badge-yellow">{incomplete} open task{incomplete !== 1 ? 's' : ''}</span>
        )}
        {meeting.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="badge badge-gray">#{tag}</span>
        ))}
      </div>
    </div>
  );
}
