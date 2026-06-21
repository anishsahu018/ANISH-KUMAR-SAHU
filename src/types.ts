export interface Track {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  genre: string;
  moods: string[];
  chords: string[];
  pianoNotes: string[];
  drumSteps?: boolean[][]; // [instrumentIndex][stepIndex]
  lyrics: string[];
  lyricsTranslated?: string[];
  linemeanings?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  source?: string;
}

export interface ChatMessage {
  sender: "user" | "aura" | "system";
  text: string;
  timestamp: string;
  playCommand?: any;
}

export interface LiveRoomMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
}

export interface ListeningRoom {
  id: string;
  name: string;
  activeListeners: number;
  currentTrack: Track;
  chat: LiveRoomMessage[];
  queue: { track: Track; votes: number }[];
}

export interface MusicPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  songShare?: Track;
  likes: number;
  hasLiked?: boolean;
  comments: { user: string; text: string }[];
  reactions: Record<string, number>;
}
