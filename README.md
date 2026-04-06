# DermScan AI 🩺
### AI-Powered Diagnostic Support Tool for Common Skin Conditions
**AI-powered skin health for 1.4 billion Indians — free, in regional languages, on 2G.**

---

## 📋 Executive Summary
DermScan AI is a free, regional-first, AI-powered mobile diagnostic support tool designed to address the severe shortage of dermatological care access across rural and semi-urban India. Built for the **NextGen 2026 Hackathon (PS-18)**, DermScan AI enables any user with a smartphone — even on a 2G connection — to receive a preliminary skin condition assessment in under 8 seconds.

### Key Statistics:
- **1 in 4**: Indians suffer from a skin condition (ICMR).
- **1:150K**: Dermatologist-to-patient ratio in rural India.
- **8 Seconds**: From symptoms to preliminary assessment.
- **2G Ready**: Images compressed to <200KB client-side.

---

## ✨ Key Features (45+ Capabilities)

### 📸 Core Pipeline
- **Smart Capture**: AI-guided photo capture with distance circle overlay and lighting tips.
- **Quality Check**: Automatic blur and dark-image rejection.
- **2G Optimization**: Client-side Canvas API compression (4MB → 180KB).
- **Adaptive Quiz**: 5-question symptom quiz with body area tap diagram.
- **Input Methods**: Duration sliders, Yes/No taps, and Hindi voice input for allergies.

### 🧠 AI & Diagnosis
- **Gemini 1.5 Flash**: Multimodal fusion of image + structured symptom data.
- **Broad Coverage**: 400+ skin conditions supported.
- **Skin Tone Optimization**: Specifically tuned for Fitzpatrick IV–VI (brown/dark) skin tones.
- **Triage System**: RED/AMBER/GREEN urgency levels (NOW / Week / Home).

### 🌍 Language & Accessibility
- **Regional Support**: Hindi, Tamil, Gujarati, Marathi, and English.
- **Zero Literacy Barrier**: Tap-based UI and voice input support.
- **Low-End Ready**: Optimized for ₹5,000 Android phones.

### 🏥 Care Pathway
- **Doctor Finder**: Google Maps integration filtered for dermatologists and PHCs.
- **WhatsApp Share**: One-tap structured report sharing with doctors/family.
- **Scan History**: Track skin condition progress over time using local IndexedDB storage.

### 🔒 Privacy & Compliance
- **Stateless Privacy**: Zero server-side image storage.
- **Compliance**: DPDP Act 2023 compliant architecture.

---

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4.0.
- **Animations**: Motion (formerly Framer Motion).
- **Icons**: Lucide React.
- **AI Engine**: Google Gemini 1.5 Flash API.
- **Database**: IndexedDB (via `idb` library) for local history.
- **Localization**: i18next.
- **Deployment**: Vercel / Cloud Run.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Gemini API Key (from Google AI Studio)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/dermscan-ai.git
   cd dermscan-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛣 User Journey
1. **Home**: Select language and start a new scan or view history.
2. **Capture**: Follow the on-screen guide to take a clear photo.
3. **Quiz**: Answer 5 quick questions about the condition.
4. **Analysis**: AI processes the data (optimized for 2G).
5. **Result**: View top 3 likely conditions, urgency, and find a nearby doctor.

---

## 👥 Team SXROL (Team #51)
- **Varun Singh** (24MIM10210)
- **Smridhi Narwal** (24BCE11505)
- **Vanya Singhal** (24BCY10046)
- **Vrinda Pareek** (24BSA10260)

---

## 📄 License
This project is licensed under the Apache-2.0 License.

---
*"Your skin speaks. We help you listen — before it's too late."*

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/19a5a8a0-3817-4c6a-a09e-68aa25537653

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
