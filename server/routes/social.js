import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from './auth.js';

export const socialRouter = express.Router();

// Author / Creator Spotlight endpoint
socialRouter.get('/creator', (req, res) => {
  const creatorUser = {
    id: 'user-creator',
    name: 'HV',
    username: 'hxverma.io',
    avatar: 'https://github.com/hxverma-io.png',
    bio: 'Creator & Lead Architect of Aura Music. Open source developer building next-gen high-fidelity audio systems.',
    role: 'Lead Architect & Creator',
    github: 'https://github.com/hxverma-io',
    instagram: 'https://www.instagram.com/hxverma.io/',
    favorite_genres: ['Rock', 'Synthwave', 'Indie', 'Punjabi', 'Bollywood']
  };

  const creatorPlaylists = [
    {
      id: 'pl-creator-master',
      user_id: 'user-creator',
      creatorName: 'HV (@hxverma.io)',
      title: '⚡ HV Master Favorites: Mary On A Cross, Die With A Smile & Talwinder',
      description: 'The definitive master collection curated by HV featuring Mary on a Cross, I Wanna Be Yours, Die With A Smile, and Pal Pal Talwinder.',
      coverArt: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
      trackIds: [
        'track-mary-cross',
        'track-wanna-yours',
        'track-die-smile',
        'track-pal-pal-talwinder',
        'track-rjkrTnma',
        'track-ap-excuses',
        'track-weeknd-starboy'
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
        },
        {
          id: 'track-rjkrTnma',
          title: 'Kesariya',
          artist: 'Pritam, Arijit Singh, Amitabh Bhattacharya',
          album: 'Brahmastra',
          albumArt: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
          duration: 268,
          genre: 'Bollywood',
          mood: 'Romantic',
          rating: 9.9,
          year: 2022
        },
        {
          id: 'track-ap-excuses',
          title: 'Excuses',
          artist: 'AP Dhillon, Gurinder Gill, Intense',
          album: 'Excuses - Single',
          albumArt: 'https://c.saavncdn.com/890/Excuses-English-2021-20210930112054-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/890/a18aabc4681dc6c334d5d29b67e84a0f_320.mp4',
          duration: 177,
          genre: 'Punjabi',
          mood: 'Energy',
          rating: 9.8,
          year: 2021
        },
        {
          id: 'track-weeknd-starboy',
          title: 'Starboy',
          artist: 'The Weeknd, Daft Punk',
          album: 'Starboy',
          albumArt: 'https://c.saavncdn.com/372/Starboy-English-2016-500x500.jpg',
          audioUrl: 'https://aac.saavncdn.com/396/b4e570050007b056c662f2a98c9f28ec_320.mp4',
          duration: 230,
          genre: 'Synthwave',
          mood: 'Energy',
          rating: 9.9,
          year: 2016
        }
      ],
      isPublic: true,
      isCollaborative: true,
      reactions: [
        { emoji: '🔥', count: 185 },
        { emoji: '❤️', count: 142 },
        { emoji: '⚡', count: 96 }
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
