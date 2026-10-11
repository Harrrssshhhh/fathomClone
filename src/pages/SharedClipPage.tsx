import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Brain, Clock, Users, ArrowLeft } from 'lucide-react';
import { formatDate, formatTime, formatDuration } from '../utils/formatters';
import { Avatar } from '../components/ui/Avatar';

export function SharedClipPage() {
  const { clipId } = useParams<{ clipId: string }>();
  const { meetings } = useApp();
  const navigate = useNavigate();

  const clip = meetings.flatMap(m => m.sharedClips).find(c => c.id === clipId);
  const meeting = clip ? meetings.find(m => m.id === clip.meetingId) : null;

  if (!clip || !meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Brain size={24} className="text-brand-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Clip not found</h1>
          <p className="text-gray-500 text-sm mb-5">This clip may have expired or doesn't exist on this device (demo mode: clips are device-local).</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <ArrowLeft size={14} /> Back to app
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">Meeting Intelligence</span>
        </div>
        <span className="badge badge-gray">Shared clip · Demo mode</span>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Meeting info */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{meeting.title}</h1>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>{formatDate(meeting.date)}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(meeting.durationMinutes)}</span>
              <span className="flex items-center gap-1"><Users size={11} />{meeting.participants.length} participants</span>
            </div>
          </div>

          {/* Clip card */}
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              {meeting.participants.find(p => p.name === clip.speakerName) && (
                <Avatar
                  name={clip.speakerName}
                  color={meeting.participants.find(p => p.name === clip.speakerName)!.avatarColor}
                  size="md"
                />
              )}
              <div>
                <div className="font-semibold text-gray-900 text-sm">{clip.speakerName}</div>
                <div className="text-xs text-brand-500 font-mono">{formatTime(clip.startTime)} — {formatTime(clip.endTime)}</div>
              </div>
            </div>
            <blockquote className="text-gray-800 text-base leading-relaxed border-l-4 border-brand-200 pl-4">
              "{clip.transcriptExcerpt}"
            </blockquote>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 text-center">
            Demo mode: This clip link is only accessible on the device that created it.
            In production, this would be a universally accessible public link.
          </div>

          <div className="text-center mt-6">
            <button onClick={() => navigate(`/meetings/${meeting.id}`)} className="btn-primary">
              View full meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
