import React, { useState } from 'react';
import { X, Sliders, Volume2, Sparkles, Zap, Check, Gauge, Layers, Activity } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { EQ_PRESETS_10, DEFAULT_EQ_BANDS_31 } from '../../services/audioService';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerOpen,
    setIsEqualizerOpen,
    eqBands,
    setEQBandGain,
    activeEQPreset,
    applyEQPreset,
    autoEqForCurrentSong,
    audioQuality,
    setAudioQuality,
    playbackSpeed,
    setPlaybackSpeed,
    preampDb,
    setPreampDb,
    isLoudnessNormalized,
    setIsLoudnessNormalized,
    currentTrack
  } = useAudio();

  const [eqMode, setEqMode] = useState<'10band' | '31band'>('10band');
  const [activeBandIndex, setActiveBandIndex] = useState<number>(0);

  if (!isEqualizerOpen) return null;

  const presets = Object.keys(EQ_PRESETS_10);
  const currentBands = eqMode === '31band' ? DEFAULT_EQ_BANDS_31 : eqBands;

  // Compute SVG Bezier path for EQ Curve Visualizer
  const width = 560;
  const height = 90;
  const zeroY = height / 2;
  const points = currentBands.map((band, idx) => {
    const x = (idx / (currentBands.length - 1)) * (width - 40) + 20;
    const y = zeroY - (band.gain / 12) * (zeroY - 10);
    return { x, y };
  });

  let svgPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    svgPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="modal-backdrop" onClick={() => setIsEqualizerOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          backgroundColor: '#0c0e15',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={22} color="#ef233c" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Professional Parametric Equalizer & DSP
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 10-Band vs 31-Band Mode Switcher */}
            <div style={{ display: 'flex', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                onClick={() => setEqMode('10band')}
                style={{
                  backgroundColor: eqMode === '10band' ? '#ef233c' : 'transparent',
                  color: eqMode === '10band' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                10-Band
              </button>
              <button
                onClick={() => setEqMode('31band')}
                style={{
                  backgroundColor: eqMode === '31band' ? '#ef233c' : 'transparent',
                  color: eqMode === '31band' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                31-Band ISO
              </button>
            </div>

            <button
              onClick={() => setIsEqualizerOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic SVG Frequency Curve */}
        <div
          style={{
            backgroundColor: '#07080c',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Web Audio Biquad Filter Frequency Response ({eqMode === '31band' ? '31-Band 1/3 Octave' : '10-Band'})
            </span>
            {currentTrack && (
              <button
                onClick={autoEqForCurrentSong}
                style={{
                  backgroundColor: 'rgba(239, 35, 60, 0.15)',
                  color: '#ef233c',
                  border: '1px solid #ef233c',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={11} /> AI Auto-EQ for "{currentTrack.title}"
              </button>
            )}
          </div>

          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
            <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="4 4" />
            <path
              d={`${svgPath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
              fill="rgba(239, 35, 60, 0.15)"
            />
            <path d={svgPath} fill="none" stroke="#ef233c" strokeWidth="2.5" />
            {points.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="#ef233c" strokeWidth="2" />
            ))}
          </svg>
        </div>

        {/* EQ Presets */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Audiophile Presets
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {presets.map(preset => {
              const isActive = activeEQPreset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => applyEQPreset(preset)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? '#ef233c' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid ' + (isActive ? '#ef233c' : 'rgba(255, 255, 255, 0.08)'),
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: 600
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Band Sliders Grid */}
        <div
          style={{
            backgroundColor: '#07080c',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '16px',
            overflowX: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', minWidth: eqMode === '31band' ? '850px' : 'auto' }}>
            {currentBands.map((band, idx) => (
              <div
                key={band.label || idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  flex: 1
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: band.gain !== 0 ? '#ef233c' : 'var(--text-subtle)' }}>
                  {band.gain > 0 ? `+${band.gain}` : band.gain}
                </span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={band.gain}
                  onChange={e => setEQBandGain(idx, parseFloat(e.target.value))}
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    height: '75px',
                    width: '5px',
                    accentColor: '#ef233c',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {band.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom DSP Controls Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          {/* Preamp */}
          <div style={{ backgroundColor: '#07080c', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Preamp: {preampDb > 0 ? `+${preampDb}` : preampDb} dB
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={preampDb}
              onChange={e => setPreampDb(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#ef233c', cursor: 'pointer' }}
            />
          </div>

          {/* Loudness Normalization */}
          <div style={{ backgroundColor: '#07080c', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Loudness Normalization
            </div>
            <button
              onClick={() => setIsLoudnessNormalized(!isLoudnessNormalized)}
              style={{
                padding: '5px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isLoudnessNormalized ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              {isLoudnessNormalized ? '✓ -14 LUFS On' : 'Disabled'}
            </button>
          </div>

          {/* Playback Speed */}
          <div style={{ backgroundColor: '#07080c', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Speed: {playbackSpeed}x
            </div>
            <select
              value={playbackSpeed}
              onChange={e => setPlaybackSpeed(parseFloat(e.target.value))}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px',
                fontSize: '0.76rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {speedOptions.map(sp => (
                <option key={sp} value={sp} style={{ backgroundColor: '#07080c' }}>
                  {sp}x {sp === 1.0 ? '(Normal)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Hi-Res Quality */}
          <div style={{ backgroundColor: '#07080c', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Audio Engine
            </div>
            <button
              onClick={() => setAudioQuality(audioQuality === 'lossless' ? '256k' : 'lossless')}
              style={{
                width: '100%',
                padding: '5px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: audioQuality === 'lossless' ? '#ef233c' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              {audioQuality === 'lossless' ? 'FLAC 24-bit/192k' : 'AAC 256k'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
