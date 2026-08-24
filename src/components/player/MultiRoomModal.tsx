import React, { useState } from 'react';
import { X, Speaker, Wifi, Volume2, Plus, Sliders, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

export interface RoomDevice {
  id: string;
  name: string;
  type: 'Living Room' | 'Bedroom' | 'Studio' | 'Outdoor' | 'TV Hub';
  ipAddress: string;
  connected: boolean;
  volume: number;
  latencyMs: number;
  syncStatus: 'synced' | 'calibrating' | 'disconnected';
}

export const INITIAL_ROOMS: RoomDevice[] = [
  {
    id: 'room-1',
    name: 'Living Room Hi-Fi Amp',
    type: 'Living Room',
    ipAddress: '192.168.1.104',
    connected: true,
    volume: 85,
    latencyMs: 12,
    syncStatus: 'synced'
  },
  {
    id: 'room-2',
    name: 'Master Bedroom Studio Monitors',
    type: 'Bedroom',
    ipAddress: '192.168.1.112',
    connected: true,
    volume: 60,
    latencyMs: 18,
    syncStatus: 'synced'
  },
  {
    id: 'room-3',
    name: 'Patio Outdoor Speakers',
    type: 'Outdoor',
    ipAddress: '192.168.1.140',
    connected: false,
    volume: 40,
    latencyMs: 45,
    syncStatus: 'disconnected'
  }
];

export const MultiRoomModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [rooms, setRooms] = useState<RoomDevice[]>(INITIAL_ROOMS);
  const { setToastMessage } = useData();

  if (!isOpen) return null;

  const toggleConnect = (id: string) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === id) {
          const next = !r.connected;
          setToastMessage(next ? `Connected to ${r.name}` : `Disconnected from ${r.name}`);
          return {
            ...r,
            connected: next,
            syncStatus: next ? 'synced' : 'disconnected'
          };
        }
        return r;
      })
    );
  };

  const updateVolume = (id: string, vol: number) => {
    setRooms(prev => prev.map(r => (r.id === id ? { ...r, volume: vol } : r)));
  };

  const updateLatency = (id: string, ms: number) => {
    setRooms(prev => prev.map(r => (r.id === id ? { ...r, latencyMs: ms } : r)));
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div
        className="modal-container"
        style={{
          maxWidth: '680px',
          width: '90%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
              <Speaker size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Multi-Room Audio Distribution</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                AirPlay 2 & Chromecast zero-latency multi-device speaker sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Room List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {rooms.map(room => (
            <div
              key={room.id}
              style={{
                backgroundColor: 'var(--bg-card-hover)',
                border: '1px solid ' + (room.connected ? 'var(--color-primary)' : 'var(--border-color)'),
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Wifi size={20} color={room.connected ? '#10b981' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {room.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {room.type} • {room.ipAddress} • {room.latencyMs}ms delay
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {room.connected && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={12} /> SYNCED
                    </span>
                  )}
                  <button
                    onClick={() => toggleConnect(room.id)}
                    style={{
                      backgroundColor: room.connected ? 'var(--color-primary)' : 'var(--bg-main)',
                      color: room.connected ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid ' + (room.connected ? 'var(--color-primary)' : 'var(--border-color)'),
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {room.connected ? 'Enabled' : 'Connect'}
                  </button>
                </div>
              </div>

              {/* Volume & Latency Sliders */}
              {room.connected && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Room Volume</span>
                      <span>{room.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={room.volume}
                      onChange={e => updateVolume(room.id, Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Sync Latency Calibration</span>
                      <span>{room.latencyMs} ms</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={room.latencyMs}
                      onChange={e => updateLatency(room.id, Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#10b981" /> High-Resolution Lossless Audio Multi-Casting Enabled
          </span>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '8px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
