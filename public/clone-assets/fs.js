// Virtual filesystem for the terminal resume. Dirs: {t:'d', c:{name:node}}  Files: {t:'f', s:'text', x?:1 (executable)}
export const USER = 'sameh', HOST = 'halfpixel', HOME = '/home/sameh';

const EXPERIENCE = `# Experience

## :halfpixel: Halfpixel  ·  Co-Founder & CTO
> present · Bay Area, CA · [halfpixel.ai](https://halfpixel.ai)
- Building a **real-world spatial intelligence** platform: reconstructing, understanding and predicting the physical world from pixels and every sensor that sees it.

## :rembrand: Rembrand  ·  Co-Founder, Director of R&D
> 2023 – 2026 · Bay Area, CA · grew to 30+ people, **$32M** raised
- Led a 13-person team of vision & graphics engineers and VFX artists shipping **generative AI for video**: photoreal product placement in existing footage.
- Deployed SoTA systems for **single-image volumetric lighting estimation**, multi-shot **camera pose tracking**, and video object segmentation.
- Wrote a WebGL **real-time progressive ray tracer** for physically-based object insertion — inter-reflections and shadows included.
- Post-trained reference-guided **video diffusion transformers** on ~100 TB of raw video, filtered and processed through our own data pipelines.

## :nvidia: NVIDIA  ·  Principal Research Scientist
> 2020 – 2023 · Santa Clara, CA
- **Digital twins & digital humans**: research for photoreal avatars and 3D content creation in Omniverse.
- 3D-aware GANs (EG3D), one-shot **Live 3D Portraits**, relightable articulated avatars (RANA), virtual light stages.
- 3D style transfer (3DStyleNet), hybrid differentiable rendering (DIB-R++), neural kernel fields.
- **I am AI** — SIGGRAPH 2021 Real-Time Live, Best-in-Show.

## :google: Google AR/VR  ·  Senior Research Scientist
> 2017 – 2020 · San Francisco, CA
- Tech lead for machine learning in **ARCore** — enabling AR on smartphones. [Video](https://www.youtube.com/watch?v=cLQJ864LNWI)
- Built the infrastructure for cross-dataset training, model distillation and compression.
- Efficient **depth estimation** from passive & active stereo, from motion, and from a single image; human pose estimation, neural rendering, image matting.

## :perceptiveio: perceptiveIO  ·  Senior Scientist, Founding Team
> 2016 – 2017 · San Francisco, CA · acquired by Google
- Built a state-of-the-art **360° performance capture** system for real-time reconstruction of arbitrary non-rigid scenes.

## :microsoft: Microsoft Research  ·  Researcher, Interactive 3D Technologies
> 2015 – 2016 · Redmond, WA
- **Holoportation** — live on stage at TED 2016; covered by Wired, Engadget, ZDNet, Gizmodo, VentureBeat and Mashable. [Video](https://www.youtube.com/watch?v=7d59O6cfaM0)
- Hand tracking and hand-shape modeling from depth cameras.`;

const PUBLICATIONS = `# Publications
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
- Depth from Motion for Smartphone AR. \`SIGGRAPH Asia 2018\` [PDF](https://samehkhamis.com/publications/valentin-siggraph-asia2018.pdf)
> Julien Valentin, Adarsh Kowdle, Jonathan T. Barron, Neal Wadhwa, Max Dzitsiuk, Michael Schoenberg, Vivek Verma, Ambrus Csaszar, Eric Turner, Ivan Dryanovski, Joao Afonso, Jose Pascoal, Konstantine Tsotsos, Mira Leung, Mirko Schmidt, Onur Guleryuz, **Sameh Khamis**, Vladimir Tankovich, Sean Fanello, Shahram Izadi, Christoph Rhemann
- The Need 4 Speed in Real-Time Dense Visual Tracking. \`SIGGRAPH Asia 2018\` [PDF](https://samehkhamis.com/publications/kowdle-siggraph-asia2018.pdf)
> Adarsh Kowdle, Christoph Rhemann, Sean Fanello, Andrea Tagliasacchi, Jonathan Taylor, Philip Davidson, Mingsong Dou, Kaiwen Guo, Cem Keskin, **Sameh Khamis**, David Kim, Danhang Tang, Vladimir Tankovich, Julien Valentin, Shahram Izadi
- **LookinGood**: Enhancing Performance Capture with Real-time Neural Re-Rendering. \`SIGGRAPH Asia 2018\` [arXiv](https://arxiv.org/abs/1811.05029) · [Video](https://www.youtube.com/watch?v=Md3tdAKoLGU)
> Ricardo Martin-Brualla, Rohit Pandey, Shuoran Yang, Pavel Pidlypenskyi, Jonathan Taylor, Julien Valentin, **Sameh Khamis**, Philip Davidson, Anastasia Tkach, Peter Lincoln, Adarsh Kowdle, Christoph Rhemann, Dan B. Goldman, Cem Keskin, Steve Seitz, Shahram Izadi, Sean Fanello
- **ActiveStereoNet**: End-to-End Self-Supervised Learning for Active Stereo Systems. \`ECCV 2018\` *Oral* [arXiv](https://arxiv.org/abs/1807.06009)
> Yinda Zhang, **Sameh Khamis**, Christoph Rhemann, Julien Valentin, Adarsh Kowdle, Vladimir Tankovich, Michael Schoenberg, Shahram Izadi, Thomas Funkhouser, Sean Fanello
- **StereoNet**: Guided Hierarchical Refinement for Real-Time Edge-Aware Depth Prediction. \`ECCV 2018\` [arXiv](https://arxiv.org/abs/1807.08865)
> **Sameh Khamis**, Sean Fanello, Christoph Rhemann, Adarsh Kowdle, Julien Valentin, Shahram Izadi

## 2017
- **Motion2Fusion**: Real-time Volumetric Performance Capture. \`SIGGRAPH Asia 2017\` [PDF](https://samehkhamis.com/publications/dou-siggraph2017.pdf)
> Mingsong Dou, Philip Davidson, Sean Fanello, **Sameh Khamis**, Adarsh Kowdle, Christoph Rhemann, Vladimir Tankovich, Shahram Izadi

## 2016
- **Holoportation**: Virtual 3D Teleportation in Real-time. \`UIST 2016\` [PDF](https://samehkhamis.com/publications/orts-escolano-uist16.pdf) · [Video](https://www.youtube.com/watch?v=7d59O6cfaM0)
> Sergio Orts-Escolano, Christoph Rhemann, Sean Fanello, Wayne Chang, Adarsh Kowdle, Yury Degtyarev, David Kim, Philip Davidson, **Sameh Khamis**, Mingsong Dou, Vladimir Tankovich, Charles Loop, Qin Cai, Philip Chou, Sarah Mennicken, Julien Valentin, Vivek Pradeep, Shenlong Wang, Sing Bing Kang, Pushmeet Kohli, Yuliya Lutchyn, Cem Keskin, Shahram Izadi
- **Fusion4D**: Real-time Performance Capture of Challenging Scenes. \`SIGGRAPH 2016\` [PDF](https://samehkhamis.com/publications/dou-siggraph2016.pdf) · [Video](https://www.youtube.com/watch?v=2dkcJ1YhYw4)
> Mingsong Dou, **Sameh Khamis**, Yury Degtyarev, Philip Davidson, Sean Fanello, Adarsh Kowdle, Sergio Orts-Escolano, Christoph Rhemann, David Kim, Jonathan Taylor, Pushmeet Kohli, Vladimir Tankovich, Shahram Izadi
- Efficient and Precise Interactive Hand Tracking through Joint, Continuous Optimization of Pose and Correspondences. \`SIGGRAPH 2016\` [PDF](https://samehkhamis.com/publications/taylor-siggraph2016.pdf) · [Video](https://www.youtube.com/watch?v=QTz1zQAnMcU)
> Jonathan Taylor, Lucas Bordeaux, Thomas Cashman, Bob Corish, Cem Keskin, Toby Sharp, Eduardo Soto, David Sweeney, Julien Valentin, Benjamin Luff, Arran Topalian, Erroll Wood, **Sameh Khamis**, Pushmeet Kohli, Shahram Izadi, Richard Banks, Andrew Fitzgibbon, Jamie Shotton
- Fits Like a Glove: Rapid and Reliable Hand Shape Personalization. \`CVPR 2016\` *Spotlight* [PDF](https://samehkhamis.com/publications/tan-cvpr2016.pdf)
> David Joseph Tan, Thomas Cashman, Jonathan Taylor, Andrew Fitzgibbon, Daniel Tarlow, **Sameh Khamis**, Shahram Izadi, Jamie Shotton

## 2015
- Learning an Efficient Model of Hand Shape Variation from Depth Images. \`CVPR 2015\` [PDF](https://samehkhamis.com/publications/khamis-cvpr2015.pdf) · [Supp](https://samehkhamis.com/publications/khamis-cvpr2015supp.pdf) · [Video](http://research.microsoft.com/pubs/244775/Video.mp4)
> **Sameh Khamis**, Jonathan Taylor, Jamie Shotton, Cem Keskin, Shahram Izadi, Andrew Fitzgibbon
- Walking and Talking: A Bilinear Approach to Multi-Label Action Recognition. \`CVPRW 2015\` [PDF](https://samehkhamis.com/publications/khamis-cvprw2015.pdf)
> **Sameh Khamis**, Larry S. Davis

## 2014
- **CoConut**: Co-Classification with Output Space Regularization. \`BMVC 2014\` [PDF](https://samehkhamis.com/publications/khamis-bmvc2014.pdf) · [Poster](https://samehkhamis.com/publications/khamis-bmvc2014poster.pdf)
> **Sameh Khamis**, Christoph H. Lampert
- Joint Learning for Attribute-Consistent Person Re-Identification. \`ECCVW 2014\` [PDF](https://samehkhamis.com/publications/khamis-eccvw2014.pdf)
> **Sameh Khamis**, Cheng-Hao Kuo, Vivek K. Singh, Vinay Shet, Larry S. Davis

## 2012 – 2013
- Collective Activity Detection using Hinge-loss Markov Random Fields. \`CVPRW 2013\` [PDF](https://samehkhamis.com/publications/london-cvprw2013.pdf) · [Slides](https://samehkhamis.com/publications/london-cvprw2013slides.pdf)
> Ben London, **Sameh Khamis**, Stephen H. Bach, Bert Huang, Lise Getoor, Larry S. Davis
- Person Re-identification using Semantic Color Names and RankBoost. \`WACV 2013\` [PDF](https://samehkhamis.com/publications/kuo-wacv2013.pdf)
> Cheng-Hao Kuo, **Sameh Khamis**, Vinay Shet
- Combining Per-Frame and Per-Track Cues for Multi-Person Action Recognition. \`ECCV 2012\` [PDF](https://samehkhamis.com/publications/khamis-eccv2012.pdf) · [Poster](https://samehkhamis.com/publications/khamis-eccv2012poster.pdf)
> **Sameh Khamis**, Vlad I. Morariu, Larry S. Davis
- A Flow Model for Joint Action Recognition and Identity Maintenance. \`CVPR 2012\` [PDF](https://samehkhamis.com/publications/khamis-cvpr2012.pdf) · [Poster](https://samehkhamis.com/publications/khamis-cvpr2012poster.pdf) · [Spotlight](https://www.youtube.com/watch?v=PMy6_HrQzAI)
> **Sameh Khamis**, Vlad I. Morariu, Larry S. Davis`;

