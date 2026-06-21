import React, { useState, useEffect } from "react";
import { Play, Square, Music, Compass, AlertCircle, Sparkles } from "lucide-react";
import { auraAudio } from "./AuraSynth";

interface ChordSpec {
  name: string;
  strings: string[]; // fingerings for e, A, D, G, B, e (from low to high)
  frets: number[];
}

export default function LearningSuite() {
  const [activeChord, setActiveChord] = useState<string>("C");
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [seqStep, setSeqStep] = useState<number>(0);
  const [bpmInput, setBpmInput] = useState<number>(95);

  // Sequences: [instrumentRow][sixteenthStep]
  const [drumGrid, setDrumGrid] = useState<boolean[][]>([
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], // Kick
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], // Snare
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],             // Hihat
    [false, true, false, false, false, false, true, false, false, true, false, false, false, false, true, false], // Synth Melody
  ]);

  const guitarChords: Record<string, ChordSpec> = {
    C: { name: "C Major", strings: ["x", "3", "2", "0", "1", "0"], frets: [-1, 3, 2, 0, 1, 0] },
    G: { name: "G Major", strings: ["3", "2", "0", "0", "0", "3"], frets: [3, 2, 0, 0, 0, 3] },
    Am: { name: "A Minor", strings: ["x", "0", "2", "2", "1", "0"], frets: [-1, 0, 2, 2, 1, 0] },
    F: { name: "F Major", strings: ["1", "3", "3", "2", "1", "1"], frets: [1, 3, 3, 2, 1, 1] },
    Dm: { name: "D Minor", strings: ["x", "x", "0", "2", "3", "1"], frets: [-1, -1, 0, 2, 3, 1] },
    E: { name: "E Major", strings: ["0", "2", "2", "1", "0", "0"], frets: [0, 2, 2, 1, 0, 0] },
  };

  const pianoKeys = [
    { label: "C4", freq: 261.63, isBlack: false },
    { label: "C#4", freq: 277.18, isBlack: true },
    { label: "D4", freq: 293.66, isBlack: false },
    { label: "D#4", freq: 311.13, isBlack: true },
    { label: "E4", freq: 329.63, isBlack: false },
    { label: "F4", freq: 349.23, isBlack: false },
    { label: "F#4", freq: 369.99, isBlack: true },
    { label: "G4", freq: 392.00, isBlack: false },
    { label: "G#4", freq: 415.30, isBlack: true },
    { label: "A4", freq: 440.00, isBlack: false },
    { label: "A#4", freq: 466.16, isBlack: true },
    { label: "B4", freq: 493.88, isBlack: false },
    { label: "C5", freq: 523.25, isBlack: false },
  ];

  const triggerPianoKey = (freq: number) => {
    auraAudio.playSynthNote(freq, "triangle", 0.3);
  };

  // Drum machine loop callback logic
  useEffect(() => {
    if (isPlayingSeq) {
      auraAudio.startBeatSequence(bpmInput, (step) => {
        setSeqStep(step);
        // Play selected beats for step
        if (drumGrid[0][step]) auraAudio.playKick();
        if (drumGrid[1][step]) auraAudio.playSnare();
        if (drumGrid[2][step]) auraAudio.playHihat();
        if (drumGrid[3][step]) {
          // Play a rhythmic synth beep depending on step value
          const notes = [261.63, 311.13, 392.00, 440.00, 523.25];
          const chosenFreq = notes[step % notes.length];
          auraAudio.playMelodyBeep(chosenFreq);
        }
      });
    } else {
      auraAudio.stopBeatSequence();
    }

    return () => {
      auraAudio.stopBeatSequence();
    };
  }, [isPlayingSeq, drumGrid, bpmInput]);

  const toggleSequencer = () => {
    auraAudio.init();
    setIsPlayingSeq(!isPlayingSeq);
  };

  const toggleSeqBox = (row: number, step: number) => {
    const updated = [...drumGrid];
    updated[row][step] = !updated[row][step];
    setDrumGrid(updated);
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const freshBpm = Math.max(40, Math.min(220, parseInt(e.target.value) || 90));
    setBpmInput(freshBpm);
  };

  return (
    <div className="space-y-8">
      
      {/* 2 panels: Left Guitar tabs fretts, Right Piano keyboard keys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Guitar Chord Visualizer */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center text-sm">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">
              Aura Guitar Chord Companion
            </h4>
            <span className="text-slate-500 font-mono text-xs">PRACTICE CHORDS</span>
          </div>

          {/* Selector keys */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(guitarChords).map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  setActiveChord(ch);
                  // Play dynamic arpeggio when selecting a chord
                  const baseFreqs = ch === "C" ? [261.63, 329.63, 392.00] : ch === "G" ? [196.00, 246.94, 293.66] : [220.00, 261.63, 329.63];
                  baseFreqs.forEach((fr, idx) => {
                    setTimeout(() => auraAudio.playSynthNote(fr, "sine", 0.4), idx * 100);
                  });
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono border transition ${activeChord === ch ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-400"}`}
              >
                {ch} Chord
              </button>
            ))}
          </div>

          {/* Neck visualizer */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center">
            <div className="relative w-full max-w-sm h-48 border-l border-r border-slate-800 flex flex-col justify-between p-2 font-mono text-[10px]">
              
              {/* String labels */}
              <div className="flex justify-between text-slate-500 border-b border-slate-800 pb-1 mb-2">
                <span>E (Low)</span>
                <span>A</span>
                <span>D</span>
                <span>G</span>
                <span>B</span>
                <span>E (High)</span>
              </div>

              {/* Fret lines visual */}
              <div className="relative flex justify-between h-24 border-t-2 border-amber-800">
                {/* 6 strings vertical blocks */}
                {Array.from({ length: 6 }).map((_, sIdx) => {
                  const fingerVal = guitarChords[activeChord]?.strings[sIdx];
                  const fretVal = guitarChords[activeChord]?.frets[sIdx];
                  
                  return (
                    <div key={sIdx} className="relative flex flex-col items-center w-1/6 h-full border-r border-dashed border-slate-800/40">
                      {fretVal === -1 ? (
                        <span className="text-red-500 font-bold -mt-3 text-[10px]">X</span>
                      ) : fretVal === 0 ? (
                        <span className="text-emerald-400 font-bold -mt-3 text-[10px]">O</span>
                      ) : (
                        <div 
                          className="absolute bg-emerald-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold font-mono shadow-md text-[10px]"
                          style={{ top: `${fretVal * 20}px` }}
                        >
                          {fingerVal}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center font-bold text-white text-xs mt-4">
                Chord Shape: {guitarChords[activeChord]?.name} ({guitarChords[activeChord]?.strings.join(" ")})
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Piano Keyboard */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center text-sm">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">
              Therapeutic Desktop Piano Keys
            </h4>
            <span className="bg-purple-500/10 text-purple-400 font-mono text-[10px] px-2 py-0.5 rounded-full">ACTIVE GRAPHIC SYNTH</span>
          </div>

          <div className="relative flex min-h-[160px] bg-slate-950 p-4 border border-slate-800 rounded-2xl overflow-x-auto justify-center select-none">
            {pianoKeys.map((k) => (
              <button
                key={k.label}
                onClick={() => triggerPianoKey(k.freq)}
                className={`relative flex-1 z-10 transition h-32 rounded-b-md ${
                  k.isBlack 
                    ? "bg-slate-950 text-slate-300 font-mono text-[9px] -mx-3 border-r border-l border-slate-800 h-20 w-8 flex items-end justify-center pb-2 hover:bg-slate-900 shadow-lg"
                    : "bg-white text-slate-950 font-mono text-[10px] border-r border-slate-200 flex items-end justify-center pb-3 hover:bg-slate-100 shadow"
                }`}
              >
                <span>{k.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
            <Compass className="w-4 h-4 text-emerald-400" />
            <p>Clicking physical or soft keys triggers pure custom visual synthesizers in real-time logic.</p>
          </div>
        </div>
      </div>

      {/* Rhythmic drum Step Sequencer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles className="text-emerald-400 w-4 h-4" /> 16-Step Aura Drum Sequencer
            </h4>
            <p className="text-slate-400 text-xs mt-1">
              Create a custom live background beat pattern. Syncs instantly with play triggers below.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-500 font-mono uppercase">Tempo BPM:</span>
              <input 
                type="number"
                value={bpmInput}
                onChange={handleBpmChange}
                className="w-12 bg-transparent text-white font-mono font-bold text-xs text-center border-none focus:outline-none"
              />
            </div>

            <button
              onClick={toggleSequencer}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold rounded-xl text-white transition ${isPlayingSeq ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
            >
              {isPlayingSeq ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white" /> Stop Loop
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" /> Play Sequencer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Drums grid row blocks */}
        <div className="space-y-3 overflow-x-auto pb-4">
          {["Kick Drum", "Snare Clap", "Closed Hat", "Synth Melody"].map((label, rIdx) => (
            <div key={rIdx} className="flex items-center gap-3 min-w-[620px]">
              {/* Row Label */}
              <div className="w-24 text-left">
                <span className="text-xs text-slate-400 font-bold font-mono uppercase">{label}</span>
              </div>
              
              {/* Steps */}
              <div className="flex-1 grid grid-cols-16 gap-1.5">
                {Array.from({ length: 16 }).map((_, sIdx) => {
                  const isActive = drumGrid[rIdx][sIdx];
                  const isCurrentStep = seqStep === sIdx && isPlayingSeq;

                  return (
                    <button
                      key={sIdx}
                      onClick={() => toggleSeqBox(rIdx, sIdx)}
                      className={`h-9 border rounded-md transition duration-150 ${
                        isActive 
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400" 
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900"
                      } ${isCurrentStep ? "ring-2 ring-amber-400 scale-105" : ""}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-mono text-slate-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active beat</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-800" /> Quiet beat</span>
          </div>
          <span>BPM Schedule: 16th interval pulses</span>
        </div>
      </div>

    </div>
  );
}
