# AgentBlazer Build Blazer — Phase 2

# AgentBlazer Club Website – SJEC CSE

Official website for the **AgentBlazer Club**, Department of Computer Science & Engineering at **St Joseph Engineering College (SJEC), Mangaluru**.

This project was developed as part of **AgentBlazer Club's Build Blazer – Phase 2**, where our team transformed the assigned design into a functional, interactive and deployed website.

---

## 👥 Team

| Role            | Name                   |
| --------------- | ---------------------- |
| **Team Lead**   | Disha Pai N            |
| **Team Member** | Rhea Michelle Sequeira |
| **Team Member** | Sarosh Shaya Khan      |

---

## 🌟 About the Project

The AgentBlazer Club website serves as a central platform for the **AgentBlazer Club at SJEC CSE**.

The website provides information about the club, its leadership and mentorship council, student members, workshops, events and opportunities for students to get involved.

The project combines a cinematic visual experience with interactive components, responsive layouts and an administrative system.

---

## 🔥 Features

* **Cinematic Phoenix Intro** — A high-impact opening experience using a custom Phoenix video sequence with animated transitions and media cleanup.
* **Member Profile System** — Interactive professional profile modals for Honored Guests, Faculty Advisory Council, Student Officers and Core Working Committee members.
* **Interactive Workshop & Event Gallery** — Displays workshops and events, including GSoC masterclasses, Prompt Engineering activities and security workshops.
* **Multi-Theme Support** — Dynamic visual themes including **Violet, Inferno and Frost**.
* **Student Join Application** — Interactive application interface for undergraduate students interested in joining the club.
* **Admin Dashboard** — Dedicated administrative interface for managing and viewing website-related information.
* **Responsive Design** — Optimized for desktop and mobile screen sizes.

---

## 🦅 Cinematic Phoenix Intro

The website features a cinematic Phoenix introduction using the supplied video asset.

The intro:

* Begins with a dark atmosphere and glowing cyan/purple eyes.
* Transitions into the full Phoenix reveal.
* Provides a seamless visual experience while waiting for user interaction.
* Uses a **TAP TO CONTINUE** interaction to enter the main website.
* Pauses and resets the video when the user enters the website.
* Cleans up associated media resources after the intro.

---

## 👤 Member Profile System

The member and leadership section provides interactive profile cards and modal views.

### Features

* **Click-Only Activation** — Profiles open through user interaction.
* **Responsive Layout** — Side-by-side profile layout on desktop and stacked layout on mobile.
* **Dismissal Controls** — Modals can be closed using the close button, backdrop click or `Escape` key.

---

## 🛠️ Technologies Used

* **React 19** — Component-based user interface
* **TypeScript** — Static typing and structured application development
* **Vite** — Frontend build tool and development server
* **Tailwind CSS v4** — Responsive utility-first styling
* **Motion** — Animations and UI transitions
* **Lucide React** — Interface icons
* **Node.js** — Server-side runtime
* **Express** — Backend/server foundation
* **Supabase** — Backend/database integration
* **Git & GitHub** — Version control
* **Vercel** — Production deployment

---

## 📁 Project Structure

```text
├── public/
│   ├── assets/
│   │   └── 2.mp4               # Cinematic Phoenix Intro video
│   ├── events/                 # Workshop event gallery photos
│   └── people/                 # Member profile photos
│
├── src/
│   ├── components/
│   │   ├── IntroScreen.tsx     # Cinematic Phoenix Intro
│   │   ├── AboutSection.tsx     # About & member profiles
│   │   ├── PhoenixHero.tsx      # Hero section
│   │   ├── EventsSection.tsx    # Workshops & events
│   │   ├── JoinSection.tsx      # Student application
│   │   └── Navbar.tsx           # Navigation & theme switcher
│   │
│   ├── data.ts                  # Member and event data
│   ├── types.ts                 # TypeScript interfaces
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Application entry point
│
├── supabase/                    # Supabase configuration and database schema
├── server.ts                    # Express server
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

---

## 🎨 Design Reference

The website was developed based on the **assigned Phase 2 design reference** for the AgentBlazer Build Blazer event.

**Figma Design:**
Add the assigned Figma link here if required by the organizers.

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/saroshkhan270-ux/agentblazer-buildblazer.git
cd agentblazer-buildblazer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file using `.env.example` as a reference.

Do not commit private API keys or sensitive credentials.

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the website

Open the local URL provided by the development server in your browser.

---

## 📦 Production Build

To create a production build:

```bash
npm run build
```

---

## 🌐 Deployment

### Live Website

https://agentblazer-buildblazer-kh4p6qjwt-sarosh-k.vercel.app/

### Admin Panel

https://agentblazer-buildblazer-kh4p6qjwt-sarosh-k.vercel.app#admin

### GitHub Repository

https://github.com/saroshkhan270-ux/agentblazer-buildblazer

---

## 🔐 Admin Panel Login

The project includes a dedicated admin dashboard.

**Admin Panel:**
https://agentblazer-buildblazer-kh4p6qjwt-sarosh-k.vercel.app#admin

**Username:** `admin`

**Password:** `agentblazer@sjec2026`

These credentials are provided for project demonstration and evaluation.

---

## 🔄 Git Workflow

### Check project changes

```bash
git status
```

### Add changes

```bash
git add .
```

### Commit changes

```bash
git commit -m "Update README with project and team details"
```

### Push changes to GitHub

```bash
git push origin main
```

---

## 🚢 Deployment Workflow

1. Make changes locally.
2. Test the website.
3. Run `git status`.
4. Add the changes using `git add .`.
5. Commit the changes using `git commit`.
6. Push the changes using `git push origin main`.
7. Verify the Vercel deployment.
8. Open the live website and confirm that the deployed version works correctly.

---

## 📋 Rules

* Fork the original AgentBlazer repository.
* Follow the assigned design as closely as possible.
* Commit changes regularly.
* Keep the project organized and documented.
* Test major changes before deployment.
* Do not commit private API keys or sensitive backend credentials.
* Verify the production website after deployment.
* Submit the GitHub repository and live deployment links through the official submission process.

---

## 🏆 AgentBlazer Build Blazer — Phase 2

Developed by the **AgentBlazer Club Website Team – SJEC CSE**.

**Team Lead:** Disha Pai N
**Team Members:** Rhea Michelle Sequeira, Sarosh Shaya Khan
