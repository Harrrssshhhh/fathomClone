import { useMemo, useState } from 'react';
import { X, Copy, Check, ExternalLink, Scissors } from 'lucide-react';
import type { Meeting, SharedClip } from '../../types';
import { formatTime } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { buildClipUrl, clipToEncodedData } from '../../utils/clipSharing';

interface ShareDialogProps {
  meeting: Meeting;
  onClose: () => void;
  initialSegmentId?: string;
  initialStartTime?: number;
}

const MIN_CLIP_SECONDS = 5;

export function ShareDialog({ meeting, onClose, initialSegmentId, initialStartTime }: ShareDialogProps) {
  const { createSharedClip } = useApp();
  const [copied, setCopied] = useState(false);
  const [clip, setClip] = useState<SharedClip | null>(null);

  const totalSeconds = meeting.durationMinutes * 60;

  const segment = initialSegmentId
    ? meeting.transcript.find(s => s.id === initialSegmentId)
    : meeting.transcript[0];

  const segStart = segment?.startTime ?? 0;
  const segEnd = segment?.endTime ?? Math.min(segStart + 60, totalSeconds);

  const [clipStart, setClipStart] = useState<number>(
    initialStartTime != null ? initialStartTime : segStart
  );
  const [clipEnd, setClipEnd] = useState<number>(segEnd);

  const segmentsInRange = useMemo(
    () => meeting.transcript.filter(s => s.endTime >= clipStart && s.startTime <= clipEnd),
    [meeting.transcript, clipStart, clipEnd]
  );

  const excerpt = segmentsInRange
    .map(s => `${s.speakerName}: ${s.text}`)
    .join(' ');

  const clipDuration = clipEnd - clipStart;
  const isRangeValid = clipDuration >= MIN_CLIP_SECONDS;

  const handleStartChange = (v: number) => {
    setClipStart(Math.min(v, clipEnd - MIN_CLIP_SECONDS));
  };
  const handleEndChange = (v: number) => {
    setClipEnd(Math.max(v, clipStart + MIN_CLIP_SECONDS));
  };

  const handleCreateClip = () => {
    if (!isRangeValid) return;
    const firstSeg = segmentsInRange[0];
    const newClip = createSharedClip(meeting.id, {
      meetingId: meeting.id,
      meetingTitle: meeting.title,
      startTime: clipStart,
      endTime: clipEnd,
      transcriptExcerpt: excerpt,
      speakerName: firstSeg?.speakerName ?? segment?.speakerName ?? 'Unknown',
    });
    setClip(newClip);
  };

  const clipUrl = clip
    ? (() => {
        const speaker = meeting.participants.find(p => p.name === clip.speakerName);
        const data = clipToEncodedData(clip, meeting, speaker?.avatarColor);
        return buildClipUrl(clip.id, data);
      })()
    : null;

  const handleCopy = async () => {
    if (!clipUrl) return;
    try {
      await navigator.clipboard.writeText(clipUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {clip ? 'Clip created' : 'Create a clip'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {!clip ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Clip range</span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {formatTime(clipStart)} → {formatTime(clipEnd)}
                  <span className="ml-2 text-xs text-gray-400">
                    ({Math.round(clipDuration)}s)
                  </span>
                </span>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-500 dark:text-gray-400 w-12">Start</label>
                  <input
                    type="range"
                    min={0}
                    max={totalSeconds}
                    step={1}
                    value={clipStart}
                    onChange={e => handleStartChange(Number(e.target.value))}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="font-mono text-xs text-gray-700 dark:text-gray-300 w-10 text-right">
                    {formatTime(clipStart)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-500 dark:text-gray-400 w-12">End</label>
                  <input
                    type="range"
                    min={0}
                    max={totalSeconds}
                    step={1}
                    value={clipEnd}
                    onChange={e => handleEndChange(Number(e.target.value))}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="font-mono text-xs text-gray-700 dark:text-gray-300 w-10 text-right">
                    {formatTime(clipEnd)}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      const mid = Math.floor((clipStart + clipEnd) / 2);
                      setClipStart(Math.max(0, mid - 15));
                      setClipEnd(Math.min(totalSeconds, mid + 15));
                    }}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Scissors size={12} /> 30s around midpoint
                  </button>
                </div>
              </div>

              {!isRangeValid && (
                <p className="text-xs text-red-500">
                  Clip must be at least {MIN_CLIP_SECONDS} seconds long.
                </p>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Preview · {segmentsInRange.length} segment{segmentsInRange.length !== 1 ? 's' : ''}
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {segmentsInRange.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No transcript in this range.</p>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      "{excerpt}"
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Demo mode:</strong> Clip data is embedded in the link, so anyone with the link can view it — no backend required.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleCreateClip}
                  disabled={!isRangeValid}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create clip link
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Clip created!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share this link to give anyone access to this moment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {clipUrl}
                </div>
                <button onClick={handleCopy} className="btn-secondary flex-shrink-0 gap-1.5">
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
