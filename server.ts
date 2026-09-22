import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data storage for applications & contact requests
interface MembershipApplication {
  id: string;
  name: string;
  email: string;
  usn: string;
  year: string;
  department: string;
  track: string;
  interest: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'review';
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const applications: MembershipApplication[] = [
  {
    id: 'AB-2026-9041',
    name: 'Ruben Saldanha',
    email: 'ruben.saldanha@sjec.ac.in',
    usn: '4SO22CS120',
    year: '4th Year',
    department: 'Computer Science & Engineering',
    track: 'Agentic Workflows & Multi-Agent Systems',
    interest: 'Autonomous agent design and LangChain pipeline deployment',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'approved',
  },
  {
    id: 'AB-2026-8812',
    name: 'Stevin Dsouza',
    email: 'stevin.dsouza@sjec.ac.in',
    usn: '4SO22CS145',
    year: '4th Year',
    department: 'Computer Science & Engineering',
    track: 'Model Optimization & Open Source (GSoC)',
    interest: 'Open source LLM fine-tuning and Quantization frameworks',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'approved',
  },
];

const inquiries: ContactInquiry[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  // JSON Body parsing
  app.use(express.json());

  // CORS headers for local/preview safety
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // BACKEND API ROUTES
  // ==========================================

  // 1. Health check & system info
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      server: 'AgentBlazer Club Backend • SJEC CSE',
      version: '1.2.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      activeMembersCount: applications.length + 500, // simulated total membership base
    });
  });

  // 2. Submit new membership application
  app.post('/api/membership', (req, res) => {
    try {
      const { name, email, usn, year, department, track, interest } = req.body;

      if (!name || !email || !usn) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and USN are strictly required.',
        });
      }

      // Generate verified Member ID
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newMemberId = `AB-2026-${randomSuffix}`;

      const newApplication: MembershipApplication = {
        id: newMemberId,
        name: String(name).trim(),
        email: String(email).trim(),
        usn: String(usn).trim().toUpperCase(),
        year: year || '2nd Year',
        department: department || 'Computer Science & Engineering',
        track: track || 'Agentic Workflows & Multi-Agent Systems',
        interest: interest || 'General Autonomous AI Development',
        createdAt: new Date().toISOString(),
        status: 'approved',
      };

      applications.unshift(newApplication);

      return res.status(201).json({
        success: true,
        message: 'Membership application verified and approved!',
        memberId: newMemberId,
        application: newApplication,
        totalEnrolled: applications.length,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown server error';
      return res.status(500).json({ success: false, error: message });
    }
  });

  // 3. Get membership stats & recent roster
  app.get('/api/membership/stats', (req, res) => {
    const trackCounts: Record<string, number> = {};
    for (const app of applications) {
      trackCounts[app.track] = (trackCounts[app.track] || 0) + 1;
    }

    res.json({
      totalRegistered: applications.length,
      tracks: trackCounts,
      recentApplications: applications.slice(0, 5),
    });
  });

  // 4. Submit contact message to CSE Department / Club Executive
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields.',
      });
    }

    const newInquiry: ContactInquiry = {
      id: `INQ-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : 'General Club Inquiry',
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry received by the CSE Department Secretariat.',
      inquiryId: newInquiry.id,
    });
  });

  // ==========================================
  // VITE DEVELOPMENT & PRODUCTION MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: __dirname,
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

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 AgentBlazer Server running at http://127.0.0.1:${PORT}`);
  });
}

startServer();
