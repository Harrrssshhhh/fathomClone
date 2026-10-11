import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { SimulatedPlayer } from '../components/player/SimulatedPlayer';
import { TranscriptPanel } from '../components/transcript/TranscriptPanel';
import { SummaryPanel } from '../components/summary/SummaryPanel';
import { TemplateSelector } from '../components/ui/TemplateSelector';
import { ShareDialog } from '../components/sharing/ShareDialog';
import { Avatar } from '../components/ui/Avatar';
import type { TranscriptSegment } from '../types';
import { formatDate, formatDuration, formatTime } from '../utils/formatters';
import {
  ArrowLeft, Share2, Search, CheckSquare, Star, Clock,
  Users, FileText, ListChecks, Check
} from 'lucide-react';

type Tab = 'transcript' | 'summary' | 'actions' | 'highlights';

export function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getMeeting, toggleActionItem, addHighlight, activeTemplate, setActiveTemplate } = useApp();
  const { showToast } = useToast();

  const meeting = getMeeting(id!);
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'transcript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [shareSegmentId, setShareSegmentId] = useState<string | undefined>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const durationSeconds = (meeting?.durationMinutes ?? 0) * 60;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= durationSeconds) { setIsPlaying(false); return t; }
          return t + 1;
        });
      }, 500); // 2x speed for demo
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, durationSeconds]);

  if (!meeting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-3">Meeting not found</p>
          <button onClick={() => navigate('/meetings')} className="btn-secondary">Back to meetings</button>
        </div>
      </div>
    );
  }

  const summary = meeting.summaries[activeTemplate];

  const handleHighlight = (segment: TranscriptSegment) => {
    const already = meeting.highlights.some(h => h.transcriptSegmentId === segment.id);
    if (already) { showToast('Already highlighted', 'info'); return; }
    addHighlight(meeting.id, {
      meetingId: meeting.id,
      transcriptSegmentId: segment.id,
      timestamp: segment.startTime,
      excerpt: segment.text.slice(0, 120),
      speakerName: segment.speakerName,
    });
    showToast('Highlight saved', 'success');
  };

  const handleShareSegment = (segmentId: string, startTime: number) => {
    setShareSegmentId(segmentId);
    setCurrentTime(startTime);
    setShowShare(true);
  };

  const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'summary',    label: 'Summary',    icon: ListChecks },
    { id: 'actions',    label: `Actions (${meeting.actionItems.filter(a => !a.completed).length} open)`, icon: CheckSquare },
    { id: 'highlights', label: `Highlights (${meeting.highlights.length})`, icon: Star },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-start gap-4 max-w-6xl mx-auto">
          <button onClick={() => navigate('/meetings')} className="btn-ghost p-2 mt-0.5">
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{meeting.title}</h1>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <span>{formatDate(meeting.date)}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(meeting.durationMinutes)}</span>
              <span className="flex items-center gap-1"><Users size={11} />{meeting.participants.length} participants</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {meeting.participants.slice(0, 6).map(p => (
                <Avatar key={p.id} name={p.name} color={p.avatarColor} size="sm" />
              ))}
              {meeting.participants.length > 6 && (
                <span className="text-xs text-gray-400">+{meeting.participants.length - 6} more</span>
              )}
            </div>
          </div>
          <button onClick={() => { setShareSegmentId(undefined); setShowShare(true); }} className="btn-secondary">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Main content: two-column on desktop */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: player + tabs */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
            {/* Player */}
            <SimulatedPlayer
              durationMinutes={meeting.durationMinutes}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(p => !p)}
            />

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-0">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                      tab === t.id
                        ? 'border-brand-600 text-brand-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <t.icon size={13} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {tab === 'transcript' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transcript…"
                    value={transcriptSearch}
                    onChange={e => setTranscriptSearch(e.target.value)}
                    className="input pl-9 text-xs"
                  />
                </div>
                <TranscriptPanel
                  segments={meeting.transcript.filter(s =>
                    !transcriptSearch || s.text.toLowerCase().includes(transcriptSearch.toLowerCase()) || s.speakerName.toLowerCase().includes(transcriptSearch.toLowerCase())
                  )}
                  highlights={meeting.highlights}
                  currentTime={currentTime}
                  onSeek={setCurrentTime}
                  onHighlight={handleHighlight}
                  searchQuery={transcriptSearch}
                />
              </div>
            )}

            {tab === 'summary' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Summary template</p>
                  <TemplateSelector value={activeTemplate} onChange={setActiveTemplate} />
                </div>
                <SummaryPanel summary={summary} />
              </div>
            )}

            {tab === 'actions' && (
              <div className="space-y-2">
                {meeting.actionItems.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">No action items for this meeting.</p>
                ) : (
                  meeting.actionItems.map(ai => (
                    <div
                      key={ai.id}
                      className={`card flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${ai.completed ? 'opacity-60' : ''}`}
                    >
                      <button
                        onClick={() => toggleActionItem(meeting.id, ai.id)}
                        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          ai.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-brand-500'
                        }`}
                      >
                        {ai.completed && <Check size={11} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-800 leading-snug ${ai.completed ? 'line-through text-gray-400' : ''}`}>
                          {ai.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 font-medium">{ai.owner}</span>
                          {ai.dueDate && (
                            <>
                              <span className="text-gray-200">·</span>
                              <span className={`text-xs ${!ai.completed && new Date(ai.dueDate) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                                Due {new Date(ai.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </>
                          )}
                          {ai.timestampSeconds !== undefined && (
                            <>
                              <span className="text-gray-200">·</span>
                              <button
                                onClick={() => { setCurrentTime(ai.timestampSeconds!); setTab('transcript'); }}
                                className="text-xs text-brand-500 hover:text-brand-700 font-mono"
                              >
                                {formatTime(ai.timestampSeconds)}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'highlights' && (
              <div className="space-y-3">
                {meeting.highlights.length === 0 ? (
                  <div className="text-center py-8">
                    <Star size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No highlights yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click the bookmark icon on any transcript segment to highlight it.</p>
                  </div>
                ) : (
                  meeting.highlights.map(h => (
                    <div
                      key={h.id}
                      className="card px-4 py-3 cursor-pointer hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                      onClick={() => { setCurrentTime(h.timestamp); setTab('transcript'); }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Star size={12} className="text-yellow-500 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">{h.speakerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => { e.stopPropagation(); handleShareSegment(h.transcriptSegmentId, h.timestamp); }}
                            className="btn-ghost py-0.5 px-2 text-xs gap-1"
                          >
                            <Share2 size={11} /> Share
                          </button>
                          <span className="text-xs text-brand-500 font-mono">{formatTime(h.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">"{h.excerpt}"</p>
                      {h.note && <p className="text-xs text-gray-400 mt-1.5 italic">{h.note}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showShare && (
        <ShareDialog
          meeting={meeting}
          initialSegmentId={shareSegmentId}
          initialStartTime={shareSegmentId ? undefined : currentTime}
          onClose={() => { setShowShare(false); setShareSegmentId(undefined); }}
        />
      )}
    </div>
  );
}
