import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to check for Gemini API Key and initialize client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY environment variable is not defined. Using offline mock simulation.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Ensure the core app metadata or helper state doesn't crash if secrets are missing
// API Routes:
// 1. AI DJ Chat and action triggers
app.post("/api/chat-dj", async (req, res) => {
  const { message, currentTrack, currentMood, queue } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Offline simulation mode fallback responses
    let text = "I am in offline mode right now since no GEMINI_API_KEY is detected. Let me suggest some great tracks from our catalog! How about listening to 'Silent Rain' or some Synthwave Beats for focus?";
    let playCommand = null;

    const lower = message.toLowerCase();
    if (lower.includes("energetic") || lower.includes("gym") || lower.includes("workout")) {
      text = "Offline Mode: Playing 'Neon Overdrive' by CyberPulse - a high-tempo synth masterpiece to get your adrenaline pumping!";
      playCommand = { action: "PLAY_TRACK", index: 2 };
    } else if (lower.includes("focus") || lower.includes("study") || lower.includes("rain")) {
      text = "Offline Mode: Loading 'Silent Rain' by Horizon - peaceful acoustic piano mixed with real-time natural synthesized rain patterns. Perfect for study!";
      playCommand = { action: "PLAY_TRACK", index: 0 };
    } else if (lower.includes("skip")) {
      text = "Offline Mode: Skipping current track. Moving to next queue item.";
      playCommand = { action: "SKIP" };
    }

    return res.json({ text, playCommand, source: "Offline Simulation" });
  }

  try {
    const prompt = `You are DJ Aura, an extremely cool, knowledgeable, and intuitive AI disc jockey for Aura Music AI.
You have access to the user's current music playback context:
- Current Song Playing: ${currentTrack ? `${currentTrack.title} by ${currentTrack.artist}` : 'None'}
- Current Mood selected by the user: ${currentMood || 'N/A'}
- Queue List: ${JSON.stringify(queue || [])}

User message: "${message}"

Respond to the user with a highly engaging DJ response (keep it brief, 2-3 sentences max).
If the user's message implies an actionable music command (e.g. play energetic music, skip songs, create mood playlist, listen to something calm), include a JSON command helper at the end of your response, formatted as:
Command: {"action": "PLAY_GENRE" | "PLAY_TRACK" | "SKIP" | "PAUSE" | "CREATE_PLAYLIST", "genre": "electronic|ambient|rock|pop|classical", "prompt": "playlist description description if needed", "trackId": number_if_known}

Be warm, conversational, and energetic. Make sure any Command JSON matches exactly.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    // Parse command if embedded
    let parsedText = responseText;
    let playCommand = null;
    const commandMatch = responseText.match(/Command:\s*({.+})/);
    if (commandMatch) {
      try {
        playCommand = JSON.parse(commandMatch[1]);
        parsedText = responseText.replace(/Command:\s*({.+})/, "").trim();
      } catch (err) {
        console.error("Failed to parse AI DJ command JSON", err);
      }
    }

    res.json({ text: parsedText, playCommand, source: "Gemini AI" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Gemini API error" });
  }
});

// 2. AI Playlist Generation from details
app.post("/api/generate-playlist", async (req, res) => {
  const { prompt } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Return mock curated track list based on terms
    const lower = (prompt || "").toLowerCase();
    let name = "Offline Vibe: " + (prompt || "Custom Chill");
    let desc = "Curated offline tracklist reflecting: " + (prompt || "relaxing vibes");
    let tracks = [
      { id: 101, title: "Pixel Journey", artist: "Byte Sized", duration: 184, genre: "Chiptune", mood: "Motivated" },
      { id: 102, title: "Echoes of Eternity", artist: "Minds Eye", duration: 245, genre: "Ambient", mood: "Relaxed" },
      { id: 103, title: "Binary Moonlight", artist: "Horizon", duration: 198, genre: "Lo-Fi", mood: "Focused" },
      { id: 104, title: "Cyber Sunset", artist: "CyberPulse", duration: 220, genre: "Synthwave", mood: "Happy" }
    ];

    if (lower.includes("gym") || lower.includes("workout") || lower.includes("energ")) {
      name = "Power Drive Synth";
      desc = "Curated beats to push your physical and mental thresholds.";
      tracks = [
        { id: 105, title: "Neon Overdrive", artist: "CyberPulse", duration: 165, genre: "EDM", mood: "Motivated" },
        { id: 106, title: "Voltage Spike", artist: "Electra", duration: 210, genre: "EDM", mood: "Motivated" },
        { id: 107, title: "Shattered Limits", artist: "Overload", duration: 180, genre: "Metal", mood: "Motivated" }
      ];
    }

    return res.json({ name, description: desc, tracks, source: "Offline Curations" });
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a customized music playlist based on the user's prompt: "${prompt}".
Provide a catchy playlist title, a brief aesthetic description, and a list of 5 themed realistic tracks.
For each track specify: title, artist, duration (in seconds, between 120 and 320), genre, work/focus effectiveness percentage, and typical mood categories it fits (Happy, Sad, Focused, Relaxed, Motivated, Stressed).

Return the object structure as clean JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "description", "tracks"],
          properties: {
            name: { type: Type.STRING, description: "Catchy playlist name" },
            description: { type: Type.STRING, description: "Aesthetic description of the playlist vibe" },
            tracks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "artist", "duration", "genre", "focusScore", "mood"],
                properties: {
                  title: { type: Type.STRING, description: "Song title" },
                  artist: { type: Type.STRING, description: "Artist name" },
                  duration: { type: Type.INTEGER, description: "Length in seconds (120-320)" },
                  genre: { type: Type.STRING, description: "Music genre" },
                  focusScore: { type: Type.INTEGER, description: "Productivity concentration score out of 100" },
                  mood: { type: Type.STRING, description: "Mood category matches, comma separated" }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ ...data, source: "Gemini AI" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate playlist" });
  }
});

// 3. AI Lyrics Translation & Deeper Meanings
app.post("/api/lyrics-intelligence", async (req, res) => {
  const { songTitle, artist, lyricsSnippet, actionType } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Mock analysis responses for local offline mode
    let explanation = "This song captures the essence of deep workflow and cerebral focus. Translating mental signals into coding output.";
    let translation = "This is a beautiful translation of the lyrics snippet into clean, elegant prose explaining the artistic vision.";
    let story = "Written late at night, the artist was looking at the digital rain outside and felt a deep connection between programming logic and nature.";

    if (songTitle?.toLowerCase().includes("rain") || songTitle?.toLowerCase().includes("silent")) {
      story = "Horizon wrote this ambient track during a coastal storm. The organic acoustic arrangement symbolizes simplicity amidst the complexity of digital life.";
    }

    return res.json({ explanation, translation, story, source: "Offline Lore" });
  }

  try {
    const prompt = `Analyze this song context:
Song Name: "${songTitle}" by "${artist}"
Snippet of Lyrics/Vibe: "${lyricsSnippet || 'Simulated instrumental or general melody'}"

Please provide an intelligent breakdown containing three components:
1. "explanation": A line-by-line or conceptual analysis explaining what this song means, including poetic metaphors or hidden subtext.
2. "translation": A clean English translation or simplified/explained reading of the song's key hooks or motifs.
3. "story": The fascinating fictional or real backstory of how this song came to be, its artist's creative process, and cultural significance.

Return as direct clean JSON.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["explanation", "translation", "story"],
          properties: {
            explanation: { type: Type.STRING, description: "Metaphor and meaning breakdown of the song snippet/theme" },
            translation: { type: Type.STRING, description: "Literal or dynamic explanation context transition" },
            story: { type: Type.STRING, description: "Backstory and cultural context explanation of the song" }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ ...data, source: "Gemini AI" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed lyrics intelligence query" });
  }
});

