// Syntax highlighting → per-line arrays of {text, color, bold?, italic?, href?}. Colors are theme keys, resolved by the renderer.
const seg = (text, color = 'fg', extra) => Object.assign({ text, color }, extra);

const KW = {
  rust: 'fn let mut pub use mod struct impl enum trait for in if else match return where self Self super crate as const static loop while break continue type ref move dyn unsafe async await true false Some None Ok Err'.split(' '),
  c: '#include #define #pragma if else for while do return switch case break continue struct typedef const static inline int float double void char unsigned long short bool sizeof __global__ __device__ __shared__ __restrict__ __forceinline__ __launch_bounds__ __syncthreads threadIdx blockIdx blockDim gridDim true false nullptr'.split(' '),
  lua: 'local function end if then else elseif for in do while repeat until return and or not nil true false'.split(' '),
  python: 'def class import from return if elif else for while in not and or is None True False with as lambda yield try except finally raise pass break continue'.split(' '),
  toml: [], tex: [], make: [], json: [], text: [], yaml: ['true','false','null'],
};
const TYPES = {
  rust: /\b([A-Z][A-Za-z0-9]*|u8|u16|u32|u64|usize|i8|i16|i32|i64|isize|f32|f64|bool|str)\b/,
  c: /\b(int|float|double|void|char|bool|size_t|__half|__half2|cudaError_t|MlpParams|[A-Z][A-Za-z0-9_]*_t)\b/,
};

