import express from 'express';
import CryptoJS from 'crypto-js';

export const musicRouter = express.Router();

const DES_KEY = CryptoJS.enc.Utf8.parse('38346591');

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

function decryptMediaUrl(encrypted) {
  try {
    if (!encrypted) return null;
    const decrypted = CryptoJS.DES.decrypt(encrypted, DES_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const url = decrypted.toString(CryptoJS.enc.Utf8);
    if (!url) return null;
    return url.replace(/_96\.mp4/, '_320.mp4').replace(/_160\.mp4/, '_320.mp4');
  } catch (e) {
    return null;
  }
}

// Search Full-Length 320kbps Music Catalog with 500x500 Album Art
async function searchMusicCatalog(query, limit = 25) {
  try {
    const cleanQuery = encodeURIComponent(query.trim());
    const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&cc=in&includeMetaTags=1&p=1&n=${limit}&q=${cleanQuery}`;
    
    const resp = await fetch(saavnUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const data = await resp.json();

    if (data.results && data.results.length > 0) {
      const parsedTracks = [];

      for (const item of data.results) {
        const fullStreamUrl = decryptMediaUrl(item.encrypted_media_url || item.encrypted_drm_media_url);
        
        let rawArt = item.image || '';
        rawArt = rawArt.replace(/150x150\.jpg/, '500x500.jpg').replace(/50x50\.jpg/, '500x500.jpg');
        if (!rawArt || rawArt.includes('default') || !rawArt.startsWith('http')) {
          rawArt = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
        }

        const title = decodeHtmlEntities(item.song || item.title || 'Unknown Title');
        const artist = decodeHtmlEntities(item.primary_artists || item.singers || item.music || 'Popular Artist');
        const album = decodeHtmlEntities(item.album || 'Official Single');
        const durationSeconds = parseInt(item.duration) || 210;
        const genre = mapGenre(item.language, title);
        const mood = inferMood(title, genre);

        if (fullStreamUrl) {
          parsedTracks.push({
            id: 'track-' + item.id,
            title: title,
            artist: artist,
            artistId: 'art-' + (item.primary_artists_id?.split(',')[0]?.trim() || item.id),
            album: album,
            albumArt: rawArt,
            audioUrl: fullStreamUrl,
            duration: durationSeconds,
            genre: genre,
            mood: mood,
            year: item.year ? parseInt(item.year) : 2024,
            playCount: parseInt(item.play_count) || Math.floor(Math.random() * 5000000) + 1500000,
            likesCount: Math.floor(Math.random() * 400000) + 75000,
            rating: 9.9,
            description: `${title} by ${artist} from ${album}. Full 320kbps audio track.`
          });
        }
      }

      if (parsedTracks.length > 0) {
        return parsedTracks;
      }
    }
  } catch (err) {
    console.error('Saavn catalog search error:', err);
  }

  return INITIAL_FEATURED_TRACKS;
}

function mapGenre(rawLangOrGenre, trackName) {
  const g = (rawLangOrGenre || '').toLowerCase();
  const t = (trackName || '').toLowerCase();

  if (g.includes('hindi') || g.includes('bollywood') || t.includes('arijit') || t.includes('pritam') || t.includes('kesariya') || t.includes('shreya')) return 'Bollywood';
  if (g.includes('punjabi') || t.includes('dhillon') || t.includes('diljit') || t.includes('talwinder') || t.includes('aujla') || t.includes('excuses')) return 'Punjabi';
  if (g.includes('rock') || g.includes('metal') || t.includes('ghost') || t.includes('arctic')) return 'Rock';
  if (g.includes('dance') || g.includes('electronic') || g.includes('edm') || g.includes('house')) return 'Electronic';
  if (g.includes('hip-hop') || g.includes('rap') || g.includes('hip hop')) return 'Hip-Hop';
  if (g.includes('soundtrack') || g.includes('classical') || t.includes('zimmer')) return 'Classical';
  if (g.includes('lofi') || g.includes('lo-fi') || g.includes('chill') || t.includes('husn')) return 'Lo-Fi';
  if (g.includes('indie') || t.includes('anuv') || t.includes('pal pal')) return 'Indie';
  if (g.includes('r&b') || g.includes('soul')) return 'R&B';
  if (t.includes('synth') || t.includes('retro') || t.includes('80s')) return 'Synthwave';
  return 'Pop';
}

function inferMood(title, genre) {
  const t = (title || '').toLowerCase();
  if (t.includes('love') || t.includes('kesariya') || t.includes('ranjha') || t.includes('wanna be') || t.includes('smile') || t.includes('pal pal')) return 'Romantic';
  if (t.includes('chill') || t.includes('relax') || t.includes('sleep') || t.includes('peace') || genre === 'Lo-Fi' || t.includes('baarishein')) return 'Chill';
  if (t.includes('workout') || t.includes('gym') || t.includes('run') || t.includes('excuses') || t.includes('cross') || t.includes('tauba')) return 'Workout';
  if (t.includes('party') || t.includes('dance') || t.includes('club') || t.includes('starboy') || genre === 'Electronic') return 'Party';
  if (t.includes('focus') || t.includes('study') || t.includes('code') || genre === 'Classical' || t.includes('time')) return 'Focus';
  return 'Energy';
}

// Pre-seeded rich Hindi + English curated featured tracks (Full Length 320kbps)
const INITIAL_FEATURED_TRACKS = [
  {
    id: 'track-mary-cross',
    title: 'Mary On A Cross',
    artist: 'Ghost',
    artistId: 'art-ghost',
    album: 'Seven Inches of Satanic Panic',
    albumArt: 'https://c.saavncdn.com/919/Radio-Rock-English-2026-20260623013559-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/919/23f01fb38930df9e3b70c16b1100460e_320.mp4',
    duration: 244,
    genre: 'Rock',
    mood: 'Energy',
    year: 2019,
    playCount: 420000000,
    likesCount: 19500000,
    rating: 10.0,
    description: 'Iconic global rock anthem Mary On A Cross by Ghost in full length 320kbps.'
  },
  {
    id: 'track-wanna-yours',
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    artistId: 'art-arctic',
    album: 'AM',
    albumArt: 'https://c.saavncdn.com/795/AM-English-2013-20240402165515-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/795/5d6a8d924e97dc6a66c0bea9cd9adbf9_320.mp4',
    duration: 183,
    genre: 'Rock',
    mood: 'Romantic',
    year: 2013,
    playCount: 510000000,
    likesCount: 22000000,
    rating: 9.9,
    description: 'Sultry indie rock romance masterpiece by Arctic Monkeys.'
  },
  {
    id: 'track-die-smile',
    title: 'Die With A Smile',
    artist: 'Lady Gaga, Bruno Mars',
    artistId: 'art-gaga',
    album: 'Die With A Smile - Single',
    albumArt: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/060/05bb6ae7a01edcbd8e0d859d2fa1d83d_320.mp4',
    duration: 250,
    genre: 'Pop',
    mood: 'Romantic',
    year: 2024,
    playCount: 380000000,
    likesCount: 16500000,
    rating: 10.0,
    description: 'Sensational powerhouse duet by Lady Gaga & Bruno Mars.'
  },
  {
    id: 'track-pal-pal-talwinder',
    title: 'Pal Pal X Talwinder',
    artist: 'Aditya Likhari, Talwiinder',
    artistId: 'art-talwinder',
    album: 'Pal Pal X Talwinder',
    albumArt: 'https://c.saavncdn.com/045/Pal-Pal-X-Talwinder-Hindi-2025-20251126135201-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/045/261e28f498d65587a32d0a6bc9556b28_320.mp4',
    duration: 240,
    genre: 'Indie',
    mood: 'Chill',
    year: 2024,
    playCount: 65000000,
    likesCount: 3200000,
    rating: 9.9,
    description: 'Deep soulful indie acoustic collaboration featuring Talwinder.'
  },
  {
    id: 'track-rjkrTnma',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh, Amitabh Bhattacharya',
    artistId: 'art-456323',
    album: 'Brahmastra',
    albumArt: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    duration: 268,
    genre: 'Bollywood',
    mood: 'Romantic',
    year: 2022,
    playCount: 212565219,
    likesCount: 8900000,
    rating: 9.9,
    description: 'Full 320kbps original soundtrack of Kesariya from Brahmastra.'
  },
  {
    id: 'track-ap-excuses',
    title: 'Excuses',
    artist: 'AP Dhillon, Gurinder Gill, Intense',
    artistId: 'art-1490212351',
    album: 'Excuses - Single',
    albumArt: 'https://c.saavncdn.com/890/Excuses-English-2021-20210930112054-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/890/a18aabc4681dc6c334d5d29b67e84a0f_320.mp4',
    duration: 177,
    genre: 'Punjabi',
    mood: 'Energy',
    year: 2021,
    playCount: 94200000,
    likesCount: 4650000,
    rating: 9.8,
    description: 'Full length 320kbps Punjabi hit by AP Dhillon & Gurinder Gill.'
  },
  {
    id: 'track-diljit-hass',
    title: 'Hass Hass',
    artist: 'Diljit Dosanjh, Sia, Greg Kurstin',
    artistId: 'art-diljit',
    album: 'Hass Hass - Single',
    albumArt: 'https://c.saavncdn.com/245/Hass-Hass-English-2023-20231026170517-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/245/fd196de0f557e19e2e8d42150d34cf5b_320.mp4',
    duration: 153,
    genre: 'Punjabi',
    mood: 'Party',
    year: 2023,
    playCount: 78000000,
    likesCount: 3900000,
    rating: 9.9,
    description: 'Global collaboration between Diljit Dosanjh and Sia in full 320kbps.'
  },
  {
    id: 'track-weeknd-starboy',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    artistId: 'art-weeknd',
    album: 'Starboy',
    albumArt: 'https://c.saavncdn.com/372/Starboy-English-2016-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/396/b4e570050007b056c662f2a98c9f28ec_320.mp4',
    duration: 230,
    genre: 'Synthwave',
    mood: 'Energy',
    year: 2016,
    playCount: 310000000,
    likesCount: 18000000,
    rating: 9.9,
    description: 'Legendary synthwave pop anthem by The Weeknd in full length.'
  },
  {
    id: 'track-aujla-tauba',
    title: 'Tauba Tauba',
    artist: 'Karan Aujla',
    artistId: 'art-aujla',
    album: 'Bad Newz',
    albumArt: 'https://c.saavncdn.com/992/Bad-Newz-Hindi-2024-20250730113701-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/992/5d44da8bc1d78fb72d18b701d758fd1f_320.mp4',
    duration: 207,
    genre: 'Punjabi',
    mood: 'Party',
    year: 2024,
    playCount: 195000000,
    likesCount: 9200000,
    rating: 9.9,
    description: 'Viral global Punjabi groove by Karan Aujla.'
  },
  {
    id: 'track-coldplay-yellow',
    title: 'Yellow',
    artist: 'Coldplay',
    artistId: 'art-coldplay',
    album: 'Parachutes',
    albumArt: 'https://c.saavncdn.com/254/Parachutes-English-2000-20240529104717-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/254/6ebc38a6a7ea892f3a27cd66c71529d6_320.mp4',
    duration: 266,
    genre: 'Rock',
    mood: 'Romantic',
    year: 2000,
    playCount: 410000000,
    likesCount: 17800000,
    rating: 9.9,
    description: 'Timeless melodic stadium acoustic rock by Coldplay.'
  },
  {
    id: 'track-anuv-baarishein',
    title: 'Baarishein',
    artist: 'Anuv Jain',
    artistId: 'art-1438992019',
    album: 'Baarishein - Single',
    albumArt: 'https://c.saavncdn.com/829/Best-Hindi-Love-Songs-Hindi-2026-20260709220107-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/829/9c52bd442c012df0a98b904e3d6ed2b7_320.mp4',
    duration: 207,
    genre: 'Indie',
    mood: 'Chill',
    year: 2018,
    playCount: 180000000,
    likesCount: 8400000,
    rating: 9.9,
    description: 'Emotional acoustic guitar ballad by Anuv Jain.'
  },
  {
    id: 'track-zimmer-time',
    title: 'Time (From "Inception")',
    artist: 'Hans Zimmer',
    artistId: 'art-zimmer',
    album: 'Inception',
    albumArt: 'https://c.saavncdn.com/008/Inception-English-2010-20260708013524-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/008/bf7847454d3c9807e509aea0099ec4e6_320.mp4',
    duration: 275,
    genre: 'Classical',
    mood: 'Focus',
    year: 2010,
    playCount: 220000000,
    likesCount: 11500000,
    rating: 10.0,
    description: 'Majestic orchestral masterpiece by Hans Zimmer.'
  }
];

// Rich Verified Artists Catalog
export const ARTISTS_CATALOG = [
  {
    id: 'art-ghost',
    name: 'Ghost',
    avatar: 'https://c.saavncdn.com/919/Radio-Rock-English-2026-20260623013559-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Swedish theatrical heavy metal and occult rock band fronted by Papa Emeritus, renowned for Mary On A Cross, Square Hammer and arena anthems.',
    genres: ['Rock', 'Metal', 'Heavy Metal'],
    monthlyListeners: 24500000,
    topTrackIds: ['track-mary-cross']
  },
  {
    id: 'art-arctic',
    name: 'Arctic Monkeys',
    avatar: 'https://c.saavncdn.com/795/AM-English-2013-20240402165515-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=80',
    bio: 'English rock band formed in Sheffield, known for Alex Turner’s poetic songwriting, seductive guitar riffs, and modern rock classics like I Wanna Be Yours and 505.',
    genres: ['Rock', 'Indie Rock', 'Alternative'],
    monthlyListeners: 48900000,
    topTrackIds: ['track-wanna-yours']
  },
  {
    id: 'art-talwinder',
    name: 'Talwiinder',
    avatar: 'https://c.saavncdn.com/045/Pal-Pal-X-Talwinder-Hindi-2025-20251126135201-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80',
    bio: 'Pioneering Punjabi and indie alternative singer known for deep emotive storytelling, electronic synths, and haunting acoustic vocals on Pal Pal, Dhundhala, and Gallan 4.',
    genres: ['Indie', 'Punjabi', 'Alternative'],
    monthlyListeners: 8900000,
    topTrackIds: ['track-pal-pal-talwinder']
  },
  {
    id: 'art-gaga',
    name: 'Lady Gaga',
    avatar: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Global musical powerhouse, songwriter and cultural icon known for boundary-pushing pop anthems, emotional ballads, and Die With A Smile.',
    genres: ['Pop', 'Electronic', 'Rock'],
    monthlyListeners: 92000000,
    topTrackIds: ['track-die-smile']
  },
  {
    id: 'art-456323',
    name: 'Arijit Singh',
    avatar: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'India’s leading playback singer and music producer, renowned for legendary soul-stirring ballads and versatile Bollywood masterpieces.',
    genres: ['Bollywood', 'Indie', 'Acoustic'],
    monthlyListeners: 48500000,
    topTrackIds: ['track-rjkrTnma']
  },
  {
    id: 'art-diljit',
    name: 'Diljit Dosanjh',
    avatar: 'https://c.saavncdn.com/245/Hass-Hass-English-2023-20231026170517-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Global Punjabi music superstar bringing authentic Punjabi folk, hip-hop, and world music to international stages.',
    genres: ['Punjabi', 'Pop', 'Hip-Hop'],
    monthlyListeners: 28500000,
    topTrackIds: ['track-diljit-hass']
  },
  {
    id: 'art-1490212351',
    name: 'AP Dhillon',
    avatar: 'https://c.saavncdn.com/890/Excuses-English-2021-20210930112054-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=80',
    bio: 'Indo-Canadian singer and producer redefining the global sound of modern Punjabi music with trap and R&B elements.',
    genres: ['Punjabi', 'Hip-Hop', 'R&B'],
    monthlyListeners: 18200000,
    topTrackIds: ['track-ap-excuses']
  },
  {
    id: 'art-weeknd',
    name: 'The Weeknd',
    avatar: 'https://c.saavncdn.com/372/Starboy-English-2016-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Canadian singer, songwriter, and producer known for his sonic versatility, dark lyricism, and global synth-pop anthems.',
    genres: ['R&B', 'Synthwave', 'Pop'],
    monthlyListeners: 108000000,
    topTrackIds: ['track-weeknd-starboy']
  },
  {
    id: 'art-aujla',
    name: 'Karan Aujla',
    avatar: 'https://c.saavncdn.com/992/Bad-Newz-Hindi-2024-20250730113701-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Chart-topping Punjabi singer and lyricist known for hard-hitting rhymes, Making Memories, and global sensation Tauba Tauba.',
    genres: ['Punjabi', 'Hip-Hop', 'Pop'],
    monthlyListeners: 22400000,
    topTrackIds: ['track-aujla-tauba']
  },
  {
    id: 'art-coldplay',
    name: 'Coldplay',
    avatar: 'https://c.saavncdn.com/254/Parachutes-English-2000-20240529104717-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    bio: 'British rock band celebrated for massive stadium anthems, melodic piano hooks, and emotional resonance.',
    genres: ['Rock', 'Pop', 'Indie'],
    monthlyListeners: 79000000,
    topTrackIds: ['track-coldplay-yellow']
  },
  {
    id: 'art-1438992019',
    name: 'Anuv Jain',
    avatar: 'https://c.saavncdn.com/829/Best-Hindi-Love-Songs-Hindi-2026-20260709220107-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80',
    bio: 'Indian singer-songwriter known for deeply personal acoustic storytelling, relatable poetry, and soulful melodies.',
    genres: ['Indie', 'Acoustic', 'Bollywood'],
    monthlyListeners: 12500000,
    topTrackIds: ['track-anuv-baarishein']
  },
  {
    id: 'art-zimmer',
    name: 'Hans Zimmer',
    avatar: 'https://c.saavncdn.com/008/Inception-English-2010-20260708013524-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Two-time Academy Award-winning German film score composer renowned for Interstellar, Inception, The Dark Knight, and Dune.',
    genres: ['Classical', 'Cinematic', 'Soundtrack'],
    monthlyListeners: 16800000,
    topTrackIds: ['track-zimmer-time']
  }
];

// Get Featured / Trending Tracks (Hindi + English)
musicRouter.get('/trending', async (req, res) => {
  try {
    return res.json({ tracks: INITIAL_FEATURED_TRACKS });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trending music.' });
  }
});

// Search Real Live Music Catalog
musicRouter.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      return res.json({ tracks: INITIAL_FEATURED_TRACKS });
    }

    const results = await searchMusicCatalog(q, 25);
    if (results.length > 0) {
      return res.json({ tracks: results });
    }

    const lower = q.toLowerCase();
    const fallback = INITIAL_FEATURED_TRACKS.filter(
      t => t.title.toLowerCase().includes(lower) || t.artist.toLowerCase().includes(lower) || t.genre.toLowerCase().includes(lower)
    );
    return res.json({ tracks: fallback.length > 0 ? fallback : INITIAL_FEATURED_TRACKS });
  } catch (error) {
    console.error('Music search error:', error);
    return res.status(500).json({ error: 'Failed to search music catalog.' });
  }
});

// Direct Audio Download Endpoint (Full 320kbps MP4/MP3)
musicRouter.get('/download/:id', async (req, res) => {
  try {
    const trackId = req.params.id;
    let targetUrl = req.query.url;
    let title = req.query.title || 'Track';
    let artist = req.query.artist || 'Aura Music';

    if (!targetUrl) {
      const found = INITIAL_FEATURED_TRACKS.find(t => t.id === trackId);
      if (found) {
        targetUrl = found.audioUrl;
        title = found.title;
        artist = found.artist;
      }
    }

    if (!targetUrl) {
      return res.status(404).json({ error: 'Audio stream source not found for download.' });
    }

    const audioResp = await fetch(targetUrl);
    if (!audioResp.ok) {
      return res.status(502).json({ error: 'Failed to fetch upstream audio stream.' });
    }

    const safeFilename = `${title} - ${artist}`.replace(/[/\\?%*:|"<>]/g, '_').trim() + '.m4a';

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}"`);
    res.setHeader('Content-Type', 'audio/mp4');

    const arrayBuffer = await audioResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (error) {
    console.error('Download stream error:', error);
    return res.status(500).json({ error: 'Download failed.' });
  }
});

