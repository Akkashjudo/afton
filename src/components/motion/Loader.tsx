"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const SESSION_KEY = "afton-loader-shown";

function subscribe() {
  return () => {};
}
function getSnapshot() {
  try {
    return Boolean(window.sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}
function getServerSnapshot() {
  return false;
}

/**
 * First-visit-only intro loader.
 *
 * Deliberately CSS/`setTimeout`-driven, NOT Framer Motion / AnimatePresence:
 * an rAF-based exit animation never completes while the tab is unfocused
 * (the browser throttles requestAnimationFrame), which would leave this
 * full-screen overlay stuck on top of the site — a blank screen. `setTimeout`
 * fires regardless of focus, so `removed` is always reached and the overlay
 * is guaranteed to clear. The fade itself is a pure CSS transition.
 *
 * Skipped entirely on repeat views within a session (sessionStorage, read via
 * useSyncExternalStore so SSR and first client paint agree) and under
 * prefers-reduced-motion (handled in CSS).
 */
export function Loader() {
  const alreadyShown = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hiding, setHiding] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage unavailable — loader just replays next visit, no crash.
    }
  }, []);

  useEffect(() => {
    if (alreadyShown) return;
    const fadeTimer = setTimeout(() => setHiding(true), 1400);
    const removeTimer = setTimeout(() => setRemoved(true), 1950);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [alreadyShown]);

  const visible = !alreadyShown && !removed;

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`afton-loader${hiding ? " afton-loader--hiding" : ""}`} aria-hidden>
      <span className="afton-loader__mark">
        AFTON<span className="afton-loader__dot">.</span>
      </span>
      <div className="afton-loader__track">
        <div className="afton-loader__bar" />
      </div>
    </div>
  );
}
