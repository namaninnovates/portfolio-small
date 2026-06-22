"use client";
import { useEffect, useRef, useState } from "react";
import HireMeModal from "@/components/HireMeModal";

// ═══════════════════════════════════════
//  PALETTE
// ═══════════════════════════════════════
const T = 'transparent';
const R = '#e83218'; // red
const S = '#fcc37e'; // skin
const B = '#7b3b00'; // brown
const L = '#3a60e8'; // blue overalls

// ═══════════════════════════════════════
//  SPRITES  — 12 cols × 14 rows, 3 px/dot
//  All frames face RIGHT by default.
//  Flip with scaleX(-1) when going left.
// ═══════════════════════════════════════
const WALK1 = [
  [T,T,T,T,R,R,R,R,R,T,T,T],
  [T,T,T,R,R,R,R,R,R,R,T,T],
  [T,T,T,B,B,B,S,S,B,B,T,T],
  [T,T,B,S,B,S,S,S,B,S,B,T],
  [T,T,B,S,S,S,S,S,S,S,B,T],
  [T,T,T,B,S,S,S,S,S,B,T,T],
  [T,T,R,R,L,R,R,L,R,R,T,T],
  [T,R,R,L,L,L,L,L,L,R,R,T],
  [T,S,S,R,L,L,L,L,R,S,S,T],
  [T,S,S,L,L,T,T,L,L,S,S,T],
  [T,T,L,L,L,T,T,L,L,L,T,T],
  [T,B,B,B,T,T,T,T,B,B,B,T],
  [B,B,B,T,T,T,T,T,T,B,B,B],
  [B,B,T,T,T,T,T,T,T,T,B,B],
];
const WALK2 = [
  [T,T,T,T,R,R,R,R,R,T,T,T],
  [T,T,T,R,R,R,R,R,R,R,T,T],
  [T,T,T,B,B,B,S,S,B,B,T,T],
  [T,T,B,S,B,S,S,S,B,S,B,T],
  [T,T,B,S,S,S,S,S,S,S,B,T],
  [T,T,T,B,S,S,S,S,S,B,T,T],
  [T,T,R,R,L,R,R,L,R,R,T,T],
  [T,R,R,L,L,L,L,L,L,R,R,T],
  [T,S,S,R,L,L,L,L,R,S,S,T],
  [T,T,S,T,L,L,L,T,S,T,T,T],
  [T,L,L,T,T,T,T,T,L,L,T,T],
  [T,B,B,B,T,T,T,B,B,B,T,T],
  [T,T,B,B,B,T,B,B,B,T,T,T],
  [T,T,T,B,B,T,B,B,T,T,T,T],
];
const JUMP_F = [
  [T,T,T,T,R,R,R,R,R,T,T,T],
  [T,T,T,R,R,R,R,R,R,R,T,T],
  [T,T,T,B,B,B,S,S,B,B,T,T],
  [T,T,B,S,B,S,S,S,B,S,B,T],
  [T,T,B,S,S,S,S,S,S,S,B,T],
  [T,T,T,B,S,S,S,S,S,B,T,T],
  [R,R,R,L,R,R,L,R,R,L,R,R], // arms wide
  [T,R,L,L,L,L,L,L,L,L,R,T],
  [T,L,L,L,L,L,L,L,L,L,T,T],
  [T,T,L,L,L,T,T,L,L,T,T,T],
  [T,T,T,L,L,T,T,L,L,T,T,T],
  [T,T,B,B,T,T,T,T,B,B,T,T],
  [T,B,B,T,T,T,T,T,T,B,B,T],
  [T,B,T,T,T,T,T,T,T,T,B,T],
];

const PX = 3;
const SPRITE_H = 14 * PX; // 42px

