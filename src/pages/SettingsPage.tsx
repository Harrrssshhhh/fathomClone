import { useState } from 'react';
import { Calendar, Mic, CheckCircle, Clock, Wifi } from 'lucide-react';

type Step = 'connect' | 'platform' | 'recording' | 'done';

export function SettingsPage() {
  const [recordingStep, setRecordingStep] = useState<Step>('connect');
  const [platform, setPlatform] = useState<string>('');
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const startRecording = (p: string) => {
    setPlatform(p);
    setRecordingStep('recording');
    setElapsed(0);
    const id = setInterval(() => setElapsed(prev => prev + 1), 1000);
    setIntervalId(id);
  };

  const stopRecording = () => {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    setRecordingStep('done');
  };

  const formatElapsed = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Settings & Integrations</h1>
        <p className="text-sm text-gray-500 mb-8">Manage your calendar connections and recording preferences.</p>

        {/* Calendar Connection */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={15} className="text-brand-600" /> Calendar integration
          </h2>

          {recordingStep === 'connect' && (
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-5">
                Connect your calendar to automatically detect and record meetings. Currently running in demo mode with simulated recording.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { name: 'Google Calendar', color: 'bg-blue-50 border-blue-200 text-blue-700', emoji: '📅' },
                  { name: 'Outlook / Office 365', color: 'bg-orange-50 border-orange-200 text-orange-700', emoji: '📆' },
                  { name: 'Apple Calendar', color: 'bg-gray-50 border-gray-200 text-gray-700', emoji: '🗓' },
                ].map(cal => (
                  <div key={cal.name} className={`border rounded-xl p-4 text-center cursor-pointer hover:shadow-sm transition-all ${cal.color}`}>
                    <div className="text-2xl mb-2">{cal.emoji}</div>
                    <div className="text-xs font-medium">{cal.name}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                <strong>Demo mode:</strong> OAuth calendar connection is simulated. Click "Start simulated recording" below to experience the recording flow.
              </div>
              <button
                className="btn-primary mt-4 w-full justify-center"
                onClick={() => setRecordingStep('platform')}
              >
                <Mic size={14} /> Start simulated recording
              </button>
            </div>
          )}

          {recordingStep === 'platform' && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Select meeting platform</h3>
              <p className="text-sm text-gray-500 mb-5">Which platform is your meeting on?</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'zoom',  label: 'Zoom',        emoji: '🎥' },
                  { id: 'meet',  label: 'Google Meet', emoji: '📹' },
                  { id: 'teams', label: 'Teams',       emoji: '💼' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => startRecording(p.label)}
                    className="border border-gray-200 rounded-xl p-5 text-center hover:border-brand-300 hover:bg-brand-50 transition-all"
                  >
                    <div className="text-2xl mb-2">{p.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recordingStep === 'recording' && (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-semibold text-gray-900">Recording — {platform}</span>
                <span className="ml-auto font-mono text-lg text-gray-900">{formatElapsed(elapsed)}</span>
              </div>

              {/* Simulated live transcript feed */}
              <div className="bg-gray-900 rounded-xl p-4 mb-4 h-40 overflow-hidden relative">
                <div className="text-green-400 text-xs font-mono space-y-1">
                  <div>[{formatElapsed(Math.max(0, elapsed - 12))}] Sarah: This is being transcribed in real time…</div>
                  {elapsed > 5 && <div>[{formatElapsed(Math.max(0, elapsed - 8))}] Marcus: Every word is captured automatically.</div>}
                  {elapsed > 10 && <div>[{formatElapsed(Math.max(0, elapsed - 4))}] Sarah: We can highlight key moments like this.</div>}
                  {elapsed > 15 && <div>[{formatElapsed(elapsed - 1)}] Marcus: The AI summary will be ready after the call.</div>}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                  <Wifi size={12} className="text-green-400" />
                  <span className="text-green-400 text-xs font-mono">Live transcription active</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary flex-1 justify-center" onClick={() => {}}>
                  Add highlight
                </button>
                <button className="btn-primary flex-1 justify-center bg-red-600 hover:bg-red-700" onClick={stopRecording}>
                  End meeting
                </button>
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">⚠ Simulated recording — no actual audio is captured</p>
            </div>
          )}

          {recordingStep === 'done' && (
            <div className="card p-6 text-center">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Meeting ended — summary processing…</h3>
              <p className="text-sm text-gray-500 mb-5">
                In production, the AI would now generate your meeting summary, extract action items, and make the transcript searchable.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-5">
                <Clock size={13} />
                <span>Duration: {formatElapsed(elapsed)}</span>
              </div>
              <button className="btn-secondary" onClick={() => { setRecordingStep('connect'); setElapsed(0); }}>
                Reset demo
              </button>
            </div>
          )}
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="card divide-y divide-gray-100">
            {[
              { label: 'Default summary template', value: 'Standard Meeting Notes' },
              { label: 'Playback speed', value: '1×' },
              { label: 'Notification emails', value: 'Daily digest' },
              { label: 'Action item reminders', value: 'Real-time (Slack)' },
            ].map(pref => (
              <div key={pref.label} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-gray-700">{pref.label}</span>
                <span className="text-sm text-gray-400">{pref.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Preference editing is disabled in demo mode.</p>
        </section>
      </div>
    </div>
  );
}