const EDUCATION = `# Education

## :umd: PhD, Computer Science  ·  University of Maryland
> 2010 – 2015 · College Park, MD
- Advised by [Larry Davis](http://www.umiacs.umd.edu/~lsd/) at UMIACS.
- Thesis: **multi-person activity recognition** from video sequences.
- Internships: Siemens Corporate Research, IST Austria (Lampert group), Microsoft Research Cambridge, SRI International.

## :uwo: MSc, Computer Science  ·  University of Western Ontario
> 2008 – 2010 · London, Ontario
- Advised by [Yuri Boykov](https://cs.uwaterloo.ca/~yboykov/).
- Thesis: **semantic image segmentation**.
- Wrote a parallel out-of-core [push-relabel algorithm](https://github.com/samehkhamis/RegionPushRelabel) for massive regular graphs.`;

const LINKS = `#!/usr/bin/env bash
# where else to find me — click a URL to open it

open "https://halfpixel.ai"                                       # :halfpixel: Halfpixel
open "https://github.com/samehkhamis"                             # :github: GitHub
open "https://twitter.com/sameh_khamis"                           # :twitter: X / Twitter
open "https://linkedin.com/in/samehkhamis"                        # :linkedin: LinkedIn
open "https://scholar.google.com/citations?user=9WgcwYQAAAAJ"     # :scholar: Google Scholar
open "https://dblp.uni-trier.de/pers/k/Khamis:Sameh.html"         # :dblp: DBLP
open "https://www.semanticscholar.org/author/S.-Khamis/2121982"   # :semanticscholar: Semantic Scholar

exit 0`;

const MLP_H = `// mlp.h — shared between the CUDA megakernel and the host launcher.
#pragma once
#include <cuda_fp16.h>
#include <cuda_runtime.h>

namespace mlp {

constexpr int kInDim    = 64;
constexpr int kHidden   = 128;
constexpr int kOutDim   = 16;
constexpr int kLayers   = 4;
constexpr int kTileB    = 64;          // batch rows per CTA
constexpr int kWarps    = 8;
constexpr int kThreads  = kWarps * 32;

struct Params {
    const __half* W[kLayers];          // row-major [out, in]
    const __half* b[kLayers];
    int dims[kLayers + 1];             // kInDim, kHidden, kHidden, kHidden, kOutDim
};

// Launch the persistent megakernel: forward(x[batch, kInDim]) -> y[batch, kOutDim].
cudaError_t forward(const __half* x, float* y, const Params& p, int batch, cudaStream_t stream = nullptr);

}  // namespace mlp
`;

const MLP_CU = `// mlp_megakernel.cu — one persistent kernel runs the whole MLP forward pass.
// Layers are fused: weights stream through shared memory, activations never
// leave the SM. One CTA per batch tile, warps cooperate on the matmul.
#include "mlp.h"

namespace mlp {
namespace {

__device__ __forceinline__ float relu(float x) { return fmaxf(x, 0.f); }

__global__ void __launch_bounds__(kThreads)
megakernel(const __half* __restrict__ x, float* __restrict__ y, Params p, int batch)
{
    __shared__ __half sW[kHidden * kHidden];           // current layer weights
    __shared__ float  sAct[2][kTileB * kHidden];       // ping-pong activations

    const int tid  = threadIdx.x;
    const int lane = tid & 31, warp = tid >> 5;
    int cur = 0;

    // persistent grid: each CTA walks the batch in strides of gridDim.x tiles
    for (int tile = blockIdx.x * kTileB; tile < batch; tile += gridDim.x * kTileB) {
        // 1. stage input tile (zero-pad the tail)
        for (int i = tid; i < kTileB * kInDim; i += kThreads) {
            const int r = i / kInDim, c = i % kInDim, gr = tile + r;
            sAct[cur][r * kHidden + c] = gr < batch ? __half2float(x[gr * kInDim + c]) : 0.f;
        }
        __syncthreads();

        // 2. fused layer loop
        #pragma unroll 1
        for (int l = 0; l < kLayers; ++l) {
            const int din = p.dims[l], dout = p.dims[l + 1];
            for (int i = tid; i < dout * din; i += kThreads) sW[i] = p.W[l][i];
            __syncthreads();

            // warp w owns output columns w, w+kWarps, ...; lanes stride over rows
            for (int o = warp; o < dout; o += kWarps) {
                const float bias = __half2float(p.b[l][o]);
                for (int r = lane; r < kTileB; r += 32) {
                    float acc = bias;
                    const float* a = &sAct[cur][r * kHidden];
                    #pragma unroll 8
                    for (int k = 0; k < din; ++k)
                        acc = fmaf(a[k], __half2float(sW[o * din + k]), acc);
                    sAct[cur ^ 1][r * kHidden + o] = (l + 1 < kLayers) ? relu(acc) : acc;
                }
            }
            __syncthreads();
            cur ^= 1;
        }

        // 3. write output tile
        for (int i = tid; i < kTileB * kOutDim; i += kThreads) {
            const int r = i / kOutDim, c = i % kOutDim, gr = tile + r;
            if (gr < batch) y[gr * kOutDim + c] = sAct[cur][r * kHidden + c];
        }
        __syncthreads();
    }
}

}  // namespace

cudaError_t forward(const __half* x, float* y, const Params& p, int batch, cudaStream_t stream)
{
    int dev = 0, sms = 0;
    if (auto err = cudaGetDevice(&dev)) return err;
    if (auto err = cudaDeviceGetAttribute(&sms, cudaDevAttrMultiProcessorCount, dev)) return err;
    const int tiles = (batch + kTileB - 1) / kTileB;
    const int grid  = std::min(tiles, sms * 2);                 // 2 CTAs / SM saturates smem
    megakernel<<<grid, kThreads, 0, stream>>>(x, y, p, batch);
    return cudaGetLastError();
}

}  // namespace mlp
`;

