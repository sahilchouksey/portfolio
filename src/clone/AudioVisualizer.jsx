import { useEffect, useRef, useState } from 'react';

export default function AudioVisualizer({ theme, compact }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const animRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState('bars'); // bars | waveform | radial
  const [useMic, setUseMic] = useState(false);
  const [error, setError] = useState('');

  const bands = 48;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureAudio = async (mic = false) => {
    if (analyserRef.current) return analyserRef.current;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { setError('Web Audio not supported'); return null; }
    const ac = new AudioCtx();
    const analyser = ac.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.86;

    if (mic) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const src = ac.createMediaStreamSource(stream);
        src.connect(analyser);
      } catch (e) {
        setError('mic permission denied');
        return null;
      }
    } else {
      // create oscillator + fake spectrum when no mic/file — demo visualizer
      // we will synthesize data if no real source, so analyser stays but we feed synthetic
      // Connect a silent oscillator just to keep context running
      const osc = ac.createOscillator();
      osc.frequency.value = 0;
      const gain = ac.createGain();
      gain.gain.value = 0;
      osc.connect(gain); gain.connect(analyser);
      osc.start();
      analyser.__synthetic = true;
      analyser.__ac = ac;
    }
    analyserRef.current = analyser;
    analyser.__ac = ac;
    return analyser;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !ctx || !analyser) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    // background grid
    ctx.strokeStyle = theme.surf + '55';
    ctx.lineWidth = 1;
    for (let i=0;i<4;i++){ const y = (H/4)*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    if (analyser.__synthetic) {
      // synthetic pulsing
      const t = Date.now()/ 300;
      const data = new Uint8Array(bands);
      for (let i=0;i<bands;i++) {
        const base = Math.sin(t*0.4 + i*0.22)*0.3 + Math.cos(t*0.18 - i*0.13)*0.25;
        const env = 0.55 + 0.45*Math.sin(t*0.07 + i*0.04);
        const v = Math.max(0, Math.min(1, 0.5 + base*env));
        data[i] = Math.floor(v*255);
      }
      renderBars(ctx, data, W, H, theme, mode);
    } else {
      const freq = new Uint8Array(analyser.frequencyBinCount);
      const time = new Uint8Array(analyser.fftSize);
      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(time);
      if (mode === 'waveform') renderWaveform(ctx, time, W, H, theme);
      else if (mode === 'radial') renderRadial(ctx, freq, W, H, theme);
      else {
        // downsample freq to bands
        const data = new Uint8Array(bands);
        const step = Math.floor(freq.length / bands * 0.55);
        for (let i=0;i<bands;i++) data[i]= freq[i*step]||0;
        renderBars(ctx, data, W, H, theme, mode);
      }
    }
    animRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (playing) {
      ensureAudio(useMic).then(a=>{ if(a) draw(); });
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      // draw idle flat
      const canvas = canvasRef.current; const ctx = ctxRef.current;
      if (canvas && ctx){
        const W=canvas.width, H=canvas.height;
        ctx.clearRect(0,0,W,H);
        ctx.strokeStyle = theme.surf + '55'; ctx.lineWidth=1;
        for(let i=0;i<4;i++){ const y=(H/4)*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
        // flat line
        ctx.strokeStyle = theme.dim;
        ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
      }
    }
    return ()=> { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [playing, mode, useMic, theme]);

  const toggle = () => setPlaying(v=>!v);

  return (
    <div style={{
      border:`1px solid ${theme.surf}`, borderRadius:3, background: theme.bg,
      padding:'8px 10px', position:'relative', display:'flex', flexDirection:'column', gap:6
    }}>
      <div style={{position:'absolute', top:-7, left:8, background:theme.bg, padding:'0 4px', fontSize:10, color:theme.muted, whiteSpace:'nowrap'}}>
        audio <span style={{color:theme.fg}}>visualizer</span> <span style={{color:theme.dim}}>· pui</span>
      </div>
      <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={toggle} style={{
          cursor:'pointer', fontFamily:'inherit', fontSize:11, padding:'4px 10px', borderRadius:4,
          border:`1px solid ${playing? theme.green: theme.surf}`, background: playing? theme.green: theme.bg2, color: playing? theme.bg: theme.fg, fontWeight:700
        }}>{playing ? '■ stop' : '▶ play'}</button>
        <div style={{display:'flex', gap:4}}>
          {['bars','waveform','radial'].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{
              cursor:'pointer', fontFamily:'inherit', fontSize:11, padding:'3px 7px', borderRadius:4,
              border:`1px solid ${mode===m? theme.cyan: theme.surf}`, background: mode===m? theme.surf: 'transparent', color: mode===m? theme.cyan: theme.muted
            }}>{m}</button>
          ))}
        </div>
        <label style={{display:'flex', alignItems:'center', gap:4, fontSize:11, color:theme.muted, cursor:'pointer'}}>
          <input type="checkbox" checked={useMic} onChange={e=>{setUseMic(e.target.checked); setPlaying(false); setError('');}} style={{accentColor:theme.cyan}}/> mic
        </label>
        <span style={{fontSize:10, color: theme.dim, marginLeft:'auto'}}>{error || (useMic ? 'mic → analyser' : 'synthetic demo')}</span>
        <input ref={audioRef} type="file" accept="audio/*" onChange={async e=>{
          const f=e.target.files?.[0]; if(!f) return;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          const ac = new AudioCtx(); const analyser = ac.createAnalyser(); analyser.fftSize=1024;
          analyser.smoothingTimeConstant=0.85;
          const url = URL.createObjectURL(f);
          const audio = new Audio(url); audio.crossOrigin='anonymous'; audio.loop=true;
          audioRef.current = audio;
          await audio.play();
          const src = ac.createMediaElementSource(audio);
          src.connect(analyser); analyser.connect(ac.destination);
          analyser.__ac = ac; analyserRef.current = analyser; setPlaying(true); setUseMic(false);
        }} style={{fontSize:10, maxWidth:140}} />
      </div>
      <canvas ref={canvasRef} width={compact? 520: 680} height={84} style={{width:'100%', height:84, display:'block', borderRadius:2, background: theme.bg2, border:`1px solid ${theme.surf}`}} />
      <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:theme.dim}}>
        <span> {playing ? '● live' : '○ idle'} · {mode} · {bands} bands · 60fps</span>
        <span style={{color:theme.muted}}>below htop · web audio api</span>
      </div>
    </div>
  );
}

