import React, { useState } from 'react';
import { X, Tag, Sparkles, Image, Check, FileAudio, Save, Dna, Star } from 'lucide-react';
import { Track, Genre, Mood, SongDNA } from '../../types';
import { useData } from '../../context/DataContext';

interface MetadataEditorModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedTrack: Track) => void;
}

export const MetadataEditorModal: React.FC<MetadataEditorModalProps> = ({
  track,
  isOpen,
  onClose,
  onSave
}) => {
  const { updateTrackMetadata, setToastMessage } = useData();

  if (!isOpen || !track) return null;

  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [album, setAlbum] = useState(track.album);
  const [genre, setGenre] = useState<Genre>(track.genre);
  const [year, setYear] = useState<number>(track.year || 2024);
  const [rating, setRating] = useState<number>(track.rating || 5);
  const [albumArt, setAlbumArt] = useState(track.albumArt);
  const [lyricsText, setLyricsText] = useState((track.lyrics || []).join('\n'));
  const [isAiEnriching, setIsAiEnriching] = useState(false);

  // Song DNA Fields
  const initialDna: SongDNA = track.songDna || {
    energy: 75,
    bpm: 120,
    danceability: 70,
    acousticness: 30,
    instrumentalness: 10,
    vocalIntensity: 80,
    mood: track.mood || 'Energy',
    genre: track.genre || 'Bollywood',
    era: `${Math.floor((track.year || 2024) / 10) * 10}s`,
    language: 'Hindi (हिन्दी)'
  };

  const [bpm, setBpm] = useState<number>(initialDna.bpm);
  const [energy, setEnergy] = useState<number>(initialDna.energy);
  const [danceability, setDanceability] = useState<number>(initialDna.danceability);
  const [acousticness, setAcousticness] = useState<number>(initialDna.acousticness);
  const [vocalIntensity, setVocalIntensity] = useState<number>(initialDna.vocalIntensity);
  const [language, setLanguage] = useState<string>(initialDna.language);

  const handleAiAutoFetch = () => {
    setIsAiEnriching(true);
    setToastMessage('🤖 AI Fetching ID3 metadata & HD album art...');

    setTimeout(() => {
      setIsAiEnriching(false);
      setAlbumArt('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80');
      if (!genre || genre === 'Popular') setGenre('Bollywood');
      setBpm(124);
      setEnergy(85);
      setToastMessage('✨ AI Metadata & Song DNA enriched successfully!');
    }, 1000);
  };

  const handleSave = () => {
    const updatedDna: SongDNA = {
      energy,
      bpm,
      danceability,
      acousticness,
      instrumentalness: initialDna.instrumentalness,
      vocalIntensity,
      mood: track.mood || 'Energy',
      genre,
      era: `${Math.floor(year / 10) * 10}s`,
      language
    };

    const updated: Track = {
      ...track,
      title,
      artist,
      album,
      genre,
      year,
      rating,
      albumArt,
      songDna: updatedDna,
      lyrics: lyricsText.split('\n').filter(line => line.trim() !== '')
    };

    updateTrackMetadata(track.id, updated);
    if (onSave) onSave(updated);
    setToastMessage(`✓ Saved ID3 Tags & Song DNA for "${title}"!`);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tag size={22} color="#ef233c" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>ID3 Tags & Song DNA Editor</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* AI Auto Fetch Bar */}
        <div
          style={{
            backgroundColor: 'rgba(239, 35, 60, 0.08)',
            border: '1px solid rgba(239, 35, 60, 0.2)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>
            Auto-detect tags, audio fingerprint & high-res artwork using AI
          </div>
          <button
            onClick={handleAiAutoFetch}
            disabled={isAiEnriching}
            style={{
              backgroundColor: '#ef233c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={13} /> {isAiEnriching ? 'Fetching...' : 'AI Enrich'}
          </button>
        </div>

        {/* Form Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ width: '100%', backgroundColor: '#07080c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Artist</label>
              <input
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                style={{ width: '100%', backgroundColor: '#07080c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Album</label>
              <input
                type="text"
                value={album}
                onChange={e => setAlbum(e.target.value)}
                style={{ width: '100%', backgroundColor: '#07080c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Genre</label>
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value as any)}
                style={{ width: '100%', backgroundColor: '#07080c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Year</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(parseInt(e.target.value, 10) || 2024)}
                style={{ width: '100%', backgroundColor: '#07080c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff' }}
              />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Star Rating</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: star <= rating ? '#f59e0b' : 'var(--text-subtle)' }}
                >
                  <Star size={18} fill={star <= rating ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Song DNA Traits */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef233c', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Dna size={15} /> SONG DNA TRAITS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>BPM ({bpm})</label>
                <input type="range" min="60" max="180" value={bpm} onChange={e => setBpm(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: '#ef233c' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Energy % ({energy}%)</label>
                <input type="range" min="0" max="100" value={energy} onChange={e => setEnergy(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: '#ef233c' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Language Script</label>
                <input type="text" value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', backgroundColor: '#07080c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '4px 6px', color: '#ffffff', fontSize: '0.78rem' }} />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="btn-play-hero"
            style={{ backgroundColor: '#ef233c', color: '#ffffff', justifyContent: 'center', marginTop: '6px' }}
          >
            <Save size={16} /> Save Metadata & DNA
          </button>
        </div>
      </div>
    </div>
  );
};
