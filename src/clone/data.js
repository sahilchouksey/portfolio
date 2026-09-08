export const THEMES = [
  {key:'catppuccin',name:'Catppuccin',bg:'#1e1e2e',bg2:'#181825',surf:'#313244',fg:'#cdd6f4',muted:'#a6adc8',dim:'#6c7086',red:'#f38ba8',green:'#a6e3a1',yellow:'#f9e2af',blue:'#89b4fa',magenta:'#cba6f7',cyan:'#94e2d5',orange:'#fab387'},
  {key:'dracula',name:'Dracula',bg:'#282a36',bg2:'#21222c',surf:'#44475a',fg:'#f8f8f2',muted:'#b7bfe0',dim:'#6272a4',red:'#ff5555',green:'#50fa7b',yellow:'#f1fa8c',blue:'#8be9fd',magenta:'#bd93f9',cyan:'#8be9fd',orange:'#ffb86c'},
  {key:'gruvbox',name:'Gruvbox',bg:'#282828',bg2:'#1d2021',surf:'#3c3836',fg:'#ebdbb2',muted:'#bdae93',dim:'#7c6f64',red:'#fb4934',green:'#b8bb26',yellow:'#fabd2f',blue:'#83a598',magenta:'#d3869b',cyan:'#8ec07c',orange:'#fe8019'},
  {key:'nord',name:'Nord',bg:'#2e3440',bg2:'#272c36',surf:'#3b4252',fg:'#e5e9f0',muted:'#a8b4c8',dim:'#616e88',red:'#bf616a',green:'#a3be8c',yellow:'#ebcb8b',blue:'#81a1c1',magenta:'#b48ead',cyan:'#88c0d0',orange:'#d08770'},
  {key:'solarized',name:'Solarized',bg:'#002b36',bg2:'#00212b',surf:'#073642',fg:'#93a1a1',muted:'#839496',dim:'#586e75',red:'#dc322f',green:'#859900',yellow:'#b58900',blue:'#268bd2',magenta:'#d33682',cyan:'#2aa198',orange:'#cb4b16'},
  {key:'tokyo',name:'Tokyo',bg:'#1a1b26',bg2:'#16161e',surf:'#292e42',fg:'#c0caf5',muted:'#9aa5ce',dim:'#565f89',red:'#f7768e',green:'#9ece6a',yellow:'#e0af68',blue:'#7aa2f7',magenta:'#bb9af7',cyan:'#7dcfff',orange:'#ff9e64'},
  {key:'onedark',name:'One Dark',bg:'#282c34',bg2:'#21252b',surf:'#3e4451',fg:'#abb2bf',muted:'#8f97a3',dim:'#5c6370',red:'#e06c75',green:'#98c379',yellow:'#e5c07b',blue:'#61afef',magenta:'#c678dd',cyan:'#56b6c2',orange:'#d19a66'},
  {key:'monokai',name:'Monokai',bg:'#272822',bg2:'#1e1f1c',surf:'#3e3d32',fg:'#f8f8f2',muted:'#c2c2b0',dim:'#75715e',red:'#f92672',green:'#a6e22e',yellow:'#e6db74',blue:'#66d9ef',magenta:'#ae81ff',cyan:'#a1efe4',orange:'#fd971f'},
];

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

