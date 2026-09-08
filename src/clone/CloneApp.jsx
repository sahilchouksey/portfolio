import { useEffect, useRef, useState, useMemo } from 'react';
import { THEMES, PROCS, EXPERIENCE_MD, PUBLICATIONS_MD, EDUCATION_MD, LINKS_SH } from './data.js';
import AudioVisualizer from './AudioVisualizer.jsx';

const fmtMem = (mb)=> mb>=1000 ? (mb/1024).toFixed(1)+'G' : mb+'M';
const shareCpu = (procs, load)=>{
  const w = procs.map(p=> Math.max(0.05, p.base*(0.6+Math.random()*0.8)));
  const sum = w.reduce((a,b)=>a+b,0);
  return procs.map((p,i)=> ({...p, cpu:(w[i]/sum)*load*100}));
};

// --- exact htop-style smooth sparkline (canvas, 60fps, lerp) ---
function SmoothSparkline({ data, color, bg, surf, height=28 }){
  const ref = useRef(null);
  const anim = useRef(null);
  const displayRef = useRef([...data]);
  useEffect(()=>{ displayRef.current = [...data]; },[data]);
  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t0 = performance.now();
    // lerp displayed values toward target at 60fps
    const loop = (now)=>{
      const dt = Math.min(32, now - t0); t0 = now;
      // smooth lerp 0.12 per frame ~ 150ms settle
      const target = displayRef.current;
      // we keep an internal rendered array that chases target
      if(!canvas._rendered) canvas._rendered = [...target];
      const rendered = canvas._rendered;
      // if lengths differ, reset
      if(rendered.length !== target.length) canvas._rendered = [...target];
      else {
        for(let i=0;i<rendered.length;i++){
          rendered[i] += (target[i] - rendered[i]) * 0.18;
        }
      }
      drawSpark(ctx, canvas, rendered, color, bg, surf, height);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return ()=> cancelAnimationFrame(raf);
  },[color, bg, surf, height]);

  // initial draw + resize
  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas) return;
    const ro = new ResizeObserver(()=>{
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio||1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    });
    ro.observe(canvas);
    return ()=> ro.disconnect();
  },[]);

  return <canvas ref={ref} style={{width:'100%', height, display:'block'}} />;
}