function renderBars(ctx, data, W, H, theme, mode){
  const n = data.length;
  const gap = 2, barW = (W - (n-1)*gap)/n;
  for(let i=0;i<n;i++){
    const v = data[i]/255;
    const h = Math.max(2, v * (H-10));
    const x = i*(barW+gap);
    const y = H - h - 4;
    const grad = ctx.createLinearGradient(0,y,0,y+h);
    grad.addColorStop(0, theme.cyan);
    grad.addColorStop(1, theme.blue);
    ctx.fillStyle = grad;
    // rounded bar
    ctx.beginPath();
    const r=2;
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+barW-r, y);
    ctx.quadraticCurveTo(x+barW, y, x+barW, y+r);
    ctx.lineTo(x+barW, y+h);
    ctx.lineTo(x, y+h);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    // glow on loud bands
    if(v>0.7){
      ctx.fillStyle = theme.yellow + '55';
      ctx.fillRect(x, y-6, barW, 2);
    }
  }
}
function renderWaveform(ctx, time, W, H, theme){
  ctx.strokeStyle = theme.green; ctx.lineWidth=1.7; ctx.beginPath();
  for(let i=0;i<time.length;i++){
    const x = i/time.length * W;
    const y = (time[i]/255)*H;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.fillStyle = theme.green + '18'; ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
}
function renderRadial(ctx, freq, W, H, theme){
  const cx=W/2, cy=H/2, R=Math.min(W,H)*0.38;
  const N=64; ctx.strokeStyle=theme.magenta; ctx.lineWidth=1.2;
  for(let i=0;i<N;i++){
    const v = (freq[Math.floor(i/freq.length*N*0.6)]||0)/255;
    const ang = i/N * Math.PI*2;
    const r0 = R*0.55, r1 = r0 + v*R*0.55;
    const x0=cx+Math.cos(ang)*r0, y0=cy+Math.sin(ang)*r0;
    const x1=cx+Math.cos(ang)*r1, y1=cy+Math.sin(ang)*r1;
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
  }
  ctx.fillStyle=theme.cyan; ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2); ctx.fill();
}
