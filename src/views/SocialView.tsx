import React, { useEffect, useState } from 'react';
import { Play, Sparkles, Globe, Award, ExternalLink, Heart, Music, Flame } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAudio } from '../context/AudioContext';
import { api } from '../services/apiService';

export const SocialView: React.FC = () => {
  const { creatorProfile, setSelectedPlaylist, setActiveTab, openAddToPlaylistModal } = useData();
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [creatorPlaylists, setCreatorPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const creatorData = await api.getCreatorProfile();
        if (creatorData.playlists) {
          setCreatorPlaylists(creatorData.playlists);
        }
      } catch (err) {
        console.warn('Could not fetch creator profile:', err);
      }
    };
    fetchCreator();
  }, []);

  const featuredPlaylist = creatorPlaylists[0];

  return (
    <div className="content-body" style={{ maxWidth: '960px', margin: '0 auto', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Project Creator & Architecture</h1>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Official contributor spotlight, master playlist collection, and open source repository
        </div>
      </div>

      {/* Creator / Author Spotlight Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(23, 26, 37, 0.98) 0%, rgba(30, 20, 30, 0.95) 100%)',
          border: '1px solid rgba(239, 35, 60, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <img
          src="https://github.com/hxverma-io.png"
          alt="HV (@hxverma.io)"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--color-primary)',
            boxShadow: '0 0 25px rgba(239, 35, 60, 0.35)'
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/282673430?v=4';
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '4px 12px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
              Project Creator & Lead Architect
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', fontWeight: 600 }}>@hxverma.io</span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
            {creatorProfile?.name || 'Himanshu Verma'}
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.6 }}>
            Creator & Lead Architect of Aura Music. Open source developer building next-gen Web Audio streaming, full-length 320kbps engines & real-time audio systems.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            {featuredPlaylist && (
              <button
                className="btn-play-hero"
                style={{ padding: '10px 22px', fontSize: '0.86rem', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                onClick={() => {
                  if (featuredPlaylist.tracks?.length > 0) {
                    playTrack(featuredPlaylist.tracks[0], featuredPlaylist.tracks);
                  } else {
                    setSelectedPlaylist(featuredPlaylist);
                    setActiveTab('playlists');
                  }
                }}
              >
                <Play size={15} fill="currentColor" /> Play Creator Mix
              </button>
            )}

            <a
              href="https://github.com/hxverma-io"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub: hxverma-io
            </a>

            <a
              href="https://www.instagram.com/hxverma.io/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <Globe size={16} color="#e1306c" /> Instagram: @hxverma.io
            </a>
          </div>
        </div>
      </div>

      {/* Curated Master Playlist Preview */}
      {featuredPlaylist && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">⚡ HV Master Favorites Collection</h2>
            <span
              className="section-see-all"
              onClick={() => {
                setSelectedPlaylist(featuredPlaylist);
                setActiveTab('playlists');
              }}
            >
              Open in Playlists
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(featuredPlaylist.tracks || []).map((track: any, idx: number) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id || idx}
                  onClick={() => playTrack(track, featuredPlaylist.tracks)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isThisPlaying ? 'rgba(239, 35, 60, 0.12)' : 'var(--bg-card)',
                    border: '1px solid ' + (isThisPlaying ? 'var(--color-primary)' : 'var(--border-color)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isThisPlaying ? 'var(--color-primary)' : 'var(--text-subtle)', width: '22px' }}>
                    {idx + 1}
                  </span>

                  <img
                    src={track.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                    alt={track.title}
                    style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: isThisPlaying ? 'var(--color-primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {track.artist}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)' }}>
                    FULL 320 KBPS
                  </span>

                  <button
                    className="continue-play-btn"
                    onClick={e => {
                      e.stopPropagation();
                      playTrack(track, featuredPlaylist.tracks);
                    }}
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