function tokenizeCode(line, lang) {
  const out = []; let i = 0; const kws = KW[lang] || [];
  const lineComment = lang === 'lua' ? '--' : lang === 'python' || lang === 'toml' || lang === 'make' || lang === 'yaml' ? '#' : lang === 'tex' ? '%' : '//';
  while (i < line.length) {
    const rest = line.slice(i);
    let m;
    if (rest.startsWith(lineComment) || (lang === 'c' && rest.startsWith('/*'))) { out.push(seg(rest, 'dim', { italic: true })); break; }
    if ((m = /^("""[\s\S]*?"""|"([^"\\]|\\.)*"|'([^'\\]|\\.)*')/.exec(rest))) { out.push(seg(m[0], 'green')); i += m[0].length; continue; }
    if (lang === 'tex' && (m = /^\\[A-Za-z]+/.exec(rest))) { out.push(seg(m[0], 'blue')); i += m[0].length; continue; }
    if (lang === 'toml' && (m = /^\[[^\]]*\]/.exec(rest)) && i === 0) { out.push(seg(m[0], 'magenta', { bold: true })); i += m[0].length; continue; }
    if ((lang === 'toml' || lang === 'make' || lang === 'yaml') && (m = /^[A-Za-z_][\w./-]*(?=:(\s|$))/.exec(rest)) && /^\s*(- )?$/.test(line.slice(0, i))) { out.push(seg(m[0], 'blue')); i += m[0].length; continue; }
    if ((m = /^(#\[[^\]]*\]|@\w+)/.exec(rest)) && lang === 'rust') { out.push(seg(m[0], 'yellow')); i += m[0].length; continue; }
    if ((m = /^\b\d[\w.]*\b/.exec(rest)) || (m = /^(0x[0-9a-fA-F]+)/.exec(rest))) { out.push(seg(m[0], 'orange')); i += m[0].length; continue; }
    if ((m = /^#?[A-Za-z_][\w!]*/.exec(rest))) {
      const w = m[0]; const next = rest.slice(w.length);
      let color = 'fg', bold = false;
      if (kws.includes(w)) { color = 'magenta'; }
      else if (w.endsWith('!')) { color = 'cyan'; }
      else if (/^\s*\(/.test(next) || (lang === 'lua' && /^\s*[({"]/.test(next))) { color = 'blue'; }
      else if (TYPES[lang] && TYPES[lang].test(w) && new RegExp('^' + TYPES[lang].source + '$').test(w)) { color = 'yellow'; }
      out.push(seg(w, color, bold ? { bold } : undefined)); i += w.length; continue;
    }
    if ((m = /^[{}()\[\];,]/.exec(rest))) { out.push(seg(m[0], 'muted')); i += 1; continue; }
    if ((m = /^(->|=>|::|[-+*/%=<>!&|^~?:.]+)/.exec(rest))) { out.push(seg(m[0], 'cyan')); i += m[0].length; continue; }
    out.push(seg(rest[0])); i += 1;
  }
  return out.length ? out : [seg(' ')];
}

function inlineMd(text) {
  const segs = []; const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|:[a-z]+:)/g; let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push(seg(text.slice(last, m.index)));
    const s = m[0];
    if (/^:[a-z]+:$/.test(s)) segs.push(seg('', 'fg', { icon: s.slice(1, -1) }));
    else if (s.startsWith('**')) segs.push(seg(s.slice(2, -2), 'yellow', { bold: true }));
    else if (s.startsWith('`')) segs.push(seg(s.slice(1, -1), 'green'));
    else if (s.startsWith('[')) { const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(s); segs.push(seg(mm[1], 'cyan', { href: mm[2] })); }
    else segs.push(seg(s.slice(1, -1), 'orange', { italic: true }));
    last = m.index + s.length;
  }
  if (last < text.length) segs.push(seg(text.slice(last)));
  return segs.length ? segs : [seg(' ')];
}

function markdownLine(raw) {
  if (raw.startsWith('# ')) return [seg('# ', 'dim'), seg(raw.slice(2), 'blue', { bold: true })];
  if (raw.startsWith('## ')) return [seg('## ', 'dim')].concat(inlineMd(raw.slice(3)).map(x => Object.assign(x, { color: 'magenta', bold: true })));
  if (raw.startsWith('### ')) return [seg('### ', 'dim'), seg(raw.slice(4), 'yellow', { bold: true })];
  if (raw.startsWith('> ')) return [seg('> ', 'dim')].concat(inlineMd(raw.slice(2)).map(x => Object.assign(x, { italic: true, color: x.href ? x.color : x.bold ? 'fg' : 'muted' })));
  if (/^- \[[ x]\] /.test(raw)) { const done = raw[3] === 'x'; return [seg('- ', 'red'), seg(raw.slice(2, 5), done ? 'green' : 'dim'), seg(' '), ...inlineMd(raw.slice(6)).map(x => done ? Object.assign(x, { color: 'dim' }) : x)]; }
  if (raw.startsWith('- ')) return [seg('- ', 'red')].concat(inlineMd(raw.slice(2)));
  if (raw === '') return [seg(' ')];
  return inlineMd(raw);
}

function shLine(raw) {
  if (raw.startsWith('#')) return [seg(raw, 'dim', { italic: true })];
  if (raw === '') return [seg(' ')];
  const m = /^(\w+)(\s+)(.*?)(\s*#.*)?$/.exec(raw);
  if (!m) return [seg(raw)];
  const out = [seg(m[1], 'green'), seg(m[2])];
  const body = m[3];
  const url = /"(https?:[^"]+)"/.exec(body);
  if (url) out.push(seg(body.slice(0, url.index)), seg(url[0], 'cyan', { href: url[1] }), seg(body.slice(url.index + url[0].length)));
  else out.push(...body.split(/("[^"]*"|'[^']*')/).filter(Boolean).map(t => /^["']/.test(t) ? seg(t, 'green') : seg(t.replace(/\$\w+/g, m0 => m0), 'fg')));
  if (m[4]) { const im = /^(\s*#\s*):([a-z]+):(.*)$/.exec(m[4]); if (im) out.push(seg(im[1], 'dim', { italic: true }), seg('', 'muted', { icon: im[2] }), seg(im[3], 'dim', { italic: true })); else out.push(seg(m[4], 'dim', { italic: true })); }
  return out;
}

export function highlight(src, ft) {
  const lines = src.split('\n');
  const fn = ft === 'markdown' ? markdownLine : ft === 'sh' ? shLine : ft === 'text' ? (l) => [seg(l || ' ')] : (l) => tokenizeCode(l, ft);
  return lines.map((raw, i) => ({ n: i + 1, segs: fn(raw) }));
}
