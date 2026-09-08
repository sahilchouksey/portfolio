// Command interpreter for the simulated shell. Pure logic: takes a line, returns output segments + side effects via hooks.
import { USER, HOST, HOME, BIN } from './fs.js';

const L = (text, color = 'fg') => ({ segs: [{ text, color }] });
const S = (...segs) => ({ segs });

const FORTUNES = [
  'The best way to predict the future is to render it.',
  'Real-time is a feature, not an optimization.',
  'All models are wrong; some run at 60 fps.',
  'A camera is just a very fast, very cheap lidar with opinions.',
  'Premature optimization is the root of all evil — except in CUDA, where it is the job.',
  'It works on my GPU.',
  'Every camera is a depth sensor that has not been trained yet.',
  'Real-time means the user never learns what latency is.',
  'A Kalman filter is just Bayes with a deadline.',
  'If your reconstruction looks right from one view, you have a painting.',
  'Occlusion is nature\'s way of keeping computer vision employed.',
  'The world is 3D; the training data is not. Adjust accordingly.',
  'Shared memory is the only memory that ever loved you back.',
  'ptxas info: used 255 registers. ptxas regret: 256.',
  'Photorealism is measured in how long it takes someone to notice.',
  'Structure from motion, insight from failure.',
  'The GPU is idle. This is the real emergency.',
  'Ship the tracker, then write the paper. Never the other order.',
  'A pixel is half a story. The other half is where the camera was.',
];

function tokenize(line) {
  const out = []; let cur = '', q = null, had = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === q) q = null; else cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; had = true; continue; }
    if (ch === ' ') { if (cur || had) { out.push(cur); cur = ''; had = false; } continue; }
    cur += ch;
  }
  if (cur || had) out.push(cur);
  return out;
}

function flags(args) {
  const f = new Set(), rest = [];
  for (const a of args) { if (a.startsWith('-') && a.length > 1 && !/^-\d/.test(a)) { for (const c of a.replace(/^-+/, '')) f.add(c); } else rest.push(a); }
  return { f, rest };
}

const fmtSize = (n) => n < 1024 ? `${n}` : n < 1048576 ? `${(n / 1024).toFixed(1)}K` : `${(n / 1048576).toFixed(1)}M`;
const glob = (pat) => new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');

