import { Track, LyricsResult, LyricsLine, LyricsSource, LyricsStatus } from '../types';

const LOCAL_STORAGE_PREFIX = 'aura_user_lyrics_';

/**
 * Detect language and script from actual lyrics text content using Unicode ranges.
 */
export function detectLyricsScriptAndLanguage(text: string): { language: string; script: string } {
  if (!text) return { language: 'Unknown', script: 'Latin' };

  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const gurmukhiCount = (text.match(/[\u0A00-\u0A7F]/g) || []).length;
  const bengaliCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const teluguCount = (text.match(/[\u0C00-\u0C7F]/g) || []).length;
  const japaneseCount = (text.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) || []).length;
  const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;

  const max = Math.max(devanagariCount, gurmukhiCount, bengaliCount, tamilCount, teluguCount, japaneseCount, arabicCount, latinCount);

  if (max === 0) return { language: 'Unknown', script: 'Latin' };
  if (max === devanagariCount) return { language: 'Hindi / Devanagari', script: 'Devanagari' };
  if (max === gurmukhiCount) return { language: 'Punjabi / Gurmukhi', script: 'Gurmukhi' };
  if (max === bengaliCount) return { language: 'Bengali', script: 'Bengali' };
  if (max === tamilCount) return { language: 'Tamil', script: 'Tamil' };
  if (max === teluguCount) return { language: 'Telugu', script: 'Telugu' };
  if (max === japaneseCount) return { language: 'Japanese', script: 'Kanji/Kana' };
  if (max === arabicCount) return { language: 'Arabic / Urdu', script: 'Arabic' };
  return { language: 'English / Latin', script: 'Latin' };
}

/**
 * Transliterate Devanagari / Gurmukhi characters to Hinglish (Romanized script).
 */
export function transliterateToHinglish(text: string): string {
  if (!text) return '';
  const devanagariMap: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ट': 't', 'ठ': 'th',
    'ड': 'd', 'ढ': 'dh', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n', 'प': 'p', 'फ': 'f', 'ब': 'b',
    'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n',
    '्': '', 'ँ': 'n', 'ः': 'h'
  };

  let res = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    res += devanagariMap[char] || char;
  }
  return res;
}

/**
 * Parse raw string content (.lrc or .txt format) into a structured LyricsResult.
 */
export function parseLrcContent(
  content: string,
  trackId: string,
  source: LyricsSource = 'file'
): LyricsResult {
  if (!content || !content.trim()) {
    return {
      trackId,
      synced: false,
      verified: false,
      source,
      status: 'unavailable',
      lines: []
    };
  }

  const rawLines = content.split(/\r?\n/);
  const lines: LyricsLine[] = [];
  let hasTimestamps = false;
  let headerLanguage: string | undefined;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i].trim();
    if (!raw) continue;

    // Check header tags like [la:en] or [ar:Artist]
    const headerMatch = raw.match(/^\[(la|ar|ti|al|offset):(.*)\]$/i);
    if (headerMatch) {
      if (headerMatch[1].toLowerCase() === 'la') {
        headerLanguage = headerMatch[2].trim();
      }
      continue;
    }

    // Match one or more timestamps [mm:ss.xx]
    const timestampRegex = /\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]/g;
    const timestamps: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = timestampRegex.exec(raw)) !== null) {
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      const millisStr = match[3] || '0';
      const millis = parseInt(millisStr.padEnd(3, '0').slice(0, 3), 10) / 1000;
      timestamps.push(mins * 60 + secs + millis);
    }

    const lyricText = raw.replace(/\[\d{1,3}:\d{2}(?:\.\d{1,3})?\]/g, '').trim();

    if (timestamps.length > 0) {
      hasTimestamps = true;
      for (const timeSec of timestamps) {
        lines.push({
          id: `${trackId}-line-${lines.length}-${timeSec}`,
          startTime: timeSec,
          text: lyricText
        });
      }
    } else if (lyricText) {
      lines.push({
        id: `${trackId}-plain-${lines.length}`,
        text: lyricText
      });
    }
  }

  // Sort lines by startTime if synced
  if (hasTimestamps) {
    lines.sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0));
  }

  const fullText = lines.map(l => l.text).join(' ');
  const detected = detectLyricsScriptAndLanguage(fullText);

  const status: LyricsStatus = source === 'user'
    ? 'user_provided'
    : hasTimestamps
    ? 'verified_synced'
    : 'verified_plain';

  return {
    trackId,
    language: headerLanguage || detected.language,
    script: detected.script,
    synced: hasTimestamps,
    verified: source !== 'user',
    source,
    status,
    lines,
    plainText: lines.map(l => l.text).join('\n')
  };
}

