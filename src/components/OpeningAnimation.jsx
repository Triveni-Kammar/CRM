import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LOG = [
  'Forging secure session\u2026',
  'Summoning CRM core\u2026',
  'Calibrating dashboards\u2026',
  'Establishing access control\u2026',
  'Trishul CRM ready.',
]

export default function OpeningAnimation({ onDone }) {
  const [phase, setPhase] = useState(-1) // -1 = waiting for user interaction
  const [logIndex, setLogIndex] = useState(0)

  const debris = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        angle: (i / 60) * Math.PI * 2 + Math.random() * 0.3,
        dist: 180 + Math.random() * 380,
        size: 2 + Math.random() * 6,
        shape: i % 3 === 0 ? 'tri' : 'dot',
        color: i % 3 === 0 ? '#f2a93b' : i % 3 === 1 ? '#3e7bfa' : '#ff7a1a',
        delay: Math.random() * 0.2,
        spin: Math.random() * 720 - 360,
      })),
    []
  )

  const cracks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3
        const len = 80 + Math.random() * 90
        const jag = 16 + Math.random() * 18
        const x1 = Math.cos(angle) * 18, y1 = Math.sin(angle) * 8 + 6
        const xm = Math.cos(angle + 0.18) * (len * 0.5)
        const ym = Math.sin(angle + 0.18) * (len * 0.28) + jag
        const x2 = Math.cos(angle - 0.12) * len
        const y2 = Math.sin(angle - 0.12) * (len * 0.48) + jag * 1.8
        return { id: i, d: `M ${x1} ${y1} Q ${xm} ${ym} ${x2} ${y2}` }
      }),
    []
  )

  /* SOUND ENGINE */
  useEffect(() => {
    if (phase === -1) return // Don't start audio until user clicks

    let ctx
    try { ctx = new (window.AudioContext || window.webkitAudioContext)() }
    catch (_) { return }

    // Resume context if it's suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume()

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.75, ctx.currentTime)
    master.connect(ctx.destination)

    const rbBuf = ctx.createBuffer(2, ctx.sampleRate * 2.5, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = rbBuf.getChannelData(ch)
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2)
    }
    const reverb = ctx.createConvolver(); reverb.buffer = rbBuf
    const revG = ctx.createGain(); revG.gain.value = 0.32
    reverb.connect(revG); revG.connect(master)
    const wet = (n) => { n.connect(master); n.connect(reverb) }

    /* 1) DIVINE WHOOSH */
    const whoosh = (when) => {
      const len = ctx.sampleRate * 2
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.3)
      const src = ctx.createBufferSource(); src.buffer = buf
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.5
      bp.frequency.setValueAtTime(2800, when)
      bp.frequency.exponentialRampToValueAtTime(80, when + 1.8)
      const g = ctx.createGain(); g.gain.setValueAtTime(1.0, when); g.gain.exponentialRampToValueAtTime(0.001, when + 2)
      src.connect(bp); bp.connect(g); wet(g); src.start(when)
      /* high air layer */
      const buf2 = ctx.createBuffer(1, len, ctx.sampleRate)
      const d2 = buf2.getChannelData(0)
      for (let i = 0; i < len; i++) d2[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.0)
      const src2 = ctx.createBufferSource(); src2.buffer = buf2
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000
      const g2 = ctx.createGain(); g2.gain.setValueAtTime(0.45, when + 0.08); g2.gain.exponentialRampToValueAtTime(0.001, when + 1.6)
      src2.connect(hp); hp.connect(g2); g2.connect(master); src2.start(when + 0.08)
    }

    /* 2) LIGHTNING CRACKLE */
    const crackle = (when) => {
      for (let c = 0; c < 5; c++) {
        const offset = c * 0.2
        const len = ctx.sampleRate * 0.12
        const buf = ctx.createBuffer(1, len, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (i < 300 ? 1 : Math.pow(1 - i / len, 3.5))
        const src = ctx.createBufferSource(); src.buffer = buf
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2000
        const g = ctx.createGain(); g.gain.setValueAtTime(0.7, when + offset)
        src.connect(hp); hp.connect(g); wet(g); src.start(when + offset)
      }
    }

    /* 3) THUNDEROUS IMPACT */
    const impact = (when) => {
      /* sub-bass BOOM */
      const boom = ctx.createOscillator(); const boomG = ctx.createGain()
      boom.type = 'sine'
      boom.frequency.setValueAtTime(90, when); boom.frequency.exponentialRampToValueAtTime(20, when + 1.0)
      boomG.gain.setValueAtTime(3.0, when); boomG.gain.exponentialRampToValueAtTime(0.001, when + 1.1)
      boom.connect(boomG); wet(boomG); boom.start(when); boom.stop(when + 1.2)
      /* noise crack */
      const cLen = ctx.sampleRate * 0.4
      const cBuf = ctx.createBuffer(1, cLen, ctx.sampleRate)
      const cD = cBuf.getChannelData(0)
      for (let i = 0; i < cLen; i++) cD[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / cLen, 2.8)
      const cSrc = ctx.createBufferSource(); cSrc.buffer = cBuf
      const cBp = ctx.createBiquadFilter(); cBp.type = 'bandpass'; cBp.frequency.value = 700; cBp.Q.value = 0.5
      const cG = ctx.createGain(); cG.gain.setValueAtTime(2.2, when); cG.gain.exponentialRampToValueAtTime(0.001, when + 0.45)
      cSrc.connect(cBp); cBp.connect(cG); wet(cG); cSrc.start(when)
      /* metallic RING of trishul */
      const ring = ctx.createOscillator(); const ringG = ctx.createGain()
      ring.type = 'triangle'; ring.frequency.setValueAtTime(520, when); ring.frequency.exponentialRampToValueAtTime(200, when + 1.4)
      ringG.gain.setValueAtTime(0.9, when); ringG.gain.exponentialRampToValueAtTime(0.001, when + 1.8)
      ring.connect(ringG); wet(ringG); ring.start(when); ring.stop(when + 2)
      /* high snap */
      const snapBuf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
      const sD = snapBuf.getChannelData(0)
      for (let i = 0; i < sD.length; i++) sD[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sD.length, 4)
      const snap = ctx.createBufferSource(); snap.buffer = snapBuf
      const hp3 = ctx.createBiquadFilter(); hp3.type = 'highpass'; hp3.frequency.value = 5000
      const g3 = ctx.createGain(); g3.gain.setValueAtTime(1.6, when)
      snap.connect(hp3); hp3.connect(g3); g3.connect(master); snap.start(when)
      /* ground rumble */
      const rum = ctx.createOscillator(); const rumG = ctx.createGain()
      rum.type = 'sawtooth'; rum.frequency.value = 26
      rumG.gain.setValueAtTime(0, when + 0.06); rumG.gain.linearRampToValueAtTime(1.8, when + 0.25)
      rumG.gain.exponentialRampToValueAtTime(0.001, when + 1.6)
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 110
      rum.connect(lp); lp.connect(rumG); wet(rumG); rum.start(when + 0.06); rum.stop(when + 1.7)
    }

    /* 4) DIVINE ENERGY HUM */
    const hum = (when) => {
      [55, 110, 165, 220, 275, 330].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const g = ctx.createGain()
        osc.type = i < 2 ? 'sine' : 'triangle'
        osc.frequency.value = freq
        g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.6 / (i + 1), when + 0.5)
        g.gain.setValueAtTime(0.6 / (i + 1), when + 0.9); g.gain.exponentialRampToValueAtTime(0.001, when + 2.5)
        osc.connect(g); wet(g); osc.start(when); osc.stop(when + 2.8)
      })
      const sh = ctx.createOscillator(); const shG = ctx.createGain()
      sh.type = 'sine'; sh.frequency.setValueAtTime(1100, when); sh.frequency.linearRampToValueAtTime(1760, when + 1.2)
      shG.gain.setValueAtTime(0, when); shG.gain.linearRampToValueAtTime(0.22, when + 0.3)
      shG.gain.exponentialRampToValueAtTime(0.001, when + 2)
      sh.connect(shG); wet(shG); sh.start(when); sh.stop(when + 2.2)
    }

    /* 5) ELECTRIC FLASH ZAP */
    const zap = (when) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain()
      osc.type = 'square'; osc.frequency.setValueAtTime(2200, when); osc.frequency.exponentialRampToValueAtTime(150, when + 0.1)
      g.gain.setValueAtTime(1.2, when); g.gain.exponentialRampToValueAtTime(0.001, when + 0.14)
      osc.connect(g); g.connect(master); osc.start(when); osc.stop(when + 0.18)
    }

    const now = ctx.currentTime
    whoosh(now + 0.5)
    crackle(now + 0.95)
    impact(now + 1.95)
    hum(now + 2.1)
    zap(now + 3.55)

    return () => { try { ctx.close() } catch (_) {} }
  }, [phase]) // Rerun when phase changes from -1 to 0

  useEffect(() => {
    if (phase === -1) return

    const t = [
      setTimeout(() => setPhase(1), 450),
      setTimeout(() => setPhase(2), 1950),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 2950),
      setTimeout(() => setPhase(5), 3550),
      setTimeout(() => setPhase(6), 3850),
      setTimeout(() => setPhase(7), 4650),
      setTimeout(() => onDone(), 5150),
    ]
    return () => t.forEach(clearTimeout)
  }, [phase, onDone])

  useEffect(() => {
    if (phase === -1) return
    const s = setInterval(() => setLogIndex((i) => Math.min(i + 1, BOOT_LOG.length - 1)), 950)
    return () => clearInterval(s)
  }, [phase])

  const shake = phase === 2

  return (
    <AnimatePresence>
      {phase < 7 && (
        <motion.div exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 overflow-hidden bg-[#010206] flex items-center justify-center">
          
          {phase === -1 && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#010206]/80 backdrop-blur-sm">
              <div className="mb-8 flex items-center gap-3">
                <TrishulSVG small active={false} />
              </div>
              <button
                onClick={() => setPhase(0)}
                className="px-8 py-3.5 rounded-xl border border-[rgba(242,169,59,0.4)] text-[var(--gold)] font-mono tracking-widest text-sm hover:bg-[rgba(242,169,59,0.15)] hover:scale-105 active:scale-95 transition-all"
                style={{ boxShadow: '0 0 20px rgba(242,169,59,0.1)' }}
              >
                INITIALIZE SYSTEM
              </button>
            </div>
          )}

          <motion.div className="absolute inset-0 flex items-center justify-center"
            animate={shake ? { x: [0,-14,12,-9,6,-4,0], y: [0,8,-7,5,-3,1,0] } : { x:0, y:0 }}
            transition={{ duration: 0.55 }}>

            {/* starfield */}
            <div className="absolute inset-0">
              {Array.from({ length: 90 }).map((_, i) => (
                <motion.span key={i} className="absolute rounded-full bg-white"
                  style={{ width: Math.random()*2.5+0.5, height: Math.random()*2.5+0.5,
                    left: Math.random()*100+'%', top: Math.random()*100+'%' }}
                  animate={{ opacity: [0.08, 0.95, 0.08] }}
                  transition={{ duration: 2+Math.random()*3.5, repeat: Infinity, delay: Math.random()*3 }} />
              ))}
            </div>

            {/* gold ambient glow */}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ width:900, height:900,
                background:'radial-gradient(circle, rgba(242,169,59,0.22) 0%, rgba(255,122,26,0.08) 40%, transparent 70%)' }}
              animate={{ scale: phase>=3?2.2:phase>=1?1.3:0.85, opacity: phase>=5?0:1 }}
              transition={{ duration:0.8 }} />
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ width:600, height:600,
                background:'radial-gradient(circle, rgba(62,123,250,0.12) 0%, transparent 65%)' }}
              animate={{ scale: phase>=2?1.8:0.6, opacity: phase>=5?0:phase>=2?0.9:0.3 }}
              transition={{ duration:0.6 }} />

            {/* lightning */}
            {phase === 1 && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {[
                  { d:'M 22 0 L 18 18 L 26 21 L 14 52', c:'#f2a93b' },
                  { d:'M 74 0 L 79 15 L 70 18 L 78 46', c:'#3e7bfa' },
                  { d:'M 46 0 L 43 13 L 52 15 L 45 38', c:'#fff4c0' },
                  { d:'M 35 0 L 30 10 L 38 13 L 28 32', c:'#ff7a1a' },
                  { d:'M 62 0 L 67 16 L 58 18 L 65 42', c:'#f2a93b' },
                ].map(({ d, c }, i) => (
                  <motion.path key={i} d={d} stroke={c} strokeWidth="0.4" fill="none" strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ opacity:0, pathLength:0 }}
                    animate={{ opacity:[0,1,0,0.9,0], pathLength:1 }}
                    transition={{ duration:0.8, delay:i*0.14, times:[0,0.12,0.3,0.5,1] }}
                    style={{ filter: 'drop-shadow(0 0 8px '+c+')' }} />
                ))}
              </svg>
            )}

            {/* motion trails */}
            {phase === 1 && [0.2,0.12,0.06].map((op, i) => (
              <motion.div key={i} className="absolute" style={{ filter: 'blur('+(i+1)*3+'px)' }}
                initial={{ y:'-65vh', opacity:0, scale:0.6 }}
                animate={{ y:'0vh', opacity:op, scale:1 }}
                transition={{ duration:1.5, delay:i*0.1, ease:[0.6,0.05,0.9,0.4] }}>
                <TrishulSVG />
              </motion.div>
            ))}

            {/* main Trishul */}
            {phase < 3 && (
              <motion.div className="relative z-10"
                initial={{ y:'-65vh', rotate:-10, opacity:0, scale:0.5 }}
                animate={
                  phase===0 ? { y:'-65vh', opacity:1, scale:0.7, rotate:[-8,8,-8] }
                  : phase===1 ? { y:'0vh', opacity:1, scale:1, rotate:0 }
                  : { y:'0vh', opacity:1, scale:[1,1.28,0.9], rotate:0 }
                }
                transition={
                  phase===0 ? { rotate:{ duration:2, repeat:Infinity, ease:'easeInOut' } }
                  : phase===1 ? { duration:1.5, ease:[0.6,0.05,0.95,0.4] }
                  : { duration:0.28, ease:'easeOut' }
                }>
                <TrishulSVG active={phase===0} />
              </motion.div>
            )}

            {/* shockwave rings */}
            {phase>=2 && phase<6 && (
              <>
                {[
                  { c:'#f2a93b', w:1600, dur:1.2 },
                  { c:'#3e7bfa', w:1200, dur:1.0, dl:0.12 },
                  { c:'#ff7a1a', w:800,  dur:0.8, dl:0.24 },
                ].map((r,i) => (
                  <motion.div key={i} className="absolute rounded-full"
                    style={{ border:(i===0?'2px':'1px')+' solid '+r.c, boxShadow:'0 0 24px '+r.c+'44' }}
                    initial={{ width:8, height:8, opacity:1 }}
                    animate={{ width:r.w, height:r.w, opacity:0 }}
                    transition={{ duration:r.dur, delay:r.dl||0, ease:'easeOut' }} />
                ))}
              </>
            )}

            {/* cracks */}
            {phase>=2 && phase<6 && (
              <svg className="absolute" width="700" height="320" viewBox="-120 -30 240 170" style={{ overflow:'visible' }}>
                {cracks.map((c) => (
                  <motion.path key={c.id} d={c.d} stroke="#f2a93b" strokeWidth="0.9" fill="none" strokeLinecap="round"
                    style={{ filter:'drop-shadow(0 0 5px rgba(242,169,59,0.75))' }}
                    initial={{ pathLength:0, opacity:0 }}
                    animate={{ pathLength:1, opacity: phase>=5?0:0.9 }}
                    transition={{ duration:0.4, delay:0.04 }} />
                ))}
              </svg>
            )}

            {/* debris */}
            {phase>=3 && phase<6 && (
              <div className="absolute inset-0 pointer-events-none">
                {debris.map((d) => (
                  <motion.span key={d.id} className="absolute left-1/2 top-1/2 block"
                    style={d.shape==='tri'
                      ? { width:0, height:0,
                          borderLeft:d.size+'px solid transparent',
                          borderRight:d.size+'px solid transparent',
                          borderBottom:(d.size*1.7)+'px solid '+d.color }
                      : { width:d.size, height:d.size, background:d.color, borderRadius:2 }
                    }
                    initial={{ x:0, y:0, opacity:1, rotate:0 }}
                    animate={{ x:Math.cos(d.angle)*d.dist, y:Math.sin(d.angle)*d.dist*0.5-60, opacity:0, rotate:d.spin }}
                    transition={{ duration:1.2, delay:d.delay, ease:'easeOut' }} />
                ))}
                {Array.from({ length:14 }).map((_,i) => (
                  <motion.span key={'dust-'+i} className="absolute left-1/2 top-1/2 rounded-full"
                    style={{ width:50+i*8, height:50+i*8,
                      background:'rgba(180,140,90,0.09)', filter:'blur(8px)',
                      marginLeft:-(25+i*4), marginTop:-(25+i*4) }}
                    initial={{ scale:0.3, opacity:0 }}
                    animate={{ x:(i-7)*30, y:15-i*2.5, opacity:[0,0.55,0], scale:1.6 }}
                    transition={{ duration:1.6, delay:0.08+i*0.04, ease:'easeOut' }} />
                ))}
              </div>
            )}

            {/* screen flash */}
            <AnimatePresence>
              {phase===5 && (
                <motion.div className="absolute inset-0"
                  style={{ background:'radial-gradient(circle at center, #fff8e0, white)' }}
                  initial={{ opacity:0 }}
                  animate={{ opacity:[0,1,1,0] }}
                  transition={{ duration:0.45, times:[0,0.15,0.5,1] }} />
              )}
            </AnimatePresence>

            {/* UI morph */}
            {phase>=6 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }}
                className="absolute inset-0 flex items-center justify-center">
                <motion.div className="absolute inset-0"
                  style={{ backgroundImage:'linear-gradient(rgba(242,169,59,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(242,169,59,0.09) 1px,transparent 1px)',
                    backgroundSize:'44px 44px' }}
                  initial={{ opacity:0, scale:1.4 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ duration:0.7 }} />
                <motion.div initial={{ opacity:0, y:18, scale:0.88 }} animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:0.55, delay:0.18 }}
                  className="relative flex flex-col items-center gap-4">
                  <TrishulSVG small />
                  <div className="font-display text-3xl font-bold tracking-widest">
                    TRISHUL <span className="ember-text">CRM</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          <div className="absolute bottom-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(242,169,59,0.3)] to-transparent" />

          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-[11px] font-mono tracking-wide" style={{ color:'var(--muted)' }}>
            <AnimatePresence mode="wait">
              <motion.span key={logIndex} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:0.28 }}>
                {BOOT_LOG[logIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-52 h-[3px] rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full" style={{ background:'linear-gradient(90deg,var(--gold),var(--ember))' }}
              initial={{ width:'0%' }}
              animate={{ width: Math.min(100,(phase/6)*100)+'%' }}
              transition={{ duration:0.4 }} />
          </div>

          <button onClick={onDone}
            className="absolute bottom-6 right-6 text-xs font-mono tracking-wide transition-colors hover:text-[var(--gold)]"
            style={{ color:'var(--muted)' }}>
            skip intro \u2192
          </button>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase"
            style={{ letterSpacing:'0.38em', color:'var(--muted-2)' }}>
            Trishul CRM
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════════
   TRISHUL SVG — faithful to the reference image
   viewBox 0 0 100 320 — tall portrait
   ═══════════════════════════════════════════════════════════ */
function TrishulSVG({ active, small }) {
  const W = small ? 55 : 110, H = small ? 160 : 320
  const glow = active ? 38 : 28
  return (
    <motion.svg width={W} height={H} viewBox="0 0 100 320"
      style={{ filter:'drop-shadow(0 0 '+glow+'px rgba(242,169,59,0.88)) drop-shadow(0 0 '+(glow*0.4)+'px rgba(255,200,80,0.65))',
        overflow:'visible' }}>
      <defs>
        <linearGradient id="gShaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ffe88a" />
          <stop offset="18%"  stopColor="#f5b840" />
          <stop offset="50%"  stopColor="#e89018" />
          <stop offset="82%"  stopColor="#d47810" />
          <stop offset="100%" stopColor="#a05808" />
        </linearGradient>
        <linearGradient id="gProng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff8d8" />
          <stop offset="22%"  stopColor="#f8d060" />
          <stop offset="58%"  stopColor="#f2a83a" />
          <stop offset="100%" stopColor="#d07818" />
        </linearGradient>
        <radialGradient id="gOrb" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#fff0a0" />
          <stop offset="45%"  stopColor="#f5b030" />
          <stop offset="100%" stopColor="#b06010" />
        </radialGradient>
        <linearGradient id="gCloth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#ff3a1a" />
          <stop offset="42%"  stopColor="#d01808" />
          <stop offset="100%" stopColor="#7a0404" />
        </linearGradient>
        <radialGradient id="gHalo" cx="50%" cy="22%" r="60%">
          <stop offset="0%"   stopColor="rgba(255,248,160,1)" />
          <stop offset="100%" stopColor="rgba(255,200,60,0)" />
        </radialGradient>
      </defs>

      {/* HALO */}
      <ellipse cx="50" cy="48" rx="44" ry="34" fill="url(#gHalo)" opacity={active ? 1 : 0.65} />

      {/* LEFT PRONG */}
      <path d="M50 102 C50 88 44 73 34 59 C26 47 20 37 22 22 C24 11 31 5 33 4"
        stroke="url(#gProng)" strokeWidth="5.2" fill="none" strokeLinecap="round" />
      <path d="M50 102 C50 89 45 75 36 62 C29 50 24 40 25 25"
        stroke="rgba(255,255,200,0.42)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <polygon points="33,4 29,2 35,7" fill="#fff8d0" />
      <circle cx="31" cy="3" r="1.8" fill="#fff8d0" />

      {/* RIGHT PRONG */}
      <path d="M50 102 C50 88 56 73 66 59 C74 47 80 37 78 22 C76 11 69 5 67 4"
        stroke="url(#gProng)" strokeWidth="5.2" fill="none" strokeLinecap="round" />
      <path d="M50 102 C50 89 55 75 64 62 C71 50 76 40 75 25"
        stroke="rgba(255,255,200,0.42)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <polygon points="67,4 65,7 71,2" fill="#fff8d0" />
      <circle cx="69" cy="3" r="1.8" fill="#fff8d0" />

      {/* CENTRE PRONG — straight tallest sharpest */}
      <line x1="50" y1="1" x2="50" y2="104" stroke="url(#gProng)" strokeWidth="5.8" strokeLinecap="round" />
      <line x1="47.8" y1="5" x2="47.8" y2="100" stroke="rgba(255,255,210,0.5)" strokeWidth="1.6" strokeLinecap="round" />
      <polygon points="50,0 46.5,8 53.5,8" fill="#fff8d8" />
      <line x1="50" y1="0" x2="50" y2="6" stroke="#fffce0" strokeWidth="1" strokeLinecap="round" />

      {/* CROSS-BAR */}
      <path d="M21 76 Q50 83 79 76" stroke="url(#gProng)" strokeWidth="4.8" fill="none" strokeLinecap="round" />
      <path d="M21 76 Q50 78 79 76" stroke="rgba(255,255,200,0.38)" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* UPPER COLLAR */}
      <rect x="39" y="101" width="22" height="10" rx="5" fill="url(#gShaft)" />
      <rect x="39" y="101" width="22" height="4"  rx="2" fill="rgba(255,248,180,0.42)" />
      <line x1="39" y1="104.5" x2="61" y2="104.5" stroke="#ffe880" strokeWidth="0.8" opacity="0.55" />
      <line x1="39" y1="108"   x2="61" y2="108"   stroke="#ffe880" strokeWidth="0.7" opacity="0.32" />
      <text x="50" y="108" textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fontFamily="serif" fontWeight="bold" fill="#fff8c8" opacity="0.96">&#x950;</text>

      {/* UPPER ORB */}
      <circle cx="50" cy="120" r="9" fill="url(#gOrb)" />
      <circle cx="50" cy="120" r="9" stroke="#ffe070" strokeWidth="1" fill="none" opacity="0.55" />
      <ellipse cx="46" cy="116" rx="3.5" ry="2.2" fill="rgba(255,255,220,0.68)" />

      {/* RED CLOTH */}
      <path d="M50 120 C47 126 38 134 24 131 C14 129 7 136 4 133 C2 142 9 150 20 148 C31 146 42 141 50 134 Z"
        fill="url(#gCloth)" opacity="0.95" />
      <path d="M50 120 C48 126 40 132 28 130 C19 128 12 133 8 131"
        stroke="rgba(255,160,120,0.62)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M50 122 C48 128 40 135 26 133 C18 131 11 136 7 134"
        stroke="rgba(60,0,0,0.32)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M4 133 C1 138 0 145 4 149 C7 152 11 150 9 147"
        fill="#8a0606" opacity="0.6" />

      {/* CLOTH RING */}
      <rect x="43" y="128" width="14" height="6" rx="3" fill="url(#gShaft)" />
      <line x1="43" y1="130.5" x2="57" y2="130.5" stroke="#ffe870" strokeWidth="0.8" opacity="0.6" />

      {/* MAIN SHAFT */}
      <line x1="53.2" y1="134" x2="53.2" y2="290" stroke="#885008" strokeWidth="1.6" strokeLinecap="round" opacity="0.42" />
      <line x1="50"   y1="134" x2="50"   y2="290" stroke="url(#gShaft)" strokeWidth="6" strokeLinecap="round" />
      <line x1="47"   y1="137" x2="47"   y2="288" stroke="#ffe890" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

      {/* MID-SHAFT BAND */}
      <rect x="43.5" y="205" width="13" height="8" rx="4" fill="url(#gShaft)" />
      <line x1="43.5" y1="208" x2="56.5" y2="208" stroke="#ffe870" strokeWidth="0.8" opacity="0.55" />
      <line x1="43.5" y1="211" x2="56.5" y2="211" stroke="#ffe870" strokeWidth="0.7" opacity="0.32" />

      {/* BOTTOM COLLAR */}
      <rect x="41" y="290" width="18" height="10" rx="5" fill="url(#gShaft)" />
      <line x1="41" y1="293.5" x2="59" y2="293.5" stroke="#ffe870" strokeWidth="0.9" opacity="0.6" />
      <line x1="41" y1="297"   x2="59" y2="297"   stroke="#ffe870" strokeWidth="0.8" opacity="0.35" />
      <rect x="42" y="300" width="16" height="5" rx="2.5" fill="#cc0f0f" opacity="0.92" />
      <line x1="42" y1="302.5" x2="58" y2="302.5" stroke="#ff6050" strokeWidth="0.9" opacity="0.45" />

      {/* FOOT ORB */}
      <circle cx="50" cy="313" r="9.5" fill="url(#gOrb)" />
      <circle cx="50" cy="313" r="9.5" stroke="#ffe060" strokeWidth="1" fill="none" opacity="0.5" />
      <ellipse cx="46" cy="308.5" rx="3.5" ry="2.2" fill="rgba(255,255,210,0.62)" />
    </motion.svg>
  )
}
