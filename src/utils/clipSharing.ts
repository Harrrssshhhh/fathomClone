import type { SharedClip } from '../types';

export interface EncodedClipData {
  m: string;
  d: string;
  dur: number;
  s: string;
  c: string;
  st: number;
  et: number;
  t: string;
}

export function encodeClipData(data: EncodedClipData): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function decodeClipData(encoded: string): EncodedClipData | null {
  try {
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}

export function buildClipUrl(
  clipId: string,
  data: EncodedClipData
): string {
  const encoded = encodeClipData(data);
  return `${window.location.origin}/shared/${clipId}?d=${encoded}`;
}

export function clipToEncodedData(
  clip: SharedClip,
  meeting: { title: string; date: string; durationMinutes: number },
  speakerColor?: string
): EncodedClipData {
  return {
    m: meeting.title,
    d: meeting.date,
    dur: meeting.durationMinutes,
    s: clip.speakerName,
    c: speakerColor || '#6b7280',
    st: clip.startTime,
    et: clip.endTime,
    t: clip.transcriptExcerpt,
  };
}
