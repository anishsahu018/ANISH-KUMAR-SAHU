import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Music, Sparkles, 
  MessageSquare, Compass, Send, BookOpen, Clock, Layers, Filter, 
  HelpCircle, CheckCircle, Flame, Shield, Trophy, Activity, RefreshCw, 
  Radio, Smartphone, Users, Heart, Share2, Award, Zap, CloudLightning,
  Menu, X, Shuffle, Repeat, Home, Bell, Search, Download, Map, GraduationCap, 
  Calendar, Ticket, Plus, Maximize2, ChevronRight, ChevronLeft, Dna, Fingerprint, FileText, Mic, Keyboard,
  Settings as SettingsIcon
} from "lucide-react";

import { Track, Playlist, ChatMessage } from "./types";
import { auraAudio } from "./components/AuraSynth";

// Import modular pages
import Pomodoro from "./components/Pomodoro";
import LearningSuite from "./components/LearningSuite";
import CreatorSuite from "./components/CreatorSuite";
import SocialHub from "./components/SocialHub";
import ListeningRooms from "./components/ListeningRooms";
import CollectionDetailPage from "./components/CollectionDetailPage";
import SettingsControlCenter from "./components/SettingsControlCenter";
import { useSettingsStore, applyThemeEffects, applyAccentColorEffects, applyTextSizeEffects } from "./store/settingsStore";

