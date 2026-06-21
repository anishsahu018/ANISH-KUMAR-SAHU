import { create } from "zustand";

export interface DeviceSession {
  id: number;
  device: string;
  location: string;
  status: string;
}

export interface SettingsState {
  // 1. Profile
  username: string;
  profilePic: string;
  email: string;
  bio: string;
  auraLevel: number;
  xp: number;
  auraTitle: string;
  activeSubscription: string;

  // 2. Account
  linkedGoogle: boolean;
  linkedGitHub: boolean;
  linkedApple: boolean;
  linkedSpotify: boolean;

  // 3. Aura AI
  aiPersonality: "Friendly" | "Professional" | "Motivational" | "Study Coach";
  recommendationIntensity: number;
  discoveryLevel: "Chill" | "Balanced" | "Explorer" | "Extreme";
  personalizedFeed: boolean;
  aiMemoryRememberHabits: boolean;
  aiMemoryRememberGenres: boolean;
  aiMemoryRememberStudy: boolean;
  enableVoiceCommands: boolean;
  wakeWord: string;
  voiceLanguage: string;
  voiceResponseStyle: "Natural Speak" | "Short/Chirp" | "Text Only";

  // 4. Music/Playback
  crossfade: number;
  gaplessPlayback: boolean;
  autoplay: boolean;
  smartShuffle: boolean;
  explicitContentFilter: boolean;
  audioQuality: "Auto" | "Normal" | "High" | "Very High" | "FLAC HD";
  normalizeVolume: boolean;
  monoAudio: boolean;
  equalizerBands: Record<string, number>;

  // 5. Downloads & Storage
  offlineDownloads: "FLAC" | "AAC";
  downloadQuality: string;
  smartDownloads: boolean;
  wifiOnlyDownloads: boolean;
  cacheSize: number; // in GB
  downloadsSize: number; // in GB

  // 6. Study Mode
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  autoFocusPlaylist: string;
  studyNotifications: boolean;
  deepWorkMode: boolean;
  dailyStudyGoal: number; // in mins
  weeklyStudyGoal: number; // in mins
  streakDays: number;

  // 7. Music DNA
  enableMusicDna: boolean;
  enableMusicGenome: boolean;
  personalityAnalysis: boolean;
  dnaPrivacy: "Public" | "Friends Only" | "Private";

  // 8. Mood & Wellness
  enableMoodDetection: boolean;
  textMoodDetection: boolean;
  voiceMoodDetection: boolean;
  sleepMode: boolean;
  meditationMusic: boolean;
  stressReliefMode: boolean;
  sleepTimerDuration: string;

  // 9. Social
  profileVisibility: boolean;
  listeningActivity: boolean;
  friendActivity: boolean;
  playlistSharing: string;
  communityParticipation: boolean;
  publicPlaylists: boolean;

  // 10. Notifications
  notifyNewReleases: boolean;
  notifyPlaylistUpdates: boolean;
  notifyArtistUpdates: boolean;
  notifyAiSuggestions: boolean;
  notifyMoodAlerts: boolean;
  notifyDailyReports: boolean;
  notifyPomodoroReminders: boolean;
  notifyStudyGoals: boolean;
  notifyFocusReports: boolean;
  notifyNewFollowers: boolean;
  notifyPlaylistLikes: boolean;
  notifyCommunityActivity: boolean;

  // 11. Gamification
  xpNotifications: boolean;
  achievementAlerts: boolean;
  dailyChallenges: boolean;
  weeklyChallenges: boolean;
  streakTracking: boolean;
  dailyChallengeProgress: number;

  // 12. Discovery
  globalTrending: boolean;
  countryTrends: string;
  hiddenGemsBoost: number;
  newArtistDiscovery: number;

  // 13. Privacy & Security
  twoFactorAuth: boolean;
  connectedDevices: DeviceSession[];

