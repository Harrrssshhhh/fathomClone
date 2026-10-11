import type { Meeting } from '../../types';
import { formatDate, formatDuration } from '../../utils/formatters';
import { Avatar } from '../ui/Avatar';
import { Clock, Users } from 'lucide-react';

const PLATFORM_LABELS: Record<string, string> = { zoom: 'Zoom', meet: 'Google Meet', teams: 'Teams', other: 'Other' };

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const incomplete = meeting.actionItems.filter(a => !a.completed).length;
  const shownParticipants = meeting.participants.slice(0, 4);
  const extra = meeting.participants.length - 4;

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer hover:shadow-sm hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-brand-700 transition-colors flex-1">
          {meeting.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {meeting.isDemo && (
            <span className="badge bg-purple-50 text-purple-600 text-xs">Demo</span>
          )}
          <span className="badge badge-gray text-xs">{PLATFORM_LABELS[meeting.platform]}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span>{formatDate(meeting.date)}</span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {formatDuration(meeting.durationMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} />
          {meeting.participants.length}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-1.5">
          {shownParticipants.map(p => (
            <Avatar key={p.id} name={p.name} color={p.avatarColor} size="sm" />
          ))}
          {extra > 0 && (
            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">
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
