import { useRef, useEffect } from 'react';
import { Star, Bookmark } from 'lucide-react';
import type { TranscriptSegment, Highlight } from '../../types';
import { formatTime } from '../../utils/formatters';
import { Avatar } from '../ui/Avatar';

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  highlights: Highlight[];
  currentTime: number;
  onSeek: (t: number) => void;
  onHighlight: (segment: TranscriptSegment) => void;
  searchQuery?: string;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
      : part
  );
}

export function TranscriptPanel({
  segments,
  highlights,
  currentTime,
  onSeek,
  onHighlight,
  searchQuery = '',
}: TranscriptPanelProps) {
  const activeRef = useRef<HTMLDivElement>(null);
  const highlightedIds = new Set(highlights.map(h => h.transcriptSegmentId));

  const activeSegment = segments.reduce<TranscriptSegment | null>((found, seg) => {
    if (currentTime >= seg.startTime && currentTime <= seg.endTime) return seg;
    return found;
  }, null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSegment?.id]);

  // Group consecutive segments by the same speaker
  const groupedSegments: { speaker: string; color: string; email: string; segs: TranscriptSegment[] }[] = [];
  for (const seg of segments) {
    const last = groupedSegments[groupedSegments.length - 1];
    if (last && last.speaker === seg.speakerName) {
      last.segs.push(seg);
    } else {
      groupedSegments.push({
        speaker: seg.speakerName,
        color: getColorForSpeaker(seg.speakerId),
        email: '',
        segs: [seg],
      });
    }
  }

  return (
    <div className="space-y-4">
      {groupedSegments.map((group, gi) => (
        <div key={gi} className="flex gap-3">
          <div className="flex-shrink-0 pt-1">
            <Avatar name={group.speaker} color={group.color} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-white text-xs">{group.speaker}</span>
              <button
                onClick={() => onSeek(group.segs[0].startTime)}
                className="text-xs text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 font-mono transition-colors"
              >
                {formatTime(group.segs[0].startTime)}
              </button>
            </div>
            <div className="space-y-1">
              {group.segs.map(seg => {
                const isActive = activeSegment?.id === seg.id;
                const isHighlighted = highlightedIds.has(seg.id);

                return (
                  <div
                    key={seg.id}
                    ref={isActive ? activeRef : undefined}
                    className={`
                      group relative flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors cursor-pointer
                      ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                      ${isHighlighted ? 'ring-1 ring-yellow-300 dark:ring-yellow-600 bg-yellow-50 dark:bg-yellow-900/10' : ''}
                    `}
                    onClick={() => onSeek(seg.startTime)}
                  >
                    {isHighlighted && (
                      <Star size={10} className="flex-shrink-0 mt-1 text-yellow-500 fill-yellow-400" />
                    )}
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
                      {highlightText(seg.text, searchQuery)}
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); onHighlight(seg); }}
                      className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30 ${isHighlighted ? 'opacity-100 text-yellow-500' : 'text-gray-400'}`}
                      title="Highlight this moment"
                    >
                      <Bookmark size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const SPEAKER_COLORS: Record<string, string> = {
  'p-sarah':  '#6366f1',
  'p-marcus': '#0ea5e9',
  'p-priya':  '#f43f5e',
  'p-james':  '#22c55e',
  'p-elena':  '#f59e0b',
  'p-tom':    '#8b5cf6',
  'p-nina':   '#06b6d4',
  'p-alex':   '#ec4899',
  'p-diana':  '#14b8a6',
  'p-rob':    '#f97316',
  'p-omar':   '#a855f7',
  'p-kate':   '#84cc16',
  'p-david':  '#fb923c',
  'p-rachel': '#a78bfa',
  'p-claire': '#34d399',
  'p-ben':    '#60a5fa',
};

function getColorForSpeaker(speakerId: string): string {
  return SPEAKER_COLORS[speakerId] || '#6b7280';
}