const MLP_MAIN_CC = `// main.cc — host side: allocate, seed weights, launch, time, verify one row on CPU.
#include "mlp.h"
#include <chrono>
#include <cmath>
#include <cstdio>
#include <random>
#include <vector>

#define CUDA_CHECK(call)                                                                 \\
    do { cudaError_t e = (call); if (e != cudaSuccess) {                                 \\
        std::fprintf(stderr, "%s:%d: %s\\n", __FILE__, __LINE__, cudaGetErrorString(e)); \\
        return 1; } } while (0)

using namespace mlp;

static std::vector<__half> random_half(size_t n, float scale, std::mt19937& rng) {
    std::normal_distribution<float> N(0.f, scale);
    std::vector<__half> v(n);
    for (auto& h : v) h = __float2half(N(rng));
    return v;
}

// Reference forward for a single row, in fp32, to sanity-check the kernel.
static void cpu_forward(const std::vector<std::vector<__half>>& W, const std::vector<std::vector<__half>>& b,
                        const int* dims, const __half* x, float* out) {
    std::vector<float> a(x, x + dims[0]), n;
    for (auto& v : a) v = __half2float(__float2half(v));
    for (int l = 0; l < kLayers; ++l) {
        n.assign(dims[l + 1], 0.f);
        for (int o = 0; o < dims[l + 1]; ++o) {
            float acc = __half2float(b[l][o]);
            for (int k = 0; k < dims[l]; ++k) acc += a[k] * __half2float(W[l][o * dims[l] + k]);
            n[o] = (l + 1 < kLayers) ? std::fmax(acc, 0.f) : acc;
        }
        a.swap(n);
    }
    std::copy(a.begin(), a.end(), out);
}

int main(int argc, char** argv) {
    const int batch = argc > 1 ? std::atoi(argv[1]) : 1 << 16;
    const int dims[kLayers + 1] = {kInDim, kHidden, kHidden, kHidden, kOutDim};
    std::mt19937 rng(42);

    // host weights (He init) + input
    std::vector<std::vector<__half>> hW(kLayers), hb(kLayers);
    for (int l = 0; l < kLayers; ++l) {
        hW[l] = random_half(size_t(dims[l + 1]) * dims[l], std::sqrt(2.f / dims[l]), rng);
        hb[l] = random_half(dims[l + 1], 0.01f, rng);
    }
    auto hx = random_half(size_t(batch) * kInDim, 1.f, rng);

    // device buffers
    Params p{};
    for (int l = 0; l <= kLayers; ++l) p.dims[l] = dims[l];
    for (int l = 0; l < kLayers; ++l) {
        __half *dW, *db;
        CUDA_CHECK(cudaMalloc(&dW, hW[l].size() * sizeof(__half)));
        CUDA_CHECK(cudaMalloc(&db, hb[l].size() * sizeof(__half)));
        CUDA_CHECK(cudaMemcpy(dW, hW[l].data(), hW[l].size() * sizeof(__half), cudaMemcpyHostToDevice));
        CUDA_CHECK(cudaMemcpy(db, hb[l].data(), hb[l].size() * sizeof(__half), cudaMemcpyHostToDevice));
        p.W[l] = dW; p.b[l] = db;
    }
    __half* dx; float* dy;
    CUDA_CHECK(cudaMalloc(&dx, hx.size() * sizeof(__half)));
    CUDA_CHECK(cudaMalloc(&dy, size_t(batch) * kOutDim * sizeof(float)));
    CUDA_CHECK(cudaMemcpy(dx, hx.data(), hx.size() * sizeof(__half), cudaMemcpyHostToDevice));

    // warm-up + timed launches
    CUDA_CHECK(forward(dx, dy, p, batch));
    CUDA_CHECK(cudaDeviceSynchronize());
    cudaEvent_t t0, t1; cudaEventCreate(&t0); cudaEventCreate(&t1);
    const int iters = 50;
    cudaEventRecord(t0);
    for (int i = 0; i < iters; ++i) CUDA_CHECK(forward(dx, dy, p, batch));
    cudaEventRecord(t1); CUDA_CHECK(cudaEventSynchronize(t1));
    float ms = 0.f; cudaEventElapsedTime(&ms, t0, t1); ms /= iters;

    // verify row 0 against the CPU reference
    std::vector<float> hy(kOutDim), ref(kOutDim);
    CUDA_CHECK(cudaMemcpy(hy.data(), dy, kOutDim * sizeof(float), cudaMemcpyDeviceToHost));
    cpu_forward(hW, hb, dims, hx.data(), ref.data());
    float max_err = 0.f;
    for (int i = 0; i < kOutDim; ++i) max_err = std::fmax(max_err, std::fabs(hy[i] - ref[i]));

    const double flops = 2.0 * batch * (64.0 * 128 + 128.0 * 128 * 2 + 128.0 * 16);
    std::printf("batch=%d  %.3f ms/iter  %.1f GFLOP/s  max|err|=%.2e  %s\\n",
                batch, ms, flops / ms / 1e6, max_err, max_err < 1e-2 ? "OK" : "MISMATCH");
    return max_err < 1e-2 ? 0 : 2;
}
`;

const MAKEFILE = `NVCC   ?= nvcc
ARCH   ?= sm_90
FLAGS  := -O3 -std=c++17 -arch=$(ARCH) -lineinfo --use_fast_math
OBJS   := mlp_megakernel.o main.o

all: mlp_megakernel

mlp_megakernel: $(OBJS)
\t$(NVCC) $(FLAGS) -o $@ $^

%.o: %.cu mlp.h
\t$(NVCC) $(FLAGS) -c -o $@ $<

%.o: %.cc mlp.h
\t$(NVCC) $(FLAGS) -x cu -c -o $@ $<

bench: mlp_megakernel
\t./mlp_megakernel 65536 && nsys profile --stats=true ./mlp_megakernel 1048576

clean:
\trm -f mlp_megakernel *.o *.nsys-rep
`;

const CARGO = `[package]
name = "spatial"
version = "0.3.1"
edition = "2021"
authors = ["Sameh Khamis"]
description = "MSCKF visual-inertial odometry for the Halfpixel spatial stack"

[dependencies]
nalgebra = "0.33"
rayon = "1.10"
anyhow = "1"
tracing = "0.1"

[profile.release]
lto = "fat"
codegen-units = 1
`;

const MAIN_RS = `//! spatial — visual-inertial odometry frontend: IMU propagates, camera corrects (MSCKF).
mod pose;
mod tracker;

use anyhow::Result;
use tracker::{Frame, Tracker};

fn main() -> Result<()> {
    tracing_subscriber::fmt().with_target(false).init();
    let mut tracker = Tracker::new(tracker::Config { max_features: 800, pyramid_levels: 4, ..Default::default() });

    for (i, frame) in Frame::stream("cam0")?.enumerate() {
        // in the real build IMU samples arrive at 200 Hz between frames:
        // for imu in imu_rx.drain_until(frame.ts_ns) { tracker.propagate(&imu); }
        let pose = tracker.track(&frame)?;
        if i % 30 == 0 {
            let t = pose.translation();
            tracing::info!(frame = i, x = t.x, y = t.y, z = t.z, inliers = tracker.inliers(), "pose");
        }
    }
    Ok(())
}
`;

