# AgentBlazer Club Website – SJEC CSE

Official website for the **AgentBlazer Club**, Department of Computer Science & Engineering at **St Joseph Engineering College (SJEC)**, Mangaluru.

---

## 🌟 About

The AgentBlazer Club is a student-led initiative focused on autonomous intelligence, agentic AI frameworks, open-source AI engineering, and hands-on developer workshops. The website serves as the central hub for club inauguration updates, mentorship council listings, member profiles, and workshop event archives.

---

## 🔥 Features

- **Cinematic Phoenix Intro**: A high-impact opening experience powered by the custom Phoenix video sequence (`2.mp4`), featuring glowing eyes reveal, smooth animation transitions, and instant media cleanup upon entering the site.
- **Member Profile System**: Compact professional profile modal system for Honored Guests, Faculty Advisory Council, Student Officers, and Core Working Committee members.
- **Interactive Workshop & Event Gallery**: Detailed event showcases covering hands-on GSoC masterclasses, Prompt Engineering hackathons, and security workshops.
- **Multi-Theme Support**: Dynamic theme engine offering **Violet**, **Inferno**, and **Frost** visual aesthetics.
- **Student Join Application**: Interactive enrollment modal for undergraduate students to join club tracks.

---

## 🦅 Cinematic Phoenix Intro

The website opening studied the visual atmosphere of the supplied Phoenix video (`public/assets/2.mp4`) and integrated it as a cinematic entrance sequence:
- Starts at **2.1s** with dark atmosphere and glowing cyan/purple eyes.
- Transitions at **2.45s–2.5s** into the full Phoenix reveal.
- Loops the glowing Phoenix animation seamlessly while waiting for user interaction.
- Clicking **TAP TO CONTINUE** immediately pauses playback, resets video time, closes Web Audio nodes, and reveals the main club portal with zero residual media execution.

---

## 👤 Member Profile System

The leadership and mentorship popup system provides a clean, responsive modal view:
- **Click-Only Activation**: Modals open strictly on user clicks, preventing accidental hover popups.
- **Responsive Layout**: Desktop side-by-side (`PHOTO | MEMBER INFORMATION`) max-w-xl card and mobile stacked layout.
- **Dismissal Controls**: Closes seamlessly via X button, backdrop clicks, or pressing the `Escape` key.

---

## 🛠️ Technologies Used

- **React 19** – Modern UI library with component architecture.
- **TypeScript** – Full static typing across components, models, and data definitions.
- **Vite** – Next-generation frontend build tool and dev server.
- **Tailwind CSS v4** – Utility-first styling with custom glow effects and responsive layouts.
- **Motion** – Fluid micro-interactions and modal transitions.
- **Lucide React** – Clean vector icons.
- **Express & Node.js** – Server foundation.

---

## 📁 Project Structure

```
├── public/
│   ├── assets/
│   │   └── 2.mp4               # Cinematic Phoenix Intro video
│   ├── events/                 # Workshop event gallery photos
│   └── people/                 # Member profile photos
├── src/
│   ├── components/
│   │   ├── IntroScreen.tsx     # Cinematic Phoenix Intro component
│   │   ├── AboutSection.tsx    # Mentorship council & member profile modal
│   │   ├── PhoenixHero.tsx     # Hero banner section
│   │   ├── EventsSection.tsx   # Workshop events & photo modal
│   │   ├── JoinSection.tsx     # Student application form
│   │   └── Navbar.tsx          # Navigation & theme switcher
│   ├── data.ts                 # Member and event datasets
│   ├── types.ts                # TypeScript interfaces
│   ├── App.tsx                 # Core application layout
│   └── main.tsx                # Application entry point
├── server.ts                   # Express server backend
└── package.json                # Project dependencies & scripts
```

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) (or the port indicated in terminal) in your browser.

4. admin login:
   username🏸:admin
   password:agentblazer@sjec2026
---

## 📦 Production Build

To test or build the project for production deployment:

```bash
npm run build
```

This compiles both the frontend Vite bundle and the Node.js server distribution.
