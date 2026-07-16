# 🌾 KrishiMitra AI Platform

KrishiMitra AI is an intelligent, multi-agent agricultural decision platform designed to empower farmers in maximizing yields, optimizing logistics, and increasing profitability. By integrating real-time market data, micro-climate insights, transport logistics diagnostics, and government scheme eligibility, KrishiMitra AI guides farmers through key agronomy decisions using specialized LangGraph AI agents.

---

## 🌟 Key Features

### 📊 1. Core Control Dashboard
- **Integrated Insights**: A unified hub showing live APMC mandi prices, weather warning indicators, and primary crop cycle suggestions.
- **Micro-Animations & Responsive Styling**: Premium dark-mode layout built with glassmorphic cards and Framer Motion transitions.

### 🤖 2. Interactive AI Agronomist Companion
- **Multi-Modal AI Chats**: Interactive chatbot widget supporting both text input and voice-activated quick commands.
- **Decision Engine**: Integrated agronomy planner to address crop disease analysis, pest treatment strategies, and crop rotation schedules.

### 📈 3. Mandi Price Explorer & Analytics
- **Live APMC Feeds**: Searchable regional APMC price logs with localized updates.
- **Historical Price Charts**: Detailed trend charts utilizing Recharts to track crop price movements over time.

### 🌦️ 4. Micro-Climate Threat Matrix
- **Weather Advisories**: Daily and hourly forecasts tailored to local farming coordinates.
- **Threat Alerts**: Advanced notice system for severe weather patterns (floods, unexpected storms, frost) to minimize risk.

### 🚚 5. Logistics & Transport Route Selector
- **Route Optimizer**: Calculates optimal travel routes and transit times to nearby mandis.
- **Logistics Calculator**: Comprehensive breakdown of vehicle hiring costs, fuel surcharges, and toll estimations to choose the most cost-effective transit option.

### 📋 6. Government Subsidy & Scheme Registry
- **Eligibility Checking**: Interactive eligibility forms designed to instantly verify qualifications for central and regional agricultural schemes.
- **Scheme Details**: Extensive information portal regarding active subsidies, required paperwork, and registration links.

---

## 🛠️ Technology Stack

### Frontend
- **Framework & Language**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS, Tailwind CSS
- **Animations**: Framer Motion
- **Form Management**: React Hook Form with Zod schema verification
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts

### Backend
- **Framework & Language**: FastAPI, Python 3.12
- **Agent Workflow Engine**: LangGraph & LangChain
- **Database (Relational)**: PostgreSQL with asyncpg driver (async operations)
- **ORM & Migrations**: SQLAlchemy 2.0, Alembic
- **Caching & Rate Limiting**: Redis
- **Security**: JWT token generation, BCrypt password hashing

---

## ⚙️ Development Setup & Local Execution

### 🚀 The Easy Way (Windows Script)
A unified launcher `run.bat` is provided in the project root to start all services together. It checks virtual environments, upgrades database schemas, and fires up both development servers.

Simply execute the script:
```powershell
./run.bat
```

---

### 💻 Manual Configuration

#### 1. Backend Server Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy env file and adjust variables (e.g. database credentials):
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations:
   ```bash
   python -m alembic upgrade head
   ```
6. Run the FastAPI server:
   ```bash
   python main.py
   ```
   The backend will be live at `http://localhost:8000`.

#### 2. Frontend React Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be live at `http://localhost:5173` (or fallback to `5174`).

---

## 🔐 Authentication Credentials

To test the application in simulated development mode (without needing the backend database active):
- **Default Fixed Account**:
  - **Email**: `farmer@krishimitra.ai`
  - **Password**: `password123`
- **Registration Flow**:
  - Navigate to the register screen, enter custom details, and register. 
  - The frontend stores registration details in local cache. You can then immediately log in with your custom registered credentials.
  - Failures (e.g. incorrect credentials) immediately display an interactive warning popup overlay.
