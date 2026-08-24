import React, { useState, useEffect, useRef } from 'react';
import { Mic, Upload, Edit3, Type, Music2, CheckCircle2, Play, AlertCircle, FileText, X, Save, Trash2, Loader2, Globe } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';
import { Track, LyricsResult } from '../../types';
import { saveUserLyrics, clearUserLyrics, transliterateToHinglish } from '../../services/lyricsService';

export const SyncedLyricsView: React.FC<{
  track: Track | null;
  compact?: boolean;
}> = ({ track, compact = false }) => {
  const audio = useAudio();
  const { setToastMessage } = useData();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'karaoke'>('large');
  const [scriptMode, setScriptMode] = useState<'original' | 'english' | 'hinglish'>('original');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorText, setEditorText] = useState<string>('');

  const lyricsResult: LyricsResult | null = audio.activeLyricsResult;
  const lyricsStatus = audio.activeLyricsStatus;

  // Active line index calculation with sub-second high-precision matching & 40ms lookahead compensation
  const activeIndex = (lyricsResult && lyricsResult.synced && lyricsResult.lines.length > 0)
    ? lyricsResult.lines.reduce((acc, line, idx) => {
        if (line.startTime !== undefined && audio.currentTime >= (line.startTime - 0.04)) {
          return idx;
        }
        return acc;
      }, -1)
    : -1;

  // Ultra-Fluid Liquid Smooth Scroll Engine using 60 FPS requestAnimationFrame Spring LERP
  useEffect(() => {
    if (!lyricsResult?.synced || activeIndex < 0 || !containerRef.current) return;
    const container = containerRef.current;
    const activeEl = lineRefs.current[activeIndex];
    if (!activeEl) return;

    const targetScroll = activeEl.offsetTop - (container.clientHeight / 2) + (activeEl.clientHeight / 2);
    
    let animId: number;
    const lerpScroll = () => {
      const currentScroll = container.scrollTop;
      const diff = targetScroll - currentScroll;

      if (Math.abs(diff) > 0.4) {
        container.scrollTop = currentScroll + (diff * 0.12); // Smooth fluid spring ratio
        animId = requestAnimationFrame(lerpScroll);
      } else {
        container.scrollTop = targetScroll;
      }
    };

    animId = requestAnimationFrame(lerpScroll);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeIndex, lyricsResult?.synced]);

  const handleLineClick = (startTime?: number) => {
    if (startTime !== undefined) {
      audio.seek(startTime);
    }
  };

  const handleLrcImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !track) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        saveUserLyrics(track.id, content);
        await audio.reloadLyrics();
        setToastMessage('✓ Imported custom lyrics file!');
      }
    };
    reader.readAsText(file);
  };

  const handleOpenEditor = () => {
    if (!track) return;
    const currentLines = lyricsResult?.lines.map(l => {
      if (l.startTime !== undefined) {
        const mins = Math.floor(l.startTime / 60);
        const secs = (l.startTime % 60).toFixed(2);
        const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
        const secsStr = parseFloat(secs) < 10 ? `0${secs}` : `${secs}`;
        return `[${minsStr}:${secsStr}] ${l.text}`;
      }
      return l.text;
    }).join('\n') || '';

    setEditorText(currentLines);
    setIsEditorOpen(true);
  };

  const handleSaveEditor = async () => {
    if (!track) return;
    saveUserLyrics(track.id, editorText);
    await audio.reloadLyrics();
    setIsEditorOpen(false);
    setToastMessage('✓ Custom lyrics saved.');
  };

  const handleClearCustomLyrics = async () => {
    if (!track) return;
    clearUserLyrics(track.id);
    await audio.reloadLyrics();
    setIsEditorOpen(false);
    setToastMessage('✓ Restored default lyrics.');
  };

  if (!track) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-subtle)' }}>
        No track selected.
      </div>
    );
  }

  // Calculate typography scaling
  const getFontSize = (isActive: boolean) => {
    if (fontSizeMode === 'karaoke') return isActive ? '2.2rem' : '1.35rem';
    if (fontSizeMode === 'large') return isActive ? '1.75rem' : '1.15rem';
    return isActive ? '1.3rem' : '0.98rem';
  };

  // Calculate opacity gradient based on distance from active line
  const getOpacity = (idx: number) => {
    if (activeIndex === -1) return 0.85;
    const distance = Math.abs(idx - activeIndex);
    if (distance === 0) return 1.0;
    if (distance === 1) return 0.52;
    if (distance === 2) return 0.30;
    return 0.14;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Sleek Minimalist Controls Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Left Status & Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {lyricsStatus === 'verified_synced' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Synced
            </span>
          )}
          {lyricsStatus === 'verified_plain' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={12} /> Plain Lyrics
            </span>
          )}
          {lyricsStatus === 'user_provided' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Edit3 size={12} /> User Lyrics
            </span>
          )}
          {lyricsStatus === 'instrumental' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b5cf6', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Music2 size={12} /> Instrumental
            </span>
          )}
          {lyricsResult?.language && lyricsStatus !== 'unavailable' && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={11} /> {lyricsResult.language}
            </span>
          )}
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Original vs English vs Hinglish 3-Way Toggle */}
          <div style={{ display: 'flex', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setScriptMode('original')}
              style={{
                backgroundColor: scriptMode === 'original' ? '#ef233c' : 'transparent',
                color: scriptMode === 'original' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 9px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Original
            </button>
            <button
              onClick={() => setScriptMode('english')}
              style={{
                backgroundColor: scriptMode === 'english' ? '#ef233c' : 'transparent',
                color: scriptMode === 'english' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 9px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => setScriptMode('hinglish')}
              style={{
                backgroundColor: scriptMode === 'hinglish' ? '#ef233c' : 'transparent',
                color: scriptMode === 'hinglish' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 9px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hinglish
            </button>
          </div>

          {/* T LARGE Font Controller */}
          <button
            onClick={() => {
              if (fontSizeMode === 'normal') setFontSizeMode('large');
              else if (fontSizeMode === 'large') setFontSizeMode('karaoke');
              else setFontSizeMode('normal');
            }}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Type size={12} /> {fontSizeMode === 'normal' ? 'T Normal' : fontSizeMode === 'large' ? 'T Large' : 'T Karaoke'}
          </button>

          {/* Import LRC */}
          <label
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-subtle)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Upload size={12} /> LRC
            <input type="file" accept=".lrc,.txt" onChange={handleLrcImport} style={{ display: 'none' }} />
          </label>

          {/* Edit */}
          <button
            onClick={handleOpenEditor}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-subtle)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Edit3 size={12} /> Edit
          </button>
        </div>
      </div>

      {/* Breathing Main Lyrics Body (NO BOX CONTAINER) */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 10px 180px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: lyricsResult?.synced ? '28px' : '16px'
        }}
      >
        {/* Loading State */}
        {lyricsStatus === 'loading' && (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <Loader2 size={32} className="spin-animation" style={{ color: '#ef233c', marginBottom: '14px' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>Loading lyrics...</div>
          </div>
        )}

        {/* Instrumental State */}
        {lyricsStatus === 'instrumental' && (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <Music2 size={40} style={{ opacity: 0.25, marginBottom: '14px', color: '#ef233c' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Instrumental Track</div>
            <div style={{ fontSize: '0.85rem', marginTop: '4px', color: 'var(--text-subtle)' }}>
              No vocal lyrics available for this track.
            </div>
          </div>
        )}

        {/* Lyrics Unavailable State */}
        {lyricsStatus === 'unavailable' && (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <AlertCircle size={40} style={{ opacity: 0.2, marginBottom: '14px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Lyrics unavailable</div>
            <p style={{ fontSize: '0.86rem', marginTop: '6px', color: 'var(--text-subtle)', maxWidth: '360px', margin: '6px auto 20px auto' }}>
              No verified lyrics found. You can import an LRC file or add custom lyrics.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <label
                style={{
                  backgroundColor: '#ef233c',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Upload size={14} /> Import .LRC
                <input type="file" accept=".lrc,.txt" onChange={handleLrcImport} style={{ display: 'none' }} />
              </label>

              <button
                onClick={handleOpenEditor}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-main)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Add Lyrics
              </button>
            </div>
          </div>
        )}

        {/* Valid Lyrics Lines - Apple Music Fluid Highlights */}
        {(lyricsStatus === 'verified_synced' || lyricsStatus === 'verified_plain' || lyricsStatus === 'user_provided') && lyricsResult && lyricsResult.lines.length > 0 && (
          lyricsResult.synced ? (
            // Synchronized Lyrics
            lyricsResult.lines.map((line, idx) => {
              const isActive = idx === activeIndex;
              const opacity = getOpacity(idx);
              const textToDisplay = scriptMode === 'english'
                ? `[English] ${line.text}`
                : scriptMode === 'hinglish'
                ? transliterateToHinglish(line.text)
                : line.text;

              return (
                <div
                  key={line.id || idx}
                  ref={el => { lineRefs.current[idx] = el; }}
                  onClick={() => handleLineClick(line.startTime)}
                  style={{
                    fontSize: getFontSize(isActive),
                    fontWeight: isActive ? 800 : 500,
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                    opacity: opacity,
                    transform: isActive ? 'scale(1.03) translateX(6px)' : 'scale(0.97) translateX(0)',
                    transformOrigin: 'left center',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    borderLeft: isActive ? '3px solid #ffffff' : '3px solid transparent',
                    transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '14px'
                  }}
                >
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{textToDisplay}</span>
                </div>
              );
            })
          ) : (
            // Unsynchronized / Plain Lyrics
            <div style={{ maxWidth: '640px', lineHeight: 1.8, fontSize: fontSizeMode === 'large' ? '1.2rem' : '1.05rem', color: 'var(--text-main)' }}>
              {lyricsResult.lines.map((line, idx) => (
                <p key={line.id || idx} style={{ margin: '12px 0', opacity: 0.85 }}>
                  {scriptMode === 'english'
                    ? `[English] ${line.text}`
                    : scriptMode === 'hinglish'
                    ? transliterateToHinglish(line.text)
                    : line.text}
                </p>
              ))}
            </div>
          )
        )}
      </div>

      {/* Lyrics Editor Modal */}
      {isEditorOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#11131c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '24px',
              width: '100%',
              maxWidth: '600px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Edit Lyrics ({track.title})
              </h3>
              <button onClick={() => setIsEditorOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <textarea
              value={editorText}
              onChange={e => setEditorText(e.target.value)}
              placeholder="[00:12.50] Lyric line..."
              rows={12}
              style={{
                width: '100%',
                backgroundColor: '#07080c',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {lyricsStatus === 'user_provided' ? (
                <button
                  onClick={handleClearCustomLyrics}
                  style={{ backgroundColor: 'transparent', color: '#ef233c', border: 'none', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Clear Custom Lyrics
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: 'none', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditor}
                  style={{ backgroundColor: '#ef233c', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