export function createShell(ctx) {
  const { fs, hooks } = ctx;
  const env = { USER, HOME, SHELL: '/bin/zsh', TERM: 'tmux-256color', EDITOR: 'nvim', LANG: 'en_US.UTF-8', HOSTNAME: HOST, PATH: '/home/sameh/.cargo/bin:/usr/local/cuda/bin:/usr/bin' };
  const history = ctx.history || [];
  const bootTime = Date.now() - 1000 * 60 * 60 * 37;
  const expand = (s) => s.replace(/\$(\w+)|\$\{(\w+)\}/g, (m, a, b) => { const k = a || b; return k === 'PWD' ? fs.cwd : (env[k] ?? ''); });

  const cmds = {
    help() {
      const rows = [
        ['files', 'ls cd pwd cat head tail wc grep find tree touch mkdir rm mv cp echo > >> |'],
        ['system', 'hostname whoami id uname date uptime free df ps env which man history'],
        ['apps', 'nvim <file>  htop  neofetch  theme <name>  make  cargo  git  nvcc  gcc  bazel  kubectl  cowsay  fortune'],
      ];
      return [L('zsh 5.9 (x86_64-halfpixel-linux-gnu) — builtins and commands on this host:', 'muted'), ...rows.map(([k, v]) => S({ text: k.padEnd(8), color: 'blue' }, { text: v, color: 'fg' }))];
    },
    pwd() { return [L(fs.cwd)]; },
    cd(a) { const t = a[0] || HOME; if (!fs.exists(t)) throw `cd: no such file or directory: ${t}`; if (!fs.isDir(t)) throw `cd: not a directory: ${t}`; fs.cwd = fs.resolve(t); return []; },
    ls(a) {
      const { f, rest } = flags(a); const paths = rest.length ? rest : ['.']; const out = [];
      for (const p of paths) {
        if (paths.length > 1) out.push(L(`${p}:`, 'muted'));
        const ents = fs.list(p).filter(([n]) => f.has('a') || !n.startsWith('.'));
        if (f.has('a') && fs.isDir(p)) ents.unshift(['.', fs.get(p)], ['..', fs.get(fs.resolve(p + '/..'))]);
        if (f.has('l')) {
          out.push(L(`total ${ents.length}`, 'muted'));
          for (const [n, node] of ents) {
            const dir = node.t === 'd', size = dir ? 4096 : node.s.length;
            out.push(S({ text: (dir ? 'drwxr-xr-x' : node.x ? '-rwxr-xr-x' : '-rw-r--r--') + ' ', color: 'muted' }, { text: USER + ' ', color: 'muted' }, { text: fmtSize(size).padStart(5) + ' ', color: 'fg' }, { text: 'Sep 4 ', color: 'muted' }, { text: n, color: dir ? 'blue' : node.x ? 'green' : 'fg', bold: dir }));
          }
        } else {
          const segs = [];
          ents.forEach(([n, node], i) => { if (i) segs.push({ text: '  ', color: 'fg' }); segs.push({ text: node.t === 'd' ? n + '/' : n, color: node.t === 'd' ? 'blue' : node.x ? 'green' : 'fg', bold: node.t === 'd' }); });
          if (segs.length) out.push({ segs });
        }
      }
      return out;
    },
    cat(a, stdin) { if (!a.length) return stdin ? stdin.split('\n').map(l => L(l)) : []; return a.flatMap(p => fs.read(p).replace(/\n$/, '').split('\n').map(l => L(l))); },
    head(a, stdin) { const { rest } = flags(a); let n = 10; const i = a.indexOf('-n'); if (i >= 0) { n = +a[i + 1]; rest.splice(rest.indexOf(a[i + 1]), 1); } const src = rest.length ? fs.read(rest[0]) : stdin || ''; return src.replace(/\n$/, '').split('\n').slice(0, n).map(l => L(l)); },
    tail(a, stdin) { const { rest } = flags(a); let n = 10; const i = a.indexOf('-n'); if (i >= 0) { n = +a[i + 1]; rest.splice(rest.indexOf(a[i + 1]), 1); } const src = rest.length ? fs.read(rest[0]) : stdin || ''; return src.replace(/\n$/, '').split('\n').slice(-n).map(l => L(l)); },
    wc(a, stdin) { const src = a.length ? fs.read(a[0]) : stdin || ''; const lines = src.split('\n').length - (src.endsWith('\n') ? 1 : 0); const words = src.split(/\s+/).filter(Boolean).length; return [L(`${String(lines).padStart(7)}${String(words).padStart(8)}${String(src.length).padStart(8)} ${a[0] || ''}`)]; },
    grep(a, stdin) {
      const { f, rest } = flags(a); if (!rest.length) throw 'usage: grep [-rin] pattern [file...]';
      const re = new RegExp(rest[0], f.has('i') ? 'i' : ''); const out = [];
      const scan = (text, label) => text.replace(/\n$/, '').split('\n').forEach((l, i) => { if (re.test(l)) { const segs = []; if (label) segs.push({ text: label + ':', color: 'magenta' }); if (f.has('n')) segs.push({ text: (i + 1) + ':', color: 'green' }); const m = re.exec(l); if (m) { segs.push({ text: l.slice(0, m.index), color: 'fg' }, { text: m[0], color: 'red', bold: true }, { text: l.slice(m.index + m[0].length), color: 'fg' }); } else segs.push({ text: l, color: 'fg' }); out.push({ segs }); } });
      if (rest.length === 1) { scan(stdin || '', null); return out; }
      for (const p of rest.slice(1)) {
        if (fs.isDir(p)) { if (!f.has('r')) throw `grep: ${p}: Is a directory`; fs.walk(p, (abs, n) => { if (n.t === 'f') scan(n.s, fs.pretty(abs)); }); }
        else scan(fs.read(p), rest.length > 2 || f.has('r') ? p : null);
      }
      return out;
    },
    find(a) { const { rest } = flags(a.filter(x => x !== '-name' && x !== '-type')); const start = rest[0] && !rest[0].includes('*') && fs.exists(rest[0]) ? rest[0] : '.'; const ni = a.indexOf('-name'); const re = ni >= 0 ? glob(a[ni + 1]) : null; const ti = a.indexOf('-type'); const type = ti >= 0 ? a[ti + 1] : null; const out = []; fs.walk(start, (abs, n) => { const name = abs.split('/').pop(); if (re && !re.test(name)) return; if (type && (type === 'd') !== (n.t === 'd')) return; out.push(L(start === '.' ? '.' + abs.slice(fs.cwd.length) : abs, n.t === 'd' ? 'blue' : 'fg')); }); return out; },
    tree(a) { const root = a[0] || '.'; if (!fs.isDir(root)) throw `tree: ${root}: not a directory`; const out = [L(fs.pretty(root), 'blue')]; let nd = 0, nf = 0; const rec = (p, prefix) => { const ents = fs.list(p).filter(([n]) => !n.startsWith('.')); ents.forEach(([n, node], i) => { const last = i === ents.length - 1; out.push(S({ text: prefix + (last ? '└── ' : '├── '), color: 'dim' }, { text: n, color: node.t === 'd' ? 'blue' : node.x ? 'green' : 'fg', bold: node.t === 'd' })); if (node.t === 'd') { nd++; rec(p + '/' + n, prefix + (last ? '    ' : '│   ')); } else nf++; }); }; rec(root, ''); out.push(L(''), L(`${nd} directories, ${nf} files`, 'muted')); return out; },
    echo(a) { return [L(a.map(expand).join(' '))]; },
    touch(a) { if (!a.length) throw 'touch: missing file operand'; a.forEach(p => fs.touch(p)); return []; },
    mkdir(a) { const { f, rest } = flags(a); if (!rest.length) throw 'mkdir: missing operand'; rest.forEach(p => fs.mkdir(p, f.has('p'))); return []; },
    rmdir(a) { a.forEach(p => { if (!fs.isDir(p)) throw `rmdir: failed to remove '${p}': Not a directory`; if (fs.list(p).length) throw `rmdir: failed to remove '${p}': Directory not empty`; fs.rm(p, true); }); return []; },
    rm(a) {
      const { f, rest } = flags(a); if (!rest.length) throw 'rm: missing operand';
      if (rest.some(p => fs.resolve(p) === '/') && f.has('r')) return [L('rm: it is dangerous to operate recursively on \'/\'', 'red'), L('rm: use --no-preserve-root to override this failsafe (it will not help you here)', 'muted')];
      rest.forEach(p => { try { fs.rm(p, f.has('r')); } catch (e) { if (!f.has('f')) throw 'rm: ' + e; } }); return [];
    },
    mv(a) { if (a.length < 2) throw 'mv: missing destination'; fs.mv(a[0], a[1]); return []; },
    cp(a) { const { f, rest } = flags(a); if (rest.length < 2) throw 'cp: missing destination'; fs.cp(rest[0], rest[1], f.has('r')); return []; },
    hostname() { return [L(HOST)]; },
    whoami() { return [L(USER)]; },
    id() { return [L(`uid=1000(${USER}) gid=1000(${USER}) groups=1000(${USER}),27(sudo),44(video),999(docker)`)]; },
    uname(a) { const { f } = flags(a); return [L(f.has('a') ? `Linux ${HOST} 6.12.0-spatial #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux` : f.has('r') ? '6.12.0-spatial' : f.has('n') ? HOST : 'Linux')]; },
    date() { return [L(new Date().toString().replace(/ \(.*\)$/, ''))]; },
    uptime() { const up = Date.now() - bootTime, h = Math.floor(up / 3.6e6), m = Math.floor(up / 6e4) % 60; return [L(` ${new Date().toLocaleTimeString([], { hour12: false })} up 1 day, ${h - 24}:${String(m).padStart(2, '0')},  1 user,  load average: 0.42, 0.61, 0.58`)]; },
    clear() { hooks.clear(); return []; },
    history() { return history.map((h, i) => S({ text: String(i + 1).padStart(5) + '  ', color: 'muted' }, { text: h, color: 'fg' })); },
    neofetch() { hooks.neofetch(); return []; },
    htop() { hooks.focus(1); return [L('htop 3.3.0 already attached in pane 1 — j/k select · P/M/N sort by cpu/mem/pid', 'muted')]; },
    nvim(a) { if (!a.length) return [L('NVIM v0.10.4 — already running in pane 2 (C-b 2). Pass a file to open it there.', 'muted')]; const p = a[0]; if (fs.isDir(p)) throw `nvim: "${p}" is a directory`; if (!fs.exists(p)) fs.write(p, ''); hooks.nvim(fs.resolve(p)); return [L(`"${fs.pretty(p)}" opened in pane 2`, 'muted')]; },
    theme(a) { if (!a.length) return [S({ text: 'themes: ', color: 'muted' }, { text: hooks.themes.join(' '), color: 'cyan' })]; if (!hooks.themes.includes(a[0])) throw `theme: unknown theme '${a[0]}'`; hooks.theme(a[0]); return []; },
    env() { return Object.entries(env).map(([k, v]) => S({ text: k + '=', color: 'blue' }, { text: v, color: 'fg' })); },
    export(a) { a.forEach(kv => { const [k, ...v] = kv.split('='); if (k) env[k] = expand(v.join('=')); }); return []; },
    which(a) { return a.map(c => BIN.includes(c) ? L(`/usr/bin/${c}`) : L(`${c} not found`, 'red')); },
    ps() { const procs = hooks.procs(); return [L('  PID TTY          TIME CMD', 'muted'), ...procs.map(p => L(`${p.pid.padStart(5)} pts/0    00:${String(Math.floor(p.cpu)).padStart(2, '0')}:14 ${p.name}`))]; },
    free() { return [L('               total        used        free      shared  buff/cache   available', 'muted'), L(`Mem:           503Gi       118Gi       379Gi       1.2Gi        57Gi       439Gi`), L(`Swap:             0B          0B          0B`)]; },
    df() { return [L('Filesystem      Size  Used Avail Use% Mounted on', 'muted'), L('/dev/nvme0n1p2  3.6T  1.9T  1.7T  53% /'), L('/dev/nvme1n1    7.3T  6.1T  1.2T  84% /data'), L('tmpfs           252G   12M  252G   1% /dev/shm')]; },
    man(a) { const c = a[0]; if (!c) throw 'What manual page do you want?'; if (!cmds[c]) throw `No manual entry for ${c}`; return [L(`${c.toUpperCase()}(1)`, 'yellow'), L(''), L(`NAME`, 'blue'), L(`       ${c} — halfpixel OS coreutils build. Supports the options you would actually type.`), L(''), L('SEE ALSO', 'blue'), L('       help(1), info coreutils')]; },
    sudo(a) { if (!a.length) return [L('usage: sudo command')]; return [L(`[sudo] password for ${USER}: `, 'fg'), L(`${USER} is not in the sudoers file.  This incident will be reported.`, 'red')]; },
    exit() { return [L('logout', 'muted'), L('Connection to halfpixel closed.', 'muted'), L('...reconnecting to tmux session "sameh" — you cannot leave. C-b 2 for the resume.', 'muted')]; },
    logout() { return cmds.exit(); },
    cowsay(a, stdin) { const msg = a.length ? a.join(' ') : (stdin || '').trim() || 'moo'; const lines = msg.split('\n'); const w = Math.max(...lines.map(l => l.length)); const bar = '-'.repeat(w + 2); const box = lines.length === 1 ? [`< ${msg} >`] : lines.map((l, i) => { const p = l.padEnd(w); return i === 0 ? `/ ${p} \\` : i === lines.length - 1 ? `\\ ${p} /` : `| ${p} |`; }); return [L(` ${bar}`), ...box.map(l => L(l)), L(` ${bar}`), L('        \\   ^__^'), L('         \\  (oo)\\_______'), L('            (__)\\       )\\/\\'), L('                ||----w |'), L('                ||     ||')]; },
    fortune() { return [L(FORTUNES[Math.floor(Math.random() * FORTUNES.length)])]; },
    make(a) { const ci = a.indexOf('-C'); const dir = ci >= 0 ? a[ci + 1] : '.'; if (!fs.exists(fs.resolve(dir + '/Makefile'))) throw 'make: *** No targets specified and no makefile found.  Stop.'; return [L('nvcc -O3 -std=c++17 -arch=sm_90 -lineinfo --use_fast_math -c -o mlp_megakernel.o mlp_megakernel.cu', 'muted'), L('ptxas info    : Used 96 registers, 98304 bytes smem, 400 bytes cmem[0]', 'muted'), L('nvcc -O3 -std=c++17 -arch=sm_90 -lineinfo --use_fast_math -x cu -c -o main.o main.cc', 'muted'), L('nvcc -O3 -std=c++17 -arch=sm_90 -lineinfo --use_fast_math -o mlp_megakernel mlp_megakernel.o main.o', 'muted')]; },
    nvcc(a) { if (!a.length) throw 'nvcc fatal   : No input files specified; use option --help for more information'; return [L(`ptxas info    : Compiling entry function 'mlp_megakernel' for 'sm_90'`, 'muted'), L('ptxas info    : Used 96 registers, 98304 bytes smem', 'muted')]; },
    gcc(a) {
      const { f, rest } = flags(a); const src = rest.find(x => /\.(c|cc|cpp|cu)$/.test(x));
      if (!src) throw 'gcc: fatal error: no input files\ncompilation terminated.';
      if (!fs.exists(src)) throw `gcc: error: ${src}: No such file or directory`;
      const oi = a.indexOf('-o'); const out = oi >= 0 ? a[oi + 1] : 'a.out';
      if (/\.cu$/.test(src)) return [L(`${src}:1:10: fatal error: cuda_fp16.h: No such file or directory`, 'red'), L('compilation terminated. (hint: use nvcc)', 'muted')];
      fs.write(out, '#!ELF (simulated)'); fs.get(out).x = 1;
      return f.has('W') ? [L(`${src}: In function 'main':`, 'muted'), L(`${src}:12:9: warning: unused variable 'tmp' [-Wunused-variable]`, 'yellow')] : [];
    },
    bazel(a) {
      const sub = a[0], target = a[1] || '//...';
      if (!sub) throw 'Usage: bazel <command> <options> ...\n  build  test  run  query  clean';
      const hdr = [S({ text: 'INFO: ', color: 'green' }, { text: 'Analyzed 14 targets (0 packages loaded, 0 targets configured).', color: 'fg' }), S({ text: 'INFO: ', color: 'green' }, { text: 'Found 14 targets...', color: 'fg' })];
      if (sub === 'build') return [...hdr, S({ text: 'INFO: ', color: 'green' }, { text: `Elapsed time: 2.317s, Critical Path: 1.92s`, color: 'fg' }), S({ text: 'INFO: ', color: 'green' }, { text: '38 processes: 36 remote cache hit, 2 linux-sandbox.', color: 'fg' }), S({ text: 'INFO: ', color: 'green' }, { text: 'Build completed successfully, 41 total actions', color: 'fg' })];
      if (sub === 'test') return [...hdr, S({ text: '//spatial/tracker:msckf_test', color: 'fg' }, { text: '        PASSED in 0.4s', color: 'green' }), S({ text: '//spatial/pose:se3_test', color: 'fg' }, { text: '            PASSED in 0.1s', color: 'green' }), S({ text: '//megakernel:mlp_bench', color: 'fg' }, { text: '             PASSED in 1.8s', color: 'green' }), L(''), L('Executed 3 out of 3 tests: 3 tests pass.', 'green')];
      if (sub === 'run') return [...hdr, L(`INFO: Running command line: bazel-bin/${target.replace(/^\/\//, '').replace(':', '/')}`, 'muted'), L('WARN cam0: no frames — /dev/video0 busy (another tracker holds it)', 'yellow')];
      if (sub === 'query') return ['//spatial:spatial', '//spatial/pose:pose', '//spatial/pose:se3_test', '//spatial/tracker:tracker', '//spatial/tracker:msckf_test', '//megakernel:mlp_megakernel', '//megakernel:mlp_bench'].map(t => L(t));
      if (sub === 'clean') return [S({ text: 'INFO: ', color: 'green' }, { text: 'Starting clean.', color: 'fg' })];
      throw `Command '${sub}' not found. Try 'bazel help'.`;
    },
    kubectl(a) {
      const sub = a[0], kind = (a[1] || '').replace(/s$/, '');
      const ctx = 'gke_halfpixel-prod_us-west1_gpu-fleet';
      if (!sub) throw 'kubectl controls the Kubernetes cluster manager.\n\n  get  describe  logs  top  config';
      if (sub === 'config') return [L(`current-context: ${ctx}`)];
      if (sub === 'get' && (kind === 'node' || kind === 'no')) return [L('NAME                      STATUS   ROLES    AGE   VERSION   GPU', 'muted'), L('gpu-fleet-h100-0          Ready    worker   41d   v1.31.2   8×H100'), L('gpu-fleet-h100-1          Ready    worker   41d   v1.31.2   8×H100'), L('gpu-fleet-h100-2          Ready    worker   41d   v1.31.2   8×H100'), L('gpu-fleet-h100-3          Ready    worker   12d   v1.31.2   8×H100'), L('cpu-ingest-pool-a1        Ready    worker   41d   v1.31.2   -'), L('cpu-ingest-pool-a2        Ready    worker   41d   v1.31.2   -')];
      if (sub === 'get' && (kind === 'pod' || kind === 'po')) return [L('NAME                                 READY   STATUS      RESTARTS   AGE', 'muted'), S({ text: 'geospatial-train-worker-0            ', color: 'fg' }, { text: '1/1     Running     0          2d14h', color: 'green' }), S({ text: 'geospatial-train-worker-1            ', color: 'fg' }, { text: '1/1     Running     0          2d14h', color: 'green' }), S({ text: 'geospatial-train-worker-2            ', color: 'fg' }, { text: '1/1     Running     1          2d14h', color: 'green' }), S({ text: 'geospatial-train-worker-3            ', color: 'fg' }, { text: '1/1     Running     0          2d14h', color: 'green' }), S({ text: 'ingestion-cronjob-29147520-x7k2p     ', color: 'fg' }, { text: '1/1     Running     0          3h12m', color: 'green' }), S({ text: 'ingestion-cronjob-29146080-qm9wz     ', color: 'fg' }, { text: '0/1     Completed   0          27h', color: 'muted' }), S({ text: 'scene-recon-api-7c9d4b6f8-hs2lt      ', color: 'fg' }, { text: '2/2     Running     0          9d', color: 'green' }), S({ text: 'agentd-0                             ', color: 'fg' }, { text: '1/1     Running     3          6d', color: 'green' }), S({ text: 'msckf-eval-batch-4-7fjw9             ', color: 'fg' }, { text: '0/1     Pending     0          4m', color: 'yellow' })];
      if (sub === 'get' && (kind === 'job' || kind === 'cronjob' || kind === 'cj')) return [L('NAME                SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE', 'muted'), L('ingestion-cronjob   0 2 * * *     False     1        3h12m           41d')];
      if (sub === 'get') return [L(`NAME`, 'muted'), L(`No resources found for '${a[1] || ''}' in namespace default.`, 'muted')];
      if (sub === 'top') return [L('NAME                                 CPU(cores)   MEMORY(bytes)   GPU', 'muted'), L('geospatial-train-worker-0            31200m       412Gi           8/8'), L('geospatial-train-worker-1            30980m       409Gi           8/8'), L('ingestion-cronjob-29147520-x7k2p     14500m       88Gi            -'), L('agentd-0                             2100m        12Gi            1/8')];
      if (sub === 'logs') return [L(`[${new Date().toISOString()}] step=184320 loss=0.2137 lr=2.4e-5 tokens/s=1.92M`, 'muted'), L(`[${new Date().toISOString()}] step=184340 loss=0.2129 lr=2.4e-5 tokens/s=1.91M`, 'muted'), L(`[${new Date().toISOString()}] checkpoint saved: gs://halfpixel-ckpt/geospatial/step-184340`, 'green')];
      if (sub === 'describe') return [L(`Name:         ${a[2] || 'geospatial-train-worker-0'}`), L('Namespace:    default'), L('Node:         gpu-fleet-h100-0'), L('Status:       Running'), L('Containers:   trainer (nvcr.io/halfpixel/geospatial:sha-a3f9c21)'), L('Limits:       nvidia.com/gpu: 8, memory: 480Gi')];
      if (sub === 'delete' || sub === 'apply' || sub === 'scale') throw `error: You must be logged in to the server (Unauthorized) — read-only kubeconfig on this box`;
      throw `error: unknown command "${sub}" for "kubectl"`;
    },
    cargo(a) { const sub = a[0] || 'build'; if (!['build', 'run', 'test', 'check'].includes(sub)) throw `error: no such command: \`${sub}\``; const out = [S({ text: '   Compiling ', color: 'green', bold: true }, { text: 'nalgebra v0.33.2', color: 'fg' }), S({ text: '   Compiling ', color: 'green', bold: true }, { text: 'spatial v0.3.1 (/home/sameh/projects/spatial)', color: 'fg' }), S({ text: '    Finished ', color: 'green', bold: true }, { text: '`release` profile [optimized] target(s) in 4.20s', color: 'fg' })]; if (sub === 'run') out.push(S({ text: '     Running ', color: 'green', bold: true }, { text: 'target/release/spatial', color: 'fg' }), L('INFO pose frame=0 x=0.000 y=0.000 z=0.000 inliers=0', 'muted'), L('WARN cam0: no frames — /dev/video0 busy (another tracker holds it)', 'yellow')); if (sub === 'test') out.push(L('running 1 test'), L('test pose::tests::exp_of_zero_is_identity ... ok', 'green'), L(''), L('test result: ok. 1 passed; 0 failed', 'green')); return out; },
    git(a) { const sub = a[0]; if (sub === 'status') return [L('On branch main'), L("Your branch is up to date with 'origin/main'."), L(''), L('nothing to commit, working tree clean')]; if (sub === 'log') return [S({ text: 'a3f9c21 ', color: 'yellow' }, { text: '(HEAD -> main) ', color: 'cyan' }, { text: 'megakernel: fuse bias+relu into accumulate', color: 'fg' }), S({ text: '7be0d4e ', color: 'yellow' }, { text: 'spatial: SE3 exp/log + tests', color: 'fg' }), S({ text: '1c2e9aa ', color: 'yellow' }, { text: 'resume: move to halfpixel', color: 'fg' }), S({ text: 'e0d1f33 ', color: 'yellow' }, { text: 'initial commit', color: 'fg' })]; if (!sub) throw "usage: git <command> [<args>]  (try 'git status' or 'git log')"; return [L(`fatal: '${sub}' needs a remote and there is no SSH key on this box. Try status or log.`, 'red')]; },
    python(a) { return [L(`Python 3.12.4 (main) [GCC 14.2.0] on linux`), L(a.length ? `python: can't open file '${a[0]}': [Errno 2] No such file or directory` : 'Type "help", "copyright", "credits" or "license" for more information.', 'muted'), L('>>> (interactive mode disabled on this host — try cargo run)', 'dim')]; },
    less(a) { return cmds.cat(a); }, more(a) { return cmds.cat(a); },
    open(a) { if (a[0] && /^https?:/.test(a[0])) { window.open(a[0], '_blank', 'noopener'); return []; } throw 'open: expected a URL'; },
    true() { return []; }, false() { throw ''; }, yes() { return Array.from({ length: 12 }, () => L('y')); },
    sl() { return [L('      ====        ________                ___________ '), L('  _D _|  |_______/        \\__I_I_____===__|_________| '), L("   |(_)---  |   H\\________/ |   |        =|___ ___|   "), L('   /     |  |   H  |  |     |   |         ||_| |_||   '), L('  |      |  |   H  |__--------------------| [___] |   '), L('  | ________|___H__/__|_____/[][]~\\_______|       |   '), L('  |/ |   |-----------I_____I [][] []  D   |=======|__ '), L('(you typed sl instead of ls)', 'muted')]; },
  };
  cmds.python3 = cmds.python; cmds.vim = cmds.nvim; cmds.vi = cmds.nvim; cmds.top = cmds.htop; cmds.printenv = cmds.env; cmds.ll = (a) => cmds.ls(['-la', ...a]);

  function runOne(seg, stdin) {
    const toks = tokenize(seg.trim()); if (!toks.length) return [];
    let redirect = null, append = false;
    const gi = toks.findIndex(t => t === '>' || t === '>>');
    if (gi >= 0) { redirect = toks[gi + 1]; append = toks[gi] === '>>'; toks.splice(gi); if (!redirect) throw 'zsh: parse error near `\\n\''; }
    const [cmd, ...args] = toks;
    const fn = cmds[cmd];
    if (!fn) throw `zsh: command not found: ${cmd}`;
    const out = fn(args, stdin);
    if (redirect) { fs.write(redirect, out.map(o => o.segs.map(s => s.text).join('')).join('\n') + (out.length ? '\n' : ''), append); return []; }
    return out;
  }

  return {
    env, history,
    prompt() { return `[${USER}@${HOST}:${fs.pretty(fs.cwd)}]$ `; },
    run(line) {
      const trimmed = line.trim();
      if (trimmed) history.push(trimmed);
      if (!trimmed) return [];
      const stages = trimmed.split('|');
      let stdin = null, out = [];
      try {
        for (let i = 0; i < stages.length; i++) {
          out = runOne(stages[i], stdin);
          stdin = out.map(o => o.segs.map(s => s.text).join('')).join('\n');
        }
        return out;
      } catch (e) { return e ? [L(String(e), 'red')] : []; }
    },
    complete(line) {
      const toks = line.split(' '); const last = toks[toks.length - 1];
      if (toks.length === 1) { const m = Object.keys(cmds).filter(c => c.startsWith(last)); return m.length === 1 ? m[0] + ' ' : m.length ? { options: m } : null; }
      const i = last.lastIndexOf('/'); const dir = i >= 0 ? last.slice(0, i + 1) : '', part = last.slice(i + 1);
      let ents; try { ents = fs.list(dir || '.'); } catch (e) { return null; }
      const m = ents.filter(([n]) => n.startsWith(part) && (part.startsWith('.') || !n.startsWith('.')));
      if (m.length === 1) { const [n, node] = m[0]; return toks.slice(0, -1).concat(dir + n + (node.t === 'd' ? '/' : ' ')).join(' '); }
      if (m.length > 1) { let pre = m[0][0]; for (const [n] of m) while (!n.startsWith(pre)) pre = pre.slice(0, -1); return pre.length > part.length ? toks.slice(0, -1).concat(dir + pre).join(' ') : { options: m.map(([n, node]) => n + (node.t === 'd' ? '/' : '')) }; }
      return null;
    },
  };
}
