import React from 'react';
import { X, Sliders, Volume2, Sparkles, Zap, Check } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { EQ_PRESETS } from '../../services/audioService';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerOpen,
    setIsEqualizerOpen,
    eqBands,
    setEQBandGain,
    activeEQPreset,
    applyEQPreset,
    audioQuality,
    setAudioQuality,
    playbackSpeed,
    setPlaybackSpeed
  } = useAudio();

  if (!isEqualizerOpen) return null;

  const presets = Object.keys(EQ_PRESETS);

  return (
    <div className="modal-backdrop" onClick={() => setIsEqualizerOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Audio Engine & Equalizer</h2>
          </div>
          <button
            onClick={() => setIsEqualizerOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* EQ Presets Pills */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Sound Profile Presets
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map(preset => {
              const isActive = activeEQPreset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => applyEQPreset(preset)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-elevated)',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid ' + (isActive ? 'var(--color-primary)' : 'var(--border-color)'),
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5-Band Sliders */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '170px' }}>
            {eqBands.map((band, idx) => (
              <div
                key={band.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {band.gain > 0 ? `+${band.gain}` : band.gain} dB
                </span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={band.gain}
                  onChange={e => setEQBandGain(idx, parseFloat(e.target.value))}
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    height: '90px',
                    width: '6px',
                    accentColor: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {band.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Quality & Master Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Quality Selector */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Streaming Quality
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['128k', '256k', 'lossless'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => setAudioQuality(q)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: audioQuality === q ? 'var(--color-primary)' : 'var(--bg-elevated)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {q === 'lossless' ? 'FLAC' : q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selector */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Playback Tempo: {playbackSpeed}x
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0.8, 1.0, 1.2, 1.5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: playbackSpeed === spd ? 'var(--color-primary)' : 'var(--bg-elevated)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