export const EXPERIENCE_MD = `# Experience

## Halfpixel  ·  Co-Founder & CTO
> present · Bay Area, CA · [halfpixel.ai](https://halfpixel.ai)
- Building a **real-world spatial intelligence** platform: reconstructing, understanding and predicting the physical world from pixels and every sensor that sees it.

## Rembrand  ·  Co-Founder, Director of R&D
> 2023 – 2026 · Bay Area, CA · grew to 30+ people, **$32M** raised
- Led a 13-person team of vision & graphics engineers and VFX artists shipping **generative AI for video**: photoreal product placement in existing footage.
- Deployed SoTA systems for **single-image volumetric lighting estimation**, multi-shot **camera pose tracking**, and video object segmentation.
- Wrote a WebGL **real-time progressive ray tracer** for physically-based object insertion — inter-reflections and shadows included.
- Post-trained reference-guided **video diffusion transformers** on ~100 TB of raw video, filtered and processed through our own data pipelines.

## NVIDIA  ·  Principal Research Scientist
> 2020 – 2023 · Santa Clara, CA
- **Digital twins & digital humans**: research for photoreal avatars and 3D content creation in Omniverse.
- 3D-aware GANs (EG3D), one-shot **Live 3D Portraits**, relightable articulated avatars (RANA), virtual light stages.
- 3D style transfer (3DStyleNet), hybrid differentiable rendering (DIB-R++), neural kernel fields.
- **I am AI** — SIGGRAPH 2021 Real-Time Live, Best-in-Show.

## Google AR/VR  ·  Senior Research Scientist
> 2017 – 2020 · San Francisco, CA
- Tech lead for machine learning in **ARCore** — enabling AR on smartphones. [Video](https://www.youtube.com/watch?v=cLQJ864LNWI)
- Built the infrastructure for cross-dataset training, model distillation and compression.
- Efficient **depth estimation** from passive & active stereo, from motion, and from a single image; human pose estimation, neural rendering, image matting.

## perceptiveIO  ·  Senior Scientist, Founding Team
> 2016 – 2017 · San Francisco, CA · acquired by Google
- Built a state-of-the-art **360° performance capture** system for real-time reconstruction of arbitrary non-rigid scenes.

## Microsoft Research  ·  Researcher, Interactive 3D Technologies
> 2015 – 2016 · Redmond, WA
- **Holoportation** — live on stage at TED 2016; covered by Wired, Engadget, ZDNet, Gizmodo, VentureBeat and Mashable. [Video](https://www.youtube.com/watch?v=7d59O6cfaM0)
- Hand tracking and hand-shape modeling from depth cameras.`;