const POSE_RS = `//! SE(3) rigid transforms with a tiny Lie algebra toolkit.
use nalgebra::{Matrix3, Matrix4, UnitQuaternion, Vector3, Vector6};
use std::ops::Mul;

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Se3 {
    pub rot: UnitQuaternion<f64>,
    pub trans: Vector3<f64>,
}

impl Se3 {
    pub fn identity() -> Self {
        Self { rot: UnitQuaternion::identity(), trans: Vector3::zeros() }
    }

    /// Exponential map from a twist (rotation first, then translation).
    pub fn exp(xi: &Vector6<f64>) -> Self {
        let w = Vector3::new(xi[0], xi[1], xi[2]);
        let v = Vector3::new(xi[3], xi[4], xi[5]);
        let theta = w.norm();
        let (rot, vmat) = if theta < 1e-9 {
            (UnitQuaternion::identity(), Matrix3::identity())
        } else {
            let k = skew(&(w / theta));
            let (s, c) = theta.sin_cos();
            let vmat = Matrix3::identity() + k * ((1.0 - c) / theta) + k * k * ((theta - s) / theta);
            (UnitQuaternion::from_scaled_axis(w), vmat)
        };
        Self { rot, trans: vmat * v }
    }

    pub fn inverse(&self) -> Self {
        let rinv = self.rot.inverse();
        Self { rot: rinv, trans: -(rinv * self.trans) }
    }

    pub fn translation(&self) -> Vector3<f64> { self.trans }

    pub fn to_matrix(&self) -> Matrix4<f64> {
        let mut m = Matrix4::identity();
        m.fixed_view_mut::<3, 3>(0, 0).copy_from(&self.rot.to_rotation_matrix().into_inner());
        m.fixed_view_mut::<3, 1>(0, 3).copy_from(&self.trans);
        m
    }
}

impl Mul for Se3 {
    type Output = Se3;
    fn mul(self, rhs: Se3) -> Se3 {
        Se3 { rot: self.rot * rhs.rot, trans: self.rot * rhs.trans + self.trans }
    }
}

fn skew(v: &Vector3<f64>) -> Matrix3<f64> {
    Matrix3::new(0.0, -v.z, v.y, v.z, 0.0, -v.x, -v.y, v.x, 0.0)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn exp_of_zero_is_identity() {
        let t = Se3::exp(&Vector6::zeros());
        assert!((t.to_matrix() - Matrix4::identity()).norm() < 1e-12);
    }
}
`;

const TRACKER_RS = `//! Multi-State Constraint Kalman Filter (MSCKF) for visual-inertial odometry.
//! IMU propagates the state; camera features constrain a sliding window of past poses.
use crate::pose::Se3;
use anyhow::Result;
use nalgebra::{DMatrix, DVector, Matrix3, Vector3};
use std::collections::VecDeque;

const MAX_CLONES: usize = 10;          // sliding window of camera poses
const IMU_STATE: usize = 15;           // q(3) p(3) v(3) bg(3) ba(3)
const CLONE_STATE: usize = 6;          // q(3) p(3)

#[derive(Clone, Debug)]
pub struct Config { pub max_features: usize, pub pyramid_levels: usize, pub huber_delta: f64, pub sigma_px: f64 }
impl Default for Config {
    fn default() -> Self { Self { max_features: 500, pyramid_levels: 3, huber_delta: 1.5, sigma_px: 1.0 } }
}

pub struct ImuSample { pub ts_ns: u64, pub gyro: Vector3<f64>, pub accel: Vector3<f64> }
pub struct Frame { pub width: u32, pub height: u32, pub gray: Vec<u8>, pub ts_ns: u64 }
impl Frame {
    pub fn stream(_device: &str) -> Result<impl Iterator<Item = Frame>> {
        Ok(std::iter::empty())   // hooked up to the capture layer in the real build
    }
}

/// One tracked landmark: observations across the clone window.
struct Track { id: u64, obs: Vec<(usize, f64, f64)> }   // (clone index, u, v)

pub struct Tracker {
    cfg: Config,
    pose: Se3, vel: Vector3<f64>, bg: Vector3<f64>, ba: Vector3<f64>,
    clones: VecDeque<Se3>,
    cov: DMatrix<f64>,
    tracks: Vec<Track>,
    inliers: usize,
    last_ts: Option<u64>,
}

impl Tracker {
    pub fn new(cfg: Config) -> Self {
        Self { cfg, pose: Se3::identity(), vel: Vector3::zeros(), bg: Vector3::zeros(), ba: Vector3::zeros(),
               clones: VecDeque::with_capacity(MAX_CLONES), cov: DMatrix::identity(IMU_STATE, IMU_STATE) * 1e-3,
               tracks: Vec::new(), inliers: 0, last_ts: None }
    }
    pub fn inliers(&self) -> usize { self.inliers }

    /// IMU propagation: integrate the nominal state, propagate covariance with the
    /// linearized error-state transition Phi and process noise Q.
    pub fn propagate(&mut self, imu: &ImuSample) {
        let Some(prev) = self.last_ts.replace(imu.ts_ns) else { return };
        let dt = (imu.ts_ns - prev) as f64 * 1e-9;
        let w = imu.gyro - self.bg;
        let a = imu.accel - self.ba;
        let dq = Se3::exp(&nalgebra::Vector6::new(w.x * dt, w.y * dt, w.z * dt, 0.0, 0.0, 0.0));
        let acc_w = self.pose.rot * a + GRAVITY;
        self.pose.trans += self.vel * dt + 0.5 * acc_w * dt * dt;
        self.vel += acc_w * dt;
        self.pose.rot = (self.pose * dq).rot;

        let n = self.cov.nrows();
        let mut phi = DMatrix::identity(n, n);
        phi.fixed_view_mut::<3, 3>(3, 6).copy_from(&(Matrix3::identity() * dt));           // dp/dv
        phi.fixed_view_mut::<3, 3>(6, 0).copy_from(&(-skew(&acc_w) * dt));                 // dv/dtheta
        phi.fixed_view_mut::<3, 3>(0, 9).copy_from(&(-Matrix3::identity() * dt));          // dtheta/dbg
        phi.fixed_view_mut::<3, 3>(6, 12).copy_from(&(-self.pose.rot.to_rotation_matrix().into_inner() * dt)); // dv/dba
        let mut q = DMatrix::zeros(n, n);
        q.view_mut((0, 0), (IMU_STATE, IMU_STATE)).copy_from(&(DMatrix::identity(IMU_STATE, IMU_STATE) * 1e-4 * dt));
        self.cov = &phi * &self.cov * phi.transpose() + q;
    }

    /// Camera update: clone the current pose into the window, then apply the
    /// MSCKF measurement update for every track that just finished (lost or full).
    pub fn track(&mut self, frame: &Frame) -> Result<Se3> {
        self.augment();
        let obs = detect_and_match(frame, &mut self.tracks, self.cfg.max_features, self.cfg.pyramid_levels);
        let done: Vec<Track> = self.tracks.drain_filter_compat(|t| t.obs.len() >= MAX_CLONES || !obs.contains(&t.id));

        let (mut h_all, mut r_all) = (Vec::new(), Vec::new());
        for t in &done {
            if t.obs.len() < 3 { continue; }
            let pf = triangulate(&self.clones, &t.obs);
            let (h_x, h_f, r) = jacobians(&self.clones, &t.obs, &pf, self.cov.nrows());
            // left-nullspace projection removes the feature from the state
            let (h_o, r_o) = nullspace_project(&h_x, &h_f, &r);
            h_all.push(h_o); r_all.push(r_o);
        }
        if !h_all.is_empty() {
            let (h, r) = stack(&h_all, &r_all);
            let (h, r) = huber_reweight(h, r, self.cfg.huber_delta);
            self.ekf_update(&h, &r, self.cfg.sigma_px);
            self.inliers = r.len() / 2;
        }
        self.marginalize();
        Ok(self.pose)
    }

    fn augment(&mut self) {
        self.clones.push_back(self.pose);
        let n = self.cov.nrows();
        let mut j = DMatrix::zeros(n + CLONE_STATE, n);
        j.view_mut((0, 0), (n, n)).fill_with_identity();
        j.view_mut((n, 0), (CLONE_STATE, CLONE_STATE)).fill_with_identity();     // clone copies q, p
        self.cov = &j * &self.cov * j.transpose();
    }

    fn marginalize(&mut self) {
        if self.clones.len() <= MAX_CLONES { return; }
        self.clones.pop_front();
        let n = self.cov.nrows();
        let keep: Vec<usize> = (0..IMU_STATE).chain(IMU_STATE + CLONE_STATE..n).collect();
        self.cov = self.cov.select_rows(&keep).select_columns(&keep);
    }

    fn ekf_update(&mut self, h: &DMatrix<f64>, r: &DVector<f64>, sigma: f64) {
        let s = h * &self.cov * h.transpose() + DMatrix::identity(h.nrows(), h.nrows()) * sigma * sigma;
        let k = &self.cov * h.transpose() * s.try_inverse().unwrap_or_else(|| DMatrix::identity(s.nrows(), s.ncols()));
        let dx = &k * r;
        self.apply_correction(&dx);
        let i_kh = DMatrix::identity(self.cov.nrows(), self.cov.ncols()) - &k * h;
        self.cov = &i_kh * &self.cov * i_kh.transpose() + &k * (DMatrix::identity(h.nrows(), h.nrows()) * sigma * sigma) * k.transpose(); // Joseph form
    }

    fn apply_correction(&mut self, dx: &DVector<f64>) {
        let seg = |i: usize| Vector3::new(dx[i], dx[i + 1], dx[i + 2]);
        self.pose = Se3::exp(&nalgebra::Vector6::new(dx[0], dx[1], dx[2], 0.0, 0.0, 0.0)) * self.pose;
        self.pose.trans += seg(3); self.vel += seg(6); self.bg += seg(9); self.ba += seg(12);
        for (c, clone) in self.clones.iter_mut().enumerate() {
            let o = IMU_STATE + c * CLONE_STATE;
            *clone = Se3::exp(&nalgebra::Vector6::new(dx[o], dx[o + 1], dx[o + 2], 0.0, 0.0, 0.0)) * *clone;
            clone.trans += seg(o + 3);
        }
    }
}

const GRAVITY: Vector3<f64> = Vector3::new(0.0, 0.0, -9.81);
fn skew(v: &Vector3<f64>) -> Matrix3<f64> { Matrix3::new(0.0, -v.z, v.y, v.z, 0.0, -v.x, -v.y, v.x, 0.0) }

// --- front end + geometry helpers (bodies live in the real build) ---
fn detect_and_match(_f: &Frame, _tracks: &mut Vec<Track>, _n: usize, _levels: usize) -> Vec<u64> { Vec::new() }
fn triangulate(_clones: &VecDeque<Se3>, _obs: &[(usize, f64, f64)]) -> Vector3<f64> { Vector3::zeros() }
fn jacobians(_c: &VecDeque<Se3>, obs: &[(usize, f64, f64)], _pf: &Vector3<f64>, n: usize) -> (DMatrix<f64>, DMatrix<f64>, DVector<f64>) {
    (DMatrix::zeros(2 * obs.len(), n), DMatrix::zeros(2 * obs.len(), 3), DVector::zeros(2 * obs.len()))
}
fn nullspace_project(h_x: &DMatrix<f64>, _h_f: &DMatrix<f64>, r: &DVector<f64>) -> (DMatrix<f64>, DVector<f64>) { (h_x.clone(), r.clone()) }
fn stack(hs: &[DMatrix<f64>], rs: &[DVector<f64>]) -> (DMatrix<f64>, DVector<f64>) {
    let rows: usize = hs.iter().map(|h| h.nrows()).sum();
    let mut h = DMatrix::zeros(rows, hs[0].ncols()); let mut r = DVector::zeros(rows); let mut i = 0;
    for (hb, rb) in hs.iter().zip(rs) { h.view_mut((i, 0), (hb.nrows(), hb.ncols())).copy_from(hb); r.rows_mut(i, rb.len()).copy_from(rb); i += hb.nrows(); }
    (h, r)
}
fn huber_reweight(h: DMatrix<f64>, r: DVector<f64>, _delta: f64) -> (DMatrix<f64>, DVector<f64>) { (h, r) }
trait DrainFilterCompat<T> { fn drain_filter_compat(&mut self, f: impl FnMut(&T) -> bool) -> Vec<T>; }
impl<T> DrainFilterCompat<T> for Vec<T> {
    fn drain_filter_compat(&mut self, mut f: impl FnMut(&T) -> bool) -> Vec<T> {
        let mut out = Vec::new(); let mut i = 0;
        while i < self.len() { if f(&self[i]) { out.push(self.remove(i)); } else { i += 1; } }
        out
    }
}
`;

