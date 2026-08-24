import { Track, Artist, Album, Playlist, User, FriendActivity, NotificationItem } from '../types';

export const INITIAL_TRACKS: Track[] = [
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
    description: 'Iconic global rock anthem Mary On A Cross by Ghost in full length 320kbps.',
    lyrics: [
      "[00:15] You go down just like Holy Mary",
      "[00:30] Mary on a, Mary on a cross",
      "[00:45] Not just another bloody Mary",
      "[01:02] Mary on a, Mary on a cross",
      "[01:20] If you choose to run with me",
      "[01:38] I will tickle you for internally",
      "[01:56] And I see nothing wrong with that"
    ]
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
    description: 'Sultry indie rock romance masterpiece by Arctic Monkeys.',
    lyrics: [
      "[00:10] I wanna be your vacuum cleaner",
      "[00:22] Breathing in your dust",
      "[00:36] I wanna be your Ford Cortina",
      "[00:48] I will never rust",
      "[01:05] If you like your coffee hot",
      "[01:18] Let me be your coffee pot",
      "[01:32] You call the shots babe",
      "[01:45] I just wanna be yours"
    ]
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
    description: 'Sensational powerhouse duet by Lady Gaga & Bruno Mars.',
    lyrics: [
      "[00:14] Ooh, lost in the rhythm",
      "[00:30] If the world was ending, I'd wanna be next to you",
      "[00:52] If the party was over and our time on Earth was through",
      "[01:14] I'd wanna hold you just for a while",
      "[01:35] And die with a smile"
    ]
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
    description: 'Deep soulful indie acoustic collaboration featuring Talwinder.',
    lyrics: [
      "[00:15] Pal pal jeena mahal lage tere bin",
      "[00:34] Akhiyan ch hanju rukde nahi ik pal vi",
      "[00:58] Tu jo mili saanu zindagani mil gayi",
      "[01:25] Tere bina saari khushiyan ve khaali si"
    ]
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
    description: 'Full length 320kbps original soundtrack of Kesariya from Brahmastra.',
    lyrics: [
      "[00:10] Mujhko itna bataye koi",
      "[00:25] Kaise tujhse dil na lagaye koi",
      "[00:48] Rabba ne tujhko banane mein",
      "[01:12] Kardi hai husn ki khaali tijoriyan",
      "[01:35] Kajal ki siyahi se likhi",
      "[02:00] Hai tune jaane kitno ki love storiyan",
      "[02:24] Kesariya tera ishq hai piya",
      "[02:48] Rang jaaun jo main haath lagaun"
    ]
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
    description: 'Full length 320kbps Punjabi hit by AP Dhillon & Gurinder Gill.',
    lyrics: [
      "[00:15] Jad vi main tere wal vekha",
      "[00:32] Tu vi mere vallon hi vekhe",
      "[00:54] Kehndi hundi si chan tak raah bana de",
      "[01:18] Taare ne pasand mainu hethan saare laa de",
      "[01:42] Ohna tareyan de vich jad mainu vekhegi",
      "[02:05] Meri yaad jad aaoogi taan pata lagguga"
    ]
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
    description: 'Global collaboration between Diljit Dosanjh and Sia in full 320kbps.',
    lyrics: [
      "[00:12] Hasde hasde je dil le gaya koi",
      "[00:28] Akhiyan ch rakh leya tu saanu rohi",
      "[00:44] Hass hass ke gallan kardiyan ankhan",
      "[01:05] Tere bin hun main kithe vassan"
    ]
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
    description: 'Legendary synthwave pop anthem by The Weeknd in full length 320kbps.',
    lyrics: [
      "[00:10] I'm tryna put you in the worst mood, ah",
      "[00:24] P1 cleaner than your church shoes, ah",
      "[00:38] Point made, n****, double 0 7",
      "[00:52] Switch up my style, I take any lane",
      "[01:10] Look what you've done, I'm a motherf***in' starboy",
      "[01:30] Every day a n**** try to test me, ah",
      "[01:50] Every day a n**** try to end me, ah",
      "[02:10] Look what you've done, I'm a motherf***in' starboy"
    ]
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
    description: 'Viral global Punjabi groove by Karan Aujla.',
    lyrics: [
      "[00:12] Husan tera tauba tauba",
      "[00:28] Karde se saare tauba tauba",
      "[00:45] Dil sada luteya ve tu hass ke",
      "[01:02] Tere utte dull gaye ni gabbroo ni khas ke",
      "[01:25] Akh teri bazi laave jatta waali reet te",
      "[01:48] Nachdi tu sohniye ni sadke sangeet te"
    ]
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
    description: 'Timeless melodic stadium acoustic rock by Coldplay.',
    lyrics: [
      "[00:15] Look at the stars, look how they shine for you",
      "[00:34] And everything you do, yeah they were all yellow",
      "[00:58] I came along, I wrote a song for you",
      "[01:20] And all the things you do, and it was called Yellow",
      "[01:45] Your skin, oh yeah your skin and bones",
      "[02:08] Turn into something beautiful",
      "[02:30] For you I'd bleed myself dry"
    ]
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
    description: 'Emotional acoustic guitar ballad by Anuv Jain.',
    lyrics: [
      "[00:12] Hawaaon mein baarishein hain",
      "[00:30] Tu paas hai toh saari khwahishein hain",
      "[00:52] Kabhi mere saath tum baith ke dekho",
      "[01:15] Tumhein samjhayein yeh kya aazmaishein hain",
      "[01:40] Yeh jo boond boond girti hai zameen pe",
      "[02:02] Tere pyaar ki hi saari pukaarein hain"
    ]
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
    description: 'Majestic orchestral masterpiece by Hans Zimmer.',
    isInstrumental: true
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-ghost',
    name: 'Ghost',
    avatar: 'https://c.saavncdn.com/919/Radio-Rock-English-2026-20260623013559-500x500.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    bio: 'Swedish theatrical heavy metal and occult rock band fronted by Papa Emeritus, renowned for Mary On A Cross, Square Hammer and arena anthems.',
    genres: ['Rock', 'Metal', 'Heavy Metal'],
    monthlyListeners: 24500000,
    followersCount: 3800000,
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
    followersCount: 8200000,
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
    followersCount: 1400000,
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
    followersCount: 14500000,
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
    followersCount: 12500000,
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
    followersCount: 8400000,
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
    followersCount: 5200000,
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
    followersCount: 22000000,
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
    followersCount: 6500000,
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
    followersCount: 16500000,
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
    followersCount: 3800000,
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
    followersCount: 4200000,
    topTrackIds: ['track-zimmer-time']
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb-ghost-satanic',
    title: 'Seven Inches of Satanic Panic',
    artist: 'Ghost',
    artistId: 'art-ghost',
    coverArt: 'https://c.saavncdn.com/919/Radio-Rock-English-2026-20260623013559-500x500.jpg',
    year: 2019,
    genre: 'Rock',
    trackIds: ['track-mary-cross']
  },
  {
    id: 'alb-am-arctic',
    title: 'AM',
    artist: 'Arctic Monkeys',
    artistId: 'art-arctic',
    coverArt: 'https://c.saavncdn.com/795/AM-English-2013-20240402165515-500x500.jpg',
    year: 2013,
    genre: 'Rock',
    trackIds: ['track-wanna-yours']
  },
  {
    id: 'alb-brahmastra',
    title: 'Brahmastra',
    artist: 'Pritam & Arijit Singh',
    artistId: 'art-456323',
    coverArt: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    year: 2022,
    genre: 'Bollywood',
    trackIds: ['track-rjkrTnma']
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-trending',
    title: '🔥 Today\'s Top Hits & Trends',
    description: 'The hottest tracks trending across Hindi, Punjabi and Global charts in full 320kbps.',
    coverArt: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
    creatorId: 'user-system',
    creatorName: 'Aura AI Editorial',
    trackIds: ['track-mary-cross', 'track-wanna-yours', 'track-die-smile', 'track-pal-pal-talwinder', 'track-rjkrTnma', 'track-ap-excuses', 'track-diljit-hass', 'track-weeknd-starboy'],
    tracks: INITIAL_TRACKS,
    isPublic: true,
    isCollaborative: false,
    collaboratorIds: [],
    reactions: [
      { emoji: '🔥', count: 1420 },
      { emoji: '❤️', count: 980 },
      { emoji: '⚡', count: 650 }
    ],
    isPinned: true,
    createdAt: '2024-01-15'
  }
];

export const INITIAL_USERS: User[] = [];
export const INITIAL_FRIEND_ACTIVITIES: FriendActivity[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