export const PUBLICATIONS_MD = `# Publications
> Full list on [Google Scholar](https://scholar.google.com/citations?user=9WgcwYQAAAAJ) and [DBLP](https://dblp.uni-trier.de/pers/k/Khamis:Sameh.html)

## 2026
- **iLRM**: An Iterative Large 3D Reconstruction Model. \`CVPR 2026\` [arXiv](https://arxiv.org/abs/2507.23277) · [Project](https://gynjn.github.io/iLRM/) · [Code](https://github.com/Gynjn/iLRM)
> Gyeongjin Kang, Seungtae Nam, Seungkwon Yang, Xiangyu Sun, **Sameh Khamis**, Abdelrahman Mohamed, Eunbyung Park

## 2023
- **Live 3D Portrait**: Real-Time Radiance Fields for Single-Image Portrait View Synthesis. \`SIGGRAPH 2023\` [arXiv](https://arxiv.org/abs/2305.02310) · [Project](https://research.nvidia.com/labs/nxp/lp3d/)
> Alex Trevithick, Matthew Chan, Michael Stengel, Eric R. Chan, Chao Liu, Zhiding Yu, **Sameh Khamis**, Manmohan Chandraker, Ravi Ramamoorthi, Koki Nagano
- **RANA**: Relightable Articulated Neural Avatars. \`ICCV 2023\` [arXiv](https://arxiv.org/abs/2212.03237) · [Project](https://nvlabs.github.io/RANA/)
> Umar Iqbal, Akin Caliskan, Koki Nagano, **Sameh Khamis**, Pavlo Molchanov, Jan Kautz
- **Single-Shot Implicit Morphable Faces** with Consistent Texture Parameterization. \`SIGGRAPH 2023\` [arXiv](https://arxiv.org/abs/2305.03043) · [Project](https://research.nvidia.com/labs/toronto-ai/ssif/)
> Connor Z. Lin, Koki Nagano, Jan Kautz, Eric R. Chan, Umar Iqbal, Leonidas Guibas, Gordon Wetzstein, **Sameh Khamis**
- Learning Human Dynamics in Autonomous Driving Scenarios. \`ICCV 2023\` [PDF](https://openaccess.thecvf.com/content/ICCV2023/papers/Wang_Learning_Human_Dynamics_in_Autonomous_Driving_Scenarios_ICCV_2023_paper.pdf)
> Jingbo Wang, Ye Yuan, Zhengyi Luo, Kevin Xie, Dahua Lin, Umar Iqbal, Sanja Fidler, **Sameh Khamis**

## 2022
- **EG3D**: Efficient Geometry-aware 3D Generative Adversarial Networks. \`CVPR 2022\` *Oral* [arXiv](https://arxiv.org/abs/2112.07945) · [Project](https://nvlabs.github.io/eg3d/) · [Code](https://github.com/NVlabs/eg3d)
> Eric R. Chan, Connor Z. Lin, Matthew A. Chan, Koki Nagano, Boxiao Pan, Shalini De Mello, Orazio Gallo, Leonidas Guibas, Jonathan Tremblay, **Sameh Khamis**, Tero Karras, Gordon Wetzstein
- Learning to Relight Portrait Images via a Virtual Light Stage and Synthetic-to-Real Adaptation. \`SIGGRAPH Asia 2022\` [arXiv](https://arxiv.org/abs/2209.10510) · [Project](https://research.nvidia.com/labs/dir/lumos/)
> Yu-Ying Yeh, Koki Nagano, **Sameh Khamis**, Jan Kautz, Ming-Yu Liu, Ting-Chun Wang
- Neural Fields as Learnable Kernels for 3D Reconstruction. \`CVPR 2022\` [arXiv](https://arxiv.org/abs/2111.13674) · [Project](https://nv-tlabs.github.io/nkf/)
> Francis Williams, Zan Gojcic, **Sameh Khamis**, Denis Zorin, Joan Bruna, Sanja Fidler, Or Litany
- Frame Averaging for Equivariant Shape Space Learning. \`CVPR 2022\` [arXiv](https://arxiv.org/abs/2112.01741) · [Project](https://nv-tlabs.github.io/equivariant/)
> Matan Atzmon, Koki Nagano, Sanja Fidler, **Sameh Khamis**, Yaron Lipman

## 2021
- **DIB-R++**: Learning to Predict Lighting and Material with a Hybrid Differentiable Renderer. \`NeurIPS 2021\` [arXiv](https://arxiv.org/abs/2111.00140) · [Project](https://nv-tlabs.github.io/DIBRPlus/)
> Wenzheng Chen, Joey Litalien, Jun Gao, Zian Wang, Clement Fuji Tsang, **Sameh Khamis**, Or Litany, Sanja Fidler
- **3DStyleNet**: Creating 3D Shapes with Geometric and Texture Style Variations. \`ICCV 2021\` *Oral* [arXiv](https://arxiv.org/abs/2108.12958) · [Project](https://nv-tlabs.github.io/3DStyleNet/)
> Kangxue Yin, Jun Gao, Maria Shugrina, **Sameh Khamis**, Sanja Fidler
- **I am AI**: AI-driven Digital Avatar Made Easy. \`SIGGRAPH 2021 Real-Time Live\` *Best-in-Show* [Link](https://blog.siggraph.org/2021/10/i-am-ai-seeks-to-make-video-conferencing-better.html/) · [Video](https://www.youtube.com/watch?v=__Za-BP20eM)
> Ming-Yu Liu, Koki Nagano, Yeongho Seol, Rafael Valle, Jaewoo Seo, Ting-Chun Wang, Arun Mallya, **Sameh Khamis**, Wei Ping, Rohan Badlani, Kevin J. Shih, Bryan Catanzaro, Simon Yuen, Jan Kautz
- **RTMV**: A Ray-Traced Multi-View Synthetic Dataset for Novel View Synthesis. \`ECCV 2022 Workshops\` [arXiv](https://arxiv.org/abs/2205.07058) · [Project](https://www.cs.umd.edu/~mmeshry/projects/rtmv/)
> Jonathan Tremblay, Moustafa Meshry, Alex Evans, Jan Kautz, Alexander Keller, **Sameh Khamis**, Thomas Müller, Charles Loop, Nathan Morrical, Koki Nagano, Towaki Takikawa, Stan Birchfield
- Hierarchical Neural Implicit Pose Network for Animation and Motion Retargeting. \`arXiv 2021\` [arXiv](https://arxiv.org/abs/2112.00958) · [Project](https://nv-tlabs.github.io/hipnet/)
> Sourav Biswas, Kangxue Yin, Maria Shugrina, Sanja Fidler, **Sameh Khamis**

## 2020
- **RePose**: Learning Deep Kinematic Priors for Fast Human Pose Estimation. \`arXiv 2020\` [arXiv](https://arxiv.org/abs/2002.03933)
> Hossam Isack, Christian Haene, Cem Keskin, Sofien Bouaziz, Yuri Boykov, Shahram Izadi, **Sameh Khamis**

## 2019
- **Neural Rerendering in the Wild**. \`CVPR 2019\` *Oral · Best Paper Finalist* [arXiv](https://arxiv.org/abs/1904.04290) · [Video](https://www.youtube.com/watch?v=E1crWQn_kmY) · [Code](https://github.com/google/neural_rerendering_in_the_wild) · [Project](https://moustafameshry.github.io/neural_rerendering_in_the_wild/)
> Moustafa Meshry, Dan B. Goldman, **Sameh Khamis**, Hugues Hoppe, Rohit Pandey, Noah Snavely, Ricardo Martin-Brualla

## 2018
- Depth from Motion for Smartphone AR. \`SIGGRAPH Asia 2018\`
> Julien Valentin et al.
- **LookinGood**: Enhancing Performance Capture with Real-time Neural Re-Rendering. \`SIGGRAPH Asia 2018\`
> Ricardo Martin-Brualla et al.
- **ActiveStereoNet**: End-to-End Self-Supervised Learning for Active Stereo Systems. \`ECCV 2018\` *Oral*
> Yinda Zhang, **Sameh Khamis** et al.
- **StereoNet**: Guided Hierarchical Refinement for Real-Time Edge-Aware Depth Prediction. \`ECCV 2018\`
> **Sameh Khamis** et al.

## 2017
- **Motion2Fusion**: Real-time Volumetric Performance Capture. \`SIGGRAPH Asia 2017\`
> Mingsong Dou, Philip Davidson, Sean Fanello, **Sameh Khamis** et al.

## 2016
- **Holoportation**: Virtual 3D Teleportation in Real-time. \`UIST 2016\` [Video](https://www.youtube.com/watch?v=7d59O6cfaM0)
> Sergio Orts-Escolano et al.
- **Fusion4D**: Real-time Performance Capture of Challenging Scenes. \`SIGGRAPH 2016\`
> Mingsong Dou, **Sameh Khamis** et al.
`;

