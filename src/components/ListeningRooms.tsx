import React, { useState, useEffect } from "react";
import { Users, Send, Vote, Music, ThumbsUp, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { ListeningRoom, Track } from "../types";

export default function ListeningRooms() {
  const listTracks: Track[] = [
    { id: 11, title: "Silent Rain", artist: "Horizon", duration: 180, genre: "Ambient", moods: ["Relaxed"], chords: ["C", "F"], pianoNotes: [], lyrics: [] },
    { id: 22, title: "Neon Overdrive", artist: "CyberPulse", duration: 224, genre: "EDM", moods: ["Motivated"], chords: ["Am", "G"], pianoNotes: [], lyrics: [] },
    { id: 33, title: "Binary Moonlight", artist: "Horizon", duration: 195, genre: "Lo-Fi", moods: ["Focused"], chords: ["Dm", "E"], pianoNotes: [], lyrics: [] },
    { id: 44, title: "Deep Sea Echoes", artist: "Abyss", duration: 260, genre: "Experimental", moods: ["Relaxed"], chords: ["C", "Am"], pianoNotes: [], lyrics: [] }
  ];

  const [rooms, setRooms] = useState<ListeningRoom[]>([
    {
      id: "room-1",
      name: "Late-Night Coding & Debugging",
      activeListeners: 42,
      currentTrack: listTracks[2], // Binary Moonlight
      chat: [
        { id: "1", sender: "RustNinja", avatar: "R", text: "Compiler green after 4 hours on this track! Best lofi vibe." },
        { id: "2", sender: "AliceInPython", avatar: "A", text: "Can we vote up 'Silent Rain' next?" },
        { id: "3", sender: "ByteWise", avatar: "B", text: "Totally. Upvoted!" }
      ],
      queue: [
        { track: listTracks[0], votes: 8 },
        { track: listTracks[1], votes: 4 },
        { track: listTracks[3], votes: 2 }
      ]
    },
    {
      id: "room-2",
      name: "Cinematic Coding Soundscapes",
      activeListeners: 18,
      currentTrack: listTracks[3], // Deep Sea Echoes
      chat: [
        { id: "1", sender: "HansGamer", avatar: "H", text: "Love the orchestral depth. It feels like I'm writing a space simulator!" }
      ],
      queue: [
        { track: listTracks[1], votes: 5 }
      ]
    }
  ]);

  const [activeRoomId, setActiveRoomId] = useState("room-1");
  const [chatInput, setChatInput] = useState("");

  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  // Live Chat Simulator! Periodically appends realistic comments to active rooms to feel organic and live
  useEffect(() => {
    const fakeSenders = ["GoGopher", "C_Compiler", "WebWizard", "NixVibe", "VimAddict", "CoffeeBean"];
    const fakeTexts = [
      "This song flows perfectly.",
      "Just upvoted the next track!",
      "Whose running this session? The remix settings are crazy clear.",
      "Indeed, loving the lo-fi texture cuts.",
      "Are we doing a Pomodoro block in 10 minutes?",
      "Can we play some aggressive liquid drum & bass next?"
    ];

    const chatInterval = setInterval(() => {
      setRooms(prevRooms => prevRooms.map(r => {
        // Only trigger simulator for active selected room to keep performance optimal
        if (r.id === activeRoomId && Math.random() > 0.4) {
          const sender = fakeSenders[Math.floor(Math.random() * fakeSenders.length)];
          const text = fakeTexts[Math.floor(Math.random() * fakeTexts.length)];
          const messageId = String(Date.now());
          
          return {
            ...r,
            activeListeners: r.activeListeners + (Math.random() > 0.6 ? 1 : -1), // float reader numbers
            chat: [
              ...r.chat,
              { id: messageId, sender, avatar: sender[0], text }
            ].slice(-15) // limit list lengths
          };
        }
        return r;
      }));
    }, 5000);

    return () => clearInterval(chatInterval);
  }, [activeRoomId]);

  const handleSendChatCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        return {
          ...r,
          chat: [
            ...r.chat,
            { id: String(Date.now()), sender: "Me (You)", avatar: "M", text: chatInput }
          ]
        };
      }
      return r;
    }));

    setChatInput("");
  };

  const handleVoteQueue = (trackId: number, multiplier: number) => {
    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        const updatedQueue = r.queue.map(q => {
          if (q.track.id === trackId) {
            return { ...q, votes: Math.max(0, q.votes + multiplier) };
          }
          return q;
        });

        // Re-sort queue according to votes descending
        updatedQueue.sort((a, b) => b.votes - a.votes);

        return { ...r, queue: updatedQueue };
      }
      return r;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* 1. Left Sidebar - Active Room Grid */}
      <div className="space-y-4">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block font-bold">
          Live Listening Rooms
        </span>

        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoomId(room.id)}
            className={`w-full text-left p-5 border rounded-3xl transition flex flex-col space-y-3 ${
              activeRoomId === room.id 
                ? "bg-indigo-500/10 border-indigo-500/30 shadow-md shadow-indigo-500/5 text-indigo-400" 
                : "glass border-white/5 hover:bg-white/5"
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <span className={`font-mono text-[10px] font-black uppercase transition ${activeRoomId === room.id ? "text-indigo-400" : "text-zinc-550"}`}>
                ONLINE PARTY
              </span>
              <span className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-white/5">
                <Users className="w-3 h-3 text-indigo-400 animate-pulse" /> {room.activeListeners}
              </span>
            </div>

            <h4 className="font-bold font-sans text-sm text-zinc-105 leading-snug">
              {room.name}
            </h4>

            <div className="flex items-center gap-2 bg-black/65 p-2 rounded-xl border border-white/5 text-xs font-mono text-zinc-400 w-full overflow-hidden">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse fill-indigo-500" />
              <p className="truncate block flex-1 font-sans">
                LIVE: {room.currentTrack.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 2. Middle Block - Lobby Visual & Chat */}
      <div className="glass border border-white/5 rounded-3xl p-6 flex flex-col h-[520px] justify-between shadow-xl">
        
        {/* Header detail */}
        <div className="border-b border-white/5 pb-3 mb-3">
          <h3 className="font-bold text-white font-sans text-sm block">
            {activeRoom.name}
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono uppercase block mt-1">
            Now Sync-Streaming: {activeRoom.currentTrack.title} by {activeRoom.currentTrack.artist}
          </span>
        </div>

        {/* Live chat panel */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 my-2 scrollbar-none">
          {activeRoom.chat.map((msg) => (
            <div key={msg.id} className="flex gap-2.5 items-start text-xs font-sans">
              <div className="h-7 w-7 bg-black/60 rounded-lg flex items-center justify-center font-black font-mono text-[11px] text-indigo-400 leading-none select-none border border-white/5">
                {msg.avatar}
              </div>
              <div className="flex-1 bg-black/45 p-2.5 border border-white/5 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-400 font-bold block pb-0.5">{msg.sender}</span>
                <p className="text-zinc-300 leading-relaxed font-sans">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enter chat formulation */}
        <form onSubmit={handleSendChatCurrent} className="relative flex items-center pt-2 border-t border-white/5">
          <input
            type="text"
            placeholder="Type sync message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full bg-black/60 border border-white/5 py-3 pl-4 pr-12 rounded-xl text-xs text-white outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-550/20 font-sans"
          />
          <button 
            type="submit"
            className="absolute right-3.5 text-indigo-400 hover:text-indigo-300 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* 3. Right Sidebar - Collaborative Dynamic Voting Queue */}
      <div className="glass border border-white/5 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
        
        <div className="space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h4 className="font-black text-white uppercase tracking-wider font-mono text-xs">
              Live Crowd-Queued Votes
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono leading-none">
              VOTE TO MOVE SONGS HIGHER IN THE LIST
            </p>
          </div>

          <div className="space-y-3.5">
            {activeRoom.queue.map((q) => (
              <div key={q.track.id} className="bg-black/60 border border-white/5 p-3 rounded-2xl flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/10">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate max-w-[110px]">
                    <span className="font-bold text-zinc-200 block truncate leading-tight select-all">{q.track.title}</span>
                    <span className="text-[10px] text-zinc-500 block truncate mt-0.5 font-mono">{q.track.artist}</span>
                  </div>
                </div>

                {/* Voting arrows block */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono text-xs font-black text-zinc-200 block">{q.votes}</span>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider mt-0.5">VOTES</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleVoteQueue(q.track.id, 1)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-indigo-400 rounded-lg border border-white/5 transition"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleVoteQueue(q.track.id, -1)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-red-400 rounded-lg border border-white/5 transition"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 font-mono leading-relaxed border-t border-white/5 pt-4 mt-4">
          * Dynamic Room Queue: Track with the highest votes plays automatically when the current track finishes.
        </div>

      </div>

    </div>
  );
}
