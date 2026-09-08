import { useEffect, useRef } from 'react';

export default function IframeExact(){
  const ref = useRef(null);
  useEffect(()=>{
    const iframe = ref.current;
    if(!iframe) return;
    const inject = ()=>{
      try{
        const doc = iframe.contentDocument;
        if(!doc) return;
        // avoid double inject
        if(doc.getElementById('__audio_injected')) return;

        // find htop pane: it's the second pane in left column — search by text "1: htop"
        const htopLabel = Array.from(doc.querySelectorAll('*')).find(el=> el.textContent?.trim()==='1: htop — now');
        const htopPane = htopLabel ? htopLabel.closest('div[style*="border"]')?.parentElement : null;
        // fallback: find element with data-dc-tpl containing htop
        const target = htopPane || doc.querySelector('div[style*="htop"]')?.parentElement || doc.body;

        const wrapper = doc.createElement('div');
        wrapper.id = '__audio_injected';
        wrapper.setAttribute('style', 'margin-top:8px; border:1px solid var(--surf); border-radius:3px; background:var(--bg); padding:8px 10px; position:relative;');
        wrapper.innerHTML = `
          <div style="position:absolute; top:-7px; left:8px; background:var(--bg); padding:0 4px; font-size:10px; color:var(--muted); white-space:nowrap;">audio <span style="color:var(--fg)">visualizer</span> <span style="color:var(--dim)">· pui / cava</span></div>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
            <button id="av-play" style="cursor:pointer; font-family:inherit; font-size:11px; padding:4px 10px; border-radius:4px; border:1px solid var(--surf); background:var(--bg2); color:var(--fg); font-weight:700;">▶ play</button>
            <div style="display:flex; gap:4px;">
              <button data-mode="bars" class="av-mode" style="cursor:pointer; font-family:inherit; font-size:11px; padding:3px 7px; border-radius:4px; border:1px solid var(--cyan); background:var(--surf); color:var(--cyan);">bars</button>
              <button data-mode="waveform" class="av-mode" style="cursor:pointer; font-family:inherit; font-size:11px; padding:3px 7px; border-radius:4px; border:1px solid var(--surf); background:transparent; color:var(--muted);">waveform</button>
              <button data-mode="radial" class="av-mode" style="cursor:pointer; font-family:inherit; font-size:11px; padding:3px 7px; border-radius:4px; border:1px solid var(--surf); background:transparent; color:var(--muted);">radial</button>
            </div>
            <label style="display:flex; align-items:center; gap:4px; font-size:11px; color:var(--muted);"><input id="av-mic" type="checkbox" /> mic</label>
            <span id="av-status" style="font-size:10px; color:var(--dim); margin-left:auto;">synthetic demo · 48 bands · 60fps</span>
            <input id="av-file" type="file" accept="audio/*" style="font-size:10px; max-width:120px;" />
          </div>
          <canvas id="av-canvas" width="680" height="84" style="width:100%; height:84; display:block; border-radius:2px; background:var(--bg2); border:1px solid var(--surf);"></canvas>
          <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--dim); margin-top:4px;"><span id="av-left">○ idle · bars</span><span>below htop · Web Audio API · most famous cava style</span></div>
        `;
        // insert after htop pane (which is inside left column)
        if(htopPane && htopPane.parentElement){
          // htopPane's parent is left column; insert after htop pane but before any splitter after
          const leftCol = htopPane.parentElement;
          // htop is second child after zsh, find its index and insert after
          leftCol.appendChild(wrapper); // append at end of left col (after htop) — visual is below htop
        } else {
          doc.body.appendChild(wrapper);
        }

        // wire up canvas logic (vanilla copy of AudioVisualizer)
        const canvas = doc.getElementById('av-canvas');
        const ctx = canvas.getContext('2d');
        const playBtn = doc.getElementById('av-play');
        const status = doc.getElementById('av-status');
        const leftL = doc.getElementById('av-left');
        let mode='bars', playing=false, useMic=false, analyser=null, anim=null, ac=null;
        const bands=48;

        const renderBars=(data,W,H, theme)=>{
          const n=data.length, gap=2, barW=(W-(n-1)*gap)/n;
          for(let i=0;i<n;i++){
            const v=data[i]/255; const h=Math.max(2, v*(H-10)); const x=i*(barW+gap); const y=H-h-4;
            const cs = getComputedStyle(doc.documentElement);
            // fallback colors if CSS vars not resolved in canvas ctx (use theme via computed)
            const cyan = cs.getPropertyValue('--cyan').trim()||'#94e2d5';
            const blue = cs.getPropertyValue('--blue').trim()||'#89b4fa';
            const yellow = cs.getPropertyValue('--yellow').trim()||'#f9e2af';
            const grad=ctx.createLinearGradient(0,y,0,y+h); grad.addColorStop(0,cyan); grad.addColorStop(1,blue);
            ctx.fillStyle=grad;
            const r=2; ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y); ctx.quadraticCurveTo(x+barW,y,x+barW,y+r); ctx.lineTo(x+barW,y+h); ctx.lineTo(x,y+h); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); ctx.fill();
            if(v>0.7){ ctx.fillStyle=yellow+'55'; ctx.fillRect(x,y-6,barW,2); }
          }
        };
        const renderWave=(time,W,H)=>{
          const cs=getComputedStyle(doc.documentElement); const green=cs.getPropertyValue('--green').trim()||'#a6e3a1';
          ctx.strokeStyle=green; ctx.lineWidth=1.7; ctx.beginPath();
          for(let i=0;i<time.length;i++){ const x=i/time.length*W; const y=time[i]/255*H; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }
          ctx.stroke(); ctx.fillStyle=green+'18'; ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
        };
        const renderRadial=(freq,W,H)=>{
          const cs=getComputedStyle(doc.documentElement); const magenta=cs.getPropertyValue('--magenta').trim()||'#cba6f7'; const cyan=cs.getPropertyValue('--cyan').trim()||'#94e2d5';
          const cx=W/2, cy=H/2, R=Math.min(W,H)*0.38, N=64; ctx.strokeStyle=magenta; ctx.lineWidth=1.2;
          for(let i=0;i<N;i++){ const v=(freq[Math.floor(i/freq.length*N*0.6)]||0)/255; const ang=i/N*Math.PI*2; const r0=R*0.55, r1=r0+v*R*0.55; const x0=cx+Math.cos(ang)*r0, y0=cy+Math.sin(ang)*r0; const x1=cx+Math.cos(ang)*r1, y1=cy+Math.sin(ang)*r1; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); }
          ctx.fillStyle=cyan; ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2); ctx.fill();
        };

        const ensure = async (mic=false)=>{
          if(analyser) return analyser;
          const AC = window.AudioContext || window.webkitAudioContext;
          if(!AC) return null;
          ac = new AC(); analyser=ac.createAnalyser(); analyser.fftSize=1024; analyser.smoothingTimeConstant=0.86;
          if(mic){
            try{ const s=await navigator.mediaDevices.getUserMedia({audio:true}); const src=ac.createMediaStreamSource(s); src.connect(analyser); }
            catch(e){ status.textContent='mic denied'; return null; }
          } else {
            const osc=ac.createOscillator(); osc.frequency.value=0; const g=ac.createGain(); g.gain.value=0; osc.connect(g); g.connect(analyser); osc.start(); analyser.__synthetic=true; analyser.__ac=ac;
          }
          analyser.__ac=ac; return analyser;
        };
        const draw=()=>{
          if(!playing || !analyser) return;
          const W=canvas.width, H=canvas.height;
          const surf=getComputedStyle(doc.documentElement).getPropertyValue('--surf').trim()||'#313244';
          ctx.clearRect(0,0,W,H); ctx.strokeStyle=surf+'55'; ctx.lineWidth=1; for(let i=0;i<4;i++){ const y=H/4*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
          if(analyser.__synthetic){
            const t=Date.now()/300; const data=new Uint8Array(bands);
            for(let i=0;i<bands;i++){ const base=Math.sin(t*0.4+i*0.22)*0.3+Math.cos(t*0.18-i*0.13)*0.25; const env=0.55+0.45*Math.sin(t*0.07+i*0.04); const v=Math.max(0,Math.min(1,0.5+base*env)); data[i]=Math.floor(v*255); }
            renderBars(data,W,H);
          } else {
            const freq=new Uint8Array(analyser.frequencyBinCount), time=new Uint8Array(analyser.fftSize);
            analyser.getByteFrequencyData(freq); analyser.getByteTimeDomainData(time);
            if(mode==='waveform') renderWave(freq,W,H, 'wave');
            // actually call proper
            if(mode==='waveform') renderWave(time,W,H);
            else if(mode==='radial') renderRadial(freq,W,H);
            else { const data=new Uint8Array(bands); const step=Math.floor(freq.length/bands*0.55); for(let i=0;i<bands;i++) data[i]=freq[i*step]||0; renderBars(data,W,H); }
          }
          anim=requestAnimationFrame(draw);
        };
        playBtn.onclick=async ()=>{
          if(!playing){
            const a=await ensure(useMic);
            if(!a) return;
            playing=true; playBtn.textContent='■ stop'; playBtn.style.background='var(--green)'; playBtn.style.color='var(--bg)'; playBtn.style.borderColor='var(--green)'; leftL.textContent='● live · '+mode;
            draw();
          } else {
            playing=false; playBtn.textContent='▶ play'; playBtn.style.background='var(--bg2)'; playBtn.style.color='var(--fg)'; playBtn.style.borderColor='var(--surf)'; leftL.textContent='○ idle · '+mode;
            if(anim) cancelAnimationFrame(anim);
            const W=canvas.width,H=canvas.height; const surf=getComputedStyle(doc.documentElement).getPropertyValue('--surf').trim()||'#313244'; const dim=getComputedStyle(doc.documentElement).getPropertyValue('--dim').trim()||'#6c7086';
            ctx.clearRect(0,0,W,H); ctx.strokeStyle=surf+'55'; ctx.lineWidth=1; for(let i=0;i<4;i++){ const y=H/4*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
            ctx.strokeStyle=dim; ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
          }
        };
        doc.querySelectorAll('.av-mode').forEach(b=>{
          b.onclick=()=>{
            mode=b.dataset.mode;
            doc.querySelectorAll('.av-mode').forEach(x=>{ x.style.borderColor='var(--surf)'; x.style.background='transparent'; x.style.color='var(--muted)'; });
            b.style.borderColor='var(--cyan)'; b.style.background='var(--surf)'; b.style.color='var(--cyan)';
            leftL.textContent=(playing?'● live · ':'○ idle · ')+mode;
          };
        });
        doc.getElementById('av-mic').onchange=(e)=>{ useMic=e.target.checked; if(playing){ playing=false; playBtn.click(); } analyser=null; if(ac) try{ac.close();}catch{} ac=null; };
        const fileIn=doc.getElementById('av-file');
        fileIn.onchange=async (e)=>{
          const f=e.target.files?.[0]; if(!f) return;
          const AC=window.AudioContext||window.webkitAudioContext; const nAc=new AC(); const an=nAc.createAnalyser(); an.fftSize=1024; an.smoothingTimeConstant=0.85;
          const url=URL.createObjectURL(f); const audio=new Audio(url); audio.crossOrigin='anonymous'; audio.loop=true; await audio.play();
          const src=nAc.createMediaElementSource(audio); src.connect(an); an.connect(nAc.destination);
          analyser=an; analyser.__ac=nAc; ac=nAc; useMic=false; doc.getElementById('av-mic').checked=false;
          if(!playing) playBtn.click();
        };
        // idle grid
        const W=canvas.width,H=canvas.height; const surf=getComputedStyle(doc.documentElement).getPropertyValue('--surf').trim()||'#313244'; const dim=getComputedStyle(doc.documentElement).getPropertyValue('--dim').trim()||'#6c7086';
        ctx.clearRect(0,0,W,H); ctx.strokeStyle=surf+'55'; ctx.lineWidth=1; for(let i=0;i<4;i++){ const y=H/4*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
        ctx.strokeStyle=dim; ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
      }catch(e){ console.error('audio inject failed',e); }
    };
    iframe.addEventListener('load', inject);
    // if already loaded
    if(iframe.contentDocument && iframe.contentDocument.readyState==='complete'){
      setTimeout(inject, 600);
    }
    // also poll until htop appears (dc runtime async)
    const poll=setInterval(()=>{
      try{
        const doc=iframe.contentDocument;
        if(doc && doc.querySelector('canvas#av-canvas')){ clearInterval(poll); return; }
        if(doc && doc.body && doc.body.innerHTML.includes('1: htop')) inject();
      }catch{}
    }, 800);
    return ()=>{ clearInterval(poll); iframe.removeEventListener('load', inject); };
  },[]);
  return (
    <iframe
      ref={ref}
      src="/clone-assets/index-raw.html"
      title="sameh exact clone"
      style={{width:'100%', height:'100vh', border:'none', display:'block', background:'#181825'}}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