const PIPELINE_PY = `"""Video curation pipeline for diffusion-transformer pretraining.

raw mp4  ->  shots  ->  quality + OCR gate  ->  aesthetic / DOVER score  ->  VLM caption  ->  webdataset shards

Each stage is a pure function over a Shot; the runner streams shots through them so a
single pod can process one source video end to end. Sharding across pods is by input
list line number (see k8s/job.yaml, JOB_COMPLETION_INDEX).
"""
from __future__ import annotations

import io
import json
import os
import subprocess
import tarfile
from dataclasses import asdict, dataclass, field
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from scenedetect import ContentDetector, detect

from models import AestheticScorer, DoverScorer, OcrDetector, VlmCaptioner

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---- thresholds: tuned on a 5k-shot labeled set; see notes/thresholds.md ----
MIN_SHOT_SEC     = 2.0
MAX_SHOT_SEC     = 12.0
MIN_SHORT_SIDE   = 480
MAX_TEXT_AREA    = 0.02     # fraction of frame covered by text boxes
MIN_AESTHETIC    = 4.6      # LAION aesthetic v2 (0-10)
MIN_DOVER        = 0.55     # DOVER technical+aesthetic fused (0-1)
MAX_STATIC_MOTION = 0.004   # mean abs frame diff; below this the clip is a still


@dataclass
class Shot:
    src: str
    idx: int
    t0: float
    t1: float
    fps: float
    width: int
    height: int
    frames: np.ndarray | None = None          # [T, H, W, 3] uint8, sampled at 2 fps
    scores: dict[str, float] = field(default_factory=dict)
    caption: str = ""
    reject: str = ""                          # empty = kept; otherwise the stage that dropped it

    @property
    def duration(self) -> float:
        return self.t1 - self.t0

    def key(self) -> str:
        return f"{Path(self.src).stem}_{self.idx:04d}"


# ---------------------------------------------------------------- stage 1: shots
def split_shots(src: str) -> list[Shot]:
    """PySceneDetect content detector; merge tiny cuts, clamp long shots."""
    meta = probe(src)
    scenes = detect(src, ContentDetector(threshold=27.0, min_scene_len=int(MIN_SHOT_SEC * meta["fps"])))
    shots = []
    for i, (a, b) in enumerate(scenes):
        t0, t1 = a.get_seconds(), b.get_seconds()
        while t1 - t0 > MAX_SHOT_SEC:                 # long takes become several samples
            shots.append(Shot(src, len(shots), t0, t0 + MAX_SHOT_SEC, **meta))
            t0 += MAX_SHOT_SEC
        if t1 - t0 >= MIN_SHOT_SEC:
            shots.append(Shot(src, len(shots), t0, t1, **meta))
    return shots


def probe(src: str) -> dict:
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                   "stream=width,height,r_frame_rate", "-of", "json", src])
    s = json.loads(out)["streams"][0]
    num, den = map(int, s["r_frame_rate"].split("/"))
    return {"fps": num / den, "width": s["width"], "height": s["height"]}


def decode(shot: Shot, sample_fps: float = 2.0) -> Shot:
    """Decode a shot to a small frame stack with ffmpeg; enough for scoring, not training."""
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{shot.t0:.3f}", "-t", f"{shot.duration:.3f}", "-i", shot.src,
           "-vf", f"fps={sample_fps},scale=-2:{MIN_SHORT_SIDE}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    raw = subprocess.check_output(cmd)
    h = MIN_SHORT_SIDE
    w = int(round(shot.width * h / shot.height)) // 2 * 2
    shot.frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
    return shot


# ---------------------------------------------------------------- stage 2: quality + text gate
def quality_gate(shot: Shot, ocr: OcrDetector) -> Shot:
    if min(shot.width, shot.height) < MIN_SHORT_SIDE:
        shot.reject = "resolution"; return shot
    f = shot.frames.astype(np.float32) / 255.0
    motion = float(np.abs(np.diff(f, axis=0)).mean())
    shot.scores["motion"] = motion
    if motion < MAX_STATIC_MOTION:
        shot.reject = "static"; return shot
    # OCR on first / middle / last frame; area-weighted so a watermark passes but a subtitle wall does not
    text_area = max(ocr.text_area(Image.fromarray(shot.frames[i])) for i in (0, len(shot.frames) // 2, -1))
    shot.scores["text_area"] = text_area
    if text_area > MAX_TEXT_AREA:
        shot.reject = "text"
    return shot


# ---------------------------------------------------------------- stage 3: aesthetic / DOVER
@torch.inference_mode()
def score(shot: Shot, aesthetic: AestheticScorer, dover: DoverScorer) -> Shot:
    mid = Image.fromarray(shot.frames[len(shot.frames) // 2])
    shot.scores["aesthetic"] = aesthetic(mid)
    shot.scores["dover"] = dover(shot.frames)
    if shot.scores["aesthetic"] < MIN_AESTHETIC:
        shot.reject = "aesthetic"
    elif shot.scores["dover"] < MIN_DOVER:
        shot.reject = "dover"
    return shot


# ---------------------------------------------------------------- stage 4: caption
@torch.inference_mode()
def caption(shot: Shot, vlm: VlmCaptioner) -> Shot:
    keyframes = [Image.fromarray(shot.frames[i]) for i in np.linspace(0, len(shot.frames) - 1, 4, dtype=int)]
    shot.caption = vlm(keyframes)
    return shot


# ---------------------------------------------------------------- stage 5: write shards
class ShardWriter:
    """WebDataset tar shards: {key}.mp4 + {key}.json. ~1 GB per shard."""
    def __init__(self, out_dir: str, prefix: str, max_bytes: int = 1 << 30):
        self.out_dir, self.prefix, self.max_bytes = Path(out_dir), prefix, max_bytes
        self.out_dir.mkdir(parents=True, exist_ok=True)
        self.n = 0; self.tar = None; self.size = 0

    def _roll(self):
        if self.tar: self.tar.close()
        self.tar = tarfile.open(self.out_dir / f"{self.prefix}-{self.n:05d}.tar", "w"); self.n += 1; self.size = 0

    def add(self, shot: Shot, clip: bytes):
        if self.tar is None or self.size > self.max_bytes: self._roll()
        meta = {**asdict(shot), "frames": None}
        for name, data in ((f"{shot.key()}.mp4", clip), (f"{shot.key()}.json", json.dumps(meta).encode())):
            ti = tarfile.TarInfo(name); ti.size = len(data)
            self.tar.addfile(ti, io.BytesIO(data)); self.size += len(data)

    def close(self):
        if self.tar: self.tar.close()


def transcode(shot: Shot) -> bytes:
    """Re-encode the kept shot at training resolution (short side 480, 24 fps, h264 crf 18)."""
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{shot.t0:.3f}", "-t", f"{shot.duration:.3f}", "-i", shot.src,
           "-vf", "scale=-2:480,fps=24", "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-an",
           "-movflags", "+faststart", "-f", "mp4", "pipe:1"]
    return subprocess.check_output(cmd)


# ---------------------------------------------------------------- runner
def run(inputs: list[str], out_dir: str, worker: int) -> dict:
    ocr, aesthetic, dover, vlm = OcrDetector(DEVICE), AestheticScorer(DEVICE), DoverScorer(DEVICE), VlmCaptioner(DEVICE)
    writer = ShardWriter(out_dir, f"w{worker:03d}")
    stats: dict[str, int] = {"shots": 0, "kept": 0}
    for src in inputs:
        for shot in split_shots(src):
            stats["shots"] += 1
            shot = decode(shot)
            shot = quality_gate(shot, ocr)
            if not shot.reject: shot = score(shot, aesthetic, dover)
            if not shot.reject: shot = caption(shot, vlm)
            if shot.reject:
                stats[shot.reject] = stats.get(shot.reject, 0) + 1
                continue
            writer.add(shot, transcode(shot)); stats["kept"] += 1
        print(json.dumps({"src": src, **stats}), flush=True)
    writer.close()
    return stats


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", required=True, help="text file, one video path/URL per line")
    ap.add_argument("--out", required=True)
    ap.add_argument("--workers", type=int, default=int(os.environ.get("WORKERS", 1)))
    ap.add_argument("--worker", type=int, default=int(os.environ.get("JOB_COMPLETION_INDEX", 0)))
    args = ap.parse_args()
    lines = [l.strip() for l in open(args.list) if l.strip()]
    mine = lines[args.worker :: args.workers]
    print(json.dumps(run(mine, args.out, args.worker)))
`;

