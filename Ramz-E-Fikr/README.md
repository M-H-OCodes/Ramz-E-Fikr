# Ramz-e-Fikr | رمزِ فکر
### Open Debate & Argumentation Archive · Digital Scholarship & Resource Library

> **"Where thought becomes argument."**
> An open-access digital publication, curated motion database, and academic resource library for competitive parliamentary debate, moral philosophy, and critical inquiry.

---

## 🌟 Overview

**Ramz-e-Fikr (رمزِ فکر)** is a production-grade digital platform engineered for debaters, coaches, adjudicators, and intellectual societies. It provides rigorous pedagogical literature, authentic master textbooks, and structural training resources for international competitive debate formats including:
- **British Parliamentary (BP / WUDC)**
- **World Schools Debating Championships (WSDC)**
- **Asian Parliamentary (AP / Australs)**
- **Lincoln-Douglas & Policy**

---

## ✨ Features

- 📚 **Authentic Master Resource Vault**: Includes digital access, in-app full-manuscript reading, and direct binary download for landmark texts:
  - *Winning the House: Strategy for BP & WSDC Debate* by Shahraiz Chishti & Natasha Faisal (195 pages)
  - *The Next Step: A Guide to First Principles for Idea Junkies* by Tim Sonnreich (Monash Association of Debaters)
  - *Justice: What's the Right Thing to Do?* by Michael J. Sandel (Harvard University)
  - *Eight Theories of Ethics* by Gordon Graham
  - *Ramz-e-Fikr Master Debate Resources Compendium*
- 📝 **In-Depth Scholarship & Articles**: Comprehensive theoretical treatises on the mechanics of weighing, extension formulation, adjudication paradigms, and economic first principles.
- 💾 **Dual-Format Document Export**:
  - Direct binary master PDF download
  - Richly formatted **Microsoft Word (`.doc`)** export (opens natively in Word, Google Docs, Apple Pages)
  - In-app printable study dossier generator
- 🏛️ **Motion Chamber & Sparring Arena**: Curated motion bank categorized by motion type (THW, THBT, THR, THP, Actor), info slides, and interactive 15-minute preparation timer.
- 📖 **The Debate Lexicon**: 60+ competitive debate terms and logical fallacies with definitions, practical examples, and cross-references.
- 🛡️ **Role-Based Access Control**:
  - Super-Admin access reserved for `muhammadhadi.officialwork@gmail.com` with the ability to grant/revoke administrator roles.
  - Normal debater sign-in with OTP email verification.
- 🎨 **Classical Editorial Aesthetics**: Classical typographical hierarchy using *Playfair Display*, *Amiri* (Nastaliq Urdu), and *Plus Jakarta Sans*.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth Engine**: Supabase Client with persistent client-side data store fallback
- **Export Engines**: Binary Blob Streamer + MSO HTML Word Generator

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **bun** or **yarn**

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/ramz-e-fikr.git
cd ramz-e-fikr
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
The compiled static assets will be in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to the `main` branch will automatically build and publish your site!

---

## ☁️ Deploying to Vercel or Netlify

- **Vercel**: Import your GitHub repository on [vercel.com](https://vercel.com). Vercel automatically detects Vite and deploys with zero configuration.
- **Netlify**: Import your GitHub repository on [netlify.com](https://netlify.com). Set the build command to `npm run build` and publish directory to `dist`.

---

## 📄 License & Attribution

All uploaded debate textbooks and materials belong to their respective authors and institutions (Shahraiz Chishti, Natasha Faisal, Tim Sonnreich, Michael J. Sandel, Gordon Graham, Monash Association of Debaters, and LinkedKey). Distributed for educational, non-profit debate training purposes.
