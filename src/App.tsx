import { useEffect, useRef, useState } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import "./App.css";

type Status = "idle" | "running" | "done";

const isTauri = "__TAURI_INTERNALS__" in window;

const pad = (value: number) => value.toString().padStart(2, "0");

async function ensureNotificationPermission() {
  try {
    if (isTauri) {
      if (!(await isPermissionGranted())) await requestPermission();
    } else if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  } catch {
    // Notifications unavailable; the timer works without them.
  }
}

async function notifyTimeUp() {
  const title = "WorkTime";
  const body = "Time's up — session complete.";
  try {
    if (isTauri) {
      if (await isPermissionGranted()) sendNotification({ title, body });
    } else if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch {
    // Notifications unavailable; the timer works without them.
  }
}

function playChime(ctx: AudioContext) {
  const now = ctx.currentTime;
  // Calm perfect fifth: C5 then G5, each with a soft attack and long decay.
  [523.25, 783.99].forEach((frequency, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * 0.22;
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.35, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.5);
  });
}

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      setTotalSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status !== "running" || totalSeconds > 0) return;

    setStatus("done");
    if (audioRef.current) playChime(audioRef.current);
    notifyTimeUp();
  }, [status, totalSeconds]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const hours = Number(formData.get("hours")) || 0;
    const minutes = Number(formData.get("minutes")) || 0;
    const total = hours * 3600 + minutes * 60;
    if (total === 0) return;

    // AudioContext must be created during a user gesture so the chime
    // is allowed to play later, when the countdown reaches zero.
    audioRef.current ??= new AudioContext();
    audioRef.current.resume();
    ensureNotificationPermission();

    setInitialSeconds(total);
    setTotalSeconds(total);
    setStatus("running");
  };

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const progress = initialSeconds > 0 ? (totalSeconds / initialSeconds) * 100 : 0;
  const colonClass = status === "running" ? "colon colon-breathe" : "colon";

  return (
    <main className="app">
      {status === "idle" ? (
        <form key="setup" className="panel" onSubmit={handleSubmit}>
          <p className="eyebrow">worktime</p>
          <div className="fields">
            <label className="field">
              <input
                name="hours"
                type="number"
                inputMode="numeric"
                min={0}
                max={23}
                placeholder="00"
                autoFocus
              />
              <span>hours</span>
            </label>
            <span className="field-sep">:</span>
            <label className="field">
              <input
                name="minutes"
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                placeholder="00"
              />
              <span>minutes</span>
            </label>
          </div>
          <button type="submit" className="action">
            Start
          </button>
        </form>
      ) : (
        <section key="timer" className="panel">
          <p className="eyebrow">{status === "done" ? "time's up" : "focus"}</p>
          <p className={status === "done" ? "clock clock-done" : "clock"}>
            {pad(hours)}
            <span className={colonClass}>:</span>
            {pad(minutes)}
            <span className={colonClass}>:</span>
            {pad(seconds)}
          </p>
          <div className="track">
            <div className="track-fill" style={{ width: `${progress}%` }} />
          </div>
          <button className="action" onClick={() => setStatus("idle")}>
            {status === "done" ? "Start again" : "Cancel"}
          </button>
        </section>
      )}
    </main>
  );
}