// 4. AI Original Song & Lyric Creator
app.post("/api/generate-song", async (req, res) => {
  const { prompt, genre, language } = req.body;
  const client = getGeminiClient();

  if (!client) {
    return res.json({
      title: `Digital Echoes of ${prompt || "Aura"}`,
      genre: genre || "Lo-Fi Beats",
      language: language || "English",
      lyrics: `[Verse 1]
Midnight coffee, screens glow bright
Lines of code into the night
Whispering keys, a gentle sound
Synthesized thoughts spinning around

[Chorus]
Oh digital rainfall on the glass
Compiler outputs flying fast
We are the weavers of state and thread
Singing the dreams inside our head`,
      chordProgression: "Cmaj7 - G6 - Am7 - Fmaj7 (Key of C Major)",
      soundDesign: "Lush synthesized analog pads, retro key dustings, tape-saturated downbeats, and randomized frequency filter sweep triggers.",
      source: "Offline Synthesizer Pre-generator"
    });
  }

  try {
    const aiPrompt = `Act as an AI Master Songwriter and Musicologist.
The user wants to generate an original custom song details from this prompt: "${prompt}"
- Desired Genre: ${genre || "Any"}
- Desired Language: ${language || "English"}

Generate:
1. An original poetic title.
2. Complete, beautiful lyrics structured with [Verse], [Chorus], and [Bridge] blocks.
3. A recommended guitar/piano Chord Progression.
4. Detailed sound design suggestions for instrument synthesis (including instruments, synth settings, rhythm, BPM and feeling).

Please return the details as a clean JSON.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: aiPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "lyrics", "chordProgression", "soundDesign"],
          properties: {
            title: { type: Type.STRING, description: "Creative epic title for the new song" },
            lyrics: { type: Type.STRING, description: "Full lyrics formatted with verse/chorus labels" },
            chordProgression: { type: Type.STRING, description: "Chords sequence e.g. I-V-vi-IV with real chord names" },
            soundDesign: { type: Type.STRING, description: "Sound synthesis, instruments, atmosphere guides and tempo values" }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ ...data, genre, language, source: "Gemini AI" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed original song creator query" });
  }
});


// Serve static Vite files in production, use standard dev routing in development
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Music AI Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
