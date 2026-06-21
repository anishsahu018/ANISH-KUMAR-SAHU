import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  User, Shield, Sliders, Volume2, Download, Zap, Brain, Activity, 
  Users, Bell, Award, Search, Key, Palette, Info, Edit2, Camera, 
  Lock, RefreshCw, Disc, Check, Sparkles, HelpCircle, FileText, 
  Music, Play, Plus, Clock, Moon, Flame, Heart, BookOpen, 
  VolumeX, Mail, Laptop, HardDrive, Trash2, Eye, ShieldCheck, 
  AlertCircle, ChevronRight, SlidersHorizontal, Sun, Globe, Undo, DownloadCloud, UploadCloud, RotateCcw
} from "lucide-react";
import { useSettingsStore, applyThemeEffects, applyAccentColorEffects, applyTextSizeEffects } from "../store/settingsStore";

export default function SettingsControlCenter() {
  const settings = useSettingsStore();

  // Search and categories states
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>(settings.recentSearches || []);

  // UI Toast alerts
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "error" }[]>([]);

  // Password fields
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordsMessage, setPasswordsMessage] = useState({ text: "", type: "" });

  // Security Verification modals
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showClearMemoryModal, setShowClearMemoryModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletePIN, setDeletePIN] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Safe toggler that saves real-time and pushes to histories / toasts
  const handleToggle = (key: any, label: string) => {
    const currentValue = (settings as any)[key];
    settings.updateSetting(key, !currentValue);
    triggerToast(`Updated setting: "${label}" successfully.`, "success");
  };

  const handleSliderChange = (key: any, label: string, val: number) => {
    settings.updateSetting(key, val);
  };

  const handleSelectChange = (key: any, label: string, val: string) => {
    settings.updateSetting(key, val);
    triggerToast(`Set ${label} to "${val}"`, "info");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordsMessage({ text: "Please fill out all fields", type: "error" });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordsMessage({ text: "Passwords do not match", type: "error" });
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordsMessage({ text: "Must be at least 8 characters", type: "error" });
      return;
    }
    setPasswordsMessage({ text: "Password successfully updated on secure server!", type: "success" });
    triggerToast("Your security password index was updated.", "success");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const clearStorageDashboard = (type: "cache" | "downloads") => {
    if (type === "cache") {
      settings.updateSetting("cacheSize", 0);
      triggerToast("System Cache cleaned up successfully! 0.0 MB used.", "success");
    } else {
      settings.updateSetting("downloadsSize", 0);
      triggerToast("Offline downloads deleted. Storage reclaimed successfully.", "success");
    }
  };

  // Settings export/import
  const handleExport = () => {
    const serializable: Record<string, any> = {};
    Object.keys(settings).forEach((k) => {
      const val = (settings as any)[k];
      if (typeof val !== "function" && k !== "snapshotStack" && k !== "stackIndex") {
        serializable[k] = val;
      }
    });
    const blob = new Blob([JSON.stringify(serializable, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aura-settings-${settings.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Preferences exported as JSON successfully.", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        settings.updateSettings(parsed);
        triggerToast("Preferences imported successfully!", "success");
      } catch (err) {
        triggerToast("Failed to parse settings JSON.", "error");
      }
    };
    reader.readAsText(file);
  };

  // Search index categorization
  const allSettingsArray = useMemo(() => {
    return [
      { key: "username", category: "account", label: "Username / Nickname", desc: "Your public handle across Aura music streams.", value: settings.username },
      { key: "email", category: "account", label: "Email Address", desc: "Linked server email address.", value: settings.email },
      { key: "bio", category: "account", label: "User Bio", desc: "Short summary on your sonic journey.", value: settings.bio },
      { key: "aiPersonality", category: "ai", label: "AI DJ Personality", desc: "Select emotional tone for the companion stream.", value: settings.aiPersonality },
      { key: "recommendationIntensity", category: "ai", label: "Recommendation Intensity", desc: "How heavily the AI alters the music queue.", value: settings.recommendationIntensity },
      { key: "personalizedFeed", category: "ai", label: "Personalized AI Feed", desc: "Fledgling algorithm constructs tailored widgets.", value: settings.personalizedFeed },
      { key: "enableVoiceCommands", category: "ai", label: "Voice Assistant Engine", desc: "Speak directly to control playback queues.", value: settings.enableVoiceCommands },
      { key: "audioQuality", category: "music", label: "Acoustic Audio Quality", desc: "Specify bits streaming codecs.", value: settings.audioQuality },
      { key: "crossfade", category: "music", label: "Crossfade overlap", desc: "Transition duration between queue logs.", value: settings.crossfade },
      { key: "gaplessPlayback", category: "music", label: "Gapless Playback cycle", desc: "Prevent silence indices between tracks.", value: settings.gaplessPlayback },
      { key: "smartShuffle", category: "music", label: "Smart Shuffle indexer", desc: "Let AI restructure shuffled play vectors.", value: settings.smartShuffle },
      { key: "smartDownloads", category: "downloads", label: "Smart Background Downloads", desc: "Auto download favorite playlists.", value: settings.smartDownloads },
      { key: "wifiOnlyDownloads", category: "downloads", label: "WiFi Only Downloads", desc: "Preserve mobile data limits.", value: settings.wifiOnlyDownloads },
      { key: "focusDuration", category: "study", label: "Pomodoro Focus length", desc: "Concentration duration blocks.", value: settings.focusDuration },
      { key: "deepWorkMode", category: "study", label: "Deep Work strict mode", desc: "Blocks incoming non-essential alert logs.", value: settings.deepWorkMode },
      { key: "enableMusicDna", category: "dna", label: "Enable Music DNA Synthesis", desc: "Track musical genome profiles.", value: settings.enableMusicDna },
      { key: "dnaPrivacy", category: "dna", label: "Music DNA Visibility", desc: "Who gets to study your acoustic timeline.", value: settings.dnaPrivacy },
      { key: "enableMoodDetection", category: "wellness", label: "Cognitive Mood Detection", desc: "Analyze facial/voice signals to match tunes.", value: settings.enableMoodDetection },
      { key: "sleepMode", category: "wellness", label: "Sleep Mode", desc: "Dim controls & slow audio as bedtime nears.", value: settings.sleepMode },
      { key: "profileVisibility", category: "social", label: "Discovery profile listings", desc: "Show your avatar in global lists.", value: settings.profileVisibility },
      { key: "listeningActivity", category: "social", label: "Broadcast Live Activity", desc: "Let friends watch what you listen in real-time.", value: settings.listeningActivity },
      { key: "theme", category: "appearance", label: "Visual Color Theme", desc: "Select canvas tones.", value: settings.theme },
      { key: "accentColor", category: "appearance", label: "Primary Glow Accent", desc: "Accent control paths.", value: settings.accentColor },
      { key: "layout", category: "appearance", label: "Layout Sizing Density", desc: "Adjust padding spacing vectors.", value: settings.layout },
      { key: "largerText", category: "appearance", label: "Accessibility Text Size", desc: "Scale typography index up.", value: settings.largerText }
    ];
  }, [settings]);

  const filteredSearchMatches = useMemo(() => {
    if (!searchTerm) return [];
    // Update local history
    const trimmed = searchTerm.toLowerCase().trim();
    return allSettingsArray.filter(
      (item) =>
        item.label.toLowerCase().includes(trimmed) ||
        item.desc.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed)
    );
  }, [searchTerm, allSettingsArray]);

  // Append searches to history dynamically
  const executeSearch = (term: string) => {
    setSearchTerm(term);
    if (term && !searchHistory.includes(term)) {
      const updated = [term, ...searchHistory.slice(0, 4)];
      setSearchHistory(updated);
      settings.updateSetting("recentSearches", updated);
    }
  };

  const categories = [
    { id: "all", label: "Overview", icon: SlidersHorizontal },
    { id: "account", label: "Profile & Account", icon: User },
    { id: "ai", label: "Aura AI Settings", icon: Sparkles },
    { id: "music", label: "Music & Audio", icon: Volume2 },
    { id: "downloads", label: "Downloads & Storage", icon: Download },
    { id: "study", label: "Study Mode", icon: Clock },
    { id: "dna", label: "Music DNA Analysis", icon: Activity },
    { id: "wellness", label: "Mood & Wellness", icon: Moon },
    { id: "social", label: "Social Hub", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "gamification", label: "Gamified XP", icon: Award },
    { id: "discovery", label: "Music Discovery", icon: Globe },
    { id: "security", label: "Privacy & Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "about", label: "About Info", icon: Info }
  ];

  const filterCategory = (catId: string) => {
    if (activeCategory === "all") return true;
    return activeCategory === catId;
  };

  return (
    <div id="settings-root" className="min-h-full bg-black text-zinc-100 flex flex-col md:flex-row gap-6 animate-fadeIn p-4 sm:p-6 pb-28 font-sans">
      
      {/* 1. FIXED LEFT SETTINGS CATEGORIES SIDEBAR */}
      <div id="settings-nav-sidebar" className="w-full md:w-64 shrink-0 flex flex-col gap-2.5 bg-zinc-950/70 border border-zinc-900 p-4 rounded-xl">
        <div className="px-2 mb-2">
          <h2 className="text-zinc-500 text-[9px] font-black tracking-widest font-mono uppercase">Settings Ecosystem</h2>
          <p className="text-[10px] text-zinc-400 mt-1">Configure Aura Parameters</p>
        </div>

        <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto spotify-scrollbar pr-1">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (cat.id !== "all") {
                    setSearchTerm("");
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-2 text-[11px] font-bold rounded-lg transition-all text-left group border ${
                  isActive 
                    ? "bg-emerald-550/15 text-[#1db954] border-[#1db954]/30 shadow-sm" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent hover:border-zinc-800"
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#1db954]" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Import / Export / Defaults */}
        <div className="pt-4 border-t border-zinc-900 mt-auto flex flex-col gap-2">
          <button 
            onClick={handleExport}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold bg-zinc-950 border border-zinc-900 hover:border-zinc-850 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <span>Export Configuration</span>
            <DownloadCloud className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          <label className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold bg-zinc-950 border border-zinc-900 hover:border-zinc-850 rounded-lg text-zinc-400 hover:text-white cursor-pointer transition">
            <span>Import Configuration</span>
            <UploadCloud className="w-3.5 h-3.5 text-zinc-500" />
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport}
              className="hidden" 
            />
          </label>

          <button 
            onClick={() => {
              if (confirm("Restore ALL settings to Aura defaults? This cannot be undone.")) {
                settings.resetToDefaults();
                triggerToast("All preferences restored to default values.", "info");
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold bg-red-950/10 border border-red-950/20 hover:border-red-900/40 rounded-lg text-red-400 hover:text-red-300 transition"
          >
            <span>Reset Aura Defaults</span>
            <RotateCcw className="w-3.5 h-3.5 text-red-500/70" />
          </button>
        </div>
      </div>

      {/* 2. MAIN SETTINGS DASHBOARD PANEL */}
      <div id="settings-scrollable-content" className="flex-1 flex flex-col gap-6 max-h-[82vh] overflow-y-auto spotify-scrollbar pr-1">
        
        {/* Undo Floating Indicator banner */}
        {settings.stackIndex >= 0 && (
          <div className="animate-slideUp flex items-center justify-between bg-zinc-950/90 border border-[#1db954]/20 p-3 rounded-xl shadow-lg leading-none">
            <div className="flex items-center gap-2">
              <Undo className="w-4 h-4 text-[#1db954] animate-pulse" />
              <span className="text-[11px] text-zinc-300 font-medium">You modified system presets. You can roll-back to previous indexes.</span>
            </div>
            <button 
              onClick={() => {
                settings.undoLastChange();
                triggerToast("Rolled back previous configuration change.", "info");
              }}
              className="text-[10px] font-bold text-black bg-[#1db954] hover:bg-[#1db954]/90 px-3 py-1 rounded-md transition"
            >
              Undo Change
            </button>
          </div>
        )}

        {/* Dynamic AI Intelligent Search bar */}
        <div className="relative bg-zinc-950 border border-zinc-900 px-4 py-3 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Query parameters, credentials, audio bitrates format, sleep mode timers etc..."
              value={searchTerm}
              className="bg-transparent text-[11px] text-zinc-200 outline-none w-full placeholder-zinc-650"
              onChange={(e) => executeSearch(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-[9px] text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded hover:bg-zinc-800 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search history tokens */}
          {searchHistory.length > 0 && !searchTerm && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1 pt-1.5 border-t border-zinc-900/30 text-[9px] text-zinc-550 select-none">
              <span className="font-mono">Recent Searches:</span>
              {searchHistory.map((sh) => (
                <button 
                  key={sh}
                  onClick={() => executeSearch(sh)}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white rounded border border-zinc-900/60 font-mono transition"
                >
                  {sh}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DYNAMIC SEARCH RESULTS MATRIX */}
        {searchTerm && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3 animate-slideUp">
            <span className="text-[10px] text-[#1db954] font-mono block uppercase font-bold">Search Matrix Matches ({filteredSearchMatches.length})</span>
            {filteredSearchMatches.length === 0 ? (
              <p className="text-[10.5px] text-zinc-550 py-2">No active setting matched "{searchTerm}". Try general terms like 'audio' or 'privacy'.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                {filteredSearchMatches.map((match) => (
                  <div 
                    key={match.key}
                    onClick={() => {
                      setActiveCategory(match.category);
                      setSearchTerm("");
                    }}
                    className="p-3 bg-zinc-900/80 hover:bg-zinc-850/60 border border-zinc-850 rounded-lg flex items-center justify-between cursor-pointer group transition duration-200"
                  >
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight group-hover:text-[#1db954] transition-colors">{match.label}</div>
                      <div className="text-[9.5px] text-zinc-500 mt-0.5 leading-normal">{match.desc}</div>
                      <span className="inline-block mt-1.5 font-mono text-[8px] bg-zinc-950 px-1.5 py-0.2 uppercase text-purple-400 rounded">
                        Category: {match.category}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE HEADER CARD */}
        {filterCategory("all") && !searchTerm && (
          <div className="relative group overflow-hidden bg-gradient-to-br from-zinc-900 to-black p-5 rounded-xl border border-zinc-850 shadow-xl flex flex-col md:flex-row gap-5 items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1db954]/5 rounded-full filter blur-3xl opacity-60 pointer-events-none -mr-12 -mt-12" />
            
            <div className="relative shrink-0 select-none">
              <img 
                src={settings.profilePic} 
                alt="Profile Avatar"
                className="w-20 h-20 rounded-xl object-cover border border-[#1db954]/40 hover:border-[#1db954] transition duration-300" 
              />
              <button 
                onClick={() => {
                  const url = prompt("Enter online avatar URL address:", settings.profilePic);
                  if (url) settings.updateSetting("profilePic", url);
                }}
                className="absolute inset-0 bg-black/60 rounded-xl opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold transition duration-200"
              >
                <Camera className="w-4 h-4 mb-0.5 text-[#1db954]" />
                Change Pic
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h3 className="text-lg font-black text-white">{settings.username}</h3>
                <span className="self-center md:self-auto bg-[#1db954]/10 border border-[#1db954]/25 text-[#1db954] font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {settings.activeSubscription}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-normal italic">
                "{settings.bio}"
              </p>
              
              <div className="space-y-1.5 w-full mt-3">
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Aura Resonance (Level {settings.auraLevel})</span>
                  <span className="text-zinc-300">{settings.xp.toLocaleString()} / 10,000 XP</span>
                </div>
                <div className="relative h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900/60">
                  <div 
                    className="absolute h-full bg-[#1db954] rounded-full transition-all duration-500"
                    style={{ width: `${(settings.xp / 10000) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-zinc-900 md:pl-5 font-mono text-center">
              <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900 min-w-[90px]">
                <div className="text-[#1db954] text-xs font-bold leading-tight">{settings.streakDays} Days</div>
                <div className="text-[8px] text-zinc-550 uppercase tracking-wider mt-0.5">Fire Streak 🔥</div>
              </div>
              <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900 min-w-[90px]">
                <div className="text-purple-400 text-xs font-bold leading-tight">{settings.dailyChallengeProgress}%</div>
                <div className="text-[8px] text-zinc-550 uppercase tracking-wider mt-0.5">Focus Progress</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 1. PROFILE & ACCOUNT CATEGORY ==================== */}
        {filterCategory("account") && !searchTerm && (
          <div id="section-account" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Profile & Account Matrix</h4>
                <p className="text-[10px] text-zinc-500">Amend credential variables, email linkages, and subscription streams.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              {/* Profile Edits */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3.5">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Identity Indexes</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-550 text-[9px] uppercase font-mono mb-1">Interactive Handle name</label>
                    <input 
                      type="text" 
                      value={settings.username}
                      onChange={(e) => settings.updateSetting("username", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-550 text-[9px] uppercase font-mono mb-1">Short Persona Bio</label>
                    <textarea 
                      value={settings.bio}
                      onChange={(e) => settings.updateSetting("bio", e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-550 text-[9px] uppercase font-mono mb-1">Email Coordinates</label>
                    <input 
                      type="email" 
                      value={settings.email}
                      onChange={(e) => settings.updateSetting("email", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Password credentials */}
              <form onSubmit={handlePasswordChange} className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Authentication Security</span>
                
                <div className="space-y-2">
                  <input 
                    type="password" 
                    placeholder="Current Key Password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 placeholder-zinc-700"
                  />
                  <input 
                    type="password" 
                    placeholder="New Secure Password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 placeholder-zinc-700"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 placeholder-zinc-700"
                  />
                </div>

                <div className="flex items-center justify-between gap-2.5 pt-1">
                  <span className={`text-[9px] leading-tight ${passwordsMessage.type === "success" ? "text-emerald-500 font-bold" : "text-red-400"}`}>
                    {passwordsMessage.text}
                  </span>
                  <button 
                    type="submit"
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-650 hover:brightness-110 text-white font-bold rounded text-[10px]"
                  >
                    Update Password
                  </button>
                </div>
              </form>

              {/* Linked Accounts */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-[#1db954] font-mono block uppercase mb-2">Linked Accounts Integrations</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "linkedGoogle" as const, label: "Google", icon: Globe },
                      { key: "linkedGitHub" as const, label: "GitHub", icon: FileText },
                      { key: "linkedApple" as const, label: "Apple Music", icon: Music },
                      { key: "linkedSpotify" as const, label: "Spotify Core", icon: Disc }
                    ].map((app) => (
                      <div key={app.key} className="p-2 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-between">
                        <span className="font-medium text-[10px] text-zinc-300">{app.label}</span>
                        <button 
                          onClick={() => {
                            settings.updateSetting(app.key, !settings[app.key]);
                            triggerToast(`${settings[app.key] ? "Disconnected" : "Connected"} ${app.label} gateway successfully.`, "info");
                          }}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded transition ${
                            settings[app.key] 
                              ? "bg-emerald-950/20 text-[#1db954] border border-emerald-900/50" 
                              : "bg-zinc-900 text-zinc-500 hover:text-white"
                          }`}
                        >
                          {settings[app.key] ? "CONNECTED" : "LINK"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Subscriptions */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-zinc-550 font-mono block uppercase">Billing Spectrum</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-base font-black text-[#1db954] font-mono">$19.99<span className="text-[9px] font-normal text-zinc-550 ml-1">/ month</span></span>
                    <span className="bg-[#1db954]/5 text-[#1db954] font-bold border border-[#1db954]/20 text-[8px] px-1.5 rounded uppercase font-mono tracking-wider">PREMIUM PLUS</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 mt-4">
                  <button 
                    onClick={() => {
                      triggerToast("Opened secure payment console. System verified secure SSL.", "info");
                    }}
                    className="flex-1 py-1 px-2.5 bg-[#1db954] hover:bg-[#1db954]/95 text-black font-bold text-[10px] rounded transition uppercase font-mono"
                  >
                    Manage Billing
                  </button>
                  <button 
                    onClick={() => {
                      settings.updateSetting("activeSubscription", "Aura Lite Explorer");
                      triggerToast("Downgraded standard tier limits successfully.", "info");
                    }}
                    className="py-1 px-2.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-[10px] text-zinc-400 hover:text-white rounded transition"
                  >
                    Downgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. AURA AI SETTINGS CATEGORY ==================== */}
        {filterCategory("ai") && !searchTerm && (
          <div id="section-ai" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Aura AI Custom Brain Control</h4>
                <p className="text-[10px] text-zinc-500">Fine-tune acoustic core decision grids, memory vaults, and dynamic DJ voices.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* AI DJ Personality Choice */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3.5">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Interactive Personality Style</span>
                
                <div className="grid grid-cols-2 gap-2 select-none">
                  {(["Friendly", "Professional", "Motivational", "Study Coach"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleSelectChange("aiPersonality", "Personality Style", style)}
                      className={`text-left p-2.5 rounded-lg border flex flex-col justify-between transition-all ${
                        settings.aiPersonality === style 
                          ? "bg-[#1db954]/5 border-[#1db954] text-white shadow-md shadow-[#1db954]/5" 
                          : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span className="font-bold text-[10.5px] leading-tight">{style}</span>
                      <span className="text-[8px] text-zinc-500 mt-1">
                        {style === "Friendly" ? "Warm & helpful vibes" :
                         style === "Professional" ? "Tech & bitrates detail" :
                         style === "Motivational" ? "Energizing support" : "High concentration focus"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Simulated Wave quote */}
                <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded leading-normal font-mono text-[9px] text-[#1db954] relative">
                  <span className="text-[7px] text-zinc-550 block uppercase mb-1">Real-time Echo Simulation:</span>
                  {settings.aiPersonality === "Motivational" && '"Keep going! Your daily focus goal is within active peak. 🚀"'}
                  {settings.aiPersonality === "Study Coach" && '"Deep concentration sequence synchronized. Eliminate ambient disturbances."'}
                  {settings.aiPersonality === "Friendly" && '"Hey there! Let\'s unearth some cool acoustic records today."'}
                  {settings.aiPersonality === "Professional" && '"FLAC HD telemetry loaded. Audio bits fully optimized across systems."'}
                </div>
              </div>

              {/* Recommendation Intensity & Discover controls */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-purple-400 font-mono block uppercase">Recommendation Matrix</span>
                  
                  <div className="space-y-4 mt-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                        <span>AURA INFLUENCE LEVEL:</span>
                        <span className="text-[#1db954] font-bold">{settings.recommendationIntensity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={settings.recommendationIntensity}
                        onChange={(e) => handleSliderChange("recommendationIntensity", "AI Intensity Setting", parseInt(e.target.value))}
                        className="w-full accent-[#1db954]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-zinc-500 text-[9px] font-mono uppercase">DISCOVERY SPECTRUM DEPTH</label>
                      <select 
                        value={settings.discoveryLevel}
                        onChange={(e) => handleSelectChange("discoveryLevel", "AI Discovery Depth", e.target.value as any)}
                        className="w-full bg-zinc-950 text-white border border-zinc-800 rounded px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="Chill">Chill (Highly familiar comfortable index)</option>
                        <option value="Balanced">Balanced Mix (Recommended standards)</option>
                        <option value="Explorer">Explorer (New dynamic soundscapes)</option>
                        <option value="Extreme">Extreme Portal (Wild acoustic deviations)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-900">
                      <div>
                        <div className="text-xs font-bold text-white">Dynamic Personalized Feed</div>
                        <p className="text-[9.5px] text-zinc-550 mt-0.5 leading-none">Aura constructs dynamic widgets weekly.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings.personalizedFeed}
                          onChange={() => handleToggle("personalizedFeed", "AI Personalized Feed")}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Telemetry Memory controls */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Synaptic Memory Registers</span>
                
                <div className="space-y-2 text-[10px]">
                  {[
                    { key: "aiMemoryRememberHabits" as const, title: "Remember Acoustic Habits", desc: "Maintains records of active daily loops." },
                    { key: "aiMemoryRememberGenres" as const, title: "Remember Favorite Genres", desc: "Pins sonic vectors to discover paths." },
                    { key: "aiMemoryRememberStudy" as const, title: "Remember Pomodoro Trends", desc: "Customizes ambient study music." }
                  ].map((chk) => (
                    <div key={chk.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900/60 rounded">
                      <div>
                        <div className="font-bold text-white">{chk.title}</div>
                        <p className="text-[9px] text-zinc-550 leading-none mt-0.5">{chk.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings[chk.key]}
                          onChange={() => handleToggle(chk.key, chk.title)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowClearMemoryModal(true)}
                  className="w-full py-1.5 bg-red-950/20 hover:bg-red-900/20 border border-red-950/40 text-red-400 font-mono text-[9px] font-bold rounded transition"
                >
                  Purge Synaptic Memory Registers
                </button>
              </div>

              {/* Voice Interaction commands */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-purple-400 font-mono block uppercase mb-1">Acoustic Speech Voice Companion</span>
                  
                  <div className="space-y-3.5 mt-2 text-[10px]">
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-900">
                      <div>
                        <div className="font-bold text-white">Enable Voice Controls</div>
                        <p className="text-[9px] text-zinc-550">Allows command execution hands free.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings.enableVoiceCommands}
                          onChange={() => handleToggle("enableVoiceCommands", "Voice Assistant Control")}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-550 text-[8px] font-mono uppercase mb-0.5">Wake Key Words</label>
                        <input 
                          type="text" 
                          value={settings.wakeWord}
                          onChange={(e) => settings.updateSetting("wakeWord", e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1 text-white text-[10.5px]"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-550 text-[8px] font-mono uppercase mb-0.5">Voice Style Answer</label>
                        <select 
                          value={settings.voiceResponseStyle}
                          onChange={(e) => handleSelectChange("voiceResponseStyle", "Assistant Speech Voice Style", e.target.value as any)}
                          className="w-full bg-zinc-950 text-white border border-zinc-850 rounded px-1.5 py-1 text-[10.5px] focus:outline-none"
                        >
                          <option value="Natural Speak">Natural Speak</option>
                          <option value="Short/Chirp">Short Code Chime</option>
                          <option value="Text Only">Silent Telemetry Log</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. MUSIC & PLAYBACK CATEGORY ==================== */}
        {filterCategory("music") && !searchTerm && (
          <div id="section-music" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Music Playback & Equalizer Parameters</h4>
                <p className="text-[10px] text-zinc-500">Regulate overlap ranges, audio quality bits codecs, and live band equalizer decibels.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Playback basics */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase font-bold">Playback Physics</span>
                
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>CROSSFADE DURATION:</span>
                      <span className="text-[#1db954] font-bold">{settings.crossfade} seconds</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="12" 
                      value={settings.crossfade}
                      onChange={(e) => handleSliderChange("crossfade", "Crossfade overlaps", parseInt(e.target.value))}
                      className="w-full accent-[#1db954]"
                    />
                  </div>

                  {[
                    { key: "gaplessPlayback" as const, title: "Gapless Playback Cycles", desc: "Maintains smooth continuum flow between track vectors." },
                    { key: "autoplay" as const, title: "End of stream Autoplay", desc: "Auto queue relative similar acoustic files." },
                    { key: "smartShuffle" as const, title: "Smart Shuffling Indices", desc: "AI orders random sequences to preserve tempo." },
                    { key: "explicitContentFilter" as const, title: "Explicit Lyrics Filter", desc: "Avoid loading track indexes having strong vocabulary." }
                  ].map((plb) => (
                    <div key={plb.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                      <div>
                        <div className="font-bold text-white">{plb.title}</div>
                        <p className="text-[9.5px] text-zinc-550 leading-none mt-0.5">{plb.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings[plb.key]}
                          onChange={() => handleToggle(plb.key, plb.title)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equalizer and Normalization controls */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Resonance Quality & Dynamics</span>
                
                <div className="space-y-3 text-[10px]">
                  <div>
                    <label className="block text-zinc-550 text-[9px] font-mono uppercase mb-1">Acoustic Audio Quality Codecs</label>
                    <select 
                      value={settings.audioQuality}
                      onChange={(e) => handleSelectChange("audioQuality", "Acoustic Audio Quality", e.target.value as any)}
                      className="w-full bg-zinc-950 text-white border border-zinc-805 px-2 py-1.5 focus:outline-none rounded"
                    >
                      <option value="FLAC HD">FLAC HD (Premium lossless 24-bit studio audio)</option>
                      <option value="Very High">Very High (AAC standard 320kbps)</option>
                      <option value="High">High (High-speed 256kbps Web Audio)</option>
                      <option value="Normal">Normal (Data-efficient 128kbps)</option>
                      <option value="Auto">Auto (Dynamic adjustments from network streams)</option>
                    </select>
                  </div>

                  {[
                    { key: "normalizeVolume" as const, title: "Normalize Volume Levels", desc: "Maintains identical decibel peaks across files." },
                    { key: "monoAudio" as const, title: "Mono Audio Channels Link", desc: "Combines left-right acoustic waveforms." }
                  ].map((dyn) => (
                    <div key={dyn.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                      <div>
                        <div className="font-bold text-white">{dyn.title}</div>
                        <p className="text-[9px] text-zinc-550 mt-0.5 leading-none">{dyn.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings[dyn.key]}
                          onChange={() => handleToggle(dyn.key, dyn.title)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* FIVE-BAND EQUALIZER */}
                <div className="border-t border-zinc-850/80 pt-3">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase mb-2">Live Equalizer Decibel Matrix (dB)</span>
                  <div className="flex gap-2 select-none h-24 items-center justify-between">
                    {Object.entries(settings.equalizerBands).map(([band, val]) => {
                      const numVal = val as number;
                      return (
                        <div key={band} className="flex flex-col items-center flex-1 h-full justify-between font-mono text-[8px] bg-zinc-950/70 p-1.5 border border-zinc-900 rounded-lg">
                          <span className="text-zinc-[#1db954]">{numVal > 0 ? `+${numVal}` : numVal}dB</span>
                          <div className="h-12 w-1 bg-zinc-90 w-1.5 rounded-full relative flex items-center justify-center">
                            <input 
                              type="range" 
                              min="-10" 
                              max="10" 
                              value={numVal}
                              onChange={(e) => {
                                const valInt = parseInt(e.target.value);
                                settings.updateSetting("equalizerBands", {
                                  ...settings.equalizerBands,
                                  [band]: valInt
                                });
                              }}
                              className="absolute w-12 h-1 appearance-none cursor-pointer bg-transparent focus:outline-none -rotate-90 accent-[#1db954]"
                            />
                          </div>
                          <span className="text-zinc-[#1db954] mt-1 font-bold">{band}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. DOWNLOADS & STORAGE CATEGORY ==================== */}
        {filterCategory("downloads") && !searchTerm && (
          <div id="section-downloads" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Downloads & Dynamic Storage Portal</h4>
                <p className="text-[10px] text-zinc-500">Review real-time downloads partitions, purge system cache registers, and scale files limit.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Storage Dashboard with Calculations */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Real-Time Core Storage Partition</span>
                
                <div className="space-y-3">
                  <div className="relative h-3 bg-zinc-950 rounded-lg overflow-hidden flex border border-zinc-900">
                    <div 
                      className="bg-[#1db954] h-full"
                      style={{ width: `${(settings.downloadsSize / 128) * 100}%` }}
                      title={`Offline Music: ${settings.downloadsSize} GB`}
                    />
                    <div 
                      className="bg-purple-600 h-full"
                      style={{ width: `${(settings.cacheSize / 128) * 100}%` }}
                      title={`Cache: ${settings.cacheSize} GB`}
                    />
                    <div 
                      className="bg-zinc-800 h-full"
                      style={{ width: "8%" }}
                      title="OS Space: 10 GB"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[8px] font-mono uppercase text-zinc-400 select-none">
                    <div>
                      <span className="inline-block w-1.5 h-1.5 bg-[#1db954] rounded mr-1" />
                      <span>OFFLINE: {settings.downloadsSize.toFixed(1)} GB</span>
                    </div>
                    <div>
                      <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded mr-1" />
                      <span>CACHE: {settings.cacheSize.toFixed(1)} GB</span>
                    </div>
                    <div>
                      <span className="inline-block w-1.5 h-1.5 bg-zinc-800 rounded mr-1" />
                      <span>OS PAR: 10.0 GB</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#1db954] font-bold">FREE: {(128 - settings.downloadsSize - settings.cacheSize - 10).toFixed(1)} GB</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button 
                    onClick={() => clearStorageDashboard("cache")}
                    className="py-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-bold font-mono text-[9px] rounded border border-zinc-850 hover:border-zinc-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                    Clear Cache Registers
                  </button>

                  <button 
                    onClick={() => clearStorageDashboard("downloads")}
                    className="py-1.5 bg-zinc-950 hover:bg-zinc-900 text-red-400 font-bold font-mono text-[9px] rounded border border-red-950/20 hover:border-red-900/40 transition flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500/70" />
                    Purge All Downloads
                  </button>
                </div>
              </div>

              {/* Download configurations */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Aura Offline Settings</span>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <label className="block text-zinc-550 text-[8px] font-mono uppercase mb-0.5">Offlines Audio Codec</label>
                      <select 
                        value={settings.offlineDownloads}
                        onChange={(e) => handleSelectChange("offlineDownloads", "Offline Quality Format", e.target.value as any)}
                        className="w-full bg-zinc-950 text-white border border-zinc-850 rounded px-2 py-1 select"
                      >
                        <option value="FLAC">Lossless FLAC</option>
                        <option value="AAC">AAC 320kbps</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-550 text-[8px] font-mono uppercase mb-0.5">Target download slots</label>
                      <select 
                        value={settings.downloadQuality}
                        onChange={(e) => handleSelectChange("downloadQuality", "Offline Quality Bitrate", e.target.value)}
                        className="w-full bg-zinc-950 text-white border border-zinc-850 rounded px-2 py-1 select"
                      >
                        <option value="Very High (320kbps)">Very High (320kbps)</option>
                        <option value="High (256kbps)">High (256kbps)</option>
                        <option value="Normal (128kbps)">Normal (128kbps)</option>
                      </select>
                    </div>
                  </div>

                  {[
                    { key: "smartDownloads" as const, title: "Smart Downloads Sync", desc: "Auto fetch favorite tracks behind scenes." },
                    { key: "wifiOnlyDownloads" as const, title: "WiFi Only Downloads Link", desc: "Prevents cellular bandwidth exhausts." }
                  ].map((dlCh) => (
                    <div key={dlCh.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                      <div>
                        <div className="font-bold text-white text-[10px]">{dlCh.title}</div>
                        <p className="text-[9px] text-zinc-550 leading-none mt-0.5">{dlCh.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings[dlCh.key]}
                          onChange={() => handleToggle(dlCh.key, dlCh.title)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. STUDY MODE CATEGORY ==================== */}
        {filterCategory("study") && !searchTerm && (
          <div id="section-study" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Study Mode Pomodoro Alarms</h4>
                <p className="text-[10px] text-zinc-500">Calibrate focus chronometers, study assistant default playlists, and goals logs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Pomodoro slider clocks */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Pomodoro Durations (Mins)</span>
                
                <div className="space-y-4 pt-1">
                  {[
                    { key: "focusDuration" as const, label: "FOCUS TIME LENGTH", max: 60, unit: "m" },
                    { key: "shortBreak" as const, label: "SHORT BREAK INTERVAL", max: 15, unit: "m" },
                    { key: "longBreak" as const, label: "LONG BREAK INTERVAL", max: 30, unit: "m" }
                  ].map((pomo) => (
                    <div key={pomo.key} className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                        <span>{pomo.label}:</span>
                        <span className="text-[#1db954] font-bold">{(settings as any)[pomo.key]} {pomo.unit}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max={pomo.max} 
                        value={(settings as any)[pomo.key]}
                        onChange={(e) => handleSliderChange(pomo.key, pomo.label, parseInt(e.target.value))}
                        className="w-full accent-[#1db954]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Productivity limits & deep work triggers */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-purple-400 font-mono block uppercase mb-3">Academic Assistant Engines</span>
                  
                  <div className="space-y-3.5 text-[10px]">
                    <div>
                      <label className="block text-zinc-550 text-[9px] font-mono uppercase mb-1">Focus Mode Auto-Soundscape</label>
                      <select 
                        value={settings.autoFocusPlaylist}
                        onChange={(e) => handleSelectChange("autoFocusPlaylist", "Pomo Auto Soundwave", e.target.value)}
                        className="w-full bg-zinc-950 text-white border border-zinc-805 px-2 py-1.5 focus:outline-none rounded"
                      >
                        <option value="Deep Focus Binaural">Binaural Waves (Focus alpha vectors)</option>
                        <option value="Lo-Fi Coding Loops">Lo-Fi Beats (Comfort ambient background)</option>
                        <option value="Stellar Ambient Drone">Deep Space Drones (Quiet static hum)</option>
                        <option value="Rainfall & Soft White Noise">Soft Rainstorm (Cozy study cabin)</option>
                      </select>
                    </div>

                    {[
                      { key: "studyNotifications" as const, title: "Session Transition Reminders", desc: "Plays audio chime alert on sets completion." },
                      { key: "deepWorkMode" as const, title: "Enforce Deep Work Blockers", desc: "Locks dashboard navigation tabs completely when focus runs." }
                    ].map((st) => (
                      <div key={st.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                        <div>
                          <div className="font-bold text-white">{st.title}</div>
                          <p className="text-[9px] text-zinc-550 leading-none mt-0.5">{st.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input 
                            type="checkbox" 
                            checked={settings[st.key]}
                            onChange={() => handleToggle(st.key, st.title)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. MUSIC DNA ANALYSIS ==================== */}
        {filterCategory("dna") && !searchTerm && (
          <div id="section-dna" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Music DNA Synthesis Archives</h4>
                <p className="text-[10px] text-zinc-500">Regulate genomic acoustic mappings, biometric signatures, and profiling privacy.</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
              <span className="text-[9px] text-[#1db954] font-mono block uppercase">Biometric Sonic Profile Layers</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[10px]">
                {[
                  { key: "enableMusicDna" as const, title: "Synthesize Music DNA", desc: "Tracks music traits & frequencies." },
                  { key: "enableMusicGenome" as const, title: "Enable Sonic Genome Link", desc: "Hooks custom acoustics profiles." },
                  { key: "personalityAnalysis" as const, title: "Biometric Personality Analysis", desc: "Graphs listening styles on dashboard." }
                ].map((dna) => (
                  <div key={dna.key} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex flex-col justify-between gap-3">
                    <div>
                      <div className="font-bold text-white leading-tight">{dna.title}</div>
                      <p className="text-[9px] text-zinc-505 leading-normal mt-1">{dna.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                      <input 
                        type="checkbox" 
                        checked={settings[dna.key]}
                        onChange={() => handleToggle(dna.key, dna.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-850 max-w-sm">
                <label className="block text-zinc-550 text-[9px] font-mono uppercase mb-1">Ecosystem Privacy visibility</label>
                <select 
                  value={settings.dnaPrivacy}
                  onChange={(e) => handleSelectChange("dnaPrivacy", "Music DNA Visibility", e.target.value as any)}
                  className="w-full bg-zinc-950 text-white border border-zinc-805 px-2.5 py-1.5 focus:outline-none rounded text-[10.5px]"
                >
                  <option value="Friends Only">Friends Only (Visible to verified followers)</option>
                  <option value="Public">Public (Publish to global charts indexes)</option>
                  <option value="Private">Private (Keep biometric data secure)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 7. MOOD & WELLNESS ==================== */}
        {filterCategory("wellness") && !searchTerm && (
          <div id="section-wellness" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mood Detection & Wellness Presets</h4>
                <p className="text-[10px] text-zinc-500">Fine-tune stress detection matrices, sleep parameters, and meditation triggers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Mood detection variables */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Cognitive Mood Calibration</span>
                
                <div className="space-y-3">
                  {[
                    { key: "enableMoodDetection" as const, title: "Enable Intelligent Mood Detection", desc: "Algorithm queries parameters to construct dynamic queues." },
                    { key: "textMoodDetection" as const, title: "Analyze Chat Text Signals", desc: "Audits keyboard entries in lounges to discover exhaustion." },
                    { key: "voiceMoodDetection" as const, title: "Biometric Vocal Mood Check", desc: "Deciphers microphone recordings for micro-stresses." }
                  ].map((md) => (
                    <div key={md.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                      <div>
                        <div className="font-bold text-white text-[10px]">{md.title}</div>
                        <p className="text-[9px] text-zinc-550 leading-none mt-0.5">{md.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings[md.key]}
                          onChange={() => handleToggle(md.key, md.title)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bedtime tools */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-purple-400 font-mono block uppercase mb-1">Acoustic Relaxation Modules</span>
                  
                  <div className="space-y-3 mt-2 text-[10px]">
                    {[
                      { key: "sleepMode" as const, title: "Bedtime Sleep mode", desc: "Declines screen highlights & slows ambient soundscapes." },
                      { key: "meditationMusic" as const, title: "Meditation triggers", desc: "Includes alpha wave hums at slow tempos." },
                      { key: "stressReliefMode" as const, title: "Stresses checks relief mode", desc: "Pitches comforting strings when high fatigue detected." }
                    ].map((well) => (
                      <div key={well.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                        <div>
                          <div className="font-bold text-white">{well.title}</div>
                          <p className="text-[9px] text-zinc-550 leading-none mt-0.5">{well.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input 
                            type="checkbox" 
                            checked={settings[well.key]}
                            onChange={() => handleToggle(well.key, well.title)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                        </label>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-zinc-850">
                      <label className="block text-zinc-550 text-[8px] font-mono uppercase mb-0.5">Sleep Timer Offload Target</label>
                      <select 
                        value={settings.sleepTimerDuration}
                        onChange={(e) => handleSelectChange("sleepTimerDuration", "Sleep Timer Offload", e.target.value)}
                        className="w-full bg-zinc-950 text-white border border-zinc-850 rounded px-2 py-1 text-[10.5px]"
                      >
                        <option value="15 Minutes">15 Minutes</option>
                        <option value="30 Minutes">30 Minutes</option>
                        <option value="45 Minutes">45 Minutes</option>
                        <option value="1 Hour">1 Hour (Active limit)</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 8. SOCIAL HUB CATEGORY ==================== */}
        {filterCategory("social") && !searchTerm && (
          <div id="section-social" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Social Hub Community Channels</h4>
                <p className="text-[10px] text-zinc-500">Oversee broadcasting parameters, friend listing widgets, and playlist sharing.</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
              <span className="text-[9px] text-[#1db954] font-mono block uppercase">Community Network Variable Signals</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                {[
                  { key: "profileVisibility" as const, title: "Public Directory Listing", desc: "Let other active musical researchers search your handle." },
                  { key: "listeningActivity" as const, title: "Broadcast Live Activity stream", desc: "Stream real-time tracks logs directly to buddies panels." },
                  { key: "friendActivity" as const, title: "Show Active Peers widget", desc: "Includes friend activity feed right in the dashboard." },
                  { key: "communityParticipation" as const, title: "Enable Public Lounges Chat", desc: "Join multi-person synthesis lounges smoothly." }
                ].map((sc) => (
                  <div key={sc.key} className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white leading-tight">{sc.title}</div>
                      <p className="text-[9px] text-zinc-550 mt-1 leading-normal">{sc.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={settings[sc.key]}
                        onChange={() => handleToggle(sc.key, sc.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-zinc-850/60 text-[10px]">
                <div>
                  <label className="block text-zinc-550 text-[9px] font-mono uppercase mb-1">Standard Exports Playlist Sharing</label>
                  <select 
                    value={settings.playlistSharing}
                    onChange={(e) => handleSelectChange("playlistSharing", "Playlist Sharing", e.target.value)}
                    className="w-full bg-zinc-950 text-white border border-zinc-805 px-2.5 py-1.5 focus:outline-none rounded"
                  >
                    <option value="Public Web Link">Public Web Link (Shared universally)</option>
                    <option value="Friends Only Link">Friends Only (Requires follow links)</option>
                    <option value="Password Encrypted">Requires Secure Token Index</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <div className="font-bold text-white">Public default for new playlists</div>
                    <p className="text-[9px] text-zinc-550 mt-0.5">Publish new tracks logs directly to charts lists.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={settings.publicPlaylists}
                      onChange={() => handleToggle("publicPlaylists", "Public list setting")}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 9. UNIFIED NOTIFICATIONS ==================== */}
        {filterCategory("notifications") && !searchTerm && (
          <div id="section-notifications" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Unified Notifications Matrix Control</h4>
                <p className="text-[10px] text-zinc-500">Fine-tune dynamic triggers for telemetry companion alerts, academic loops, and peer milestones.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px]">
              
              {/* Music Updates alerts */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Music Releases Updates</span>
                
                {[
                  { key: "notifyNewReleases" as const, title: "New Releases alert", desc: "Notify when followed artists upload fresh files." },
                  { key: "notifyPlaylistUpdates" as const, title: "Acoustic playlist additions", desc: "Alert when active focus playlists add tracks." },
                  { key: "notifyArtistUpdates" as const, title: "Live show warnings", desc: "Sound when creators schedule dynamic performances." }
                ].map((nt) => (
                  <div key={nt.key} className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{nt.title}</div>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-none">{nt.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={settings[nt.key]}
                        onChange={() => handleToggle(nt.key, nt.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* AI & Wellness predictions */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">AI companion alerts</span>
                
                {[
                  { key: "notifyAiSuggestions" as const, title: "AI suggestions indicators", desc: "Prompts ambient matches automatically." },
                  { key: "notifyMoodAlerts" as const, title: "Wellness Stress checkpoints", desc: "Flags fatigue alarms on stress peaks." },
                  { key: "notifyDailyReports" as const, title: "Daily Acoustic summaries", desc: "Summarizes active streak records." }
                ].map((nt) => (
                  <div key={nt.key} className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{nt.title}</div>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-none">{nt.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={settings[nt.key]}
                        onChange={() => handleToggle(nt.key, nt.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Study alarms */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Academic Cycle triggers</span>
                
                {[
                  { key: "notifyPomodoroReminders" as const, title: "Time Expire chimes", desc: "Sends browser alert when focus sessions complete." },
                  { key: "notifyStudyGoals" as const, title: "Daily targets celebrations", desc: "Throw XP rewards banners on goal logs." },
                  { key: "notifyFocusReports" as const, title: "Weekly concentration metrics", desc: "Mails deep analysis on study parameters." }
                ].map((nt) => (
                  <div key={nt.key} className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{nt.title}</div>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-none">{nt.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={settings[nt.key]}
                        onChange={() => handleToggle(nt.key, nt.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Social highlights */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Community milestone flags</span>
                
                {[
                  { key: "notifyNewFollowers" as const, title: "New Subscriber warning", desc: "Notify when other users follow." },
                  { key: "notifyPlaylistLikes" as const, title: "Curated Playlist ratings", desc: "Sound when dynamic list elements grab likes." },
                  { key: "notifyCommunityActivity" as const, title: "Rooms Active notifications", desc: "Sound when follow circle boots live stream." }
                ].map((nt) => (
                  <div key={nt.key} className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{nt.title}</div>
                      <p className="text-[9px] text-zinc-550 mt-0.5 leading-none">{nt.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={settings[nt.key]}
                        onChange={() => handleToggle(nt.key, nt.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 10. GAMIFICATION CATEGORIES ==================== */}
        {filterCategory("gamification") && !searchTerm && (
          <div id="section-gamification" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Gamified XP, Alarms & Achievements</h4>
                <p className="text-[10px] text-zinc-500">Enable in-app celebrations trackers, streak trackers, and dynamic rewards benchmarks.</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4 text-[10px]">
              <span className="text-[9px] text-[#1db954] font-mono block uppercase">Focus gamified metrics</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  { key: "xpNotifications" as const, title: "In-App XP alerts banner", desc: "Flash shiny text flags when acquiring study score points." },
                  { key: "achievementAlerts" as const, title: "Achievement Unlock celebrations", desc: "Celebrate milestones badges with high acoustic bells." },
                  { key: "dailyChallenges" as const, title: "Track Daily Challenges", desc: "Query lists of simple activities to grab bonus XP." },
                  { key: "weeklyChallenges" as const, title: "Acoustic Weekly Marathon Goals", desc: "Compare weekly efficiency indices with world averages." },
                  { key: "streakTracking" as const, title: "Rigid Daily Streak Tracker", desc: "Monitors continuous study days; auto alerts on breakdown warning." }
                ].map((gam) => (
                  <div key={gam.key} className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{gam.title}</div>
                      <p className="text-[9px] text-zinc-550 mt-1 leading-normal">{gam.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={settings[gam.key]}
                        onChange={() => handleToggle(gam.key, gam.title)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 11. DISCOVERY PARAMETERS ==================== */}
        {filterCategory("discovery") && !searchTerm && (
          <div id="section-discovery" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Music Discovery Algorithm Drivers</h4>
                <p className="text-[10px] text-zinc-500">Fine-tune global trends priorities, obscure files boosters, and fresh creator focus indices.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Dynamic feed parameters</span>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-900">
                    <div>
                      <div className="font-bold text-white">Prioritize Global Trending Tracks</div>
                      <p className="text-[9px] text-zinc-550 mt-0.5">Pins global record rankings on topmost hubs.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={settings.globalTrending}
                        onChange={() => handleToggle("globalTrending", "Global trends prioritization")}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#1db954] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-zinc-550 text-[9px] font-mono uppercase mb-1">Local Country Trends Filter</label>
                    <select 
                      value={settings.countryTrends}
                      onChange={(e) => handleSelectChange("countryTrends", "Regional Discoveries", e.target.value)}
                      className="w-full bg-zinc-950 text-white rounded border border-[#1b1c1e] p-2 focus:outline-none"
                    >
                      <option value="Global / Universal">Global / Universal Chart</option>
                      <option value="India">India (Bollywood & Cosmic Chill)</option>
                      <option value="United States">United States (Hip Hop & Synthpop)</option>
                      <option value="United Kingdom">United Kingdom (Indie, Grime & IDM)</option>
                      <option value="Japan">Japan (City Pop & Future Core Loops)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Obscure music discover priorities</span>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>HIDDEN GEMS BOOST:</span>
                      <span className="text-purple-400 font-bold">{settings.hiddenGemsBoost}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={settings.hiddenGemsBoost}
                      onChange={(e) => handleSliderChange("hiddenGemsBoost", "Obscure track booster", parseInt(e.target.value))}
                      className="w-full accent-[#1db954]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>INDIE/NEW ARTISTS EXPOSURE:</span>
                      <span className="text-purple-400 font-bold">{settings.newArtistDiscovery}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={settings.newArtistDiscovery}
                      onChange={(e) => handleSliderChange("newArtistDiscovery", "New creator prioritization", parseInt(e.target.value))}
                      className="w-full accent-[#1db954]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 12. PRIVACY & SECURITY CATEGORY ==================== */}
        {filterCategory("security") && !searchTerm && (
          <div id="section-security" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Privacy & Security Control Centers</h4>
                <p className="text-[10px] text-zinc-500">Configure Two Factor encryption gates, track connected hardware streams, or download preferences history.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Authenticator gate */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Secure Gates Vault</span>
                
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
                    <p className="text-[9px] text-zinc-500 mt-0.5">Demands confirmation OTP on foreign hardware.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (settings.twoFactorAuth) {
                        settings.updateSetting("twoFactorAuth", false);
                        triggerToast("Two factor protection deactivated successfully.", "info");
                      } else {
                        setShow2FAModal(true);
                      }
                    }}
                    className={`font-mono text-[9px] font-bold px-3 py-1 rounded transition ${
                      settings.twoFactorAuth 
                        ? "bg-emerald-950/20 text-[#1db954] border border-emerald-900/50" 
                        : "bg-red-955/20 text-red-400 border border-red-950/30 hover:bg-red-950/30"
                    }`}
                  >
                    {settings.twoFactorAuth ? "SHIELD ACTIVE" : "ACTIVATE"}
                  </button>
                </div>

                <div className="border-t border-zinc-850 pt-3">
                  <span className="block text-[8px] text-zinc-550 font-mono mb-2 uppercase">Preferences History Vault Option</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExport}
                      className="flex-1 py-1 px-3 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-[10px] text-zinc-300 font-bold hover:text-white rounded transition uppercase"
                    >
                      Export Telemetry Logs
                    </button>
                    <button 
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="py-1 px-3 bg-red-950/20 border border-red-950/40 hover:bg-red-950/35 text-[10px] text-red-400 font-bold rounded transition"
                    >
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected devices */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Connected Hardware Gateways</span>
                
                <div className="space-y-2 select-none">
                  {settings.connectedDevices.map((dev) => (
                    <div key={dev.id} className="p-2 bg-zinc-950 border border-zinc-900 rounded flex justify-between items-center hover:border-zinc-850 transition">
                      <div>
                        <div className="text-[10.5px] font-bold text-white">{dev.device}</div>
                        <p className="text-[8.5px] text-zinc-500 font-mono mt-0.5">{dev.location} | {dev.status}</p>
                      </div>
                      
                      {dev.status !== "Active Now" && (
                        <button 
                          onClick={() => {
                            const filtered = settings.connectedDevices.filter((d) => d.id !== dev.id);
                            settings.updateSetting("connectedDevices", filtered);
                            triggerToast(`Revoked active credentials for foreign client "${dev.device}" successfully.`, "info");
                          }}
                          className="text-[8px] text-red-400 hover:text-red-500 font-mono font-bold hover:underline"
                        >
                          REVOKE
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 13. APPEARANCE SYSTEM CATEGORIES ==================== */}
        {filterCategory("appearance") && !searchTerm && (
          <div id="section-appearance" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-5 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Appearance & Core Theme Styling</h4>
                <p className="text-[10px] text-zinc-500">Fine-tune system highlighting, canvas values, larger text scale, and density.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Visual Tones */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-[#1db954] font-mono block uppercase">Visual Canvas Tones</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {(["Dark", "Light", "System"] as const).map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => handleSelectChange("theme", "App Theme Layout", th)}
                      className={`py-2 text-[10px] font-bold border rounded-lg transition ${
                        settings.theme === th 
                          ? "bg-emerald-950/20 border-[#1db954] text-[#1db954] shadow" 
                          : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {th === "Dark" ? "Core Dark" : th === "Light" ? "Aurora Light" : "Sync System"}
                    </button>
                  ))}
                </div>

                {/* Primary Accent Highlight Custom Picker */}
                <div className="pt-2 border-t border-zinc-850">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase mb-1.5">Primary Glow Accent Presets</span>
                  <div className="flex flex-wrap gap-2 select-none">
                    {[
                      { hex: "#1db954", label: "Neon Green", bg: "bg-[#1db954]" },
                      { hex: "#a855f7", label: "Purple Plasma", bg: "bg-purple-500" },
                      { hex: "#3b82f6", label: "Cobalt Blue", bg: "bg-blue-500" },
                      { hex: "#f97316", label: "Orange Laser", bg: "bg-orange-500" }
                    ].map((accent) => {
                      const isActive = settings.accentColor.toLowerCase() === accent.hex.toLowerCase();
                      return (
                        <button
                          key={accent.hex}
                          type="button"
                          onClick={() => {
                            settings.updateSetting("accentColor", accent.hex);
                            triggerToast(`Visual highlights updated to ${accent.label}.`, "success");
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono border rounded transition ${
                            isActive 
                              ? "bg-emerald-950/15 border-[#1db954] text-white" 
                              : "bg-zinc-950 border-zinc-905 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                          <span>{accent.label}</span>
                        </button>
                      );
                    })}

                    {/* Integrated Custom color picker */}
                    <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 p-1 rounded">
                      <input 
                        type="color" 
                        value={settings.accentColor}
                        onChange={(e) => settings.updateSetting("accentColor", e.target.value)}
                        className="w-4 h-4 bg-transparent cursor-pointer border-0 rounded"
                        title="Pick custom color HEX"
                      />
                      <input 
                        type="text" 
                        value={settings.accentColor}
                        onChange={(e) => settings.updateSetting("accentColor", e.target.value)}
                        className="bg-transparent outline-none w-14 font-mono text-[8px] uppercase text-zinc-300 border-0"
                        placeholder="#HEX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizing, density, accessibility */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-4">
                <span className="text-[9px] text-purple-400 font-mono block uppercase">Accessibility Assist Calibration</span>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {(["Comfortable", "Compact"] as const).map((den) => (
                      <button
                        key={den}
                        type="button"
                        onClick={() => handleSelectChange("layout", "Layout spacing density", den)}
                        className={`flex-1 py-1.5 text-[9.5px] font-bold border rounded-lg transition ${
                          settings.layout === den 
                            ? "bg-purple-950/20 border-purple-500 text-purple-400" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {den === "Compact" ? "Compact Rows" : "Comfortable gaps"}
                      </button>
                    ))}
                  </div>

                  {[
                    { key: "largerText" as const, title: "Larger Text Scaling (+1px)", desc: "Enlarge diagnostic telemetry letters across panels." },
                    { key: "reducedMotion" as const, title: "Reduced Motion transitions", desc: "Mutes high-speed hover sparkles & slideshow entries." },
                    { key: "highContrast" as const, title: "High Contrast layout helper", desc: "Inverses thin grey margins to pure black-whites." }
                  ].map((acc) => (
                    <div key={acc.key} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-900 rounded">
                      <div>
                        <div className="font-bold text-white text-[10px]">{acc.title}</div>
                        <p className="text-[9px] text-zinc-550 leading-none mt-0.5">{acc.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={settings[acc.key]}
                          onChange={() => handleToggle(acc.key, acc.title)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-purple-650 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:rounded-full after:h-3 after:w-3 after:transition-all pointer-events-none"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 14. ABOUT SPECTRUM DETAILS ==================== */}
        {filterCategory("about") && !searchTerm && (
          <div id="section-about" className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-5 space-y-4 animate-slideUp">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="p-2 bg-[#1db954]/10 text-[#1db954] rounded-lg">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">System Diagnostics & Build Versions</h4>
                <p className="text-[10px] text-zinc-500">Examine current compiler releases, privacy terms, or query Sound Engineer tickets.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              
              {/* Build statistics */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3 font-mono">
                <span className="text-[9px] text-[#1db954] font-bold block uppercase">Core Diagnostics Parameters</span>
                
                <div className="space-y-2 text-[10px] text-zinc-400">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Dynamic Release Version:</span>
                    <span className="text-white font-bold">Aura v3.6.0-stable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Zustand state engine:</span>
                    <span className="text-emerald-500 font-bold">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Encryption Gate Level:</span>
                    <span className="text-purple-400 font-bold">TLS v1.3</span>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-2 text-[9.5px] leading-relaxed text-zinc-500">
                  <p className="font-bold text-zinc-400">Release Notes - Build 3410:</p>
                  <ul className="list-disc list-inside space-y-0.5 mt-1">
                    <li>Zustand state manager and Undo-Redo synced.</li>
                    <li>Audio codec selection hooks FLAC bits correctly.</li>
                    <li>Downloads storage recalculations completely real-time.</li>
                  </ul>
                </div>
              </div>

              {/* Simulated client support ticket form */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/60 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-purple-400 font-mono block uppercase">Query Sound Engineers Support</span>
                  <p className="text-[9.5px] text-zinc-500 mt-1">Type diagnostic hurdles below; network logs will automatically append.</p>
                </div>
                
                <textarea 
                  rows={2}
                  placeholder="Query text, compiler problems, or feature requests..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 outline-none focus:border-purple-550 text-white resize-none mt-2 text-[10.5px]"
                />
                
                <button 
                  onClick={() => {
                    triggerToast("Support ticket successfully appended to server logs queue folder.", "success");
                  }}
                  className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-[#1db954] text-white font-bold rounded hover:brightness-110 active:scale-98 transition text-[10px] font-mono uppercase"
                >
                  Send Support Telex
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED TOAST ALERTS OVERLAYS */}
      <div className="fixed bottom-6 right-6 z-[6000] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-3.5 rounded-lg border shadow-xl flex items-center gap-3 animate-slideUp text-xs font-semibold ${
              toast.type === "success" 
                ? "bg-zinc-950/95 text-[#1db954] border-[#1db954]/30 shadow-[#1db954]/10"
                : toast.type === "error" 
                ? "bg-red-955/95 text-red-400 border-red-900/30"
                : "bg-zinc-955/95 text-cyan-400 border-cyan-900/30"
            }`}
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ==================== 2FA ENCRYPTION POPUP MODAL ==================== */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur flex items-center justify-center p-4 z-[9999] select-none animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#1db954]" />
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">Configure Two Factor OTP</h4>
            </div>
            
            <p className="text-[10px] text-zinc-400 leading-normal">
              Enter 6-digit confirmation code generated. A dynamic SMS code was triggered to +1 (340) ***-8451.
            </p>

            <input 
              type="text" 
              placeholder="0 0 0 - 0 0 0"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-black text-center font-mono focus:border-[#1db954] tracking-widest text-[#1db954] font-black text-sm border border-zinc-850 p-2 rounded-lg outline-none"
            />

            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => {
                  if (verificationCode.length === 6) {
                    settings.updateSetting("twoFactorAuth", true);
                    setShow2FAModal(false);
                    setVerificationCode("");
                    triggerToast("Two-Factor Protection successfully activated!", "success");
                  } else {
                    triggerToast("OTP index format mismatch! Code must contain 6 decimals.", "error");
                  }
                }}
                className="flex-1 py-1 px-3 bg-[#1db954] text-black font-bold text-[10.5px] rounded transition uppercase"
              >
                Verify & Lock
              </button>
              <button 
                onClick={() => {
                  setShow2FAModal(false);
                  setVerificationCode("");
                }}
                className="py-1 px-3 bg-zinc-905 border border-zinc-850 text-zinc-400 hover:text-white text-[10px] rounded transition"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MEMORY CLEAR VAULT MODAL ==================== */}
      {showClearMemoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl w-full max-w-sm space-y-4 shadow-xl text-center">
            <Trash2 className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
            <div className="text-xs font-black text-white uppercase font-mono tracking-wider">Purge AI Telemetry memory Registers?</div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              This triggers diagnostic purge of recommendations weight matrices. Aura algorithm drops records of study routines or music vectors immediately.
            </p>
            <div className="flex gap-2 pt-2.5 justify-center">
              <button 
                onClick={() => {
                  setShowClearMemoryModal(false);
                  triggerToast("Recommended registers indices successfully purged.", "error");
                }}
                className="py-1 px-4 bg-red-650 hover:bg-red-750 text-white font-bold text-[10.5px] rounded transition"
              >
                Purge All Registers
              </button>
              <button 
                onClick={() => setShowClearMemoryModal(false)}
                className="py-1 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE PROFILE MODAL ==================== */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-zinc-950 border border-red-900/40 p-5 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto animate-pulse" />
              <div className="text-xs font-black text-white uppercase font-mono tracking-wider mt-2">DANGER MODE: PURGE ACCOUNT PROFILE</div>
              <p className="text-[9.5px] text-zinc-500 mt-1.5 leading-relaxed">
                This wipes all active streams, streaks statistics, and linked gateways permanently. To verify, please input verification word "CONFIRM" below:
              </p>
            </div>

            <input 
              type="text" 
              placeholder="CONFIRM"
              value={deletePIN}
              onChange={(e) => {
                setDeletePIN(e.target.value);
                setDeleteError("");
              }}
              className="w-full bg-black text-center focus:border-red-500 text-red-400 font-bold text-xs border border-zinc-850 p-2 rounded outline-none"
            />

            {deleteError && (
              <span className="block text-[8px] text-red-400 font-mono text-center font-bold">{deleteError}</span>
            )}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => {
                  if (deletePIN === "CONFIRM") {
                    setShowDeleteAccountModal(false);
                    setDeletePIN("");
                    triggerToast("Account profile successfully queued for deep sever deletion.", "error");
                    setTimeout(() => {
                      triggerToast("Account permanently deleted. Aura session collapsed.", "error");
                    }, 1200);
                  } else {
                    setDeleteError("Input characters mismatch. Enter 'CONFIRM' to purge.");
                  }
                }}
                className="flex-1 py-1 px-3 bg-red-650 hover:bg-red-750 text-white font-bold text-[10px] rounded transition uppercase"
              >
                Destroy Profile Permanently
              </button>
              <button 
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeletePIN("");
                  setDeleteError("");
                }}
                className="py-1 px-3 bg-zinc-900 text-zinc-400 text-[10px] rounded hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
