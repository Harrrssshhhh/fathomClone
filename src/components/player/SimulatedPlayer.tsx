import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Gauge } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface SimulatedPlayerProps {
  durationMinutes: number;
  currentTime: number;
  onTimeChange: (t: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function SimulatedPlayer({
  durationMinutes,
  currentTime,
  onTimeChange,
  isPlaying,
  onPlayPause,
}: SimulatedPlayerProps) {
  const durationSeconds = durationMinutes * 60;
  const progressPct = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0;
  const trackRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(1);
  const speeds = [0.5, 1, 1.25, 1.5, 2];

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onTimeChange(Math.floor(pct * durationSeconds));
  };

  const skip = (delta: number) => {
    onTimeChange(Math.max(0, Math.min(durationSeconds, currentTime + delta)));
  };

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 select-none">
      {/* Waveform visual (purely decorative) */}
      <div className="mb-4 flex items-center gap-px h-10">
        {Array.from({ length: 80 }).map((_, i) => {
          const played = (i / 80) * 100 < progressPct;
          const height = 20 + Math.sin(i * 0.4) * 8 + Math.sin(i * 1.1) * 6;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-colors ${played ? 'bg-brand-400' : 'bg-gray-700'}`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Progress track */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-gray-700 rounded-full cursor-pointer mb-4 group"
        onClick={handleTrackClick}
      >
        <div
          className="absolute left-0 top-0 h-full bg-brand-500 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPct}% - 6px)` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => skip(-10)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            title="Back 10s"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={onPlayPause}
            className="p-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => skip(10)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            title="Forward 10s"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono">
          <span className="text-white">{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-gray-500" />
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
          >
            <Gauge size={12} />
            {speed}×
          </button>
        </div>
      </div>

      <p className="text-center text-gray-600 text-xs mt-3">
        ⚠ Simulated playback — no audio recording available in demo mode
      </p>
    </div>
  );
}
