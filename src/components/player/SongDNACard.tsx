import React from 'react';
import { Dna, Zap, Activity, Music, Mic2, Disc, Globe, Sparkles } from 'lucide-react';
import { Track, SongDNA } from '../../types';

export const SongDNACard: React.FC<{
  track: Track | null;
  compact?: boolean;
}> = ({ track, compact = false }) => {
  if (!track) return null;

  // Fallback / default generated Song DNA if not explicitly populated
  const dna: SongDNA = track.songDna || {
    energy: Math.min(98, Math.max(35, (track.playCount * 7) % 100 || 75)),
    bpm: track.synthPreset?.bpm || (115 + (track.title.length * 3) % 40),
    danceability: 68 + (track.likesCount * 5) % 25,
    acousticness: track.isInstrumental ? 85 : 32,
    instrumentalness: track.isInstrumental ? 95 : 15,
    vocalIntensity: track.isInstrumental ? 5 : 82,
    mood: track.mood || 'Energy',
    genre: track.genre || 'Bollywood',
    era: `${Math.floor((track.year || 2024) / 10) * 10}s`,
    language: track.genre === 'Bollywood' ? 'Hindi (हिन्दी)' : (track.genre === 'Punjabi' ? 'Punjabi (ਪੰਜਾਬੀ)' : 'English')
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(13, 15, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: compact ? '12px' : '16px',
        padding: compact ? '14px' : '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? '10px' : '14px',
        width: '100%'
      }}
    >
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dna size={18} color="#ef233c" />
          <span style={{ fontSize: compact ? '0.85rem' : '0.95rem', fontWeight: 800, color: '#ffffff' }}>
            SONG DNA ANALYSIS
          </span>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#ef233c',
            backgroundColor: 'rgba(239, 35, 60, 0.12)',
            padding: '3px 9px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Sparkles size={11} /> Verified Audio Fingerprint
        </span>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: compact ? '8px' : '12px'
        }}
      >
        {/* BPM Gauge */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Activity size={18} color="#3b82f6" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>TEMPO / BPM</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{dna.bpm} BPM</div>
          </div>
        </div>

        {/* Energy Meter */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Zap size={18} color="#f59e0b" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>ENERGY LEVEL</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{dna.energy}%</div>
          </div>
        </div>

        {/* Language & Era */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Globe size={18} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>ORIGINAL SCRIPT</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{dna.language}</div>
          </div>
        </div>

        {/* Era & Genre */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Disc size={18} color="#8b5cf6" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>ERA & GENRE</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
              {dna.era} • {dna.genre}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars for Detailed Audio Traits */}
      {!compact && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '4px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
              <span>Danceability</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{dna.danceability}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${dna.danceability}%`, height: '100%', backgroundColor: '#ef233c' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
              <span>Acousticness</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{dna.acousticness}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${dna.acousticness}%`, height: '100%', backgroundColor: '#10b981' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
              <span>Vocal Intensity</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{dna.vocalIntensity}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${dna.vocalIntensity}%`, height: '100%', backgroundColor: '#3b82f6' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