const MODELS_PY = `"""Thin wrappers over the scoring / captioning models so pipeline.py stays model-agnostic."""
from __future__ import annotations

import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from transformers import (AutoModelForVision2Seq, AutoProcessor, CLIPModel, CLIPProcessor, pipeline)


class OcrDetector:
    """Text *area* (not content) — we only need to know how much of the frame is text."""
    def __init__(self, device: str):
        self.det = pipeline("object-detection", model="Xenova/ocr-detection-craft", device=0 if device == "cuda" else -1)

    def text_area(self, img: Image.Image) -> float:
        boxes = self.det(img, threshold=0.5)
        area = sum((b["box"]["xmax"] - b["box"]["xmin"]) * (b["box"]["ymax"] - b["box"]["ymin"]) for b in boxes)
        return area / (img.width * img.height)


class AestheticScorer:
    """LAION aesthetic predictor v2: linear head on CLIP ViT-L/14 image embeddings, 0-10."""
    def __init__(self, device: str):
        self.device = device
        self.clip = CLIPModel.from_pretrained("openai/clip-vit-large-patch14", torch_dtype=torch.float16).to(device).eval()
        self.proc = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14")
        self.head = nn.Linear(768, 1).to(device).half()
        self.head.load_state_dict(torch.load("weights/sac+logos+ava1-l14-linearMSE.pth", map_location=device))

    @torch.inference_mode()
    def __call__(self, img: Image.Image) -> float:
        px = self.proc(images=img, return_tensors="pt")["pixel_values"].to(self.device).half()
        emb = self.clip.get_image_features(pixel_values=px)
        emb = emb / emb.norm(dim=-1, keepdim=True)
        return float(self.head(emb).item())


class DoverScorer:
    """DOVER (Disentangled Objective Video quality Evaluator): technical + aesthetic branches, fused to 0-1."""
    def __init__(self, device: str):
        from dover import DOVER, load_pretrained          # pip install git+https://github.com/VQAssessment/DOVER
        self.device = device
        self.model = load_pretrained(DOVER(), "weights/DOVER.pth").to(device).eval()

    @torch.inference_mode()
    def __call__(self, frames: np.ndarray) -> float:
        # DOVER wants 32 frames, [1, 3, T, 224, 224], normalized
        idx = np.linspace(0, len(frames) - 1, 32, dtype=int)
        x = torch.from_numpy(frames[idx]).permute(3, 0, 1, 2).float().div(255)
        x = torch.nn.functional.interpolate(x, size=(224, 224), mode="bilinear", align_corners=False)
        x = (x - torch.tensor([0.485, 0.456, 0.406])[:, None, None, None]) / torch.tensor([0.229, 0.224, 0.225])[:, None, None, None]
        tech, aes = self.model({"technical": x[None].to(self.device), "aesthetic": x[None].to(self.device)})
        return float(torch.sigmoid(0.6 * tech + 0.4 * aes).item())


class VlmCaptioner:
    """Dense, literal captions for T2V training — subject, action, camera motion, setting, lighting."""
    PROMPT = ("Describe this video clip in two sentences for a video generation dataset. "
              "State the main subject and action, camera motion, setting, and lighting. "
              "Do not speculate, do not mention text or logos, do not use the word 'video'.")

    def __init__(self, device: str, model_id: str = "Qwen/Qwen2-VL-7B-Instruct"):
        self.device = device
        self.proc = AutoProcessor.from_pretrained(model_id)
        self.model = AutoModelForVision2Seq.from_pretrained(model_id, torch_dtype=torch.bfloat16, device_map=device).eval()

    @torch.inference_mode()
    def __call__(self, keyframes: list[Image.Image]) -> str:
        msgs = [{"role": "user", "content": [*({"type": "image"} for _ in keyframes), {"type": "text", "text": self.PROMPT}]}]
        text = self.proc.apply_chat_template(msgs, add_generation_prompt=True)
        inputs = self.proc(text=[text], images=keyframes, return_tensors="pt").to(self.device)
        out = self.model.generate(**inputs, max_new_tokens=96, do_sample=False)
        return self.proc.batch_decode(out[:, inputs["input_ids"].shape[1]:], skip_special_tokens=True)[0].strip()
`;