  // 14. Appearance
  theme: "Dark" | "Light" | "System";
  accentColor: string;
  layout: "Compact" | "Comfortable";
  largerText: boolean;
  reducedMotion: boolean;
  highContrast: boolean;

  // Search History
  recentSearches: string[];
  
  // Actions
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  updateSettings: (changes: Partial<SettingsState>) => void;
  resetToDefaults: () => void;
  undoLastChange: () => void;
  
  // Undo/Redo & Snapshot Stack
  snapshotStack: string[]; // JSON string arrays
  stackIndex: number;
}

const DEFAULT_SETTINGS = {
  username: "AuraNavigatorPro",
  profilePic: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  email: "navigator@auramusic.ai",
  bio: "Acoustic architect & ambient explorer inside Aura.",
  auraLevel: 42,
  xp: 8450,
  auraTitle: "Cosmic Sonic Sage",
  activeSubscription: "Aura Ultra Premium",

  linkedGoogle: true,
  linkedGitHub: false,
  linkedApple: true,
  linkedSpotify: true,

  aiPersonality: "Motivational" as const,
  recommendationIntensity: 85,
  discoveryLevel: "Explorer" as const,
  personalizedFeed: true,
  aiMemoryRememberHabits: true,
  aiMemoryRememberGenres: true,
  aiMemoryRememberStudy: true,
  enableVoiceCommands: true,
  wakeWord: "Hey Aura",
  voiceLanguage: "English (US)",
  voiceResponseStyle: "Natural Speak" as const,

  crossfade: 6,
  gaplessPlayback: true,
  autoplay: true,
  smartShuffle: true,
  explicitContentFilter: false,
  audioQuality: "FLAC HD" as const,
  normalizeVolume: true,
  monoAudio: false,
  equalizerBands: {
    "60Hz": 4,
    "230Hz": 2,
    "910Hz": -1,
    "4kHz": 3,
    "14kHz": 5,
  },

  offlineDownloads: "FLAC" as const,
  downloadQuality: "Very High (320kbps)",
  smartDownloads: true,
  wifiOnlyDownloads: true,
  cacheSize: 3.8,
  downloadsSize: 12.4,

  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  autoFocusPlaylist: "Deep Focus Binaural",
  studyNotifications: true,
  deepWorkMode: false,
  dailyStudyGoal: 60,
  weeklyStudyGoal: 300,
  streakDays: 7,

  enableMusicDna: true,
  enableMusicGenome: true,
  personalityAnalysis: true,
  dnaPrivacy: "Friends Only" as const,

  enableMoodDetection: true,
  textMoodDetection: true,
  voiceMoodDetection: false,
  sleepMode: true,
  meditationMusic: true,
  stressReliefMode: true,
  sleepTimerDuration: "45 Minutes",

  profileVisibility: true,
  listeningActivity: true,
  friendActivity: true,
  playlistSharing: "Public Web Link",
  communityParticipation: true,
  publicPlaylists: true,

  notifyNewReleases: true,
  notifyPlaylistUpdates: true,
  notifyArtistUpdates: false,
  notifyAiSuggestions: true,
  notifyMoodAlerts: true,
  notifyDailyReports: false,
  notifyPomodoroReminders: true,
  notifyStudyGoals: true,
  notifyFocusReports: true,
  notifyNewFollowers: true,
  notifyPlaylistLikes: true,
  notifyCommunityActivity: true,

  xpNotifications: true,
  achievementAlerts: true,
  dailyChallenges: true,
  weeklyChallenges: true,
  streakTracking: true,
  dailyChallengeProgress: 65,

  globalTrending: true,
  countryTrends: "Global / Universal",
  hiddenGemsBoost: 70,
  newArtistDiscovery: 50,

  twoFactorAuth: false,
  connectedDevices: [
    { id: 1, device: "Chrome on Windows 11", location: "Seattle, USA", status: "Active Now" },
    { id: 2, device: "Aura App on iPhone 15 Pro", location: "Portland, USA", status: "2 hours ago" },
    { id: 3, device: "Safari on macOS Studio", location: "Vancouver, Canada", status: "Active yesterday" }
  ],

  theme: "Dark" as const,
  accentColor: "#1db954",
  layout: "Comfortable" as const,
  largerText: false,
  reducedMotion: false,
  highContrast: false,

  recentSearches: ["AI recommendations", "FLAC HD Audio", "Equalizer bands", "Downloads storage"]
};

