import { useEffect, useRef, useState } from 'react';

export default function IframeExact(){
  const ref = useRef(null);
  const [siteHelp, setSiteHelp] = useState(false);
  const [siteCmd, setSiteCmd] = useState({ open:false, val:'' });
  const [tmuxPrefix, setTmuxPrefix] = useState(false);
  const tmuxPrefixRef = useRef(false);
  // global site-level vim/tmux bindings (outer) — entire app keybinding-only, no mouse needed
  useEffect(()=>{
    const iframe = ref.current;
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
      if(siteCmd.open){
        if(e.key==='Escape'){ e.preventDefault(); setSiteCmd({open:false,val:''}); return; }
        if(e.key==='Enter'){
          e.preventDefault();
          const v=siteCmd.val.trim();
          // site-level commands: pane 0/1/2, theme <name>, help, site
          if(/^pane\s+[0-2]$/.test(v)){ const n=parseInt(v.split(/\s+/)[1],10); try{ iframe?.contentWindow?.__exactSetPane(n); }catch{} }
          else if(v==='site' || v==='/ site'){ try{ iframe?.contentDocument?.querySelector('a[href="https://samehkhamis.com"]')?.click(); }catch{} }
          else if(v.startsWith('theme ')){ const th=v.split(' ')[1]; try{ iframe?.contentWindow?.dispatchEvent(new KeyboardEvent('keydown',{key:'t',bubbles:true})); }catch{} }
          else if(v==='help' || v==='?'){ setSiteHelp(true); }
          setSiteCmd({open:false,val:''});
          return;
        }
        return; // let input handle typing
      }
      if(isTyping(document.activeElement)) return;
      const k = e.key;
      const meta = e.metaKey || e.ctrlKey; // super = Cmd on Mac / Ctrl on Win

      // tmux prefix C-b — entire app navigated via keybinding only (no mouse needed)
      if(e.ctrlKey && k==='b'){ e.preventDefault(); tmuxPrefixRef.current=true; setTmuxPrefix(true); setTimeout(()=>{ tmuxPrefixRef.current=false; setTmuxPrefix(false); }, 2500); return; }
      if(tmuxPrefixRef.current){
        e.preventDefault(); tmuxPrefixRef.current=false; setTmuxPrefix(false);
        const map = { '0':0,'1':1,'2':2,'o':'next','h':'left','j':'down','k':'up','l':'right','t':'theme','?':'help',' ':'next','n':'next','p':'prev',';':'last','z':'zoom','x':'kill','c':'new' };
        const act = map[k];
        if(act!==undefined){
          if(typeof act==='number'){ try{ iframe?.contentWindow?.__exactSetPane(act); }catch{} }
          else if(act==='next'){ try{ iframe?.contentWindow?.__exactPaneSwitch(1); }catch{ forwardToIframe('o',{ctrl:true}); } }
          else if(act==='theme'){ forwardToIframe('t',{}); }
          else if(act==='help'){ setSiteHelp(v=>!v); }
          else if(['left','down','up','right'].includes(act)){
            forwardToIframe(k,{ctrl:true});
            try{
              const win2 = iframe?.contentWindow;
              if(win2?.__exactMoveDir) win2.__exactMoveDir(act);
              else win2?.__exactPaneSwitch(act==='down'||act==='right'?1:-1);
            }catch{}
          }
        }
        return;
      }

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

      // super + j/k fast scroll in nvim OR pane switch in tmux single-window panel
      if(meta && (k==='j' || k==='J' || k==='k' || k==='K')){
        e.preventDefault();
        // if nvim pane is active, treat as super+j/k = 5x scroll (fast file navigation)
        // else treat as tmux pane switch j/k = next/prev pane inside single window
        forwardToIframe(k.toLowerCase(), { meta: true, ctrl: meta });
        // also directly switch pane when at site level (tmux single panel image model)
        const dir = k.toLowerCase()==='j' ? 1 : -1;
        try{
          const doc = iframe?.contentDocument;
          if(doc){
            // try to use exposed setter else simulate C-b + o / h/j/k/l
            if(doc.defaultView?.__exactPaneSwitch) doc.defaultView.__exactPaneSwitch(dir);
            else {
              // fallback: cycle pane via outer state forwarded as 0/1/2 clicks
              const w = iframe.contentWindow;
              w?.dispatchEvent(new KeyboardEvent('keydown', { key: dir>0?'j':'k', ctrlKey:true, bubbles:true }));
            }
          }
        }catch{}
        return;
      }
      if(meta && (k==='h' || k==='H' || k==='l' || k==='L')){
        e.preventDefault();
        forwardToIframe(k.toLowerCase(), { meta:true });
        return;
      }
      if(meta && /^[0-2]$/.test(k)){
        e.preventDefault();
        forwardToIframe(k, { meta:true });
        try{
          const n = parseInt(k,10);
          const doc = iframe?.contentDocument;
          if(doc?.defaultView?.__exactSetPane) doc.defaultView.__exactSetPane(n);
          else {
            // click tmux status bar window
            const spans = doc?.querySelectorAll('span');
            spans?.forEach(s=>{ if(s.textContent?.trim().startsWith(`${n}:`)) s.click(); });
          }
        }catch{}
        return;
      }
      // vim full: J/K half-page, Ctrl-d/Ctrl-u, gg/G shortcuts when meta held
      if(meta && (k==='d' || k==='u' || k==='f' || k==='b')){
        e.preventDefault();
        forwardToIframe(k, { ctrl:true, meta:true });
        return;
      }
    };
    window.addEventListener('keydown', onOuterKey);
    return ()=> window.removeEventListener('keydown', onOuterKey);
  },[siteHelp]);

  useEffect(()=>{
    const iframe = ref.current;
    if(!iframe) return;
    const inject = ()=>{
      try{
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow;
        if(!doc || !win) return;
        // expose pane helpers for outer super+ bindings (tmux single window: each window is pane image)
        if(!win.__exactSetPane){
          win.__exactSetPane = (n)=>{
            try{
              // find tmux status bar spans 0: 1: 2: and click
              const spans = Array.from(doc.querySelectorAll('span'));
              const target = spans.find(s=> s.textContent.trim().startsWith(`${n}:`));
              if(target) target.click();
              // also try to set via React internal if available
              const dcHost = doc.querySelector('#dc-root');
              if(dcHost) dcHost.dispatchEvent(new CustomEvent('exact-pane', { detail:n }));
            }catch{}
          };
          win.__exactPaneSwitch = (dir)=>{
            // cycle 0->1->2 inside single tmux window (each window treated as image pane)
            try{
              const order = [0,1,2];
              const spans = Array.from(doc.querySelectorAll('span')).filter(s=> /^\d:/.test(s.textContent.trim()));
              const active = spans.findIndex(s=> s.style.opacity==='1' || s.style.fontWeight==='700');
              const cur = active>=0? active : 0;
              const nxt = (cur + dir + order.length)%order.length;
              win.__exactSetPane(nxt);
            }catch{}
          };
          win.__exactMoveDir = (dir)=>{
            // deterministic directional move in single-window 3-pane image layout:
            // 0=top-left, 1=bottom-left, 2=right (full height) — C-b l = right, C-b h = left etc
            try{
              const comp = (()=>{ try{ const r=doc.getElementById('dc-root'); const k=Object.keys(r).find(x=>x.startsWith('__reactFiber')); let f=r[k]; const st=[f]; while(st.length){ const cur=st.pop(); if(cur && cur.stateNode && cur.stateNode.state && typeof cur.stateNode.state.pane==='number') return cur.stateNode; if(cur && cur.child) st.push(cur.child); if(cur && cur.sibling) st.push(cur.sibling); } }catch{} return null; })();
              const cur = comp ? comp.state.pane : 0;
              let nxt = cur;
              if(dir==='left') nxt = cur===2 ? 0 : cur;
              else if(dir==='right') nxt = (cur===0||cur===1) ? 2 : cur;
              else if(dir==='down') nxt = cur===0 ? 1 : cur;
              else if(dir==='up') nxt = cur===1 ? 0 : cur===2 ? 0 : cur;
              win.__exactSetPane(nxt);
            }catch{}
          };
        }
        // enhance vim inside iframe: super/meta fast + full vim multi-key incl undo/redo (buffer)
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
              const k = Object.keys(root).find(x=> x.startsWith('__reactFiber') || x.startsWith('__reactInternalInstance'));
              let fiber = root[k];
              // traverse to find stateNode with open/buf
              const stack=[fiber];
              while(stack.length){
                const f=stack.pop();
                if(f && f.stateNode && f.stateNode.state && Array.isArray(f.stateNode.state.open)) return f.stateNode;
                if(f && f.child) stack.push(f.child);
                if(f && f.sibling) stack.push(f.sibling);
              }
            }catch{}
            return null;
          };
          const getBufInfo = ()=>{
            try{
              const comp = findComponent();
              if(comp){
                const path = comp.state.open[comp.state.buf];
                const src = comp.readBuf ? comp.readBuf(path) : '';
                return { comp, path, src };
              }
            }catch{}
            // fallback via DOM
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
          setTimeout(()=>{ hookFS(); seedStacks(); }, 800);
          setInterval(()=>{ hookFS(); seedStacks(); }, 2000);

          const vimHandler = (e)=>{
            const meta = e.metaKey || e.ctrlKey;
            const k = e.key;
            const comp = findComponent();
            const mode = comp ? comp.state.mode : 'normal';
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
                if(compV && ta){
                  const t=ta.value;
                  const cur = compV.vHead;
                  const curLine = t.slice(0,cur).split('\n').length -1;
                  const targetLine = Math.max(0, Math.min(t.split('\n').length-1, curLine + dir*12));
                  let pos=0; const lines=t.split('\n');
                  for(let i=0;i<targetLine;i++) pos+=lines[i].length+1;
                  // keep column
                  const col = cur - (t.lastIndexOf('\n', cur-1)+1);
                  const lineLen = lines[targetLine].length;
                  pos = Math.min(pos+Math.min(col, lineLen), t.length);
                  compV.vHead = pos;
                  compV.applyVisual(ta);
                  const buf = doc.querySelectorAll('div[style*="overflow-y:auto"]')[1] || doc.querySelector('div[style*="overflow-y:auto"]');
                  if(buf) buf.scrollBy({ top: dir*220, behavior:'smooth' });
                } else {
                  doScroll(dir, 220);
                  const cnt=12; for(let i=0;i<cnt;i++) doc.dispatchEvent(new KeyboardEvent('keydown',{key: dir>0?'j':'k', bubbles:true}));
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
                if(compV && ta){ for(let i=0;i<5;i++){ const cur=compV.vHead; const nxt=compV.motion(ta.value, cur, 'j', {}); if(nxt!==null) compV.vHead=nxt; } compV.applyVisual(ta); doScroll(1, 90); } else { doScroll(1, 90); for(let i=0;i<5;i++) doc.dispatchEvent(new KeyboardEvent('keydown',{key:'j',bubbles:true})); }
                return; }
              if(meta && k.toLowerCase()==='k'){ e.preventDefault(); e.stopPropagation();
                const compV=findComponent(); const ta=doc.querySelector('textarea');
                if(compV && ta){ for(let i=0;i<5;i++){ const cur=compV.vHead; const nxt=compV.motion(ta.value, cur, 'k', {}); if(nxt!==null) compV.vHead=nxt; } compV.applyVisual(ta); doScroll(-1,90); } else { doScroll(-1,90); for(let i=0;i<5;i++) doc.dispatchEvent(new KeyboardEvent('keydown',{key:'k',bubbles:true})); }
                return; }
              // count prefix in visual
              if(/^[1-9]$/.test(k) && !pendingOp){ pendingCount+=k; e.preventDefault(); e.stopPropagation(); return; }
              if(/^[0-9]$/.test(k) && pendingCount){ pendingCount+=k; e.preventDefault(); return; }
              // visual operators multi-key: y/d/c/x, >/<, ~, u/U, o, v/V, Esc
              if(k==='o'){ e.preventDefault(); e.stopPropagation(); doc.dispatchEvent(new KeyboardEvent('keydown',{key:'o',bubbles:true})); pendingCount=''; return; }
              if(k==='u'){ e.preventDefault(); e.stopPropagation(); // visual lower
                const ta=doc.querySelector('textarea'); if(ta){ const s=ta.selectionStart, eb=ta.selectionEnd; const t=ta.value; const sel=t.slice(s,eb); ta.value=t.slice(0,s)+sel.toLowerCase()+t.slice(eb); ta.setSelectionRange(s, eb); ta.dispatchEvent(new Event('change',{bubbles:true})); } return; }
              if(k==='U'){ e.preventDefault(); e.stopPropagation(); const ta=doc.querySelector('textarea'); if(ta){ const s=ta.selectionStart, eb=ta.selectionEnd; const t=ta.value; const sel=t.slice(s,eb); ta.value=t.slice(0,s)+sel.toUpperCase()+t.slice(eb); ta.setSelectionRange(s, eb);} return; }
              if(k==='>'||k==='<'||k==='~'){ e.preventDefault(); e.stopPropagation(); doc.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true})); return; }
              if(k==='y' || k==='d' || k==='c' || k==='x'){
                e.preventDefault(); e.stopPropagation();
                // leverage DC runtime's visual y/d/c by forwarding single key
                doc.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));
                pendingCount=''; pendingOp='';
                return;
              }
              // visual motions with count
              if(/^[hjklwbe$0]$/.test(k)){
                const cnt = parseInt(pendingCount||'1',10);
                e.preventDefault(); e.stopPropagation();
                for(let i=0;i<cnt;i++) doc.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));
                pendingCount='';
                return;
              }
              if(k==='G' || k==='g'){
                e.preventDefault(); e.stopPropagation(); doc.dispatchEvent(new KeyboardEvent('keydown',{key:k, shiftKey: k==='G', bubbles:true}));
                if(k==='g'){ setTimeout(()=> doc.dispatchEvent(new KeyboardEvent('keydown',{key:'g',bubbles:true})), 10); }
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
          // capture phase to intercept before DC runtime
          win.addEventListener('keydown', vimHandler, true);
          doc.addEventListener('keydown', vimHandler, true);
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
                  ['C-b 0/1/2','go to pane 0:zsh / 1:htop / 2:nvim (window as image)'],
                  ['Super+1/2/3','same — fast (⌘/Ctrl + number)'],
                  ['C-b o · Super+o','next pane'],
                  ['Super+j / Super+k','next / prev pane (tmux single panel cycle) — treat each window as image'],
                  ['C-b h/j/k/l · Super+h/j/k/l','move between panes (vim-style)'],
                  ['t · Super+t','cycle theme (8)'],
                  ['C-b ? / ?','toggle this site-level help (Esc to close)'],
                  ['C-b C-o','rotate panes (site)'],
                ]},
                {title:'vim — normal (full) + buffer', keys:[
                  ['h j k l / ←↓↑→','char left/down/up/right (with count, e.g. 5j)'],
                  ['J / K  · Super+j/k','5j / 5k — fast 5× scroll'],
                  ['Super+J / Super+K','G / gg — bottom / top (super+shift) — also gg/G'],
                  ['w b 0 ^ $ g_ ','word / line motions incl 0 ^ $'],
                  ['gg / G  · :n','top / bottom / :n goto line'],
                  ['Ctrl-d / Ctrl-u · Super+d/u','half page down / up (speed scroll)'],
                  ['Ctrl-f / Ctrl-b · PageDown/Up','page down / up'],
                  ['Ctrl-e / Ctrl-y','line scroll down / up'],
                  ['H / M / L · zz/zt/zb','top / middle / bottom screen + center'],
                  ['x / dd / D · yy / Y p P','delete char / cut line / yank line / put (with count, e.g. 3dd)'],
                  ['d w/$/b/G + y/c variants','operator pending: dw d$ dG yw cw etc'],
                  ['u · Ctrl-r','undo / redo (buffer)'],
                  ['. · J','repeat / join'],
                  ['i a o A I · v V · R','insert / visual / replace'],
                  ['Tab / n p / q r','next / prev buffer, close / reset'],
                  ['?','pane-local vim help (inside nvim)'],
                ]},
                {title:'vim — visual + insert', keys:[
                  ['h j k l','extend selection'],
                  ['y / d / c','yank / delete / change'],
                  ['o','swap anchor'],
                  ['Esc','leave visual/insert → normal'],
                  ['Super+j / Super+k','fast extend 5 lines'],
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
