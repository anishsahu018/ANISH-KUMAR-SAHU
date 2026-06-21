import React, { useState } from "react";
import { Upload, Music, BarChart2, Users, DollarSign, Send, Heart, Flame, Sparkles } from "lucide-react";

interface Donation {
  id: string;
  sender: string;
  amount: number;
  message: string;
  timestamp: string;
}

export default function CreatorSuite() {
  const [trackTitle, setTrackTitle] = useState("");
  const [trackGenre, setTrackGenre] = useState("Lo-Fi");
  const [trackBpm, setTrackBpm] = useState(90);
  const [artworkPrompt, setArtworkPrompt] = useState("");
  const [creatorLogs, setCreatorLogs] = useState<string[]>([]);

  // Simulation metrics
  const [totalSubscribers, setTotalSubscribers] = useState(1420);
  const [totalPlays, setTotalPlays] = useState(48210);
  const [totalDonations, setTotalDonations] = useState(2540.50);

  const [donationsList, setDonationsList] = useState<Donation[]>([
    { id: "1", sender: "CodeMaster99", amount: 15.00, message: "This lo-fi track kept me debugging for 6 hours straight. Golden vibe!", timestamp: "10m ago" },
    { id: "2", sender: "AliceInTech", amount: 25.00, message: "Aura Music is the absolute future. Keep creating!", timestamp: "1h ago" },
    { id: "3", sender: "RainySleeper", amount: 50.00, message: "Perfect rainfall synthesizers! Love the Alpha brainwaves.", timestamp: "5h ago" }
  ]);

  const [supportMessage, setSupportMessage] = useState("");
  const [supportName, setSupportName] = useState("");
  const [supportAmount, setSupportAmount] = useState(10);

  const handleUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim()) return;

    setCreatorLogs(prev => [
      `Initializing upload pipeline for track '${trackTitle}'...`,
      `Structuring audio assets and extracting WAV meta spectrograms...`,
      `Applying automated acoustic volume leveling at -14 LUFS...`,
      `Success! '${trackTitle}' is now live on Aura Music Discovery feeds.`,
      ...prev
    ]);

    setTotalPlays(prev => prev + 120); // boost synthetic plays count
    setTrackTitle("");
    setArtworkPrompt("");
  };

  const handleSendDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName.trim() || !supportMessage.trim()) return;

    const freshDonation: Donation = {
      id: String(Date.now()),
      sender: supportName,
      amount: supportAmount,
      message: supportMessage,
      timestamp: "Just now"
    };

    setDonationsList([freshDonation, ...donationsList]);
    setTotalDonations(prev => prev + supportAmount);
    setTotalSubscribers(prev => prev + 1); // increment creator fans count
    setSupportName("");
    setSupportMessage("");
  };

  return (
    <div className="space-y-8">
      {/* 1. Artist Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Subs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase">FAN SUBSCRIPTIONS</span>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {totalSubscribers.toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-400 font-mono">+12 new members today</p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Global Stream Plays */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase">STREAM AUDITS</span>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {totalPlays.toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-400 font-mono">+482 plays last hour</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        {/* Direct Donations Received */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase">COLLECTED TIPS &amp; SUBS</span>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              ${totalDonations.toFixed(2)}
            </h3>
            <p className="text-[10px] text-emerald-400 font-mono">+ $120.00 this week</p>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 2. Upload Tracker Column + Supporter Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload simulated pipeline */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-4">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" /> Upload Original Music Spectrum
            </h4>
            <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded-full">CD STREAM DISTRIBUTION</span>
          </div>

          <form onSubmit={handleUploadSimulate} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-400">Track Title</label>
                <input 
                  type="text" 
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="e.g. Deep Reflection"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400">Music Genre / Category</label>
                <select 
                  value={trackGenre}
                  onChange={(e) => setTrackGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-emerald-500"
                >
                  <option value="Lo-Fi">Ambient Lo-Fi</option>
                  <option value="Synthwave">Retro Synthwave</option>
                  <option value="Acoustic">Acoustic Chords</option>
                  <option value="Cinematic">Cinematic Orchestral</option>
                  <option value="Piano">Classic Solo Piano</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-400">Audio Spectrum Wave (Visual Art Prompt)</label>
              <input 
                type="text" 
                value={artworkPrompt}
                onChange={(e) => setArtworkPrompt(e.target.value)}
                placeholder="A magical neon campfire reflecting soundwaves on a rainy lake, digital art."
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-emerald-500"
              />
            </div>

            <button 
              id="upload-track-submit-btn"
              type="submit" 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition"
            >
              Simulate Core CDN Upload
            </button>
          </form>

          {/* Upload console logs */}
          {creatorLogs.length > 0 && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[10.5px] text-slate-400 space-y-1 max-h-36 overflow-y-auto">
              <span className="text-slate-500 font-bold block pb-1 border-b border-slate-900">CDN LOGS PIPELINE:</span>
              {creatorLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-emerald-500">▶</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supporter tip list & tip sender console */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-4">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Fan Support &amp; Tips Ledger
            </h4>
            <span className="bg-amber-500/10 text-amber-500 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">100% ROYALTY TO ARTISTS</span>
          </div>

          {/* Micro donation form */}
          <form onSubmit={handleSendDonation} className="space-y-3 text-xs font-mono bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">SUPPORT THIS CREATOR</span>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <input 
                type="text"
                placeholder="Nick Name"
                value={supportName}
                required
                onChange={(e) => setSupportName(e.target.value)}
                className="bg-slate-905 border border-slate-850 p-2.5 rounded-xl text-white text-xs outline-none focus:border-amber-500"
              />
              <select
                value={supportAmount}
                onChange={(e) => setSupportAmount(Number(e.target.value))}
                className="bg-slate-905 border border-slate-850 p-2.5 rounded-xl text-white text-xs outline-none focus:border-amber-500"
              >
                <option value="5">$5.00 Coffee Tip</option>
                <option value="10">$10.00 Gold Medallion</option>
                <option value="25">$25.00 Premium Pass</option>
                <option value="50">$50.00 Mega Sponsor</option>
              </select>
            </div>

            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder="Send encouragement message..."
                value={supportMessage}
                required
                onChange={(e) => setSupportMessage(e.target.value)}
                className="w-full bg-slate-905 border border-slate-850 py-2.5 pl-3 pr-10 rounded-xl text-white text-xs outline-none focus:border-amber-500"
              />
              <button 
                id="send-tip-btn"
                type="submit" 
                className="absolute right-2.5 text-emerald-400 hover:text-emerald-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Supporter Tip List */}
          <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
            {donationsList.map((tip) => (
              <div key={tip.id} className="flex gap-3 text-xs border-b border-slate-800/40 pb-3">
                <div className="h-8 w-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center rounded-xl font-mono text-xs font-bold leading-none select-none">
                  {tip.sender[0].toUpperCase()}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="font-bold text-slate-200">{tip.sender}</span>
                    <span className="text-slate-500">{tip.timestamp}</span>
                  </div>
                  <p className="text-slate-400 leading-normal">{tip.message}</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[11px] font-mono">
                    ${tip.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
