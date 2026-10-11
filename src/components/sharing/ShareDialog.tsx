import { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import type { Meeting, SharedClip } from '../../types';
import { formatTime } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface ShareDialogProps {
  meeting: Meeting;
  onClose: () => void;
  initialSegmentId?: string;
  initialStartTime?: number;
}

export function ShareDialog({ meeting, onClose, initialSegmentId, initialStartTime }: ShareDialogProps) {
  const { createSharedClip } = useApp();
  const [copied, setCopied] = useState(false);
  const [clip, setClip] = useState<SharedClip | null>(null);

  const segment = initialSegmentId
    ? meeting.transcript.find(s => s.id === initialSegmentId)
    : meeting.transcript[0];

  const startTime = initialStartTime ?? segment?.startTime ?? 0;
  const endTime = segment?.endTime ?? Math.min(startTime + 60, meeting.durationMinutes * 60);

  const handleCreateClip = () => {
    if (!segment) return;
    const newClip = createSharedClip(meeting.id, {
      meetingId: meeting.id,
      meetingTitle: meeting.title,
      startTime,
      endTime,
      transcriptExcerpt: segment.text,
      speakerName: segment.speakerName,
    });
    setClip(newClip);
  };

  const clipUrl = clip
    ? `${window.location.origin}/shared/${clip.id}`
    : null;

  const handleCopy = async () => {
    if (!clipUrl) return;
    try {
      await navigator.clipboard.writeText(clipUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = clipUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Share {clip ? 'clip' : 'meeting'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {!clip ? (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Create a shareable clip from this moment in <strong>{meeting.title}</strong>:
                </p>
                {segment && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-500">{segment.speakerName}</span>
                      <span className="text-xs text-gray-400 font-mono">{formatTime(startTime)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      "{segment.text}"
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Demo mode:</strong> Shared links are stored locally and are only accessible on this device. In production, links would be globally accessible.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleCreateClip} className="btn-primary flex-1">
                  Create clip link
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={20} className="text-green-600" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">Clip created!</p>
                <p className="text-sm text-gray-500">Share this link to give anyone access to this moment.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {clipUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="btn-secondary flex-shrink-0 gap-1.5"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary flex-1">
                  Done
                </button>
                <a
                  href={clipUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 justify-center"
                >
                  <ExternalLink size={14} />
                  Open link
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
