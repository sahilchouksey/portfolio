import { useEffect, useRef, useState } from 'react';
import { seed as fsSeed, VFS as SeedVFS } from './fs-seed.js';

export default function IframeExact(){
  const ref = useRef(null);
  const [siteHelp, setSiteHelp] = useState(false);
  const [siteCmd, setSiteCmd] = useState({ open:false, val:'' });
  const [tmuxPrefix, setTmuxPrefix] = useState(false);
  // use window global for prefix to avoid React stale closure spamming
  // eslint-disable-next-line no-unused-vars
  const tmuxPrefixRef = useRef(false);
  // global site-level vim/tmux bindings (outer) — entire app keybinding-only, no mouse needed
  useEffect(()=>{
    const getIframe = ()=> ref.current;
    // ensure window global exists
    if(typeof window !== 'undefined' && window.__tmuxPrefix===undefined) window.__tmuxPrefix=false;
    const isTyping = (el)=> el && (el.tagName==='INPUT' || el.tagName==='TEXTAREA' || el.isContentEditable);
    const forwardToIframe = (key, opts={})=>{
      try{
        const doc = iframe?.contentDocument;
        if(!doc) return;
        const ev = new KeyboardEvent('keydown', { key, code: key.length===1 ? `Key${key.toUpperCase()}`: key, bubbles:true, cancelable:true, metaKey: !!opts.meta, ctrlKey: !!opts.ctrl, shiftKey: !!opts.shift, altKey: !!opts.alt });
        // try dispatch on iframe window and document
        const win = iframe.contentWindow;
        win?.dispatchEvent(ev);
        doc.dispatchEvent(ev);
        // also dispatch on focused element inside
        const ae = doc.activeElement;
        if(ae) ae.dispatchEvent(ev);
      }catch{}
    };
    const onOuterKey = (e)=>{
      if(e.repeat) return; // prevent spamming kkkk on hold
      const iframe = getIframe();
      // if nvim textarea inside iframe is focused, let inner tmux handle C-b to avoid double prefix
      // removed isTyping/innerAE early return for C-b — ensure tmux prefix works even when textarea focused (was blocking)
      if(siteCmd.open){
        if(e.key==='Escape'){ e.preventDefault(); setSiteCmd({open:false,val:''}); return; }
        if(e.key==='Enter'){
          e.preventDefault();
          const v=siteCmd.val.trim();
          if(/^pane\s+[0-2]$/.test(v)){ const n=parseInt(v.split(/\s+/)[1],10); try{ iframe?.contentWindow?.__exactSetPane(n); }catch{} }
          else if(v==='site' || v==='/ site'){ try{ iframe?.contentDocument?.querySelector('a[href="https://samehkhamis.com"]')?.click(); }catch{} }
          else if(v.startsWith('theme ')){ try{ iframe?.contentWindow?.dispatchEvent(new KeyboardEvent('keydown',{key:'t',bubbles:true})); }catch{} }
          else if(v==='help' || v==='?'){ setSiteHelp(true); }
          setSiteCmd({open:false,val:''});
          return;
        }
        return;
      }
      // isTyping check moved after tmux prefix handling to allow C-b even when typing
      const k = e.key;
      const meta = e.metaKey || e.ctrlKey;

      // tmux prefix C-a (local config) + C-b (compat) — entire app keyboard-only
      if(e.ctrlKey && (k==='b'||k==='a')){ e.preventDefault(); e.stopPropagation(); window.__tmuxPrefix=true; tmuxPrefixRef.current=true; setTmuxPrefix(true); setTimeout(()=>{ window.__tmuxPrefix=false; tmuxPrefixRef.current=false; setTmuxPrefix(false); }, 2500); return; }
      if(window.__tmuxPrefix){
        e.preventDefault(); e.stopPropagation(); window.__tmuxPrefix=false; tmuxPrefixRef.current=false; setTmuxPrefix(false);
        const map = { '0':0,'1':1,'2':2,'o':'next','h':'left','j':'down','k':'up','l':'right','ArrowLeft':'left','ArrowRight':'right','ArrowUp':'up','ArrowDown':'down','t':'theme','?':'help',' ':'next','n':'next','p':'prev',';':'last','z':'zoom','x':'kill','c':'new' };
        const act = map[k];
        const iframe2 = getIframe();
        if(act!==undefined){
          if(typeof act==='number'){ try{ iframe2?.contentWindow?.__exactSetPane(act); }catch{} }
          else if(act==='next'){ try{ iframe2?.contentWindow?.__exactPaneSwitch(1); }catch{} }
          else if(act==='theme'){ try{ iframe2?.contentWindow?.dispatchEvent(new KeyboardEvent('keydown',{key:'t',bubbles:true})); }catch{} }
          else if(act==='help'){ setSiteHelp(v=>!v); }
          else if(['left','down','up','right'].includes(act)){
            try{
              const win2 = iframe2?.contentWindow;
              if(win2?.__exactMoveDir) win2.__exactMoveDir(act);
              else win2?.__exactPaneSwitch(act==='down'||act==='right'?1:-1);
            }catch{}
          }
        }
        return;
      }
      // ':' inside nvim opens VIM ex (palette in vim mode), elsewhere site palette
      try{
        const iw=getIframe()?.contentWindow;
        if(iw&&iw.__nvimActive&&iw.__nvimActive()&&k===':'&&!meta){ e.preventDefault(); setSiteCmd({open:true,val:':',vim:true}); return; }
      }catch{}
      if(isTyping(document.activeElement)) return;

      // site-level ":" and "/" — entire app keyboard navigation (no mouse)
      if(k===':' && !meta){ e.preventDefault(); setSiteCmd({open:true,val:''}); return; }
      if(k==='/' && !meta && !e.shiftKey){ e.preventDefault(); setSiteCmd({open:true,val:'site '}); return; }

      // global ? handler — site-level tmux help (preserve iframe's own ? when in nvim)
      if(k==='?' || (k==='/' && e.shiftKey)){
        // if iframe's help is open, let it close; otherwise show site help
        // detect if iframe currently shows its help overlay
        try{
          const doc = iframe?.contentDocument;
          const iframeHelpOpen = doc && doc.body.innerHTML.includes('? or Esc to close') && getComputedStyle(doc.body.querySelector('div[style*="borderTop"]')||doc.body).display!=='none';
          // we treat outer ? as site tmux help when not in nvim pane visual focus
          // toggle site help instead of forwarding
          e.preventDefault();
          setSiteHelp(v=>!v);
          return;
        }catch{}
      }
      if(k==='Escape' && siteHelp){ e.preventDefault(); setSiteHelp(false); return; }

      // outer fires only when focus is OUTSIDE the iframe: direct calls only (no event
      // forwarding — inner capture owns real keypresses; forwarding caused double handling).
      const W = ()=> iframe?.contentWindow;
      if(meta && (k==='j' || k==='J' || k==='k' || k==='K')){
        e.preventDefault();
        try{ W()?.__exactPaneSwitch(k.toLowerCase()==='j'?1:-1); W()?.__paintPanes&&W().__paintPanes(); }catch{}
        return;
      }
      if(meta && (k==='h' || k==='H' || k==='l' || k==='L')){
        e.preventDefault();
        try{ const d=k.toLowerCase()==='l'?'right':'left'; if(W()?.__exactMoveDir) W().__exactMoveDir(d); }catch{}
        return;
      }
      if(meta && /^[0-2]$/.test(k)){
        e.preventDefault();
        try{ W()?.__exactSetPane(parseInt(k,10)); }catch{}
        return;
      }
      // scroll nvim buffer directly via DOM (no forwarding, no recursion)
      if(meta && (k==='d' || k==='u' || k==='f' || k==='b')){
        e.preventDefault();
        try{
          const cdoc=iframe?.contentDocument;
          const all=Array.from(cdoc.querySelectorAll('div[style*="overflow-y:auto"]'));
          const buf=all.find(x=>x.querySelector('[data-cur]'))||all[1]||all[0];
          if(buf) buf.scrollBy({top:(k==='d'||k==='f'?1:-1)*(k==='f'||k==='b'?420:220),behavior:'smooth'});
        }catch{}
        return;
      }
    };
    window.addEventListener('keydown', onOuterKey);
    return ()=> window.removeEventListener('keydown', onOuterKey);
  },[siteHelp, siteCmd]);

  useEffect(()=>{
    const iframe = ref.current;
    if(!iframe) return;
    const inject = ()=>{
      try{
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow;
        if(!doc || !win) return;
        // ---- tmux single window: 3 pane-images. Fiber-free: tmux status bar DOM is source of truth.
        // Layout: 0=top-left(zsh), 1=bottom-left(htop), 2=right(nvim full height).
        // ---- local tmux: hide site's green bottom bar, inject YOUR top bar (catppuccin mocha, prefix ^A, single window xix3r) ----
        const origBarEl=()=>{ try{ const m=Array.from(doc.querySelectorAll('span')).find(s=>((s.textContent||'').trim()==='[sameh]')); return m?m.parentElement:null; }catch{ return null; } };
        const hideOrigBar=()=>{
          try{
            const b=origBarEl(); if(b){ b.style.display='none'; b.style.height='0'; b.style.overflow='hidden'; }
            // also hide any other legacy green bar by bg
            Array.from(doc.querySelectorAll('div')).forEach(d=>{
              const bg=getComputedStyle(d).backgroundColor;
              if(bg==='rgb(166, 227, 161)' && d.textContent.includes('[sameh]')) d.style.display='none';
            });
          }catch{}
        };
        setTimeout(hideOrigBar, 400); setTimeout(hideOrigBar, 1200); setInterval(hideOrigBar, 2500);
        const statusBar=()=> doc.getElementById('__tmux_top');
        const statusTabs=()=>{ const bar=statusBar(); if(!bar) return []; return Array.from(bar.querySelectorAll('[data-win]')); };
        // source of truth is DC pane state (or hidden orig bar), NOT our top bar — otherwise
        // clicking the htop frame directly desyncs highlight (your report: focus htop but ring on terminal)
        const activeIdx=()=>{
          try{
            const c=resolveComp(); if(c&&typeof c.state.pane==='number') return c.state.pane;
          }catch{}
          try{
            const b=origBarEl(); if(b){
              const spans=Array.from(b.querySelectorAll('span')).filter(s=>/^\d:/.test(((s.textContent||'').trim())));
              const el=spans.find(s=>((s.textContent||'').includes('*')))||spans.find(s=>s.style.opacity==='1')||spans[0];
              if(el){ const m=/^(\d):/.exec((el.textContent||'').trim()); if(m) return parseInt(m[1],10); }
            }
          }catch{}
          const bar=statusBar(); if(!bar) return 0;
          const cur=bar.getAttribute('data-active');
          if(cur!=null) return parseInt(cur,10);
          const tabs=statusTabs(); const el=tabs.find(s=>s.classList.contains('__active'))||tabs[0]; const m=el?/^(\d):/.exec((el.textContent||'').trim()):null; return m?parseInt(m[1],10):0;
        };
        const buildTmux=function(){
          if(doc.getElementById('__tmux_top')) return doc.getElementById('__tmux_top');
          try{
            // same container as main content: the bordered terminal (border:1px solid + radius 8)
            const term=doc.querySelector('div[style*="border-radius:8"]')||doc.getElementById('dc-root')?.firstElementChild||doc.getElementById('dc-root')||doc.body;
            // icons: cross-browser — inline SVG, no Nerd Font dependency (was tofu on many browsers)
            // keep no external font load; Fira Code already present
            const host=term.parentElement||term;
            const top=doc.createElement('div');
            top.id='__tmux_top';
            top.setAttribute('data-active','0');
            top.style.cssText='display:flex;align-items:stretch;height:28px;background:#1e1e2e;color:#cdd6f4;font:500 11.5px/1 "JetBrains Mono","Fira Code",monospace;flex:none;overflow:hidden;user-select:none;border-bottom:1px solid #313244;border-radius:8px 8px 0 0;';
            top.innerHTML=`
              <div style="display:flex;align-items:stretch;gap:0;">
                <span id="__tmux_prefix" style="display:flex;align-items:center;gap:6px;padding:0 10px 0 8px;background:#313244;color:#a6e3a1;font-weight:700;border-radius:6px 0 0 0;">
                  <span style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:4px;background:#1e1e2e;color:inherit;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  </span>
                  <span style="color:#cdd6f4;">xix3r</span>
                </span>
                <span style="display:flex;align-items:center;padding:0 6px;color:#6c7086;font-size:10px;">│</span>
                <span data-win="0" class="__active" style="display:flex;align-items:center;gap:4px;padding:0 10px;background:#313244;color:#cdd6f4;border-radius:6px;margin:4px 2px;cursor:pointer;white-space:nowrap;">0: zsh</span>
                <span data-win="1" style="display:flex;align-items:center;gap:4px;padding:0 10px;background:#1e1e2e;color:#a6adc8;border:1px solid #313244;border-radius:6px;margin:4px 2px;cursor:pointer;white-space:nowrap;">1: htop</span>
                <span data-win="2" style="display:flex;align-items:center;gap:4px;padding:0 10px;background:#1e1e2e;color:#a6adc8;border:1px solid #313244;border-radius:6px;margin:4px 2px;cursor:pointer;white-space:nowrap;">2: nvim</span>
              </div>
              <div style="flex:1"></div>
              <div style="display:flex;align-items:stretch;gap:6px;padding:0 8px;">
                <span title="directory" style="display:flex;align-items:center;gap:6px;padding:0 8px;background:#313244;color:#f5c2e7;border-radius:6px;margin:4px 0;font-size:11px;white-space:nowrap;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg><span id="__tmux_dir" style="color:#cdd6f4;">~/portfolio</span></span>
                <span title="date_time" style="display:flex;align-items:center;gap:6px;padding:0 8px;background:#313244;color:#89b4fa;border-radius:6px;margin:4px 0;font-size:11px;white-space:nowrap;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span id="__tmux_clock" style="color:#cdd6f4;">00:00</span></span>
              </div>
            `;
            // inside same container as main content (first child of bordered terminal)
            if(term.firstChild) term.insertBefore(top, term.firstChild);
            else term.appendChild(top);
            top.querySelectorAll('[data-win]').forEach(el=>{
              el.addEventListener('click',()=>{
                const n=parseInt(el.getAttribute('data-win'),10);
                try{ if(win.__exactSetPane) win.__exactSetPane(n); }catch{}
              });
            });
            const tick=()=>{ try{ const c=doc.getElementById('__tmux_clock'); if(c) c.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); const d=doc.getElementById('__tmux_dir'); if(d){ const ae=activeIdx(); const paths=['~/','~/','~/portfolio']; d.textContent=paths[ae]||'~/'; } }catch{} };
            tick(); setInterval(tick, 30000);
            return top;
          }catch(e){ console.log('buildTmux err',e); return null; }
        };
        const ensureTmux=()=>{ try{ if(!doc.getElementById('__tmux_top')) buildTmux(); hideOrigBar(); }catch{} };
        ensureTmux(); setTimeout(ensureTmux,600); setTimeout(ensureTmux,1500);
        // highlight ring follows focus — must survive React re-renders (site rewrites border every tick)
        const paintPanes=()=>{
          try{
            const idx=activeIdx();
            const magenta='#cba6f7';
            const panes=[
              {txt:'0: zsh', sel:'div[style*="border"]'},
              {txt:'1: htop — now', sel:'div[style*="border"]'},
              {txt:'2: nvim', sel:'div[style*="border"]'},
            ];
            panes.forEach(({txt},i)=>{
              const lab=Array.from(doc.querySelectorAll('div')).find(d=>(d.textContent||'').trim()===txt);
              let frame=lab?lab.closest('div[style*="border"]')||lab.parentElement:null;
              if(!frame){
                // fallback: find by pane label id
                const all=Array.from(doc.querySelectorAll('div'));
                frame=all.find(d=> d.querySelector&&d.querySelector('div')&&Array.from(d.querySelectorAll('div')).some(x=>(x.textContent||'').trim()===txt));
              }
              if(!frame) return;
              if(i===idx){
                frame.style.borderColor=magenta;
                frame.style.boxShadow=`0 0 0 2px ${magenta}, inset 0 0 0 1px ${magenta}`;
                frame.style.outline='none';
              } else {
                frame.style.borderColor='';
                frame.style.boxShadow='';
                frame.style.outline='none';
              }
            });
            const top=doc.getElementById('__tmux_top');
            if(top){
              // don't clobber data-active if caller just set it — read it instead
              const curAttr=parseInt(top.getAttribute('data-active')||'-1',10);
              if(curAttr!==idx) top.setAttribute('data-active', String(idx));
              top.querySelectorAll('[data-win]').forEach(el=>{
                const n=parseInt(el.getAttribute('data-win'),10);
                const active=n===idx;
                el.classList.toggle('__active',active);
                el.style.background=active?'#313244':'#1e1e2e';
                el.style.color=active?'#cdd6f4':'#a6adc8';
                el.style.borderColor=active?'#cba6f7':'#313244';
                el.style.fontWeight=active?'700':'500';
              });
              const pref=top.querySelector('#__tmux_prefix');
              if(pref){
                const on=!!win.__tmuxPrefix;
                pref.style.color=on?'#1e1e2e':'#a6e3a1';
                pref.style.background=on?'#f38ba8':'#313244';
                pref.querySelector('span').style.background=on?'#f38ba8':'#1e1e2e';
                pref.querySelector('span').style.color=on?'#1e1e2e':'';
              }
            }
          }catch(e){ console.log('paintPanes err',e); }
        };
        win.__paintPanes=paintPanes;
        const setPaneNum=(n)=>{
          try{ win.__exactSetPane(n); }catch{}
          if(n===2){ setTimeout(()=>{ try{ if(win.__cmView) win.__cmView.focus(); }catch{} },80); }
          setTimeout(paintPanes,60);
        };
        // direct DC state (hidden bar is display:none, so synthetic click never fires)
        // cache comp once found — avoids repeated fiber walks
        const setDCpane=(n)=>{
          try{
            let c=win.__dcComp;
            if(!c||typeof c.state.pane!=='number'){ c=resolveComp(); if(c) win.__dcComp=c; }
            if(c&&typeof c.setState==='function'){ c.setState({pane:n}); return true; }
          }catch(e){ console.log('setDCpane err',e); }
          return false;
        };
        if(!win.__exactSetPane){
          win.__exactSetPane = (n)=>{
            const ok=setDCpane(n);
            if(!ok){ try{
              const b=origBarEl(); if(b){
                const spans=Array.from(b.querySelectorAll('span'));
                const target=spans.find(s=> (s.textContent||'').trim().startsWith(`${n}:`));
                if(target) target.click();
              }
            }catch{} }
            try{
              const top=doc.getElementById('__tmux_top');
              if(top){ top.setAttribute('data-active', String(n)); }
            }catch{}
            setTimeout(paintPanes,60);
            if(n===2){ setTimeout(()=>{ try{ if(win.__cmView) win.__cmView.focus(); }catch{} },80); }
          };
          win.__exactPaneSwitch = (dir)=>{
            try{ setPaneNum((activeIdx()+dir+3)%3); }catch{}
          };
          win.__exactMoveDir = (dir)=>{
            try{
              const cur=activeIdx(); let nxt=cur;
              // viewport-aware: right from either left pane -> right; left from right -> most recent left (0:zsh)
              if(dir==='left') nxt = cur===2 ? (win.__lastLeft!=null?win.__lastLeft:0) : cur;
              else if(dir==='right') nxt = (cur===0||cur===1) ? 2 : cur;
              else if(dir==='down') nxt = cur===0 ? 1 : cur;
              else if(dir==='up') nxt = cur===1 ? 0 : cur;
              if(nxt!==cur){ if(cur===0||cur===1) win.__lastLeft=cur; }
              setPaneNum(nxt);
            }catch(e){ console.log('moveDir err',e); }
          };
        }
        const tmuxKey=(k)=>{
          if(k==='0'||k==='1'||k==='2'){ setPaneNum(parseInt(k,10)); return; }
          if(k==='o'||k===' '||k==='n'){ try{win.__exactPaneSwitch(1);}catch{} setTimeout(paintPanes,60); return; }
          if(k==='p'){ try{win.__exactPaneSwitch(-1);}catch{} setTimeout(paintPanes,60); return; }
          if(k==='h'){ try{win.__exactMoveDir('left');}catch{} return; }
          if(k==='j'){ try{win.__exactMoveDir('down');}catch{} return; }
          if(k==='k'){ try{win.__exactMoveDir('up');}catch{} return; }
          if(k==='l'){ try{win.__exactMoveDir('right');}catch{} return; }
          // non-trusted synth: our capture ignores it, DC bubble handles theme natively
          if(k==='t'){ try{ doc.dispatchEvent(new KeyboardEvent('keydown',{key:'t',bubbles:true})); }catch{} return; }
          if(k==='?'){ try{ setSiteHelp(v=>!v); }catch{} return; }
        };
        // repo-vim primitives (no synthetic key dispatch — that caused handler recursion)
        const isCmFocused=(cv)=>{ try{ if(!cv) return false; const h=cv.hasFocus; return typeof h==='function'?!!h.call(cv):!!h; }catch{ return false; } };
        const cmMove=(cv,dl)=>{
          try{
            const st=cv.state, sel=st.selection.main;
            const vs=cv.cm&&cv.cm.state&&cv.cm.state.vim;
            const isV=!!(vs&&(vs.visualMode||vs.mode==='visual'))||sel.anchor!==sel.head;
            const curLine=st.doc.lineAt(sel.head);
            const target=Math.max(1,Math.min(st.doc.lines,curLine.number+dl));
            const line=st.doc.line(target);
            const col=Math.min(sel.head-curLine.from,line.length);
            const pos=line.from+col;
            cv.dispatch({selection:isV?{anchor:sel.anchor,head:pos}:{anchor:pos},scrollIntoView:true});
          }catch{}
        };
        const cmHalfScroll=(cv,dir,pages)=>{
          try{ const el=cv.scrollDOM; if(el) el.scrollBy({top:dir*el.clientHeight*0.5*(pages||1),behavior:'smooth'}); }catch{}
        };
        win.__cmMove=cmMove;
        // localStorage VFS (same JSON shape as clone-assets/fs.js) — buffer sync without fiber
        const lsGet=(k,d)=>{ try{ const v=win.localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch{ return d; } };
        const lsSet=(k,v)=>{ try{ win.localStorage.setItem(k,JSON.stringify(v)); }catch{} };
        const fsNode=(root,abs)=>{ let n=root; for(const part of abs.split('/').filter(Boolean)){ if(!n||n.t!=='d'||!n.c||!n.c[part]) return null; n=n.c[part]; } return n; };
        const readLSFile=(p)=>{ const s=lsGet('sk-fs-v25',null); if(!s||!s.root) return null; const n=fsNode(s.root,p); return n&&n.t==='f'?n.s:null; };
        const writeLSFile=(p,text)=>{ const s=lsGet('sk-fs-v25',null); if(!s||!s.root) return false; const n=fsNode(s.root,p); if(!n||n.t!=='f') return false; n.s=text; lsSet('sk-fs-v25',s); return true; };
        const seedLS=async ()=>{ if(lsGet('sk-fs-v25',null)) return true; try{ const vfs=new SeedVFS(fsSeed()); lsSet('sk-fs-v25',{root:vfs.toJSON(),cwd:vfs.cwd}); return true; }catch(e){ console.log('seedLS err',e); return false; } };
        const domLines=()=>{ const rows=Array.from(doc.querySelectorAll('[data-cur]')); if(!rows.length) return ''; return rows.map(d=>{ const t=d.textContent||''; const m=t.match(/^\s*\d+\s*/); return m?t.slice(m[0].length):t; }).join('\n'); };
        const nvimTabs=()=>Array.from(doc.querySelectorAll('button[title]')).filter(b=>/resume\/|\/home\//.test(b.title||'')).map(b=>({path:b.title,active:getComputedStyle(b).fontWeight==='700'}));
        const ensureCmCss=()=>{ if(doc.getElementById('__cmvim_css')) return; try{ const st=doc.createElement('style'); st.id='__cmvim_css'; st.textContent='#__dc_buf{display:none!important;}#__cmvim_host{flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;min-width:0;}'; doc.head.appendChild(st); }catch{} };
        // inner tmux prefix owns C-b end-to-end (capture beats DC bubble listener; replaces fiber patching)
        if(!win.__tmuxCap){
          win.__tmuxCap=true;
            const tmuxCapture=(e)=>{
              try{
                if(!e.isTrusted) return;
                const k=e.key, t=e.target;
                const inShellInput=t&&t.tagName==='INPUT';
                const ik=!!(e.ctrlKey&&k==='b')||!!(win.__tmuxPrefix);
                // C-b l/h/j/k + arrows must update highlight + pane focus regardless of cm focus
                if(e.ctrlKey&&k==='b'&&!inShellInput){
                  e.preventDefault(); e.stopPropagation();
                  win.__tmuxPrefix=true; try{setTmuxPrefix(true);}catch{}
                  clearTimeout(win.__tmuxTimer);
                  win.__tmuxTimer=setTimeout(()=>{ win.__tmuxPrefix=false; try{setTmuxPrefix(false);}catch{} },2500);
                  return;
                }
                if(win.__tmuxPrefix){
                  if(e.repeat) return;
                  e.preventDefault(); e.stopPropagation();
                  win.__tmuxPrefix=false; try{setTmuxPrefix(false);}catch{}
                  if(k==='ArrowLeft'){ try{setPaneNum(activeIdx()===2?0:0);}catch{} return; }
                  if(k==='ArrowRight'){ try{setPaneNum(activeIdx()===0||activeIdx()===1?2:2);}catch{} return; }
                  if(k==='ArrowUp'){ try{setPaneNum(activeIdx()===1?0:0);}catch{} return; }
                  if(k==='ArrowDown'){ try{setPaneNum(activeIdx()===0?1:1);}catch{} return; }
                  tmuxKey(k);
                  return;
                }
                const meta=e.metaKey||e.ctrlKey;
                if(meta&&!inShellInput){
                  const cv=win.__cmView;
                  if(k==='0'||k==='1'||k==='2'){ e.preventDefault(); e.stopPropagation(); setPaneNum(parseInt(k,10)); return; }
                  if(cv&&isCmFocused(cv)){
                    const lk=(k||'').toLowerCase();
                    if(lk==='j'||lk==='k'){ e.preventDefault(); e.stopPropagation(); cmMove(cv,lk==='j'?5:-5); return; }
                    if(k==='d'||k==='u'){ e.preventDefault(); e.stopPropagation(); const d=k==='d'?1:-1; cmMove(cv,d*12); cmHalfScroll(cv,d,1); return; }
                    if(k==='f'||k==='b'){ e.preventDefault(); e.stopPropagation(); const d=k==='f'?1:-1; cmMove(cv,d*24); cmHalfScroll(cv,d,2); return; }
                  }
                  if(lk==='j'||lk==='k'){ e.preventDefault(); e.stopPropagation(); try{ win.__exactPaneSwitch(lk==='j'?1:-1);}catch{} return; }
                  if(k==='h'||k==='l'||k==='ArrowLeft'||k==='ArrowRight'){ e.preventDefault(); e.stopPropagation(); try{ win.__exactMoveDir(k==='h'||k==='ArrowLeft'?'left':'right');}catch{} return; }
                }
              }catch{}
            };
            win.addEventListener('keydown',tmuxCapture,true);
            // guard: CM consumed the key at target; keep DC from double-handling (t/?/space/i/x...).
            // Tab passes (DC buffer switch; CM reloads via heal poll).
            // C-b/arrows bypass — needed for tmux; cm focus must not swallow them.
            const dcGuard=(e)=>{
              try{
                if(!e.isTrusted) return;
                const k=e.key;
                if(e.ctrlKey&&k==='b') return;
                if(k==='ArrowLeft'||k==='ArrowRight'||k==='ArrowUp'||k==='ArrowDown') return;
                const cv=win.__cmView;
                if(!(cv&&isCmFocused(cv))) return;
                if(e.key==='Tab') return;
                if(k===':'||k==='/'||k==='?') return;
                e.stopPropagation();
              }catch{}
            };
            doc.addEventListener('keydown',dcGuard);
            // tab click => focus editor so typing stays in repo vim
            doc.addEventListener('click',(e)=>{
              try{
                const el=e.target&&e.target.closest?e.target.closest('button[title],span'):null;
                if(!el) return;
                const txt=(el.title||el.textContent||'').trim();
                if(/resume\/|\/home\//.test(el.title||'')||/^2:/.test(txt)){
                  setTimeout(()=>{ try{ if(win.__cmView) win.__cmView.focus(); }catch{} },120);
                }
              }catch{}
            },true);
        }
        // ---- repo-grade vim input layer over DC rendered preview ----
        // Display stays 100% DC (rendered markdown everywhere, source only on cursor line,
        // single native block cursor). This layer ONLY handles keys DC lacks, executing via
        // direct comp methods. Zero synthetic dispatch (caused recursion), zero status writes.
        // Fiber lookup fixed: container key holds FiberRoot -> start at .current.
        const resolveComp=()=>{
          try{
            if(win.__dcComp&&win.__dcComp.setState&&win.__dcComp.state&&Array.isArray(win.__dcComp.state.open)) return win.__dcComp;
            const root=doc.getElementById('dc-root'); if(!root) return null;
            const keys=Object.keys(root).filter(x=>x.includes('react'));
            for(const k of keys){
              let f=root[k]; f=(f&&f.current)||f; if(!f) continue;
              const seen=new Set(); const st=[f];
              while(st.length){
                const cur=st.pop(); if(!cur||seen.has(cur)) continue; seen.add(cur);
                const sn=cur.stateNode;
                if(sn&&sn.state&&Array.isArray(sn.state.open)&&typeof sn.handleKey==='function'&&typeof sn.readBuf==='function'){ win.__dcComp=sn; return sn; }
                if(cur.child) st.push(cur.child);
                if(cur.sibling) st.push(cur.sibling);
              }
            }
          }catch{}
          return null;
        };
        win.__resolveComp=resolveComp;
        win.__nvimActive=()=>{ try{ const c=resolveComp(); return !!(c&&c.state.pane===2&&(c.state.mode==='normal'||c.state.mode==='visual')); }catch{ return false; } };
        setInterval(()=>{ try{ resolveComp(); }catch{} },1500);
        if(!win.__cmVimMounted){
          win.__cmVimMounted=true;
          win.__cmTries=0;
          win.__mountCM = async ()=>{
            try{
              win.__cmTries=(win.__cmTries||0)+1;
              if(win.__cmTries>12){ console.log('cmvim: max retries'); return; }
              const mod = await import('https://esm.sh/@replit/codemirror-vim@6.4.0');
              const { EditorView, keymap } = await import('https://esm.sh/@codemirror/view@6.43.11');
              const { EditorState } = await import('https://esm.sh/@codemirror/state@6.7.4');
              const { defaultKeymap, history, historyKeymap } = await import('https://esm.sh/@codemirror/commands@6.8.1');
              const vim = mod.vim || mod.default?.vim;
              if(!vim) { console.log('vim not found', mod); return; }
              // overlay: hide DC lines via id+CSS (React-proof), CM lives in sibling host.
              // Single cursor by construction — DC cursor goes invisible with its container.
              let buf=doc.getElementById('__dc_buf')||doc.querySelector('[data-cur]')?.closest('div[style*="overflow"]');
              if(!buf){ const cs=Array.from(doc.querySelectorAll('div[style*="overflow-y:auto"]')); for(const c of cs){ if(c.querySelector('[data-cur]')){ buf=c; break; } } }
              if(!buf){ console.log('bufContainer not found try',win.__cmTries); setTimeout(()=>win.__mountCM(),700); return; }
              buf.id='__dc_buf';
              ensureCmCss();
              let cmHost=doc.getElementById('__cmvim_host');
              if(!cmHost){ cmHost=doc.createElement('div'); cmHost.id='__cmvim_host'; buf.parentElement.insertBefore(cmHost,buf.nextSibling); }
              await seedLS();
              const tabs0=nvimTabs();
              const act0=tabs0.find(t=>t.active)||tabs0[0];
              const ipath=act0?act0.path:'/home/sameh/resume/experience.md';
              const initialDoc=readLSFile(ipath)||domLines()||'# Experience\n';
              win.__cmPath=ipath;
              const state = EditorState.create({
                doc: initialDoc,
                extensions: [
                  vim(),
                  history(),
                  keymap.of([...defaultKeymap, ...historyKeymap]),
                  EditorView.lineWrapping,
                  EditorView.theme({
                    '&': { backgroundColor: 'var(--bg)', color: 'var(--fg)', fontFamily: "'Fira Code', monospace", fontSize: '12.5px' },
                    '.cm-content': { padding: '8px 0', lineHeight: '20px' },
                    '.cm-cursor': { borderLeftColor: 'var(--fg)' },
                    '.cm-selectionBackground, ::selection': { backgroundColor: 'var(--surf)' },
                    '.cm-gutters': { backgroundColor: 'var(--bg)', color: 'var(--dim)', borderRight: '1px solid var(--surf)' },
                    '.cm-activeLineGutter': { backgroundColor: 'var(--bg2)' },
                    '.cm-activeLine': { backgroundColor: 'var(--bg2)' },
                  }),
                  EditorView.updateListener.of(update=>{
                    if(update.docChanged&&win.__cmPath){ writeLSFile(win.__cmPath,update.state.doc.toString()); }
                  })
                ]
              });
              const view = new EditorView({ state, parent: cmHost });
              win.__cmView = view;
              console.log('[cmvim] mounted deterministic vim entire');
            }catch(e){ console.log('cm vim mount err', e); }
          };
          win.__mountCM();
        }
        // heal: re-place CM host (React drops unknown DOM on re-render), reload on tab switch,
        // refocus after wipe-steal, repaint highlight ring. All DOM/LS — no fiber.
        // observe active changes (click or key) — repaint immediately even if heal hasn't ticked
        const observeActive=()=>{
          try{
            const top=doc.getElementById('__tmux_top');
            if(top&&!top.__obs){
              const mo=new MutationObserver(()=> paintPanes());
              mo.observe(top,{attributes:true, attributeFilter:['data-active']});
              top.__obs=mo;
            }
            const orig=origBarEl();
            if(orig&&!orig.__obs2){
              const mo2=new MutationObserver(()=> paintPanes());
              mo2.observe(orig,{subtree:true, attributes:true, childList:true, characterData:true});
              orig.__obs2=mo2;
            }
            // pane frame clicks (mouse) — htop vs terminal desync fix
            ['0: zsh','1: htop — now','2: nvim'].forEach(txt=>{
              const lab=Array.from(doc.querySelectorAll('div')).find(d=>(d.textContent||'').trim()===txt);
              const frame=lab?lab.closest('div[style*="border"]')||lab.parentElement:null;
              if(frame&&!frame.__obsClick){
                frame.__obsClick=true;
                frame.addEventListener('mousedown',()=> setTimeout(paintPanes,30), true);
                frame.addEventListener('click',()=> setTimeout(paintPanes,30), true);
              }
            });
          }catch{}
        };
        setTimeout(observeActive,800); setInterval(observeActive,1500);
        if(!win.__cmHeal){
          win.__cmHeal=true;
          setInterval(()=>{
            try{
              ensureTmux(); hideOrigBar(); observeActive();
              if(!win.__cmView){ try{win.__mountCM&&win.__mountCM();}catch{} return; }
              ensureCmCss();
              let buf=doc.getElementById('__dc_buf');
              if(!buf){ const q=doc.querySelector('[data-cur]')?.closest('div[style*="overflow"]'); if(q){ q.id='__dc_buf'; buf=q; } }
              const host=doc.getElementById('__cmvim_host');
              if(buf&&host){
                if(host.parentElement!==buf.parentElement||host.previousElementSibling!==buf){ try{buf.parentElement.insertBefore(host,buf.nextSibling);}catch{} }
                if(!host.contains(win.__cmView.dom)){ try{host.appendChild(win.__cmView.dom);}catch{} win.__cmWiped=true; }
                if(win.__cmWiped){
                  win.__cmWiped=false;
                  try{ const ae=doc.activeElement; if(doc.hasFocus()&&(!ae||ae===doc.body)) win.__cmView.focus(); }catch{}
                }
              }
              try{
                const tabs=nvimTabs();
                const act=tabs.find(t=>t.active);
                const p=act?act.path:null;
                if(p&&p!==win.__cmPath){
                  const txt=readLSFile(p);
                  if(txt!=null&&txt!==win.__cmView.state.doc.toString()){ try{win.__cmView.dispatch({changes:{from:0,to:win.__cmView.state.doc.length,insert:txt}});}catch{} }
                  win.__cmPath=p;
                }
              }catch{}
              paintPanes();
            }catch{}
          },350);
        }
        // enhance vim inside iframe: super/meta fast + full vim multi-key incl undo/redo (buffer) — kept for tmux but vim now handled by cm
        if(!win.__vimEnhanced){
          win.__vimEnhanced=true;
          // buffer undo/redo stacks per file
          win.__vimStacks = win.__vimStacks || {};
          win.__vimReg = win.__vimReg || { '"': '' };
          let pendingCount = '';
          let pendingOp = '';
          let pendingG = false;
          let gTimer = null;
          const findComponent = ()=>{
            try{
              const root = doc.getElementById('dc-root');
              if(!root) return null;
              let fiber=null;
              for(const kk of Object.keys(root)){ if(kk.includes('react')){ fiber=root[kk]; break; } }
              let node=null;
              if(fiber){
                fiber=(fiber.current)||fiber;
                const seen=new Set(); const st=[fiber];
                while(st.length){
                  const f=st.pop(); if(!f||seen.has(f)) continue; seen.add(f);
                  const sn=f.stateNode;
                  if(sn&&sn.state&&Array.isArray(sn.state.open)&&typeof sn.handleKey==='function'&&typeof sn.readBuf==='function'){ node=sn; break; }
                  if(f.child) st.push(f.child);
                  if(f.sibling) st.push(f.sibling);
                  if(f.alternate) st.push(f.alternate);
                }
              }
              if(node) return node;
              if(win.__dcComp&&win.__dcComp.state&&Array.isArray(win.__dcComp.state.open)) return win.__dcComp;
              // plain rows fallback
              const rows=doc.querySelectorAll('[data-cur]'); if(!rows.length) return null;
              return { __plain:true, rows, doc };
            }catch(e){ console.log('findComponent err', e); }
            return null;
          };
          const getBufInfo = ()=>{
            try{
              const comp = findComponent();
              if(comp&&!comp.__plain){
                const path = comp.state.open[comp.state.buf];
                const src = comp.readBuf ? comp.readBuf(path) : '';
                return { comp, path, src };
              }
              if(comp&&comp.__plain){
                const path='/home/sameh/resume/experience.md';
                const src=Array.from(comp.rows).map(d=> (d.textContent||'').replace(/^\s*\d+\s*/, '')).join('\n');
                return { comp, path, src };
              }
            }catch{}
            const pathEl = doc.querySelector('span[style*="max-width:40%"]');
            const path = pathEl ? pathEl.textContent.trim() : '/home/sameh/resume/experience.md';
            const lines = Array.from(doc.querySelectorAll('div[data-cur]')).map(d=> d.textContent?.replace(/^\s*\d+\s*/,'') || '');
            return { comp:null, path, src: lines.join('\n') };
          };
          const pushUndo = (path, src)=>{
            if(!win.__vimStacks[path]) win.__vimStacks[path]= { undo:[], redo:[] };
            const s = win.__vimStacks[path];
            if(s.undo.length && s.undo[s.undo.length-1]===src) return;
            s.undo.push(src);
            if(s.undo.length>64) s.undo.shift();
            s.redo.length=0;
          };
          // silent — user asked not to show trigger on filename/status anywhere
          const flash = (msg, color='var(--yellow)')=>{ /* silent: user asked not to show trigger on filename/status anywhere */ };
          const doScroll = (dir, amount)=>{
            const buf = doc.querySelectorAll('div[style*="overflow-y:auto"]')[1] || doc.querySelector('div[style*="overflow-y:auto"]') || doc.querySelector('div[style*="flex:1"][style*="overflow"]');
            if(buf) buf.scrollBy({ top: dir*amount, behavior:'smooth' });
            // also dispatch motion so cursor moves if nvim focused
            for(let i=0;i<Math.min(8, Math.abs(amount)/18); i++) doc.dispatchEvent(new KeyboardEvent('keydown', { key: dir>0 ? 'j':'k', bubbles:true }));
          };
          // hook writeBuffer to push undo + seed initial contents for deterministic u/Ctrl-r (vim history)
          const seedStacks = ()=>{
            try{
              const comp=findComponent();
              if(!comp) return;
              comp.state.open.forEach(p=>{
                try{
                  const src=comp.readBuf(p);
                  if(!win.__vimStacks[p]) win.__vimStacks[p]={undo:[], redo:[]};
                  if(win.__vimStacks[p].undo.length===0) win.__vimStacks[p].undo.push(src);
                }catch{}
              });
            }catch{}
          };
          const hookFS = ()=>{
            const comp=findComponent();
            if(comp && comp.writeBuffer && !comp.__vimHooked){
              const orig=comp.writeBuffer.bind(comp);
              comp.writeBuffer = (text)=>{
                const { path, src } = getBufInfo();
                pushUndo(path, src);
                return orig(text);
              };
              comp.__vimHooked=true;
              seedStacks();
            }
          };
          // writeBuffer hook retired — CM syncs via localStorage VFS in heal poll (no fiber, no stacks).

          const vimHandler = (e)=>{
            // if CodeMirror vim has focus, let it handle deterministically (entire vim like repo)
            if(win.__cmView && win.__cmView.hasFocus) return;
            const meta = e.metaKey || e.ctrlKey;
            const k = e.key;
            const comp = findComponent();
            let mode = comp ? comp.state.mode : 'normal';
            // fallback visual detection via textarea selection (findComponent may fail)
            if((!comp || mode==='unknown') && doc.querySelector('textarea')){
              const taTmp=doc.querySelector('textarea');
              if(taTmp && taTmp.selectionEnd > taTmp.selectionStart) mode='visual';
            }
            const isNormal = mode==='normal';
            const isVisual = mode==='visual';
            const isInsert = mode==='insert' || mode==='replace';
            const isNvimPane = comp ? comp.state.pane===2 : true;
            if(isInsert){
              // insert: only handle super pane switch via meta+j/k, else let DC handle Esc
              if(meta && k.toLowerCase()==='j'){
                if(e.shiftKey){ e.preventDefault(); e.stopPropagation(); const buf=doc.querySelector('div[style*="overflow-y:auto"]'); if(buf) buf.scrollTop=buf.scrollHeight; }
                else { e.preventDefault(); e.stopPropagation(); doScroll(1, 180); }
                return;
              }
              if(meta && k.toLowerCase()==='k'){
                if(e.shiftKey){ e.preventDefault(); e.stopPropagation(); const buf=doc.querySelector('div[style*="overflow-y:auto"]'); if(buf) buf.scrollTop=0; }
                else { e.preventDefault(); e.stopPropagation(); doScroll(-1, 180); }
                return;
              }
              return;
            }
            if(isVisual){
              // visual mode full multi-key (codemirror-vim: charwise/linewise/blockwise)
              // Ctrl/Super+d/u = half-page extend selection (user: v -> select piece -> Super/Ctrl+d/u failed)
              const visualHalf = (dir)=>{
                e.preventDefault(); e.stopPropagation();
                const compV = findComponent();
                const ta = doc.querySelector('textarea');
                if(compV && ta && typeof compV.vHead==='number'){
                  const t=ta.value;
                  const cur = compV.vHead;
                  const curLine = t.slice(0,cur).split('\n').length -1;
                  const targetLine = Math.max(0, Math.min(t.split('\n').length-1, curLine + dir*12));
                  let pos=0; const lines=t.split('\n');
                  for(let i=0;i<targetLine;i++) pos+=lines[i].length+1;
                  const col = cur - (t.lastIndexOf('\n', cur-1)+1);
                  const lineLen = lines[targetLine].length;
                  pos = Math.min(pos+Math.min(col, lineLen), t.length);
                  compV.vHead = pos;
                  compV.applyVisual(ta);
                  const buf = doc.querySelectorAll('div[style*="overflow-y:auto"]')[1] || doc.querySelector('div[style*="overflow-y:auto"]');
                  if(buf) buf.scrollBy({ top: dir*220, behavior:'smooth' });
                } else if(ta){
                  // fallback without compV — extend selection half page via ta
                  const t=ta.value; let pos=ta.selectionEnd; let line=t.slice(0,pos).split('\n').length-1;
                  const target=Math.max(0, Math.min(t.split('\n').length-1, line+dir*12));
                  let newPos=0; const lines=t.split('\n'); for(let i=0;i<target;i++) newPos+=lines[i].length+1;
                  const col=pos - (t.lastIndexOf('\n', pos-1)+1);
                  newPos=Math.min(t.length, newPos+Math.min(col, lines[target]?.length||0));
                  ta.setSelectionRange(ta.selectionStart, newPos);
                  const buf = doc.querySelectorAll('div[style*="overflow-y:auto"]')[1] || doc.querySelector('div[style*="overflow-y:auto"]');
                  if(buf) buf.scrollBy({ top: dir*220, behavior:'smooth' });
                } else {
                  doScroll(dir, 220);
                }
              };
              if(meta && k==='d'){ visualHalf(1); return; }
              if(meta && k==='u'){ visualHalf(-1); return; }
              if(meta && k==='f'){ e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){ const t=ta.value; compV.vHead = t.length; compV.applyVisual(ta); doScroll(1,420); } else doScroll(1,420);
                return;
              }
              if(meta && k==='b'){ e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){ compV.vHead=0; compV.applyVisual(ta); doScroll(-1,420); } else doScroll(-1,420);
                return;
              }
              if(meta && k.toLowerCase()==='j'){ e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta && typeof compV.vHead==='number'){ for(let i=0;i<5;i++){ const cur=compV.vHead; const nxt=compV.motion(ta.value, cur, 'j', {}); if(nxt!==null) compV.vHead=nxt; } compV.applyVisual(ta); doScroll(1, 90); }
                else if(ta){ // fallback without compV — extend selection 5 lines via ta
                  const t=ta.value; let pos=ta.selectionEnd; let line=t.slice(0,pos).split('\n').length-1;
                  const lines=t.split('\n'); const target=Math.min(lines.length-1, line+5);
                  let newPos=0; for(let i=0;i<target;i++) newPos+=lines[i].length+1;
                  newPos=Math.min(t.length, newPos+ (ta.selectionStart - (t.lastIndexOf('\n', ta.selectionStart-1)+1)) );
                  ta.setSelectionRange(ta.selectionStart, newPos); doScroll(1,90);
                } else { doScroll(1, 90); }
                return; }
              if(meta && k.toLowerCase()==='k'){ e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta && typeof compV.vHead==='number'){ for(let i=0;i<5;i++){ const cur=compV.vHead; const nxt=compV.motion(ta.value, cur, 'k', {}); if(nxt!==null) compV.vHead=nxt; } compV.applyVisual(ta); doScroll(-1,90); }
                else if(ta){
                  const t=ta.value; let pos=ta.selectionEnd; let line=t.slice(0,pos).split('\n').length-1;
                  const target=Math.max(0, line-5);
                  let newPos=0; const lines=t.split('\n'); for(let i=0;i<target;i++) newPos+=lines[i].length+1;
                  const col=pos - (t.lastIndexOf('\n', pos-1)+1);
                  newPos=Math.min(t.length, newPos+Math.min(col, lines[target]?.length||0));
                  ta.setSelectionRange(ta.selectionStart, newPos); doScroll(-1,90);
                } else { doScroll(-1,90); }
                return; }
              // count prefix in visual
              if(/^[1-9]$/.test(k) && !pendingOp){ pendingCount+=k; e.preventDefault(); e.stopPropagation(); return; }
              if(/^[0-9]$/.test(k) && pendingCount){ pendingCount+=k; e.preventDefault(); return; }
              // visual operators multi-key: y/d/c/x, >/<, ~, u/U, o, v/V, Esc — direct to avoid dispatch recursion
              if(k==='o'){ e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){ const tmp=compV.vAnchor; compV.vAnchor=compV.vHead; compV.vHead=tmp; compV.applyVisual(ta); }
                pendingCount=''; return;
              }
              if(k==='u'){ e.preventDefault(); e.stopPropagation();
                const ta=doc.querySelector('textarea'); if(ta){ const s=ta.selectionStart, eb=ta.selectionEnd; const t=ta.value; const sel=t.slice(s,eb); const nv=t.slice(0,s)+sel.toLowerCase()+t.slice(eb); ta.value=nv; ta.setSelectionRange(s, eb); const compV=findComponent(); if(compV){ compV.writeBuffer(nv); } }
                return;
              }
              if(k==='U'){ e.preventDefault(); e.stopPropagation();
                const ta=doc.querySelector('textarea'); if(ta){ const s=ta.selectionStart, eb=ta.selectionEnd; const t=ta.value; const sel=t.slice(s,eb); const nv=t.slice(0,s)+sel.toUpperCase()+t.slice(eb); ta.value=nv; ta.setSelectionRange(s, eb); const compV=findComponent(); if(compV) compV.writeBuffer(nv); }
                return;
              }
              if(k==='>'||k==='<'||k==='~'){
                e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){
                  const s=ta.selectionStart, eb=ta.selectionEnd;
                  const t=ta.value;
                  if(k==='>'){ const nv=t.slice(0,s)+'  '+t.slice(s,eb)+'  '+t.slice(eb); ta.value=nv; compV.writeBuffer(nv); }
                  else if(k==='<'){ const nv=t.slice(0,s)+t.slice(s,eb).replace(/^  /gm,'')+t.slice(eb); ta.value=nv; compV.writeBuffer(nv); }
                  else if(k==='~'){ const sel=t.slice(s,eb); const swapped=sel.split('').map(c=> c===c.toLowerCase()?c.toUpperCase():c.toLowerCase()).join(''); const nv=t.slice(0,s)+swapped+t.slice(eb); ta.value=nv; compV.writeBuffer(nv); }
                }
                return;
              }
              if(k==='y' || k==='d' || k==='c' || k==='x'){
                e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){
                  const s=ta.selectionStart, eb=ta.selectionEnd; const t=ta.value;
                  const sel=t.slice(s,eb);
                  if(k==='y'){ win.__vimReg['"']=sel; navigator.clipboard?.writeText(sel).catch(()=>{}); compV.vHead=s; compV.leaveMode(); }
                  else if(k==='d' || k==='x'){ const nv=t.slice(0,s)+t.slice(eb); ta.value=nv; ta.setSelectionRange(s,s); compV.writeBuffer(nv); compV.vHead=s; compV.leaveMode(); }
                  else if(k==='c'){ const nv=t.slice(0,s)+t.slice(eb); ta.value=nv; ta.setSelectionRange(s,s); compV.writeBuffer(nv); compV.vHead=s; compV.enterMode('insert', s); }
                }
                pendingCount=''; pendingOp='';
                return;
              }
              // visual motions with count — direct vHead move to avoid dispatch recursion (was dispatching k)
              if(/^[hjklwbe$0]$/.test(k)){
                const cnt = parseInt(pendingCount||'1',10);
                e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){
                  for(let i=0;i<cnt;i++){
                    const nxt=compV.motion(ta.value, compV.vHead, k, {});
                    if(nxt!==null) compV.vHead=nxt;
                  }
                  compV.applyVisual(ta);
                }
                pendingCount='';
                return;
              }
              if(k==='G' || k==='g'){
                e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV){
                  if(k==='G'){
                    const cnt = pendingCount ? parseInt(pendingCount,10) : null;
                    if(cnt){
                      const lines=ta ? ta.value.split('\n').length : 34;
                      const target=Math.min(lines, cnt);
                      let pos=0; const ls=ta.value.split('\n');
                      for(let i=0;i<target-1;i++) pos+=ls[i].length+1;
                      compV.vHead=pos; compV.applyVisual(ta);
                    } else {
                      compV.vHead = ta ? ta.value.length : 0; compV.applyVisual(ta);
                    }
                  } else {
                    // g -> wait for second g (gg) handled separately; single g does nothing
                    if(pendingG){
                      compV.vHead=0; compV.applyVisual(ta);
                    }
                  }
                }
                if(k==='g'){
                  if(pendingG){
                    // gg already handled above as visual gg top
                    pendingG=false; pendingCount='';
                    return;
                  }
                  pendingG=true; clearTimeout(gTimer); gTimer=setTimeout(()=>{ pendingG=false; },800);
                  return;
                }
                pendingCount=''; pendingG=false;
                return;
              }
              return;
            }
            if(!isNormal || !isNvimPane) {
              if(meta && k.toLowerCase()==='j'){
                if(e.shiftKey){ e.preventDefault(); e.stopPropagation(); const buf=doc.querySelector('div[style*="overflow-y:auto"]'); if(buf) buf.scrollTop=buf.scrollHeight; }
                else { e.preventDefault(); e.stopPropagation(); doScroll(1, 180); }
                return;
              }
              if(meta && k.toLowerCase()==='k'){
                if(e.shiftKey){ e.preventDefault(); e.stopPropagation(); const buf=doc.querySelector('div[style*="overflow-y:auto"]'); if(buf) buf.scrollTop=0; }
                else { e.preventDefault(); e.stopPropagation(); doScroll(-1, 180); }
                return;
              }
              return;
            }

            // super/meta fast + undo/redo + half-page
            if(meta && k==='d'){ e.preventDefault(); e.stopPropagation(); doScroll(1, 220); pendingCount=''; return; }
            if(meta && k==='u'){ e.preventDefault(); e.stopPropagation(); doScroll(-1, 220); pendingCount=''; return; }
            if(meta && k==='f'){ e.preventDefault(); e.stopPropagation(); doScroll(1, 420); return; }
            if(meta && k==='b'){ e.preventDefault(); e.stopPropagation(); doScroll(-1, 420); return; }
            if(meta && k.toLowerCase()==='r'){ // Ctrl-r redo — deterministic via codemirror-vim history reference (undo/redo stack)
              e.preventDefault(); e.stopPropagation();
              const { path } = getBufInfo();
              const s=win.__vimStacks[path];
              if(s && s.redo.length){
                const nxt=s.redo.pop();
                const curInfo=getBufInfo();
                if(!s.undo) s.undo=[];
                s.undo.push(curInfo.src);
                if(s.undo.length>64) s.undo.shift();
                // do not call pushUndo (would clear redo)
                if(comp){
                  // temporarily unhook to avoid double push
                  const was=comp.__vimHooked; comp.__vimHooked=false;
                  comp.writeBuffer(nxt);
                  setTimeout(()=> comp.__vimHooked=was, 50);
                } else { const ta=doc.querySelector('textarea'); if(ta){ ta.value=nxt; ta.dispatchEvent(new Event('change',{bubbles:true})); } }
              }
              return;
            }
            if(k==='u' && !meta){ // undo
              e.preventDefault(); e.stopPropagation();
              const { path } = getBufInfo();
              const s=win.__vimStacks[path];
              if(s && s.undo.length){
                const prev=s.undo.pop();
                const cur=getBufInfo().src;
                s.redo.push(cur);
                if(comp) comp.writeBuffer(prev); else { const ta=doc.querySelector('textarea'); if(ta){ ta.value=prev; } }
                flash('undo', 'var(--green)');
              } else flash('nothing to undo', 'var(--dim)');
              return;
            }
            // super+j/k fast 5× + top/bottom
            if(meta && k.toLowerCase()==='j'){
              if(e.shiftKey){ e.preventDefault(); e.stopPropagation(); const buf=doc.querySelector('div[style*="overflow-y:auto"]'); if(buf) buf.scrollTop=buf.scrollHeight; doc.dispatchEvent(new KeyboardEvent('keydown',{key:'G',shiftKey:true,bubbles:true})); }
              else { e.preventDefault(); e.stopPropagation(); for(let i=0;i<5;i++) doc.dispatchEvent(new KeyboardEvent('keydown',{key:'j',bubbles:true})); doScroll(1, 120); }
              return;
            }
            if(meta && k.toLowerCase()==='k'){
              if(e.shiftKey){ e.preventDefault(); e.stopPropagation(); const buf=doc.querySelector('div[style*="overflow-y:auto"]'); if(buf) buf.scrollTop=0; doc.dispatchEvent(new KeyboardEvent('keydown',{key:'g',bubbles:true})); setTimeout(()=>doc.dispatchEvent(new KeyboardEvent('keydown',{key:'g',bubbles:true})), 10); }
              else { e.preventDefault(); e.stopPropagation(); for(let i=0;i<5;i++) doc.dispatchEvent(new KeyboardEvent('keydown',{key:'k',bubbles:true})); doScroll(-1, 120); }
              return;
            }
            // count prefix
            if(/^[1-9]$/.test(k) && !pendingOp && !pendingG){
              pendingCount += k;
              e.preventDefault(); e.stopPropagation(); flash(pendingCount+'…', 'var(--cyan)'); return;
            }
            if(k==='0' && pendingCount===''){ // 0 is motion, not count start
            } else if(/^[0-9]$/.test(k) && pendingCount){
              pendingCount += k; e.preventDefault(); flash(pendingCount+'…', 'var(--cyan)'); return;
            }
            // operators: d y c
            if((k==='d' || k==='y' || k==='c') && !pendingOp){
              if(k==='d' && pendingOp==='d'){ // dd
                e.preventDefault(); e.stopPropagation();
                const cnt = parseInt(pendingCount||'1',10);
                const { path, src } = getBufInfo();
                pushUndo(path, src);
                const lines=src.split('\n');
                const comp2=findComponent();
                const cur = comp2 ? comp2.state.cursor : 0;
                const curLine = (src.slice(0,cur).match(/\n/g)||[]).length;
                lines.splice(curLine, cnt);
                const next = lines.join('\n');
                if(comp2) comp2.writeBuffer(next);
                flash(cnt+' line'+(cnt>1?'s':'')+' deleted (dd)', 'var(--red)');
                pendingCount=''; pendingOp='';
                return;
              }
              if(k==='y' && pendingOp==='y'){ // yy
                e.preventDefault(); e.stopPropagation();
                const cnt = parseInt(pendingCount||'1',10);
                const { src } = getBufInfo();
                const lines=src.split('\n');
                const curLine=(src.slice(0, findComponent()?.state.cursor||0).match(/\n/g)||[]).length;
                const yank=lines.slice(curLine, curLine+cnt).join('\n');
                win.__vimReg['"']=yank; navigator.clipboard?.writeText(yank).catch(()=>{});
                flash(cnt+' line'+(cnt>1?'s':'')+' yanked (yy)', 'var(--yellow)');
                pendingCount=''; pendingOp='';
                return;
              }
              pendingOp=k; e.preventDefault(); e.stopPropagation(); flash(k+'… (operator pending)', 'var(--cyan)'); return;
            }
            if(pendingOp){
              const cnt = parseInt(pendingCount||'1',10);
              // d/y/c + motion
              if(k==='w' || k==='b' || k==='$' || k==='0' || k==='G' || k==='g'){
                e.preventDefault(); e.stopPropagation();
                flash(pendingOp+k+' '+(cnt>1?cnt+'× ':'')+'(operator)', 'var(--magenta)');
                // for demo, just flash; real edit would splice
                pendingOp=''; pendingCount=''; pendingG=false;
                return;
              }
              if(k==='d' || k==='y' || k==='c'){ // already handled dd/yy, cc etc
                pendingOp=''; pendingCount=''; return;
              }
              // fallback clear
              pendingOp='';
            }
            // g prefix for gg
            if(k==='g'){
              if(pendingG){
                e.preventDefault(); e.stopPropagation();
                const buf=doc.querySelector('div[style*="overflow-y:auto"]');
                if(buf) buf.scrollTop=0;
                doc.dispatchEvent(new KeyboardEvent('keydown',{key:'g',bubbles:true}));
                flash('gg top'+(pendingCount?' '+pendingCount:''));
                pendingG=false; pendingCount='';
                return;
              }
              pendingG=true; clearTimeout(gTimer); gTimer=setTimeout(()=>{ pendingG=false; },800);
              // don't prevent yet
              return;
            }
            if(k==='G'){
              e.preventDefault(); e.stopPropagation();
              const cnt = pendingCount ? parseInt(pendingCount,10) : null;
              const buf=doc.querySelector('div[style*="overflow-y:auto"]');
              if(cnt && buf){
                const lines=getBufInfo().src.split('\n').length;
                const target=Math.min(lines, cnt);
                const lineH=20;
                buf.scrollTop=(target-1)*lineH;
                flash(':'+target+' G');
              } else {
                if(buf) buf.scrollTop=buf.scrollHeight;
                flash('G bottom');
              }
              pendingCount=''; pendingG=false;
              return;
            }
            // p paste
            if(k==='p'){
              e.preventDefault(); e.stopPropagation();
              const yank=win.__vimReg['"'];
              if(yank){
                const { path, src } = getBufInfo();
                pushUndo(path, src);
                const comp2=findComponent();
                if(comp2){
                  const cur=comp2.state.cursor;
                  const next=src.slice(0,cur)+yank+src.slice(cur);
                  comp2.writeBuffer(next);
                }
                flash('pasted');
              }
              pendingCount='';
              return;
            }
            // . repeat (flash)
            if(k==='.'){ e.preventDefault(); flash('repeat (.)', 'var(--dim)'); return; }
            // clear count after any non-count motion that was handled by original motion
            if(/^[hjklwbe$0]$/.test(k) && pendingCount){
              // let original motion handle count via our flash, then clear
              setTimeout(()=> pendingCount='', 10);
            }
          };
          win.addEventListener('keydown', vimHandler, true);
          doc.addEventListener('keydown', vimHandler, true);
          // debug one-liner (verifies rendered preview + mode + single cursor even when CM not mounted)
          try{ const c=findComponent(); if(c){ console.log('[dc vim] pane',c.state.pane,'mode',c.state.mode,'open',c.state.open[c.state.buf],'vimEnhanced',!!win.__vimEnhanced); } }catch{}
        }

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
    <div style={{position:'relative', width:'100%', height:'100vh', background:'#181825', overflow:'hidden'}}>
      {/* site-level tmux ? handler — appears over iframe; nvim's own ? keeps its pane-local help */}
      <button
        onClick={()=> setSiteHelp(v=>!v)}
        title="tmux help (?) — site level · full vim + tmux bindings"
        style={{
          position:'absolute', right:14, top:10, zIndex:30,
          width:28, height:28, borderRadius:6, border:'1px solid var(--surf, #313244)',
          background:'rgba(30,30,46,0.9)', color:'var(--yellow, #f9e2af)', font:'700 13px/1 Fira Code, monospace',
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', backdropFilter:'blur(6px)'
        }}
      >?</button>

      <iframe
        ref={ref}
        src="/clone-assets/index-raw.html"
        title="sameh exact clone"
        style={{width:'100%', height:'100%', border:'none', display:'block', background:'#181825'}}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

      {siteCmd.open && (
        <div style={{position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)', zIndex:45, width:'min(520px, 90vw)'}}>
          <div style={{background:'#1e1e2e', border:'1px solid #89b4fa', borderRadius:8, padding:'8px 10px', display:'flex', alignItems:'center', gap:8, fontFamily:"'Fira Code', monospace", boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>
            <span style={{color:'#89b4fa', fontWeight:700}}>:</span>
            <input autoFocus value={siteCmd.val} onChange={e=> setSiteCmd(s=>({...s,val:e.target.value}))} placeholder="pane 0/1/2 · theme catppuccin · site · help" style={{flex:1, background:'transparent', border:'none', outline:'none', color:'#cdd6f4', font:'400 12px Fira Code, monospace'}} />
            <span style={{color:'#6c7086', fontSize:10}}>Enter · Esc</span>
          </div>
          <div style={{marginTop:6, textAlign:'center', color:'#6c7086', font:'400 10px Fira Code, monospace'}}>entire app keyboard-only — C-b + 0/1/2/o/h/j/k/l/t/? · :pane · /site</div>
        </div>
      )}
      {tmuxPrefix && (
        <div style={{position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', zIndex:44, background:'#f9e2af', color:'#1e1e2e', font:'700 11px Fira Code, monospace', padding:'4px 10px', borderRadius:6, border:'1px solid #fab387'}}>C-b …</div>
      )}
      {siteHelp && (
        <div onClick={()=>setSiteHelp(false)} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', zIndex:40, display:'flex', alignItems:'center', justifyContent:'center', padding:16, cursor:'pointer'}}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:'#1e1e2e', border:'1px solid #313244', borderRadius:10, padding:'18px 20px', maxWidth:920, width:'100%', maxHeight:'86vh', overflow:'auto',
            fontFamily:"'Fira Code', monospace", fontSize:12, lineHeight:1.6, color:'#cdd6f4', boxShadow:'0 16px 48px rgba(0,0,0,0.5)', cursor:'default'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
              <div style={{fontWeight:800, fontSize:13, color:'#f9e2af'}}>tmux single window · each window is pane image · full vim</div>
              <button onClick={()=>setSiteHelp(false)} style={{cursor:'pointer', background:'#313244', color:'#cdd6f4', border:'1px solid #45475a', borderRadius:6, padding:'4px 10px', font:'700 11px Fira Code, monospace'}}>Esc</button>
            </div>
            <div style={{color:'#6c7086', fontSize:11, marginBottom:12}}>Site-level <code style={{background:'#313244', padding:'1px 4px', borderRadius:3}}>?</code> shows tmux + full vim. Pane-local <code style={{background:'#313244', padding:'1px 4px', borderRadius:3}}>?</code> inside <code style={{background:'#313244', padding:'1px 4px', borderRadius:3}}>2:nvim</code> shows buffer-local vim help. Every window is rendered as image pane inside single tmux window panel.</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'16px 20px'}}>
              {[
                {title:'tmux — single window, panes as images', keys:[
                  ['C-b 0/1/2','pane 0:zsh / 1:htop / 2:nvim — green ring follows'],
                  ['C-b o / Space','next pane'],
                  ['C-b h/j/k/l','left / down / up / right in single window'],
                  ['Super+1/2/3','jump to pane'],
                  ['Super+h/j/k/l','directional panes'],
                  ['C-b t','cycle theme (8)'],
                  ['C-b ? / ? button','this help (Esc closes)'],
                  [':pane n · /site',': palette — keyboard-only nav'],
                ]},
                {title:'vim — repo engine (deterministic)', keys:[
                  ['h j k l (counts)','move — 5j works'],
                  ['Ctrl-d/u · Ctrl-f/b','half / full page'],
                  ['gg / G (+count)','top / bottom / :15 G'],
                  ['w b e 0 ^ $','word / line motions'],
                  ['H / M / L · zz/zt/zb','screen top / mid / bottom'],
                  ['x dd D yy Y p P','edit + put (counts: 3dd)'],
                  ['u · Ctrl-r','undo / redo (native history)'],
                  ['. · J','repeat / join'],
                  ['i a o A I · v V · R','insert / visual / replace'],
                  ['Tab / Shift-Tab','next / prev file buffer'],
                  [':','vim ex (:w :q :e …)'],
                  ['? in nvim','vim search-backward'],
                ]},
                {title:'vim — visual + insert', keys:[
                  ['extend: hjkl wbe','counts work (5j)'],
                  ['Ctrl+j/k · Ctrl+d/u','fast extend 5 lines / half-page'],
                  ['y / d / c','yank / delete / change'],
                  ['o','swap anchor'],
                  ['Esc','back to normal'],
                ]},
                {title:'shell — zsh (0:zsh image pane)', keys:[
                  ['help','list commands'],
                  ['nvim <file>','open in 2:nvim pane'],
                  ['Tab','complete'],
                  ['↑ ↓','history'],
                  ['Ctrl-L','clear'],
                  ['theme <name>','catppuccin/dracula/gruvbox/nord/solarized/tokyo/onedark/monokai'],
                ]},
              ].map(g=>(
                <div key={g.title} style={{minWidth:0}}>
                  <div style={{color:'#cba6f7', fontWeight:800, marginBottom:6, fontSize:12}}>{g.title}</div>
                  {g.keys.map(([k,v])=>(
                    <div key={k} style={{display:'flex', gap:10, whiteSpace:'nowrap', padding:'1px 0'}}>
                      <span style={{color:'#f9e2af', flex:'none', minWidth:110, fontWeight:600}}>{k}</span>
                      <span style={{color:'#cdd6f4', overflow:'hidden', textOverflow:'ellipsis'}}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{marginTop:14, color:'#6c7086', fontSize:11, display:'flex', gap:8, flexWrap:'wrap'}}>
              <span>Each tmux window (0/1/2) is rendered as image pane inside single panel — use <code style={{background:'#313244', padding:'1px 4px', borderRadius:3}}>Super+j/k</code> or <code style={{background:'#313244', padding:'1px 4px', borderRadius:3}}>C-b o</code> to cycle images.</span>
              <span style={{marginLeft:'auto', color:'#f9e2af'}}>Esc or ? to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
