# Sahil Chouksey - Portfolio

A modern bento-grid portfolio website built with React + Vite, featuring a dark theme and responsive design.

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite 7** - Fast build tool and dev server
- **Framer Motion** - Smooth animations
- **Typst** - Resume generation
- **CSS3** - Custom styling with modern features

## Project Structure

```
portfolio/
├── public/
│   ├── images/          # Website images and logos
│   ├── resume.pdf       # Generated resume
│   └── ...              # Favicons and static assets
├── src/
│   ├── components/
│   │   └── sections/    # Page sections
│   │       ├── Navigation.jsx
│   │       ├── HeroCard.jsx
│   │       ├── ContactCard.jsx
│   │       ├── TimezoneCard.jsx
│   │       ├── DescriptionCard.jsx
│   │       ├── SocialLinks.jsx
│   │       ├── TechStackSection.jsx
│   │       ├── ProjectSection.jsx
│   │       └── FooterSection.jsx
│   ├── resume/
│   │   ├── resume.typ           # Resume content
│   │   └── templates/           # Typst templates
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Build resume only**
   ```bash
   npm run build:resume
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build resume + site for production |
| `npm run build:resume` | Compile Typst resume to PDF |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Resume

The resume is built using [Typst](https://typst.app/). Edit `src/resume/resume.typ` to update content. The build process automatically compiles it to `public/resume.pdf`.

**Requirements:** Install Typst CLI to build the resume:
```bash
# macOS
brew install typst

# Other platforms: https://github.com/typst/typst
```

## Sections

- **Hero** - Avatar, name, title with ASCII art animation
- **Contact** - Email CTA card
- **Social Links** - GitHub, LinkedIn, X, WakaTime
- **Timezone** - Location and timezone info
- **Description** - About me with specializations
- **Tech Stack** - Skills and experience timeline
- **Projects** - Featured work with links
- **Footer** - Contact and copyright

## License

MIT
