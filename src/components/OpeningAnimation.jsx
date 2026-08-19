import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Cinematic boot sequence, matching the brief's 12-beat spec:
 * dark particle sky -> trident appears -> rotates with glowing energy ->
 * lightning surrounds it -> accelerates down -> hits the ground with force ->
 * ground shatters with debris/dust -> energy wave spreads -> screen flashes ->
 * broken ground transforms into the CRM interface -> smooth transition -> login.
 *
 * Phases:
 * 0 sky + ambient        1 descent + lightning      2 impact + camera shake
 * 3 shatter + debris      4 energy wave spreads       5 screen flash
 * 6 ground -> UI morph    7 exit
 */
const BOOT_LOG = [
  'Forging secure session…',
  'Summoning CRM core…',
  'Calibrating dashboards…',
  'Establishing access control…',
  'Trishul CRM ready.',
]

export default function OpeningAnimation({ onDone }) {
  const [phase, setPhase] = useState(0)
  const [logIndex, setLogIndex] = useState(0)

  const debris = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        id: i,
        angle: (i / 46) * Math.PI * 2 + Math.random() * 0.3,
        dist: 220 + Math.random() * 340,
        size: 2 + Math.random() * 5,
        shape: i % 3 === 0 ? 'tri' : 'dot',
        color: i % 2 ? 'var(--gold)' : i % 3 ? 'var(--azure)' : 'var(--ember)',
        delay: Math.random() * 0.15,
        spin: Math.random() * 540 - 270,
      })),
    []
  )

  const cracks = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.25
        const len = 90 + Math.random() * 70
        const jag = 18 + Math.random() * 14
        const x1 = Math.cos(angle) * 20
        const y1 = Math.sin(angle) * 10 + 8
        const xm = Math.cos(angle + 0.15) * (len * 0.55)
        const ym = Math.sin(angle + 0.15) * (len * 0.3) + jag
        const x2 = Math.cos(angle - 0.1) * len
        const y2 = Math.sin(angle - 0.1) * (len * 0.5) + jag * 1.6
        return { id: i, d: `M ${x1} ${y1} Q ${xm} ${ym} ${x2} ${y2}` }
      }),
    []
  )

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 450), // trident begins descent
      setTimeout(() => setPhase(2), 1950), // impact
      setTimeout(() => setPhase(3), 2200), // shatter/debris
      setTimeout(() => setPhase(4), 2950), // energy wave
      setTimeout(() => setPhase(5), 3550), // flash
      setTimeout(() => setPhase(6), 3850), // morph to UI
      setTimeout(() => setPhase(7), 4650), // exit
      setTimeout(() => onDone(), 5150),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  useEffect(() => {
    const step = setInterval(() => setLogIndex((i) => Math.min(i + 1, BOOT_LOG.length - 1)), 950)
    return () => clearInterval(step)
  }, [])

  const shake = phase === 2

  return (
    <AnimatePresence>
      {phase < 7 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-hidden bg-[#020308] flex items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={shake ? { x: [0, -10, 9, -7, 5, -3, 0], y: [0, 6, -5, 4, -2, 1, 0] } : { x: 0, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* starfield */}
            <div className="absolute inset-0">
              {Array.from({ length: 70 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ opacity: [0.1, 0.9, 0.1] }}
                  transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
            </div>

            {/* ambient glow, intensifies through the sequence */}
            <motion.div
              className="absolute w-[1000px] h-[1000px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(242,169,59,0.18), transparent 62%)' }}
              animate={{
                scale: phase >= 3 ? 1.5 : phase >= 1 ? 1.1 : 0.9,
                opacity: phase >= 5 ? 0 : phase >= 3 ? 1 : 0.7,
              }}
              transition={{ duration: 0.7 }}
            />

            {/* jagged lightning bolts during descent */}
            {phase === 1 && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {[
                  'M 30 0 L 26 22 L 34 24 L 22 55',
                  'M 68 0 L 73 18 L 65 20 L 72 48',
                  'M 45 0 L 42 15 L 50 17 L 44 40',
                ].map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    stroke={i % 2 ? 'var(--gold)' : 'var(--azure)'}
                    strokeWidth="0.35"
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: [0, 1, 0, 0.8, 0], pathLength: 1 }}
                    transition={{ duration: 0.9, delay: i * 0.18, times: [0, 0.15, 0.35, 0.5, 1] }}
                    style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                  />
                ))}
              </svg>
            )}

            {/* motion-trail afterimages during descent */}
            {phase === 1 &&
              [0.18, 0.11].map((op, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ filter: 'blur(3px)' }}
                  initial={{ y: '-62vh', opacity: 0, scale: 0.7 }}
                  animate={{ y: '0vh', opacity: op, scale: 1, rotate: 360 }}
                  transition={{ duration: 1.5, delay: i * 0.08, ease: [0.6, 0.05, 0.9, 0.4] }}
                >
                  <TridentGlyph />
                </motion.div>
              ))}

            {/* the trident itself */}
            {phase < 3 && (
              <motion.div
                className="relative z-10"
                initial={{ y: '-62vh', rotate: -8, opacity: 0, scale: 0.55 }}
                animate={
                  phase === 0
                    ? { y: '-62vh', opacity: 1, scale: 0.65, rotate: [-6, 6, -6] }
                    : phase === 1
                    ? { y: '0vh', opacity: 1, scale: 1, rotate: 360 }
                    : { y: '0vh', opacity: 1, scale: [1, 1.2, 0.92], rotate: 360 }
                }
                transition={
                  phase === 0
                    ? { rotate: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }
                    : phase === 1
                    ? { duration: 1.5, ease: [0.6, 0.05, 0.9, 0.4] }
                    : { duration: 0.3, ease: 'easeOut' }
                }
              >
                <TridentGlyph active={phase === 0} />
              </motion.div>
            )}

            {/* impact shockwave rings */}
            {phase >= 2 && phase < 6 && (
              <>
                <motion.div
                  className="absolute rounded-full border-2"
                  style={{ borderColor: 'var(--gold)' }}
                  initial={{ width: 10, height: 10, opacity: 0.95 }}
                  animate={{ width: 1500, height: 1500, opacity: 0 }}
                  transition={{ duration: 1.3, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute rounded-full border"
                  style={{ borderColor: 'var(--azure)' }}
                  initial={{ width: 10, height: 10, opacity: 0.7 }}
                  animate={{ width: 1100, height: 1100, opacity: 0 }}
                  transition={{ duration: 1.1, delay: 0.12, ease: 'easeOut' }}
                />
              </>
            )}

            {/* ground cracks radiating from impact point */}
            {phase >= 2 && phase < 6 && (
              <svg className="absolute" width="600" height="260" viewBox="-100 -20 200 140" style={{ overflow: 'visible' }}>
                {cracks.map((c) => (
                  <motion.path
                    key={c.id}
                    d={c.d}
                    stroke="var(--gold)"
                    strokeWidth="0.8"
                    fill="none"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(242,169,59,0.6))' }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: phase >= 5 ? 0 : 0.85 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                  />
                ))}
              </svg>
            )}

            {/* debris + dust burst */}
            {phase >= 3 && phase < 6 && (
              <div className="absolute inset-0">
                {debris.map((d) => (
                  <motion.span
                    key={d.id}
                    className="absolute left-1/2 top-1/2 block"
                    style={
                      d.shape === 'tri'
                        ? {
                            width: 0,
                            height: 0,
                            borderLeft: `${d.size}px solid transparent`,
                            borderRight: `${d.size}px solid transparent`,
                            borderBottom: `${d.size * 1.6}px solid ${d.color}`,
                          }
                        : { width: d.size, height: d.size, background: d.color, borderRadius: 2 }
                    }
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      x: Math.cos(d.angle) * d.dist,
                      y: Math.sin(d.angle) * d.dist * 0.55 - 40,
                      opacity: 0,
                      rotate: d.spin,
                    }}
                    transition={{ duration: 1.1, delay: d.delay, ease: 'easeOut' }}
                  />
                ))}
                {/* dust cloud */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.span
                    key={`dust-${i}`}
                    className="absolute left-1/2 top-1/2 rounded-full"
                    style={{ width: 40 + i * 6, height: 40 + i * 6, background: 'rgba(180,150,110,0.10)', filter: 'blur(6px)' }}
                    initial={{ x: -20, y: 0, opacity: 0, scale: 0.4 }}
                    animate={{ x: (i - 5) * 26, y: 10 - i * 2, opacity: [0, 0.5, 0], scale: 1.4 }}
                    transition={{ duration: 1.4, delay: 0.1 + i * 0.03, ease: 'easeOut' }}
                  />
                ))}
              </div>
            )}

            {/* screen flash */}
            <AnimatePresence>
              {phase === 5 && (
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            {/* ground -> CRM interface morph */}
            {phase >= 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(242,169,59,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,59,0.10) 1px, transparent 1px)',
                    backgroundSize: '42px 42px',
                  }}
                  initial={{ opacity: 0, scale: 1.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="relative flex flex-col items-center gap-3"
                >
                  <TridentGlyph small />
                  <div className="font-display text-2xl font-bold tracking-wide">
                    TRISHUL <span className="ember-text">CRM</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* ground line */}
          <div className="absolute bottom-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(242,169,59,0.35)] to-transparent" />

          {/* boot log ticker */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-[11px] font-mono text-[var(--muted)] tracking-wide">
            <AnimatePresence mode="wait">
              <motion.span
                key={logIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {BOOT_LOG[logIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* progress bar */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--ember)]"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, (phase / 6) * 100)}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <button
            onClick={onDone}
            className="absolute bottom-6 right-6 text-xs text-[var(--muted)] hover:text-[var(--gold)] transition-colors font-mono tracking-wide"
          >
            skip intro →
          </button>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.35em] text-[var(--muted-2)] font-mono uppercase">
            Trishul CRM
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TridentGlyph({ active, small }) {
  const size = small ? { w: 60, h: 78 } : { w: 120, h: 160 }
  return (
    <motion.svg
      width={size.w} height={size.h} viewBox="0 0 120 160"
      style={{ filter: `drop-shadow(0 0 ${active ? 30 : 22}px rgba(242,169,59,0.7))` }}
    >
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe4a8" />
          <stop offset="45%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--ember)" />
        </linearGradient>
        <radialGradient id="tgGlow" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="rgba(255,230,180,0.9)" />
          <stop offset="100%" stopColor="rgba(255,230,180,0)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="35" r="34" fill="url(#tgGlow)" opacity={active ? 0.85 : 0.5} />
      <path d="M60 20 L60 150" stroke="url(#tg)" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 15 C30 45 45 55 60 60 C75 55 90 45 90 15" stroke="url(#tg)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M60 5 L60 60" stroke="url(#tg)" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 140 L80 140" stroke="url(#tg)" strokeWidth="6" strokeLinecap="round" />
      {/* prong tips */}
      <circle cx="30" cy="15" r="2.4" fill="#ffe4a8" />
      <circle cx="60" cy="5" r="2.4" fill="#ffe4a8" />
      <circle cx="90" cy="15" r="2.4" fill="#ffe4a8" />
    </motion.svg>
  )
}
