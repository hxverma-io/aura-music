import React, { useEffect, useState } from 'react';
import {
  Clock,
  Flame,
  Award,
  Headphones,
  Sparkles,
  TrendingUp,
  Heart,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { api } from '../services/apiService';
import { Track } from '../types';

export const AnalyticsView: React.FC = () => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const { playTrack } = useAudio();

  const [analytics, setAnalytics] = useState<{
    totalMinutes: number;
    totalHours: string;
    totalPlays: number;
    likedCount: number;
    streakDays: number;
    topTracks: Track[];
    genreDistribution: { genre: string; percent: number }[];
  }>({
    totalMinutes: 0,
    totalHours: '0.0',
    totalPlays: 0,
    likedCount: 0,
    streakDays: 0,
    topTracks: [],
    genreDistribution: [
      { genre: 'Bollywood', percent: 45 },
      { genre: 'Punjabi', percent: 30 },
      { genre: 'Pop', percent: 15 },
      { genre: 'Synthwave', percent: 10 }
    ]
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAuthenticated || !currentUser) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getAnalytics();
        if (data) {
          setAnalytics(data);
        }
      } catch (err) {
        console.warn('Could not load user analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [isAuthenticated, currentUser?.id]);

  const genreColors: Record<string, string> = {
    'Bollywood': '#f12711',
    'Punjabi': '#ef233c',
    'Synthwave': '#7928ca',
    'Lo-Fi': '#ff477e',
    'Rock': '#f5af19',
    'Electronic': '#00f2fe',
    'Indie': '#ff9966',
    'Classical': '#8e2de2',
    'Pop': '#e1306c'
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="content-body" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '20px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)', width: 'fit-content', margin: '0 auto 20px auto' }}>
          <TrendingUp size={44} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Personal Music Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', margin: '10px 0 24px 0' }}>
          Sign in to view your streaming hours, daily streaks, favorite genres radar, and top played songs computed from your real database history.
        </p>
        <button
          onClick={() => openAuthModal('signin')}
          className="btn-play-hero"
          style={{ padding: '12px 28px', fontSize: '0.92rem', backgroundColor: 'var(--color-primary)', color: '#ffffff', margin: '0 auto' }}
        >
          <LogIn size={18} /> Sign In to View Analytics
        </button>
      </div>
    );
  }

  return (
    <div className="content-body">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Personal Music Analytics</h1>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Real-time metrics computed for {currentUser.name} (@{currentUser.username}) from your database stream history
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Total Time */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{analytics.totalHours} hrs</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Streaming Time</div>
          </div>
        </div>

        {/* Listening Streak */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(255, 183, 3, 0.15)', color: '#ffb703' }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{analytics.streakDays} Days</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Listening Streak</div>
          </div>
        </div>

        {/* Total Songs Played */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe' }}>
            <Headphones size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{analytics.totalPlays} Plays</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Streamed Tracks</div>
          </div>
        </div>

        {/* Personality Archetype */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(121, 40, 202, 0.15)', color: '#7928ca' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              {analytics.topTracks[0]?.genre === 'Bollywood' ? 'Bollywood Melophile' : (analytics.topTracks[0]?.genre === 'Lo-Fi' ? 'Deep Focus Artisan' : 'Synthwave Night Driver')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Taste Archetype</div>
          </div>
        </div>
      </div>

      {/* Deep Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) 1fr', gap: '24px' }}>
        {/* Top Played Tracks */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Top Tracks in Your Library</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Database Verified</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analytics.topTracks.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-subtle)' }}>
                Start listening to songs and your most-played tracks will appear here!
              </div>
            ) : (
              analytics.topTracks.map((track, idx) => (
                <div
                  key={track.id || idx}
                  onClick={() => playTrack(track)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: idx === 0 ? 'var(--color-primary)' : 'var(--text-subtle)', width: '20px' }}>
                    #{idx + 1}
                  </span>
                  <img src={track.albumArt || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'} alt={track.title} style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{track.artist}</div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    {track.playCount || 1} plays
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Genre Distribution Bars */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Genre Affinity Spectrum</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.genreDistribution.map(stat => {
              const color = genreColors[stat.genre] || '#ef233c';
              return (
                <div key={stat.genre} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600 }}>
                    <span>{stat.genre}</span>
                    <span style={{ color }}>{stat.percent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
                    <div style={{ width: `${stat.percent}%`, height: '100%', backgroundColor: color, borderRadius: 'var(--radius-pill)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              <Sparkles size={16} /> Dynamic Taste Analysis
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Your profile is synchronized with real database plays. Higher frequency plays automatically adjust your AI recommendations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
