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
  Users, FileText, ListChecks, Check, Copy, CheckCheck, Filter
} from 'lucide-react';

type Tab = 'summary' | 'actions' | 'highlights';

export function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getMeeting, toggleActionItem, addHighlight, activeTemplate, setActiveTemplate } = useApp();
  const { showToast } = useToast();

  const meeting = getMeeting(id!);
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'summary');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [shareSegmentId, setShareSegmentId] = useState<string | undefined>();
  const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set());
  const [copiedSummary, setCopiedSummary] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const durationSeconds = (meeting?.durationMinutes ?? 0) * 60;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= durationSeconds) { setIsPlaying(false); return t; }
          return t + 1;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, durationSeconds]);

  // Keyboard shortcuts: space = play/pause
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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

  const allSpeakers = Array.from(new Set(meeting.transcript.map(s => s.speakerName)));
  const speakerFilterActive = activeSpeakers.size > 0;
  const filteredSegments = speakerFilterActive
    ? meeting.transcript.filter(s => activeSpeakers.has(s.speakerName))
    : meeting.transcript;

  const toggleSpeaker = (name: string) => {
    setActiveSpeakers(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

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

  const handleCopySummary = async () => {
    const text = `${summary.overview}\n\n${summary.sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n')}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedSummary(true);
    showToast('Summary copied to clipboard', 'success');
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'summary',    label: 'Summary',    icon: ListChecks },
    { id: 'actions',    label: `Actions (${meeting.actionItems.filter(a => !a.completed).length} open)`, icon: CheckSquare },
    { id: 'highlights', label: `Highlights (${meeting.highlights.length})`, icon: Star },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-start gap-4 max-w-none">
          <button onClick={() => navigate('/meetings')} className="btn-ghost p-2 mt-0.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">{meeting.title}</h1>
              <span className="badge badge-green flex-shrink-0">{meeting.status}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
              <span>{formatDate(meeting.date)}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(meeting.durationMinutes)}</span>
              <span className="flex items-center gap-1"><Users size={11} />{meeting.participants.length} participants</span>
              <span className="badge badge-gray capitalize">{meeting.platform}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5">
              {meeting.participants.slice(0, 6).map(p => (
                <Avatar key={p.id} name={p.name} color={p.avatarColor} size="sm" />
              ))}
              {meeting.participants.length > 6 && (
                <span className="text-xs text-gray-400">+{meeting.participants.length - 6} more</span>
              )}
            </div>
          </div>
          <button onClick={() => { setShareSegmentId(undefined); setShowShare(true); }} className="btn-secondary flex-shrink-0">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Transcript (always visible) */}
        <div className="w-[45%] min-w-[320px] border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden bg-white dark:bg-gray-950">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Transcript</h2>
              <span className="text-xs text-gray-400">{meeting.transcript.length} segments</span>
            </div>
            <div className="relative mb-2">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transcript…"
                value={transcriptSearch}
                onChange={e => setTranscriptSearch(e.target.value)}
                className="input pl-8 text-xs py-1.5"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Filter size={11} className="text-gray-400 flex-shrink-0" />
              {allSpeakers.map(name => {
                const active = activeSpeakers.has(name);
                const participant = meeting.participants.find(p => p.name === name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleSpeaker(name)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                      active
                        ? 'text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    style={active ? { backgroundColor: participant?.avatarColor || '#6b7280' } : undefined}
                  >
                    {name.split(' ')[0]}
                  </button>
                );
              })}
              {speakerFilterActive && (
                <button
                  onClick={() => setActiveSpeakers(new Set())}
                  className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <TranscriptPanel
              segments={filteredSegments.filter(s =>
                !transcriptSearch || s.text.toLowerCase().includes(transcriptSearch.toLowerCase()) || s.speakerName.toLowerCase().includes(transcriptSearch.toLowerCase())
              )}
              highlights={meeting.highlights}
              currentTime={currentTime}
              onSeek={setCurrentTime}
              onHighlight={handleHighlight}
              searchQuery={transcriptSearch}
            />
          </div>
        </div>

        {/* Right: Player + Tabs */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
            {/* Player */}
            <SimulatedPlayer
              durationMinutes={meeting.durationMinutes}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(p => !p)}
            />
            <p className="text-[11px] text-gray-400 text-center -mt-2">
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded text-[10px] font-mono">Space</kbd> to play/pause
            </p>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-0">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                      tab === t.id
                        ? 'border-brand-600 text-brand-700 dark:text-brand-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <t.icon size={13} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {tab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Summary template</p>
                    <TemplateSelector value={activeTemplate} onChange={setActiveTemplate} />
                  </div>
                  <button onClick={handleCopySummary} className="btn-ghost text-xs gap-1.5">
                    {copiedSummary ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copiedSummary ? 'Copied' : 'Copy'}
                  </button>
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
                      className={`card dark:bg-gray-800 dark:border-gray-700 flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${ai.completed ? 'opacity-60' : ''}`}
                    >
                      <button
                        onClick={() => toggleActionItem(meeting.id, ai.id)}
                        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          ai.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
                        }`}
                      >
                        {ai.completed && <Check size={11} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-800 dark:text-gray-200 leading-snug ${ai.completed ? 'line-through text-gray-400' : ''}`}>
                          {ai.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{ai.owner}</span>
                          {ai.dueDate && (
                            <>
                              <span className="text-gray-200 dark:text-gray-600">·</span>
                              <span className={`text-xs ${!ai.completed && new Date(ai.dueDate) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                                Due {new Date(ai.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </>
                          )}
                          {ai.timestampSeconds !== undefined && (
                            <>
                              <span className="text-gray-200 dark:text-gray-600">·</span>
                              <button
                                onClick={() => setCurrentTime(ai.timestampSeconds!)}
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
                    <Star size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No highlights yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click the bookmark icon on any transcript segment to highlight it.</p>
                  </div>
                ) : (
                  meeting.highlights.map(h => (
                    <div
                      key={h.id}
                      className="card dark:bg-gray-800 dark:border-gray-700 px-4 py-3 cursor-pointer hover:border-yellow-300 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors"
                      onClick={() => setCurrentTime(h.timestamp)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Star size={12} className="text-yellow-500 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{h.speakerName}</span>
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
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">"{h.excerpt}"</p>
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
