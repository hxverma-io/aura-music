import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from './auth.js';

export const socialRouter = express.Router();

// Author / Creator Spotlight endpoint
socialRouter.get('/creator', (req, res) => {
  const creatorUser = {
    id: 'user-creator',
    name: 'Himanshu Verma',
    username: 'hxverma.io',
    avatar: 'https://github.com/hxverma-io.png',
    bio: 'Creator & Lead Architect of Aura Music. Open source developer building next-gen high-fidelity audio systems.',
    role: 'Lead Architect & Creator',
    github: 'https://github.com/hxverma-io',
    instagram: 'https://www.instagram.com/hxverma.io/',
    favorite_genres: ['Rock', 'Synthwave', 'Indie', 'Punjabi', 'Pop']
  };

  const creatorPlaylists = [
    {
      id: 'pl-creator-master',
      user_id: 'user-creator',
      creatorName: 'Himanshu Verma (@hxverma.io)',
      title: '⚡ Himanshu Verma Master Favorites',
      description: 'The definitive 4-track master collection curated by Himanshu Verma featuring Mary On A Cross, I Wanna Be Yours, Die With A Smile, and Pal Pal Talwinder.',
      coverArt: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
      trackIds: [
        'track-mary-cross',
        'track-wanna-yours',
        'track-die-smile',
        'track-pal-pal-talwinder'
      ],
      tracks: [
        {
          id: 'track-mary-cross',
          title: 'Mary On A Cross',
          artist: 'Ghost',
          album: 'Seven Inches of Satanic Panic',
          albumArt: 'https://c.saavncdn.com/919/Radio-Rock-English-2026-20260623013559-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/919/23f01fb38930df9e3b70c16b1100460e_320.mp4',
          duration: 244,
          genre: 'Rock',
          mood: 'Energy',
          rating: 10.0,
          year: 2019
        },
        {
          id: 'track-wanna-yours',
          title: 'I Wanna Be Yours',
          artist: 'Arctic Monkeys',
          album: 'AM',
          albumArt: 'https://c.saavncdn.com/795/AM-English-2013-20240402165515-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/795/5d6a8d924e97dc6a66c0bea9cd9adbf9_320.mp4',
          duration: 183,
          genre: 'Rock',
          mood: 'Romantic',
          rating: 9.9,
          year: 2013
        },
        {
          id: 'track-die-smile',
          title: 'Die With A Smile',
          artist: 'Lady Gaga, Bruno Mars',
          album: 'Die With A Smile - Single',
          albumArt: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/060/05bb6ae7a01edcbd8e0d859d2fa1d83d_320.mp4',
          duration: 250,
          genre: 'Pop',
          mood: 'Romantic',
          rating: 10.0,
          year: 2024
        },
        {
          id: 'track-pal-pal-talwinder',
          title: 'Pal Pal X Talwinder',
          artist: 'Aditya Likhari, Talwiinder',
          album: 'Pal Pal X Talwinder',
          albumArt: 'https://c.saavncdn.com/045/Pal-Pal-X-Talwinder-Hindi-2025-20251126135201-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/045/261e28f498d65587a32d0a6bc9556b28_320.mp4',
          duration: 240,
          genre: 'Indie',
          mood: 'Chill',
          rating: 9.9,
          year: 2024
        }
      ],
      isPublic: true,
      isCollaborative: true,
      reactions: [
        { emoji: '🔥', count: 215 },
        { emoji: '❤️', count: 184 },
        { emoji: '⚡', count: 120 }
      ],
      isPinned: true,
      isAiGenerated: false,
      created_at: '2024-03-01'
    }
  ];

  return res.json({
    creator: creatorUser,
    playlists: creatorPlaylists
  });
});

// Clean Social Feed endpoint
socialRouter.get('/feed', optionalAuth, (req, res) => {
  return res.json({
    status: 'online',
    message: 'Social network connected.'
  });
});
