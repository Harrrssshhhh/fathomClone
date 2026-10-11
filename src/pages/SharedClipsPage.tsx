import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Share2, ExternalLink, Clock, Quote } from 'lucide-react';
import { formatDate, formatTime } from '../utils/formatters';
import { buildClipUrl, clipToEncodedData } from '../utils/clipSharing';

export function SharedClipsPage() {
  const { meetings } = useApp();
  const navigate = useNavigate();

  const allClips = meetings.flatMap(m =>
    m.sharedClips.map(c => ({ ...c, meeting: m }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getClipUrl = (clip: typeof allClips[number]) => {
    const speaker = clip.meeting.participants.find(p => p.name === clip.speakerName);
    const data = clipToEncodedData(clip, clip.meeting, speaker?.avatarColor);
    return buildClipUrl(clip.id, data);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm">
              <Share2 size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Shared Clips</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{allClips.length} clip{allClips.length !== 1 ? 's' : ''} created</p>
            </div>
          </div>
        </div>

        {allClips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Share2 size={26} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No shared clips yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Open a meeting and use the Share button to create a clip.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allClips.map(clip => (
              <div
                key={clip.id}
                className="card dark:bg-gray-900 dark:border-gray-800 px-4 py-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 opacity-80" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center flex-shrink-0">
                        <Quote size={13} className="text-pink-600 dark:text-pink-400" />
                      </span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{clip.speakerName}</span>
                      <span className="text-xs text-brand-500 font-mono flex items-center gap-0.5">
                        <Clock size={10} />{formatTime(clip.startTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug mb-2 italic">"{clip.transcriptExcerpt}"</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <button onClick={() => navigate(`/meetings/${clip.meetingId}`)} className="text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                        {clip.meetingTitle}
                      </button>
                      <span>·</span>
                      <span>{formatDate(clip.createdAt)}</span>
                    </div>
                  </div>
                  <a
                    href={getClipUrl(clip)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink size={13} /> Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