function drawSpark(ctx, canvas, arr, color, bg, surf, h){
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio||1;
  // clear
  ctx.clearRect(0,0,W,H);
  // grid
  ctx.strokeStyle = surf + '33';
  ctx.lineWidth = 1 * dpr;
  ctx.beginPath();
  for(let i=1;i<3;i++){
    const y = H * i/3;
    ctx.moveTo(0,y); ctx.lineTo(W,y);
  }
  ctx.stroke();
  if(arr.length < 2) return;
  const n = arr.length;
  const step = W / (n-1);
  // gradient fill
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, color + '3A');
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0,H);
  arr.forEach((v,i)=>{
    const x = i*step;
    const y = H - Math.max(0, Math.min(1, v)) * (H*0.82) - H*0.09;
    if(i===0) ctx.lineTo(x,y); else {
      // smooth cubic via mid
      const prevX = (i-1)*step, prevY = H - Math.max(0,Math.min(1, arr[i-1]))*(H*0.82)-H*0.09;
      const cx = (prevX + x)/2;
      ctx.quadraticCurveTo(prevX, prevY, cx, (prevY+y)/2);
      if(i===n-1) ctx.lineTo(x,y);
    }
  });
  ctx.lineTo((n-1)*step, H);
  ctx.closePath();
  ctx.fill();
  // line - exactly like htop green bar
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6 * dpr;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  arr.forEach((v,i)=>{
    const x = i*step;
    const y = H - Math.max(0, Math.min(1, v)) * (H*0.82) - H*0.09;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });
  ctx.stroke();
  // glow dot at head
  const lastY = H - Math.max(0,Math.min(1, arr[n-1]))*(H*0.82)-H*0.09;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6 * dpr;
  ctx.beginPath();
  ctx.arc((n-1)*step, lastY, 2.2*dpr, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function fmtDate(){
  return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function mdToLines(md, theme){
  // very small markdown renderer: returns array of {el}
  const lines = md.split('\n');
  return lines.map((raw,i)=>{
    if(raw.startsWith('# ')) return { type:'h1', text: raw.slice(2), key:i };
    if(raw.startsWith('## ')) return { type:'h2', text: raw.slice(3), key:i };
    if(raw.startsWith('> ')) return { type:'quote', text: raw.slice(2), key:i };
    if(raw.startsWith('- ')) return { type:'bullet', text: raw.slice(2), key:i };
    if(raw.trim()==='') return { type:'blank', key:i };
    return { type:'p', text: raw, key:i };
  });
}

function renderInline(text, theme){
  // handle **bold**, `code`, [link](url), *italic*
  // split by links first
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let parts = [];
  let last = 0; let m;
  const segs = [];
  while((m=linkRe.exec(text))!==null){
    if(m.index>last) segs.push({t:text.slice(last, m.index), isLink:false});
    segs.push({t:m[1], href:m[2], isLink:true});
    last = m.index + m[0].length;
  }
  if(last < text.length) segs.push({t:text.slice(last), isLink:false});
  // now render each seg with bold/code
  const out = [];
  segs.forEach((s, idx)=>{
    if(s.isLink){
      out.push(<a key={`l${idx}`} href={s.href} target="_blank" rel="noopener" style={{color: theme.cyan, textDecoration:'underline', textUnderlineOffset:2}}>{renderBoldCode(s.t, theme, `l${idx}`)}</a>);
    } else {
      out.push(<span key={`t${idx}`}>{renderBoldCode(s.t, theme, `t${idx}`)}</span>);
    }
  });
  return out;
}

function renderBoldCode(text, theme, prefix){
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const res=[]; let last=0; let m; let c=0;
  while((m=re.exec(text))!==null){
    if(m.index>last) res.push(<span key={`${prefix}${c++}`}>{text.slice(last, m.index)}</span>);
    const tok=m[0];
    if(tok.startsWith('**')) res.push(<strong key={`${prefix}${c++}`} style={{color: theme.fg, fontWeight:700}}>{tok.slice(2,-2)}</strong>);
    else if(tok.startsWith('`')) res.push(<code key={`${prefix}${c++}`} style={{background: theme.surf, padding:'0 3px', borderRadius:3, fontSize:'0.95em', color: theme.yellow}}>{tok.slice(1,-1)}</code>);
    else res.push(<em key={`${prefix}${c++}`} style={{color: theme.muted, fontStyle:'italic'}}>{tok.slice(1,-1)}</em>);
    last=m.index+tok.length;
  }
  if(last<text.length) res.push(<span key={`${prefix}${c++}`}>{text.slice(last)}</span>);
  return res;
}

function AsciiPortrait({theme, mode='face'}){
  const RAMP=' .:-=+*#%@';
  const cols=34, rows=16;
  // synthetic ascii using theme colors, not image-dependent
  // seeded pattern that looks like face-ish blocks
  const lines = useMemo(()=>{
    const arr=[];
    for(let y=0;y<rows;y++){
      let line='';
      for(let x=0;x<cols;x++){
        const dx=x-cols/2, dy=y-rows/2;
        const d=Math.sqrt(dx*dx*2.2 + dy*dy*3.5);
        const ring = Math.sin(dx*0.6)*0.5 + Math.cos(dy*0.9)*0.5;
        const v = Math.max(0, Math.min(1, 0.55 + ring*0.18 - d*0.045 + Math.random()*0.12));
        line += RAMP[Math.floor(v*(RAMP.length-1))];
      }
      arr.push(line);
    }
    return arr;
  },[]);
  return (
    <div style={{lineHeight:1.02, fontSize: mode==='face'? '7.3px':'7px', letterSpacing:0.2, userSelect:'none', color: theme.fg, whiteSpace:'pre', fontFamily:'Fira Code, monospace'}}>
      {lines.map((l,i)=> <div key={i} style={{color: i<6? theme.muted : i>10? theme.dim: theme.fg}}>{l}</div>)}
    </div>
  );
}

export default function CloneApp(){
  const FALLBACK = THEMES[0];
  const [themeKey, setThemeKey] = useState(()=> {
    try{ const v=localStorage.getItem('sk-theme'); return v? JSON.parse(v): 'catppuccin'; }catch{ return 'catppuccin'; }
  });
  const theme = useMemo(()=> THEMES.find(t=>t.key===themeKey)||FALLBACK, [themeKey]);
  const [clock, setClock]=useState(fmtDate());
  const [cpuHist, setCpuHist]=useState(()=> Array.from({length:80}, ()=> 0.45+Math.random()*0.4));
  const [memHist, setMemHist]=useState(()=> Array.from({length:80}, ()=> 0.55+Math.random()*0.15));
  const [procs, setProcs]=useState(()=> shareCpu(PROCS, 0.52));
  const [sortKey, setSortKey]=useState('cpu');
  const [selPid, setSelPid]=useState('1024');
  const [openIdx, setOpenIdx]=useState(0);
  const [lightsHover, setLightsHover]=useState(false);
  const [isMobile, setIsMobile]=useState(false);
  const [helpOpen, setHelpOpen]=useState(false);
  const [confirmOpen, setConfirmOpen]=useState(false);
  const [isMin, setIsMin]=useState(false);
  const [isFull, setIsFull]=useState(false);
  const [sparkN, setSparkN]=useState(28);
  const [pane, setPane]=useState(0); // 0 zsh,1 htop,2 nvim
  const [input, setInput]=useState('');
  const [termLines, setTermLines]=useState(()=> [{kind:'neofetch', id:0}]);
  const meterRef=useRef(null);
  const leftRef=useRef(null);
  const termInputRef=useRef(null);

  const files = useMemo(()=>[
    {name:'experience.md', path:'~/resume/experience.md', md: EXPERIENCE_MD},
    {name:'publications.md', path:'~/resume/publications.md', md: PUBLICATIONS_MD},
    {name:'education.md', path:'~/resume/education.md', md: EDUCATION_MD},
    {name:'links.sh', path:'~/resume/links.sh', md: LINKS_SH, type:'sh'},
  ],[]);
  const currentFile = files[openIdx];

  useEffect(()=>{
    localStorage.setItem('sk-theme', JSON.stringify(themeKey));
  },[themeKey]);

  useEffect(()=>{
    const onResize=()=>{
      setIsMobile(window.innerWidth<860);
      const el=meterRef.current; const w=el? el.clientWidth: 300;
      setSparkN(Math.max(12, Math.floor((w-16)/7.8)));
    };
    onResize(); window.addEventListener('resize', onResize);
    return ()=> window.removeEventListener('resize', onResize);
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>{
      setClock(fmtDate());
      setCpuHist(h=>{
        const last=h[h.length-1];
        const next=Math.min(1, Math.max(0.35, last + (Math.random()-0.5)*0.3));
        return [...h.slice(1), next];
      });
      setMemHist(h=>{
        const last=h[h.length-1];
        const next=Math.min(0.95, Math.max(0.4, last + (Math.random()-0.5)*0.06));
        return [...h.slice(1), next];
      });
      setProcs(p=>{
        const load = cpuHist[cpuHist.length-1]||0.5;
        return shareCpu(p, load);
      });
    }, 1000);
    return ()=> clearInterval(id);
  },[cpuHist]);

  const cpuPct = Math.round((cpuHist[cpuHist.length-1]||0.5)*100);
  const memPct = Math.round((memHist[memHist.length-1]||0.6)*100);
  // htop exact: keep full 80 history, canvas scales automatically — sparkN now only for fallback text width
  const cpuSlice = useMemo(()=> cpuHist.slice(-Math.max(20,sparkN)), [cpuHist, sparkN]);
  const memSlice = useMemo(()=> memHist.slice(-Math.max(20,sparkN)), [memHist, sparkN]);

  // htop exact: smooth cpu% lerp at 60fps — prevents 1s jumps
  const [displayProcs, setDisplayProcs] = useState(()=> procs);
  useEffect(()=>{
    let raf;
    const lerp = ()=>{
      setDisplayProcs(prev=>{
        const next = prev.map(p=>{
          const target = procs.find(x=> x.pid===p.pid);
          if(!target) return p;
          return {...p, cpu: p.cpu + (target.cpu - p.cpu)*0.22, memMB: p.memMB + (target.memMB - p.memMB)*0.22 };
        });
        return next;
      });
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    return ()=> cancelAnimationFrame(raf);
  },[procs]);
  const sortedProcs = useMemo(()=>{
    const arr=[...displayProcs];
    if(sortKey==='cpu') arr.sort((a,b)=> b.cpu - a.cpu);
    else if(sortKey==='mem') arr.sort((a,b)=> b.memMB - a.memMB);
    else arr.sort((a,b)=> +a.pid - +b.pid);
    return arr;
  },[displayProcs, sortKey]);

  const selDetail = useMemo(()=> (displayProcs.find(p=>p.pid===selPid)?.detail) || sortedProcs[0]?.detail || '', [displayProcs, selPid, sortedProcs]);

  const nfLinesTop = [
    {k:'OS:', v:'Vision · Graphics · ML', isText:true},
    {k:'Host:', v:'Halfpixel', href:'https://halfpixel.ai/', rest:' (Co-Founder & CTO)', isLink:true},
    {k:'Kernel:', v:'real-time 3D systems', isText:true},
    {k:'Uptime:', v:'25+ yrs dev · 15+ research', isText:true},
    {k:'Packages:', v:'30+ papers, 20+ patents, 7.5k cites', href:'https://scholar.google.com/citations?user=9WgcwYQAAAAJ', isLink:true},
    {k:'Shell:', v:'PhD, U. of Maryland', isText:true},
  ];

  const submitTerm = (val)=>{
    const line = val.trim();
    if(!line) { setInput(''); return; }
    const lower=line.toLowerCase();
    let out=[];
    if(lower==='help' || lower==='?'){
      out.push({kind:'line', el: 'zsh 5.9 — commands: ls cd pwd cat neofetch theme <name> help clear htop nvim', id:Date.now()});
    } else if(lower==='clear'){
      setTermLines([{kind:'neofetch', id: Date.now()}]);
      setInput(''); return;
    } else if(lower.startsWith('theme')){
      const arg=line.split(/\s+/)[1];
      if(arg && THEMES.find(t=>t.key===arg)){ setThemeKey(arg); out.push({kind:'line', el:`theme → ${arg}`, id:Date.now()}); }
      else out.push({kind:'line', el:`available themes: ${THEMES.map(t=>t.key).join(', ')}`, id:Date.now()});
    } else if(lower==='neofetch'){
      out.push({kind:'neofetch', id:Date.now()});
    } else if(lower==='ls' || lower==='ls -la'){
      out.push({kind:'line', el:'resume/  photo.jpg  links.sh  mlp.h  mlp_megakernel.cu  main.cc', id:Date.now()});
    } else {
      out.push({kind:'line', el:`zsh: command not found: ${line}  (try: help)`, id:Date.now()});
    }
    setTermLines(s=> [...s, {kind:'line', el:`[sameh@halfpixel:~]$ ${line}`, id:Date.now()+1}, ...out]);
    setInput('');
  };

  if(isMin){
    return (
      <div style={{minHeight:'100vh', background:theme.bg2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Fira Code, monospace', color: theme.fg}}>
        <button onClick={()=>setIsMin(false)} title="restore terminal" style={{width:64, height:64, borderRadius:'50%', background:'transparent', border:`1px solid ${theme.dim}`, color:theme.dim, fontSize:26, cursor:'pointer'}}>⏻</button>
      </div>
    );
  }

  const windowTitle = '[sameh@halfpixel:~]$';
  const termStyle = {
    display:'flex', flexDirection:'column', flex: isFull? '1 1 auto' : '1', minHeight:0, background: theme.bg, border:`1px solid ${theme.surf}`, borderRadius:6, overflow:'hidden', position:'relative'
  };

  return (
    <div style={{
      minHeight:'100vh', background: theme.bg2, color: theme.fg,
      fontFamily:"'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace",
      '--bg':theme.bg, '--bg2':theme.bg2, '--surf':theme.surf, '--fg':theme.fg, '--muted':theme.muted, '--dim':theme.dim,
      '--red':theme.red, '--green':theme.green, '--yellow':theme.yellow, '--blue':theme.blue, '--magenta':theme.magenta, '--cyan':theme.cyan, '--orange':theme.orange
    }}>
      <style>{`
        html,body{margin:0;padding:0;background:${theme.bg2}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-thumb{background:${theme.surf};border-radius:4px}
        ::selection{background:${theme.surf};color:${theme.fg}}
        a:hover{text-decoration:underline}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* SEO hidden */}
      <div style={{position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0 0 0 0)', whiteSpace:'nowrap'}}>
        <h1>Sameh Khamis</h1>
        <p>Sameh Khamis is Co-Founder and CTO of Halfpixel, and previously worked at NVIDIA, Google and Microsoft. He is a computer vision, graphics and machine learning researcher building real-time 3D systems, with 30+ papers and 20+ patents. PhD, University of Maryland.</p>
      </div>

      <div style={{
        maxWidth: isFull? '100%': '1280px', margin:'0 auto', minHeight:'100vh', display:'flex', flexDirection:'column', padding: isFull? 0: isMobile? '8px':'14px', gap:0
      }}>
        {/* terminal window */}
        <div style={{flex:1, display:'flex', flexDirection:'column', background:theme.bg, border:`1px solid ${theme.surf}`, borderRadius:8, overflow:'hidden', boxShadow:'0 12px 40px rgba(0,0,0,0.35)', minHeight: isFull? '100vh':'auto'}}>

          {/* title bar + theme picker */}
          <div style={{display:'flex', alignItems:'center', gap:14, padding:'8px 14px', background: theme.bg2, borderBottom:`1px solid ${theme.surf}`, flex:'none', flexWrap:'nowrap', minWidth:0}}>
            <div style={{display:'flex', gap:7, flex:'none'}} onMouseEnter={()=>setLightsHover(true)} onMouseLeave={()=>setLightsHover(false)}>
              <button onClick={()=>setConfirmOpen(true)} title="close" style={{width:12,height:12,borderRadius:'50%',background:theme.red,border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(0,0,0,.6)',font:'700 9px/1 Fira Code, monospace'}}><span style={{opacity: lightsHover?1:0}}>×</span></button>
              <button onClick={()=>setIsMin(true)} title="minimize" style={{width:12,height:12,borderRadius:'50%',background:theme.yellow,border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(0,0,0,.6)',font:'700 9px/1 Fira Code, monospace'}}><span style={{opacity: lightsHover?1:0}}>−</span></button>
              <button onClick={()=>setIsFull(v=>!v)} title={isFull? 'exit full': 'maximize'} style={{width:12,height:12,borderRadius:'50%',background:theme.green,border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(0,0,0,.6)',font:'700 8px/1 Fira Code, monospace'}}><span style={{opacity: lightsHover?1:0}}>{isFull? '↘':'□'}</span></button>
            </div>
            <div style={{color: theme.muted, fontSize:12, flex:'0 1 auto', minWidth:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{windowTitle}</div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:4, flex:'1 1 auto', minWidth:0, overflowX: isMobile? 'auto':'visible', scrollbarWidth:'none'}}>
              {THEMES.map(t=>(
                <button key={t.key} onClick={()=>setThemeKey(t.key)} title={t.name} style={{
                  cursor:'pointer', flex:'none', whiteSpace:'nowrap', fontFamily:'inherit', fontSize:11, lineHeight:1, padding:'5px 7px', borderRadius:4,
                  border:`1px solid ${t.key===theme.key? theme.green : t.surf}`, background: t.bg, color: t.fg, display:'flex', alignItems:'center', gap:5, opacity: t.key===theme.key?1:0.7
                }}>
                  <span style={{width:7,height:7,borderRadius:'50%', background: t.blue, flex:'none'}}></span>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* panes grid */}
          <div style={{
            display:'grid', flex:1, minHeight:0, gap:0,
            gridTemplateColumns: isMobile? '1fr' : 'minmax(420px, 0.90fr) 8px minmax(520px, 1.1fr)',
            gridTemplateRows: isMobile? 'auto auto auto':'1fr',
            background: theme.bg, padding: isMobile? '8px':'10px'
          }}>

            {/* left column */}
            <div ref={leftRef} style={{display:'flex', flexDirection:'column', gap:8, minHeight:0, minWidth:0}}>

              {/* pane 0: zsh */}
              <div onMouseDown={()=>setPane(0)} onClick={()=>termInputRef.current?.focus()} style={{
                ...termStyle, height: isMobile? 360: 380, borderColor: pane===0? theme.blue: theme.surf, boxShadow: pane===0? `0 0 0 1px ${theme.blue}40`: 'none'
              }}>
                <div style={{position:'absolute', top:-8, left:12, background: theme.bg, padding:'0 6px', fontSize:11, color: theme.muted, whiteSpace:'nowrap', zIndex:1}}>0: zsh</div>
                <input ref={termInputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{
                  if(e.key==='Enter'){ submitTerm(input); }
                }} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="terminal input" style={{position:'absolute', left:0, top:0, width:1, height:1, opacity:0, border:0, padding:0, pointerEvents:'none'}} />
                <div style={{flex:1, minHeight:0, overflowY:'auto', overflowX:'hidden', padding:'12px 14px 10px', borderRadius:4, fontSize:12, lineHeight:1.45, cursor:'text'}}>
                  {termLines.map(it=>(
                    it.kind==='neofetch' ? (
                      <div key={it.id} style={{display:'flex', gap:14, alignItems:'flex-start', flexWrap:'nowrap', margin:'2px 0 8px'}}>
                        <div style={{flex:'none'}}><AsciiPortrait theme={theme} /></div>
                        <div style={{flex:'1 1 0', minWidth:0, fontSize:12, lineHeight:1.45}}>
                          <div><span style={{color:theme.green, fontWeight:700}}>sameh</span><span style={{color:theme.fg}}>@</span><span style={{color:theme.green, fontWeight:700}}>halfpixel</span></div>
                          <div style={{color:theme.dim}}>──────────────</div>
                          {nfLinesTop.map((l,i)=> (
                            <div key={i} style={{display:'flex', gap:6, whiteSpace:'nowrap', minWidth:0}}><span style={{color:theme.blue, fontWeight:700, flex:'none'}}>{l.k}</span>
                              {l.isLink ? <span style={{minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}><a href={l.href} target="_blank" rel="noopener" style={{color:theme.fg}}>{l.v}</a><span style={{color:theme.fg}}>{l.rest||''}</span></span> : <span style={{color:theme.fg, minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}>{l.v}</span>}
                            </div>
                          ))}
                          <div style={{display:'flex', gap:6, whiteSpace:'nowrap', minWidth:0}}><span style={{color:theme.blue, fontWeight:700, flex:'none'}}>Prev:</span><span style={{color:theme.fg, minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}>NVIDIA<span style={{color:theme.dim}}> · </span>Google<span style={{color:theme.dim}}> · </span>Microsoft</span></div>
                          <div style={{display:'flex', gap:6, whiteSpace:'nowrap', minWidth:0}}><span style={{color:theme.blue, fontWeight:700, flex:'none'}}>Terminal:</span><span style={{minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}><a href="https://github.com/samehkhamis" target="_blank" rel="noopener" style={{color:theme.fg}}>github</a><span style={{color:theme.dim}}> · </span><a href="https://twitter.com/sameh_khamis" target="_blank" rel="noopener" style={{color:theme.fg}}>twitter</a><span style={{color:theme.dim}}> · </span><a href="https://linkedin.com/in/samehkhamis" target="_blank" rel="noopener" style={{color:theme.fg}}>linkedin</a></span></div>
                          <div style={{display:'flex', gap:6, whiteSpace:'nowrap', minWidth:0}}><span style={{color:theme.blue, fontWeight:700, flex:'none'}}>Locale:</span><span style={{color:theme.fg}}>Bay Area, CA</span></div>
                          <div style={{display:'flex', gap:0, marginTop:10}}>
                            {[theme.red, theme.green, theme.yellow, theme.blue, theme.magenta, theme.cyan, theme.orange, theme.fg].map((c,idx)=> <span key={idx} style={{width:22, height:12, background:c, display:'block'}}></span>)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={it.id} style={{whiteSpace:'pre-wrap', overflowWrap:'anywhere', color: theme.fg}}>{it.el}</div>
                    )
                  ))}
                  <div style={{overflowWrap:'anywhere'}}><span style={{color:theme.fg}}>[</span><span style={{color:theme.green, fontWeight:700}}>sameh@halfpixel</span><span style={{color:theme.fg}}>:</span><span style={{color:theme.blue, fontWeight:700}}>~</span><span style={{color:theme.fg}}>] $&nbsp;</span><span style={{color:theme.fg, whiteSpace:'pre-wrap'}}>{input}</span><span style={{background: theme.fg, color: theme.bg, animation:'blink 1s step-end infinite'}}>&nbsp;</span></div>
                </div>
              </div>

              {/* splitter */}
              <div style={{height:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'row-resize'}}><span style={{display:'block', width:28, height:2, borderRadius:1, background: theme.dim, opacity:0.6}}></span></div>

              {/* pane 1: htop */}
              <div onMouseDown={()=>setPane(1)} style={{
                background: theme.bg, border:`1px solid ${pane===1? theme.magenta: theme.surf}`, borderRadius:6, paddingTop:6, position:'relative', display:'flex', flexDirection:'column', minHeight:0, boxShadow: pane===1? `0 0 0 1px ${theme.magenta}30`:'none'
              }}>
                <div style={{position:'absolute', top:-8, left:12, background: theme.bg, padding:'0 6px', fontSize:11, color: theme.muted, whiteSpace:'nowrap'}}>1: htop — now</div>
                <div style={{display:'flex', flexDirection:'column', gap:8, padding:'14px 14px 10px', flex:1, minHeight:0}}>
                  <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:10, flex:'none'}}>
                    <div ref={meterRef} style={{border:`1px solid ${theme.surf}`, borderRadius:3, padding:'6px 8px 4px', position:'relative', minWidth:0, overflow:'hidden'}}>
                      <div style={{position:'absolute', top:-7, left:8, background:theme.bg, padding:'0 4px', fontSize:10, color:theme.muted, whiteSpace:'nowrap'}}>cpu <span style={{color:theme.fg}}>focus</span></div>
                      <SmoothSparkline data={cpuSlice} color={theme.green} bg={theme.bg} surf={theme.surf} height={28} />
                      <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:theme.muted, marginTop:4}}><span>load</span><span style={{color:theme.fg, fontVariantNumeric:'tabular-nums'}}>{cpuPct}%</span></div>
                    </div>
                    <div style={{border:`1px solid ${theme.surf}`, borderRadius:3, padding:'6px 8px 4px', position:'relative', minWidth:0, overflow:'hidden'}}>
                      <div style={{position:'absolute', top:-7, left:8, background:theme.bg, padding:'0 4px', fontSize:10, color:theme.muted, whiteSpace:'nowrap'}}>mem <span style={{color:theme.fg}}>context</span></div>
                      <SmoothSparkline data={memSlice} color={theme.magenta} bg={theme.bg} surf={theme.surf} height={28} />
                      <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:theme.muted, marginTop:4}}><span>used</span><span style={{color:theme.fg, fontVariantNumeric:'tabular-nums'}}>{memPct}%</span></div>
                    </div>
                  </div>
                  <div style={{flex:1, minHeight:0, display:'flex', flexDirection:'column', border:`1px solid ${theme.surf}`, borderRadius:3, position:'relative'}}>
                    <div style={{position:'absolute', top:-7, left:8, background:theme.bg, padding:'0 4px', fontSize:10, color:theme.muted, whiteSpace:'nowrap'}}>proc <span style={{color:theme.fg}}>{procs.length}</span> running · sorted by <span style={{color:theme.fg}}>{sortKey}</span></div>
                    <div style={{flex:1, minHeight:0, overflowY:'auto', overflowX:'hidden', padding:'6px 8px'}}>
                      <div style={{display:'grid', gridTemplateColumns:'38px minmax(0,1fr) 42px 44px', gap:'0 8px', fontSize:11, color:theme.dim, padding:'4px 0 3px', borderBottom:`1px solid ${theme.surf}`, userSelect:'none'}}>
                        <span onClick={()=>setSortKey('pid')} style={{cursor:'pointer', color: sortKey==='pid'? theme.fg: theme.dim}}>pid</span><span>program</span><span onClick={()=>setSortKey('mem')} style={{cursor:'pointer', textAlign:'right', color: sortKey==='mem'? theme.fg: theme.dim}}>mem</span><span onClick={()=>setSortKey('cpu')} style={{cursor:'pointer', textAlign:'right', color: sortKey==='cpu'? theme.fg: theme.dim}}>cpu%</span>
                      </div>
                      {sortedProcs.map(p=>{
                        const isSel = p.pid===selPid;
                        // htop exact: tiny per-proc cpu bar behind %
                        const barW = Math.min(100, Math.max(4, (p.cpu/18)*100));
                        return (
                          <div key={p.pid} onClick={()=>setSelPid(p.pid)} style={{
                            cursor:'pointer', display:'grid', gridTemplateColumns:'38px minmax(0,1fr) 42px 44px', gap:'0 8px', fontSize:12, padding:'4px 6px', margin:'0 -6px', borderBottom: `1px solid ${theme.bg2}`, alignItems:'center', background: isSel? theme.surf: 'transparent', borderRadius:2, transition:'background 120ms'
                          }}>
                            <span style={{color: isSel? theme.yellow: theme.dim, fontVariantNumeric:'tabular-nums'}}>{p.pid}</span>
                            <span style={{minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}><span style={{color:theme.fg, fontWeight:500}}>{p.name}</span><span style={{color:theme.muted}}> {p.desc}</span></span>
                            <span style={{textAlign:'right', color:theme.muted, fontVariantNumeric:'tabular-nums'}}>{fmtMem(p.memMB)}</span>
                            <span style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6}}>
                              <span style={{flex:'none', width:28, height:4, borderRadius:2, background: theme.surf, overflow:'hidden', display:'block'}}>
                                <span style={{display:'block', height:'100%', width: `${barW}%`, background: p.cpu>12? theme.green: p.cpu>6? theme.yellow: theme.muted, borderRadius:2, transition:'width 220ms linear'}} />
                              </span>
                              <span style={{textAlign:'right', color: p.cpu>8? theme.green: theme.muted, fontVariantNumeric:'tabular-nums', minWidth:32}}>{p.cpu.toFixed(1)}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{flex:'none', borderTop:`1px solid ${theme.surf}`, padding:'5px 8px', fontSize:11, color:theme.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}><span style={{color:theme.green}}>▸ </span>{selDetail}</div>
                  </div>
                </div>
              </div>

              {/* NEW: Audio Visualizer below htop - per requirements, use pui package style */}
              <AudioVisualizer theme={theme} compact={isMobile} />
            </div>

            {/* vertical splitter */}
            {!isMobile && <div style={{width:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'col-resize'}}><span style={{display:'block', height:28, width:2, borderRadius:1, background: theme.dim, opacity:0.6}}></span></div>}

            {/* right: nvim */}
            <div onMouseDown={()=>setPane(2)} style={{
              background: theme.bg, border:`1px solid ${pane===2? theme.yellow: theme.surf}`, borderRadius:6, display:'flex', flexDirection:'column', minHeight: isMobile? 520:0, flex:1, overflow:'hidden', boxShadow: pane===2? `0 0 0 1px ${theme.yellow}30`:'none'
            }}>
              <div style={{position:'absolute', top:-8, left:12, background:theme.bg, padding:'0 6px', fontSize:11, color: theme.muted, whiteSpace:'nowrap', display:'none'}}></div>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute', top:-8, left:12, background: theme.bg, padding:'0 6px', fontSize:11, color: theme.muted, whiteSpace:'nowrap', zIndex:1}}>2: nvim</div>
              </div>
              <div style={{display:'flex', background: theme.bg2, flex:'none', overflow:'hidden', marginTop:6, borderRadius:'3px 3px 0 0'}}>
                {files.map((f,idx)=>(
                  <button key={idx} onClick={()=>setOpenIdx(idx)} title={f.path} style={{
                    cursor:'pointer', fontFamily:'inherit', fontSize:12, padding:'7px 10px', border:'none', borderRight:`1px solid ${theme.bg}`, background: idx===openIdx? theme.bg: theme.bg2, color: idx===openIdx? theme.fg: theme.muted, fontWeight: idx===openIdx?700:400, whiteSpace:'nowrap', display:'flex', gap:6, alignItems:'center', flex:'0 1 auto', minWidth:0, overflow:'hidden', textOverflow:'ellipsis'
                  }}>
                    <span style={{color:theme.dim, fontSize:11}}>{idx+1}</span>{f.name}<span style={{color: theme.yellow}}>{idx===openIdx? '*':''}</span>
                  </button>
                ))}
                <div style={{flex:1, background: theme.bg2}}></div>
              </div>
              <div style={{flex:1, minHeight:0, overflowY:'auto', overflowX:'hidden', padding:'8px 0 10px', fontSize:12.5, lineHeight:'20px', display:'flex', flexDirection:'column'}}>
                {mdToLines(currentFile.md, theme).map((ln)=>{
                  const nColor = ln.type==='h1'? theme.blue: ln.type==='h2'? theme.magenta: theme.dim;
                  if(ln.type==='blank') return <div key={ln.key} style={{height:8}}></div>;
                  if(ln.type==='h1') return <div key={ln.key} style={{display:'flex', paddingRight:16}}><span style={{flex:'none', width:44, textAlign:'right', paddingRight:14, color:theme.blue, userSelect:'none', fontSize:11}}>{ln.key+1}</span><span style={{flex:1, fontWeight:800, fontSize:15, color:theme.fg, borderBottom:`1px solid ${theme.surf}`, paddingBottom:4}}>{ln.text}</span></div>;
                  if(ln.type==='h2') return <div key={ln.key} style={{display:'flex', paddingRight:16, marginTop:6}}><span style={{flex:'none', width:44, textAlign:'right', paddingRight:14, color:theme.magenta, userSelect:'none', fontSize:11}}>{ln.key+1}</span><span style={{flex:1, fontWeight:700, color:theme.fg, fontSize:13}}>{renderInline(ln.text, theme)}</span></div>;
                  if(ln.type==='quote') return <div key={ln.key} style={{display:'flex', paddingRight:16}}><span style={{flex:'none', width:44, textAlign:'right', paddingRight:14, color:theme.dim, userSelect:'none', fontSize:11}}>{ln.key+1}</span><span style={{flex:1, color:theme.muted, borderLeft:`2px solid ${theme.surf}`, paddingLeft:8, fontSize:11.5}}>{renderInline(ln.text, theme)}</span></div>;
                  if(ln.type==='bullet') return <div key={ln.key} style={{display:'flex', paddingRight:16}}><span style={{flex:'none', width:44, textAlign:'right', paddingRight:14, color:theme.dim, userSelect:'none', fontSize:11}}>{ln.key+1}</span><span style={{flex:1, color:theme.fg, paddingLeft:4}}><span style={{color:theme.cyan}}>•</span> {renderInline(ln.text, theme)}</span></div>;
                  // sh file
                  if(currentFile.type==='sh'){
                    return <div key={ln.key} style={{display:'flex', paddingRight:16}}><span style={{flex:'none', width:44, textAlign:'right', paddingRight:14, color:theme.dim, userSelect:'none', fontSize:11}}>{ln.key+1}</span><span style={{flex:1, color: ln.text.startsWith('#')? theme.dim: ln.text.startsWith('open')? theme.green: theme.fg, whiteSpace:'pre-wrap', overflowWrap:'anywhere'}}>{ln.text}</span></div>;
                  }
                  return <div key={ln.key} style={{display:'flex', paddingRight:16}}><span style={{flex:'none', width:44, textAlign:'right', paddingRight:14, color:theme.dim, userSelect:'none', fontSize:11}}>{ln.key+1}</span><span style={{flex:1, color:theme.fg, whiteSpace:'pre-wrap', overflowWrap:'anywhere'}}>{renderInline(ln.text, theme)}</span></div>;
                })}
                <div style={{display:'flex', paddingLeft:44, color:theme.dim}}><span style={{width:44, textAlign:'right', paddingRight:14, marginLeft:-44}}>~</span></div>
              </div>
              {/* help */}
              {helpOpen && (
                <div style={{background: theme.bg, borderTop:`1px solid ${theme.surf}`, padding:'12px 14px', fontSize:12, lineHeight:1.6}}>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:'14px 24px'}}>
                    {[
                      {title:'normal', keys:[{k:'h j k l',v:'move'},{k:'w b 0 $',v:'word / line motions'},{k:'gg / G',v:'top / bottom'},{k:'i a o',v:'insert'},{k:'v / V',v:'visual / line'},{k:'R',v:'replace'},{k:'x',v:'delete char'},{k:'Tab',v:'next buffer'},{k:'<leader> = Space',v:''}]},
                      {title:'visual', keys:[{k:'h j k l',v:'extend'},{k:'w b 0 $',v:'word / line motions'},{k:'y',v:'yank to clipboard'},{k:'d x',v:'delete'},{k:'c',v:'change'},{k:'o',v:'swap anchor'}]},
                      {title:'tmux  C-b', keys:[{k:'0 1 2',v:'zsh / htop / nvim'},{k:'o',v:'next pane'},{k:'h j k l',v:'move panes'},{k:'t',v:'cycle theme'}]},
                      {title:'shell', keys:[{k:'help',v:'list commands'},{k:'nvim <file>',v:'open in pane 2'},{k:'Tab',v:'complete'},{k:'↑ ↓',v:'history'},{k:'Ctrl-L',v:'clear'},{k:'htop',v:''},{k:'j k',v:'select'},{k:'P M N',v:'sort cpu / mem / pid'}]},
                    ].map(g=>(
                      <div key={g.title} style={{minWidth:0}}>
                        <div style={{color:theme.magenta, fontWeight:700, marginBottom:4}}>{g.title}</div>
                        {g.keys.map((kk,i)=> <div key={i} style={{display:'flex', gap:10, whiteSpace:'nowrap'}}><span style={{color:theme.yellow, flex:'none', minWidth:72}}>{kk.k}</span><span style={{color:theme.fg, overflow:'hidden', textOverflow:'ellipsis'}}>{kk.v}</span></div>)}
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:14, color:theme.dim, fontSize:11}}> ? or Esc to close</div>
                </div>
              )}
              <div style={{display:'flex', flex:'none', fontSize:11.5, alignItems:'stretch', background: theme.bg2}}>
                <span style={{background: theme.blue, color:theme.bg, fontWeight:700, padding:'3px 10px'}}>NORMAL</span>
                <span style={{background: theme.surf, color:theme.fg, padding:'3px 10px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'40%'}}> {currentFile.path}</span>
                <span style={{color:theme.muted, padding:'3px 10px', flex:'1 1 0%', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Space = leader · ? for all keys</span>
                <span onClick={()=>setHelpOpen(v=>!v)} title="keymap (?)" style={{cursor:'pointer', color:theme.yellow, padding:'3px 10px', fontWeight:700}}>? </span>
                <span style={{color:theme.muted, padding:'3px 10px'}}>markdown</span>
                <span style={{background: theme.surf, color:theme.fg, padding:'3px 10px'}}>{currentFile.md.split('\n').length}L</span>
                <span style={{background: theme.blue, color:theme.bg, fontWeight:700, padding:'3px 10px'}}>Top</span>
              </div>
            </div>
          </div>

          {/* tmux status bar */}
          <div style={{display:'flex', alignItems:'stretch', background: theme.green, color: theme.bg, fontSize:11.5, flex:'none', overflow:'hidden'}}>
            <span style={{background: theme.yellow, padding:'3px 10px', fontWeight:700}}>[sameh]</span>
            {[
              {label:'0:zsh*', active: pane===0},
              {label:'1:htop', active: pane===1},
              {label:'2:nvim', active: pane===2},
            ].map((w,i)=>(
              <span key={i} onClick={()=>setPane(i)} style={{cursor:'pointer', padding:'3px 8px', opacity: w.active?1:0.8, fontWeight: w.active?700:400}}>{w.label}</span>
            ))}
            <span style={{flex:'1 1 0%'}}></span>
            <a href="https://samehkhamis.com/" style={{padding:'3px 10px', whiteSpace:'nowrap', color: theme.bg, textDecoration:'none'}}>samehkhamis.com</a>
            <span style={{padding:'3px 10px', whiteSpace:'nowrap', display: isMobile?'none':'inline'}}>Bay Area, CA</span>
            <span style={{background: theme.yellow, padding:'3px 10px', fontWeight:700, whiteSpace:'nowrap'}}>{clock}</span>
          </div>

          {/* crt overlay */}
          <div style={{position:'fixed', inset:0, pointerEvents:'none', background:'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)', mixBlendMode:'multiply', zIndex:9, display: isFull? 'block':'none'}}></div>
          <div style={{position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)', zIndex:9}}></div>
        </div>

        <button onClick={()=>setIsFull(false)} title="restore terminal" style={{position:'fixed', left:'50%', bottom:18, margin:'0 0 0 -22px', width:44, height:44, borderRadius:10, background: theme.bg, border:`1px solid ${theme.surf}`, display: isFull? 'flex':'none', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 6px 20px rgba(0,0,0,0.4)'}}>
          <span style={{display:'block', width:22, height:16, border:`1.5px solid ${theme.fg}`, borderRadius:3, position:'relative'}}><span style={{position:'absolute', left:4, top:3, color:theme.green, font:'700 8px/1 Fira Code, monospace'}}>&gt;_</span></span>
        </button>

        {confirmOpen && (
          <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.45)', zIndex:20}}>
            <div style={{background: theme.bg, border:`1px solid ${theme.surf}`, borderRadius:6, padding:'16px 18px', minWidth:280, boxShadow:'0 12px 40px rgba(0,0,0,0.5)', fontSize:12.5}}>
              <div style={{color:theme.fg, marginBottom:12}}><span style={{color:theme.yellow, fontWeight:700}}>tmux:</span> kill session <span style={{color:theme.green}}>sameh</span> and power off? <span style={{color:theme.dim}}>[y/N]</span></div>
              <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                <button onClick={()=>setConfirmOpen(false)} style={{cursor:'pointer', fontFamily:'inherit', fontSize:12, padding:'5px 12px', borderRadius:4, border:`1px solid ${theme.surf}`, background:theme.bg2, color:theme.fg}}>cancel <span style={{color:theme.dim}}>N</span></button>
                <button onClick={()=>{setConfirmOpen(false); setIsMin(true);}} style={{cursor:'pointer', fontFamily:'inherit', fontSize:12, padding:'5px 12px', borderRadius:4, border:`1px solid ${theme.red}`, background:theme.red, color:theme.bg, fontWeight:700}}>power off <span style={{opacity:0.7}}>y</span></button>
              </div>
            </div>
          </div>
        )}
        {confirmOpen ? null : null}
      </div>
    </div>
  );
}