export const EDUCATION_MD = `# Education

## PhD, Computer Science  ·  University of Maryland
> 2010 – 2015 · College Park, MD
- Advised by [Larry Davis](http://www.umiacs.umd.edu/~lsd/) at UMIACS.
- Thesis: **multi-person activity recognition** from video sequences.
- Internships: Siemens Corporate Research, IST Austria (Lampert group), Microsoft Research Cambridge, SRI International.

## MSc, Computer Science  ·  University of Western Ontario
> 2008 – 2010 · London, Ontario
- Advised by [Yuri Boykov](https://cs.uwaterloo.ca/~yboykov/).
- Thesis: **semantic image segmentation**.
- Wrote a parallel out-of-core [push-relabel algorithm](https://github.com/samehkhamis/RegionPushRelabel) for massive regular graphs.`;

export const LINKS_SH = `#!/usr/bin/env bash
# where else to find me — click a URL to open it

open "https://halfpixel.ai"                                       # Halfpixel
open "https://github.com/samehkhamis"                             # GitHub
open "https://twitter.com/sameh_khamis"                           # X / Twitter
open "https://linkedin.com/in/samehkhamis"                        # LinkedIn
open "https://scholar.google.com/citations?user=9WgcwYQAAAAJ"     # Google Scholar
open "https://dblp.uni-trier.de/pers/k/Khamis:Sameh.html"         # DBLP
open "https://www.semanticscholar.org/author/S.-Khamis/2121982"   # Semantic Scholar

exit 0`;
