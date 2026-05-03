# MindBloom 🌱

MindBloom is a comprehensive, full-stack child psychology and developmental tracking platform. It empowers parents to monitor their child's milestones, complete clinically-inspired developmental screening quizzes, and interact with **Bloom Bot**—an AI-powered, safety-first virtual assistant designed to provide emotional support and activities for children.

## Features

- **Secure Authentication:** Powered by Supabase, allowing secure account creation and login.
- **Parent Dashboard:** A personalized interface tracking the child's daily mood, age-specific milestones, and quiz results.
- **Developmental Screening:** An interactive assessment module to identify behavioral and cognitive milestones.
- **Bloom Bot AI (Gemini):** An intelligent, context-aware chatbot featuring a custom Pink Floral aesthetic. It includes:
  - **Persona Engineering:** Acts as a supportive, non-clinical helper.
  - **Emotion Check-In:** Visual emoji-based mood tracking.
  - **Safety Guardrails:** A backend "Distress Detector" that immediately intercepts crisis keywords and redirects to a safe, clinical resource screen without calling the LLM.
- **Activity Library:** Curated developmental play activities based on the child's mood and age.

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Zustand
- **Routing:** React Router v6
- **Data Fetching:** React Query (TanStack)
- **Styling:** CSS Modules with a unified design system

### Backend
- **Framework:** Node.js + Express
- **AI Integration:** Google Generative AI (Gemini 2.5 Flash)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (JWT)

## Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- A Supabase Project
- A Google Gemini API Key

### 2. Environment Variables
You will need `.env` files in both the frontend and backend directories.
**Backend (`backend/.env`)**
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend (`mindbloom/.env.local`)**
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Installation & Running

Open two terminal windows.

**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend:**
```bash
cd mindbloom
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

## Architecture Highlights
The application features a decoupled architecture. The React frontend handles UI/UX flows and local state, communicating with the Express backend via REST APIs. The backend acts as an orchestrator, securely managing LLM prompts, validating user input against safety protocols, and interacting with Supabase for data persistence. 