// Loading from localStorage helper
const getInitialState = (): Partial<SettingsState> => {
  try {
    const saved = localStorage.getItem("aura_settings_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure functions aren't serialized/overwritten
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse settings from localStorage:", e);
  }
  return {};
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initialData = {
    ...DEFAULT_SETTINGS,
    ...getInitialState(),
    snapshotStack: [] as string[],
    stackIndex: -1,
  };

  // Push immediate state snapshot to history for Undo functionality
  const pushToSnapshotStack = (stateToSave: Partial<SettingsState>) => {
    const { snapshotStack, stackIndex } = get();
    
    // Stringify and store the snapshot containing all key values
    const cleanState = { ...stateToSave };
    // Omit heavy functions & transient stack lists
    delete (cleanState as any).snapshotStack;
    delete (cleanState as any).stackIndex;
    delete (cleanState as any).updateSetting;
    delete (cleanState as any).updateSettings;
    delete (cleanState as any).resetToDefaults;
    delete (cleanState as any).undoLastChange;

    const snapshotStr = JSON.stringify(cleanState);
    
    // Slice potential redo steps if we're in middle of stack
    const updatedStack = snapshotStack.slice(0, stackIndex + 1);
    
    // Cap hist size to 20 states to prevent memory leaks
    if (updatedStack.length >= 20) {
      updatedStack.shift();
    }
    
    const newIndex = updatedStack.length;
    updatedStack.push(snapshotStr);
    
    set({
      snapshotStack: updatedStack,
      stackIndex: newIndex
    });
  };

  return {
    ...initialData,

    updateSetting: (key, value) => {
      // Capture state before modification
      const currentState = { ...get() };
      pushToSnapshotStack(currentState);

      set((state) => {
        const nextState = { ...state, [key]: value };
        
        // Save to LocalStorage immediately
        try {
          const serializable: Record<string, any> = {};
          Object.keys(nextState).forEach((k) => {
            const val = nextState[k as keyof SettingsState];
            if (typeof val !== "function" && k !== "snapshotStack" && k !== "stackIndex") {
              serializable[k] = val;
            }
          });
          localStorage.setItem("aura_settings_v1", JSON.stringify(serializable));
        } catch (e) {
          console.error("Failed to save state to localStorage", e);
        }

        // Side effect triggers
        if (key === "theme") {
          applyThemeEffects(value as "Dark" | "Light" | "System");
        }
        if (key === "accentColor") {
          applyAccentColorEffects(value as string);
        }
        if (key === "largerText") {
          applyTextSizeEffects(value as boolean);
        }
        
        return nextState;
      });
    },

    updateSettings: (changes) => {
      // Capture state before modifications
      const currentState = { ...get() };
      pushToSnapshotStack(currentState);

      set((state) => {
        const nextState = { ...state, ...changes };

        // Save to LocalStorage immediately
        try {
          const serializable: Record<string, any> = {};
          Object.keys(nextState).forEach((k) => {
            const val = nextState[k as keyof SettingsState];
            if (typeof val !== "function" && k !== "snapshotStack" && k !== "stackIndex") {
              serializable[k] = val;
            }
          });
          localStorage.setItem("aura_settings_v1", JSON.stringify(serializable));
        } catch (e) {
          console.error("Failed to save state", e);
        }

        // Apply visual side effects if included in changes
        if ("theme" in changes) {
          applyThemeEffects(changes.theme as "Dark" | "Light" | "System");
        }
        if ("accentColor" in changes) {
          applyAccentColorEffects(changes.accentColor as string);
        }
        if ("largerText" in changes) {
          applyTextSizeEffects(changes.largerText as boolean);
        }

        return nextState;
      });
    },

    resetToDefaults: () => {
      const currentState = { ...get() };
      pushToSnapshotStack(currentState);

      set({
        ...DEFAULT_SETTINGS,
      });

      // Clear localStorage
      try {
        localStorage.setItem("aura_settings_v1", JSON.stringify(DEFAULT_SETTINGS));
      } catch (e) {
        console.error("Resetting localStorage failed", e);
      }

      applyThemeEffects(DEFAULT_SETTINGS.theme);
      applyAccentColorEffects(DEFAULT_SETTINGS.accentColor);
      applyTextSizeEffects(DEFAULT_SETTINGS.largerText);
    },

    undoLastChange: () => {
      const { snapshotStack, stackIndex } = get();
      if (stackIndex >= 0 && snapshotStack[stackIndex]) {
        try {
          const restoreData = JSON.parse(snapshotStack[stackIndex]);
          const newIndex = stackIndex - 1;
          
          set({
            ...restoreData,
            stackIndex: newIndex
          });

          // Save undone state to LocalStorage
          try {
            localStorage.setItem("aura_settings_v1", JSON.stringify(restoreData));
          } catch (_) {}

          // Apply visual effects
          if (restoreData.theme) applyThemeEffects(restoreData.theme);
          if (restoreData.accentColor) applyAccentColorEffects(restoreData.accentColor);
          if (restoreData.largerText !== undefined) applyTextSizeEffects(restoreData.largerText);

        } catch (e) {
          console.error("Undo operation failed:", e);
        }
      }
    }
  };
});

