import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { X, Copy, Check, Download, FileCode, Folder, Terminal, Sparkles } from 'lucide-react';
import JSZip from 'jszip';

interface SourceCodeModalProps {
  theme: ThemeMode;
  onClose: () => void;
}

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({ theme, onClose }) => {
  const isFrost = theme === 'frost';
  const isInferno = theme === 'inferno';

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('App.tsx');
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Source files catalogue
  const files: { [key: string]: { path: string; language: string; content: string } } = {
    'App.tsx': {
      path: 'src/App.tsx',
      language: 'typescript',
      content: `/**
 * AgentBlazer Club - SJEC CSE
 * St Joseph Engineering College, Mangaluru
 * Autonomous & Agentic AI Systems Student Initiative
 */
import React, { useState } from 'react';
import { ActiveTab, ThemeMode } from './types';
import { IntroScreen } from './components/IntroScreen';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { EventsSection } from './components/EventsSection';
import { JoinSection } from './components/JoinSection';
import { Footer } from './components/Footer';
import { CharterModal } from './components/CharterModal';
import { SourceCodeModal } from './components/SourceCodeModal';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('violet');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState(false);

  if (showIntro) {
    return (
      <IntroScreen
        theme={theme}
        onContinue={() => setShowIntro(false)}
        onThemeChange={setTheme}
      />
    );
  }

  return (
    <div className={\`min-h-screen font-sans transition-colors duration-500 theme-\${theme}\`}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />
      <main>
        {activeTab === 'home' && (
          <HomeSection theme={theme} setActiveTab={setActiveTab} onOpenCharter={() => setIsCharterOpen(true)} />
        )}
        {activeTab === 'about' && <AboutSection theme={theme} />}
        {activeTab === 'events' && <EventsSection theme={theme} />}
        {activeTab === 'join' && <JoinSection theme={theme} onOpenCharter={() => setIsCharterOpen(true)} />}
      </main>
      <Footer
        theme={theme}
        setActiveTab={setActiveTab}
        onOpenCharter={() => setIsCharterOpen(true)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />
      {isCharterOpen && <CharterModal theme={theme} onClose={() => setIsCharterOpen(false)} />}
      {isSourceCodeOpen && <SourceCodeModal theme={theme} onClose={() => setIsSourceCodeOpen(false)} />}
    </div>
  );
}`,
    },
    'PhoenixHero.tsx': {
      path: 'src/components/PhoenixHero.tsx',
      language: 'typescript',
      content: `// Dynamic glowing Phoenix Emblem with reactive SVG filters and theme palettes
import React from 'react';
import { ThemeMode } from '../types';

export const PhoenixHero = ({ theme, size = 'md', animated = true }) => {
  // Generates radiant wings, feather plumage, glowing eyes, and embers
  // Supports Violet, Inferno, and Frost responsive color schemes
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 1000 750" fill="none">
        {/* Intricate plumage gradients, soft-glow and ultra-glow filters */}
      </svg>
    </div>
  );
};`,
    },
    'IntroScreen.tsx': {
      path: 'src/components/IntroScreen.tsx',
      language: 'typescript',
      content: `// Phoenix Opener with "TAP TO CONTINUE" and audio-visual warp transition
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PhoenixHero } from './PhoenixHero';

export const IntroScreen = ({ onContinue, theme }) => {
  const handleTap = () => {
    // 1. Play Web Audio synth frequency sweep
    // 2. Launch themed confetti burst
    // 3. Zoom-in transition into main portal
    onContinue();
  };

  return (
    <div className="fixed inset-0 bg-[#05030a] flex items-center justify-center">
      <PhoenixHero theme={theme} size="intro" />
      <button onClick={handleTap}>TAP TO CONTINUE</button>
    </div>
  );
};`,
    },
    'data.ts': {
      path: 'src/data.ts',
      language: 'typescript',
      content: `// Official AgentBlazer Club dataset extracted directly from the SJEC CSE video
export const HONORED_GUESTS = [
  { name: 'Mr. Santosh Rebello', role: 'Guest of Honor', departmentRole: 'Salesforce' },
  { name: 'Mr. Stephen Pinto', role: 'Technical Mentor', departmentRole: 'Salesforce & SJEC Alumnus' },
  { name: "Dr. Rio D'Souza", role: 'Presidential Address', departmentRole: 'Principal, SJEC' },
  { name: "Dr. Melwyn D'Souza", role: 'Program Chair', departmentRole: 'HOD, Computer Science & Engg' }
];

export const STUDENT_OFFICERS = [
  { name: 'Ruben Saldanha', role: 'President', sub: 'Executive President' },
  { name: 'Ajay Preenal Dsouza', role: 'Vice President', sub: 'Executive Vice President' },
  { name: 'Stevin Dsouza', role: 'Tech Lead', sub: 'Technical Director' },
  { name: 'Frenny Chrystal Saldanha', role: 'Resource Head', sub: 'Operations & Logistics' },
  { name: 'Joyline Galbao', role: 'Secretary', sub: 'Administration' },
  { name: 'Chinthan N V', role: 'Media Head', sub: 'Creative Outreach' }
];`,
    },
    'types.ts': {
      path: 'src/types.ts',
      language: 'typescript',
      content: `export type ThemeMode = 'violet' | 'inferno' | 'frost';
export type ActiveTab = 'home' | 'about' | 'events' | 'join';

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  departmentRole: string;
  category: 'guest' | 'faculty' | 'core-officer' | 'working-committee';
  photoUrl: string;
  badge?: string;
}`,
    },
    'server.ts': {
      path: 'server.ts',
      language: 'typescript',
      content: `/**
 * AgentBlazer Club - Full-Stack Express Server
 * Department of Computer Science & Engineering, SJEC Mangaluru
 * Handles API endpoints for membership intake, contact inquiries, and analytics.
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface MembershipApplication {
  id: string;
  fullName: string;
  usn: string;
  year: string;
  branch: string;
  email: string;
  domain: string;
  statement: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'reviewed';
}

const applications: MembershipApplication[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Submit student membership application
  app.post('/api/membership', (req, res) => {
    const { fullName, usn, year, branch, email, domain, statement } = req.body;
    if (!fullName || !usn || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newApp: MembershipApplication = {
      id: \`AB-MEM-\${Math.floor(1000 + Math.random() * 9000)}\`,
      fullName,
      usn: usn.toUpperCase(),
      year: year || '2nd Year',
      branch: branch || 'Computer Science & Engineering',
      email,
      domain: domain || 'Agentic AI Systems',
      statement: statement || '',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    applications.push(newApp);
    res.status(201).json({ success: true, application: newApp });
  });

  // Get membership statistics
  app.get('/api/membership/stats', (req, res) => {
    res.json({
      total: applications.length,
      tracks: {
        'Agentic AI Systems': applications.filter((a) => a.domain.includes('Agentic')).length,
        'Prompt Engineering & LLMOps': applications.filter((a) => a.domain.includes('Prompt')).length,
        'Full Stack & Cloud Architecture': applications.filter((a) => a.domain.includes('Full Stack')).length,
        'Autonomous Robotics & Edge AI': applications.filter((a) => a.domain.includes('Robotics')).length,
      },
    });
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running on port \${PORT}\`);
  });
}

startServer();`,
    },
    'BACKEND_GUIDE.md': {
      path: 'docs/BACKEND_GUIDE.md',
      language: 'markdown',
      content: `# AgentBlazer Club - Full-Stack Architecture & Backend Integration Guide

## 1. Current Architecture Overview
The application is structured as a unified **Full-Stack Node.js/Express + React 19** application:
- **Frontend:** React 19, TypeScript, Tailwind CSS, Motion animations, Lucide icons.
- **Backend Server:** Node.js + Express + TypeScript (\`server.ts\`).
- **Dev Workflow:** \`tsx server.ts\` serves the frontend via Vite middleware mode on port 3000.
- **Production Workflow:** \`npm run build\` generates the static client in \`dist/\` and bundles \`server.ts\` into \`dist/server.cjs\` via esbuild.

---

## 2. API Endpoints Reference
The backend currently exposes the following REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| \`GET\` | \`/api/health\` | Health check and server timestamp. |
| \`POST\` | \`/api/membership\` | Registers student membership applications (USN, email, domain track). |
| \`GET\` | \`/api/membership/stats\` | Returns aggregated applicant counts and domain distribution. |
| \`POST\` | \`/api/contact\` | Submits direct student or department inquiries. |

---

## 3. Database Migration Roadmap (Moving from Memory to Cloud DB)
Currently, \`server.ts\` stores submissions in a typed in-memory array. To persist records permanently across restarts:

### Option A: MongoDB (Mongoose)
1. \`npm install mongoose\`
2. Connect to MongoDB Atlas:
\`\`\`typescript
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
\`\`\`

### Option B: PostgreSQL (Prisma or Drizzle ORM)
1. \`npm install @prisma/client prisma\`
2. Define \`schema.prisma\`:
\`\`\`prisma
model Membership {
  id        String   @id @default(uuid())
  fullName  String
  usn       String   @unique
  email     String
  domain    String
  createdAt DateTime @default(now())
}
\`\`\`

### Option C: Firebase Firestore
1. Provision via Firebase Console.
2. Initialize Firebase Admin SDK and write to collection \`applications\`.

---

## 4. Running the Full Stack App
\`\`\`bash
# Install dependencies
npm install

# Run full-stack dev server (both Frontend and Express backend on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
\`\`\`
`,
    },
    'package.json': {
      path: 'package.json',
      language: 'json',
      content: `{
  "name": "agentblazer-sjec-cse",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs"
  },
  "dependencies": {
    "express": "^4.21.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "canvas-confetti": "^1.9.4",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "tsx": "^4.21.0",
    "esbuild": "^0.25.0",
    "typescript": "^7.0.2",
    "vite": "^8.3.0"
  }
}`,
    },
  };

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Add all project files (frontend & backend)
      zip.file('src/App.tsx', files['App.tsx'].content);
      zip.file('src/components/PhoenixHero.tsx', files['PhoenixHero.tsx'].content);
      zip.file('src/components/IntroScreen.tsx', files['IntroScreen.tsx'].content);
      zip.file('src/data.ts', files['data.ts'].content);
      zip.file('src/types.ts', files['types.ts'].content);
      zip.file('server.ts', files['server.ts'].content);
      zip.file('docs/BACKEND_GUIDE.md', files['BACKEND_GUIDE.md'].content);
      zip.file('package.json', files['package.json'].content);
      zip.file('README.md', `# AgentBlazer Club - SJEC CSE
Autonomous & Agentic AI Systems student initiative at Department of Computer Science & Engineering, St Joseph Engineering College, Mangaluru.

## Full-Stack Architecture
- **Frontend:** React 19, TypeScript, Tailwind CSS, Motion animations
- **Backend:** Node.js, Express, TypeScript, Vite middleware mode

## Setup & Run
\`\`\`bash
npm install
npm run dev
\`\`\`
Visit http://localhost:3000 to launch the application.

## Production Build & Start
\`\`\`bash
npm run build
npm run start
\`\`\`
`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agentblazer-sjec-cse-source-code.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const selectedFile = files[selectedFileName] || files['App.tsx'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Ambient radiant halo */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-600/35 via-cyan-500/35 to-blue-500/25 blur-[120px] pointer-events-none animate-pulse" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden border-2 shadow-2xl flex flex-col z-10 ${
          isFrost
            ? 'bg-white border-sky-400 text-slate-900 shadow-[0_0_50px_rgba(14,165,233,0.5)]'
            : isInferno
            ? 'bg-[#140803] border-orange-500 text-amber-50 shadow-[0_0_60px_rgba(249,115,22,0.6)]'
            : 'bg-[#0f071e] border-cyan-400 text-white shadow-[0_0_60px_rgba(6,182,212,0.8),0_0_120px_rgba(168,85,247,0.5)]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit bg-black/10 dark:bg-black/30">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight">Source Code Explorer</h3>
              <p className="text-xs opacity-75 font-mono">AgentBlazer Club • Full Stack Repository</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Full Source ZIP */}
            <button
              id="download-source-zip-btn"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer border shadow-sm ${
                isFrost
                  ? 'bg-sky-600 hover:bg-sky-700 text-white border-sky-500'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white border-white/20'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Archiving...' : 'Download .ZIP'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/20 text-inherit transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: File list sidebar + Code viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
          
          {/* File sidebar */}
          <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-inherit p-3 space-y-1 bg-black/5 dark:bg-black/20 overflow-y-auto shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-60 px-3 py-1 font-semibold flex items-center gap-1.5">
              <Folder className="w-3 h-3" />
              <span>Project Files</span>
            </div>
            {Object.keys(files).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFileName(fileName)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                  selectedFileName === fileName
                    ? isFrost
                      ? 'bg-sky-100 text-sky-900 font-bold'
                      : 'bg-purple-900/50 text-cyan-300 font-bold'
                    : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/5'
                }`}
              >
                <span>{fileName}</span>
                <span className="text-[10px] opacity-60 uppercase">{files[fileName].language}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#05030a] text-gray-200 overflow-hidden">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0a0614] text-xs font-mono">
              <span className="text-gray-400">{selectedFile.path}</span>
              <button
                onClick={() => handleCopy(selectedFileName, selectedFile.content)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {copiedFile === selectedFileName ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <pre className="flex-1 p-4 text-xs font-mono overflow-auto leading-relaxed text-purple-100/90 whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-inherit bg-black/10 dark:bg-black/20 text-xs font-mono flex items-center justify-between opacity-80">
          <span>React 19 • Vite • Tailwind CSS • TypeScript</span>
          <span className="text-cyan-400">Full source code generated & verified</span>
        </div>
      </div>
    </div>
  );
};