const PIPELINE_REQS = `torch>=2.4
transformers>=4.45
diffusers>=0.30          # VAE latent pre-encoding in the next stage (encode_latents.py)
timm>=1.0
accelerate
scenedetect[opencv]>=0.6
webdataset
pillow
numpy
git+https://github.com/VQAssessment/DOVER
`;

const PIPELINE_JOB_YAML = `# k8s/job.yaml — indexed Job: one pod per input shard, GPU per pod.
#   kubectl create configmap video-list --from-file=videos.txt
#   kubectl apply -f k8s/job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: video_pipeline
  namespace: default
  labels: { app: video_pipeline, stage: pretrain-data }
spec:
  completionMode: Indexed
  completions: 64                 # shards; each pod takes lines i, i+64, i+128, ...
  parallelism: 16                 # concurrent pods = GPUs we are willing to burn
  backoffLimit: 4
  ttlSecondsAfterFinished: 86400
  template:
    metadata:
      labels: { app: video_pipeline }
    spec:
      restartPolicy: OnFailure
      nodeSelector:
        cloud.google.com/gke-accelerator: nvidia-l4
      tolerations:
        - { key: nvidia.com/gpu, operator: Exists, effect: NoSchedule }
      containers:
        - name: curate
          image: nvcr.io/halfpixel/video_pipeline:sha-7be0d4e
          command: ["python", "pipeline.py"]
          args: ["--list", "/data/videos.txt", "--out", "/out/shards"]
          env:
            - { name: WORKERS, value: "64" }
            - { name: HF_HOME, value: "/cache/hf" }
            - { name: TOKENIZERS_PARALLELISM, value: "false" }
          resources:
            requests: { cpu: "6", memory: "24Gi", nvidia.com/gpu: 1 }
            limits:   { cpu: "8", memory: "32Gi", nvidia.com/gpu: 1 }
          volumeMounts:
            - { name: video-list, mountPath: /data, readOnly: true }
            - { name: shards, mountPath: /out }
            - { name: hf-cache, mountPath: /cache/hf }
            - { name: dshm, mountPath: /dev/shm }
      volumes:
        - name: video-list
          configMap: { name: video-list }
        - name: shards
          persistentVolumeClaim: { claimName: pretrain-shards }        # 20 TiB filestore
        - name: hf-cache
          persistentVolumeClaim: { claimName: hf-cache, readOnly: true }
        - name: dshm
          emptyDir: { medium: Memory, sizeLimit: 8Gi }
`;

const PIPELINE_README = `# video_pipeline

Shot-level curation for diffusion-transformer pretraining data.

    raw mp4 -> shots -> resolution/static/OCR gate -> aesthetic + DOVER -> VLM caption -> webdataset

Stages (\`pipeline.py\`):

1. **split_shots** — PySceneDetect content detector; 2-12 s shots, long takes are chunked.
2. **quality_gate** — drop < 480p, near-static clips, and anything with > 2% of the frame covered by text (CRAFT detector).
3. **score** — LAION aesthetic v2 on the middle frame, DOVER on 32 sampled frames.
4. **caption** — Qwen2-VL on 4 keyframes, dense literal prompt (subject, action, camera, setting, light).
5. **ShardWriter** — h264 480p/24fps clip + json sidecar into ~1 GB webdataset tars.

Run locally on one video:

    python pipeline.py --list one.txt --out /tmp/shards

Run on the cluster (64 shards, 16 L4s at a time):

    kubectl create configmap video-list --from-file=videos.txt
    kubectl apply -f k8s/job.yaml
    kubectl logs -l app=video_pipeline -f | jq .

Next stage: \`encode_latents.py\` runs the shards through the video VAE (diffusers) so training never touches pixels.
`;

const TODO = `# todo

- [x] megakernel: fuse bias + relu into the accumulate loop
- [ ] megakernel: try wmma / tensor cores for the 128x128 layers
- [ ] msckf: switch nullspace projection to Givens rotations (QR is the hot spot)
- [ ] msckf: online camera-IMU time offset estimation
- [ ] ingestion-cronjob: pods OOMKilled on cpu-ingest-pool-a2 since the 2am run — bump memory limit or shard the shuffle
- [ ] write up "spatial intelligence from ordinary cameras" post for Halfpixel
- [ ] reviews due friday
- [ ] reply to the two candidates from tuesday
`;

const IDEAS = `# ideas (unsorted)

- a world-model prior for 3D reconstruction: what the room looks like behind the fridge
- render-and-compare as a training signal is still underused for real-world video
- distill the big spatial model into a phone-sized tracker; teacher runs offline
- custom harnesses are the future of software development — the agent is only as good as its loop
`;

const ZSHRC = `# ~/.zshrc
export EDITOR=nvim
export PATH="$HOME/.cargo/bin:/usr/local/cuda/bin:$PATH"
export CUDA_VISIBLE_DEVICES=0

alias ll='ls -la'
alias gs='git status'
alias v='nvim'
alias t='tmux attach -t main || tmux new -s main'

setopt AUTO_CD HIST_IGNORE_DUPS SHARE_HISTORY
PROMPT='[%n@%m:%~]$ '
`;

const INIT_LUA = `-- ~/.config/nvim/init.lua
vim.g.mapleader = " "
local o = vim.opt
o.number = true
o.relativenumber = false
o.wrap = true
o.linebreak = true
o.tabstop = 4
o.shiftwidth = 4
o.expandtab = true
o.termguicolors = true
o.clipboard = "unnamedplus"

local map = vim.keymap.set
map("n", "<leader>n", ":bnext<CR>",     { desc = "next buffer" })
map("n", "<leader>p", ":bprevious<CR>", { desc = "prev buffer" })
map("n", "<leader>q", ":bdelete<CR>",   { desc = "close buffer" })
for i = 1, 9 do map("n", "<leader>" .. i, i .. "gt", { desc = "tab " .. i }) end

vim.cmd.colorscheme("catppuccin")
`;

const GITCONFIG = `[user]
\tname = Sameh Khamis
\temail = sameh@halfpixel.ai
[core]
\teditor = nvim
[alias]
\tlg = log --oneline --graph --decorate
`;

const OS_RELEASE = `NAME="halfpixel OS"
VERSION="26.09 (Spatial)"
ID=halfpixel
PRETTY_NAME="halfpixel OS 26.09"
HOME_URL="https://halfpixel.ai"
`;

const MOTD = `Welcome to halfpixel OS 26.09 (GNU/Linux 6.12.0-spatial x86_64)

 * Documentation:  cat ~/README.md
 * Support:        help
 * GPUs:           1 × H100 80GB (idle), 1 × RTX 6000 Ada (tracking cam0)

Last login: Thu Sep  4 09:41:07 2026 from 10.0.0.42
`;

const HOME_README = `# ~/README.md

Welcome to Sameh's workstation, where I build things to understand them.
Reach out if you want to work together!
`;