// Helper functions to propagate visual settings instantly onto HTML document
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function adjustColorBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (val: number) => {
    return Math.min(255, Math.max(0, Math.round(val + (255 * percent))));
  };
  const r = adjust(rgb.r).toString(16).padStart(2, "0");
  const g = adjust(rgb.g).toString(16).padStart(2, "0");
  const b = adjust(rgb.b).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

export function applyThemeEffects(theme: "Dark" | "Light" | "System") {
  const root = document.documentElement;
  let resolvedTheme = theme;
  
  if (theme === "System") {
    resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
  }

  if (resolvedTheme === "Light") {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }
}

export function applyAccentColorEffects(color: string) {
  const root = document.documentElement;
  const rgb = hexToRgb(color) || { r: 29, g: 185, b: 84 };
  const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const hoverColor = adjustColorBrightness(color, 0.15);

  // Propagate to tailwind/CSS variables
  root.style.setProperty("--color-accent", color);
  root.style.setProperty("--color-accent-rgb", rgbStr);
  root.style.setProperty("--color-accent-hover", hoverColor);
  root.style.setProperty("--color-primary-glow", `rgba(${rgbStr}, 0.2)`);

  // Inject or update dynamic style element for global overrides
  let styleTag = document.getElementById("aura-dynamic-accent-style") as HTMLStyleElement;
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "aura-dynamic-accent-style";
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = `
    :root {
      --color-accent: ${color};
      --color-accent-rgb: ${rgbStr};
      --color-accent-hover: ${hoverColor};
      --color-accent-glow: rgba(${rgbStr}, 0.3);
      --color-accent-dim: rgba(${rgbStr}, 0.15);
    }
    .text-accent { color: ${color} !important; }
    .bg-accent { background-color: ${color} !important; }
    .border-accent { border-color: ${color} !important; }
    .shadow-accent { box-shadow: 0 0 15px rgba(${rgbStr}, 0.35) !important; }
    
    /* Scrollbar override */
    ::-webkit-scrollbar-thumb:hover {
      background: ${color}80 !important;
    }
  `;
}

export function applyTextSizeEffects(largerText: boolean) {
  const root = document.documentElement;
  if (largerText) {
    root.style.fontSize = "17px";
  } else {
    root.style.fontSize = "16px";
  }
}
