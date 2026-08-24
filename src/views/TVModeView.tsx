import React, { useState, useEffect } from 'react';
import { Tv, Play, Pause, SkipForward, SkipBack, Volume2, Gamepad2, ArrowLeft } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useData } from '../context/DataContext';
import { AudioVisualizer } from '../components/player/AudioVisualizer';

export const TVModeView: React.FC = () => {
  const audio = useAudio();
  const { setActiveTab } = useData();
  const [focusedBtn, setFocusedBtn] = useState<'play' | 'next' | 'prev'>('play');

  // Gamepad keyboard shortcuts for couch viewing (Arrow keys, Spacebar, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Space') {
        e.preventDefault();
        audio.togglePlay();
      } else if (e.key === 'ArrowRight') {
        audio.nextTrack();
      } else if (e.key === 'ArrowLeft') {
        audio.prevTrack();
      } else if (e.key === 'Escape') {
        setActiveTab('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audio, setActiveTab]);

  const track = audio.currentTrack || {
    title: 'Aura Big-Screen TV Studio',
    artist: 'High Fidelity Ambient Mode',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    genre: 'Hi-Res Audio',
    duration: 300
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#05070c',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px',
        color: '#ffffff',
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.25) 0%, rgba(5, 7, 12, 0.95) 70%)`
      }}
    >
      {/* Top TV Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <ArrowLeft size={22} /> Exit TV Mode (ESC)
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(99, 102, 241, 0.2)', padding: '8px 20px', borderRadius: '30px', border: '1px solid var(--color-primary)' }}>
          <Tv size={22} color="var(--color-primary)" />
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>10-FOOT COUCH MODE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, fontSize: '0.95rem' }}>
          <Gamepad2 size={24} color="#10b981" /> Gamepad Ready
        </div>
      </div>

      {/* Main Big Screen Core */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '80px', alignItems: 'center' }}>
        {/* Massive Album Artwork */}
        <div style={{ position: 'relative' }}>
          <img
            src={track.albumArt}
            alt={track.title}
            style={{
              width: '400px',
              height: '400px',
              borderRadius: '24px',
              objectFit: 'cover',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 60px var(--color-primary-glow)',
              border: '3px solid rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>

        {/* Big Typography Details & Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              NOW PLAYING • FLAC 24-BIT / 192kHz
            </span>
            <h1 style={{ fontSize: '3.8rem', fontWeight: 900, marginTop: '8px', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {track.title}
            </h1>
            <p style={{ fontSize: '1.8rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, marginTop: '8px' }}>
              {track.artist}
            </p>
          </div>

          <AudioVisualizer isPlaying={audio.isPlaying} type="wave" width={650} height={120} />

          {/* Seekbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)' }}>
              {formatTime(audio.currentTime)}
            </span>
            <div style={{ flex: 1, height: '10px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${((audio.currentTime || 0) / (audio.duration || 1)) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 0 15px var(--color-primary)'
                }}
              />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)' }}>
              {formatTime(audio.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Couch Big Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
        <button
          onClick={() => audio.prevTrack()}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <SkipBack size={36} />
        </button>

        <button
          onClick={() => audio.togglePlay()}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            border: 'none',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.6)'
          }}
        >
          {audio.isPlaying ? <Pause size={48} /> : <Play size={48} style={{ marginLeft: '6px' }} />}
        </button>

        <button
          onClick={() => audio.nextTrack()}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <SkipForward size={36} />
        </button>
      </div>
    </div>
  );
};
