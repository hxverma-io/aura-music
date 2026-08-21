import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Play,
  Check,
  Plus,
  Heart,
  Download,
  Music,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { api } from '../services/apiService';
import { ChatMessage, Track } from '../types';

export const AIChatView: React.FC = () => {
  const {
    createPlaylist,
    setSelectedPlaylist,
    setActiveTab,
    toggleLikeTrack,
    likedTrackIds,
    downloadTrack,
    openAddToPlaylistModal
  } = useData();
  const { currentUser } = useAuth();
  const { currentTrack, playTrack } = useAudio();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello **${currentUser?.name || 'HV'}**! 👋\n\nI am your dedicated **Aura AI Music & Lyrics Intelligence Assistant**.\n\n✨ **What I can do for you:**\n• 🔍 **Lyrics-to-Song Finder**: Type any lyrics line (e.g. *"I wanna be your vacuum cleaner"*, *"Mary on a cross"*, *"Pal pal jina muhal"*), and I will instantly find and stream the exact full-length track!\n• ⚡ **AI Playlist Synthesizer**: Type *"Create a 1hr workout synthwave playlist"*, and I will compile real 320kbps songs.\n• 🎧 **Smart Recommendations**: Ask for Hindi, Punjabi, or global mood mixes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      if (textToSend.toLowerCase().includes('playlist') || textToSend.toLowerCase().includes('banao')) {
        const res = await api.generateAiPlaylist(textToSend);
        const aiReply: ChatMessage = {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: `✨ I compiled a personalized full 320kbps playlist for: **"${textToSend}"**!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedTracks: res.tracks || [],
          generatedPlaylist: res.playlist,
          suggestedAction: {
            label: 'Save Playlist to Library',
            actionType: 'create_playlist',
            payload: res.playlist
          }
        };
        setMessages(prev => [...prev, aiReply]);
      } else {
        // AI Music discovery & lyrics search
        const res = await api.getAiRecommendations(textToSend);
        const aiReply: ChatMessage = {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: res.explanation || `Found matching full-length tracks for **"${textToSend}"**:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedTracks: res.tracks?.slice(0, 5) || [],
          suggestedAction: res.tracks?.[0] ? {
            label: `Play "${res.tracks[0].title}" Now (320kbps)`,
            actionType: 'play_track',
            payload: res.tracks[0]
          } : undefined
        };
        setMessages(prev => [...prev, aiReply]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'ai',
          text: `I had trouble connecting to the discovery catalog. Please try another lyrics or search query.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    '🔍 Lyrics: Mary on a cross',
    '🔍 Lyrics: I wanna be your vacuum cleaner',
    '🔍 Lyrics: If the world was ending I\'d wanna be next to you',
    '🔍 Lyrics: Pal pal jeena mahal talwinder',
    '🔍 Lyrics: Kehndi hundi si chan tak raah bana de',
    '⚡ Create workout playlist',
    '🇮🇳 Best Hindi romantic acoustic songs'
  ];

  return (
    <div className="ai-view-container">
      <div className="ai-chat-card">
        {/* Header */}
        <div className="ai-chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)' }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Aura AI Music & Lyrics Finder</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'rgba(239, 35, 60, 0.2)', color: 'var(--color-primary)', fontWeight: 700 }}>
                  320 KBPS ACTIVE
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Type song lyrics or moods • Identifies songs, generates playlists & streams full audio
              </div>
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
            title="Clear Chat"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>

        {/* Messages Stream */}
        <div className="ai-chat-messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{msg.text}</div>

              {/* Related Tracks embedded interactive cards */}
              {msg.relatedTracks && msg.relatedTracks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {msg.relatedTracks.map(t => {
                    const isLiked = likedTrackIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(0, 0, 0, 0.45)',
                          border: '1px solid var(--border-color)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img
                          src={t.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                          alt={t.title}
                          style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.title}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.artist}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => openAddToPlaylistModal(t)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                            title="Add to Playlist"
                          >
                            <Plus size={16} />
                          </button>

                          <button
                            onClick={() => downloadTrack(t)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                            title="Download full song"
                          >
                            <Download size={16} />
                          </button>

                          <button
                            onClick={() => toggleLikeTrack(t)}
                            style={{ background: 'none', border: 'none', color: isLiked ? 'var(--color-primary)' : 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                            title="Like track"
                          >
                            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                          </button>

                          <button
                            className="continue-play-btn"
                            onClick={() => playTrack(t, msg.relatedTracks)}
                            style={{ color: 'var(--color-primary)', marginLeft: '4px' }}
                            title="Play track"
                          >
                            <Play size={16} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action button */}
              {msg.suggestedAction && (
                <div style={{ marginTop: '4px' }}>
                  <button
                    onClick={async () => {
                      if (msg.suggestedAction?.actionType === 'create_playlist' && msg.generatedPlaylist) {
                        const saved = await createPlaylist(msg.generatedPlaylist);
                        setSelectedPlaylist(saved);
                        setActiveTab('playlists');
                      } else if (msg.suggestedAction?.actionType === 'play_track' && msg.suggestedAction.payload) {
                        playTrack(msg.suggestedAction.payload);
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Check size={16} /> {msg.suggestedAction.label}
                  </button>
                </div>
              )}

              <span style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-subtle)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <Sparkles size={16} className="spin" color="var(--color-primary)" />
              <span>Aura AI is analyzing lyrics & searching high-fidelity catalog...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="ai-quick-prompts">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="ai-chat-input-bar">
          <input
            type="text"
            className="search-input"
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 20px',
              fontSize: '0.92rem'
            }}
            placeholder="Type lyrics (e.g. 'I wanna be your vacuum cleaner', 'Mary on a cross') or any song mood..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            className="btn-play-hero"
            style={{ padding: '12px 22px', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