const CPUINFO = `processor\t: 0
vendor_id\t: GenuineIntel
model name\t: Intel(R) Xeon(R) w9-3495X
cpu MHz\t\t: 4800.000
cache size\t: 105 MB
flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm avx avx2 avx512f amx_tile amx_bf16
`;

const MEMINFO = `MemTotal:       527946880 kB
MemFree:        398210144 kB
MemAvailable:   461120000 kB
Buffers:          1310720 kB
Cached:          58720256 kB
SwapTotal:              0 kB
`;

const d = (c = {}) => ({ t: 'd', c });
const f = (s, x) => (x ? { t: 'f', s, x: 1 } : { t: 'f', s });

export const BIN = ['gcc','bazel','kubectl','ls','cd','pwd','cat','echo','touch','rm','mkdir','rmdir','mv','cp','head','tail','wc','grep','find','tree','hostname','whoami','id','uname','date','uptime','clear','history','help','neofetch','htop','top','nvim','vim','vi','theme','env','printenv','export','which','ps','free','df','man','sudo','exit','logout','cowsay','fortune','make','nvcc','cargo','git','python','python3','less','more','open','true','false','yes','sl'];

export function seed() {
  const bin = {}; BIN.forEach(n => (bin[n] = f('#!ELF (simulated)', 1)));
  return d({
    home: d({
      sameh: d({
        'README.md': f(HOME_README),
        resume: d({
          'experience.md': f(EXPERIENCE),
          'publications.md': f(PUBLICATIONS),
          'education.md': f(EDUCATION),
          'links.sh': f(LINKS, 1),
        }),
        projects: d({
          megakernel: d({ 'mlp.h': f(MLP_H), 'mlp_megakernel.cu': f(MLP_CU), 'main.cc': f(MLP_MAIN_CC), Makefile: f(MAKEFILE) }),
          video_pipeline: d({ 'README.md': f(PIPELINE_README), 'pipeline.py': f(PIPELINE_PY), 'models.py': f(MODELS_PY), 'requirements.txt': f(PIPELINE_REQS), k8s: d({ 'job.yaml': f(PIPELINE_JOB_YAML) }) }),
          spatial: d({ 'Cargo.toml': f(CARGO), src: d({ 'main.rs': f(MAIN_RS), 'pose.rs': f(POSE_RS), 'tracker.rs': f(TRACKER_RS) }) }),
        }),
        notes: d({ 'todo.md': f(TODO), 'ideas.md': f(IDEAS) }),
        papers: d({ 'arxiv_draft.tex': f('\\documentclass{article}\n\\title{Spatial Intelligence from Ordinary Cameras}\n\\author{Sameh Khamis}\n\\begin{document}\n\\maketitle\n% TODO: everything\n\\end{document}\n') }),
        '.zshrc': f(ZSHRC),
        '.gitconfig': f(GITCONFIG),
        '.config': d({ nvim: d({ 'init.lua': f(INIT_LUA) }) }),
      }),
    }),
    etc: d({ hostname: f(HOST + '\n'), 'os-release': f(OS_RELEASE), motd: f(MOTD), passwd: f('root:x:0:0:root:/root:/bin/zsh\nsameh:x:1000:1000:Sameh Khamis:/home/sameh:/bin/zsh\n') }),
    proc: d({ cpuinfo: f(CPUINFO), meminfo: f(MEMINFO), version: f('Linux version 6.12.0-spatial (sameh@halfpixel) (gcc 14.2) #1 SMP PREEMPT_DYNAMIC\n') }),
    usr: d({ bin: d(bin), local: d({ cuda: d({ bin: d({ nvcc: f('', 1) }) }) }) }),
    tmp: d(),
    dev: d({ null: f(''), nvidia0: f(''), video0: f('') }),
  });
}

export class VFS {
  constructor(root, cwd = HOME) { this.root = root; this.cwd = cwd; }
  static fromJSON(json, cwd) { return new VFS(json, cwd); }
  toJSON() { return this.root; }
  resolve(p) {
    if (!p) return this.cwd;
    if (p === '~') p = HOME; else if (p.startsWith('~/')) p = HOME + p.slice(1);
    const abs = p.startsWith('/') ? p : this.cwd + '/' + p;
    const out = [];
    for (const part of abs.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') out.pop(); else out.push(part);
    }
    return '/' + out.join('/');
  }
  get(p) {
    const abs = this.resolve(p);
    if (abs === '/') return this.root;
    let n = this.root;
    for (const part of abs.slice(1).split('/')) { if (!n || n.t !== 'd' || !n.c[part]) return null; n = n.c[part]; }
    return n;
  }
  parentOf(p) { const abs = this.resolve(p); const i = abs.lastIndexOf('/'); return { dir: this.get(abs.slice(0, i) || '/'), name: abs.slice(i + 1), abs }; }
  exists(p) { return !!this.get(p); }
  isDir(p) { const n = this.get(p); return !!n && n.t === 'd'; }
  read(p) { const n = this.get(p); if (!n) throw `${p}: No such file or directory`; if (n.t === 'd') throw `${p}: Is a directory`; return n.s; }
  write(p, s, append = false) {
    const { dir, name } = this.parentOf(p);
    if (!dir || dir.t !== 'd') throw `${p}: No such file or directory`;
    const cur = dir.c[name];
    if (cur && cur.t === 'd') throw `${p}: Is a directory`;
    dir.c[name] = f(append && cur ? cur.s + s : s, cur && cur.x);
  }
  touch(p) { if (!this.exists(p)) this.write(p, ''); }
  mkdir(p, parents = false) {
    const abs = this.resolve(p);
    if (parents) { let cur = ''; for (const part of abs.slice(1).split('/')) { cur += '/' + part; if (!this.exists(cur)) this.mkdir(cur); } return; }
    const { dir, name } = this.parentOf(abs);
    if (!dir || dir.t !== 'd') throw `cannot create directory '${p}': No such file or directory`;
    if (dir.c[name]) throw `cannot create directory '${p}': File exists`;
    dir.c[name] = d();
  }
  rm(p, recursive = false) {
    const { dir, name, abs } = this.parentOf(p);
    if (abs === '/' || abs === HOME) throw `cannot remove '${p}': nice try`;
    const n = dir && dir.c[name];
    if (!n) throw `cannot remove '${p}': No such file or directory`;
    if (n.t === 'd' && !recursive) throw `cannot remove '${p}': Is a directory`;
    delete dir.c[name];
  }
  clone(n) { return JSON.parse(JSON.stringify(n)); }
  cp(src, dst, recursive = false) {
    const n = this.get(src); if (!n) throw `cannot stat '${src}': No such file or directory`;
    if (n.t === 'd' && !recursive) throw `-r not specified; omitting directory '${src}'`;
    let target = this.resolve(dst);
    if (this.isDir(target)) target = target + '/' + this.parentOf(src).name;
    const { dir, name } = this.parentOf(target);
    if (!dir || dir.t !== 'd') throw `cannot create '${dst}': No such file or directory`;
    dir.c[name] = this.clone(n);
  }
  mv(src, dst) { this.cp(src, dst, true); this.rm(src, true); }
  list(p) { const n = this.get(p); if (!n) throw `cannot access '${p}': No such file or directory`; if (n.t !== 'd') return [[this.parentOf(p).name, n]]; return Object.entries(n.c).sort((a, b) => a[0].localeCompare(b[0])); }
  walk(p, fn) { const abs = this.resolve(p); const n = this.get(abs); if (!n) return; fn(abs, n); if (n.t === 'd') for (const k of Object.keys(n.c).sort()) this.walk(abs === '/' ? '/' + k : abs + '/' + k, fn); }
  pretty(p) { const abs = this.resolve(p); return abs === HOME ? '~' : abs.startsWith(HOME + '/') ? '~' + abs.slice(HOME.length) : abs; }
}

export function ftOf(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  return ({ md: 'markdown', sh: 'sh', zshrc: 'sh', rs: 'rust', cu: 'c', c: 'c', h: 'c', cc: 'c', cpp: 'c', lua: 'lua', toml: 'toml', yaml: 'yaml', yml: 'yaml', txt: 'text', tex: 'tex', json: 'json', py: 'python' })[ext] || (name === 'Makefile' ? 'make' : name.startsWith('.') ? 'sh' : 'text');
}