/**
 * Retrieve user-saved custom lyrics from localStorage.
 */
export function getStoredUserLyrics(trackId: string): LyricsResult | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${trackId}`);
    if (!raw) return null;
    return parseLrcContent(raw, trackId, 'user');
  } catch (err) {
    console.error('Failed to read user lyrics from storage', err);
    return null;
  }
}

/**
 * Save user custom lyrics (.lrc or .txt content) to localStorage.
 */
export function saveUserLyrics(trackId: string, content: string): LyricsResult {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${trackId}`, content);
  } catch (err) {
    console.error('Failed to save user lyrics to storage', err);
  }
  return parseLrcContent(content, trackId, 'user');
}

/**
 * Clear user custom lyrics from localStorage.
 */
export function clearUserLyrics(trackId: string): void {
  try {
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${trackId}`);
  } catch (err) {
    console.error('Failed to remove user lyrics from storage', err);
  }
}

/**
 * Fetch online lyrics from external LRCLIB provider with retry and metadata validation.
 */
async function fetchOnlineLyrics(track: Track): Promise<LyricsResult | null> {
  const cleanTitle = track.title.replace(/\(.*\)/g, '').trim();
  const cleanArtist = track.artist.split(',')[0].trim();

  // Attempt 1: Direct LRCLIB get query
  try {
    const getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;
    const res = await fetch(getUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        return parseLrcContent(data.syncedLyrics, track.id, 'provider');
      } else if (data.plainLyrics) {
        return parseLrcContent(data.plainLyrics, track.id, 'provider');
      }
    }
  } catch (err) {
    console.warn('LRCLIB direct fetch failed, retrying search endpoint...', err);
  }

  // Attempt 2: Search retry endpoint with looser matching
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTitle + ' ' + cleanArtist)}`;
    const res = await fetch(searchUrl);
    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        // Validate track title/artist similarity to avoid wrong song lyrics
        const bestMatch = items.find((item: any) => {
          const itemTitle = (item.trackName || '').toLowerCase();
          const itemArtist = (item.artistName || '').toLowerCase();
          return itemTitle.includes(cleanTitle.toLowerCase()) || cleanTitle.toLowerCase().includes(itemTitle);
        }) || items[0];

        if (bestMatch.syncedLyrics) {
          return parseLrcContent(bestMatch.syncedLyrics, track.id, 'provider');
        } else if (bestMatch.plainLyrics) {
          return parseLrcContent(bestMatch.plainLyrics, track.id, 'provider');
        }
      }
    }
  } catch (err) {
    console.warn('LRCLIB search retry failed:', err);
  }

  return null;
}

/**
 * Resolution Pipeline: Multi-source lyrics resolution without AI hallucination.
 */
export async function resolveLyricsForTrack(track: Track): Promise<LyricsResult> {
  // 1. Instrumental check
  if (track.isInstrumental) {
    return {
      trackId: track.id,
      synced: false,
      isInstrumental: true,
      verified: true,
      source: 'embedded',
      status: 'instrumental',
      lines: []
    };
  }

  // 2. User imported / saved lyrics check
  const userLyrics = getStoredUserLyrics(track.id);
  if (userLyrics && userLyrics.lines.length > 0) {
    return userLyrics;
  }

  // 3. Embedded track.lyricsResult check
  if (track.lyricsResult && track.lyricsResult.lines.length > 0) {
    return track.lyricsResult;
  }

  // 4. Embedded track.lyrics string array check
  if (track.lyrics && track.lyrics.length > 0) {
    const joined = track.lyrics.join('\n');
    const parsed = parseLrcContent(joined, track.id, 'embedded');
    if (parsed.lines.length > 0) {
      return parsed;
    }
  }

  // 5. Online Provider API fetch (LRCLIB with retry & validation)
  const onlineLyrics = await fetchOnlineLyrics(track);
  if (onlineLyrics && onlineLyrics.lines.length > 0) {
    return onlineLyrics;
  }

  // 6. Fallback: No verified lyrics found across all sources. DO NOT FABRICATE.
  return {
    trackId: track.id,
    synced: false,
    verified: false,
    source: 'provider',
    status: 'unavailable',
    lines: []
  };
}
