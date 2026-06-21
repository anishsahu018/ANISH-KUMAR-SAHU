import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Flame, Heart, Sparkles, Trophy } from "lucide-react";
import { auraAudio } from "./AuraSynth";
import { useSettingsStore } from "../store/settingsStore";

export default function Pomodoro() {
  const focusDuration = useSettingsStore((state) => state.focusDuration);
  const shortBreak = useSettingsStore((state) => state.shortBreak);
  const settingsStreakDays = useSettingsStore((state) => state.streakDays);

  const [minutes, setMinutes] = useState(focusDuration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"Work" | "Break">("Work");

  // Sync minutes when focusDuration or shortBreak changes from settings, provided timer is not active.
  useEffect(() => {
    if (!isActive) {
      setMinutes(mode === "Work" ? focusDuration : shortBreak);
      setSeconds(0);
    }
  }, [focusDuration, shortBreak, mode, isActive]);

  // Ambient sound volumes
  const [rainVol, setRainVol] = useState(0);
  const [oceanVol, setOceanVol] = useState(0);
  const [fireVol, setFireVol] = useState(0);
  const [brainwaveVol, setBrainwaveVol] = useState(0);

  // Focus Stats / Metrics
  const [focusPoints, setFocusPoints] = useState(120);
  const [totalSessions, setTotalSessions] = useState(4);
  const [streakDays] = useState(settingsStreakDays);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            auraAudio.playSynthNote(880, "triangle", 0.8); // play completion bell
            if (mode === "Work") {
              setMode("Break");
              setMinutes(shortBreak);
              setTotalSessions(prev => prev + 1);
              setFocusPoints(prev => prev + 25);
            } else {
              setMode("Work");
              setMinutes(focusDuration);
            }
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds, mode, focusDuration, shortBreak]);

  const toggleTimer = () => {
    auraAudio.init(); // ensure Web Audio Context starts
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "Work" ? focusDuration : shortBreak);
    setSeconds(0);
  };

  // Sound changes wrapper
  const handleRainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRainVol(val);
    auraAudio.setRainVolume(val);
  };

  const handleOceanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setOceanVol(val);
    auraAudio.setOceanVolume(val);
  };

  const handleFireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFireVol(val);
    auraAudio.setFireVolume(val);
  };

  const handleBrainwaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBrainwaveVol(val);
    auraAudio.setBrainwaveVolume(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Tomato Timer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
        <span className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider ${mode === "Work" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
          {mode} Mode active
        </span>

        <h3 className="text-7xl font-sans font-bold text-white mt-6 tracking-tight">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </h3>

        <p className="text-slate-400 text-xs mt-2 font-mono">
          {mode === "Work" ? "Stay focused. Compile results." : "Take a deep breath. Stand up."}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button 
            id="start-pomodoro-btn"
            onClick={toggleTimer}
            className={`p-4 rounded-full text-white transition transform hover:scale-105 shadow-xl ${isActive ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
          >
            {isActive ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
          </button>
          
          <button 
            id="reset-pomodoro-btn"
            onClick={resetTimer}
            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Focus Soundboard Mixer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Acoustic focus Mixer
          </h4>
          <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] px-2.5 py-0.5 rounded-full">
            REAL-TIME MIXER
          </span>
        </div>

        <div className="space-y-4">
          {/* Rain Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Focus Rain
              </span>
              <span className="text-slate-500 font-mono text-[10px]">{Math.round(rainVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rainVol}
              onChange={handleRainChange}
              className="w-full h-1 bg-slate-800 accent-emerald-500 rounded-lg cursor-pointer"
            />
          </div>

          {/* Ocean Waves */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Ocean Waves
              </span>
              <span className="text-slate-500 font-mono text-[10px]">{Math.round(oceanVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={oceanVol}
              onChange={handleOceanChange}
              className="w-full h-1 bg-slate-800 accent-emerald-500 rounded-lg cursor-pointer"
            />
          </div>

          {/* Crackling Fire */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Crackling Fire
              </span>
              <span className="text-slate-500 font-mono text-[10px]">{Math.round(fireVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={fireVol}
              onChange={handleFireChange}
              className="w-full h-1 bg-slate-800 accent-emerald-500 rounded-lg cursor-pointer"
            />
          </div>

          {/* Alpha Brainwaves */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Alpha Brainwaves (10Hz)
              </span>
              <span className="text-slate-500 font-mono text-[10px]">{Math.round(brainwaveVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={brainwaveVol}
              onChange={handleBrainwaveChange}
              className="w-full h-1 bg-slate-800 accent-emerald-500 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Focus Metrics Dashboard */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
            Study Analytics
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 font-mono block">XP POINTS</span>
              <span className="text-lg font-sans font-bold text-emerald-400 mt-1 block">{focusPoints}</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 font-mono block">STREAK</span>
              <span className="text-lg font-sans font-bold text-amber-500 mt-1 block">{streakDays} Days</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 font-mono block">COMPLETED</span>
              <span className="text-lg font-sans font-bold text-purple-400 mt-1 block">{totalSessions}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed font-mono space-y-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span>NEXT MILESTONE</span>
            <span className="text-emerald-400">150 XP</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5" style={{ width: "80%" }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            * Complete 1 more focus study mode block to increase your global daily ranking level.
          </p>
        </div>
      </div>
    </div>
  );
}