// Audio Stream Proxy for CORS-free in-browser audio caching & Web Audio DSP
musicRouter.get('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: 'url parameter required' });
    }
    const audioResp = await fetch(targetUrl);
    if (!audioResp.ok) {
      return res.status(audioResp.status).send('Failed to fetch audio source');
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', audioResp.headers.get('content-type') || 'audio/mp4');
    const arrayBuffer = await audioResp.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error' });
  }
});

// Get Artist Profile Details & Discography
musicRouter.get('/artist/:id', async (req, res) => {
  try {
    const artistId = req.params.id;
    let artist = ARTISTS_CATALOG.find(a => a.id === artistId || a.name.toLowerCase().replace(/\s+/g, '') === artistId.toLowerCase());

    const cleanName = artist ? artist.name : artistId.replace('art-', '').replace(/-/g, ' ');
    if (!artist) {
      artist = {
        id: artistId,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        bio: `${cleanName} is an active music artist streamed globally on Aura Platform.`,
        genres: ['Pop', 'Electronic'],
        monthlyListeners: 2400000,
        topTrackIds: []
      };
    }

    const liveTracks = await searchMusicCatalog(artist.name, 18);

    return res.json({
      artist,
      tracks: liveTracks.length > 0 ? liveTracks : INITIAL_FEATURED_TRACKS.filter(t => t.artist.toLowerCase().includes(artist.name.toLowerCase()))
    });
  } catch (error) {
    console.error('Artist endpoint error:', error);
    return res.status(500).json({ error: 'Failed to fetch artist details.' });
  }
});

export { searchMusicCatalog };
