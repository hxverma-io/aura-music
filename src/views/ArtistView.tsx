import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  UserPlus,
  UserCheck,
  Heart,
  Plus,
  ListPlus,
  ArrowLeft,
  Sparkles,
  Music,
  Disc,
  Download,
  Check,
  Loader2
} from 'lucide-react';
import { Artist, Track } from '../types';
import { useData } from '../context/DataContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/apiService';

interface ArtistViewProps {
  artist: Artist;
  onBack?: () => void;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artist, onBack }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const {
    toggleLikeTrack,
    likedTrackIds,
    toggleFollowArtist,
    createPlaylist,
    setSelectedPlaylist,
    setActiveTab,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds
  } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [artistTracks, setArtistTracks] = useState<Track[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState<boolean>(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const res = await api.request(`/music/artist/${encodeURIComponent(artist.id)}`);
        if (res.tracks && res.tracks.length > 0) {
          setArtistTracks(res.tracks);
        }
      } catch (err) {
        console.warn('Artist data load error:', err);
      }
    };
    fetchArtistData();

    if (currentUser?.followedArtistIds) {
      setIsFollowing(currentUser.followedArtistIds.includes(artist.id));
    }
  }, [artist.id, currentUser]);

  const isCurrentArtistPlaying =
    isPlaying && currentTrack && (currentTrack.artistId === artist.id || currentTrack.artist.toLowerCase().includes(artist.name.toLowerCase()));

  const handlePlayAll = () => {
    if (artistTracks.length > 0) {
      playTrack(artistTracks[0], artistTracks);
    }
  };

  const handleToggleFollow = async () => {
    setIsFollowing(!isFollowing);
    await toggleFollowArtist(artist.id);
    setToastMsg(isFollowing ? `Unfollowed ${artist.name}` : `Following ${artist.name}!`);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleCreateArtistPlaylist = async () => {
    if (artistTracks.length === 0) return;
    setIsCreatingPlaylist(true);

    try {
      const newPlaylist = await createPlaylist({
        title: `⚡ ${artist.name}: The Essential Collection`,
        description: `Official artist collection curated with top streaming tracks by ${artist.name}.`,
        coverArt: artist.avatar,
        trackIds: artistTracks.map(t => t.id),
        tracks: artistTracks,
        isPublic: true,
        isCollaborative: false
      });

      setToastMsg(`Created "${newPlaylist.title}"!`);
      setTimeout(() => {
        setToastMsg('');
        setSelectedPlaylist(newPlaylist);
        setActiveTab('playlists');
      }, 1500);
    } catch (err) {
      console.error('Failed to create artist playlist:', err);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="content-body" style={{ animation: 'fadeIn 0.2s ease' }}>
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: 'fit-content'
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      )}

      {/* Artist Hero Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          padding: '36px 40px',
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <img
          src={artist.avatar || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
          alt={artist.name}
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid var(--color-primary)',
            boxShadow: 'var(--shadow-glow)'
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary)' }}>
              Verified Artist Profile
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginTop: '4px' }}>
            {artist.name}
          </h1>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '640px', lineHeight: 1.5 }}>
            {artist.bio || `${artist.name} is a world-class music artist streamed across millions of listeners.`}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-subtle)' }}>
            <span><strong>{(artist.monthlyListeners || 2450000).toLocaleString()}</strong> Monthly Listeners</span>
            <span>•</span>
            <span>{artist.genres?.join(', ') || 'Popular Music'}</span>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
            <button
              className="btn-play-hero"
              style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
              onClick={handlePlayAll}
            >
              {isCurrentArtistPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              <span>{isCurrentArtistPlaying ? 'Pause Radio' : 'Play Artist Radio'}</span>
            </button>

            <button
              className="btn-secondary-hero"
              onClick={handleToggleFollow}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={17} color="#10b981" /> Following
                </>
              ) : (
                <>
                  <UserPlus size={17} /> Follow
                </>
              )}
            </button>

            <button
              className="btn-secondary-hero"
              onClick={handleCreateArtistPlaylist}
              disabled={isCreatingPlaylist}
              style={{ borderColor: 'rgba(239, 35, 60, 0.4)' }}
            >
              <ListPlus size={17} color="var(--color-primary)" />
              <span>{isCreatingPlaylist ? 'Generating...' : 'Create Playlist from Artist'}</span>
            </button>

            {toastMsg && (
              <span style={{ fontSize: '0.84rem', color: '#10b981', fontWeight: 700, marginLeft: '8px' }}>
                ✓ {toastMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Popular Songs Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 className="section-title">Popular Tracks</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {artistTracks.length === 0 ? (
            <div style={{ color: 'var(--text-subtle)', padding: '20px 0' }}>Loading artist tracklist...</div>
          ) : (
            artistTracks.map((track, idx) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              const isLiked = likedTrackIds.includes(track.id);
              const isDownloaded = isTrackDownloaded(track.id);
              const isDownloading = downloadingTrackIds.includes(track.id);

              return (
                <div
                  key={track.id || idx}
                  onClick={() => playTrack(track, artistTracks)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isThisPlaying ? 'rgba(239, 35, 60, 0.08)' : 'var(--bg-card)',
                    border: '1px solid ' + (isThisPlaying ? 'var(--color-primary)' : 'var(--border-color)'),
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isThisPlaying ? 'var(--color-primary)' : 'var(--text-subtle)', width: '22px' }}>
                    {idx + 1}
                  </span>

                  <img
                    src={track.albumArt || artist.avatar || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'}
                    alt={track.title}
                    style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: isThisPlaying ? 'var(--color-primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {track.album || 'Single'}
                    </div>
                  </div>

                  {/* 1-Click Download Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      downloadTrack(track);
                    }}
                    disabled={isDownloading}
                    style={{ background: 'none', border: 'none', color: isDownloaded ? 'var(--color-primary)' : 'var(--text-subtle)', cursor: 'pointer' }}
                    title={isDownloaded ? 'Downloaded to Device' : 'Download Audio to Device'}
                  >
                    {isDownloading ? <Loader2 size={16} className="spin" /> : isDownloaded ? <Check size={16} /> : <Download size={16} />}
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleLikeTrack(track);
                    }}
                    style={{ background: 'none', border: 'none', color: isLiked ? 'var(--color-primary)' : 'var(--text-subtle)', cursor: 'pointer' }}
                  >
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '45px', textAlign: 'right' }}>
                    {formatDuration(track.duration || 210)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
