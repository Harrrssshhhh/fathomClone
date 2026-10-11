import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Brain, Clock, Users, ArrowLeft } from 'lucide-react';
import { formatDate, formatTime, formatDuration } from '../utils/formatters';
import { Avatar } from '../components/ui/Avatar';
import { decodeClipData } from '../utils/clipSharing';

export function SharedClipPage() {
  const { clipId } = useParams<{ clipId: string }>();
  const [searchParams] = useSearchParams();
  const { meetings } = useApp();
  const navigate = useNavigate();

  const clip = meetings.flatMap(m => m.sharedClips).find(c => c.id === clipId);
  const meeting = clip ? meetings.find(m => m.id === clip.meetingId) : null;

  const encoded = searchParams.get('d');
  const decoded = encoded ? decodeClipData(encoded) : null;

  const effectiveClip = clip ?? (decoded ? {
    id: clipId!,
    meetingId: 'remote',
    meetingTitle: decoded.m,
    startTime: decoded.st,
    endTime: decoded.et,
    transcriptExcerpt: decoded.t,
    speakerName: decoded.s,
    createdAt: new Date().toISOString(),
  } : null);

  const effectiveMeeting = meeting ?? (decoded ? {
    id: 'remote',
    title: decoded.m,
    date: decoded.d,
    durationMinutes: decoded.dur,
    participants: [{ id: 'remote-speaker', name: decoded.s, email: '', avatarColor: decoded.c, initials: decoded.s.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() }],
  } : null);

  if (!effectiveClip || !effectiveMeeting) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clip not found</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This clip may have expired or the link is invalid.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <ArrowLeft size={14} /> Back to app
          </button>
        </div>
      </div>
    );
  }


  const isRemote = !clip;
  const speaker = effectiveMeeting.participants.find(p => p.name === effectiveClip.speakerName);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Nav bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Brain size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Meeting Intelligence</span>
        </div>
        <span className="badge badge-green">Shared clip</span>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Meeting info */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{effectiveMeeting.title}</h1>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(effectiveMeeting.date)}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(effectiveMeeting.durationMinutes)}</span>
              <span className="flex items-center gap-1"><Users size={11} />{effectiveMeeting.participants.length} participants</span>
            </div>
          </div>

          {/* Clip card */}
          <div className="card dark:bg-gray-900 dark:border-gray-800 p-6 mb-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 opacity-80" />
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                name={effectiveClip.speakerName}
                color={speaker?.avatarColor || '#6b7280'}
                size="md"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{effectiveClip.speakerName}</div>
                <div className="text-xs text-brand-500 font-mono">{formatTime(effectiveClip.startTime)} — {formatTime(effectiveClip.endTime)}</div>
              </div>
            </div>
            <blockquote className="text-gray-800 dark:text-gray-200 text-base leading-relaxed border-l-4 border-brand-200 dark:border-brand-800 pl-4">
              "{effectiveClip.transcriptExcerpt}"
            </blockquote>
          </div>

          {isRemote ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-xs text-green-800 dark:text-green-300 text-center">
              This shared clip is viewable by anyone with the link.
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300 text-center">
              Demo mode: clip data is embedded in the link so anyone can view it.
            </div>
          )}

          <div className="text-center mt-6">
            {!isRemote && (
              <button onClick={() => navigate(`/meetings/${effectiveMeeting.id}`)} className="btn-primary">
                View full meeting
              </button>
            )}
            {isRemote && (
              <button onClick={() => navigate('/')} className="btn-secondary">
                <ArrowLeft size={14} /> Open Meeting Intelligence
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
