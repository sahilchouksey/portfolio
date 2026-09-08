// htop pane data: the "processes" are things Sameh is working on right now. Edit freely.
export const PROCS = [
  { pid: '1024', name: 'halfpixel', desc: '— real-world spatial intelligence', memMB: 2150, base: 90, detail: 'Co-Founder & CTO at Halfpixel: a spatial intelligence platform for the real world.' },
  { pid: '1337', name: 'geospatial-model', desc: '— foundation model for the real world', memMB: 1640, base: 70, detail: 'A geospatial foundation model: geometry, motion and semantics of the physical world from cameras, sensors and maps.' },
  { pid: '2048', name: 'scene-recon', desc: '— multimodal data registration', memMB: 980, base: 18, detail: 'Registering video, lidar, GPS/IMU and imagery into one consistent 3D scene, in real time.' },
  { pid: '2719', name: 'ingestion-cronjob', desc: '— large-scale data processing', memMB: 3072, base: 55, detail: 'Nightly pipelines ingesting, filtering and indexing petabyte-scale real-world capture for training.' },
  { pid: '2929', name: 'kube-controller', desc: '— managing multi-node training jobs', memMB: 768, base: 14, detail: 'Kubernetes operators scheduling and babysitting multi-node distributed training across the GPU fleet.' },
  { pid: '3030', name: 'agentd', desc: '— self-evolving agent loop', memMB: 1200, base: 60, detail: 'An agent loop that proposes, runs and grades its own experiments, then rewrites its playbook from what worked.' },
  { pid: '3141', name: 'hiring', desc: '— growing the research team', memMB: 412, base: 6, detail: 'Looking for research scientists and engineers in vision, graphics and ML.' },
  { pid: '4096', name: 'arxiv-reader', desc: '— keeping up', memMB: 256, base: 3, detail: 'Daily reading: 3D generative models, video diffusion, neural rendering.' },
];

const SPARK = '▁▂▃▄▅▆▇█';
export const fmtMem = (mb) => mb >= 1000 ? (mb / 1024).toFixed(1) + 'G' : mb + 'M';
export const sparkline = (arr, n) => arr.slice(-n).map(v => SPARK[Math.min(7, Math.floor(v * 8))]).join('');
/** Split total cpu load (0..1) across processes proportionally to their weight, with jitter; the column sums to the meter. */
export const shareCpu = (procs, load) => {
  const w = procs.map(p => Math.max(0.05, p.base * (0.6 + Math.random() * 0.8)));
  const sum = w.reduce((a, b) => a + b, 0);
  return procs.map((p, i) => ({ ...p, cpu: (w[i] / sum) * load * 100 }));
};
export const initialProcs = (load = 0.5) => shareCpu(PROCS, load);
/** Random-walk a meter history, clamped to [lo, hi]. */
export const stepHistory = (hist, delta, lo, hi) => hist.slice(1).concat([Math.min(hi, Math.max(lo, hist[hist.length - 1] + (Math.random() - 0.5) * delta))]);
export const seedHistory = (n, lo, span) => Array.from({ length: n }, () => lo + span * Math.random());
export const sortProcs = (procs, key) => procs.map((p, i) => ({ ...p, i })).sort((a, b) => key === 'cpu' ? b.cpu - a.cpu : key === 'mem' ? b.memMB - a.memMB : +a.pid - +b.pid);