function MarioSprite({ frame }) {
  const data = [WALK1, WALK2, JUMP_F][frame] ?? WALK1;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${data[0].length}, ${PX}px)`,
      gridTemplateRows: `repeat(${data.length}, ${PX}px)`,
      imageRendering: 'pixelated',
    }}>
      {data.map((row, ri) =>
        row.map((color, ci) => (
          <div key={`${ri}-${ci}`} style={{ background: color, width: PX, height: PX }} />
        ))
      )}
    </div>
  );
}

// Green warp pipe
function Pipe() {
  return (
    <div style={{ width: 28, height: 40, position: 'relative', flexShrink: 0 }}>
      <div style={{
        position:'absolute', top:0, left:-4, right:-4, height:13,
        background:'#00c800', border:'2px solid #004400', borderRadius:3,
      }}/>
      <div style={{
        position:'absolute', top:11, left:1, right:1, bottom:0,
        background:'#00a000', border:'2px solid #004400',
      }}/>
    </div>
  );
}

// Coin that arcs upward
function Coin({ x, onDone }) {
  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{ left: x - 7, bottom: '110%', animation: 'coinArc 0.55s ease-out forwards' }}
      onAnimationEnd={onDone}
    >
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #ffe066, #e8a000)',
        border: '2px solid #b87800',
        boxShadow: '0 0 8px #ffe06688',
      }}/>
    </div>
  );
}

// Pipe positions (relative to navbar width)
const PIPES = [
  { relX: 0.30 }, // left pipe — more towards center
  { relX: 0.88 }, // right pipe — before hire me
];

export default function Navbar() {
  const navRef    = useRef(null);
  const linkRefs  = useRef([]);
  const rafRef    = useRef(null);
  const marioRef  = useRef(null); // direct DOM ref — bypasses React batching for instant direction flip

  // Physics state lives in a ref (no re-renders needed inside the loop)
  const phys = useRef({
    x: -50, y: 0, vy: 0,
    dir: 1, speed: 2.8,
    jumping: false,
    frame: 0, tick: 0,
  });

  const tabCooldowns = useRef([false, false, false]);
  const [tabBumps, setTabBumps] = useState([false, false, false]);
  const [coins, setCoins]       = useState([]);
  const [display, setDisplay]   = useState({ x: -50, y: 0, frame: 0, dir: 1 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHireMeOpen, setIsHireMeOpen] = useState(false);

  const spawnCoin = (absX) => {
    setCoins(prev => [...prev, { id: Date.now() + Math.random(), x: absX }]);
  };
  const removeCoin = (id) => setCoins(prev => prev.filter(c => c.id !== id));

  useEffect(() => {
    const s = phys.current;
    const GRAVITY   = 0.72;
    const JUMP_TAB  = -7.5;  // small realistic hop to head-butt a tab
    const JUMP_PIPE = -10;   // bigger leap to clear pipe
    const TRIG_TAB  = 32;    // start jump 32px before tab center (tighter = more accurate hit)
    const TRIG_PIPE = 52;

    // Tracks which tab triggered the current jump (for coin timing)
    let pendingCoinTabIdx = -1;
    let wasNegativeVy = false; // tracks if we were still going up

    function getTabXs() {
      if (!navRef.current) return [];
      const nr = navRef.current.getBoundingClientRect();
      return linkRefs.current.map(el => {
        if (!el || el.offsetParent === null) return -999; // Check if hidden
        const r = el.getBoundingClientRect();
        return r.left - nr.left + r.width / 2;
      });
    }

    function loop() {
      const navW   = navRef.current?.offsetWidth ?? 900;
      const pipeXs = PIPES.map(p => p.relX * navW);
      const tabXs  = getTabXs();

      // Move Mario
      s.x += s.speed * s.dir;
      if (s.x > navW + 10) { s.dir = -1; }
      if (s.x < -50)        { s.dir =  1; }

      // ── TAB HIT CHECK (only on ground) ──────────────────
      if (!s.jumping && s.y === 0) {
        for (let i = 0; i < tabXs.length; i++) {
          if (tabXs[i] < 0) continue; // Skip hidden tabs
          const dist = (tabXs[i] - s.x) * s.dir;
          if (dist > 0 && dist < TRIG_TAB && !tabCooldowns.current[i]) {
            s.jumping   = true;
            s.vy        = JUMP_TAB;
            wasNegativeVy = true;
            pendingCoinTabIdx = i;
            tabCooldowns.current[i] = true;

            // Bump tab up immediately when jump starts
            const idx = i;
            setTabBumps(prev => { const n=[...prev]; n[idx]=true; return n; });
            setTimeout(() => setTabBumps(prev => { const n=[...prev]; n[idx]=false; return n; }), 160);

            // Reset cooldown after 3s
            setTimeout(() => { tabCooldowns.current[idx] = false; }, 3000);
            break;
          }
        }
      }

      // ── PIPE JUMP CHECK ─────────────────────────────────
      if (!s.jumping && s.y === 0) {
        for (const px of pipeXs) {
          const dist = (px - s.x) * s.dir;
          if (dist > 0 && dist < TRIG_PIPE) {
            s.jumping = true;
            s.vy      = JUMP_PIPE;
            wasNegativeVy = true;
            break;
          }
        }
      }

      // ── GRAVITY / PHYSICS ───────────────────────────────
      if (s.jumping || s.y < 0) {
        const prevVy = s.vy;
        s.vy += GRAVITY;
        s.y  += s.vy;

        // ── COIN SPAWN: exact moment vy crosses 0 (peak of arc) ──
        // This is the frame Mario's head is highest = hits the block
        if (pendingCoinTabIdx >= 0 && prevVy < 0 && s.vy >= 0) {
          const coinTabIdx = pendingCoinTabIdx;
          pendingCoinTabIdx = -1;
          // Spawn coin at the tab's x position
          const tabX = tabXs[coinTabIdx];
          if (tabX > 0) spawnCoin(tabX);
        }

        if (s.y >= 0) { s.y = 0; s.vy = 0; s.jumping = false; wasNegativeVy = false; }
      }

      // ── WALK ANIMATION ──────────────────────────────────
      if (s.jumping) {
        s.frame = 2;
      } else {
        s.tick++;
        if (s.tick % 8 === 0) s.frame = s.frame === 0 ? 1 : 0;
      }

      // ── DIRECT DOM TRANSFORM (no React state lag) ───────
      // Writing transform directly to DOM ensures direction flip
      // is applied EVERY frame in sync with movement.
      if (marioRef.current) {
        marioRef.current.style.transform =
          `translateX(${s.x}px) translateY(${s.y}px) scaleX(${s.dir})`;
      }

      // Only use React state for the sprite frame (lower frequency, OK to batch)
      setDisplay(prev =>
        prev.frame !== s.frame ? { ...prev, frame: s.frame } : prev
      );
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const NAV_LINKS = ['Work', 'About', 'Contact'];

      {/* Mobile Menu Popup */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] right-4 z-40 bg-background border-4 border-on-background neo-shadow p-6 flex flex-col items-stretch gap-4 md:hidden w-64">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-on-background font-display-xl text-3xl hover:text-cobalt transition-all duration-150 uppercase bg-primary-container px-6 py-2 border-4 border-on-background neo-shadow text-center rotate-1"
            >
              {label}
            </a>
          ))}
          <button 
            className="mt-2 bg-secondary text-on-secondary border-4 border-on-background px-6 py-3 font-headline-md text-2xl uppercase neo-shadow transition-all duration-150 -rotate-2 text-center"
            onClick={() => { setIsMobileMenuOpen(false); setIsHireMeOpen(true); }}
          >
            Hire Me
          </button>
        </div>
      )}

      <header
        className="w-full top-0 sticky z-50 bg-background border-b-4 border-on-background shadow-[8px_8px_0px_0px_#000000]"
        style={{ overflowX: 'clip', overflowY: 'visible' }}
      >
        <nav
          ref={navRef}
          className="relative flex justify-between items-end md:items-end items-center w-full px-margin-mobile md:px-margin-desktop py-gutter max-w-full"
          style={{ minHeight: 64, overflowX: 'clip', overflowY: 'visible' }}
        >
          {/* ── Pipes ─────────────────────────────────────── */}
          {PIPES.map((p, i) => (
            <div
              key={i}
              className="absolute bottom-0 pointer-events-none z-10"
              style={{ left: `${p.relX * 100}%`, transform: 'translateX(-50%)' }}
            >
              <Pipe />
            </div>
          ))}

          {/* ── Mario ───────────────────────────── */}
          <div
            ref={marioRef}
            className="absolute bottom-0 left-0 pointer-events-none z-20"
            style={{ willChange: 'transform', transformOrigin: 'left bottom' }}
          >
            <MarioSprite frame={display.frame} />
          </div>

          {/* ── Logo ────────────────────────────────────── */}
          <a
            className="font-display-xl-mobile text-2xl md:text-display-xl-mobile text-secondary-container -rotate-3 hover:rotate-0 transition-transform z-30 relative pb-1"
            href="#"
          >
            IAMNAMANG
          </a>

          {/* ── Nav links (hit blocks) ──────────────────── */}
          <div className="hidden md:flex items-end gap-16 z-30 relative pb-3">
            {NAV_LINKS.map((label, i) => (
              <div key={label} className="relative flex flex-col items-center">
                {/* Coins pop out above their specific tab */}
                {coins.map(coin => {
                  if (!navRef.current || !linkRefs.current[i]) return null;
                  const nr = navRef.current.getBoundingClientRect();
                  const er = linkRefs.current[i].getBoundingClientRect();
                  const cx = er.left - nr.left + er.width / 2;
                  if (Math.abs(coin.x - cx) > 28) return null;
                  return (
                    <Coin key={coin.id} x={er.width / 2} onDone={() => removeCoin(coin.id)} />
                  );
                })}

                <a
                  ref={el => linkRefs.current[i] = el}
                  href={`#${label.toLowerCase()}`}
                  className="text-on-background font-label-mono text-label-mono hover:scale-110 hover:-rotate-2 transition-colors duration-150 pb-1"
                  style={{
                    display: 'inline-block',
                    transform: tabBumps[i] ? 'translateY(-5px)' : 'translateY(0)',
                    transition: 'transform 0.1s ease-out',
                  }}
                >
                  {label}
                </a>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 z-30 relative mb-1">
            {/* ── Hire Me ─────────────────────────────────── */}
            <button 
              onClick={() => setIsHireMeOpen(true)}
              className="hidden md:block bg-primary-container text-on-background border-4 border-on-background px-6 py-2 font-label-mono text-label-mono uppercase neo-shadow neo-shadow-hover transition-all duration-150 rotate-2"
            >
              Hire Me
            </button>

            {/* ── Mobile Toggle ────────────────────────────── */}
            <button 
              className="md:hidden bg-secondary-container text-on-secondary border-4 border-on-background p-2 w-12 h-12 flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary transition-all rotate-3"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined font-bold">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>
      </header>

      <HireMeModal isOpen={isHireMeOpen} onClose={() => setIsHireMeOpen(false)} />
    </>
  );
}
