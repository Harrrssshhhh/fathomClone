import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Share2, ExternalLink, Clock } from 'lucide-react';
import { formatDate, formatTime } from '../utils/formatters';

export function SharedClipsPage() {
  const { meetings } = useApp();
  const navigate = useNavigate();

  const allClips = meetings.flatMap(m =>
    m.sharedClips.map(c => ({ ...c, meeting: m }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Shared Clips</h1>
        <p className="text-sm text-gray-500 mb-6">{allClips.length} clip{allClips.length !== 1 ? 's' : ''} created</p>

        {allClips.length === 0 ? (
          <div className="text-center py-16">
            <Share2 size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No shared clips yet</p>
            <p className="text-sm text-gray-400 mt-1">Open a meeting and use the Share button to create a clip.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allClips.map(clip => (
              <div key={clip.id} className="card px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-700">{clip.speakerName}</span>
                      <span className="text-xs text-brand-500 font-mono flex items-center gap-0.5">
                        <Clock size={10} />{formatTime(clip.startTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-snug mb-2">"{clip.transcriptExcerpt}"</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <button onClick={() => navigate(`/meetings/${clip.meetingId}`)} className="text-brand-500 hover:text-brand-700">
                        {clip.meetingTitle}
                      </button>
                      <span>·</span>
                      <span>{formatDate(clip.createdAt)}</span>
                    </div>
                  </div>
                  <a
                    href={`/shared/${clip.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost flex-shrink-0"
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