export default function App() {
  // Boot Settings visually on startup
  useEffect(() => {
    const s = useSettingsStore.getState();
    applyThemeEffects(s.theme);
    applyAccentColorEffects(s.accentColor);
    applyTextSizeEffects(s.largerText);
  }, []);
  const [activeTab, setActiveTab ] = useState<"musichub" | "player" | "pomodoro" | "instrument" | "social" | "creator" | "musicdna" | "settings">("musichub");
  const [activePlayerTab, setActivePlayerTab] = useState<"home" | "dj" | "playlist" | "creation" | "lyrics" >("home");
  const [selectedLibraryCollection, setSelectedLibraryCollection] = useState<string | null>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Guard against typing inside input fields or textareas
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      const key = e.key.toLowerCase();
      
      // Ctrl + , OR Cmd + , OR Alt + s OR Shift + S OR simple S key opens Settings
      if (
        ((e.ctrlKey || e.metaKey) && e.key === ",") ||
        (e.altKey && key === "s") ||
        (key === "s")
      ) {
        e.preventDefault();
        setSelectedLibraryCollection(null);
        setSelectedMix(null);
        setActiveTab("settings");
      }
    };
    
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Music Hub Custom Interactive States
  const [hubSearchQuery, setHubSearchQuery] = useState("");
  const [selectedTrendingTab, setSelectedTrendingTab] = useState<"Songs" | "Albums" | "Artists" | "Global Charts">("Songs");
  const [selectedWrappedTab, setSelectedWrappedTab] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [selectedCountry, setSelectedCountry] = useState<string>("India");
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [isWellnessModeActive, setIsWellnessModeActive] = useState<string | null>(null);
  
  // Custom interactive notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Release", message: "Arijit Singh just dropped 'Cyber Heeriye (AI Remix)'. Listen now!", reads: false, time: "2m ago" },
    { id: 2, title: "Friend Alert", message: "Ananya is listening to 'Late Night Coding' lofi mix in Live Room 4.", reads: false, time: "15m ago" },
    { id: 3, title: "Level Up!", message: "Congratulations! You reached Level 23 based on focus streak.", reads: true, time: "1h ago" },
  ]);

  // Music DNA States
  const [dnaCarrierFreq, setDnaCarrierFreq] = useState(200);
  const [dnaBeatFreq, setDnaBeatFreq] = useState(10);
  const [dnaVolume, setDnaVolume] = useState(0);
  const [dnaSelectedPreset, setDnaSelectedPreset] = useState("Alpha");
  const [dnaHistory, setDnaHistory] = useState([
    { id: 101, title: "Binary Moonlight", key: "A minor", originalFreq: "528Hz Solfeggio", time: "Joined 4 mins ago", status: "Balanced Focus", color: "text-[#1db954]" },
    { id: 102, title: "Late Night Code", key: "D Minor", originalFreq: "432Hz Harmonic", time: "Looping 20 mins ago", status: "Cognitive Resonance", color: "text-indigo-400" },
    { id: 103, title: "Starlight Syntax", key: "F# Major", originalFreq: "852Hz Spiritual", time: "Looped 2h ago", status: "Dream Flow", color: "text-pink-400" },
    { id: 104, title: "Algorithm Coffee", key: "C Major", originalFreq: "396Hz Grounding", time: "Played 5h ago", status: "Deep Absorption", color: "text-amber-400" },
  ]);
  const [dnaGeneratingCertificate, setDnaGeneratingCertificate] = useState(false);
  const [dnaCertificateResult, setDnaCertificateResult] = useState<any>(null);

  // Song Library Database
  const trackDatabase: Track[] = [
    {
      id: 1,
      title: "Binary Moonlight",
      artist: "Horizon",
      album: "Compiler Dreams",
      duration: 184,
      genre: "Ambient Lo-Fi",
      moods: ["Focused", "Relaxed"],
      chords: ["Am7", "Dm7", "G7", "Cmaj7"],
      pianoNotes: ["A4", "C4", "E4", "G4", "D4", "F4", "A4", "C4"],
      lyrics: [
        "Quiet keys beneath the screens",
        "Compiling state of coded dreams",
        "Binary moonlight on the wood",
        "We debug things we never should."
      ],
      lyricsTranslated: [
        "Heaves of silent keys over deep screens",
        "Synthesizing state loops and quiet dreams",
        "The digital moonlight shines on old wood",
        "Fixing code flows in ways we never understood."
      ],
      linemeanings: [
        "Metaphor for long, late-night keyboard typing in absolute silence.",
        "Reflects the meditative flow state of creating algorithms from nothingness.",
        "Visual play on screens illuminating a dark workspace cozy ambiance.",
        "Folkloric developer humor on chasing mysterious compiler bugs."
      ]
    },
    {
      id: 2,
      title: "Neon Overdrive",
      artist: "CyberPulse",
      album: "Cybernetic Velocity",
      duration: 215,
      genre: "Synthwave / EDM",
      moods: ["Motivated", "Happy"],
      chords: ["Am", "F", "C", "G"],
      pianoNotes: ["A4", "F4", "C4", "G4"],
      lyrics: [
        "Adrenaline surges, voltage high",
        "We move like shadows through the sky",
        "Cyber pulse is calling now",
        "Pushing limits, check the flow."
      ],
      lyricsTranslated: [
        "Pure energy moving with speed",
        "Surfing through servers, taking lead",
        "The rhythm is pounding inside our head",
        "Unlocking states of mind we never read."
      ],
      linemeanings: [
        "Describes high-voltage mental clarity after a good breakthrough.",
        "Refers to fast internet routing and cloud computing speeds.",
        "Simulates the physical sensation of rapid synthetic key pulses.",
        "Motivates exceeding common boundaries in focus and execution."
      ]
    },
    {
      id: 3,
      title: "Silent Rain",
      artist: "Horizon",
      album: "Natural Acoustics",
      duration: 160,
      genre: "Acoustic Piano",
      moods: ["Relaxed", "Sad"],
      chords: ["C", "G", "Am", "F"],
      pianoNotes: ["C4", "G4", "A4", "F4"],
      lyrics: [
        "Drips of water on the silver glass",
        "Waiting for the midnight storm to pass",
        "Acoustic layers, clean and clear",
        "No more chaos, only peace resides here."
      ],
      lyricsTranslated: [
        "Soft raindrops falling outside the code pane",
        "Letting go of stressful thoughts and mental strain",
        "Simple acoustic notes, resonant and clean",
        "Entering the calmest space we have ever seen."
      ],
      linemeanings: [
        "Simulates peaceful natural rainfall hitting home windows.",
        "Metaphor for work delays resolving over time.",
        "Refers to the stripped-down, organic production style of this piano arrangement.",
        "Highlights finding clarity away from digital noises."
      ]
    },
    {
      id: 4,
      title: "Deep Sea Echoes",
      artist: "Abyss",
      album: "Sonar Vibrations",
      duration: 242,
      genre: "Experimental Ambient",
      moods: ["Focused", "Stressed"],
      chords: ["Fmaj7", "Em7", "Dm7", "Cmaj7"],
      pianoNotes: ["F4", "E4", "D4", "C4"],
      lyrics: [
        "Down in the blue, analog sonar sound",
        "Under current waves spinning around",
        "Echoes of memory, feedback delays",
        "Lost in the depths of acoustic phase."
      ],
      lyricsTranslated: [
        "Deep underwater exploration soundwave ping",
        "Ocean currents carrying messages to bring",
        "Reflections of past tapes decaying slowly",
        "Surrendering to ambient echoes fully."
      ],
      linemeanings: [
        "Reference to sub-aquatic travel and auditory sonar pings.",
        "Symbolizes thoughts floating inside unconscious focus fields.",
        "Acoustic description of modular feedback delay loops used in the synthesizer.",
        "Entering a deep state of mental relief and decompression."
      ]
    },
    {
      id: 5,
      title: "Dawn of Tomorrow",
      artist: "Aura Ensemble",
      album: "Ascension",
      duration: 198,
      genre: "Classical Orchestral",
      moods: ["Happy", "Motivated"],
      chords: ["G", "D", "Em", "C"],
      pianoNotes: ["G4", "D4", "E4", "C4"],
      lyrics: [
        "Morning golden rays break the haze",
        "Walking into brand new sunny day",
        "Orchestral strings begin to rise",
        "We see hope in bright cyan skies."
      ],
      lyricsTranslated: [
        "Golden rays of fresh morning sunrise",
        "Entering a world of endless bright surprise",
        "The symphonic violins swell and command",
        "Looking out over a peaceful creative land."
      ],
      linemeanings: [
        "Symbolizes waking up refreshed after an intense focus block.",
        "Leaving yesterday's bugs and debug logs behind.",
        "Acoustic breakdown of the cello/violin layers.",
        "Fostering hope and positive mental clarity."
      ]
    }
  ];

  // Active Play State variables
  const [currentTracks, setCurrentTracks] = useState<Track[]>(trackDatabase);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  useEffect(() => {
    if (isPlaying) {
      setHasPlayedOnce(true);
    }
  }, [isPlaying]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentMood, setCurrentMood] = useState<string>("Focused");

  // Custom polished alerts/modals state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const [audioQuality, setAudioQuality] = useState<"FLAC" | "MP3">("FLAC");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [selectedMix, setSelectedMix] = useState<{
    title: string;
    sub: string;
    from: string;
    playIdx: number;
    saves: string;
    tracks: Track[];
  } | null>(null);

  // Focus and Speech Synthesized search features
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [micListeningStatus, setMicListeningStatus] = useState("Listening...");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const startSimulatedMic = () => {
    setShowVoiceDialog(true);
    setMicListeningStatus("Initializing Aura Vocal Interface...");
    setVoiceTranscript("");

    // Detect if Web Speech API is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setMicListeningStatus("Listening Live via Browser Mic...");
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error backoff", event.error);
          if (event.error === "not-allowed") {
            setMicListeningStatus("Mic permission denied. Running biometric simulation...");
          } else {
            setMicListeningStatus(`Signal interrupted (${event.error}). Running simulation...`);
          }
          // Fallback to simulation
          setTimeout(() => {
            runSimulationFallback();
          }, 1000);
        };

        recognition.onresult = (event: any) => {
          const transcriptResult = event.results[0][0].transcript;
          setVoiceTranscript(transcriptResult);
          setMicListeningStatus("Recognized Live Speech ✓");
          setTimeout(() => {
            setShowVoiceDialog(false);
            executeVoiceCommand(transcriptResult);
          }, 1500);
        };

        recognition.start();
      } catch (err) {
        console.error("Speech Recognition failed to start", err);
        runSimulationFallback();
      }
    } else {
      // Graceful fallback to simulated voice biometric patterns
      runSimulationFallback();
    }
  };

  const runSimulationFallback = () => {
    setMicListeningStatus("Initializing Aura Vocal Interface...");
    setVoiceTranscript("");
    
    setTimeout(() => {
      setMicListeningStatus("Listening closely to your speech...");
    }, 800);

    const spokenPhrases = [
      "Recommend Silent Rain acoustic lofi",
      "Play Coding Mix",
      "Let's play Binary Moonlight",
      "Find electronic music moods",
      "Suggest focus Study Mix"
    ];
    const phrase = spokenPhrases[Math.floor(Math.random() * spokenPhrases.length)];

    setTimeout(() => {
      setMicListeningStatus("De-noising & processing voice biometric patterns...");
    }, 1800);

    // Letter-by-letter typing animation for the transcript
    setTimeout(() => {
      setMicListeningStatus("Recognized Command ✓");
      let currentLen = 0;
      const interval = setInterval(() => {
        if (currentLen <= phrase.length) {
          setVoiceTranscript(phrase.slice(0, currentLen));
          currentLen++;
        } else {
          clearInterval(interval);
          // Execute the voice action
          setTimeout(() => {
            setShowVoiceDialog(false);
            executeVoiceCommand(phrase);
          }, 1500);
        }
      }, 50);
    }, 2800);
  };

  const executeVoiceCommand = (command: string) => {
    const cmdLower = command.toLowerCase();
    
    // Add a beautiful notification alert
    setNotifications(prev => [
      { 
        id: Date.now(), 
        title: "Voice command recognized", 
        message: `Aura voice search activated: "${command}" executed successfully.`, 
        reads: false, 
        time: "Just Now" 
      },
      ...prev
    ]);

    if (cmdLower.includes("coding")) {
      const codingMixSongs = getMixTracks("Coding Mix", trackDatabase);
      setSelectedMix({
        title: "Coding Mix",
        sub: "Lofi Developer Beats & Compiler Waves",
        from: "from-indigo-900 to-black/30",
        playIdx: 1,
        saves: "820,114 saves",
        tracks: codingMixSongs
      });
      alert("🎤 Voice Command Confirmed! Opening your 'Coding Mix' workflow session!");
    } else if (cmdLower.includes("study") || cmdLower.includes("focus")) {
      const studyMixSongs = getMixTracks("Study Mix", trackDatabase);
      setSelectedMix({
        title: "Study Mix",
        sub: "Binaural Cognitive Study Booster Loops",
        from: "from-emerald-900 to-black/30",
        playIdx: 3,
        saves: "1,105,420 saves",
        tracks: studyMixSongs
      });
      alert("🎤 Voice Command Confirmed! Opening your 'Study Mix' workflow session!");
    } else if (cmdLower.includes("silent rain")) {
      const foundIdx = trackDatabase.findIndex(t => t.title === "Silent Rain");
      if (foundIdx !== -1) {
        auraAudio.init();
        setCurrentTracks(trackDatabase);
        setCurrentTrackIndex(foundIdx);
        setCurrentTime(0);
        setIsPlaying(true);
        alert("🎤 Voice Command Confirmed! Now playing 'Silent Rain' acoustic instrumental loop.");
      }
    } else if (cmdLower.includes("binary moonlight")) {
      const foundIdx = trackDatabase.findIndex(t => t.title === "Binary Moonlight");
      if (foundIdx !== -1) {
        auraAudio.init();
        setCurrentTracks(trackDatabase);
        setCurrentTrackIndex(foundIdx);
        setCurrentTime(0);
        setIsPlaying(true);
        alert("🎤 Voice Command Confirmed! Now playing 'Binary Moonlight' ambient session.");
      }
    } else {
      setHubSearchQuery(command);
      alert(`🎤 Voice command populated your search input with: "${command}"`);
    }
  };

  const getAICopilotRecommendations = (mixTitle: string): Track[] => {
    if (mixTitle === "Daily Mix") {
      return [
        {
          id: 9001,
          title: "Starlight Syntax",
          artist: "Aura Ensemble",
          album: "Synthesizer Realms",
          duration: 195,
          genre: "Acoustic Ambient",
          moods: ["Focused", "Relaxed"],
          chords: ["Am7", "G", "C", "Fmaj7"],
          pianoNotes: ["A4", "G4", "C4", "F4"],
          lyrics: ["Under stellar night-sky views", "Sipping coffee, writing news"],
          lyricsTranslated: ["Under beautiful night skies"],
          linemeanings: ["Relaxed acoustic ambient rhythm"]
        },
        {
          id: 9002,
          title: "Solfeggio Resonance Alpha",
          artist: "Resonance Lab",
          album: "Solfeggio Frequencies",
          duration: 250,
          genre: "Binaural Healing",
          moods: ["Relaxed"],
          chords: ["Cmaj7", "Fmaj7", "Cmaj7", "Fmaj7"],
          pianoNotes: ["E4", "F4", "E4", "F4"],
          lyrics: ["Harmonizing frequency scales", "Letting go of structural fails"],
          lyricsTranslated: ["Symmetric clean frequencies"],
          linemeanings: ["528Hz Solfeggio soundscapes"]
        }
      ];
    } else if (mixTitle === "Coding Mix") {
      return [
        {
          id: 9101,
          title: "Sub-pixel Grid Warp",
          artist: "Silicon Symphony",
          album: "Terminal Beats",
          duration: 182,
          genre: "Synthwave / Lofi",
          moods: ["Focused", "Motivated"],
          chords: ["Am", "G", "F", "E7"],
          pianoNotes: ["A4", "G4", "F4", "E4"],
          lyrics: ["Warping across sub-pixel grids", "Unlocking memories of creative kids"],
          lyricsTranslated: ["Moving through beautiful terminal pipelines"],
          linemeanings: ["Accelerated grid scanning waveforms"]
        },
        {
          id: 9102,
          title: "Heap Allocation Wave",
          artist: "Cybernetica",
          album: "Memory Stack",
          duration: 164,
          genre: "Synth Wave",
          moods: ["Focused"],
          chords: ["Am", "F", "C", "G"],
          pianoNotes: ["A4", "F4", "C4", "G4"],
          lyrics: ["Safely pushing objects to memory store", "Unlocking performance gates or more"],
          lyricsTranslated: ["Releasing compiled variables"],
          linemeanings: ["Synthesizer wave modeling heap variables"]
        }
      ];
    } else if (mixTitle === "Gym Mix") {
      return [
        {
          id: 9201,
          title: "Metabolic Surge",
          artist: "Electro Pulse",
          album: "Hyper Charge",
          duration: 210,
          genre: "Hardcore EDM",
          moods: ["Motivated"],
          chords: ["Fm", "Db", "Ab", "Eb"],
          pianoNotes: ["F4", "Db4", "Ab4", "Eb4"],
          lyrics: ["Vitals pumping, cellular race", "Overclocking physical pace"],
          lyricsTranslated: ["Raising mental output stats"],
          linemeanings: ["Fast 130 BPM high-voltage beat"]
        },
        {
          id: 9202,
          title: "Pre-workout Static",
          artist: "Bass Cannon",
          album: "Infinite Set",
          duration: 174,
          genre: "Industrial Dub",
          moods: ["Motivated"],
          chords: ["Em", "C", "G", "D"],
          pianoNotes: ["E4", "C4", "G4", "D4"],
          lyrics: ["Static charge fills the cold gym air", "Focus coordinates locked right there"],
          lyricsTranslated: ["Preparing heavy weights loop cycle"],
          linemeanings: ["Sub-harmonic baseline resonance"]
        }
      ];
    } else if (mixTitle === "Study Mix") {
      return [
        {
          id: 9301,
          title: "Cognitive Re-indexing",
          artist: "Neural Beats",
          album: "Bio Circuits v1",
          duration: 260,
          genre: "Ambient Lofi",
          moods: ["Focused"],
          chords: ["Am7", "F", "C", "G"],
          pianoNotes: ["C4", "E4", "G4", "A4"],
          lyrics: ["Re-arranging knowledge structures in order", "Surpassing logical focus border"],
          lyricsTranslated: ["Organizing data pools cleanly"],
          linemeanings: ["Alpha-wave focus entrainment frequency"]
        },
        {
          id: 9302,
          title: "Monastery Calmness",
          artist: "Horizon",
          album: "Natural Acoustics",
          duration: 192,
          genre: "Acoustic Piano",
          moods: ["Relaxed"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["C4", "G4", "A4", "F4"],
          lyrics: ["Tibetan resonant bowls & piano keys", "Calming active mental degrees"],
          lyricsTranslated: ["Soft acoustic vibrations"],
          linemeanings: ["Buddhist monastery meditation acoustic ambiance"]
        }
      ];
    } else {
      return [
        {
          id: 9401,
          title: "Digital Campfire",
          artist: "Horizon",
          album: "Digital Campfire",
          duration: 180,
          genre: "Acoustic Lofi",
          moods: ["Relaxed"],
          chords: ["Cmaj7", "A7", "Dm7", "G7"],
          pianoNotes: ["C4", "A4", "D4", "G4"],
          lyrics: ["Campfire wood crackles under code", "Unloading algorithms heavy load"],
          lyricsTranslated: ["Sitting beside modern acoustic fire"],
          linemeanings: ["Woodfire pops integrated with lofi drums"]
        }
      ];
    }
  };

  const getMixTracks = (mixTitle: string, baseTracks: Track[]): Track[] => {
    if (mixTitle === "Daily Mix") {
      return [
        {
          id: 1001,
          title: "Binary Moonlight",
          artist: "Horizon",
          album: "Compiler Dreams",
          duration: 184,
          genre: "Ambient Lo-Fi",
          moods: ["Focused", "Relaxed"],
          chords: ["Am7", "Dm7", "G7", "Cmaj7"],
          pianoNotes: ["A4", "C4", "E4", "G4"],
          lyrics: ["Quiet keys beneath the screens", "Compiling state of coded dreams"],
          lyricsTranslated: ["Heaves of silent keys over screens", "Synthesizing state loops and quiet dreams"],
          linemeanings: ["Metaphor for typing in silence"]
        },
        {
          id: 1002,
          title: "Silent Rain",
          artist: "Horizon",
          album: "Natural Acoustics",
          duration: 160,
          genre: "Acoustic Piano",
          moods: ["Relaxed", "Sad"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["C4", "G4", "A4", "F4"],
          lyrics: ["Drips of water on the silver glass", "Waiting for the midnight storm to pass"],
          lyricsTranslated: ["Soft raindrops falling outside"],
          linemeanings: ["Simulates peaceful natural rainfall"]
        },
        {
          id: 1003,
          title: "Deep Sea Echoes",
          artist: "Abyss",
          album: "Sonar Vibrations",
          duration: 242,
          genre: "Experimental Ambient",
          moods: ["Focused", "Stressed"],
          chords: ["Fmaj7", "Em7", "Dm7", "Cmaj7"],
          pianoNotes: ["F4", "E4", "D4", "C4"],
          lyrics: ["Down in the blue, analog sonar sound", "Under current waves spinning around"],
          lyricsTranslated: ["Underwater exploration soundwave ping"],
          linemeanings: ["Sonar feedback pings"]
        },
        {
          id: 1004,
          title: "Chamber of Code",
          artist: "Silicon Symphony",
          album: "Compiler Dreams",
          duration: 224,
          genre: "Synth Wave",
          moods: ["Focused"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["E4", "G4", "C4", "A4"],
          lyrics: ["Within the logic gates of deep memory stacks", "Moving forward on performance tracks"],
          lyricsTranslated: ["Sailing inside microprocessors"],
          linemeanings: ["Synth arpeggiator waves"]
        },
        {
          id: 1005,
          title: "Aura Flow",
          artist: "Neural Beats",
          album: "Bio Circuits v1",
          duration: 215,
          genre: "Ambient Lofi",
          moods: ["Focused"],
          chords: ["Am7", "F", "C", "G"],
          pianoNotes: ["C4", "E4", "G4", "A4"],
          lyrics: ["Neural pathways synchronize in light", "Flowing through code-blocks deep in the night"],
          lyricsTranslated: ["Pathways align with perfect execution speed"],
          linemeanings: ["Inspired by bio feedback brain waveforms"]
        }
      ];
    } else if (mixTitle === "Coding Mix") {
      return [
        {
          id: 2001,
          title: "Late Night Code",
          artist: "Lofi Dev",
          album: "Terminal Beats",
          duration: 192,
          genre: "Synthwave / Lofi",
          moods: ["Focused", "Motivated"],
          chords: ["Am", "F", "C", "G"],
          pianoNotes: ["A4", "F4", "C4", "G4"],
          lyrics: ["Dark theme active, cold coffee cold brew", "Compiling lines of logic new"],
          lyricsTranslated: ["Compiling logic in absolute flow state"],
          linemeanings: ["Standard midnight code session vibe"]
        },
        {
          id: 2002,
          title: "Neon Overdrive",
          artist: "CyberPulse",
          album: "Cybernetic Velocity",
          duration: 215,
          genre: "Synthwave / EDM",
          moods: ["Motivated", "Happy"],
          chords: ["Am", "F", "C", "G"],
          pianoNotes: ["A4", "F4", "C4", "G4"],
          lyrics: ["Adrenaline surges, voltage high", "We move like shadows through the sky"],
          lyricsTranslated: ["Pure energy moving with speed"],
          linemeanings: ["Focus accelerator beats"]
        },
        {
          id: 2003,
          title: "Compiler Dreams",
          artist: "Silicon Symphony",
          album: "Circuit Boards",
          duration: 210,
          genre: "Experimental Synth",
          moods: ["Focused"],
          chords: ["Em", "C", "G", "D"],
          pianoNotes: ["E4", "C4", "G4", "D4"],
          lyrics: ["Memory allocated safely", "Garbage collected cleanly"],
          lyricsTranslated: ["Perfect automatic cleanup cycle complete"],
          linemeanings: ["Choral synthesizer arrangement"]
        },
        {
          id: 2004,
          title: "Algorithm Coffee",
          artist: "Horizon",
          album: "Compiler Dreams",
          duration: 225,
          genre: "Lofi Acoustical",
          moods: ["Focused", "Relaxed"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["C4", "G4", "A4", "F4"],
          lyrics: ["Lost in the algorithms of life", "No more debugging inner strife"],
          lyricsTranslated: ["Where did we get lost in the digital cloud?"],
          linemeanings: ["Deep emotional connection loop"]
        },
        {
          id: 2005,
          title: "Stack Overflow",
          artist: "CyberPulse",
          album: "Cybernetic Velocity",
          duration: 194,
          genre: "Synth Pop",
          moods: ["Focused", "Motivated"],
          chords: ["Am", "G", "F", "E7"],
          pianoNotes: ["A4", "G4", "F4", "E4"],
          lyrics: ["Infinite queries on the screen", "Safest recursion loop we have seen"],
          lyricsTranslated: ["Searching for answers"],
          linemeanings: ["Fast and hyper-focused logic rhythm"]
        }
      ];
    } else if (mixTitle === "Gym Mix") {
      return [
        {
          id: 3001,
          title: "Neon Overdrive",
          artist: "CyberPulse",
          album: "Cybernetic Velocity",
          duration: 215,
          genre: "Synthwave / EDM",
          moods: ["Motivated", "Happy"],
          chords: ["Am", "F", "C", "G"],
          pianoNotes: ["A4", "F4", "C4", "G4"],
          lyrics: ["Adrenaline surges, voltage high", "We move like shadows through the sky"],
          lyricsTranslated: ["Pure energy moving with speed"],
          linemeanings: ["Describes high-voltage mental clarity after a good breakthrough."]
        },
        {
          id: 3002,
          title: "Cardio Cascade",
          artist: "Electro Surge",
          album: "Hyper Charge",
          duration: 180,
          genre: "Hardcore EDM",
          moods: ["Motivated"],
          chords: ["Fm", "Db", "Ab", "Eb"],
          pianoNotes: ["F4", "Db4", "Ab4", "Eb4"],
          lyrics: ["Push past the zone limitations", "Synchronized cardiac vibrations"],
          lyricsTranslated: ["Exceeding heart-rate and lactic thresholds"],
          linemeanings: ["Engineered for 120 BPM active workout routines"]
        },
        {
          id: 3003,
          title: "Pulse of Power",
          artist: "Bass Cannon",
          album: "Infinite Set",
          duration: 210,
          genre: "Electronic Dub",
          moods: ["Motivated"],
          chords: ["Em", "Em7", "C", "B7"],
          pianoNotes: ["E4", "E4", "C4", "B4"],
          lyrics: ["Drop the frequency resonance low", "Feel the ground shatter below"],
          lyricsTranslated: ["Subwoofer bass frequencies engaging muscles"],
          linemeanings: ["Heavy baseline drops for gym sets"]
        },
        {
          id: 3004,
          title: "Dawn of Tomorrow",
          artist: "Aura Ensemble",
          album: "Ascension",
          duration: 198,
          genre: "Classical Orchestral",
          moods: ["Happy", "Motivated"],
          chords: ["G", "D", "Em", "C"],
          pianoNotes: ["G4", "D4", "E4", "C4"],
          lyrics: ["Morning golden rays break the haze", "Walking into brand new sunny day"],
          lyricsTranslated: ["Golden rays of fresh morning sunrise"],
          linemeanings: ["Inspirational swelling chords"]
        },
        {
          id: 3005,
          title: "Beast Reflector",
          artist: "Heavy Iron",
          album: "Symmetric Lift",
          duration: 240,
          genre: "Industrial Beats",
          moods: ["Motivated"],
          chords: ["Am", "Dm", "F", "G"],
          pianoNotes: ["A4", "D4", "F4", "G4"],
          lyrics: ["Reflecting power onto heavy iron", "Inner voice matches the eyes of a lion"],
          lyricsTranslated: ["Absolute focus on physical sets"],
          linemeanings: ["Rhythmic heavy guitar riffs with metallic industrial accents"]
        }
      ];
    } else if (mixTitle === "Study Mix") {
      return [
        {
          id: 4001,
          title: "Silent Rain",
          artist: "Horizon",
          album: "Natural Acoustics",
          duration: 160,
          genre: "Acoustic Piano",
          moods: ["Relaxed", "Sad"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["C4", "G4", "A4", "F4"],
          lyrics: ["Soft raindrops falling outside", "Letting go of stressful thoughts and strain"],
          lyricsTranslated: ["Simple acoustic notes, resonant and clean"],
          linemeanings: ["Simulates peaceful natural rainfall hitting windows."]
        },
        {
          id: 4002,
          title: "Synthesized Scholar",
          artist: "Alpha Wave",
          album: "Brain Resonance",
          duration: 300,
          genre: "Binaural Chill",
          moods: ["Focused"],
          chords: ["Dm7", "G7", "Cmaj7", "Fmaj7"],
          pianoNotes: ["D4", "G4", "C4", "F4"],
          lyrics: ["Wave oscillations aligning neural channels", "Cracking complex logic books and text panels"],
          lyricsTranslated: ["Perfect wave phase locking for focus"],
          linemeanings: ["Real sound frequencies for deep concentration"]
        },
        {
          id: 4003,
          title: "Quiet Library Pages",
          artist: "Acoustic Dream",
          album: "Concentration",
          duration: 260,
          genre: "Neo-Classical",
          moods: ["Relaxed", "Focused"],
          chords: ["Gmaj7", "Em7", "Cmaj7", "D7"],
          pianoNotes: ["G4", "E4", "C4", "D4"],
          lyrics: ["Soft dust dancing in the sunbeam", "Quiet pages turning while we code our dream"],
          lyricsTranslated: ["Golden rays casting light on learning pads"],
          linemeanings: ["Gentle acoustic guitar with lofi crackles"]
        },
        {
          id: 4004,
          title: "Binary Moonlight",
          artist: "Horizon",
          album: "Compiler Dreams",
          duration: 184,
          genre: "Ambient Lo-Fi",
          moods: ["Focused", "Relaxed"],
          chords: ["Am7", "Dm7", "G7", "Cmaj7"],
          pianoNotes: ["A4", "C4", "E4", "G4"],
          lyrics: ["Quiet keys beneath the screens", "Compiling state of coded dreams"],
          lyricsTranslated: ["Digital moonlight on dark wooden setups"],
          linemeanings: ["Cosy ambient coding session lofi loops"]
        },
        {
          id: 4005,
          title: "Ocean of Depth",
          artist: "Deep Study",
          album: "Focus Station",
          duration: 280,
          genre: "Drone / Ambient",
          moods: ["Focused"],
          chords: ["Cmaj7", "Fmaj7", "Cmaj7", "Fmaj7"],
          pianoNotes: ["C4", "F4", "C5", "F4"],
          lyrics: ["In the database of academic codes", "Calming waves taking loads off mental nodes"],
          lyricsTranslated: ["Harmonizing thoughts under heavy workloads"],
          linemeanings: ["Atmospheric chord structures to block distraction"]
        }
      ];
    } else if (mixTitle === "Sleep Mix") {
      return [
        {
          id: 5001,
          title: "Deep Sea Echoes",
          artist: "Abyss",
          album: "Sonar Vibrations",
          duration: 242,
          genre: "Experimental Ambient",
          moods: ["Focused", "Stressed"],
          chords: ["Fmaj7", "Em7", "Dm7", "Cmaj7"],
          pianoNotes: ["F4", "E4", "D4", "C4"],
          lyrics: ["Down in the blue, analog sonar sound", "Under current waves spinning around"],
          lyricsTranslated: ["Surrendering to deep modular feedback delayed loops"],
          linemeanings: ["Deep underwater decompression soundscape pings"]
        },
        {
          id: 5002,
          title: "Slow Sleep Freq",
          artist: "Somnus",
          album: "Delta Cycles",
          duration: 480,
          genre: "Binaural Delta",
          moods: ["Relaxed"],
          chords: ["C", "F", "Am", "G"],
          pianoNotes: ["C3", "F3", "A3", "G3"],
          lyrics: ["Brainwaves engage in deep rest", "Calming heart rhythms at their best"],
          lyricsTranslated: ["Letting physical systems sleep and restore"],
          linemeanings: ["Slow, heavy acoustic synth loops tuned specifically to relax core nerves"]
        },
        {
          id: 5003,
          title: "Ocean of Breath",
          artist: "Zen Garden",
          album: "Sinking Warmth",
          duration: 400,
          genre: "Meditation Ambient",
          moods: ["Relaxed"],
          chords: ["G", "C", "G", "C"],
          pianoNotes: ["G3", "C4", "G3", "C3"],
          lyrics: ["Breathing loops deep and slow", "Watching tensions melt below"],
          lyricsTranslated: ["Symmetric rising and falling air streams"],
          linemeanings: ["Soft breathing cadence cues for relaxation"]
        },
        {
          id: 5004,
          title: "Silent Rain",
          artist: "Horizon",
          album: "Natural Acoustics",
          duration: 160,
          genre: "Acoustic Piano",
          moods: ["Relaxed"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["C4", "G4", "A4", "F4"],
          lyrics: ["Drips of water on the silver glass", "Waiting for the midnight storm to pass"],
          lyricsTranslated: ["Under the soft blankets watching storm patterns roll by"],
          linemeanings: ["Slightly filtered rain noise loop combined with warm piano pads"]
        },
        {
          id: 5005,
          title: "Cradles in Space",
          artist: "Nebula",
          album: "Star Dust",
          duration: 350,
          genre: "Ambient Cosms",
          moods: ["Relaxed"],
          chords: ["Am7", "Fmaj7", "Cmaj7", "G7"],
          pianoNotes: ["A3", "F3", "C4", "G3"],
          lyrics: ["Floating in starlight far from the crowd", "Slowly, completely turning upside down"],
          lyricsTranslated: ["Warm stellar gravity field locking the mind safely"],
          linemeanings: ["Astral sound structures for effortless deep sleep transition"]
        }
      ];
    } else {
      return [
        {
          id: 6001,
          title: "Dawn of Tomorrow",
          artist: "Aura Ensemble",
          album: "Ascension",
          duration: 198,
          genre: "Classical Orchestral",
          moods: ["Happy", "Motivated"],
          chords: ["G", "D", "Em", "C"],
          pianoNotes: ["G4", "D4", "E4", "C4"],
          lyrics: ["Morning golden rays break the haze", "Walking into brand new sunny day"],
          lyricsTranslated: ["Golden rays over open mountain roads"],
          linemeanings: ["Inspirational sweeping orchestral string rise to start journeys"]
        },
        {
          id: 6002,
          title: "Wanderlust Acoustic",
          artist: "Sky Patrol",
          album: "Horizon",
          duration: 220,
          genre: "Acoustic Folk",
          moods: ["Happy", "Relaxed"],
          chords: ["D", "Dsus4", "G", "A"],
          pianoNotes: ["D4", "G4", "A4", "D4"],
          lyrics: ["Clear asphalt lines drawing down the path", "Escaping the routine concrete cage math"],
          lyricsTranslated: ["Chasing coordinates over deep green valleys"],
          linemeanings: ["Pure wooden bright acoustic strums with rhythmic handclaps"]
        },
        {
          id: 6003,
          title: "Railway Harmonies",
          artist: "Acoustic Pulse",
          album: "Wanderlust",
          duration: 240,
          genre: "Indie Pop",
          moods: ["Relaxed", "Happy"],
          chords: ["Cmaj7", "Fmaj7", "Am7", "G"],
          pianoNotes: ["C4", "F4", "A4", "G4"],
          lyrics: ["Rhythmic click-clacks of train steel track bars", "Glazing at stars from dynamic coach cars"],
          lyricsTranslated: ["Moving steadily across vast beautiful countrysides"],
          linemeanings: ["Cozy, acoustic guitar pluckings with live train track background crackles"]
        },
        {
          id: 6004,
          title: "Campfire Harmony",
          artist: "Folk Vibes",
          album: "Cozy Fire",
          duration: 180,
          genre: "Folk Indie",
          moods: ["Relaxed"],
          chords: ["C", "F", "G", "C"],
          pianoNotes: ["C4", "F4", "G4", "C4"],
          lyrics: ["Wood fires roasting, sparks popping high", "Laughing with travelers under midnight sky"],
          lyricsTranslated: ["Singing hand-in-hand in the peaceful wilderness camp"],
          linemeanings: ["Dry crackling woodfire loops blended with campfire acoustic singalong tracks"]
        },
        {
          id: 6005,
          title: "Silent Rain",
          artist: "Horizon",
          album: "Natural Acoustics",
          duration: 160,
          genre: "Acoustic Piano",
          moods: ["Relaxed"],
          chords: ["C", "G", "Am", "F"],
          pianoNotes: ["C4", "G4", "A4", "F4"],
          lyrics: ["Drips of water on the silver glass", "Waiting for the midnight storm to pass"],
          lyricsTranslated: ["Driving slowly with raindrops bouncing off windshield glass"],
          linemeanings: ["Cozy transit mood setter"]
        }
      ];
    }
  };

  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);

  // Focus sound state link helpers (visualizer bars)
  const currentTrack = currentTracks[currentTrackIndex] || trackDatabase[0];

  // AI Active filter settings for "AI Remix Studio"
  const [activeRemix, setActiveRemix] = useState<"Default" | "Lo-Fi" | "EDM" | "Nightcore" | "Acoustic" | "Piano">("Default");
  const [remixMessage, setRemixMessage] = useState<string>("Standard stream format playing at 44.1kHz / 24-bit lossless.");

  // AI DJ chat log state
  const [djMessages, setDjMessages] = useState<ChatMessage[]>([
    { sender: "aura", text: "Hey! I am DJ Aura, your intelligent music co-designer. Type any prompt here to play focus music, skip boring beats, or create mood-matching track configurations!", timestamp: "09:09" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isDjloding, setIsDjloding] = useState(false);

  // AI custom prompt playlist generator state
  const [playlistPrompt, setPlaylistPrompt] = useState("");
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({
    1: true,
    3: true
  });
  const toggleLike = (id: number) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const arijitSinghTracks: Track[] = [
    {
      id: 8001,
      title: "Heeriye (Aura Cyber Remix)",
      artist: "Arijit Singh x Jasleen Royal",
      album: "Cyber Heeriye",
      duration: 194,
      genre: "Electro-Pop Soul",
      moods: ["Motivated", "Happy"],
      chords: ["Cmaj7", "G", "Am", "F"],
      pianoNotes: ["C4", "G4", "A4", "F4"],
      lyrics: [
        "Heeriye Heeriye aa...",
        "Lead me through the cyberspace lines",
        "Your love is like a compiler that shines",
        "We debug loneliness tonight."
      ],
      lyricsTranslated: [
        "O my beloved beloved...",
        "Guiding me safely through digital pipelines",
        "Your beautiful presence is like deep moonlight",
        "Releasing stress loops in the quiet of night."
      ],
      linemeanings: [
        "Classic beautiful Punjabi vocal line with modern synth arpeggios.",
        "Metaphor for deep connection over distant connections.",
        "Reflects the warm feeling of solving a long-term problem with help.",
        "Warm acoustic ambiance for nocturnal coding."
      ]
    },
    {
      id: 8002,
      title: "Shayad (Lofi Acoustic Focus)",
      artist: "Arijit Singh x Pritam",
      album: "Love Aaj Kal (AI Session)",
      duration: 200,
      genre: "Acoustic Lo-Fi",
      moods: ["Focused", "Relaxed"],
      chords: ["G", "D", "Em", "C"],
      pianoNotes: ["G4", "D4", "E4", "C4"],
      lyrics: [
        "Shayad kabhi na kehh sakoon mein tumko...",
        "Perhaps these algorithms can never tell",
        "How deeply our focus frequencies fell",
        "Under the calm keyboard swell."
      ],
      lyricsTranslated: [
        "Perhaps I may never be able to tell you...",
        "Maybe computerized waves can never truly explain",
        "The deep acoustic healing after the hard work pain",
        "Finding mental focus and sweet peace again."
      ],
      linemeanings: [
        "Deeply sentimental hindi acoustic lines.",
        "Reflects the struggle of explaining complex emotional states.",
        "Highlights combining beautiful classical instruments with modern lofi.",
        "Chasing perfect flow without interruptions."
      ]
    },
    {
      id: 8003,
      title: "Channa Mereya (Binaural Sad Sitar)",
      artist: "Arijit Singh x Aura Ensemble",
      album: "Soulful Frequencies",
      duration: 230,
      genre: "Binaural Healing / Sitar Ambient",
      moods: ["Relaxed", "Sad"],
      chords: ["Am", "G", "F", "E7"],
      pianoNotes: ["A4", "G4", "F4", "E4"],
      lyrics: [
        "Acche chalta hoon, duaon mein yaad rakhna...",
        "Now I depart, keep my code in your store",
        "Under the biometric system forevermore",
        "Safe behind the sandbox door."
      ],
      lyricsTranslated: [
        "I shall leave now, keep me in your blessings...",
        "As we close this session, remember the memories we made",
        "Under the stardust where binary systems fade",
        "Keeping focused as the quiet night is played."
      ],
      linemeanings: [
        "Deeply emotional departure anthem.",
        "Symbolizes completing a magnificent workspace or project journey.",
        "Focusing on the beauty of creation despite end constraints.",
        "Mellow acoustic soundscapes with micro-tonal sitar drones."
      ]
    }
  ];

  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<Track[]>([
    trackDatabase[0],
    trackDatabase[1],
    trackDatabase[2]
  ]);

  const [downloadedTrackIds, setDownloadedTrackIds] = useState<number[]>([1, 2, 4]);

  // Track recently played changes dynamically
  useEffect(() => {
    if (currentTrack) {
      setRecentlyPlayedTracks(prev => {
        const filtered = prev.filter(t => t.id !== currentTrack.id);
        const nextList = [currentTrack, ...filtered];
        return nextList.slice(0, 20);
      });
    }
  }, [currentTrack]);

  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist | null>(null);
  const [isPlaylistGenerating, setIsPlaylistGenerating] = useState(false);

  // AI Song Generator detailed output
  const [promptSongCreator, setPromptSongCreator] = useState("");
  const [creatorGenre, setCreatorGenre] = useState("Lo-Fi Beats");
  const [creatorLanguage, setCreatorLanguage] = useState("English");
  const [isSongCreating, setIsSongCreating] = useState(false);
  const [generatedSongDetail, setGeneratedSongDetail] = useState<{
    title: string;
    lyrics: string;
    chordProgression: string;
    soundDesign: string;
    source: string;
  } | null>(null);

  // AI Lyrics Intelligence dynamic active index
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [lyricsExplanation, setLyricsExplanation] = useState<string>(
    "Click the analysis icons on any line on the left to reveal deep line semantic meaning, cultural contexts and accurate line translations from Gemini."
  );
  const [lyricsTranslation, setLyricsTranslation] = useState<string>(
    "English translation will be displayed here."
  );
  const [lyricsBackstory, setLyricsBackstory] = useState<string>(
    "Aura Music AI connects directly to Gemini. This dynamic pane will populate on demand when you hit study analysis on hooks."
  );
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);

  // Breathing wellness active cycles State
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breatheSeconds, setBreatheSeconds] = useState(4);

  // Voice Search Simulation state
  const [voiceSearchText, setVoiceSearchText] = useState("");
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Timing references
  const audioTimerRef = useRef<number | null>(null);
  const breatheTimerRef = useRef<number | null>(null);

  // 1. Playback Timer loop simulations
  useEffect(() => {
    if (isPlaying) {
      audioTimerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            if (isRepeatActive) {
              return 0; // restarts same track
            } else {
              handleNextTrack();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    }
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, [isPlaying, currentTrackIndex, currentTracks, currentTrack, isRepeatActive, isShuffleActive]);

  // Synchronize master Volume/Mute with audio context
  useEffect(() => {
    auraAudio.setMusicVolume(isMuted ? 0 : volume);
  }, [isMuted, volume]);

  // Real-time continuous generative music synthesizer matching track BPM and active remix filters
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let step = 0;
    const notes = currentTrack.pianoNotes && currentTrack.pianoNotes.length > 0 
      ? currentTrack.pianoNotes 
      : ["C4", "E4", "G4", "B4"];
    
    // Custom BPM defaults per track genre or active remix selection
    let bpm = 100;
    if (currentTrack.genre.toLowerCase().includes("edm") || activeRemix === "EDM") {
      bpm = 125;
    } else if (currentTrack.genre.toLowerCase().includes("ambient") || activeRemix === "Lo-Fi") {
      bpm = 80;
    } else if (currentTrack.genre.toLowerCase().includes("acoustic") || activeRemix === "Acoustic") {
      bpm = 90;
    }

    if (activeRemix === "Nightcore") {
      bpm = Math.round(bpm * 1.35);
    }

    // Interval duration (in millseconds) for 1/8th note steps
    const stepDurationMs = (60 / bpm) * 500;

    const noteToFreq: Record<string, number> = {
      "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63,
      "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00,
      "A#4": 466.16, "B4": 493.88, "C5": 523.25, "D5": 587.33, "E5": 659.25,
      "F5": 698.46, "G5": 783.99, "A5": 880.00
    };

    const synthInterval = window.setInterval(() => {
      try {
        // Find respective frequency of track notes
        const currentNoteName = notes[step % notes.length];
        let freq = noteToFreq[currentNoteName] || 440;

        // Shift frequency upwards if playing under Nightcore (+4 semitones pitch increase)
        if (activeRemix === "Nightcore") {
          freq = freq * 1.3;
        }

        // Determine oscillator timbre shape matching the remix setup
        const oscType = activeRemix === "Lo-Fi" ? "triangle" : 
                         activeRemix === "EDM" ? "sawtooth" : 
                         activeRemix === "Acoustic" ? "sine" : 
                         activeRemix === "Piano" ? "triangle" : "sine";

        // Dispatch synth notes to audio engine
        auraAudio.playSynthNote(freq, oscType, activeRemix === "Lo-Fi" ? 0.7 : 0.45);

        // Rhythm generator engine layer based on active mood and speed
        const isElectroGenre = currentTrack.genre.toLowerCase().includes("edm") || activeRemix === "EDM";
        const isChillGenre = currentTrack.genre.toLowerCase().includes("ambient") || currentTrack.genre.toLowerCase().includes("lo-fi") || activeRemix === "Lo-Fi";

        if (isElectroGenre) {
          // Play four-on-the-floor EDM kicks
          if (step % 2 === 0) {
            auraAudio.playKick();
          }
          if (step % 2 === 1) {
            auraAudio.playHihat();
          }
          if (step % 4 === 2) {
            auraAudio.playSnare();
          }
        } else if (isChillGenre) {
          // Relaxed Lo-fi beat pattern
          if (step % 4 === 0) {
            auraAudio.playKick();
          }
          if (step % 4 === 2) {
            auraAudio.playSnare();
          }
          if (step % 2 === 1 && Math.random() > 0.4) {
            auraAudio.playHihat();
          }
        } else {
          // Pleasant soft acoustic taps/clicks
          if (step % 8 === 0) {
            auraAudio.playKick();
          }
          if (step % 4 === 1 && Math.random() > 0.75) {
            auraAudio.playHihat();
          }
        }

        step = (step + 1) % 16;
      } catch (err) {
        console.warn("Synthesis engine loop error:", err);
      }
    }, stepDurationMs);

    return () => {
      window.clearInterval(synthInterval);
    };
  }, [isPlaying, currentTrack, activeRemix]);

  // Breathing Wellness animation clock loop
  useEffect(() => {
    breatheTimerRef.current = window.setInterval(() => {
      setBreatheSeconds(prev => {
        if (prev <= 1) {
          if (breathePhase === "Inhale") {
            setBreathePhase("Hold");
            return 4;
          } else if (breathePhase === "Hold") {
            setBreathePhase("Exhale");
            return 4;
          } else {
            setBreathePhase("Inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breatheTimerRef.current) clearInterval(breatheTimerRef.current);
    };
  }, [breathePhase]);

  // Audio actions toggle wrappers
  const handlePlayPause = () => {
    auraAudio.init(); // Warm Web Audio Context on user event
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTime(0);
    if (isShuffleActive && currentTracks.length > 1) {
      let nextIdx = currentTrackIndex;
      while (nextIdx === currentTrackIndex) {
        nextIdx = Math.floor(Math.random() * currentTracks.length);
      }
      setCurrentTrackIndex(nextIdx);
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % currentTracks.length);
    }
  };

  const handlePrevTrack = () => {
    setCurrentTime(0);
    if (isShuffleActive && currentTracks.length > 1) {
      let prevIdx = currentTrackIndex;
      while (prevIdx === currentTrackIndex) {
        prevIdx = Math.floor(Math.random() * currentTracks.length);
      }
      setCurrentTrackIndex(prevIdx);
    } else {
      setCurrentTrackIndex(prev => (prev - 1 + currentTracks.length) % currentTracks.length);
    }
  };

  const handleVolScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  // Skip and apply filter in AI Remix Studio
  const handleRemixApply = (remix: typeof activeRemix) => {
    auraAudio.init();
    setActiveRemix(remix);

    // Dynamic message configurations
    if (remix === "Default") {
      setRemixMessage("Standard stream format playing at 44.1kHz / 24-bit lossless.");
    } else if (remix === "Lo-Fi") {
      setRemixMessage("Applying Web Audio standard Lowpass filter at 1200Hz + warm vinyl hum modulation node.");
      // Trigger short lofi chime preview
      auraAudio.playSynthNote(220, "triangle", 0.5);
      auraAudio.playSynthNote(261.63, "triangle", 0.5);
    } else if (remix === "EDM") {
      setRemixMessage("Injecting a rhythmic compression gain envelope ducking at quarter-beat schedules.");
      auraAudio.playKick();
    } else if (remix === "Nightcore") {
      setRemixMessage("Speeding up synthesized rhythm track to 1.35x and shifting pitches up by +4 semitones.");
      auraAudio.playSynthNote(440, "sine", 0.2);
    } else if (remix === "Acoustic") {
      setRemixMessage("Enabling warm high shelving filter boosts matched with subtle stereo feedback chorus delay.");
      auraAudio.playSynthNote(329.63, "sine", 0.6);
    } else if (remix === "Piano") {
      setRemixMessage("Isolating solo piano melody channels using frequency passband filters.");
      auraAudio.playSynthNote(523.25, "triangle", 0.4);
    }
  };

  // Filter current tracks based on mood selection instantly
  const handleMoodSelect = (mood: string) => {
    auraAudio.init();
    setCurrentMood(mood);
    const filtered = trackDatabase.filter(t => t.moods.includes(mood));
    if (filtered.length > 0) {
      setCurrentTracks(filtered);
      setCurrentTrackIndex(0);
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      // Default fallback fallback
      setCurrentTracks(trackDatabase);
    }
  };

  // Voice search simulator logic
  const handleTriggerVoiceSpeech = () => {
    setIsListeningVoice(true);
    setVoiceSearchText("Analyzing signals...");
    
    const fakeKeywords = [
      "Play coding chill beats",
      "Find energetic EDM tracks",
      "Skip to some relaxing rain chords",
      "Generate a moody sad list"
    ];
    
    setTimeout(() => {
      const heard = fakeKeywords[Math.floor(Math.random() * fakeKeywords.length)];
      setVoiceSearchText(`Heard: "${heard}"`);
      setIsListeningVoice(false);
      
      // Submit as chat input
      setChatInput(heard);
    }, 2800);
  };

  // Submit dynamic AI DJ messages (Hits express backend!)
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    auraAudio.init();
    const userMsgText = chatInput;
    setDjMessages(prev => [...prev, { sender: "user", text: userMsgText, timestamp: "Just now" }]);
    setChatInput("");
    setIsDjloding(true);

    try {
      const response = await fetch("/api/chat-dj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          currentTrack,
          currentMood,
          queue: currentTracks.map(t => t.title)
        })
      });

      const data = await response.json();
      setDjMessages(prev => [...prev, { 
        sender: "aura", 
        text: data.text, 
        timestamp: "Now",
        playCommand: data.playCommand 
      }]);

      // If playCommand returned, perform actual target player actions!
      if (data.playCommand) {
        const cmd = data.playCommand;
        if (cmd.action === "PLAY_TRACK" && typeof cmd.index === "number") {
          setCurrentTrackIndex(cmd.index % currentTracks.length);
          setCurrentTime(0);
          setIsPlaying(true);
        } else if (cmd.action === "SKIP") {
          handleNextTrack();
        } else if (cmd.action === "PAUSE") {
          setIsPlaying(false);
        } else if (cmd.action === "CREATE_PLAYLIST" && cmd.prompt) {
          // Trigger playlist prompt generator automatically
          triggerAIPlaylistGeneration(cmd.prompt);
        }
      }

    } catch (err) {
      console.error("AI DJ endpoint error", err);
      setDjMessages(prev => [...prev, { sender: "aura", text: "Something glitched in our AI channel. I will keep spinning the local tracks!", timestamp: "Error" }]);
    } finally {
      setIsDjloding(false);
    }
  };

  // AI Playlist Generator REST action
  const triggerAIPlaylistGeneration = async (promptRaw: string) => {
    setIsPlaylistGenerating(true);
    setPlaylistPrompt(promptRaw);

    try {
      const res = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptRaw })
      });
      const data = await res.json();
      
      // Convert tracks schema to fit domain Model
      const parsedTracks: Track[] = data.tracks.map((t: any, idx: number) => {
        const pianoNotes = idx % 3 === 0 
          ? ["C4", "E4", "G4", "B4", "C5", "G4", "E4", "C4"] 
          : idx % 3 === 1 
            ? ["A4", "C4", "E4", "G4", "D4", "F4", "A4", "C4"] 
            : ["F4", "A4", "C5", "E5", "G4", "B4", "D5", "F4"];

        const chords = idx % 2 === 0 ? ["Cmaj7", "Am7", "Fmaj7", "G7"] : ["Am", "F", "C", "G"];

        return {
          id: 900 + idx,
          title: t.title,
          artist: t.artist,
          duration: t.duration || 180,
          genre: t.genre || "Ambient Flow",
          moods: [t.mood || "Focused"],
          chords: chords,
          pianoNotes: pianoNotes,
          lyrics: [
            `I hear the rhythm of ${t.title} rising high`,
            `The frequencies of ${t.artist} sweep across the sky`,
            `Step into the zone and focus your mind`,
            `Relentless drive is the focus we find`
          ],
          lyricsTranslated: [
            `Deep pulses of ${t.title} are echoing clear`,
            `Under ${t.genre} rhythms, the coding path is near`,
            `Find complete tranquility and clear your head`,
            `Moving with precision in the paths we tread`
          ],
          linemeanings: [
            `Captures the mental elevation of the prompt's focus goals.`,
            `Speaks to the seamless integration of ${t.genre} with active productivity.`,
            `Encourages entering a pure, uninterrupted flow state.`,
            `Highlights the continuous, comforting feedback of our Web Audio generator.`
          ]
        };
      });

      setCreatedPlaylist({
        id: "ai-playlist",
        name: data.name,
        description: data.description,
        tracks: parsedTracks,
        source: data.source
      });
    } catch (err) {
      console.error("Failed AI playlist prompt generation", err);
    } finally {
      setIsPlaylistGenerating(false);
    }
  };

  // AI Lyric Intelligence detailed queries
  const triggerLyricIntelligence = async (lineSnippet: string, lIdx: number) => {
    setActiveLyricIndex(lIdx);
    setIsLyricsLoading(true);

    try {
      const res = await fetch("/api/lyrics-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songTitle: currentTrack.title,
          artist: currentTrack.artist,
          lyricsSnippet: lineSnippet
        })
      });
      const data = await res.json();
      setLyricsExplanation(data.explanation);
      setLyricsTranslation(data.translation);
      setLyricsBackstory(data.story);
    } catch (err) {
      console.error(err);
      setLyricsExplanation("Offline Mode fallback: This verse explains the cerebral serenity found in long midnight debugging sessions.");
      setLyricsTranslation("Translations are offline, check your developer secrets API key.");
    } finally {
      setIsLyricsLoading(false);
    }
  };

  // AI Original Song lyric & track sheet creator
  const triggerOriginalSongCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptSongCreator.trim()) return;

    setIsSongCreating(true);
    try {
      const res = await fetch("/api/generate-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptSongCreator,
          genre: creatorGenre,
          language: creatorLanguage
        })
      });
      const data = await res.json();
      setGeneratedSongDetail({
        title: data.title,
        lyrics: data.lyrics,
        chordProgression: data.chordProgression,
        soundDesign: data.soundDesign,
        source: data.source
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSongCreating(false);
    }
  };

  // Load an AI-generated playlist sequence list directly into active streaming queue!
  const loadAIPlaylistIntoPlayer = (p: Playlist) => {
    auraAudio.init();
    setCurrentTracks(p.tracks);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
    // Notify DJ with message
    setDjMessages(prev => [...prev, { sender: "aura", text: `I've successfully loaded the freshly generated AI playlist: '${p.name}' into your active stream player. Let's study!`, timestamp: "Synced" }]);
  };

  // Load Smart Daily routines
  const loadSmartRoutine = (type: "morning" | "desk" | "evening" | "dream") => {
    auraAudio.init();
    if (type === "morning") {
      const filtered = trackDatabase.filter(t => t.moods.includes("Motivated") || t.moods.includes("Happy"));
      setCurrentTracks(filtered);
      setIsPlaying(true);
      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Loading your energetic morning workout drive playlist!", timestamp: "Slots" }]);
    } else if (type === "desk") {
      const filtered = trackDatabase.filter(t => t.moods.includes("Focused"));
      setCurrentTracks(filtered);
      setIsPlaying(true);
      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Focused desk chiptunes loaded! Good luck crushing commands.", timestamp: "Slots" }]);
    } else if (type === "evening") {
      const filtered = trackDatabase.filter(t => t.moods.includes("Relaxed"));
      setCurrentTracks(filtered);
      setIsPlaying(true);
      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Deep acoustic sunset chords loaded for a cozy twilight.", timestamp: "Slots" }]);
    } else {
      // Sleep routine - load deep sea + alpha brainwaves if clicked
      setCurrentTracks([trackDatabase[3]]); // select deepest track
      setIsPlaying(true);
      // Activate alpha drone volumes indirectly
      auraAudio.setBrainwaveVolume(0.4);
      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Sleep dreamscapes with 10Hz Alpha brainwaves enabled. Have a good rest.", timestamp: "Slots" }]);
    }
    setCurrentTrackIndex(0);
    setCurrentTime(0);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-screen w-screen bg-[#000000] text-slate-100 flex flex-col font-sans selection:bg-[#1db954] selection:text-black relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="aura-gradient"></div>

      {/* Mobile Sidebar backdrop overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/75 z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 1. Main Upper layout split: Left Sidebar & Right Center Content panel */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-145px)] md:h-[calc(100vh-90px)] h-[calc(100vh-145px)]">
        
        {/* LEFT NAV SIDEBAR (SPOTIFY THEMED) */}
        <aside className={`${isSidebarMinimized ? "w-20 p-3" : "w-64 p-4"} bg-black border-r border-zinc-900 flex flex-col shrink-0 justify-between select-none h-full overflow-y-auto spotify-scrollbar transition-all duration-300 fixed md:relative top-0 bottom-0 left-0 z-50 md:z-auto h-[calc(100vh-145px)] md:h-full ${isSidebarOpen ? "translate-x-0 shadow-2xl bg-[#090909]" : "-translate-x-full md:translate-x-0"}`}>
          {isSidebarMinimized ? (
            /* MINIMIZED VIEW: Touch A to reopen the all things */
            <div className="flex flex-col items-center h-full justify-between py-4 w-full">
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Main 'A' circular button */}
                <button
                  onClick={() => setIsSidebarMinimized(false)}
                  className="h-10 w-10 bg-[#1db954] hover:bg-[#1ed760] hover:scale-110 active:scale-95 text-black font-extrabold text-lg flex items-center justify-center rounded-full shadow-lg shadow-[#1db954]/40 select-none transition-all duration-300 relative group"
                  title="Expand Sidebar"
                >
                  A
                  {/* Pulse Ring */}
                  <span className="absolute inset-0 rounded-full border-2 border-[#1db954]/50 animate-ping opacity-75" />
                  
                  {/* Tooltip */}
                  <span className="absolute left-14 bg-zinc-950 text-[#1db954] border border-zinc-900 border-[#1db954]/20 text-[10px] py-1.5 px-3 rounded-lg font-mono font-bold shadow-2xl hidden group-hover:block whitespace-nowrap z-50 pointer-events-none">
                    ✨ Click A to Reopen All
                  </span>
                </button>

                <div className="h-[1px] w-6 bg-zinc-900" />

                {/* Minimal Icons for quick access */}
                <div className="flex flex-col items-center gap-4">
                  {[
                    { id: "musichub", label: "Music Hub", icon: Home },
                    { id: "musicdna", label: "Music DNA", icon: Activity, action: () => { setActiveTab("musicdna"); } },
                    { id: "studymode", label: "Study Mode", icon: Clock, action: () => { setActiveTab("pomodoro"); } },
                    { id: "settings", label: "Settings", icon: SettingsIcon, action: () => { setActiveTab("settings"); } }
                  ].map((it) => {
                    const IconComp = it.icon;
                    const isActive = it.id === "musicdna" ? (activeTab === "musicdna") : it.id === "musichub" ? (activeTab === "musichub") : it.id === "settings" ? (activeTab === "settings") : false;
                    return (
                      <button
                        key={it.id}
                        onClick={() => {
                          setSelectedMix(null);
                          if (it.action) {
                            it.action();
                          } else {
                            setActiveTab(it.id as any);
                          }
                          setIsSidebarMinimized(false); // Reopens sidebar automatically on menu click
                        }}
                        className={`p-2.5 rounded-xl transition-all duration-200 group relative ${
                          isActive 
                            ? "bg-zinc-900 text-[#1db954] border border-zinc-850 shadow-[0_0_12px_rgba(29,185,84,0.15)]" 
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900/40"
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${isActive ? "text-[#1db954] drop-shadow-[0_0_5px_#1db954]" : "text-zinc-500 hover:text-white"}`} />
                        <span className="absolute left-12 bg-zinc-950 text-white border border-zinc-900 text-[10px] py-1.5 px-2.5 rounded-lg font-bold shadow-2xl hidden group-hover:block whitespace-nowrap z-50 pointer-events-none">
                          {it.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimized profile element */}
              <div 
                onClick={() => setIsSidebarMinimized(false)}
                className="h-8 w-8 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer border border-zinc-850 hover:border-emerald-500 transition shadow-md group relative"
                title="Expand Sidebar"
              >
                AN
                <span className="absolute left-12 bg-zinc-950 text-white border border-zinc-900 text-[10px] py-1.5 px-2.5 rounded-lg font-bold shadow-2xl hidden group-hover:block whitespace-nowrap z-50 pointer-events-none">
                  Open Profiles
                </span>
              </div>
            </div>
          ) : (
            /* FULL EXPANDED VIEW */
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                
                {/* Spotify-styled Branding */}
                <div className="flex items-center justify-between px-2">
                  <div 
                    onClick={() => setIsSidebarMinimized(true)}
                    className="flex items-center gap-2.5 cursor-pointer group/logo hover:opacity-85 transition duration-205"
                    title="Click to collapse sidebar"
                  >
                    <div className="h-9 w-9 bg-[#1db954] text-black font-extrabold text-base flex items-center justify-center rounded-full shadow-lg shadow-[#1db954]/20 select-none transition-transform group-hover/logo:scale-105">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h1 className="text-xs font-black text-white tracking-tight leading-none uppercase group-hover/logo:text-[#1db954] transition">AURA MUSIC AI</h1>
                        <span className="bg-[#1db954]/10 text-[#1db954] text-[8px] px-1.5 py-0.2 rounded font-mono font-bold">PRO</span>
                      </div>
                      <p className="text-[9px] text-zinc-500 font-sans tracking-wide mt-0.5 block">
                        Feel the Future of Music
                      </p>
                    </div>
                  </div>

                  {/* Mobile Close Button */}
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition text-[#1db954] rounded-lg"
                    title="Close Sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Navigation links */}
                <div className="space-y-1">
                  <span 
                    onClick={() => setIsSidebarMinimized(true)}
                    className="text-[9px] text-zinc-500 tracking-wider font-bold font-mono uppercase px-2 block mb-2 cursor-pointer hover:text-white transition"
                    title="Click to collapse sidebar"
                  >
                    MAIN MENU
                  </span>
                  {[
                    { id: "musichub", label: "Music Hub", icon: Home, action: () => { setSelectedLibraryCollection(null); setActiveTab("musichub"); } },
                    { id: "aidj", label: "AI Hub", icon: Sparkles, action: () => { setSelectedLibraryCollection(null); setActiveTab("player"); setActivePlayerTab("dj"); } },
                    { id: "search", label: "Search", icon: Search, action: () => { setSelectedLibraryCollection(null); setActiveTab("musichub"); setTimeout(() => { const el = document.getElementById("hub-search-input"); el?.focus(); }, 150); } },
                    { id: "library", label: "Library", icon: BookOpen, action: () => { setSelectedLibraryCollection(null); setActiveTab("player"); setActivePlayerTab("playlist"); } },
                    { id: "settings", label: "Settings", icon: SettingsIcon, action: () => { setSelectedLibraryCollection(null); setActiveTab("settings"); }, badge: true }
                  ].map((t) => {
                    const TabIcon = t.icon;
                    const isSelected = t.id === "musichub" ? (activeTab === "musichub") : t.id === "aidj" ? (activeTab === "player" && activePlayerTab === "dj") : t.id === "search" ? false : t.id === "library" ? (activeTab === "player" && activePlayerTab === "playlist") : t.id === "settings" ? (activeTab === "settings") : false;
                    
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedMix(null);
                          if (t.action) {
                            t.action();
                          } else {
                            setActiveTab(t.id as any);
                          }
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition relative group/nav ${
                          isSelected 
                            ? "bg-zinc-900 text-white border border-zinc-800 shadow-[0_0_15px_rgba(29,185,84,0.06)]" 
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                        } ${t.id === "settings" ? "hover:shadow-[0_0_12px_rgba(29,185,84,0.12)] transition-all duration-300" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <TabIcon className={`w-3.5 h-3.5 transition-transform duration-300 group-hover/nav:scale-110 ${
                            isSelected ? "text-[#1db954] drop-shadow-[0_0_8px_#1db954]" : "text-zinc-400 group-hover/nav:text-white"
                          } ${t.id === "settings" ? "group-hover/nav:text-[#1db954] group-hover/nav:drop-shadow-[0_0_10px_#1db954]" : ""}`} />
                          <span>{t.label}</span>
                        </div>
                        
                        {t.badge && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1db954] shadow-[0_0_8px_#1db954] animate-pulse shrink-0 mr-1" title="Notification waiting" />
                        )}
                        
                        {/* Keyboard shortcut hint overlay for settings */}
                        {t.id === "settings" && (
                          <kbd className="hidden lg:inline-block px-1 py-0.2 text-[8px] font-mono text-zinc-600 border border-zinc-800/80 rounded group-hover/nav:text-zinc-400 group-hover/nav:border-zinc-700 bg-black/40">
                            S
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Secondary navigation: EXPERIENCES section */}
                <div className="border-t border-zinc-900 pt-3 space-y-1">
                  <span 
                    onClick={() => setIsSidebarMinimized(true)}
                    className="text-[9px] text-zinc-500 tracking-wider font-bold font-mono uppercase px-2 block mb-1.5 cursor-pointer hover:text-white transition"
                    title="Click to collapse sidebar"
                  >
                    EXPERIENCES
                  </span>
                  {[
                    { id: "liverooms", label: "Live Rooms", icon: Radio, action: () => { setSelectedLibraryCollection(null); setActiveTab("social"); } },
                    { id: "studymode", label: "Study Mode", icon: Clock, action: () => { setSelectedLibraryCollection(null); setActiveTab("pomodoro"); } },
                    { id: "musicdna", label: "Music DNA", icon: Activity, action: () => { setSelectedLibraryCollection(null); setActiveTab("musicdna"); } },
                    { id: "dreamplaylist", label: "Dream Playlist", icon: Sparkles, action: () => { setSelectedLibraryCollection(null); setActiveTab("player"); setActivePlayerTab("creation"); } },
                    { id: "futurevibes", label: "Future Vibes", icon: Zap, action: () => { setSelectedLibraryCollection(null); setActiveTab("instrument"); } },
                    { id: "concerts", label: "Concert Universe", icon: Calendar, action: () => { 
                      setSelectedLibraryCollection(null);
                      setActiveTab("musichub"); 
                      setTimeout(() => {
                        const el = document.getElementById("concert-universe-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    } }
                  ].map((e) => {
                    const ExpIcon = e.icon;
                    const isExpSelected = e.id === "liverooms" ? (activeTab === "social") : e.id === "studymode" ? (activeTab === "pomodoro") : e.id === "musicdna" ? (activeTab === "musicdna") : e.id === "futurevibes" ? (activeTab === "instrument") : false;
                    
                    return (
                      <button
                        key={e.id}
                        onClick={() => {
                          setSelectedMix(null);
                          if (e.action) {
                            e.action();
                          } else {
                            setActiveTab(e.id as any);
                          }
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                          isExpSelected 
                            ? "bg-zinc-900 text-white border border-zinc-800" 
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/20"
                        }`}
                      >
                        <ExpIcon className={`w-3.5 h-3.5 ${isExpSelected ? "text-[#1db954]" : "text-zinc-500"}`} />
                        <span>{e.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* YOUR LIBRARY Shortcut Lists */}
                <div className="border-t border-zinc-900 pt-3 space-y-1">
                  <span 
                    onClick={() => setIsSidebarMinimized(true)}
                    className="text-[9px] text-zinc-500 tracking-wider font-bold font-mono uppercase px-2 block mb-1 cursor-pointer hover:text-white transition"
                    title="Click to collapse sidebar"
                  >
                    YOUR LIBRARY
                  </span>
                  {[
                    { label: "Recently Played", icon: Clock },
                    { label: "Favorites", icon: Heart },
                    { label: "Downloads", icon: Download },
                    { label: "AI Generated", icon: Sparkles },
                    { label: "Study Playlists", icon: BookOpen },
                    { label: "Workout Playlists", icon: Flame },
                    { label: "Sleep Playlists", icon: Sparkles }
                  ].map((lib, idx) => {
                    const LibIcon = lib.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedLibraryCollection(lib.label);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs rounded-lg transition text-left ${
                          selectedLibraryCollection === lib.label 
                            ? "text-[#1db954] bg-zinc-900/40 font-bold border-l-2 border-[#1db954]" 
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/20"
                        }`}
                      >
                        <LibIcon className={`w-3.5 h-3.5 ${selectedLibraryCollection === lib.label ? "text-[#1db954]" : "text-zinc-500"}`} />
                        <span>{lib.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* QUICK ACCESS */}
                <div className="border-t border-zinc-900 pt-3 space-y-1">
                  <span 
                    onClick={() => setIsSidebarMinimized(true)}
                    className="text-[9px] text-zinc-500 tracking-wider font-bold font-mono uppercase px-2 block mb-1 cursor-pointer hover:text-white transition"
                    title="Click to collapse sidebar"
                  >
                    QUICK ACCESS
                  </span>
                  {[
                    { label: "AI DJ", icon: Sparkles, action: () => { setActiveTab("player"); setActivePlayerTab("dj"); setIsSidebarOpen(false); } },
                    { label: "Aura Companion", icon: MessageSquare, action: () => { setActiveTab("player"); setActivePlayerTab("dj"); setIsSidebarOpen(false); } },
                    { label: "Mood Detection", icon: Activity, action: () => { 
                        setShowMoodPicker(true);
                        setIsSidebarOpen(false);
                      } 
                    },
                    { label: "Smart Weather Music", icon: CloudLightning, action: () => {
                        triggerToast("⛈️ Smart weather automation activated! Special calm storm soundscapes loaded.");
                        const rainTracks = trackDatabase.filter(t => t.genre.toLowerCase().includes("ambient") || t.title.toLowerCase().includes("rain"));
                        if (rainTracks.length > 0) {
                          setCurrentTracks(rainTracks);
                        } else {
                          setCurrentTracks(trackDatabase);
                        }
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                        setIsSidebarOpen(false);
                      } 
                    }
                  ].map((qa, idx) => {
                    const QaIcon = qa.icon;
                    return (
                      <button
                        key={idx}
                        onClick={qa.action}
                        className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/20 rounded-lg transition text-left"
                      >
                        <QaIcon className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{qa.label}</span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Premium Profile Card Panel matching Dashboard 2 exactly */}
              <div className="mt-auto pt-4 border-t border-zinc-900 space-y-3">
                <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-xl relative overflow-hidden group">
                  <div className="flex items-center gap-2.5">
                    {/* Custom Avatar Icon representation */}
                    <div className="h-8 w-8 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 border border-zinc-700 shadow-md">
                      AN
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-white truncate leading-none">Anish Music Lover</h4>
                      </div>
                      <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-[#1db954] px-1.5 py-0.5 rounded-full font-mono font-extrabold mt-1 inline-block uppercase">
                        Premium Pro
                      </span>
                    </div>
                  </div>

                  {/* XP Meter */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono font-semibold">
                      <span className="text-zinc-400">Level 23</span>
                      <span className="text-[#1db954]">4,680 / 6,000 XP</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-[#1db954] h-full" style={{ width: "78%" }} />
                    </div>
                  </div>

                  {/* Daily Aura Score Tracker */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/40 flex justify-between items-center text-[10px] font-semibold leading-none">
                    <span className="text-zinc-500 font-mono">Daily Aura Score</span>
                    <span className="bg-[#1db954]/10 border border-[#1db954]/20 text-[#1db954] font-bold py-1 px-2 rounded-full font-mono shadow-sm flex items-center gap-1">
                      ✨ 92
                    </span>
                  </div>
                </div>
                
                <div className="text-[10px] text-zinc-600 font-mono text-center">
                  Aura Music Core v3.0 • Active
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* 2. Primary Page Scrollable Content Column */}
        <main className="flex-1 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black overflow-y-auto h-full p-4 md:p-6 pb-28 md:pb-6 z-10 relative spotify-scrollbar flex flex-col gap-6">
          
          {/* Mobile Top Navigation Bar with Toggle Button */}
          <header className="flex md:hidden items-center justify-between bg-zinc-950/80 border border-zinc-900 p-3 rounded-2xl select-none shrink-0">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition text-[#1db954] rounded-xl shrink-0 flex items-center justify-center"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-[#1db954] text-black font-extrabold text-xs flex items-center justify-center rounded-full">
                  A
                </div>
                <h1 className="text-xs font-black tracking-wider text-white uppercase font-sans">
                  Aura Spotify <span className="text-[#1db954] text-[9px] font-mono ml-1 font-bold">PRO</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#1db954] bg-[#1db954]/10 border border-[#1db954]/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                {audioQuality} HD
              </span>
            </div>
          </header>

        {selectedLibraryCollection ? (
          <CollectionDetailPage
            collectionName={selectedLibraryCollection}
            onClose={() => setSelectedLibraryCollection(null)}
            trackDatabase={trackDatabase}
            isLiked={isLiked}
            toggleLike={(id) => {
              setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
            }}
            downloadedTrackIds={downloadedTrackIds}
            setDownloadedTrackIds={setDownloadedTrackIds}
            recentlyPlayedTracks={recentlyPlayedTracks}
            onPlayTrack={(tracks, idx) => {
              auraAudio.init();
              setCurrentTracks(tracks);
              setCurrentTrackIndex(idx);
              setCurrentTime(0);
              setIsPlaying(true);
            }}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onAddToQueue={(track) => {
              setCurrentTracks(prev => {
                const next = [...prev];
                const insertIdx = currentTrackIndex + 1;
                next.splice(insertIdx, 0, track);
                return next;
              });
            }}
            onSelectCollection={(name) => setSelectedLibraryCollection(name)}
          />
        ) : (
          <>
            {/* MUSIC HUB MAIN DASHBOARD (DASHBOARD 2) */}
            {activeTab === "musichub" && (
          selectedMix ? (
            <div className="flex flex-col gap-6 animate-slideUp text-white select-none pb-12 w-full">
              
              {/* BACK NAVIGATION BUTTON AND TRAIL */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedMix(null)}
                  className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition bg-zinc-900/60 hover:bg-zinc-850 px-3.5 py-2 rounded-lg border border-zinc-850"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Synthesizer Active • {selectedMix.title}
                </div>
              </div>

              {/* ALBUM BANNER HERO (SPOTIFY STYLED) */}
              <div className="bg-gradient-to-b from-zinc-900 to-black/30 border border-zinc-900 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden shadow-2xl w-full">
                {/* Background colored ambient wash */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${selectedMix.from} opacity-30 pointer-events-none blur-3xl`} />
                <div className="absolute top-2 right-4 text-[65px] font-black text-white/5 font-mono select-none pointer-events-none uppercase">
                  AI AUDIO
                </div>

                {/* Album Cover Art on Left */}
                <div className={`h-48 w-48 md:h-52 md:w-52 bg-gradient-to-tr ${selectedMix.from} rounded-xl shadow-2xl flex flex-col justify-between p-5 border border-zinc-800/80 shrink-0 group relative select-none transform hover:scale-102 transition duration-300`}>
                  <Music className="w-8 h-8 text-white/70" />
                  <div className="text-sm font-black tracking-tight leading-none text-white uppercase font-mono">
                    {selectedMix.title}
                  </div>
                  {/* Subtle watermarks */}
                  <div className="absolute right-3 top-3 text-[10px] opacity-20 font-mono uppercase font-bold">AURA v3</div>
                </div>

                {/* Header Information on Right */}
                <div className="space-y-3 z-10 w-full min-w-0">
                  <span className="text-[10px] bg-[#1db954]/10 border border-[#1b9542]/20 text-[#1db954] px-2.5 py-1 rounded-full font-mono font-bold tracking-widest uppercase inline-block">
                    🤖 PUBLIC PLAYLIST
                  </span>
                  
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                    {selectedMix.title}
                  </h1>

                  <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl font-sans">
                    Featuring customized {selectedMix.sub.toLowerCase()}, ambient arrangements, acoustic transitions, and bin-aural focus rhythms curated dynamically to match your bio-frequency.
                  </p>

                  {/* Meta stats block */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-sans mt-2">
                    <span className="font-extrabold text-[#1db954] flex items-center gap-1 hover:underline cursor-pointer">
                      <Sparkles className="w-3 h-3" /> Aura Music AI
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-semibold text-white">{selectedMix.saves}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-semibold text-zinc-300">{selectedMix.tracks.length} songs,</span>
                    <span className="text-zinc-500">about {Math.floor(selectedMix.tracks.reduce((acc, t) => acc + t.duration, 0) / 60)} min</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS TOOLBAR */}
              <div className="flex items-center justify-between bg-zinc-950/20 border border-zinc-900/60 rounded-xl p-4 w-full">
                <div className="flex items-center gap-5">
                  {/* Main Green Play Button */}
                  <button 
                    onClick={() => {
                      auraAudio.init();
                      setCurrentTracks(selectedMix.tracks);
                      setCurrentTrackIndex(0);
                      setCurrentTime(0);
                      setIsPlaying(true);
                      alert(`Playing ${selectedMix.title} suggested flow session!`);
                    }}
                    className="h-12 w-12 bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 text-black flex items-center justify-center rounded-full shadow-lg shadow-[#1db954]/20 transition-all duration-200"
                    title="Play suggested mix"
                  >
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </button>

                  {/* Shuffle Button */}
                  <button 
                    onClick={() => {
                      setIsShuffleActive(!isShuffleActive);
                      alert(isShuffleActive ? "Shuffle inactive" : "Shuffle active on suggested mix!");
                    }}
                    className={`p-2 transition rounded-lg hover:bg-zinc-900/60 ${isShuffleActive ? "text-[#1db954]" : "text-zinc-400 hover:text-white"}`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  {/* Plus/Like Button */}
                  <button 
                    onClick={() => {
                      alert("Added all suggested songs from this custom Mix to your persistent library successfully! ✨");
                    }}
                    className="p-2 text-zinc-400 hover:text-[#1db954] transition rounded-lg hover:bg-zinc-900/60"
                    title="Add all to Library"
                  >
                    <Plus className="w-4.5 h-4.5" />
                  </button>

                  {/* Download button */}
                  <button 
                    onClick={() => {
                      alert("📥 Download Started! Coded metadata packs have been packed. Suggested playlist offline capability is now available!");
                    }}
                    className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-900/30"
                    title="Download playlist"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Three Dots Button */}
                  <button 
                    onClick={() => alert("Suggested mix configuration matches Aura Bio-Frequency v3.0 core protocol.")}
                    className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-900/30"
                  >
                    <span className="text-sm font-black tracking-widest font-mono">...</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono font-bold select-none pr-2">
                  <span>LIST VIEW</span>
                  <div className="h-4 w-[1px] bg-zinc-800" />
                  <span className="text-[#1db954] font-black cursor-pointer bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/80">List ☰</span>
                </div>
              </div>

              {/* SUGGESTED SONGS TABLE */}
              <div className="bg-zinc-950/20 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl w-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans select-none">
                    <thead>
                      <tr className="border-b border-zinc-900/80 text-zinc-500 text-[10px] uppercase tracking-wider font-semibold font-mono">
                        <th className="py-3 px-4 text-center w-12">#</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4 hidden md:table-cell">Album</th>
                        <th className="py-3 px-4 hidden lg:table-cell">Date Joined</th>
                        <th className="py-3 px-4 text-right pr-6 w-24">
                          <Clock className="w-3.5 h-3.5 inline-block text-zinc-500" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 text-xs">
                      {selectedMix.tracks.map((track, trackIdx) => {
                        const isCurrentTrackPlaying = currentTrack.title === track.title && isPlaying;
                        const isCurrentTrackLoaded = currentTrack.title === track.title;

                        // Mock relative joining time matching screenshot vibe
                        const times = ["Just Now", "Daily Rotation", "Looping 12m ago", "Played yesterday", "2 days ago"];
                        const timeText = times[trackIdx % times.length];

                        return (
                          <tr 
                            key={track.id}
                            onClick={() => {
                              auraAudio.init();
                              setCurrentTracks(selectedMix.tracks);
                              setCurrentTrackIndex(trackIdx);
                              setCurrentTime(0);
                              setIsPlaying(true);
                            }}
                            className={`group hover:bg-zinc-900/80 transition duration-150 cursor-pointer ${
                              isCurrentTrackLoaded ? "bg-zinc-900/30" : ""
                            }`}
                          >
                            {/* # INDEX COLUMN */}
                            <td className="py-3 px-4 text-center text-zinc-500 font-mono font-bold text-xs relative w-12">
                              {isCurrentTrackPlaying ? (
                                /* Playing animation graphic */
                                <div className="flex items-end justify-center gap-[2px] h-3 w-4 mx-auto pb-0.5">
                                  <div className="bg-[#1db954] w-[3px] h-3 animate-pulse" style={{ animationDuration: '0.6s' }} />
                                  <div className="bg-[#1db954] w-[3px] h-2 animate-pulse" style={{ animationDuration: '0.4s' }} />
                                  <div className="bg-[#1db954] w-[3px] h-1 animate-pulse" style={{ animationDuration: '0.8s' }} />
                                </div>
                              ) : (
                                <span className={isCurrentTrackLoaded ? "text-[#1db954]" : "group-hover:hidden"}>
                                  {trackIdx + 1}
                                </span>
                              )}
                              
                              {/* Hover Play Button Trigger */}
                              <div className="absolute inset-0 items-center justify-center hidden group-hover:flex bg-transparent">
                                {isCurrentTrackPlaying ? (
                                  <Pause className="w-3.5 h-3.5 text-white fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-[#1db954] fill-current" />
                                )}
                              </div>
                            </td>

                            {/* TITLE & ARTIST COLUMN */}
                            <td className="py-3.5 px-4 min-w-0">
                              <div className="flex items-center gap-3.5">
                                {/* Miniature cover thumbnail with gradients */}
                                <div className={`h-10 w-10 bg-gradient-to-tr ${selectedMix.from} rounded flex items-center justify-center text-white text-[11px] font-black shrink-0 relative shadow-inner border border-zinc-800/40`}>
                                  🎵
                                  {isCurrentTrackPlaying && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <Sparkles className="w-3.5 h-3.5 text-[#1db954]" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className={`font-bold truncate leading-none mb-1 text-sm ${
                                    isCurrentTrackLoaded ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"
                                  } transition`}>
                                    {track.title}
                                  </div>
                                  <div className="text-zinc-400 font-medium text-xs truncate">
                                    {track.artist}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* ALBUM COLUMN */}
                            <td className="py-3.5 px-4 text-zinc-400 hidden md:table-cell align-middle">
                              <span className="font-medium hover:text-white transition duration-150">
                                {track.album || "Aura Sync Recs"}
                              </span>
                            </td>

                            {/* DATE JOINED COLUMN */}
                            <td className="py-3.5 px-4 text-zinc-500 hidden lg:table-cell align-middle font-medium">
                              {timeText}
                            </td>

                            {/* DURATION COLUMN with checkmark */}
                            <td className="py-3.5 px-4 text-right pr-6 align-middle font-mono text-zinc-400 text-xs w-24">
                              <div className="flex items-center justify-end gap-3">
                                {/* Green Spotify Checked Circle */}
                                <CheckCircle className="w-4 h-4 text-[#1db954] fill-[#1db954]/5 opacity-0 group-hover:opacity-100 transition duration-150 hover:scale-105" />
                                
                                <span className="font-semibold select-none">
                                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI COPILOT SUGGESTIONS CO-HOST */}
              <div className="mt-8 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-[#1db954]/10 text-[#1db954] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border border-[#1b9542]/20">
                    Live Copilot Recommendations
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-4 h-4 text-[#1db954]" /> Dynamic Copilot suggestions based on {selectedMix.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Our acoustic neural sequencer generated these custom compatible tracks specifically aligned to the ambient density of your active mix.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {getAICopilotRecommendations(selectedMix.title).map((item, idx) => {
                    const isRecPlaying = isPlaying && currentTrack.title === item.title;
                    const isRecSelected = currentTrack.title === item.title;
                    
                    return (
                      <div 
                        key={item.id}
                        onClick={() => {
                          auraAudio.init();
                          // Load recommendations into queue
                          const copilotRecs = getAICopilotRecommendations(selectedMix.title);
                          const combined = [...selectedMix.tracks, ...copilotRecs];
                          setCurrentTracks(combined);
                          // Calculate the index of this song in the combined array
                          const playIndex = selectedMix.tracks.length + idx;
                          setCurrentTrackIndex(playIndex);
                          setCurrentTime(0);
                          setIsPlaying(true);
                          
                          setDjMessages(prev => [...prev, { 
                            sender: "aura", 
                            text: `Injected recommended track '${item.title}' (${item.genre}) into your active playlist. Enjoy pure synthesis!`, 
                            timestamp: "Copilot Active" 
                          }]);
                        }}
                        className={`p-3.5 rounded-xl border transition duration-200 cursor-pointer text-left relative flex items-center justify-between group ${
                          isRecSelected 
                            ? "bg-[#1db954]/10 border-[#1db954]/40" 
                            : "bg-zinc-900/30 border-zinc-850 hover:bg-zinc-850 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Play/Stop Indicators */}
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition shrink-0 ${
                            isRecSelected 
                              ? "bg-[#1db954] text-black" 
                              : "bg-zinc-900 group-hover:bg-zinc-800 text-zinc-500"
                          }`}>
                            {isRecPlaying ? (
                              <div className="flex items-end gap-[1.5px] h-3 pb-0.5">
                                <div className="bg-black w-[2.5px] h-3 animate-pulse" style={{ animationDuration: '0.6s' }} />
                                <div className="bg-black w-[2.5px] h-2 animate-pulse" style={{ animationDuration: '0.4s' }} />
                                <div className="bg-black w-[2.5px] h-1.5 animate-pulse" style={{ animationDuration: '0.8s' }} />
                              </div>
                            ) : (
                              <Play className={`w-3 h-3 ${isRecSelected ? "text-black fill-current" : "text-zinc-400 fill-current opacity-60 group-hover:opacity-100"}`} />
                            )}
                          </div>
                          
                          <div className="min-w-0 leading-none">
                            <span className="text-[10px] text-zinc-550 font-mono font-bold uppercase tracking-wider block mb-0.5">{item.genre}</span>
                            <div className={`text-xs font-bold truncate ${isRecSelected ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>
                              {item.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-1 truncate">{item.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 font-mono text-[9px] text-zinc-550 pl-2">
                          <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-900">
                            {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM FOOTNOTE */}
              <div className="text-center text-[10px] text-zinc-650 font-mono py-2 mt-4">
                Suggested tracks updated dynamically based on biometric feedback. Aura Core v3.0
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-slideUp text-white">
            
            {/* LEFT MAIN VOLUME & DISCOVERY LOBBY (Col Span 8) */}
            <div className="xl:col-span-8 flex flex-col gap-8">
              
              {/* 1. Header (Greeting, Search Input, Notification Center) */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl relative">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none flex items-center gap-2">
                    Good Morning, Anish! 👋
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1.5 font-medium">
                    Let's discover something incredible today. Aura AI has synthesized 12 custom arrangements for your focus profile.
                  </p>
                </div>

                {/* Search Bar & Accessories */}
                <div className="flex items-center gap-3 w-full md:w-auto relative">
                  
                  {/* Dynamic Search Box */}
                  <div className="relative flex-1 md:w-64">
                    <div className="relative w-full">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        id="hub-search-input"
                        type="text"
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#1db954] transition text-white placeholder-zinc-500 font-sans"
                        placeholder="Search songs, artists, albums..."
                        value={hubSearchQuery}
                        onChange={(e) => setHubSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                      />
                      {hubSearchQuery && (
                        <button 
                          onClick={() => setHubSearchQuery("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-550 hover:text-white transition text-[10px] font-bold font-mono"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* SEARCH SUGGESTIONS PORTAL WINDOW */}
                    {(isSearchFocused || hubSearchQuery) && (
                      <div className="absolute left-0 sm:left-auto right-0 mt-3 w-72 sm:w-80 md:w-96 bg-[#0c0c0e]/95 backdrop-blur-xl border border-zinc-850 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans p-4 space-y-4">
                        
                        {/* Header of Search Hub suggestions */}
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                          <span className="text-[10px] text-[#1db954] font-bold font-mono uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Aura Smart Suggestions
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">Biometric Sync Active</span>
                        </div>

                        {/* Microphone prompt helper */}
                        <div 
                          onClick={() => startSimulatedMic()}
                          className="bg-zinc-900/80 hover:bg-[#1db954]/5 border border-[#1b9542]/20 rounded-xl p-2.5 flex items-center justify-between cursor-pointer group transition duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🎤</span>
                            <div className="leading-none text-left">
                              <div className="text-[11px] font-bold text-white group-hover:text-[#1db954] transition">Try Speaking to Search</div>
                              <div className="text-[9px] text-zinc-500 mt-0.5">Click to evaluate voice commands</div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-550 group-hover:translate-x-0.5 transition" />
                        </div>

                        {/* Track matches list */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide font-mono block pl-1">
                            {hubSearchQuery ? "Matching Songs Results" : "🔥 Trending Suggestions"}
                          </span>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto spotify-scrollbar">
                            {trackDatabase
                              .filter(t => 
                                !hubSearchQuery || 
                                t.title.toLowerCase().includes(hubSearchQuery.toLowerCase()) || 
                                t.artist.toLowerCase().includes(hubSearchQuery.toLowerCase())
                              )
                              .slice(0, 4)
                              .map((track, trackIdx) => (
                                <div 
                                  key={track.id}
                                  onClick={() => {
                                    auraAudio.init();
                                    setCurrentTracks(trackDatabase);
                                    setCurrentTrackIndex(trackDatabase.findIndex(t => t.id === track.id));
                                    setCurrentTime(0);
                                    setIsPlaying(true);
                                  }}
                                  className="flex items-center gap-3 p-1.5 hover:bg-zinc-900/60 rounded-lg cursor-pointer transition text-left group"
                                >
                                  <div className="h-7 w-7 bg-zinc-900 rounded flex items-center justify-center text-xs text-zinc-400 font-bold group-hover:bg-[#1db954]/10 group-hover:text-[#1db954] transition">
                                    {trackIdx + 1}
                                  </div>
                                  <div className="min-w-0 flex-1 leading-none">
                                    <div className="text-[11px] font-bold text-white truncate group-hover:text-[#1db954] transition">{track.title}</div>
                                    <div className="text-[9px] text-zinc-500 truncate mt-0.5">{track.artist}</div>
                                  </div>
                                  <span className="text-[9px] text-zinc-550 font-mono font-semibold">{track.genre}</span>
                                </div>
                              ))
                            }
                            {trackDatabase.filter(t => !hubSearchQuery || t.title.toLowerCase().includes(hubSearchQuery.toLowerCase()) || t.artist.toLowerCase().includes(hubSearchQuery.toLowerCase())).length === 0 && (
                              <div className="text-center text-[10px] text-zinc-550 py-3 font-mono">
                                No matching track found. Try "Binary Moonlight"!
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mix Shortcut categories */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide font-mono block pl-1">
                            ⚡ Suggested Custom Focus Mixes
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { title: "Daily Mix", sub: "Personal focus rotation", from: "from-amber-900 to-black/30", playIdx: 0, saves: "642,810 saves" },
                              { title: "Coding Mix", sub: "Lofi Developer Beats & Compiler Waves", from: "from-indigo-900 to-black/30", playIdx: 1, saves: "820,114 saves" },
                              { title: "Gym Mix", sub: "Hardcore Electro Workout Set", from: "from-[#ef4444]/20", playIdx: 2, saves: "419,003 saves" },
                              { title: "Study Mix", sub: "Binaural Cognitive Study Booster Loops", from: "from-emerald-950 to-black/30", playIdx: 3, saves: "1,105,420 saves" }
                            ].map((mix) => (
                              <button 
                                key={mix.title}
                                onClick={() => {
                                  setSelectedMix({
                                    title: mix.title,
                                    sub: mix.sub,
                                    from: mix.from,
                                    playIdx: mix.playIdx,
                                    saves: mix.saves,
                                    tracks: getMixTracks(mix.title, trackDatabase)
                                  });
                                }}
                                className="text-[10px] font-bold text-zinc-300 bg-zinc-900 hover:bg-[#1db954] hover:text-black hover:border-transparent border border-zinc-850 px-2.5 py-1 rounded-full transition duration-150"
                              >
                                {mix.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}                  </div>

                  {/* Dedicated Microphone accent button */}
                  <button 
                    onClick={() => startSimulatedMic()}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-[#1db954] border border-zinc-800 rounded-full transition relative active:scale-95 flex items-center justify-center h-10 w-10 shrink-0"
                    title="Acoustic Voice Control"
                  >
                    <Mic className="w-4.5 h-4.5" />
                    {showVoiceDialog && (
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-rose-500 rounded-full animate-ping" />
                    )}
                  </button>

                  {/* Notification Center */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                      className="p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition relative active:scale-95"
                      title="Notification Center"
                    >
                      <Bell className="w-4.5 h-4.5" />
                      {notifications.some(n => !n.reads) && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#1db954] text-black text-[9px] font-extrabold flex items-center justify-center rounded-full animate-bounce">
                          {notifications.filter(n => !n.reads).length}
                        </span>
                      )}
                    </button>

                    {/* Notification Droplist Panel */}
                    {showNotificationCenter && (
                      <div className="absolute right-0 mt-3 w-80 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans p-1">
                        <div className="p-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/20">
                          <span className="text-xs font-bold text-white">Notifications</span>
                          <button 
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, reads: true })));
                            }}
                            className="text-[10px] text-[#1db954] hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        </div>
                        <div className="divide-y divide-zinc-900 max-h-64 overflow-y-auto spotify-scrollbar">
                          {notifications.map((notif) => (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, reads: true } : n));
                              }}
                              className={`p-3 text-xs cursor-pointer transition ${!notif.reads ? "bg-zinc-900/40 hover:bg-zinc-900 border-l-2 border-[#1db954]" : "hover:bg-zinc-900/20"}`}
                            >
                              <div className="flex justify-between items-center font-bold">
                                <span className={!notif.reads ? "text-white" : "text-zinc-300"}>{notif.title}</span>
                                <span className="text-[9px] text-zinc-500 font-mono font-medium">{notif.time}</span>
                              </div>
                              <p className="text-zinc-400 text-[11px] mt-1 pr-2 leading-relaxed">{notif.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Avatar indicator */}
                  <div className="h-9.5 w-9.5 bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 rounded-full border border-zinc-800 flex items-center justify-center text-white font-black text-xs shadow-md select-none">
                    AN
                  </div>
                </div>
              </div>

              {/* 2. Quick Access (Recently Played, Continue, Favorites, Downloads, AI Generated, Playlists) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center group cursor-pointer">
                  <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono flex items-center gap-1.5">
                    Quick Access <ChevronRight className="w-3.5 h-3.5 text-zinc-550 group-hover:translate-x-1 transition-all" />
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { 
                      id: "qp-recently", 
                      label: "Recently Played", 
                      info: `${recentlyPlayedTracks.length} Songs`, 
                      gradient: "from-[#ef4444]/20", 
                      icon: Clock,
                      action: () => {
                        setSelectedLibraryCollection("Recently Played");
                      },
                      playAction: () => {
                        const tracks = recentlyPlayedTracks.length > 0 ? recentlyPlayedTracks : trackDatabase.slice(0, 4);
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-continue", 
                      label: "Continue Listening", 
                      info: "Arijit Singh Mix", 
                      gradient: "from-[#8b5cf6]/20", 
                      icon: Music,
                      action: () => {
                        setSelectedMix({
                          title: "Arijit Singh Mix",
                          sub: "Soulful vocals blended with dynamic acoustic wave generators",
                          from: "from-violet-950/70 to-black/30",
                          playIdx: 0,
                          saves: "1,142,520 listeners online",
                          tracks: arijitSinghTracks
                        });
                        setActiveTab("musichub");
                      },
                      playAction: () => {
                        if (arijitSinghTracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(arijitSinghTracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-favs", 
                      label: "Favorites", 
                      info: `${Object.values(isLiked).filter(Boolean).length} Songs`, 
                      gradient: "from-[#ec4899]/20", 
                      icon: Heart, 
                      badge: true,
                      action: () => {
                        setSelectedLibraryCollection("Favorites");
                      },
                      playAction: () => {
                        const tracks = trackDatabase.filter(t => isLiked[t.id]);
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-downloads", 
                      label: "Downloads", 
                      info: `${downloadedTrackIds.length} Songs saved`, 
                      gradient: "from-[#10b981]/20", 
                      icon: Download,
                      action: () => {
                        setSelectedLibraryCollection("Downloads");
                      },
                      playAction: () => {
                        const tracks = trackDatabase.filter(t => downloadedTrackIds.includes(t.id));
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-aigen", 
                      label: "AI Generated", 
                      info: "Generative Waveforms", 
                      gradient: "from-[#a855f7]/20", 
                      icon: Sparkles,
                      action: () => {
                        setSelectedLibraryCollection("AI Generated");
                      },
                      playAction: () => {
                        const tracks = trackDatabase.filter(t => t.id === 1 || t.id === 8001 || t.id === 8002 || t.id === 8003 || t.id === 4);
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-studyplaylists", 
                      label: "Study Playlists", 
                      info: "Focal Resonance", 
                      gradient: "from-[#3b82f6]/20", 
                      icon: BookOpen,
                      action: () => {
                        setSelectedLibraryCollection("Study Playlists");
                      },
                      playAction: () => {
                        const tracks = trackDatabase.filter(t => t.moods.includes("Focused") || t.genre.toLowerCase().includes("ambient") || t.genre.toLowerCase().includes("acoustic"));
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-workoutplaylists", 
                      label: "Workout Playlists", 
                      info: "Voltage Surge BPM", 
                      gradient: "from-[#fb923c]/20", 
                      icon: Flame,
                      action: () => {
                        setSelectedLibraryCollection("Workout Playlists");
                      },
                      playAction: () => {
                        const tracks = trackDatabase.filter(t => t.moods.includes("Motivated") || t.genre.toLowerCase().includes("synthwave") || t.genre.toLowerCase().includes("edm"));
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { 
                      id: "qp-sleepplaylists", 
                      label: "Sleep Playlists", 
                      info: "Vibe Resonance", 
                      gradient: "from-[#6366f1]/20", 
                      icon: Music,
                      action: () => {
                        setSelectedLibraryCollection("Sleep Playlists");
                      },
                      playAction: () => {
                        const tracks = trackDatabase.filter(t => t.moods.includes("Relaxed") || t.genre.toLowerCase().includes("rain") || t.genre.toLowerCase().includes("piano"));
                        if (tracks.length > 0) {
                          auraAudio.init();
                          setCurrentTracks(tracks);
                          setCurrentTrackIndex(0);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }
                      }
                    },
                    { id: "qp-studymode", label: "Study Mode", info: "Focus & Study", gradient: "from-[#3b82f6]/20", action: () => setActiveTab("pomodoro"), icon: Clock },
                    { id: "qp-aidj", label: "AI DJ", info: "Personalized AI Mix", gradient: "from-[#1db954]/20", action: () => { setActiveTab("player"); setActivePlayerTab("dj"); }, icon: Sparkles }
                  ].filter(item => item.label.toLowerCase().includes(hubSearchQuery.toLowerCase())).map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          }
                        }}
                        className="group relative bg-zinc-900/30 hover:bg-zinc-800/50 border border-zinc-850 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md transform hover:-translate-y-0.5"
                      >
                        <div className={`h-14 w-14 bg-gradient-to-tr ${item.gradient} to-black/80 flex items-center justify-center shrink-0 border-r border-zinc-850`}>
                          <ItemIcon className="w-5.5 h-5.5 text-[#1db954]" />
                        </div>
                        <div className="pl-4 min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{item.label}</p>
                          <p className="text-[10px] text-zinc-500 font-bold font-mono mt-0.5">{item.info}</p>
                        </div>
                        
                        {/* Circle Green Play Button */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.playAction) {
                              item.playAction();
                            } else if (item.action) {
                              item.action();
                            }
                          }}
                          className="absolute right-3.5 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-8.5 w-8.5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-lg select-none"
                        >
                          <Play className="w-4 h-4 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Made For You (Daily Mix, Coding Mix, Gym, Study, Sleep, Travel) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono">
                    Made For You
                  </h3>
                  <button onClick={() => alert("Curation complete: customized mixes updated hourly based on biometric focus feedback!")} className="text-xs text-zinc-405 hover:text-[#1db954] font-bold font-mono">
                    See All
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  {[
                    { title: "Daily Mix", sub: "Your daily focus loop", from: "from-purple-900/60 to-indigo-950/40", playIdx: 0 },
                    { title: "Coding Mix", sub: "Terminal logic loops", from: "from-[#1db954]/40 to-black", playIdx: 1 },
                    { title: "Gym Mix", sub: "High cadence energy", from: "from-red-950 to-orange-900/30", playIdx: 2 },
                    { title: "Study Mix", sub: "Scholarly binaural beats", from: "from-blue-950 to-cyan-900/30", playIdx: 3 },
                    { title: "Sleep Mix", sub: "Delta brainwave loops", from: "from-slate-900 to-indigo-950/60", playIdx: 4 },
                    { title: "Travel Mix", sub: "Wanderlust acoustic flows", from: "from-amber-950 to-[#ef4444]/10", playIdx: 2 }
                  ].map((mix, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedMix({
                          title: mix.title,
                          sub: mix.sub,
                          from: mix.from,
                          playIdx: mix.playIdx,
                          saves: mix.title === "Daily Mix" ? "642,810 saves" : 
                                 mix.title === "Coding Mix" ? "820,114 saves" :
                                 mix.title === "Gym Mix" ? "419,003 saves" :
                                 mix.title === "Study Mix" ? "1,105,420 saves" :
                                 mix.title === "Sleep Mix" ? "312,410 saves" : "198,540 saves",
                          tracks: getMixTracks(mix.title, trackDatabase)
                        });
                      }}
                      className="group bg-zinc-900/20 hover:bg-zinc-850 border border-zinc-850 p-3.5 rounded-xl transition duration-300 cursor-pointer flex flex-col gap-3 shadow-lg relative overflow-hidden"
                    >
                      {/* Graphics Wrapper */}
                      <div className={`h-28 w-full bg-gradient-to-tr ${mix.from} rounded-lg flex flex-col justify-between p-3 relative shadow-sm border border-zinc-800/60 group-hover:border-zinc-700/60 transition`}>
                        <Music className="w-5 h-5 text-white/50" />
                        <div className="text-[10px] font-black tracking-tight leading-none text-white/90 uppercase font-mono">
                          {mix.title}
                        </div>
                        
                        {/* Play circular indicator */}
                        <div className="absolute right-2 bottom-2 bg-[#1db954] text-black h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all shadow-md">
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{mix.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">{mix.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Trending Section with sub tabs chips */}
              <div className="bg-zinc-950/30 border border-zinc-850 p-5 rounded-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono">
                    Trending
                  </h3>
                  
                  {/* Subsection Selection Chips */}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {["Songs", "Albums", "Artists", "Global Charts"].map((pill) => (
                      <button 
                        key={pill}
                        onClick={() => setSelectedTrendingTab(pill as any)}
                        className={`px-3 py-1.5 rounded-full transition text-[10px] font-bold font-mono uppercase ${
                          selectedTrendingTab === pill
                            ? "bg-white text-black font-extrabold shadow-md" 
                            : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                        }`}
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Content Display based on currently selected tab */}
                {selectedTrendingTab === "Songs" && (
                  <div className="divide-y divide-zinc-900 font-sans">
                    {[
                      { index: 1, title: "Kho Gaye Hum Kahan", artist: "Jubin Nautiyal", color: "text-amber-500", duration: "3:45", playIdx: 0, cover: "from-amber-600" },
                      { index: 2, title: "Heeriye", artist: "Arijit Singh", color: "text-zinc-300", duration: "3:14", playIdx: 1, cover: "from-[#ef4444]" },
                      { index: 3, title: "Tu Hai Kahan", artist: "AUR", color: "text-amber-700", duration: "4:02", playIdx: 2, cover: "from-indigo-600" },
                      { index: 4, title: "Shayad", artist: "Arijit Singh", color: "text-zinc-505", duration: "3:20", playIdx: 3, cover: "from-teal-600" },
                      { index: 5, title: "Hass Hass", artist: "Diljit Dosanjh", color: "text-zinc-505", duration: "2:55", playIdx: 4, cover: "from-purple-600" },
                    ].map((track, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          auraAudio.init();
                          setCurrentTracks(trackDatabase);
                          setCurrentTrackIndex(track.playIdx);
                          setCurrentTime(0);
                          setIsPlaying(true);
                        }}
                        className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-zinc-900/60 transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className={`w-4 text-sm font-black font-mono text-center ${track.color}`}>
                            {track.index}
                          </span>
                          
                          {/* Mini visual album cover art */}
                          <div className={`h-10 w-10 bg-gradient-to-tr ${track.cover} to-zinc-900 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow relative`}>
                            🎵
                            {/* Overlay Play HUD */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <Play className="w-3.5 h-3.5 text-white fill-current" />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-none mb-1 group-hover:text-[#1db954] transition">
                              {track.title}
                            </h4>
                            <p className="text-[10px] text-zinc-500 font-medium truncate">{track.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-550 shrink-0">
                          <span className="hidden sm:inline bg-zinc-900/80 px-2 py-0.5 rounded text-[9px] font-bold border border-zinc-850">
                            Trending #{track.index}
                          </span>
                          <span>{track.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTrendingTab === "Albums" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                    {[
                      { name: "Compiler Dreams", artist: "Horizon", release: "2026", color: "from-emerald-950" },
                      { name: "Cybernetic Velocity", artist: "CyberPulse", release: "2025", color: "from-blue-950" },
                      { name: "Natural Acoustics", artist: "Orchestral Ensemble", release: "2206", color: "from-purple-950" },
                      { name: "Ascension Symphony", artist: "Aura Ensemble", release: "2026", color: "from-red-950" }
                    ].map((alb, idx) => (
                      <div key={idx} className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 hover:bg-zinc-800/40 transition cursor-pointer relative overflow-hidden group">
                        <div className={`h-24 w-full bg-gradient-to-tr ${alb.color} path-sky to-black rounded-lg flex items-center justify-center text-white text-xs select-none shadow-md border border-zinc-800`}>
                          💿
                        </div>
                        <h4 className="text-xs font-bold text-white mt-3 truncate">{alb.name}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1">{alb.artist} • {alb.release}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTrendingTab === "Artists" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                    {[
                      { name: "Arijit Singh", followers: "44.2M followers", cover: "from-red-900" },
                      { name: "The Weeknd", followers: "71.8M followers", cover: "from-[#ef4444]/20" },
                      { name: "CyberPulse", followers: "2.4M followers", cover: "from-cyan-900" },
                      { name: "Jubin Nautiyal", followers: "18.5M followers", cover: "from-emerald-900" }
                    ].map((art, idx) => (
                      <div key={idx} className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 hover:bg-zinc-800/40 transition cursor-pointer text-center relative overflow-hidden group">
                        <div className={`mx-auto h-20 w-20 bg-gradient-to-tr ${art.cover} to-black rounded-full flex items-center justify-center text-white text-lg select-none shadow-lg border border-zinc-800 mb-3`}>
                          👤
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{art.name}</h4>
                        <p className="text-[9px] text-[#1db954] mt-1 font-semibold font-mono">{art.followers}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTrendingTab === "Global Charts" && (
                  <div className="bg-zinc-900/20 border border-zinc-850/60 rounded-xl p-4 flex flex-col gap-3 font-sans">
                    <p className="text-xs text-zinc-400">Weekly breakdown of top algorithm selections globally.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                      <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-lg">
                        <span className="text-[9px] text-[#1db954] font-bold font-mono uppercase bg-[#1db954]/10 border border-[#1db954]/20 px-2 py-0.5 rounded">Top 50 Global</span>
                        <h4 className="text-xs font-bold text-white mt-2">Aura AI Pulse</h4>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Most compiled and streamed tracks. Redefined daily.</p>
                      </div>
                      <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-lg">
                        <span className="text-[9px] text-zinc-500 font-bold font-mono uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">Viral focus hits</span>
                        <h4 className="text-xs font-bold text-white mt-2">Neural Waves List</h4>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Trending alpha background mixes based on student streaking.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. AI Generated Playlists */}
              <div className="space-y-4">
                <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono">
                  AI Generated Playlists
                </h3>
                <p className="text-xs text-zinc-550 leading-none -mt-2">Real-time music sets generated using prompt parameters.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-2">
                  {[
                    { playlist: "Late Night Coding", focus: "Ambient Low", back: "bg-radial from-[#ef4444]/10 via-black to-black", playIdx: 0 },
                    { playlist: "Exam Focus", focus: "Pure Synthwave", back: "bg-radial from-violet-950 via-black to-black", playIdx: 1 },
                    { playlist: "Workout Energy", focus: "Bass EDM Beats", back: "bg-gradient-to-b from-[#1db954]/10 to-black/90", playIdx: 2 },
                    { playlist: "Rainy Evening", focus: "Chill Acoustic", back: "bg-radial from-teal-950 via-black to-black", playIdx: 3 },
                    { playlist: "Productivity Booster", focus: "Alpha wave focus", back: "bg-radial from-[#ec4899]/10 via-black to-black", playIdx: 4 },
                    { playlist: "Motivation Mix", focus: "Modern Orchestral", back: "bg-gradient-to-tr from-[#3b82f6]/10 to-transparent", playIdx: 2 }
                  ].map((pItem, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        auraAudio.init();
                        setCurrentTracks(trackDatabase);
                        setCurrentTrackIndex(pItem.playIdx);
                        setCurrentTime(0);
                        setIsPlaying(true);
                        setDjMessages(prev => [...prev, { sender: "aura", text: `Active set generated: playing '${pItem.playlist}' preset. Neural loops aligned.`, timestamp: "Created" }]);
                      }}
                      className="group bg-zinc-950/40 hover:bg-zinc-850 border border-zinc-850/80 p-3 rounded-xl cursor-pointer transition duration-300 shadow relative overflow-hidden flex flex-col gap-4"
                    >
                      <div className={`h-24 w-full rounded-lg ${pItem.back} flex items-center justify-center relative border border-zinc-900 group-hover:border-zinc-700 transition shadow-inner`}>
                        <Sparkles className="w-6 h-6 text-yellow-500/80 group-hover:scale-115 transition" />
                        
                        {/* Interactive prompt-play icon trigger */}
                        <div className="absolute right-2 bottom-2 bg-[#1db954] text-black h-7 w-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                          <Play className="w-3 h-3 fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white truncate">{pItem.playlist}</h4>
                        <p className="text-[9px] text-[#1db954] font-mono mt-0.5">{pItem.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Discover New Music */}
              <div className="space-y-4">
                <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono">
                  Discover New Music
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Recommended For You", text: "New focus songs you'll love based on bio frequencies.", visual: "circle-pulse", color: "from-purple-900/30" },
                    { title: "Similar Artists", text: "Discover similar music matching Jubin & Arijit's focus patterns.", visual: "artists-link", color: "from-[#1h6954]/20" },
                    { title: "Hidden Gems", text: "Underrated tracks and ambient arrangements.", visual: "diamond", color: "from-blue-900/20" },
                    { title: "New Releases", text: "Fresh acoustic compilations compiled today.", visual: "new-star", color: "from-amber-900/20", badge: "NEW" }
                  ].map((disc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => alert(`Aura Music AI engine is scanning global libraries matching: ${disc.title}`)}
                      className="group bg-zinc-900/30 hover:bg-zinc-850 p-4 rounded-xl border border-zinc-850 hover:border-zinc-700 transition cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#1db954] transition">{disc.title}</h4>
                          {disc.badge && (
                            <span className="bg-[#ef4444] text-black text-[8px] font-extrabold px-1.5 py-0.2 rounded font-mono animate-pulse">
                              {disc.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-450 leading-relaxed pr-2">{disc.text}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-800/40">
                        {disc.visual === "circle-pulse" ? (
                          <div className="h-6 w-6 bg-[#1db954]/20 rounded-full flex items-center justify-center animate-ping" />
                        ) : disc.visual === "diamond" ? (
                          <span className="text-xs">💎</span>
                        ) : (
                          <span className="text-[10px] text-zinc-550 font-mono font-bold uppercase">Explore</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#1db954] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Social Music (Friends Listening, communities) */}
              <div className="space-y-4">
                <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono">
                  Social Music Lobby
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { type: "friend", title: "Friends Listening", meta: "See what friends are playing in real-time.", count: "+12 friends active", action: () => setActiveTab("social") },
                    { type: "community", title: "Community Playlists", meta: "Browse public focus charts curated by developers.", count: "114 public pools" },
                    { type: "liveroom", title: "Live Listening Rooms", meta: "Join active audio synchronize circles.", count: "+8 Rooms LIVE", isLive: true, action: () => setActiveTab("social") },
                    { type: "forum", title: "Music Communities", meta: "Share logs, notes & music theories.", count: "4 active nodes" }
                  ].map((soc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (soc.action) soc.action();
                        else alert(`Social channel loaded: ${soc.title}`);
                      }}
                      className="group bg-[#111111]/80 hover:bg-zinc-900 border border-zinc-850 rounded-xl p-4 cursor-pointer transition min-h-[130px] flex flex-col justify-between shadow"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black text-white">{soc.title}</h4>
                          {soc.isLive && (
                            <span className="bg-[#ef4444] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
                              ● Live
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed pr-1">{soc.type === "friend" ? "Ananya is currently looping 'Binary Moonlight' in Delhi." : soc.meta}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-[9px] font-mono font-bold text-[#1db954]">
                        <span>{soc.count}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#1db954] transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11 & 12 & 13. Horizontal Cluster: Learning + Wellness + Creator Spotlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Learning Section (Section 11) */}
                <div className="bg-zinc-950/40 border border-zinc-850 p-4.5 rounded-2xl flex flex-col justify-between gap-4 shadow relative overflow-hidden group">
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">Section 11 • Learning Suite</span>
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#1db954]" /> Music Tutor
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pr-1">Learn physical fingerings, guitar chords & classic song progressions in real-time.</p>
                  </div>

                  <div className="space-y-1 font-sans text-[10px] font-bold text-zinc-400">
                    {[
                      { name: "🎸 Guitar chord fingerings tutor", action: () => setActiveTab("instrument") },
                      { name: "🎹 Piano touch basics with visual notes", action: () => setActiveTab("instrument") },
                      { name: "📊 Song Structure semantic breakdown", action: () => alert("Analyzing structure of Binary Moonlight: Intro -> verse -> chorus -> acoustic bridge -> synth fade.") },
                      { name: "🎓 Music Theory: Alpha frequency basics" }
                    ].map((step, sIdx) => (
                      <div 
                        key={sIdx}
                        onClick={step.action}
                        className="py-1 px-2 rounded hover:bg-zinc-900 hover:text-white transition cursor-pointer flex justify-between items-center"
                      >
                        <span>{step.name}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-550" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wellness Section (Section 12) with physical volume sliders! */}
                <div className="bg-zinc-950/40 border border-zinc-850 p-4.5 rounded-2xl flex flex-col justify-between gap-4 shadow relative overflow-hidden group">
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">Section 12 • Ambient Wellness</span>
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#1db954]" /> Biosphere Ambient
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">Synthesize therapeutic ambient noise frequencies to offset background stress.</p>
                  </div>

                  {/* Physical volume sliders which connects to sound synthesizers! */}
                  <div className="space-y-3 pt-2">
                    {[
                      { label: "Rain simulation", type: "rain" },
                      { label: "Ocean waves loop", type: "ocean" },
                      { label: "Woodfire crackle", type: "fire" },
                      { label: "Alpha Biofrequencies", type: "binaural" }
                    ].map((wel, wIdx) => (
                      <div key={wIdx} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-zinc-400">{wel.label}</span>
                          <span className="text-[#1db954]">Active</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          defaultValue="0"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setIsWellnessModeActive(wel.type);
                            auraAudio.init();
                            if (wel.type === "rain") {
                              auraAudio.setRainVolume(val);
                            } else if (wel.type === "ocean") {
                              auraAudio.setOceanVolume(val);
                            } else if (wel.type === "fire") {
                              auraAudio.setFireVolume(val);
                            } else if (wel.type === "binaural") {
                              auraAudio.setBrainwaveVolume(val);
                            }
                          }}
                          className="w-full h-1 bg-zinc-900 rounded appearance-none cursor-pointer outline-none hover:bg-zinc-800 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Spotlight (Section 13) */}
                <div className="bg-zinc-950/40 border border-zinc-850 p-4.5 rounded-2xl flex flex-col justify-between gap-4 shadow relative overflow-hidden group">
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">Section 13 • Creator Spotlight</span>
                    <h4 className="text-sm font-black text-[#1db954] flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Creator Platform
                    </h4>
                  </div>

                  <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl space-y-3.5 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                      <div className="h-6.5 w-6.5 bg-gradient-to-tr from-amber-500 to-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold shrink-0">
                        A
                      </div>
                      <div>
                        <h4 className="text-[10.5px] font-bold text-white truncate">Arjun Ray (Indie Artist)</h4>
                        <p className="text-[9px] text-zinc-550 leading-none">Acoustics & Ambient</p>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-zinc-400 leading-normal italic">"Using Aura's neural synthesizer has increased my tracking conversions by 24%."</p>

                    <button 
                      onClick={() => setActiveTab("creator")}
                      className="w-full bg-[#1db954]/10 hover:bg-[#1db954]/20 border border-[#1db954]/20 text-[#1db954] text-[9px] font-bold font-mono py-1.5 rounded-lg transition uppercase text-center"
                    >
                      Audit statistics
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR BENTO AND GRAPH COLUMNS (Col Span 4) */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              
              {/* 9. Aura Wrapped Live Activity */}
              <div className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-2xl space-y-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 to-[#1db954]" />
                
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                    Aura Wrapped Live
                  </h3>
                  
                  {/* Selector Tabs */}
                  <div className="bg-zinc-900/60 p-0.5 rounded-lg border border-zinc-800 flex text-[9px] font-mono font-black uppercase">
                    {["Daily", "Weekly", "Monthly"].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setSelectedWrappedTab(tab as any)}
                        className={`px-2 py-1 rounded transition-colors ${selectedWrappedTab === tab ? "bg-[#1db954] text-black" : "text-zinc-400 hover:text-white"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Graphical Donut Progress indicator */}
                <div className="flex flex-col items-center justify-center py-4 bg-black/40 border border-zinc-900 p-4 rounded-xl relative">
                  <div className="relative h-28 w-28 flex items-center justify-center select-none">
                    {/* SVG Circular path */}
                    <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#18181b" strokeWidth="8" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="#1db954" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="50" className="transition-all duration-1000 ease-out" />
                      <circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="180" />
                    </svg>
                    
                    {/* Centered statistics metadata */}
                    <div className="text-center z-10">
                      <div className="text-lg font-black text-white leading-none">4h 32m</div>
                      <span className="text-[8px] text-zinc-500 font-bold uppercase mt-1 block">Listen Time</span>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 mt-6 text-[10px] font-sans border-t border-zinc-900 pt-4 px-2">
                    <div>
                      <span className="text-zinc-500 block uppercase font-bold text-[8px]">Top Genre</span>
                      <span className="text-white font-black truncate block mt-0.5">Lo-Fi Hip Hop</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-bold text-[8px]">Top Artist</span>
                      <span className="text-white font-black truncate block mt-0.5">The Weeknd</span>
                    </div>
                    <div className="col-span-2 border-t border-zinc-900/40 pt-2.5 mt-1">
                      <span className="text-zinc-500 block uppercase font-bold text-[8px]">Top Song</span>
                      <span className="text-[#1db954] font-black truncate block mt-0.5">Blinding Lights</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Music Journey activity tracker using glowing neon line wave SVG */}
              <div className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                  <div>
                    <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                      Music Journey
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">7 Day Journey activity tracking</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-[#1db954] py-0.5 px-2 rounded-full font-mono font-bold uppercase shadow-sm">
                    Streak: 12d
                  </span>
                </div>

                {/* SVG Glowing line segment graph represent focus blocks logs */}
                <div className="h-28 bg-black/40 border border-zinc-900 rounded-xl relative flex items-end p-2 select-none">
                  <svg className="w-full h-24 overflow-visible" viewBox="0 0 240 80">
                    <defs>
                      <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1db954" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1db954" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Fill Area path */}
                    <path d="M 10 70 Q 40 40 70 55 T 130 25 T 190 35 T 230 15 L 230 75 L 10 75 Z" fill="url(#neonGradient)" />
                    {/* Neon Stroke path */}
                    <path d="M 10 70 Q 40 40 70 55 T 130 25 T 190 35 T 230 15" fill="none" stroke="#1db954" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Data bullets */}
                    <circle cx="10" cy="70" r="4.5" fill="#1db954" stroke="#000" strokeWidth="1.5" />
                    <circle cx="70" cy="55" r="4.5" fill="#1db954" stroke="#000" strokeWidth="1.5" />
                    <circle cx="130" cy="25" r="4.5" fill="#8b5cf6" stroke="#000" strokeWidth="1.5" />
                    <circle cx="190" cy="35" r="4.5" fill="#1db954" stroke="#000" strokeWidth="1.5" />
                    <circle cx="230" cy="15" r="4.5" fill="#1db954" stroke="#90f390" strokeWidth="2" className="animate-ping" />
                  </svg>
                  
                  {/* Floating tooltip labels */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-800 text-[9px] font-mono py-1 px-2.5 rounded shadow-lg uppercase tracking-wider font-extrabold flex items-center gap-1">
                    🎯 Focus Peak <span className="text-[#1db954]">160 mins</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[8px] font-mono font-bold text-zinc-550 uppercase px-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              {/* 10. Music Map (Global country search selection trending songs) */}
              <div className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                  <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                    Music Map
                  </h3>
                  
                  {/* Select interactive country */}
                  <div className="relative">
                    <select 
                      className="bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-350 px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer hover:border-zinc-700 transition font-mono uppercase font-bold"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="USA">🇺🇸 USA</option>
                      <option value="Japan">🇯🇵 Japan</option>
                      <option value="Global">🌐 Global</option>
                    </select>
                  </div>
                </div>

                {/* Vector outlined interactive representation of world map */}
                <div className="h-28 bg-black/40 border border-zinc-900 rounded-xl relative flex items-center justify-center overflow-hidden p-2">
                  <svg className="w-full h-full opacity-35" viewBox="0 0 200 100" fill="#27272a" stroke="#3f3f46" strokeWidth="1">
                    {/* Outlines representing continents */}
                    <rect x="10" y="20" width="30" height="25" rx="5" />
                    <rect x="50" y="30" width="25" height="40" rx="5" />
                    <rect x="90" y="15" width="45" height="30" rx="5" />
                    <rect x="150" y="35" width="20" height="25" rx="5" />
                    <rect x="110" y="55" width="20" height="15" rx="5" />
                    
                    {/* Glowing beacon pulse dots representing global hotspots */}
                    {selectedCountry === "India" && (
                      <circle cx="115" cy="35" r="4.5" fill="#1db954" className="animate-pulse" />
                    )}
                    {selectedCountry === "USA" && (
                      <circle cx="25" cy="30" r="4.5" fill="#3b82f6" className="animate-pulse" />
                    )}
                    {selectedCountry === "Japan" && (
                      <circle cx="130" cy="27" r="4.5" fill="#f43f5e" className="animate-pulse" />
                    )}
                    <circle cx="25" cy="30" r="2" fill="#ef4444" />
                    <circle cx="115" cy="35" r="2" fill="#ef4444" />
                    <circle cx="130" cy="27" r="2" fill="#ef4444" />
                  </svg>

                  {/* Interactive floating state layer */}
                  <div className="absolute inset-0 flex flex-col justify-end p-2.5 bg-gradient-to-t from-[#121212]/90 to-transparent">
                    <span className="text-[8px] text-zinc-550 uppercase font-mono font-bold block leading-none">Regional discovery</span>
                    <div className="text-[10px] font-bold text-white mt-1 pr-1 truncate">
                      Hot focus trend in {selectedCountry === "India" ? "South Asia" : selectedCountry === "USA" ? "North America" : selectedCountry === "Japan" ? "East Asia" : "Worldwide Stream"}:
                    </div>
                  </div>
                </div>

                {/* Country Top Hot tracks lists */}
                <div className="bg-black/35 border border-zinc-900 rounded-xl p-3 space-y-2 text-[10px] sm:text-xs">
                  {selectedCountry === "India" && (
                    <>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-500 font-mono">1.</span> Heeriye</span>
                        <span className="text-[10px] font-mono">Arijit Singh</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-zinc-400 font-mono">2.</span> Kesariya</span>
                        <span className="text-[10px] font-mono">Arijit Singh</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-700 font-mono">3.</span> Pasoori</span>
                        <span className="text-[10px] font-mono">Ali Sethi</span>
                      </div>
                    </>
                  )}
                  {selectedCountry === "USA" && (
                    <>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-500 font-mono">1.</span> Blinding Lights</span>
                        <span className="text-[10px] font-mono">The Weeknd</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-zinc-300 font-mono">2.</span> Starboy</span>
                        <span className="text-[10px] font-mono">The Weeknd</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-700 font-mono">3.</span> Die For You</span>
                        <span className="text-[10px] font-mono">The Weeknd</span>
                      </div>
                    </>
                  )}
                  {selectedCountry === "Japan" && (
                    <>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-500 font-mono">1.</span> Neon Genesis Theme</span>
                        <span className="text-[10px] font-mono">Lofi Cruux</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-zinc-300 font-mono">2.</span> Lofi Sakura Stream</span>
                        <span className="text-[10px] font-mono">Ambient Tokyo</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-700 font-mono">3.</span> First Love</span>
                        <span className="text-[10px] font-mono">Utada Hikaru</span>
                      </div>
                    </>
                  )}
                  {selectedCountry === "Global" && (
                    <>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-500 font-mono">1.</span> Binary Moonlight</span>
                        <span className="text-[10px] font-mono">Horizon</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-zinc-300 font-mono">2.</span> Neon Overdrive</span>
                        <span className="text-[10px] font-mono">CyberPulse</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-amber-700 font-mono">3.</span> Silent Rain</span>
                        <span className="text-[10px] font-mono">Horizon</span>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => alert(`Opening advanced regional maps... Exploring ${selectedCountry} tracking nodes.`)}
                  className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black text-xs font-bold font-mono py-2 rounded-xl transition text-center select-none"
                >
                  Explore Map
                </button>
              </div>

              {/* 14. Live Concert Universe Ticketing module */}
              <div id="concert-universe-section" className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-2xl space-y-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <span className="bg-[#ef4444] text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Featured
                  </span>
                </div>
                
                <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                  Live Concert Universe
                </h3>

                {/* Event banner imagery */}
                <div className="h-32 bg-gradient-to-tr from-purple-950 via-zinc-950 to-indigo-950 rounded-xl relative overflow-hidden flex flex-col justify-end p-4 border border-zinc-900 group-hover:border-zinc-700 transition shadow">
                  {/* Subtle graphical glow beacon */}
                  <div className="absolute -top-12 -left-12 h-28 w-28 bg-[#1db954]/20 rounded-full blur-2xl group-hover:bg-[#1db954]/30 transition duration-500" />
                  
                  <div className="z-10 leading-none">
                    <span className="text-[9px] text-[#1db954] uppercase tracking-wider font-mono font-bold">Upcoming Tour</span>
                    <h4 className="text-lg font-black text-white mt-1">Arijit Singh</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">Live in Mumbai Concert Arena</p>
                  </div>
                </div>

                {/* Date location tickets availability */}
                <div className="flex justify-between items-center text-xs font-sans text-zinc-300 px-1 py-1 bg-black/20 rounded-lg p-2.5 border border-zinc-900/60">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-400 text-[11px]">
                    <span className="text-rose-400">📅</span> 21 Dec 2026
                    <span className="text-zinc-650">•</span> Mumbai
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono font-bold bg-zinc-900 px-2 py-1.5 rounded uppercase border border-zinc-850">94% Booked</span>
                </div>

                {/* Direct Booking Confetti state support */}
                <button 
                  onClick={() => {
                    alert("🎟️ Ticket Booked successfully! Confirmed 2x General Admission passes. Digital tickets containing secure QR credentials are saved to your email (anishkumar37210@gmail.com). We'll tune in!");
                  }}
                  className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black text-xs font-bold font-mono py-2.5 rounded-xl transition text-center select-none shadow-lg shadow-[#1db954]/10"
                >
                  Book Tickets
                </button>

                {/* RSVP Avatars Pile display */}
                <div className="flex items-center gap-2 px-1 pt-1">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-800 border border-black/80 flex items-center justify-center text-[8px] font-sans font-bold">AN</div>
                    <div className="h-6 w-6 rounded-full bg-indigo-900 border border-black/80 flex items-center justify-center text-[8px] font-sans font-bold text-indigo-200">R</div>
                    <div className="h-6 w-6 rounded-full bg-emerald-900 border border-black/80 flex items-center justify-center text-[8px] font-sans font-bold text-emerald-200">S</div>
                  </div>
                  <span className="text-[10px] text-zinc-550 font-sans font-medium hover:text-white transition">+12 friends are attending</span>
                </div>
              </div>

            </div>

          </div>
          )
        )}

        {/* PLAYER HUB TAB */}
        {activeTab === "player" && (
          <div className="space-y-8 animate-slideUp">
            
            {activePlayerTab === "home" ? (
              /* SPOTIFY WEB PLAYER HOME */
              <div className="space-y-10">
                
                {/* Greeting Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                      {getGreeting()}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">Ready for some curated focus arrangements? Let's tune in.</p>
                  </div>
                  
                  {/* Search / filter chips */}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {["All", "Focus Music", "Collaborative Syncs"].map((pill) => (
                      <span 
                        key={pill}
                        className={`px-3 py-1.5 rounded-full transition text-[11px] select-none cursor-pointer ${
                          pill === "All"
                            ? "bg-white text-black font-extrabold" 
                            : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick-Access Grid (Dual Column, 6 Items) resembling actual Spotify Home layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* 1. Liked Songs list */}
                  <div 
                    onClick={() => {
                      auraAudio.init();
                      const likedOnes = trackDatabase.filter(t => isLiked[t.id]);
                      if (likedOnes.length > 0) {
                        setCurrentTracks(likedOnes);
                      } else {
                        setCurrentTracks(trackDatabase);
                      }
                      setCurrentTrackIndex(0);
                      setCurrentTime(0);
                      setIsPlaying(true);
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Starting playback of your Liked focus tracks. Enjoy the customized mix!", timestamp: "Synced" }]);
                    }}
                    className="group relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md"
                  >
                    <div className="h-16 w-16 bg-gradient-to-tr from-indigo-700 to-purple-900 flex items-center justify-center shrink-0 shadow-lg relative">
                      <Heart className="w-7 h-7 text-white fill-current animate-pulse" />
                    </div>
                    <div className="pl-4 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">Liked Songs</p>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        {Object.values(isLiked).filter(Boolean).length} tracks saved
                      </p>
                    </div>
                    
                    {/* Circular green play button floating inside the grid card */}
                    <div className="absolute right-4 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40">
                      <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* 2. Deep Focus Flow State */}
                  <div 
                    onClick={() => {
                      auraAudio.init();
                      const filtered = trackDatabase.filter(t => t.moods.includes("Focused"));
                      setCurrentTracks(filtered);
                      setCurrentTrackIndex(0);
                      setIsPlaying(true);
                      setCurrentTime(0);
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Deep focus flow frequencies enabled.", timestamp: "Synced" }]);
                    }}
                    className="group relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md"
                  >
                    <div className="h-16 w-16 bg-gradient-to-tr from-[#1db954] to-emerald-950 flex items-center justify-center shrink-0 shadow-lg">
                      <Music className="w-7 h-7 text-[#1db954]" />
                    </div>
                    <div className="pl-4 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">Deep Focus Flow</p>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        Station: Focused
                      </p>
                    </div>
                    <div className="absolute right-4 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40">
                      <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* 3. Cozy Room Relaxation */}
                  <div 
                    onClick={() => {
                      auraAudio.init();
                      const filtered = trackDatabase.filter(t => t.moods.includes("Relaxed"));
                      setCurrentTracks(filtered);
                      setCurrentTrackIndex(0);
                      setIsPlaying(true);
                      setCurrentTime(0);
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Cozy Relaxation lo-fi background vibes enabled.", timestamp: "Synced" }]);
                    }}
                    className="group relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md"
                  >
                    <div className="h-16 w-16 bg-gradient-to-tr from-sky-600 to-indigo-950 flex items-center justify-center shrink-0 shadow-lg">
                      <Clock className="w-7 h-7 text-sky-400" />
                    </div>
                    <div className="pl-4 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">Relaxing Space Lo-fi</p>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        Station: Relaxed
                      </p>
                    </div>
                    <div className="absolute right-4 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40">
                      <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* 4. Power Focus EDM */}
                  <div 
                    onClick={() => {
                      auraAudio.init();
                      const filtered = trackDatabase.filter(t => t.moods.includes("Motivated"));
                      setCurrentTracks(filtered);
                      setCurrentTrackIndex(0);
                      setIsPlaying(true);
                      setCurrentTime(0);
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: High-energy focus pulses triggered.", timestamp: "Synced" }]);
                    }}
                    className="group relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md"
                  >
                    <div className="h-16 w-16 bg-gradient-to-tr from-amber-500 to-orange-950 flex items-center justify-center shrink-0 shadow-lg">
                      <Flame className="w-7 h-7 text-amber-400 animate-pulse" />
                    </div>
                    <div className="pl-4 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">High-Octane Focus</p>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        Station: Motivated
                      </p>
                    </div>
                    <div className="absolute right-4 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40">
                      <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* 5. Joy Station Vaporwave */}
                  <div 
                    onClick={() => {
                      auraAudio.init();
                      const filtered = trackDatabase.filter(t => t.moods.includes("Happy"));
                      setCurrentTracks(filtered);
                      setCurrentTrackIndex(0);
                      setIsPlaying(true);
                      setCurrentTime(0);
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Vaporwave joy dopamine loops enabled.", timestamp: "Synced" }]);
                    }}
                    className="group relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md"
                  >
                    <div className="h-16 w-16 bg-gradient-to-tr from-fuchsia-600 to-violet-950 flex items-center justify-center shrink-0 shadow-lg">
                      <Sparkles className="w-7 h-7 text-fuchsia-400" />
                    </div>
                    <div className="pl-4 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">Pleasant State Dopamine</p>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        Station: Happy
                      </p>
                    </div>
                    <div className="absolute right-4 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40">
                      <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* 6. Live AI Co-Dj Curated Mix */}
                  <div 
                    onClick={() => {
                      auraAudio.init();
                      setCurrentTracks(trackDatabase);
                      setCurrentTrackIndex(0);
                      setIsPlaying(true);
                      setCurrentTime(0);
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Slot Activated: Full library sequence play enabled.", timestamp: "Synced" }]);
                    }}
                    className="group relative bg-[#181818] hover:bg-[#282828] select-none border border-zinc-800/40 rounded-xl overflow-hidden flex items-center pr-12 cursor-pointer transition duration-300 shadow-md"
                  >
                    <div className="h-16 w-16 bg-gradient-to-tr from-[#1db954] to-zinc-900 flex items-center justify-center shrink-0 shadow-lg">
                      <Radio className="w-7 h-7 text-[#1db954]" />
                    </div>
                    <div className="pl-4 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">Aura AI Synced Master Pool</p>
                      <p className="text-[10px] text-zinc-500 font-semibold font-mono mt-0.5">
                        Station: All Tracks
                      </p>
                    </div>
                    <div className="absolute right-4 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/40">
                      <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                    </div>
                  </div>

                </div>

                {/* Section: Made For You / AI Instruments (SQUARE PLAYLIST CARDS) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Made For You • Interactive AI Companions
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Card 1: AI DJ Chat */}
                    <div 
                      onClick={() => setActivePlayerTab("dj")}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40 shadow-xl"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-[#1db954]/20 to-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800/50 shadow-md overflow-hidden">
                        <MessageSquare className="w-12 h-12 text-[#1db954] group-hover:scale-110 transition duration-300" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-3 right-3 shadow-lg shadow-black/50 hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">Aura Co-DJ Chat</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed h-8">
                        Tell the intelligent DJ what sounds, filter rates, or tracks to mix.
                      </p>
                    </div>

                    {/* Card 2: Prompt Playlist Generator */}
                    <div 
                      onClick={() => setActivePlayerTab("playlist")}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40 shadow-xl"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-indigo-500/10 to-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800/50 shadow-md overflow-hidden">
                        <Sparkles className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition duration-300" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-3 right-3 shadow-lg shadow-black/50 hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">AI Prompt Playlist</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed h-8">
                        Assemble beautiful custom playlists using descriptive Gemini AI prompting.
                      </p>
                    </div>

                    {/* Card 3: Cloud Vocal Waves */}
                    <div 
                      onClick={() => setActivePlayerTab("creation")}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40 shadow-xl"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-amber-500/10 to-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800/50 shadow-md overflow-hidden">
                        <Zap className="w-12 h-12 text-amber-400 group-hover:scale-110 transition duration-300" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-3 right-3 shadow-lg shadow-black/50 hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">Creative Synth Studio</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed h-8">
                        Fine-tune custom vocal and track samples inspired by physical models.
                      </p>
                    </div>

                    {/* Card 4: Lyrics Intelligence */}
                    <div 
                      onClick={() => setActivePlayerTab("lyrics")}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40 shadow-xl"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-sky-500/10 to-zinc-905 rounded-lg flex items-center justify-center mb-4 border border-zinc-800/50 shadow-md overflow-hidden text-sky-450">
                        <BookOpen className="w-12 h-12 group-hover:scale-110 transition duration-300" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-3 right-3 shadow-lg shadow-black/50 hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">Lyrics Mastermind</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed h-8">
                        Analyze lyric structures, mental flow modes, and target semantic meanings.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Section: Aura Flow Mood Stations (SQUARE MOOD CARDS) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Popular Curated Focus Stations</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    
                    {/* Mood 1: Focused */}
                    <div 
                      onClick={() => {
                        auraAudio.init();
                        const filtered = trackDatabase.filter(t => t.moods.includes("Focused"));
                        setCurrentTracks(filtered);
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                        setCurrentTime(0);
                        setDjMessages(prev => [...prev, { sender: "aura", text: "Focus Flow playlist loaded successfully.", timestamp: "Synced" }]);
                      }}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-[#1db954]/40 to-zinc-900 rounded-lg flex items-center justify-center mb-3">
                        <Music className="w-10 h-10 text-white" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-2 right-2 shadow-lg hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">Focused Flow State</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">High focus frequency synth configurations.</p>
                    </div>

                    {/* Mood 2: Relaxed */}
                    <div 
                      onClick={() => {
                        auraAudio.init();
                        const filtered = trackDatabase.filter(t => t.moods.includes("Relaxed"));
                        setCurrentTracks(filtered);
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                        setCurrentTime(0);
                        setDjMessages(prev => [...prev, { sender: "aura", text: "Relaxed Ambient session started.", timestamp: "Synced" }]);
                      }}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-sky-500/30 to-zinc-900 rounded-lg flex items-center justify-center mb-3">
                        <Clock className="w-10 h-10 text-white" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-2 right-2 shadow-lg hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">Chill Relaxation Lo-fi</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">Lush ambient strings and low background ocean ripples.</p>
                    </div>

                    {/* Mood 3: Motivated */}
                    <div 
                      onClick={() => {
                        auraAudio.init();
                        const filtered = trackDatabase.filter(t => t.moods.includes("Motivated"));
                        setCurrentTracks(filtered);
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                        setCurrentTime(0);
                        setDjMessages(prev => [...prev, { sender: "aura", text: "Power driven lead tracks triggered for active coding.", timestamp: "Synced" }]);
                      }}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-red-500/30 to-zinc-900 rounded-lg flex items-center justify-center mb-3">
                        <Flame className="w-10 h-10 text-white" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-2 right-2 shadow-lg hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">Power Driven Leads</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">Accelerated clicks, drums, and lead frequencies.</p>
                    </div>

                    {/* Mood 4: Happy */}
                    <div 
                      onClick={() => {
                        auraAudio.init();
                        const filtered = trackDatabase.filter(t => t.moods.includes("Happy"));
                        setCurrentTracks(filtered);
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                        setCurrentTime(0);
                        setDjMessages(prev => [...prev, { sender: "aura", text: "Vaporwave dopamine loops triggered successfully.", timestamp: "Synced" }]);
                      }}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-yellow-500/20 to-zinc-900 rounded-lg flex items-center justify-center mb-3">
                        <Sparkles className="w-10 h-10 text-white" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-2 right-2 shadow-lg hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">Vaporwave Joy Dopamine</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">High bubble pitch notes and energetic progressions.</p>
                    </div>

                    {/* Mood 5: All Tracks */}
                    <div 
                      onClick={() => {
                        auraAudio.init();
                        setCurrentTracks(trackDatabase);
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                        setCurrentTime(0);
                        setDjMessages(prev => [...prev, { sender: "aura", text: "Loaded master arrangement sequence play.", timestamp: "Synced" }]);
                      }}
                      className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40"
                    >
                      <div className="relative aspect-square w-full bg-gradient-to-tr from-purple-500/20 to-zinc-900 rounded-lg flex items-center justify-center mb-3">
                        <Radio className="w-10 h-10 text-white animate-pulse" />
                        <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-2 right-2 shadow-lg hover:scale-105 active:scale-95">
                          <Play className="w-5 h-5 text-black fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">Aura Master Mix</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">Complete library arrangement sequencer.</p>
                    </div>

                  </div>
                </div>

                {/* Section: Recommended Tracks (Full Original Tracks Catalog) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Today's Focus Recommended Tracklist</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {trackDatabase.map((t, index) => {
                      const isThisCurrent = currentTrack.id === t.id && isPlaying;
                      return (
                        <div 
                          key={t.id}
                          onClick={() => {
                            auraAudio.init();
                            setCurrentTracks(trackDatabase);
                            setCurrentTrackIndex(index);
                            setCurrentTime(0);
                            setIsPlaying(true);
                            setDjMessages(prev => [...prev, { sender: "aura", text: `Active Track Selected: '${t.title}'`, timestamp: "Synced" }]);
                          }}
                          className={`group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all duration-300 select-none border border-zinc-800/40`}
                        >
                          <div className="relative aspect-square w-full bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center mb-3 border border-zinc-800/50">
                            <Music className={`w-8 h-8 text-zinc-650 transition duration-300 ${isThisCurrent ? "text-[#1db954]" : "group-hover:scale-105"}`} />
                            
                            {/* Visualizer bar mini effects */}
                            {isThisCurrent && (
                              <div className="absolute inset-x-0 bottom-2 flex gap-0.5 justify-center items-end h-6">
                                <span className="bg-[#1db954] w-0.5 h-full animate-[bounce_0.6s_infinite_100ms]" />
                                <span className="bg-[#1db954] w-0.5 h-[65%] animate-[bounce_0.6s_infinite_200ms]" />
                                <span className="bg-[#1db954] w-0.5 h-[90%] animate-[bounce_0.6s_infinite_150ms]" />
                              </div>
                            )}
                            
                            <div className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-9 w-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-2 right-2 shadow-lg hover:scale-105 active:scale-95">
                              <Play className="w-4 h-4 text-black fill-current translate-x-0.5" />
                            </div>
                          </div>
                          
                          <h4 className={`font-bold text-xs truncate ${isThisCurrent ? "text-[#1db954]" : "text-white"}`}>{t.title}</h4>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{t.artist}</p>
                          
                          <div className="flex justify-between items-center mt-2.5">
                            <span className="text-[8px] font-mono border border-zinc-800 text-[10px] bg-zinc-900 px-1.5 py-0.2 rounded text-zinc-500 font-bold uppercase truncate">
                              {t.genre}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500 font-semibold shrink-0">
                              {Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              /* OTHERWISE, SHOW DUAL BENTO GRID LAYOUT */
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Premium Spotify Playlist Browser (Col Span 6) */}
                <div className="lg:col-span-6 bg-zinc-950/40 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-5 justify-between shadow-2xl relative overflow-hidden">
                
                {/* Visual Accent top border bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1db954] to-emerald-500" />

                {/* Cover & metadata Header Banner */}
                <div className="bg-[#181818]/80 border border-zinc-800/50 p-4.5 rounded-xl flex flex-col sm:flex-row gap-4 items-center relative overflow-hidden">
                  <div className="h-24 w-24 bg-gradient-to-tr from-[#1db954] to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shrink-0 group relative cursor-pointer">
                    <Music className="w-10 h-10 text-black group-hover:scale-105 transition" />
                    {isPlaying && (
                      <div className="absolute bottom-1.5 flex gap-0.5 items-center justify-center h-4 w-5">
                        <span className="bg-black w-0.5 h-full animate-[bounce_0.6s_infinite_100ms]" />
                        <span className="bg-black w-0.5 h-full animate-[bounce_0.6s_infinite_200ms]" />
                        <span className="bg-black w-0.5 h-full animate-[bounce_0.6s_infinite_300ms]" />
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left min-w-0 flex-1">
                    <span className="text-[9px] text-[#1db954] uppercase tracking-wider font-mono font-extrabold bg-[#1db954]/10 border border-[#1db954]/20 px-2 py-0.5 rounded-full">
                      FOCUS STATION
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-1.5 truncate">
                      {currentMood} Flow State
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal truncate">
                      Synthesized frequency currents for high focus and deep mental resonance.
                    </p>
                    <div className="text-[10px] text-zinc-400 font-mono mt-3.5 flex flex-wrap justify-center sm:justify-start items-center gap-2">
                      <span className="text-white font-bold">Aura AI Agent</span>
                      <span>•</span>
                      <span className="text-[#1db954] font-bold">{currentTracks.length} arrangements</span>
                      <span>•</span>
                      <span>~14 mins total</span>
                    </div>
                  </div>
                </div>

                {/* Spotify-style Track Table Listing */}
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold px-2 font-mono uppercase border-b border-zinc-900 pb-2">
                    <span>#  TITLE &amp; ALBUM</span>
                    <span>GENRE &amp; DUR</span>
                  </div>

                  <div className="space-y-1 max-h-[290px] overflow-y-auto spotify-scrollbar pr-1">
                    {currentTracks.map((t, idx) => {
                      const isCurrent = currentTrack.id === t.id;
                      return (
                        <div 
                          key={t.id}
                          onClick={() => {
                            auraAudio.init();
                            setCurrentTrackIndex(idx);
                            setCurrentTime(0);
                            setIsPlaying(true);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition select-none group border ${
                            isCurrent 
                              ? "bg-zinc-900/90 border-[#1db954]/20 text-[#1db954]" 
                              : "bg-transparent border-transparent hover:bg-zinc-900/60 text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className={`w-3 font-mono text-center text-xs ${isCurrent ? "text-[#1db954] font-bold" : "text-zinc-500"}`}>
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${isCurrent ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>
                                {t.title}
                              </p>
                              <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                                {t.artist} • <span className="text-zinc-650">{t.album || "Studio Synth"}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 font-mono text-[10px]">
                            <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[8px] border border-zinc-800">
                              {t.genre}
                            </span>
                            <span className="text-zinc-500 font-mono">
                              {Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Remix Configuration Footer block */}
                <div className="border-t border-zinc-900 pt-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                      <Filter className="w-3.5 h-3.5 text-[#1db954]" /> AI Remix Synthesizer
                    </span>
                    <span className="text-[9px] text-[#1db954] bg-[#1db954]/10 px-2 py-0.5 rounded font-mono font-bold">
                      Current: {activeRemix}
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1 text-[9px] font-mono leading-none">
                    {[
                      { id: "Default", label: "NORM" },
                      { id: "Lo-Fi", label: "LOFI" },
                      { id: "EDM", label: "EDM" },
                      { id: "Nightcore", label: "FAST" },
                      { id: "Acoustic", label: "RAW" },
                      { id: "Piano", label: "SOLO" }
                    ].map((rem) => (
                      <button
                        key={rem.id}
                        onClick={() => handleRemixApply(rem.id as any)}
                        className={`py-1.5 rounded transition ${
                          activeRemix === rem.id 
                            ? "bg-[#1db954] text-black font-extrabold shadow-md shadow-[#1db954]/15" 
                            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {rem.label}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-zinc-500 italic font-mono leading-normal bg-black/40 p-2 border border-zinc-900 rounded">
                    * {remixMessage}
                  </p>
                </div>

              </div>

              {/* Right Side: AI Assistant Bento Blocks (Col Span 6) */}
              <div className="lg:col-span-6 bg-zinc-950/40 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-xl min-h-[560px]">
                
                {/* Secondary navigation buttons */}
                <div className="flex border-b border-white/5 pb-3 mb-4 overflow-x-auto gap-1">
                  {[
                    { id: "home", label: "Dashboard Home", icon: Home },
                    { id: "dj", label: "Aura DJ Chat", icon: MessageSquare },
                    { id: "playlist", label: "AI Prompt Playlist", icon: Sparkles },
                    { id: "creation", label: "Song Creator Studio", icon: Zap },
                    { id: "lyrics", label: "Lyrics Intelligence", icon: BookOpen }
                  ].map((subT) => {
                    const SubIcon = subT.icon;
                    return (
                      <button
                        key={subT.id}
                        id={`subtab-${subT.id}`}
                        onClick={() => setActivePlayerTab(subT.id as any)}
                        className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl transition whitespace-nowrap leading-none ${
                          activePlayerTab === subT.id 
                            ? "bg-[#1db954]/10 text-[#1db954] border border-[#1db954]/20 shadow-md font-sans" 
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5" />
                        <span>{subT.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub Tab Page contents */}
                <div className="flex-1 my-3 pr-1 overflow-y-auto">
                  
                  {/* A. DJ AURA CHAT ASSISTANT PANE */}
                  {activePlayerTab === "dj" && (
                    <div className="space-y-4 flex flex-col h-[340px] justify-between">
                      {/* Messages scrollarea */}
                      <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[290px] pr-2">
                        {djMessages.map((msg, mIdx) => (
                          <div 
                            key={mIdx} 
                            className={`flex gap-3 text-xs ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                          >
                            <div className={`h-8 w-8 bg-black/60 rounded-xl flex items-center justify-center font-bold font-mono text-indigo-400 leading-none select-none border border-white/5`}>
                              {msg.sender === "user" ? "U" : "DJ"}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-3 border ${msg.sender === "user" ? "bg-indigo-500/10 border-indigo-500/20 font-sans text-zinc-300" : "bg-black/60 border-white/5 text-zinc-300 shadow-inner"}`}>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                              <span className="text-[9px] text-zinc-500 font-mono block mt-2 text-right">{msg.timestamp}</span>
                            </div>
                          </div>
                        ))}
                        {isDjloding && (
                          <div className="flex items-center gap-2 text-xs font-mono text-indigo-405">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            <span>DJ Aura is researching the music libraries...</span>
                          </div>
                        )}
                      </div>

                      {/* Input panel */}
                      <form onSubmit={handleSendChat} className="relative flex items-center pt-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Command: 'play high bpm gym beats' or 'skip sad tracks'..."
                          className="w-full bg-black/45 border border-white/5 p-3.5 pl-4 pr-12 rounded-xl text-xs text-white outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                        />
                        <button 
                          id="dj-send-btn"
                          type="submit" 
                          className="absolute right-3.5 text-indigo-400 hover:text-indigo-300"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* B. AI SMART PLAYLIST GENERATOR PANE */}
                  {activePlayerTab === "playlist" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                          Generative Track Sequencing
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Explain your specific mood or task, and Gemini will map out structured themed songs instantly.
                        </p>
                      </div>

                      <div className="relative flex gap-2">
                        <input
                          type="text"
                          value={playlistPrompt}
                          onChange={(e) => setPlaylistPrompt(e.target.value)}
                          placeholder="Create a list for late-night Rust debugging with heavy lo-fi rain noise..."
                          className="flex-1 bg-black/45 border border-white/5 p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-505/40 focus:ring-1 focus:ring-indigo-500/20 font-sans"
                        />
                        <button
                          id="generate-playlist-btn"
                          onClick={() => triggerAIPlaylistGeneration(playlistPrompt)}
                          disabled={isPlaylistGenerating}
                          className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold rounded-xl text-xs whitespace-nowrap transition disabled:opacity-55 shadow-lg shadow-indigo-600/20"
                        >
                          {isPlaylistGenerating ? "GENERATING..." : "GENERATE"}
                        </button>
                      </div>

                      {/* Display response list */}
                      {createdPlaylist && (
                        <div className="glass p-4 rounded-2xl space-y-4 mt-2">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div>
                              <h5 className="font-bold text-zinc-100 text-sm font-sans flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-400" /> {createdPlaylist.name}
                              </h5>
                              <p className="text-zinc-500 text-xs mt-1 italic leading-normal">{createdPlaylist.description}</p>
                            </div>
                            <button
                              id="load-ai-playlist-btn"
                              onClick={() => loadAIPlaylistIntoPlayer(createdPlaylist)}
                              className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-mono font-bold rounded-lg leading-none transition text-[10px] whitespace-nowrap"
                            >
                              LOAD QUEUE
                            </button>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-white/5 font-mono text-[11px]">
                            {createdPlaylist.tracks.map((t, tIdx) => {
                              const isCurrentPlaying = currentTrack.id === t.id && isPlaying;
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => {
                                    auraAudio.init();
                                    setCurrentTracks(createdPlaylist.tracks);
                                    setCurrentTrackIndex(tIdx);
                                    setCurrentTime(0);
                                    setIsPlaying(true);
                                    setDjMessages(prev => [...prev, { sender: "aura", text: `Streaming the generated track arrangement: '${t.title}'`, timestamp: "Active" }]);
                                  }}
                                  className={`w-full flex justify-between items-center text-left py-1.5 px-2 rounded-lg transition-colors border border-transparent ${
                                    isCurrentPlaying 
                                      ? "bg-[#1db954]/15 border-[#1db954]/30 text-[#1db954]" 
                                      : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                                  }`}
                                  title="Play Track Now"
                                >
                                  <span className="truncate pr-1 flex items-center gap-1.5">
                                    <span className="text-[10px] text-zinc-500 w-4 inline-block text-right">{tIdx + 1}.</span>
                                    <span className="font-sans font-semibold text-xs text-zinc-200 truncate">{t.title}</span> 
                                    <span className="text-zinc-500 font-normal truncate">by {t.artist}</span>
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                                      {t.genre}
                                    </span>
                                    {isCurrentPlaying ? (
                                      <span className="text-[#1db954] text-[9px] animate-pulse">● PLAYING</span>
                                    ) : (
                                      <span className="text-zinc-650 text-[9px] hover:text-[#1db954]">▶ PLAY</span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* C. SONG CREATOR STUDIO */}
                  {activePlayerTab === "creation" && (
                    <div className="space-y-4 text-xs font-mono pr-1">
                      
                      <div className="space-y-1">
                        <span className="text-[10px] text-indigo-400 block font-mono">CONVERT VISUALS AND CONCEPTS</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider block">original custom song generator</h4>
                      </div>

                      <form onSubmit={triggerOriginalSongCreation} className="space-y-3 bg-black/45 p-4 rounded-2xl border border-white/5 leading-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input 
                            type="text"
                            value={promptSongCreator}
                            onChange={(e) => setPromptSongCreator(e.target.value)}
                            placeholder="Prompt: 'Digital sunset over a beach'"
                            className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-white text-xs outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 md:col-span-2"
                          />
                          <select 
                            value={creatorGenre}
                            onChange={(e) => setCreatorGenre(e.target.value)}
                            className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-white text-xs outline-none focus:border-indigo-505/40 focus:ring-1 focus:ring-indigo-500/20"
                          >
                            <option value="Lo-Fi Beats">Ambient Lo-Fi</option>
                            <option value="Electro EDM">Synthpop EDM</option>
                            <option value="Chill Step">Chill Step</option>
                            <option value="Piano Solo">Cinematic Piano</option>
                          </select>
                        </div>

                        <button 
                          id="generate-song-submit-btn"
                          type="submit"
                          disabled={isSongCreating}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition text-xs select-none leading-none shadow-lg shadow-indigo-600/20"
                        >
                          {isSongCreating ? "SYNTHESIZING LYRICS SHEET..." : "CREATE ORIGINAL TRACK METRICS"}
                        </button>
                      </form>

                      {/* Display results */}
                      {generatedSongDetail && (
                        <div className="glass p-4 rounded-2xl space-y-3.5 text-xs text-zinc-300">
                          <div>
                            <span className="text-[10px] text-indigo-400 block pb-0.5">AI GENERATED SONG INSIGHTS</span>
                            <h5 className="font-bold text-white text-sm tracking-tight">{generatedSongDetail.title}</h5>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-3">
                            <div className="space-y-1 bg-black/60 p-3 rounded-xl max-h-48 overflow-y-auto font-sans leading-relaxed text-zinc-400 border border-white/5">
                              <span className="font-mono text-[10px] text-indigo-400 block pb-1 border-b border-white/5">GENERATED LYRICS:</span>
                              <pre className="text-xs whitespace-pre-wrap leading-normal font-sans pt-1 block">{generatedSongDetail.lyrics}</pre>
                            </div>

                            <div className="space-y-3 font-mono text-[11px]">
                              <div>
                                <span className="text-[10px] text-amber-500 block font-bold">RECOMMENDED CHORD SHAPES:</span>
                                <p className="text-zinc-300 font-bold mt-0.5">{generatedSongDetail.chordProgression}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-indigo-400 block font-bold">SYNTH DESIGN SUMMARY:</span>
                                <p className="text-[10px] text-zinc-400 leading-normal mt-0.5">{generatedSongDetail.soundDesign}</p>
                              </div>

                              {/* Interactive synthesizer oscillator testing */}
                              <div className="bg-black/60 border border-white/5 p-2 rounded-xl mt-2">
                                <span className="text-[9px] text-zinc-500 block font-bold uppercase pb-1.5">PREVENT KEYBOARD TEST TONES:</span>
                                <div className="flex gap-1">
                                  {["C4", "E4", "G4", "B4"].map((note, noteIdx) => {
                                    const frequenciesMap = [261.63, 329.63, 392.00, 493.88];
                                    return (
                                      <button
                                        key={note}
                                        onClick={() => auraAudio.playSynthNote(frequenciesMap[noteIdx], "sine", 0.4)}
                                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-indigo-400 hover:text-white transition font-mono text-[10px] flex-1 font-bold"
                                      >
                                        PLAY {note}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* D. AI LYRICS METRIC INTELLIGENCE */}
                  {activePlayerTab === "lyrics" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Lyrics lines left column */}
                      <div className="bg-black/45 p-4 border border-white/5 rounded-2xl max-h-[300px] overflow-y-auto">
                        <span className="text-[10px] text-zinc-550 font-mono block pb-2 border-b border-white/5">
                          CLICK ANALYSIS PIN TO ANALYZE METAPHORS WITH GEMINI
                        </span>

                        <div className="space-y-3.5 mt-3 text-xs leading-normal font-sans text-zinc-300">
                          {currentTrack.lyrics.map((l, lIdx) => (
                            <div key={lIdx} className="flex justify-between items-center group">
                              <p className="font-medium pr-2 italic">"{l}"</p>
                              <button
                                id={`lyrics-analyze-btn-${lIdx}`}
                                onClick={() => triggerLyricIntelligence(l, lIdx)}
                                className={`p-1.5 rounded-lg border transition ${activeLyricIndex === lIdx ? "bg-indigo-500/15 border-indigo-550 text-indigo-400" : "bg-white/5 border-white/5 text-zinc-500 hover:text-white"}`}
                              >
                                <Compass className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gemini Interpretations panels right column */}
                      <div className="space-y-4 font-mono">
                        <div className="glass p-4 rounded-2xl relative">
                          <span className="text-[10px] text-indigo-400 font-mono block font-bold">GEMINI LINE METAPHOR ANALYSIS:</span>
                          {isLyricsLoading ? (
                            <div className="flex items-center gap-2 text-xs font-mono p-3 text-indigo-400">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                              <span>Decomposing semantic layers...</span>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-2.5">
                              {lyricsExplanation}
                            </p>
                          )}
                        </div>

                        {lyricsTranslation && !isLyricsLoading && (
                          <div className="glass p-3 rounded-xl border border-white/5">
                            <span className="text-[10px] text-amber-500 font-mono block font-bold">EXPLAINED MULTILINGUAL CONTEXTS:</span>
                            <p className="text-[11px] text-zinc-400 leading-normal mt-1 block font-sans">
                              {lyricsTranslation}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* Simulated Voice Search Controls at bottom right */}
                <div className="border-t border-white/5 pt-3 flex flex-wrap justify-between items-center gap-3 font-mono text-[10px] text-zinc-400 bg-white/5 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-indigo-400" />
                    <span>VOICE SEARCH:</span>
                    <button 
                      id="voice-mic-btn"
                      onClick={handleTriggerVoiceSpeech}
                      className={`px-3 py-1 bg-black/60 border border-white/5 rounded font-bold transition text-[9px] truncate max-w-[140px] focus:outline-none ${isListeningVoice ? "bg-red-900/40 text-red-400 border-red-500 animate-pulse" : "text-indigo-400 hover:text-white"}`}
                    >
                      {isListeningVoice ? "LISTENING..." : voiceSearchText ? voiceSearchText : "TAP MIC"}
                    </button>
                  </div>
                  <span>Aura Sound AI Processing</span>
                </div>

              </div>

            </div>

            {/* Bottom Bento Row: Real-time Mood, Smart Routines, Breathing exercise */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Bento Row A: Real-time Mood Selector */}
              <div className="glass p-6 rounded-3xl space-y-4 shadow-xl">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    Real-time Mood Indexer
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Select your current psychological focus state to trigger custom-tailored sonic streams instantly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { mode: "Focused", label: "Focused ⚡" },
                    { mode: "Relaxed", label: "Relaxed 🍃" },
                    { mode: "Motivated", label: "Motivated 🔥" },
                    { mode: "Happy", label: "Happy ✨" },
                    { mode: "Sad", label: "Midnight Lore 🌧️" },
                    { mode: "Stressed", label: "Stress Release 🛸" }
                  ].map((m) => (
                    <button
                      key={m.mode}
                      onClick={() => handleMoodSelect(m.mode)}
                      className={`py-2 px-3 border rounded-xl text-xs font-mono font-bold text-left transition ${currentMood === m.mode ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-550/5" : "bg-black/60 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      auraAudio.stopAll();
                      setDjMessages(prev => [...prev, { sender: "aura", text: "Playback and active synthesis engines have been fully stopped. Take a deep breath.", timestamp: "Cleared" }]);
                    }}
                    className="w-full py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 rounded-2xl text-xs font-mono font-black transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/10 hover:shadow-red-900/15"
                  >
                    <span>STOP MUSIC & SYNTHS 🛑</span>
                  </button>
                </div>
              </div>

              {/* Bento Row B: Smart Daily Routine Planner */}
              <div className="glass p-6 rounded-3xl space-y-4 shadow-xl">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    Smart Daily Scheduler
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Your intelligent music ecosystem schedules specific arrangements depending on the hour of workspace.
                  </p>
                </div>

                <div className="space-y-3.5 font-mono text-xs">
                  <button 
                    onClick={() => loadSmartRoutine("morning")}
                    className="w-full text-left flex justify-between items-center bg-black/65 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 transition"
                  >
                    <span>🌅 Morning Gym Drive (08:30)</span>
                    <span className="text-indigo-400 text-[10px] font-bold">6 Tracks</span>
                  </button>

                  <button 
                    onClick={() => loadSmartRoutine("desk")}
                    className="w-full text-left flex justify-between items-center bg-black/65 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 transition"
                  >
                    <span>💻 Debug Focus Desk (13:10)</span>
                    <span className="text-indigo-400 text-[10px] font-bold">10 Tracks</span>
                  </button>

                  <button 
                    onClick={() => loadSmartRoutine("evening")}
                    className="w-full text-left flex justify-between items-center bg-black/65 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 transition"
                  >
                    <span>🌆 Cozy Twilight Walk (18:45)</span>
                    <span className="text-indigo-400 text-[10px] font-bold">5 Tracks</span>
                  </button>

                  <button 
                    onClick={() => loadSmartRoutine("dream")}
                    className="w-full text-left flex justify-between items-center bg-black/65 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 transition"
                  >
                    <span>🌌 Cosmic Dreamscape (22:30)</span>
                    <span className="text-indigo-400 text-[10px] font-bold">Alpha Active</span>
                  </button>
                </div>
              </div>

              {/* Bento Row C: Wellness Breathing Exercise advisor */}
              <div className="glass p-6 rounded-3xl flex flex-col justify-between shadow-xl">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    Anti-Anxiety Breath Anchor
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Synchronize your autonomic breath waves to decompress physical and mental stress loops during complex compilations.
                  </p>
                </div>

                {/* Interactive Breathing circle with expand / shrink animation matching state timer */}
                <div className="flex items-center gap-4 py-3 select-none">
                  <div className="relative flex items-center justify-center">
                    {/* Pulsating outer circle */}
                    <div 
                      className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 transition-all duration-1000 ease-in-out shadow-lg shadow-indigo-500/10"
                      style={{
                        transform: breathePhase === "Inhale" ? "scale(1.3)" : breathePhase === "Hold" ? "scale(1.3)" : "scale(1.0)"
                      }}
                    >
                      <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold font-mono text-xs shadow-lg">
                        {breatheSeconds}s
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <span className="text-[10px] text-zinc-500 block uppercase">BREATH PROTOCOL: 4-4-4</span>
                    <span className="font-bold text-indigo-400 block tracking-tight uppercase shadow-indigo-400/20">
                      {breathePhase === "Inhale" && "Inhale Deeply (Nose)"}
                      {breathePhase === "Hold" && "Hold Breath Still"}
                      {breathePhase === "Exhale" && "Exhale Slowly (Mouth)"}
                    </span>
                    <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                      Let the simulated ambient soundscape float.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    )}

        {/* POMODORO DESK TAB */}
        {activeTab === "pomodoro" && <Pomodoro />}

        {/* INSTRUMENTAL STUDIO TAB */}
        {activeTab === "instrument" && <LearningSuite />}

        {/* SOCIAL CIRCLES TAB */}
        {activeTab === "social" && (
          <div className="space-y-12">
            <div>
              <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/10">
                COMMUNITY HUB &amp; SYNC PARTY LOBBY
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-3">
                Aura Listening Parties &amp; Global Circles
              </h2>
              <p className="text-zinc-400 mt-2 text-sm max-w-2xl">
                Collaborate in real-time sync with global developer desks. Chat live, upvote adjacent tracks, and read user reflections on timelines.
              </p>
            </div>

            {/* Simulated Listening Rooms */}
            <ListeningRooms />

            {/* Social Posts Thread */}
            <SocialHub />
          </div>
        )}

        {/* MUSIC DNA TAB */}
        {activeTab === "musicdna" && (
          <div className="space-y-8 text-white animate-slideUp">
            {/* Header Banner */}
            <div className="border-b border-white/5 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-500/10 text-[#1db954] font-mono text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20 font-bold flex items-center gap-1.5 w-fit">
                  <Dna className="w-3.5 h-3.5 animate-pulse" /> BIO-NEURAL TELEMETRY DECK
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-3 font-sans">
                  Aura Music DNA Analytics
                </h2>
                <p className="text-zinc-400 mt-2 text-sm max-w-2xl">
                  Analyze your real-time cognitive coherence patterns, adjust binaural brainwave carrier frequencies, and design customized focusing soundscapes.
                </p>
              </div>

              {/* Top Summary Interactive Quick Badge */}
              <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-850 p-3 rounded-2xl shadow-md">
                <div className="h-10 w-10 bg-[#1db954]/10 rounded-xl flex items-center justify-center text-[#1db954]">
                  <Fingerprint className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Biometric Signature</div>
                  <div className="text-xs font-black text-white">Anish.BioFlow.2026</div>
                </div>
                <span className="text-[9px] bg-emerald-500/15 text-[#1db954] border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-black ml-2">Verified</span>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

              {/* LEFT COLUMN: Carrier frequency tuner & Preset selections (col-span-8) */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                
                {/* 1. Real-time Wave Tuner Interactive Console */}
                <div className="bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <div>
                      <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                        Biophysical Soundwave Generator
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Control live binaural beat resonance straight to your headphones</p>
                    </div>
                    
                    {/* Audio Status Indicator */}
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${dnaVolume > 0 ? "bg-[#1db954] animate-ping" : "bg-zinc-650"}`} />
                      <span className="text-[10.5px] font-mono font-bold text-zinc-400 uppercase font-bold">
                        {dnaVolume > 0 ? "Synthesized: Active" : "Suspended"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Carrier Frequency Slider */}
                    <div className="space-y-3 bg-black/30 p-4.5 rounded-xl border border-zinc-900/60">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-zinc-300">Carrier Tone (Base Pitch)</span>
                        <span className="text-[#1db954] font-mono">{dnaCarrierFreq} Hz</span>
                      </div>
                      <input 
                        type="range"
                        min="100"
                        max="400"
                        step="5"
                        value={dnaCarrierFreq}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setDnaCarrierFreq(val);
                          if (dnaVolume > 0) {
                            auraAudio.setBinauralFrequencies(val, dnaBeatFreq);
                          }
                        }}
                        className="w-full h-1 bg-zinc-900 rounded appearance-none cursor-pointer outline-none hover:bg-zinc-805 transition"
                      />
                      <p className="text-[9.5px] text-zinc-500 leading-normal">
                        Adjusts the base acoustic frequency. Lower tones (around 150-200Hz) provide deeper acoustic resonance suited for low-light focus sessions.
                      </p>
                    </div>

                    {/* Binaural Beat Slider */}
                    <div className="space-y-3 bg-black/30 p-4.5 rounded-xl border border-zinc-900/60">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-zinc-300">Binaural Beat (Brainwave Target)</span>
                        <span className="text-[#1db954] font-mono">+{dnaBeatFreq} Hz (Beat)</span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max="30"
                        step="0.5"
                        value={dnaBeatFreq}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDnaBeatFreq(val);
                          if (dnaVolume > 0) {
                            auraAudio.setBinauralFrequencies(dnaCarrierFreq, val);
                          }
                        }}
                        className="w-full h-1 bg-zinc-900 rounded appearance-none cursor-pointer outline-none hover:bg-zinc-805 transition"
                      />
                      <p className="text-[9.5px] text-zinc-500 leading-normal">
                        Controls the difference between Left and Right ear waves. Your brain synthesizes this difference hook as a sub-harmonic wave cue.
                      </p>
                    </div>
                  </div>

                  {/* Volume Slider & Playback Trigger Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 bg-zinc-900/20 border border-zinc-900 p-4 rounded-xl">
                    <button 
                      onClick={() => {
                        auraAudio.init();
                        if (dnaVolume > 0) {
                          setDnaVolume(0);
                          auraAudio.setBrainwaveVolume(0);
                        } else {
                          setDnaVolume(0.5);
                          auraAudio.setBrainwaveVolume(0.5);
                          // Delay slightly to allow AudioContext to build L and R oscillators
                          setTimeout(() => {
                            auraAudio.setBinauralFrequencies(dnaCarrierFreq, dnaBeatFreq);
                          }, 100);
                        }
                      }}
                      className={`w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                        dnaVolume > 0 
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" 
                          : "bg-[#1db954] hover:bg-[#1ed760] text-black shadow-lg shadow-[#1db954]/20"
                      }`}
                    >
                      {dnaVolume > 0 ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" /> Stop Generator
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current translate-x-0.5" /> Start Generator Tones
                        </>
                      )}
                    </button>

                    {/* Master Tuning slider feedback */}
                    <div className="flex-1 w-full space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold font-mono">
                        <span>VOLUME GAIN:</span>
                        <span>{Math.round(dnaVolume * 100)}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={dnaVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDnaVolume(val);
                          auraAudio.init();
                          auraAudio.setBrainwaveVolume(val);
                          if (val > 0) {
                            auraAudio.setBinauralFrequencies(dnaCarrierFreq, dnaBeatFreq);
                          }
                        }}
                        className="w-full h-1 bg-zinc-950 rounded appearance-none cursor-pointer outline-none hover:bg-zinc-800 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Target Presets Selectors */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black tracking-wider text-zinc-400 uppercase font-mono">
                    Select Neural Presets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "Alpha Focus", carrier: 200, beat: 10, desc: "Alpha states (10Hz) target calm concentration, logical synthesis, and high data density absorption.", resonance: "94% Coherence", badge: "Focus" },
                      { name: "Theta Insight", carrier: 180, beat: 6, desc: "Theta states (6Hz) support dream-like creative flow, intuition spikes, and holistic problem parsing.", resonance: "88% Discovery", badge: "Acoustics" },
                      { name: "Beta Intellect", carrier: 220, beat: 15, desc: "Beta states (15Hz) are tuned for rapid mental scanning, analytical tests, and high mental pressure.", resonance: "91% Energy", badge: "Academics" },
                      { name: "Delta Recovery", carrier: 150, beat: 2.5, desc: "Delta states (2.5Hz) calm the autonomic nervous system to trigger rapid systemic rest and cell rebuild.", resonance: "96% Sleepiness", badge: "Unwind" }
                    ].map((pre) => {
                      const isActive = dnaSelectedPreset === pre.name;
                      return (
                        <div 
                          key={pre.name}
                          onClick={() => {
                            setDnaSelectedPreset(pre.name);
                            setDnaCarrierFreq(pre.carrier);
                            setDnaBeatFreq(pre.beat);
                            auraAudio.init();
                            if (dnaVolume > 0) {
                              auraAudio.setBinauralFrequencies(pre.carrier, pre.beat);
                            } else {
                              // Trigger auto play on preset change if user wants!
                              setDnaVolume(0.4);
                              auraAudio.setBrainwaveVolume(0.4);
                              setTimeout(() => {
                                auraAudio.setBinauralFrequencies(pre.carrier, pre.beat);
                              }, 100);
                            }
                          }}
                          className={`bg-zinc-950/40 p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[160px] group relative ${
                            isActive 
                              ? "border-[#1db954] bg-[#1db954]/5 ring-1 ring-[#1db954]/20" 
                              : "border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/30"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-white group-hover:text-[#1db954] transition">{pre.name}</span>
                              <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                                isActive ? "bg-[#1db954] text-black" : "bg-zinc-900 text-zinc-400"
                              }`}>
                                {pre.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono font-bold">
                              {pre.carrier}Hz • +{pre.beat}Hz Beat
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal mt-2 pr-1">{pre.desc}</p>
                          </div>

                          <div className="border-t border-zinc-900/60 pt-3 mt-3 flex justify-between items-center text-[10px] font-semibold">
                            <span className="text-zinc-500 font-mono font-medium">Alignment</span>
                            <span className={isActive ? "text-[#1db954]" : "text-zinc-400"}>{pre.resonance}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. DNA Sequencing History / Chronology */}
                <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                    <div>
                      <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                        Aura Sequencing logs
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Chronological breakdown of songs aligned with neural parameters</p>
                    </div>

                    {/* Interactive Log adder button */}
                    <button 
                      onClick={() => {
                        const songName = prompt("Enter track name to log into DNA telemetry database:", "Blinding Lights (Chamber Acoustic)");
                        if (songName) {
                          const keys = ["A minor", "C Major", "G minor", "E major"];
                          const statusList = ["Alpha Synchronized", "Solfeggio Resonance", "Cognitive Boost", "Gamma Coherence"];
                          const newLog = {
                            id: Date.now(),
                            title: songName,
                            key: keys[Math.floor(Math.random() * keys.length)],
                            originalFreq: "432Hz Ambient",
                            time: "Synced just now",
                            status: statusList[Math.floor(Math.random() * statusList.length)],
                            color: "text-emerald-400"
                          };
                          setDnaHistory([newLog, ...dnaHistory]);
                        }
                      }}
                      className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[#1db954] px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition uppercase flex items-center gap-1 shrink-0 bg-zinc-950"
                    >
                      <Plus className="w-3 h-3" /> Log Custom Sequence
                    </button>
                  </div>

                  <div className="divide-y divide-zinc-900/60">
                    {dnaHistory.map((lh, idx) => (
                      <div key={lh.id} className="flex justify-between items-center py-3 px-1 hover:bg-zinc-900/30 rounded-xl transition">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="text-zinc-600 text-sm font-black font-mono">#{idx+1}</span>
                          
                          <div className="h-9 w-9 bg-zinc-900 border border-zinc-850 rounded-lg flex items-center justify-center font-bold text-xs select-none">
                            🧬
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate hover:text-[#1db954] leading-none mb-1">{lh.title}</h4>
                            <p className="text-[10px] text-zinc-400 font-medium">Harmonics: <span className="text-zinc-300 font-bold">{lh.key}</span> • Preset: {lh.originalFreq}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono shrink-0 text-right">
                          <div className="hidden sm:block">
                            <span className="text-zinc-500 block text-[9px] font-medium leading-none mb-0.5">{lh.time}</span>
                            <span className={`text-[10px] font-bold ${lh.color}`}>{lh.status}</span>
                          </div>
                          
                          {/* Test preview note button */}
                          <button 
                            onClick={() => {
                              auraAudio.init();
                              auraAudio.playSynthNote(dnaCarrierFreq + (idx * 30), "triangle", 0.6);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                            title="Verify Harmonic Frequency note"
                          >
                            <Activity className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive DNA helix & Certificate generator (col-span-4) */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                
                {/* 1. Animated DNA Double Helix Visualization */}
                <div className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-xl">
                  {/* Subtle pulsing background glow */}
                  <div className="absolute inset-0 bg-[#1db954]/5 pointer-events-none" />

                  <div className="flex justify-between items-start pb-2 border-b border-zinc-900/60 z-10 font-sans">
                    <div>
                      <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                        DNA Helix Simulator
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Physical telemetry map indicator</p>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-[#1db954] py-0.5 px-2 rounded-full font-mono font-bold uppercase animate-pulse">
                      Live Pulse
                    </span>
                  </div>

                  {/* SVG Animated double helix representation */}
                  <div className="h-44 flex items-center justify-center relative select-none">
                    <svg className="w-full h-36" viewBox="0 0 300 144">
                      {/* Generates a stylized DNA helix strand using sine/cosine paths */}
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((node) => {
                        const x = 20 + node * 24;
                        // Outer sine offsets
                        const offsetSine = Math.sin((node + (dnaCarrierFreq / 100)) * 0.8) * 45;
                        const offsetCosine = -Math.sin((node + (dnaCarrierFreq / 100)) * 0.8) * 45;
                        const yL = 72 + offsetSine;
                        const yR = 72 + offsetCosine;
                        return (
                          <g key={node}>
                            {/* Connecting rung line */}
                            <line 
                              x1={x} 
                              y1={yL} 
                              x2={x} 
                              y2={yR} 
                              stroke={dnaVolume > 0 ? "#1db954" : "#27272a"} 
                              strokeWidth="1.5" 
                              strokeDasharray="2,2" 
                              opacity="0.6"
                            />
                            {/* Node 1 */}
                            <circle 
                              cx={x} 
                              cy={yL} 
                              r="4.5" 
                              fill={dnaVolume > 0 ? "#1db954" : "#4f46e5"} 
                              opacity="0.9"
                            />
                            {/* Node 2 */}
                            <circle 
                              cx={x} 
                              cy={yR} 
                              r="4.5" 
                              fill={dnaVolume > 0 ? "#a855f7" : "#3f3f46"} 
                              opacity="0.8"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Centered Frequency overlay status */}
                    <div className="absolute text-center bg-black/60 backdrop-blur-sm border border-zinc-850 rounded-xl py-1.5 px-3">
                      <span className="text-[8px] text-zinc-500 uppercase block font-bold font-mono">Binaural Carrier</span>
                      <span className="text-xs font-black text-[#1db954]">{dnaCarrierFreq} Hz + {dnaBeatFreq}Hz</span>
                    </div>
                  </div>

                  {/* Quantitative Biometric indices bars */}
                  <div className="space-y-3.5 border-t border-zinc-900 pt-4 z-10 font-sans text-xs">
                    {/* Index 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-zinc-400">Cognitive Coherence Index</span>
                        <span className="text-[#1db954]">92.4%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-[#1db954] h-full transition-all duration-500" style={{ width: "92.4%" }} />
                      </div>
                    </div>

                    {/* Index 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-zinc-400">Left-Right Hemispheric Sync</span>
                        <span className="text-indigo-400">97.8%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500" style={{ width: "97.8%" }} />
                      </div>
                    </div>

                    {/* Index 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-zinc-400">Autonomic Settling Score</span>
                        <span className="text-amber-400">84/100</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all animate-pulse" style={{ width: "84%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Premium Certificate Exporter Card */}
                <div className="bg-zinc-950/50 border border-zinc-850 p-5 rounded-2xl space-y-4 shadow-xl">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase font-mono">
                      DNA flow certificate
                    </h3>
                    <p className="text-[10px] text-zinc-500">Generate a cryptographically verified mental workflow index</p>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed pr-1">
                    Compile and export your verified alpha listening statistics, deep focus streaks, and customized waveform alignments into a portable certificate document.
                  </p>

                  <button 
                    onClick={() => {
                      setDnaGeneratingCertificate(true);
                      setDnaCertificateResult(null);
                      // Simulate progressive compiling states
                      setTimeout(() => {
                        setDnaCertificateResult({
                          holder: "Anish Kumar",
                          score: 92,
                          level: 23,
                          topFreq: `${dnaCarrierFreq}Hz (Alpha Focus)`,
                          serial: `AURA-DNA-${Math.floor(100000 + Math.random()*900000)}`,
                          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                        });
                        setDnaGeneratingCertificate(false);
                      }, 2000);
                    }}
                    disabled={dnaGeneratingCertificate}
                    className="w-full bg-[#1db954]/10 hover:bg-[#1db954]/20 border border-[#1db954]/30 text-[#1db954] text-xs font-bold font-mono py-3 rounded-xl transition duration-300 uppercase select-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {dnaGeneratingCertificate ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#1db954]" /> Processing telemetry...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" /> Synthesize DNA Flow Report
                      </>
                    )}
                  </button>

                  {/* Compiled report display */}
                  {dnaCertificateResult && (
                    <div className="bg-[#121212] border border-zinc-800 rounded-xl p-4 space-y-4 relative overflow-hidden animate-slideUp">
                      {/* Certificate cryptographic watermark background */}
                      <div className="absolute -right-6 -bottom-6 text-zinc-900 shadow-sm font-mono text-8xl font-black select-none pointer-events-none">
                        AURA
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] text-[#1db954] font-mono font-bold uppercase tracking-widest bg-[#1db954]/10 border border-[#1db954]/20 px-2 py-0.5 rounded-full">Report Verified</span>
                          <h4 className="text-xs font-bold text-white mt-1.5">{dnaCertificateResult.holder}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-zinc-500 font-mono uppercase block font-bold">Serial Hash</span>
                          <span className="text-[9px] text-zinc-300 font-mono font-bold">{dnaCertificateResult.serial}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] pt-2 border-t border-zinc-900">
                        <div>
                          <span className="text-zinc-500 block font-bold font-mono text-[8px]">FLOW STREAK</span>
                          <span className="text-white font-bold">12 Days Active</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block font-bold font-mono text-[8px]">TOP FREQUENCY</span>
                          <span className="text-white font-bold">{dnaCertificateResult.topFreq}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block font-bold font-mono text-[8px]">PROFILE SCORE</span>
                          <span className="text-[#1db954] font-bold">Score: {dnaCertificateResult.score} (A+)</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block font-bold font-mono text-[8px]">DATE COMPILED</span>
                          <span className="text-white font-bold">{dnaCertificateResult.date}</span>
                        </div>
                      </div>

                      {/* Download link helper */}
                      <button 
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dnaCertificateResult, null, 2));
                          const dlAnchorElem = document.createElement('a');
                          dlAnchorElem.setAttribute("href",     dataStr     );
                          dlAnchorElem.setAttribute("download", `${dnaCertificateResult.serial}-AuraDNA.json`);
                          dlAnchorElem.click();
                        }}
                        className="w-full bg-zinc-900 hover:bg-zinc-850 text-white text-[10px] font-bold font-mono py-2 rounded-lg border border-zinc-850 transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-zinc-400" /> Export Certificate Config (.json)
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* CREATOR PLATFORM TAB */}
        {activeTab === "creator" && (
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-5">
              <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/10">
                CREATOR PLATFORM &amp; FAN SUBSCRIPTION PORTAL
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-3 font-sans">
                Artist Discovery Dashboard
              </h2>
              <p className="text-zinc-400 mt-2 text-sm max-w-2xl">
                Audit track performance statistics, upload fresh waveform spectrogram assets, configure custom subscriber tiers, and collect direct micro-tips securely.
              </p>
            </div>

            <CreatorSuite />
          </div>
        )}

        {/* SETTINGS & CONTROL CENTER TAB */}
        {activeTab === "settings" && (
          <div className="animate-slideUp">
            <SettingsControlCenter />
          </div>
        )}

          </>
        )}
      </main>

      </div> {/* Encapsulates the flex-1 upper split height */}

      {/* SPOTIFY FIXED BOTTOM PLAYBACK CONTROLLER BAR (90px) */}
      <footer className="hidden md:flex h-[90px] bg-[#121212] border-t border-zinc-900 items-center justify-between px-4 sm:px-6 select-none relative z-50 text-white shadow-2xl">
        
        {/* Left Section: Active Track Information */}
        <div 
          onClick={() => setIsExpandedPlayerOpen(true)}
          className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none sm:w-1/4 cursor-pointer hover:bg-zinc-900/60 p-1.5 rounded-xl transition-all duration-300"
          title="Open Expanded Player View"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 bg-zinc-900 rounded-md overflow-hidden shrink-0 border border-zinc-800 shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-tr from-[#1db954]/20 to-zinc-900 flex items-center justify-center ${isPlaying ? "animate-pulse" : ""}`}>
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-[#1db954]" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate hover:text-[#1db954] transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-zinc-400 truncate hover:text-white transition-colors mt-0.5">
              {currentTrack.artist}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Stop from opening the expanded player when only liking
              toggleLike(currentTrack.id);
            }}
            className="p-1 px-1.5 text-zinc-400 hover:text-white transition group shrink-0"
            title="Add to Library"
          >
            <Heart 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition ${isLiked[currentTrack.id] ? "fill-[#1db954] text-[#1db954] scale-110" : "text-zinc-400 group-hover:scale-110"}`} 
            />
          </button>
        </div>

        {/* Center Section: Core Playback seek speed controls */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-sm sm:max-w-md md:max-w-xl px-2 sm:px-4 min-w-0">
          <div className="flex items-center gap-3 sm:gap-5 justify-center">
            <button 
              onClick={() => {
                const moods = ["Focused", "Relaxed", "Motivated", "Happy"];
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                handleMoodSelect(randomMood);
              }}
              title="Shuffle Moods Stream"
              className="p-1 text-zinc-400 hover:text-white transition transform hover:scale-105 hidden xs:block"
            >
              <Radio className="w-4 h-4 text-zinc-400 hover:text-[#1db954]" />
            </button>

            <button 
              onClick={handlePrevTrack}
              title="Previous Track"
              className="p-1 text-zinc-400 hover:text-white transition transform hover:scale-110"
            >
              <SkipBack className="w-4 h-4 fill-current text-zinc-300 hover:text-white" />
            </button>

            <button 
              onClick={handlePlayPause}
              title={isPlaying ? "Pause" : "Play"}
              className="h-8 w-8 bg-white hover:bg-zinc-150 rounded-full flex items-center justify-center shadow transition transform hover:scale-105 select-none shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-black fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 text-black fill-current translate-x-0.5" />
              )}
            </button>

            <button 
              onClick={handleNextTrack}
              title="Next Track"
              className="p-1 text-zinc-400 hover:text-white transition transform hover:scale-110"
            >
              <SkipForward className="w-4 h-4 fill-current text-zinc-300 hover:text-white" />
            </button>

            <button 
              onClick={() => {
                auraAudio.playSynthNote(880, "triangle", 0.15);
                setDjMessages(prev => [...prev, { sender: "aura", text: `I've accelerated the synthesizer click rate synchronizer! Pulse of beats elevated.`, timestamp: "Remix" }]);
              }}
              title="Quicken Clock Sync"
              className="p-1 text-zinc-400 hover:text-[#1db954] transition transform hover:scale-105 hidden xs:block"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Draggable Progress timeline */}
          <div className="w-full flex items-center gap-2 sm:gap-3 text-[10px] font-mono text-zinc-400 select-none min-w-0">
            <span className="w-7 text-right shrink-0">
              {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, "0")}
            </span>
            
            <input 
              type="range"
              min="0"
              max={currentTrack.duration}
              value={currentTime}
              onChange={(e) => {
                setCurrentTime(parseInt(e.target.value, 10));
              }}
              className="flex-grow h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1db954] outline-none hover:bg-zinc-700 transition"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${(currentTime / currentTrack.duration) * 100}%, #27272a ${(currentTime / currentTrack.duration) * 100}%, #27272a 100%)`
              }}
            />

            <span className="w-7 shrink-0">
              {Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right Section: Volume & Master Stopping Engines */}
        <div className="hidden md:flex items-center justify-end gap-3 lg:gap-4 w-1/4 max-w-[240px] shrink-0">
          
          {/* Quick Quality details */}
          <span className="text-[9px] bg-zinc-800 border border-zinc-700/50 text-[#1db954] px-2 py-0.5 rounded font-mono font-bold uppercase hidden lg:inline-block">
            {audioQuality} HD
          </span>

          {/* Master Kill switch */}
          <button
            onClick={() => {
              setIsPlaying(false);
              auraAudio.stopAll();
              setDjMessages(prev => [...prev, { sender: "aura", text: "Master Audio synth loop streams have been fully halted. Feel tranquility.", timestamp: "Halted" }]);
            }}
            className="px-2 py-1 bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/10 rounded font-mono text-[9px] font-bold transition shrink-0 hidden sm:inline-block"
            title="Stop Synth Context"
          >
            STOP SYNTH
          </button>

          {/* Interactive Volume Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isMuted) {
                  auraAudio.setMusicVolume(volume);
                  setIsMuted(false);
                } else {
                  auraAudio.setMusicVolume(0);
                  setIsMuted(true);
                }
              }}
              className="text-zinc-400 hover:text-white transition"
              title="Mute / Unmute"
            >
              <Volume2 className={`w-4 h-4 ${isMuted ? "text-red-400" : "text-zinc-400 hover:text-white"}`} />
            </button>

            <input 
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) / 100;
                setVolume(val);
                setIsMuted(false);
                auraAudio.setMusicVolume(val);
              }}
              className="w-16 lg:w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1db954] outline-none hover:bg-zinc-700 transition"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${isMuted ? 0 : volume * 100}%, #27272a ${isMuted ? 0 : volume * 100}%, #27272a 100%)`
              }}
            />
          </div>

        </div>

      </footer>

      {/* MOBILE FLOATING MINI PLAYER & BOTTOM NAVIGATION BAR (Matches User Screenshot exactly!) */}
      <div className="md:hidden">
        {/* Floating Mini Player Pill */}
        {currentTrack && hasPlayedOnce && (
          <div 
            onClick={() => setIsExpandedPlayerOpen(true)}
            className="fixed bottom-[68px] left-3 right-3 h-[60px] bg-gradient-to-r from-[#440f1c] to-[#2d0a13] rounded-2xl border border-white/5 shadow-2xl flex items-center justify-between px-3.5 z-40 select-none cursor-pointer active:scale-[0.98] transition-all duration-150"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)"
            }}
          >
            {/* Visual bottom progress bar strip */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              />
            </div>

            {/* Left section: Track artwork and info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative h-9 w-9 bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-white/5 shadow-sm">
                <div className={`absolute inset-0 bg-gradient-to-tr from-[#1db954]/20 to-zinc-800 flex items-center justify-center ${isPlaying ? "animate-pulse" : ""}`}>
                  <Music className="w-4 h-4 text-[#1db954]" />
                </div>
              </div>
              <div className="min-w-0 pr-2">
                <h4 className="text-[11.5px] font-bold text-white truncate leading-tight tracking-tight">
                  {currentTrack.title}
                </h4>
                <p className="text-[9.5px] text-zinc-400 truncate mt-0.5 font-sans font-medium">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Right section: Mobile control buttons */}
            <div className="flex items-center gap-4.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              {/* Device connect button */}
              <button 
                onClick={() => {
                  alert(`Connecting to Aura Mobile Speaker... Streaming active at ${audioQuality} quality.`);
                }}
                className="p-1 text-zinc-300 hover:text-white transition active:scale-90"
                title="Connect Device"
              >
                <Smartphone className="w-[18px] h-[18px]" />
              </button>

              {/* Liked checkmark toggle inside a circle */}
              <button 
                onClick={() => toggleLike(currentTrack.id)}
                className="p-1 transition active:scale-95"
                title={isLiked[currentTrack.id] ? "Saved in Library" : "Add to Library"}
              >
                <CheckCircle 
                  className={`w-[19px] h-[19px] transition-all ${
                    isLiked[currentTrack.id] 
                      ? "fill-[#1db954] text-black" 
                      : "text-zinc-500 hover:text-white"
                  }`} 
                />
              </button>

              {/* Play Pause control element */}
              <button 
                onClick={handlePlayPause}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition active:scale-90"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4.5 h-4.5 text-white fill-current" />
                ) : (
                  <Play className="w-4.5 h-4.5 text-white fill-current translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#090909]/98 pb-1 border-t border-zinc-900/80 flex items-center justify-around text-white z-40">
          {/* 1. Home tab */}
          <button 
            onClick={() => {
              setSelectedLibraryCollection(null);
              setActiveTab("musichub");
            }}
            className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white"
          >
            <Home className={`w-5 h-5 ${activeTab === "musichub" && !selectedLibraryCollection ? "text-[#1db954]" : "text-zinc-400"}`} />
            <span className={`text-[9px] font-bold tracking-tight ${activeTab === "musichub" && !selectedLibraryCollection ? "text-white" : "text-zinc-400"}`}>Home</span>
          </button>

          {/* 2. Search tab (sets focus/actives search area) */}
          <button 
            onClick={() => {
              setSelectedLibraryCollection(null);
              setActiveTab("musichub");
              setTimeout(() => {
                const searchEl = document.getElementById("hub-search-input");
                if (searchEl) {
                  searchEl.scrollIntoView({ behavior: "smooth", block: "center" });
                  searchEl.focus();
                }
              }, 150);
            }}
            className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white"
          >
            <Search className="w-5 h-5 text-zinc-400" />
            <span className="text-[9px] font-bold tracking-tight text-zinc-400">Search</span>
          </button>

          {/* 3. Library tab */}
          <button 
            onClick={() => {
              setSelectedLibraryCollection("Liked Songs");
              setActiveTab("musichub");
            }}
            className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white"
          >
            <Layers className={`w-5 h-5 ${selectedLibraryCollection === "Liked Songs" ? "text-[#1db954]" : "text-zinc-400"}`} />
            <span className={`text-[9px] font-bold tracking-tight ${selectedLibraryCollection === "Liked Songs" ? "text-white" : "text-zinc-400"}`}>Your Library</span>
          </button>

          {/* 4. Create tab */}
          <button 
            onClick={() => {
              setSelectedLibraryCollection(null);
              setActiveTab("creator");
            }}
            className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white"
          >
            <Plus className={`w-5 h-5 ${activeTab === "creator" ? "text-[#1db954]" : "text-zinc-400"}`} />
            <span className={`text-[9px] font-bold tracking-tight ${activeTab === "creator" ? "text-white" : "text-zinc-400"}`}>Create</span>
          </button>
        </div>
      </div>

      {/* FULL EXPANDED MOBILE/ALL PLAYER OVERLAY (Matches user screenshot exactly!) */}
      {isExpandedPlayerOpen && (
        <div className="fixed inset-0 bg-[#0c0d14] z-50 flex flex-col justify-between p-6 select-none text-white animate-slideUp">
          
          {/* Top Row: Simple Back / Collapse controller */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsExpandedPlayerOpen(false)}
              className="text-zinc-450 hover:text-white p-2 bg-zinc-900 border border-zinc-800 rounded-xl transition"
              title="Close Player"
            >
              <X className="w-5 h-5 text-zinc-300" />
            </button>
            <span className="text-[10px] tracking-widest font-mono text-zinc-500 font-bold uppercase">
              Now Playing From {currentMood.toUpperCase()} Station
            </span>
            <div className="w-9 h-9" /> {/* Spacer */}
          </div>

          {/* Cover Art section to look extremely aesthetic */}
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            <div className={`relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-gradient-to-tr from-[#1db954] to-emerald-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800/80 flex items-center justify-center transition-transform duration-500 ${isPlaying ? "scale-105" : "scale-95"}`}>
              <Music className={`w-24 h-24 sm:w-28 sm:h-28 text-white ${isPlaying ? "animate-pulse text-[#1db954]" : ""}`} />
              <div className="absolute inset-0 bg-black/10" />
              {isPlaying && (
                <div className="absolute bottom-4 flex gap-1 h-8 items-end justify-center">
                  <span className="bg-[#1db954] w-1 h-full animate-[bounce_0.6s_infinite_100ms] rounded" />
                  <span className="bg-[#1db954]/80 w-1 h-[70%] animate-[bounce_0.6s_infinite_200ms] rounded" />
                  <span className="bg-[#1db954]/90 w-1 h-[90%] animate-[bounce_0.6s_infinite_300ms] rounded" />
                  <span className="bg-[#1db954]/70 w-1 h-[50%] animate-[bounce_0.6s_infinite_150ms] rounded" />
                </div>
              )}
            </div>
            
            {/* Ambient status indicator */}
            <span className="mt-4 text-[10px] font-mono text-[#1db954] bg-[#1db954]/10 border border-[#1db954]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold animate-pulse">
              {activeRemix} FM Synthesizer active
            </span>
          </div>

          {/* Bottom Control Deck Panel (Matches layout of user's second screenshot) */}
          <div className="w-full max-w-lg mx-auto space-y-6 pb-4 sm:pb-8">
            
            {/* 1. Dynamic Song Metadata & action buttons directly on the same row! */}
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate leading-tight">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-zinc-400 mt-1 truncate font-medium">
                  {currentTrack.artist}
                </p>
              </div>
              
              {/* Action Buttons: X (to clear favorite) & Green Checkmark inside circle (approved / saved) */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    if (isLiked[currentTrack.id]) {
                      toggleLike(currentTrack.id);
                    }
                    setDjMessages(prev => [...prev, { sender: "aura", text: `Removed track '${currentTrack.title}' from recommendations pool.`, timestamp: "Cleared" }]);
                  }}
                  className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition transform hover:scale-105 active:scale-95"
                  title="Remove from favorites"
                >
                  <X className="w-5 h-5 text-zinc-400 hover:text-red-400 transition" />
                </button>
                <button
                  onClick={() => {
                    if (!isLiked[currentTrack.id]) {
                      toggleLike(currentTrack.id);
                    }
                    setDjMessages(prev => [...prev, { sender: "aura", text: `I've approved of '${currentTrack.title}'! Added to focus memory pool.`, timestamp: "Saved" }]);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition transform hover:scale-105 active:scale-95 ${
                    isLiked[currentTrack.id]
                      ? "bg-[#1db954] text-black border border-[#1db954]"
                      : "bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/30 hover:bg-[#1db954]/35"
                  }`}
                  title="Approve / Save Track"
                >
                  <CheckCircle className="w-5 h-5 fill-current text-current" />
                </button>
              </div>
            </div>

            {/* 2. Sleek Custom Progress slider */}
            <div className="space-y-2">
              <input 
                type="range"
                min="0"
                max={currentTrack.duration}
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(parseInt(e.target.value, 10));
                }}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer outline-none hover:bg-zinc-700 transition"
                style={{
                  background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(currentTime / currentTrack.duration) * 100}%, #4b5563 ${(currentTime / currentTrack.duration) * 100}%, #4b5563 100%)`
                }}
              />
              
              {/* 3. Timestamps directly below the progress bar line */}
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span>
                  {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, "0")}
                </span>
                <span>
                  {Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* 4. Spotify Controls below the layout row */}
            <div className="flex items-center justify-between px-3 mt-4">
              
              {/* Shuffle mode */}
              <button 
                onClick={() => {
                  setIsShuffleActive(!isShuffleActive);
                  setDjMessages(prev => [...prev, { sender: "aura", text: `Shuffle play format has been ${!isShuffleActive ? "enabled" : "disabled"}.`, timestamp: "Synced" }]);
                }}
                className={`p-2 transition transform hover:scale-110 active:scale-95 ${
                  isShuffleActive ? "text-[#1db954]" : "text-zinc-500 hover:text-white"
                }`}
                title="Shuffle queue"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              {/* Previous track */}
              <button 
                onClick={handlePrevTrack}
                className="p-2 text-zinc-300 hover:text-white transition transform hover:scale-110 active:scale-95"
                title="Previous track"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              {/* Centered Play/Pause in white circle */}
              <button 
                onClick={handlePlayPause}
                className="w-16 h-16 bg-white hover:bg-zinc-150 rounded-full flex items-center justify-center text-black shadow-lg shadow-white/10 transition transform hover:scale-105 active:scale-95"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-black fill-current translate-x-0.5" />
                )}
              </button>

              {/* Next track */}
              <button 
                onClick={handleNextTrack}
                className="p-2 text-zinc-300 hover:text-white transition transform hover:scale-110 active:scale-95"
                title="Next track"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              {/* Repeat Mode */}
              <button 
                onClick={() => {
                  setIsRepeatActive(!isRepeatActive);
                  setDjMessages(prev => [...prev, { sender: "aura", text: `Track Loop configuration has been ${!isRepeatActive ? "enabled" : "disabled"}.`, timestamp: "Synced" }]);
                }}
                className={`p-2 transition transform hover:scale-110 active:scale-95 ${
                  isRepeatActive ? "text-[#1db954]" : "text-zinc-500 hover:text-white"
                }`}
                title="Repeat track"
              >
                <Repeat className="w-5 h-5" />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ── VOICE RECOGNITION POPUP MODAL ── */}
      {showVoiceDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b0c10] border border-zinc-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden text-center space-y-6">
            
            {/* Ambient pulse decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1db954]/5 to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 h-32 w-32 bg-[#1db954]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

            {/* Cancel/Close Button */}
            <button 
              onClick={() => setShowVoiceDialog(false)}
              className="absolute top-4 right-4 text-zinc-550 hover:text-white transition text-[10px] font-bold font-mono bg-zinc-900 px-2.5 py-1.5 rounded-full border border-zinc-850"
              title="Cancel voice search"
            >
              ✕ CLOSE
            </button>

            {/* Title / Status */}
            <div className="space-y-1.5">
              <span className="text-[10px] bg-[#1db954]/10 text-[#1db954] border border-[#1b9542]/20 px-3 py-1 rounded-full font-mono font-extrabold tracking-widest uppercase inline-block">
                🎙️ DYNAMIC VOCAL COMPANION
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">Active Vocal Interface</h3>
              <p className="text-[10px] text-zinc-550 font-mono">FREQUENCY 432HZ COMPLIANT • LATENCY 4MS</p>
            </div>

            {/* Live pulsing microphone graphic */}
            <div className="relative flex items-center justify-center py-6">
              {/* Outer wave ripples */}
              <div className="absolute h-24 w-24 bg-[#1db954]/10 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute h-32 w-32 bg-[#1db954]/5 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
              
              {/* Inner glowing green button */}
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#1db954] to-[#1ed760] text-black flex items-center justify-center shadow-lg shadow-[#1db954]/30 relative z-10 transform scale-105 active:scale-95 transition cursor-pointer">
                <Mic className="w-9 h-9 text-black" />
              </div>
            </div>

            {/* Telemetry listing */}
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 min-h-[90px] flex flex-col justify-center gap-2">
              <div className="text-xs text-[#1db954] font-mono leading-none tracking-wide animate-pulse">
                {micListeningStatus}
              </div>
              {voiceTranscript ? (
                <div className="text-sm font-bold text-white tracking-tight leading-normal italic font-sans animate-slideUp">
                  "{voiceTranscript}"
                </div>
              ) : (
                <div className="text-xs text-zinc-500 italic font-medium font-sans">
                  Speak clearly now...
                </div>
              )}
            </div>

            {/* Interactive sound suggestions */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono block">
                🎙️ Suggested Voice Prompts
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-zinc-400">
                <button className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 hover:border-zinc-700 transition" onClick={() => executeVoiceCommand("Play Coding Mix")}>
                  "Play Coding Mix"
                </button>
                <button className="bg-zinc-900/60 p-2 rounded-lg border border-[#1db954]/30 hover:border-[#1db954] transition text-white" onClick={() => executeVoiceCommand("Recommend Silent Rain acoustic lofi")}>
                  "Recommend Silent Rain lofi"
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── CUSTOM RE-USABLE INTERACTIVE MOOD PICKER MODAL ── */}
      {showMoodPicker && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl max-w-sm w-full p-6 text-white space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowMoodPicker(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition tracking-tight font-sans text-xs font-bold uppercase"
              title="Close picker"
            >
              ✕ CLOSE
            </button>
            <div className="space-y-1">
              <span className="text-[9px] bg-[#1db954]/10 text-[#1db954] border border-[#1b9542]/20 px-2.5 py-0.5 rounded font-mono font-bold uppercase inline-block">
                ✨ BIOMETRIC SCAN
              </span>
              <h3 className="text-base font-black tracking-tight text-white leading-tight">Identify Your Current Vibe</h3>
              <p className="text-[10px] text-zinc-400 font-sans mt-1 font-medium">Select a state to dynamically filter aura frequencies and stream appropriate sound waves.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-bold font-sans">
              {["Focused", "Relaxed", "Motivated", "Stressed", "Happy", "Sad"].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setCurrentMood(m);
                    const filtered = trackDatabase.filter(t => t.moods.includes(m));
                    if (filtered.length > 0) {
                      setCurrentTracks(filtered);
                      setCurrentTrackIndex(0);
                      setIsPlaying(true);
                      triggerToast(`🎵 Connected! Aura matched for ${m} energy.`);
                    } else {
                      triggerToast(`✨ Active stream updated to Aura ${m} vibration.`);
                    }
                    setShowMoodPicker(false);
                  }}
                  className={`p-3 rounded-xl border transition text-center flex flex-col items-center justify-center gap-1.5 ${
                    currentMood === m
                      ? "border-[#1db954] bg-[#1db954]/10 text-white shadow-[0_0_12px_rgba(29,185,84,0.1)] font-extrabold"
                      : "border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-sans">
                    {m === "Focused" ? "🎯" : m === "Relaxed" ? "🧘" : m === "Motivated" ? "⚡" : m === "Stressed" ? "💤" : m === "Happy" ? "🌱" : "🌧️"}
                  </span>
                  <span>{m}</span>
                </button>
              ))}
            </div>
            
            <div className="pt-2 border-t border-zinc-900 text-center">
              <span className="text-[9px] text-[#1db954] font-mono tracking-wider font-semibold">AUTOMATIC ALIGNMENT READY</span>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM FLOATING NOTIFICATION BANNER (TOAST) ── */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-[#1db954]/30 shadow-2xl py-3 px-5 rounded-full z-[999] text-white flex items-center gap-3 animate-slideDown max-w-[90vw] whitespace-nowrap overflow-hidden select-none">
          <div className="h-2 w-2 rounded-full bg-[#1db954] animate-ping" />
          <span className="text-[11px] font-bold font-mono tracking-tight text-white leading-none">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
