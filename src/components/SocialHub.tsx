import React, { useState } from "react";
import { MessageSquare, ThumbsUp, Send, UserCheck, Flame, Heart, Sparkles, Plus } from "lucide-react";
import { MusicPost } from "../types";

export default function SocialHub() {
  const [posts, setPosts] = useState<MusicPost[]>([
    {
      id: "1",
      author: "Alex Rivera @rivera_ambient",
      avatar: "A",
      content: "Just combined alpha brainwaves with synthesized coastline waves in Pomodoro Mode. My productivity levels have went through the roof today! Tested out some new Rust configurations effortlessly.",
      likes: 34,
      reactions: { "🔥": 12, "❤️": 8, "🎧": 14 },
      comments: [
        { user: "DevDiva", text: "Me too! Aura's binaural beats are so crisp." },
        { user: "SoundScribe22", text: "The crosswave delay sweeps are absolutely golden." }
      ]
    },
    {
      id: "2",
      author: "Elena Petrova (Artist) @elena_keys",
      avatar: "E",
      content: "Thank you for the amazing donations this morning! I am finishing up my newly suggested piano arrangement based on the AI 'Rainy Evening' prompt generator. Release scheduled next Monday!",
      likes: 58,
      reactions: { "🔥": 25, "👑": 12, "❤️": 21 },
      comments: [
        { user: "AuraLover", text: "Donated $15 today, well deserved Queen!" },
        { user: "VibeSeeker", text: "Can't wait to play it on my learning mode piano keys." }
      ]
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const freshPost: MusicPost = {
      id: String(Date.now()),
      author: "Me (Aura Dev) @anish_kumar",
      avatar: "M",
      content: newPostText,
      likes: 0,
      reactions: { "🔥": 0, "❤️": 0, "🎧": 0 },
      comments: []
    };

    setPosts([freshPost, ...posts]);
    setNewPostText("");
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleAddReaction = (id: string, emoji: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const reactions = { ...p.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...p, reactions };
      }
      return p;
    }));
  };

  const handleAddComment = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[id];
    if (!commentText || !commentText.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          comments: [...p.comments, { user: "MindsEye", text: commentText }]
        };
      }
      return p;
    }));

    setCommentInputs({ ...commentInputs, [id]: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Feed Area */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Write Post Box */}
        <div className="glass p-5 rounded-3xl shadow-xl">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block font-bold">
              Share your Music &amp; Vibes
            </span>
            <textarea
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What focus sequence or artist arrangement are you crafting today?"
              className="w-full bg-black/60 border border-white/5 p-4 rounded-2xl text-zinc-300 text-xs focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 font-sans leading-relaxed"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono">
                Posting to Aura Music Social Stream
              </span>
              <button
                id="create-social-post-btn"
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition shadow-lg shadow-indigo-600/20"
              >
                Publish Vibe
              </button>
            </div>
          </form>
        </div>

        {/* Post Timeline */}
        <div className="space-y-6">
          {posts.map((p) => (
            <div key={p.id} className="glass p-6 rounded-3xl space-y-4 shadow-xl">
              
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-black flex items-center justify-center font-mono text-sm leading-none select-none shadow-md shadow-indigo-500/10">
                  {p.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 font-mono">{p.author}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono">Posted to Aura Sphere</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                {p.content}
              </p>

              {/* Custom micro reactions block */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(p.reactions).map(([emoji, val]) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddReaction(p.id, emoji)}
                    className="px-2.5 py-1 bg-black/60 border border-white/5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 text-zinc-400 hover:text-white transition"
                  >
                    <span>{emoji}</span>
                    <span>{val}</span>
                  </button>
                ))}
                
                <button
                  onClick={() => handleAddReaction(p.id, "🔥")}
                  className="px-2 bg-black/60 border border-white/5 rounded-lg text-indigo-400 font-bold hover:text-white transition text-xs flex items-center justify-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Likes and Comments Counters */}
              <div className="flex gap-6 border-t border-b border-white/5 py-2.5 text-xs text-zinc-500 font-mono">
                <button 
                  onClick={() => handleLike(p.id)}
                  className={`flex items-center gap-1.5 transition ${p.hasLiked ? "text-indigo-400 font-black" : "hover:text-zinc-300"}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{p.likes} Endorsements</span>
                </button>

                <div className="flex items-center gap-1.5 text-zinc-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{p.comments.length} Thoughts</span>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="space-y-2">
                {p.comments.map((c, cIdx) => (
                  <div key={cIdx} className="bg-black/65 p-2.5 rounded-xl border border-white/5 text-xs">
                    <span className="font-mono text-[10px] text-zinc-400 font-bold block">{c.user}</span>
                    <p className="text-zinc-400 font-sans mt-0.5">{c.text}</p>
                  </div>
                ))}

                {/* Send Reply Form */}
                <form 
                  onSubmit={(e) => handleAddComment(p.id, e)}
                  className="relative flex items-center mt-2"
                >
                  <input
                    type="text"
                    placeholder="Write your thought..."
                    value={commentInputs[p.id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [p.id]: e.target.value })}
                    className="w-full bg-black/60 border border-white/5 py-2 pl-3 pr-10 rounded-xl text-zinc-300 text-xs outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 text-indigo-400 hover:text-indigo-300"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Suggested follows and groups right side */}
      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass p-6 rounded-3xl space-y-4 text-center shadow-xl">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-2xl flex items-center justify-center rounded-3xl leading-none select-none shadow-md shadow-indigo-550/10">
            MK
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm font-mono">Anish Kumar @anish_keys</h4>
            <span className="text-[10px] text-indigo-400 font-mono tracking-wider block font-bold">PRO LEVEL LISTENER</span>
          </div>
          <p className="text-xs text-zinc-400 leading-normal font-sans">
            "Acoustic and lo-fi explorer. Always coding with white noise and retro guitar tabs."
          </p>
          <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-4 font-mono text-xs">
            <div className="text-center font-sans">
              <span className="text-zinc-500 text-[10px] block font-mono">FOLLOWING</span>
              <span className="text-white font-bold block mt-0.5">142</span>
            </div>
            <div className="text-center border-l border-white/5 font-sans">
              <span className="text-zinc-500 text-[10px] block font-mono">DISCOVERED</span>
              <span className="text-white font-bold block mt-0.5">48 Tracks</span>
            </div>
          </div>
        </div>

        {/* Suggested groups */}
        <div className="glass p-5 rounded-3xl space-y-4 shadow-xl">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block font-bold">
            Suggested Circles
          </span>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <span className="font-bold text-zinc-300 block">Lofi chillers</span>
                <span className="text-[10px] text-zinc-500 block">34,220 members</span>
              </div>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/5 font-bold rounded-lg leading-none transition text-[10px]">
                JOIN
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-zinc-300 block">Rust coders bleeps</span>
                <span className="text-[10px] text-zinc-555 block">4,810 members</span>
              </div>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/5 font-bold rounded-lg leading-none transition text-[10px]">
                JOIN
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
