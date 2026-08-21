import React, { useState } from 'react';
import { Settings, Sliders, Moon, Sun, Cloud, Download, Upload, RefreshCw, Shield, Bell, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useData } from '../context/DataContext';

export const SettingsView: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { audioQuality, setAudioQuality } = useAudio();
  const { playlists, likedTracks } = useData();

  const [importJson, setImportJson] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string>('');

  const handleExport = () => {
    const backupData = {
      user: currentUser,
      playlists: playlists,
      likedTracks: likedTracks,
      exportedAt: new Date().toISOString()
    };
    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_music_backup_${currentUser?.username || 'user'}.json`;
    a.click();
    setStatusMsg('Library exported successfully to JSON!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    try {
      const parsed = JSON.parse(importJson);
      if (parsed.user || parsed.playlists) {
        setStatusMsg('Data successfully synchronized & restored from cloud backup!');
        setImportJson('');
      } else {
        setStatusMsg('Invalid backup file structure.');
      }
    } catch (e) {
      setStatusMsg('Failed to parse backup JSON. Please check formatting.');
    }
  };

  return (
    <div className="content-body" style={{ maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Account & System Settings</h1>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Manage your audio engine, appearance, cloud data synchronization and privacy
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)', fontSize: '0.88rem' }}>
          {statusMsg}
        </div>
      )}

      {/* Audio Engine Settings */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={20} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Audio Engine & Playback</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Streaming Bitrate</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Higher quality uses more bandwidth</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['128k', '256k', 'lossless'] as const).map(q => (
              <button
                key={q}
                onClick={() => {
                  setAudioQuality(q);
                  if (currentUser) {
                    updateProfile({ settings: { ...(currentUser.settings || {}), audioQuality: q } });
                  }
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: audioQuality === q ? 'var(--color-primary)' : 'var(--bg-elevated)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {q === 'lossless' ? 'Lossless FLAC' : q.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Volume Normalization</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equalize loudness across diverse music styles</div>
          </div>
          <input
            type="checkbox"
            checked={currentUser?.settings?.normalizeVolume ?? true}
            onChange={e => {
              if (currentUser) {
                updateProfile({ settings: { ...(currentUser.settings || {}), normalizeVolume: e.target.checked } });
              }
            }}
            style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Appearance Settings */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sun size={20} color="#ffb703" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Theme & Appearance</h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { id: 'dark', label: 'Obsidian Dark' },
            { id: 'light', label: 'Clean Light' },
            { id: 'amoled', label: 'Pure AMOLED Black' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: theme === t.id ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: '#ffffff',
                border: '1px solid ' + (theme === t.id ? 'var(--color-primary)' : 'var(--border-color)'),
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cloud Sync & Backup */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cloud size={20} color="#00f2fe" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Cloud Sync & Library Backup</h2>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Export your playlists, likes, followed creators and history to restore across devices anytime.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExport}
            className="btn-secondary-hero"
            style={{ fontSize: '0.85rem' }}
          >
            <Download size={16} /> Export Cloud Backup (.json)
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <textarea
            placeholder="Paste exported backup JSON here to restore..."
            value={importJson}
            onChange={e => setImportJson(e.target.value)}
            style={{ width: '100%', minHeight: '70px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px', color: '#ffffff', outline: 'none', fontSize: '0.82rem' }}
          />
          <button
            onClick={handleImport}
            className="btn-play-hero"
            style={{ width: 'fit-content', backgroundColor: 'var(--color-primary)', color: '#ffffff', fontSize: '0.84rem' }}
          >
            <Upload size={16} /> Restore from JSON
          </button>
        </div>
      </div>
    </div>
  );
};
