import React, { useState, useEffect } from "react";
import { 
  Play, Pause, Heart, Download, Share2, Plus, Clock, Search, Sparkles, 
  ChevronLeft, ArrowRight, User, Calendar, Music, BarChart2, Flame, 
  Activity, BookOpen, AlertCircle, Check, Trash2, ListMusic, Layers, Zap
} from "lucide-react";
import { Track } from "../types";

interface CollectionDetailPageProps {
  collectionName: string;
  onClose: () => void;
  trackDatabase: Track[];
  isLiked: Record<number, boolean>;
  toggleLike: (id: number) => void;
  downloadedTrackIds: number[];
  setDownloadedTrackIds: React.Dispatch<React.SetStateAction<number[]>>;
  recentlyPlayedTracks: Track[];
  onPlayTrack: (tracks: Track[], index: number) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onAddToQueue?: (track: Track) => void;
  onSelectCollection: (name: string) => void;
}

export default function CollectionDetailPage({
  collectionName,
  onClose,
  trackDatabase,
  isLiked,
  toggleLike,
  downloadedTrackIds,
  setDownloadedTrackIds,
  recentlyPlayedTracks,
  onPlayTrack,
  currentTrack,
  isPlaying,
  onAddToQueue,
  onSelectCollection
}: CollectionDetailPageProps) {
  // Local tracks state that represents the current tracks in the collection
  const [collectionTracks, setCollectionTracks] = useState<Track[]>([]);
  const [customAddedTracks, setCustomAddedTracks] = useState<Track[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLikedCollection, setIsLikedCollection] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState<Track | null>(null);
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<number | null>(null);

  // Focus/Study Timer state
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);

  // Sleep Timer state
  const [selectedSleepTimer, setSelectedSleepTimer] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);

  // Notification Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Workout metrics state values (simulated but interactive)
  const [workoutIntensity, setWorkoutIntensity] = useState<"Warmup" | "Cardio" | "Peak">("Cardio");

  // Determine which tracks are in this collection
  useEffect(() => {
    let list: Track[] = [];
    if (collectionName === "Recently Played") {
      list = recentlyPlayedTracks.length > 0 ? recentlyPlayedTracks : trackDatabase.slice(0, 4);
    } else if (collectionName === "Favorites") {
      list = trackDatabase.filter(t => isLiked[t.id]);
    } else if (collectionName === "Downloads") {
      list = trackDatabase.filter(t => downloadedTrackIds.includes(t.id));
    } else if (collectionName === "AI Generated") {
      // Create some hybrid AI variants or filtered lists
      list = trackDatabase.filter(t => t.id === 1 || t.id === 8001 || t.id === 8002 || t.id === 8003 || t.id === 4);
    } else if (collectionName === "Study Playlists") {
      list = trackDatabase.filter(t => t.moods.includes("Focused") || t.genre.toLowerCase().includes("ambient") || t.genre.toLowerCase().includes("acoustic"));
    } else if (collectionName === "Workout Playlists") {
      list = trackDatabase.filter(t => t.moods.includes("Motivated") || t.genre.toLowerCase().includes("synthwave") || t.genre.toLowerCase().includes("edm"));
    } else if (collectionName === "Sleep Playlists") {
      list = trackDatabase.filter(t => t.moods.includes("Relaxed") || t.genre.toLowerCase().includes("rain") || t.genre.toLowerCase().includes("piano"));
    }

    // Merge with any custom added songs
    const merged = [...list];
    customAddedTracks.forEach(ct => {
      if (!merged.some(item => item.id === ct.id)) {
        merged.push(ct);
      }
    });

    setCollectionTracks(merged);
  }, [collectionName, isLiked, downloadedTrackIds, recentlyPlayedTracks, trackDatabase, customAddedTracks]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: number | null = null;
    if (pomoActive) {
      interval = window.setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoSeconds === 0) {
          if (pomoMinutes === 0) {
            setPomoActive(false);
            showToast("Focus session complete! Perfect flow state!");
            setPomoMinutes(25);
          } else {
            setPomoMinutes(pomoMinutes - 1);
            setPomoSeconds(59);
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomoActive, pomoMinutes, pomoSeconds]);

  // Sleep Timer effect
  useEffect(() => {
    let interval: number | null = null;
    if (selectedSleepTimer !== null && sleepTimeRemaining !== null && sleepTimeRemaining > 0) {
      interval = window.setInterval(() => {
        setSleepTimeRemaining(prev => {
          if (prev !== null && prev > 1) return prev - 1;
          showToast("Sleep timer completed! Fade in natural ambiance active.");
          setSelectedSleepTimer(null);
          return null;
        });
      }, 1); // Mock speeded countdown for user interactivity feedback or standard 1s interval
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedSleepTimer, sleepTimeRemaining]);

  // Play All / Shuffle helper
  const handlePlayCollection = (shuffle: boolean) => {
    if (collectionTracks.length === 0) {
      showToast("Collection is empty. Add recommended songs below!");
      return;
    }
    let tracksToPlay = [...collectionTracks];
    if (shuffle) {
      tracksToPlay.sort(() => Math.random() - 0.5);
    }
    onPlayTrack(tracksToPlay, 0);
    showToast(`Playing ${collectionName} with ${tracksToPlay.length} songs ${shuffle ? "(Shuffled)" : ""}`);
  };

  // Toggle download state of entire collection
  const handleDownloadCollection = () => {
    const allIds = collectionTracks.map(t => t.id);
    const hasUnsaved = allIds.some(id => !downloadedTrackIds.includes(id));
    if (hasUnsaved) {
      setDownloadedTrackIds(prev => {
        const next = [...prev];
        allIds.forEach(id => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      });
      showToast("Download initialized! Saved offline in high-fidelity FLAC code.");
    } else {
      setDownloadedTrackIds(prev => prev.filter(id => !allIds.includes(id)));
      showToast("Collection removed from offline storage.");
    }
  };

  // Compute stats for display
  const totalSongsCount = collectionTracks.length;
  const totalDurationSeconds = collectionTracks.reduce((acc, current) => acc + (current.duration || 180), 0);
  const minutesLabel = Math.floor(totalDurationSeconds / 60);

  // Finding stats
  const getMostPlayedArtist = () => {
    if (collectionTracks.length === 0) return "Horizon";
    const counts: Record<string, number> = {};
    collectionTracks.forEach(t => {
      counts[t.artist] = (counts[t.artist] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "Horizon");
  };

  const getMostPlayedGenre = () => {
    if (collectionTracks.length === 0) return "Ambient Lo-Fi";
    const counts: Record<string, number> = {};
    collectionTracks.forEach(t => {
      counts[t.genre] = (counts[t.genre] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "Ambient Lo-Fi");
  };

  // Config setup depending on collection meta
  const configMap: Record<string, {
    bg: string;
    gradient: string;
    desc: string;
    creator: string;
    lastUpdated: string;
    icon: React.ComponentType<any>;
  }> = {
    "Recently Played": {
      bg: "from-rose-900/60 to-black/90",
      gradient: "from-rose-600 to-amber-700",
      desc: "Your continuous brain wave sync stream and biometric audit timeline.",
      creator: "Aura Cognitive OS",
      lastUpdated: "Just Now",
      icon: Clock
    },
    "Favorites": {
      bg: "from-pink-900/60 to-black/90",
      gradient: "from-pink-500 to-rose-600",
      desc: "Your curated high-fidelity heartwave and cognitive music storage.",
      creator: "You",
      lastUpdated: "Yesterday",
      icon: Heart
    },
    "Downloads": {
      bg: "from-emerald-900/60 to-black/90",
      gradient: "from-emerald-500 to-teal-600",
      desc: "True lossess offline synthesizer layers saved directly to browser vault memory.",
      creator: "Offline Cache",
      lastUpdated: "2 days ago",
      icon: Download
    },
    "AI Generated": {
      bg: "from-violet-900/60 to-black/90",
      gradient: "from-violet-600 to-indigo-500",
      desc: "Deep atmospheric tracks compiled dynamically using raw prompt filters.",
      creator: "Aura Neural Core",
      lastUpdated: "Today",
      icon: Sparkles
    },
    "Study Playlists": {
      bg: "from-cyan-900/60 to-black/90",
      gradient: "from-cyan-500 to-blue-600",
      desc: "Acoustic focal layers and cognitive lofi compiled to maintain flow status.",
      creator: "Aura Focus Studio",
      lastUpdated: "Last week",
      icon: BookOpen
    },
    "Workout Playlists": {
      bg: "from-amber-900/60 to-black/90",
      gradient: "from-amber-500 to-orange-600",
      desc: "High energy, voltage peak rhythms to enhance cardiovasculary endurance output.",
      creator: "Aura Fit AI",
      lastUpdated: "3 days ago",
      icon: Flame
    },
    "Sleep Playlists": {
      bg: "from-indigo-950/80 to-black/95",
      gradient: "from-fuchsia-900 to-slate-900",
      desc: "Ultra relaxed raindrops sound and pure piano resonance for nocturnal repair cycles.",
      creator: "Aura Somnium OS",
      lastUpdated: "Last night",
      icon: Music
    }
  };

  const currentMeta = configMap[collectionName] || configMap["Recently Played"];
  const CollectionIcon = currentMeta.icon;

  // Add song from recommended list
  const addSongToCurrent = (track: Track) => {
    if (collectionTracks.some(ct => ct.id === track.id)) {
      showToast(`'${track.title}' is already in this compilation.`);
      return;
    }
    setCustomAddedTracks(prev => [...prev, track]);
    showToast(`Added '${track.title}' to ${collectionName}!`);
  };

  // Format Duration helper
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Recommended list of songs to add (filter out tracks already in collectionTracks)
  const recommendedToAdd = trackDatabase
    .filter(t => !collectionTracks.some(ct => ct.id === t.id))
    .slice(0, 4);

  return (
    <div id="playlist-collection-detail-page" className="w-full text-white pb-16 relative select-none animate-fadeIn flex flex-col xl:flex-row gap-6 font-sans">
      
      {/* Background colored ambient wash */}
      <div className={`absolute -top-24 left-0 right-0 h-96 bg-gradient-to-b ${currentMeta.bg} to-transparent opacity-40 blur-3xl -z-10 pointer-events-none`} />

      {/* Primary detail column (Spotify layout) */}
      <div className="flex-1 space-y-6">
        
        {/* Toast Notifier */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#161618] border-2 border-[#1db954] text-[#1db954] font-mono text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span className="font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Back navigation Row */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition bg-zinc-900/60 hover:bg-zinc-800 px-3.5 py-2 rounded-xl border border-zinc-850"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
            <span>Close Collection</span>
          </button>
          <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#1db954] rounded-full animate-ping" />
            Active Collection • {collectionName}
          </div>
        </div>

        {/* HERO HEADER AREA */}
        <div className="bg-[#101012]/40 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden shadow-xl">
          <div className={`absolute inset-0 bg-gradient-to-tr ${currentMeta.bg} opacity-2 w-full pointer-events-none`} />
          
          {/* Big custom vector art container based on theme colors */}
          <div className={`w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br ${currentMeta.gradient} rounded-2xl shadow-2xl p-5 flex flex-col justify-between shrink-0 group relative cursor-pointer transform hover:scale-102 transition duration-300 border border-white/10`}>
            <div className="flex justify-between items-start">
              <CollectionIcon className="w-10 h-10 text-white/95 drop-shadow-lg" />
              <div className="text-[9px] bg-black/40 text-[#1db954] px-1.5 py-0.5 rounded font-mono font-bold border border-[#1db954]/20 uppercase">AURA OS</div>
            </div>
            <div>
              <div className="text-xs uppercase font-mono font-bold tracking-widest text-[#1db954]">COMPILATION</div>
              <h3 className="text-lg font-black leading-none text-white drop-shadow-md tracking-tight uppercase font-mono">
                {collectionName}
              </h3>
            </div>
            <div className="absolute right-3.5 bottom-3 text-[10px] text-white/40 font-mono font-bold">HQ/320KBPS</div>
          </div>

          {/* Album attributes list */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-[#1db954]/10 border border-[#1db954]/25 text-[#1db954] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase">
                🧠 Dynamic Bio-Sourced Playlist
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
              {collectionName}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
              {currentMeta.desc} Experiencing direct mental triggers, synthetic transitions, and rhythmic pulse curves tailored for neural entrainment.
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-400 font-mono pt-1">
              <span className="font-extrabold text-[#1db954] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Curated by {currentMeta.creator}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 text-zinc-300">
                <Music className="w-3.5 h-3.5 text-zinc-500" /> {totalSongsCount} Songs
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">{minutesLabel} Minutes</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 text-zinc-500">
                <Calendar className="w-3.5 h-3.5" /> Updated {currentMeta.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* HERO ACTION ROW BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => handlePlayCollection(false)}
            className="px-5 py-3 bg-[#1db954] hover:bg-[#1ed760] font-black text-black rounded-full flex items-center gap-2 shadow-lg transition active:scale-95"
          >
            <Play className="w-5 h-5 fill-black text-black" />
            <span>PLAY ALL</span>
          </button>
          
          <button 
            onClick={() => handlePlayCollection(true)}
            className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 font-black text-white rounded-full border border-zinc-800 flex items-center gap-2 shadow-md transition active:scale-95"
          >
            <Layers className="w-4 h-4 text-[#1db954]" />
            <span>SHUFFLE</span>
          </button>

          <button 
            onClick={() => {
              setIsLikedCollection(!isLikedCollection);
              showToast(isLikedCollection ? `Removed ${collectionName} from compiled library.` : `Favorite saved! Added ${collectionName} to library.`);
            }}
            className={`p-3 rounded-full border transition active:scale-95 flex items-center justify-center ${
              isLikedCollection 
                ? "bg-rose-500/20 border-rose-500 text-rose-500" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
            }`}
            title="Bookmark Collection"
          >
            <Heart className={`w-4.5 h-4.5 ${isLikedCollection ? "fill-rose-500" : ""}`} />
          </button>

          <button 
            onClick={() => handleDownloadCollection()}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition active:scale-95 flex items-center justify-center"
            title="Download entire compilation offline"
          >
            <Download className="w-4.5 h-4.5" />
          </button>

          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast("Biometric sharing URL copied to vault clipboard!");
            }}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition active:scale-95 flex items-center justify-center"
            title="Share Compilation"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>

          <button 
            onClick={() => {
              if (recommendedToAdd.length > 0) {
                addSongToCurrent(recommendedToAdd[0]);
              } else {
                showToast("All available tracks have been compiled in this list!");
              }
            }}
            className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-full text-xs font-bold font-mono text-zinc-400 hover:text-zinc-200 transition ml-auto"
            title="Quick add curated tracks to this collection"
          >
            + Add Fresh Curations
          </button>
        </div>

        {/* CUSTOM SPECIAL INTERACTIVE STATS / SECTOR INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b0b0d]/50 p-4 rounded-2xl border border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Tracks Compiled</p>
            <p className="text-xl md:text-2xl font-black text-white font-mono mt-1">{totalSongsCount}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">High Fidelity FLAC</p>
          </div>
          
          <div className="bg-[#0b0b0d]/50 p-4 rounded-2xl border border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Listening Duration</p>
            <p className="text-xl md:text-2xl font-black text-white font-mono mt-1">{minutesLabel}m</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Seamless transition</p>
          </div>

          <div className="bg-[#0b0b0d]/50 p-4 rounded-2xl border border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Primary Catalyst</p>
            <p className="text-sm md:text-base font-bold text-[#1db954] truncate mt-2">{getMostPlayedArtist()}</p>
            <p className="text-[10px] text-zinc-500 font-mono">Top acoustic provider</p>
          </div>

          <div className="bg-[#0b0b0d]/50 p-4 rounded-2xl border border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Entrainment Genre</p>
            <p className="text-sm md:text-base font-bold text-[#1db954] truncate mt-2">{getMostPlayedGenre()}</p>
            <p className="text-[10px] text-zinc-500 font-mono">Synchronized vibes</p>
          </div>
        </div>

        {/* EACH SPECIFIC COLLECTION CUSTOM METRICS PANEL */}
        <div className="bg-[#141416]/50 border border-zinc-900 rounded-3xl p-5 space-y-4 font-mono">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
            <Layers className="w-4.5 h-4.5 text-[#1db954]" />
            <h3 className="text-xs font-black uppercase text-zinc-300">Biometric Specialty Analysis • {collectionName}</h3>
          </div>

          {collectionName === "Recently Played" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="space-y-1 bg-black/30 p-3 rounded-xl border border-zinc-900">
                <span className="text-zinc-500 uppercase block text-[9px]">Session continuity</span>
                <span className="font-bold text-white text-sm">94.8% Flawless Rate</span>
                <p className="text-[10px] text-zinc-500 pt-1 leading-normal font-sans">No aborted runs. Keyboard rhythm remains completely uninterrupted.</p>
              </div>
              <div className="space-y-1 bg-black/30 p-3 rounded-xl border border-zinc-900">
                <span className="text-zinc-500 uppercase block text-[9px]">Nocturnal Focus</span>
                <span className="font-bold text-white text-sm">73% Ambient Ratio</span>
                <p className="text-[10px] text-zinc-500 pt-1 leading-normal font-sans">Strong preference for soft sitars and acoustic pianos during late hours.</p>
              </div>
              <div className="space-y-1 bg-black/30 p-3 rounded-xl border border-zinc-900">
                <span className="text-zinc-500 uppercase block text-[9px]">Biometric Status</span>
                <span className="font-bold text-[#1db954] text-sm">Synced Coherent</span>
                <p className="text-[10px] text-zinc-500 pt-1 leading-normal font-sans">Music rhythms coordinate cleanly with standard keyboard keystroke velocities.</p>
              </div>
            </div>
          )}

          {collectionName === "Favorites" && (
            <div className="text-xs space-y-2">
              <p className="text-zinc-400 font-sans text-xs">This collection represents your curated mental vault. Heartwave entrainments are prioritized so they play instantly on startup.</p>
              <div className="flex items-center gap-4 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900 w-full sm:w-2/3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase">AURA EMOTIONAL SCORE</span>
                  <p className="text-[13px] text-white">Your neural preference leans towards <span className="text-[#1db954] font-bold">Deep Tranquility (88%)</span> and <span className="text-[#1db954] font-bold">High Motivation (12%)</span>.</p>
                </div>
              </div>
            </div>
          )}

          {collectionName === "Downloads" && (
            <div className="text-xs space-y-3 font-mono">
              <div className="flex items-center gap-2 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 px-3 py-2 rounded-xl text-[10px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>ALL TRACKS RECONSTRUCTED LOCALLY: Pure sine-wave rendering does not require internet transit.</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/40 p-3 rounded-xl">
                <div>
                  <span className="text-zinc-500 uppercase block text-[9px]">STORAGE TOTAL</span>
                  <span className="font-bold text-white">4.8 MB</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[9px]">FORMAT CODE</span>
                  <span className="font-bold text-[#1db954]">FLAC (LOSSY FREE)</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[9px]">OFFLINE ENCRYPTION</span>
                  <span className="font-bold text-white">AES-256 BIT</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[9px]">SAMPLE CYCLE</span>
                  <span className="font-bold text-white">320 KHZ</span>
                </div>
              </div>
            </div>
          )}

          {collectionName === "AI Generated" && (
            <div className="text-xs space-y-3">
              <p className="text-zinc-400 font-sans">Compiled dynamically using natural language filters inside the AI Audio generator module.</p>
              <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 border-l-2 border-l-[#1db954]">
                <span className="text-zinc-500 block text-[9px] uppercase font-bold tracking-wider">GEN-3 SEED FILTER PROMPT</span>
                <span className="text-white text-[11px] block mt-1 italic">"Late night cybernetic lofi with soft indian sitars, deep terminal rain noise, and beautiful binary lofi chord arpeggios."</span>
              </div>
              <div className="flex gap-4">
                <div><span className="text-zinc-500 text-[10px]">TEMPERATURE: </span> <span className="font-bold text-white font-mono">0.82</span></div>
                <div><span className="text-zinc-500 text-[10px]">CREATIVE WEIGHT: </span> <span className="font-bold text-[#1db954] font-mono">94%</span></div>
              </div>
            </div>
          )}

          {collectionName === "Study Playlists" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-900/60">
                <div className="space-y-1">
                  <span className="text-[#1db954] font-bold text-xs uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-pulse" /> LIVE ACCENT POMODORO INTEGRATION
                  </span>
                  <p className="text-xs text-zinc-400 font-sans max-w-md">Launch focus intervals in parallel with continuous ambient music compilation.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black font-mono text-white tracking-widest bg-black px-4 py-1.5 rounded-lg border border-zinc-850">
                    {pomoMinutes}:{pomoSeconds < 10 ? "0" : ""}{pomoSeconds}
                  </div>
                  <button 
                    onClick={() => setPomoActive(!pomoActive)}
                    className={`px-4 py-2 text-xs font-bold font-mono rounded-lg transition duration-200 uppercase ${
                      pomoActive ? "bg-amber-600 text-white" : "bg-[#1db954] text-black"
                    }`}
                  >
                    {pomoActive ? "Pause" : "Start Focus"}
                  </button>
                  <button 
                    onClick={() => {
                      setPomoActive(false);
                      setPomoMinutes(25);
                      setPomoSeconds(0);
                    }}
                    className="p-2 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition"
                    title="Reset Focus Interval"
                  >
                    ⟳
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-zinc-500 uppercase block text-[9px]">Focus Score</span>
                  <span className="font-black text-white text-base">98 / 100</span>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-1.5">
                    <div className="bg-[#1db954] h-1.5 rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>
                <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-zinc-500 uppercase block text-[9px]">Delta Waves Trigger</span>
                  <span className="font-black text-white text-base">ACTIVE (4.5Hz)</span>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-1.5">
                    <div className="bg-[#1db954] h-1.5 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-zinc-500 uppercase block text-[9px]">Focus Endurance</span>
                  <span className="font-black text-white text-base">3.4 Hours Avg</span>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-1.5">
                    <div className="bg-[#1db954] h-1.5 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {collectionName === "Workout Playlists" && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-950">
                <div className="space-y-1">
                  <span className="text-[#1db954] font-bold text-xs uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" /> ACTIVE WORKOUT LEVEL INTENSITY
                  </span>
                  <p className="text-xs text-zinc-400 font-sans">BPM metrics set to dynamic cross-fade depending on intensity status.</p>
                </div>
                
                <div className="flex bg-black border border-zinc-850 p-1.5 rounded-xl font-bold uppercase text-[10px]">
                  {["Warmup", "Cardio", "Peak"].map(level => (
                    <button
                      key={level}
                      onClick={() => setWorkoutIntensity(level as any)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        workoutIntensity === level 
                          ? "bg-orange-600 text-white" 
                          : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-black/30 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Workout BPM</span>
                  <span className="text-base font-black text-white">
                    {workoutIntensity === "Warmup" ? "110 BPM" : workoutIntensity === "Cardio" ? "128 BPM" : "142 BPM"}
                  </span>
                </div>
                <div className="p-3 bg-black/30 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Energy Catalyst</span>
                  <span className="text-base font-black text-[#1db954]">
                    {workoutIntensity === "Warmup" ? "Gaining Pace" : workoutIntensity === "Cardio" ? "92% Efficiency" : "Max Surge"}
                  </span>
                </div>
                <div className="p-3 bg-black/30 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Hydration Target</span>
                  <span className="text-base font-black text-white">750 mL</span>
                </div>
                <div className="p-3 bg-black/30 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Target Calorie burn</span>
                  <span className="text-base font-black text-rose-500">450 kCal</span>
                </div>
              </div>
            </div>
          )}

          {collectionName === "Sleep Playlists" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-900/60">
                <div className="space-y-1">
                  <span className="text-indigo-400 font-bold text-xs uppercase flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-fuchsia-500" /> INTERACTIVE SLEEP TIMEOUT LIMITER
                  </span>
                  <p className="text-xs text-zinc-400 font-sans">App will slowly fade out music synth volume and enter offline power saving mode.</p>
                </div>

                <div className="flex items-center gap-2">
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        setSelectedSleepTimer(mins);
                        setSleepTimeRemaining(mins * 60);
                        showToast(`Sleep timer configured for ${mins} minutes!`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition ${
                        selectedSleepTimer === mins 
                          ? "bg-indigo-600 text-white border border-indigo-500" 
                          : "bg-[#0f0f11] border border-zinc-850 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                  {selectedSleepTimer !== null && (
                    <button 
                      onClick={() => {
                        setSelectedSleepTimer(null);
                        setSleepTimeRemaining(null);
                        showToast("Sleep timer deactivated.");
                      }}
                      className="text-xs text-rose-500 hover:underline px-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {sleepTimeRemaining !== null && (
                <div className="bg-black/40 p-2 rounded-lg border border-zinc-900 text-center text-xs text-indigo-400 font-mono">
                  ⏰ Timer countdown running: {Math.floor(sleepTimeRemaining / 60)} minutes {sleepTimeRemaining % 60} seconds remaining
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Relaxation Index</span>
                  <span className="text-base font-black text-[#1db954]">Deep Calm (99%)</span>
                </div>
                <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Sleep Quality Score</span>
                  <span className="text-base font-black text-white">96 / 100</span>
                </div>
                <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-500 uppercase text-[9px] block">Biometric Sleep State</span>
                  <span className="text-base font-black text-indigo-400">REM Optimization Cycle</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SPOTIFY-STYLE SONGS COMPILATION TABLE */}
        <div className="bg-[#09090b]/40 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 md:p-6 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-black uppercase text-white font-mono flex items-center gap-2">
              <ListMusic className="text-[#1db954]" /> Track Breakdown Index
            </h2>
            <div className="text-xs text-zinc-500 font-mono">
              Displaying {collectionTracks.length} high-fidelity compositions
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="border-b border-zinc-900/60 text-zinc-500 font-mono text-[10px] uppercase font-black uppercase tracking-wider">
                  <th className="py-4 px-4 text-center w-12">#</th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">Artist</th>
                  <th className="py-4 px-4 hidden md:table-cell">Album</th>
                  <th className="py-4 px-4 text-center w-16">
                    <Clock className="w-3.5 h-3.5 mx-auto" />
                  </th>
                  <th className="py-4 px-4 text-right pr-6">Vault Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40">
                {collectionTracks.map((track, index) => {
                  const isCurTrack = currentTrack?.id === track.id;
                  const isTrackLiked = isLiked[track.id];
                  const isTrackDownloaded = downloadedTrackIds.includes(track.id);

                  return (
                    <tr 
                      key={`${track.id}-${index}`}
                      className={`group hover:bg-[#141416]/90 transition duration-150 cursor-pointer ${
                        isCurTrack ? "bg-zinc-900/30 font-bold" : ""
                      }`}
                    >
                      {/* 1. Track Number Column */}
                      <td className="py-3 px-4 text-center" onClick={() => onPlayTrack(collectionTracks, index)}>
                        {isCurTrack && isPlaying ? (
                          <div className="flex items-end justify-center gap-[2px] h-3 w-4 mx-auto pb-0.5" title="Playing now">
                            <span className="w-[3px] bg-[#1db954] animate-bounce-custom1 rounded-full" />
                            <span className="w-[3px] bg-[#1db954] animate-bounce-custom2 rounded-full h-3" />
                            <span className="w-[3px] bg-[#1db954] animate-bounce-custom3 rounded-full h-2" />
                          </div>
                        ) : (
                          <span className="text-zinc-500 font-mono font-bold text-xs group-hover:hidden">
                            {index + 1}
                          </span>
                        )}
                        <Play className="w-3.5 h-3.5 text-[#1db954] mx-auto hidden group-hover:block" onClick={() => onPlayTrack(collectionTracks, index)} />
                      </td>

                      {/* 2. Cover & Title */}
                      <td className="py-3 px-4 min-w-[150px]" onClick={() => onPlayTrack(collectionTracks, index)}>
                        <div className="flex items-center gap-3">
                          {/* Song small cover replacement */}
                          <div className={`w-9 h-9 rounded bg-gradient-to-tr ${
                            track.id === 1 ? "from-indigo-600 to-black" :
                            track.id === 2 ? "from-rose-600 to-black" :
                            track.id === 3 ? "from-teal-600 to-black" : "from-[#1db954]/40 to-black"
                          } flex items-center justify-center text-[10px] font-black text-white`}>
                            {track.title ? track.title[0] : "A"}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs truncate ${isCurTrack ? "text-[#1db954]" : "text-white"}`}>
                              {track.title}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight block">
                              {track.genre}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Artist */}
                      <td className="py-3 px-4 text-xs font-medium text-zinc-300 max-w-[120px] truncate" onClick={() => onPlayTrack(collectionTracks, index)}>
                        {track.artist}
                      </td>

                      {/* 4. Album (Hidden on Mobile) */}
                      <td className="py-3 px-4 text-xs text-zinc-500 truncate hidden md:table-cell max-w-[140px]" onClick={() => onPlayTrack(collectionTracks, index)}>
                        {track.album || "Aura Synthesized Single"}
                      </td>

                      {/* 5. Duration */}
                      <td className="py-3 px-4 text-center text-xs font-mono text-zinc-400" onClick={() => onPlayTrack(collectionTracks, index)}>
                        {formatDuration(track.duration || 180)}
                      </td>

                      {/* 6. Action Elements (Like, More Options, Delete/Remove) */}
                      <td className="py-3 px-4 text-right pr-6 space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track.id);
                            showToast(isLiked[track.id] ? "Removed from Favorites." : "Saved to Favorites!");
                          }}
                          className={`${
                            isTrackLiked ? "text-rose-500" : "text-zinc-500 hover:text-white"
                          } transition p-1.5 rounded-lg`}
                          title="Like Song"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isTrackLiked ? "fill-rose-500" : ""}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDownloadedTrackIds(prev => 
                              prev.includes(track.id) 
                                ? prev.filter(id => id !== track.id) 
                                : [...prev, track.id]
                            );
                            showToast(isTrackDownloaded ? "Removed from downloads cache memory." : "Downloaded high definition FLAC file locally.");
                          }}
                          className={`${
                            isTrackDownloaded ? "text-[#1db954]" : "text-zinc-500 hover:text-white"
                          } transition p-1.5 rounded-lg`}
                          title="Download Song offline"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Interactive more dropdown option button */}
                        <div className="inline-relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuTrackId(activeMenuTrackId === track.id ? null : track.id);
                            }}
                            className="text-zinc-500 hover:text-white p-1.5 hover:bg-zinc-900 rounded-lg transition font-bold"
                            title="Interactive Song Commands"
                          >
                            •••
                          </button>

                          {activeMenuTrackId === track.id && (
                            <div className="absolute right-10 bg-[#0e0e0f] border border-zinc-850 p-1.5 rounded-xl shadow-2xl z-40 w-44 font-mono text-[10px] space-y-1 block scale-95 origin-top-right transition duration-100">
                              <button
                                onClick={() => {
                                  if (onAddToQueue) {
                                    onAddToQueue(track);
                                    showToast(`Added '${track.title}' to secondary play queue!`);
                                  } else {
                                    showToast("Queue limits synchronized successfully!");
                                  }
                                  setActiveMenuTrackId(null);
                                }}
                                className="w-full text-left px-2.5 py-2 hover:bg-zinc-900 rounded-lg transition text-zinc-300 hover:text-white flex items-center gap-2"
                              >
                                ➕ Add to Play Queue
                              </button>
                              
                              <button
                                onClick={() => {
                                  setShowLyricsModal(track);
                                  setActiveMenuTrackId(null);
                                }}
                                className="w-full text-left px-2.5 py-2 hover:bg-zinc-900 rounded-lg transition text-[#1db954] hover:text-white flex items-center gap-2"
                              >
                                📝 Show Lyrics & Meanings
                              </button>

                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(`Song Share Alert: Listen to '${track.title}' by ${track.artist} on Aura Cognitive OS! URL_KEY: ${track.id}`);
                                  showToast("Aura biometric share coupon compiled!");
                                  setActiveMenuTrackId(null);
                                }}
                                className="w-full text-left px-2.5 py-2 hover:bg-zinc-900 rounded-lg transition text-zinc-300 hover:text-white flex items-center gap-2"
                              >
                                🔗 Copy Biometric Share Code
                              </button>

                              {customAddedTracks.some(ct => ct.id === track.id) && (
                                <button
                                  onClick={() => {
                                    setCustomAddedTracks(prev => prev.filter(ct => ct.id !== track.id));
                                    showToast(`Removed '${track.title}' custom compilation entry.`);
                                    setActiveMenuTrackId(null);
                                  }}
                                  className="w-full text-left px-2.5 py-2 hover:bg-rose-950/20 text-rose-500 rounded-lg transition flex items-center gap-2"
                                >
                                  💥 Remove from Collection
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {collectionTracks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono text-xs">
                      No tracks compiled in this database module.<br/>
                      <span className="text-zinc-600 font-sans mt-2 block">
                        Tap the heart of any song, check in the quick-added panel or add curations below!
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR (COLLECTION METADATA & PERSISTENCE INSIGHTS) */}
      <aside className="w-full xl:w-80 shrink-0 space-y-6">
        
        {/* Recommended Songs panel section */}
        <div className="bg-[#101012]/50 border border-zinc-900 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-zinc-300 font-mono">Recommended Curations</h3>
            <span className="text-[9px] text-[#1db954] uppercase font-mono font-bold tracking-widest animate-pulse">Fresh</span>
          </div>

          <div className="space-y-3">
            {recommendedToAdd.map(t => (
              <div 
                key={t.id}
                className="flex items-center justify-between p-2.5 hover:bg-zinc-900/50 rounded-xl transition border border-zinc-950 hover:border-zinc-900"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{t.title}</p>
                  <span className="text-[10px] text-zinc-500 font-mono truncate block">{t.artist}</span>
                </div>
                <button
                  onClick={() => addSongToCurrent(t)}
                  className="p-1.5 bg-zinc-900 hover:bg-[#1db954] hover:text-black rounded-lg border border-zinc-800 text-zinc-400 transition"
                  title="Include in compilation"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {recommendedToAdd.length === 0 && (
              <p className="text-[10px] text-zinc-500 font-mono text-center py-4">
                All high definitions catalog tracks included!
              </p>
            )}
          </div>
        </div>

        {/* Similar Collections Quick Switching panel */}
        <div className="bg-[#101012]/50 border border-zinc-900 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-300 font-mono">Similar Music Collections</h3>
          
          <div className="grid grid-cols-1 gap-2">
            {[
              "Recently Played", "Favorites", "Downloads",
              "AI Generated", "Study Playlists", "Workout Playlists", "Sleep Playlists"
            ]
              .filter(name => name !== collectionName)
              .slice(0, 4)
              .map(targetName => (
                <button
                  key={targetName}
                  onClick={() => onSelectCollection(targetName)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0b0b0d]/80 hover:bg-zinc-900 rounded-xl border border-zinc-950 hover:border-zinc-850 text-xs text-left transition text-zinc-300 hover:text-white"
                >
                  <span className="font-bold">{targetName}</span>
                  <ArrowRight className="w-3 h-3 text-[#1db954]" />
                </button>
              ))}
          </div>
        </div>

        {/* Dynamic Related Artists panel */}
        <div className="bg-[#101012]/50 border border-zinc-900 rounded-3xl p-5 space-y-4 font-mono">
          <h3 className="text-xs font-black uppercase text-zinc-300">Related Audio Creators</h3>
          
          <div className="space-y-3">
            {[
              { name: "Horizon Studio", followers: "1,420,530", genre: "Ambient Calm" },
              { name: "CyberPulse", followers: "892,100", genre: "Industrial Wave" },
              { name: "Arijit Singh", followers: "12,504,220", genre: "Soulful Acoustic" }
            ].map(artist => (
              <div key={artist.name} className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60 font-sans">
                <div>
                  <p className="font-bold text-slate-100">{artist.name}</p>
                  <p className="text-[9px] text-zinc-500 font-mono uppercase">{artist.genre} • {artist.followers} followers</p>
                </div>
                <button 
                  onClick={() => showToast(`Subscribed and synchronized with ${artist.name} audio stream.`)}
                  className="text-[9px] text-[#1db954] bg-[#1db954]/10 border border-[#1b9542]/20 px-2 py-0.5 rounded-lg hover:bg-[#1db954] hover:text-black transition uppercase font-mono font-bold"
                >
                  Sync
                </button>
              </div>
            ))}
          </div>
        </div>

      </aside>

      {/* RICH BILINGUAL LYRICS & COGNITIVE MEANING GLASS COMPONENT DRAWER MODAL */}
      {showLyricsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c0c0e]/95 border border-zinc-850 p-6 md:p-8 rounded-3xl shadow-2xl relative select-none flex flex-col max-h-[85vh] animate-slideUp overflow-hidden">
            
            {/* Header of modal */}
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4 shrink-0">
              <div>
                <span className="text-[9px] text-[#1db954] uppercase font-mono font-black tracking-widest block">
                  🔮 Bilingual Cognitive Transcript
                </span>
                <h3 className="text-lg font-black text-white">{showLyricsModal.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">Curated meaning arpeggios synced live by Aura OS</p>
              </div>
              <button 
                onClick={() => setShowLyricsModal(null)}
                className="p-2 bg-zinc-900 hover:bg-zinc-805 rounded-xl text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable multi column body */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-2 font-mono">
              {showLyricsModal.lyrics && showLyricsModal.lyrics.map((lyr, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-900/40">
                  <div className="space-y-1">
                    <span className="text-[8px] text-zinc-650 tracking-wider">ORIGINAL</span>
                    <p className="text-xs font-bold text-white leading-relaxed">{lyr}</p>
                    
                    {showLyricsModal.lyricsTranslated && showLyricsModal.lyricsTranslated[index] && (
                      <div className="pt-2 text-zinc-400">
                        <span className="text-[8px] text-zinc-650 tracking-wider">ENGLISH TRANSCRIPTION</span>
                        <p className="text-[11px] leading-relaxed italic">{showLyricsModal.lyricsTranslated[index]}</p>
                      </div>
                    )}
                  </div>
                  
                  {showLyricsModal.linemeanings && showLyricsModal.linemeanings[index] && (
                    <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/60 text-sans text-[10px] text-zinc-400 leading-normal flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#1db954] shrink-0 mt-0.5" />
                      <div className="font-sans font-medium text-[11px]">
                        <span className="font-bold text-white block mb-0.5 text-[9px] font-mono tracking-wider text-zinc-500 uppercase">COGNITIVE PSYCHOLOGY MEANING</span>
                        {showLyricsModal.linemeanings[index]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer of modal */}
            <div className="border-t border-zinc-900 pt-3 shrink-0 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
              <span>Biometric Entrainment Synthesized</span>
              <button 
                onClick={() => setShowLyricsModal(null)}
                className="px-4 py-2 bg-[#1db954] text-black font-bold uppercase rounded-lg active:scale-95 transition"
              >
                Got it
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
