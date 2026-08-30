# CampusFix AI — Intelligent Campus Complaint Management & Routing Platform

> *"Report it. AI routes it. Campus fixes it."*

---

## 1. Problem Statement

In colleges and universities, students frequently encounter campus infrastructure or service issues (e.g. WiFi dead zones, broken classroom projectors, hostel plumbing leaks, lab workstation hardware failures). However:
- Students rarely know which administrative department or technician is responsible.
- Urgent or hazardous issues (e.g., electrical sparks, water bursts) get lost in bureaucratic queues.
- Administrators receive duplicated, unstructured tickets without severity prioritization.
- Resolution progress is opaque to students.

---

## 2. Solution: CampusFix AI

**CampusFix AI** is an AI-powered college grievance routing and lifecycle management platform. 

Students simply describe their problem in plain language. The system's AI engine automatically:
1. **Classifies** the grievance category (Classroom, Laboratory, Hostel, WiFi / Network, Infrastructure, etc.)
2. **Detects priority level** (`Low`, `Medium`, `High`, `Critical` with hazard detection)
3. **Identifies and assigns** the responsible department (IT Support, Facilities, Electrical, AV Support, Hostel Admin, etc.)
4. **Generates an executive summary** of the core issue
5. **Suggests concrete resolution actions** for campus technicians

Administrators get a real-time portal to manage complaint lifecycles (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`), assign specific personnel, record resolution notes, and track campus-wide metrics.

---

## 3. Core Features

### Student Portal
- **Fast Complaint Submission**: Clean form with student details, location, category, and issue description.
- **Interactive Demo Presets**: 1-click loading of common real-world campus complaint scenarios.
- **AI Triage on Demand**: Instant analysis using Google Gemini or deterministic fallback.
- **Student Dashboard**: Live KPI counters (Total, Pending, In Progress, Resolved) and ticket history.
- **Visual Status Timeline**: Real-time 6-stage lifecycle progress tracker for every ticket.

### Administrative Control Center
- **Directory & Multi-Filter**: Search by keyword or filter by Category, Priority, and Status.
- **Status Lifecycle Workflow**: Transition tickets across all 6 stages with timestamp tracking.
- **Technician Assignment**: Allocate specific staff leads (e.g., IT Network Lead, Plumbing Specialist).
- **Resolution Audit Trail**: Document parts replaced, actions taken, and closing notes.
- **Demo Seed Control**: 1-click database reset with pre-populated campus scenarios.

---

## 4. AI Engine Architecture & Fallback Resiliency

CampusFix AI includes a dual-engine AI pipeline ensuring **100% operational uptime**:

```
                              ┌────────────────────────┐
                              │ Student Complaint Text │
                              └───────────┬────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Has Valid GEMINI_API_KEY in .env?│
                         └──────────────┬──────────────────┘
                                        │
                       ┌────────────────┴────────────────┐
                  YES  │                                 │ NO / API Error
                       ▼                                 ▼
         ┌───────────────────────────┐     ┌───────────────────────────┐
         │  Google Gemini 1.5 Flash  │     │  Deterministic AI Engine  │
         │  (Structured JSON schema) │     │  (Exact Rule & Regex NLP) │
         └─────────────┬─────────────┘     └─────────────┬─────────────┘
                       │                                 │
                       └────────────────┬────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ Structured Output:                        │
                  │ - Category (e.g. WiFi / Network)          │
                  │ - Priority (Low / Medium / High / Critical│
                  │ - Responsible Department (e.g. IT Support)│
                  │ - AI Summary                              │
                  │ - Suggested Action Plan                   │
                  └───────────────────────────────────────────┘
```

### Deterministic Fallback Rules
- **Department Routing**:
  - `wifi`, `internet`, `network`, `router` → **WiFi / Network** / **IT Support**
  - `computer`, `lab`, `system`, `terminal` → **Laboratory** / **Lab Technician**
  - `water`, `pipe`, `leak`, `plumbing`, `tap` → **Infrastructure** / **Maintenance & Plumbing**
  - `electrical`, `power`, `spark`, `shock`, `ac` → **Infrastructure** / **Electrical Maintenance**
  - `hostel`, `room`, `mess`, `warden` → **Hostel** / **Hostel Administration**
  - `bus`, `transport`, `shuttle` → **Transportation** / **Transport Department**
  - `projector`, `classroom`, `podium`, `mic` → **Classroom** / **AV Support & Facilities**
  - `clean`, `garbage`, `trash`, `dustbin` → **Cleanliness** / **Sanitation & Housekeeping**
  - `book`, `library`, `journal` → **Library** / **Library Administration**
- **Priority Detection**:
  - `danger`, `fire`, `electrical`, `emergency`, `unsafe`, `spark`, `flood` → **Critical**
  - `not working`, `broken`, `multiple students`, `urgent`, `exam`, `leak` → **High**
  - Standard complaints → **Medium**
  - `suggestion`, `feedback`, `idea`, `minor`, `preference` → **Low**

---

## 5. Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide Icons, Pure Modern Vanilla CSS (Zero heavy UI framework overhead)
- **Backend**: Node.js, Express.js (ES Modules, RESTful API architecture)
- **Database**: MongoDB with Mongoose + Automatic In-Memory Fallback Store (works without database installation)
- **AI Integration**: Google Gemini API (`gemini-1.5-flash`) with structured JSON mode + Deterministic Rule Analyzer

---

## 6. Project Structure

```
campusfix-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAnalysisCard.jsx    # Displays AI results & re-analyze trigger
│   │   │   ├── FallbackBanner.jsx    # System status indicator
│   │   │   ├── Navbar.jsx            # Top brand navigation
│   │   │   ├── PriorityBadge.jsx     # Color-coded urgency badges
│   │   │   ├── Sidebar.jsx           # Main portal navigation
│   │   │   ├── StatCard.jsx          # KPI metric cards
│   │   │   ├── StatusBadge.jsx       # 6-stage lifecycle badge
│   │   │   ├── StatusTimeline.jsx    # Stepper visualization
│   │   │   └── Toast.jsx             # Notification toasts
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx    # Administrative triage & status manager
│   │   │   ├── ComplaintDetail.jsx   # Detailed ticket view & AI analysis
│   │   │   ├── ComplaintHistory.jsx  # Grid/Table directory with multi-filters
│   │   │   ├── LandingPage.jsx       # Public landing page with live stats
│   │   │   ├── StudentDashboard.jsx  # Student KPI overview & complaints
│   │   │   └── SubmitComplaint.jsx   # Issue reporting form with presets
│   │   ├── services/
│   │   │   └── api.js                # Frontend API client
│   │   ├── App.jsx                   # Application router & layout
│   │   ├── index.css                 # SaaS design system styles
│   │   └── main.jsx                  # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   │   └── complaintController.js    # Express route handlers & validation
│   ├── models/
│   │   └── Complaint.js              # Mongoose schema
│   ├── routes/
│   │   └── complaintRoutes.js        # REST API route mapping
│   ├── services/
│   │   ├── aiService.js              # Gemini API & deterministic analyzer
│   │   ├── complaintService.js       # Business logic & dual-layer storage
│   │   └── memoryStore.js            # In-memory store with demo seeds
│   ├── .env.example
│   ├── package.json
│   └── server.js                     # Express server entrypoint
├── .gitignore
└── README.md
```

---

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check (MongoDB connection & AI engine state) |
| `GET` | `/api/complaints/stats` | KPI statistics (status breakdown, priority counts, category counts) |
| `POST` | `/api/complaints/seed` | Reset & reload demo complaint scenarios |
| `POST` | `/api/complaints` | Create a new campus complaint |
| `GET` | `/api/complaints` | Fetch complaints (supports `category`, `priority`, `status`, `search`) |
| `GET` | `/api/complaints/:id` | Fetch single complaint by ID |
| `PUT` | `/api/complaints/:id` | Update complaint details |
| `DELETE` | `/api/complaints/:id` | Delete complaint |
| `POST` | `/api/complaints/:id/analyze` | Trigger AI Triage analysis on complaint |
| `POST` | `/api/complaints/:id/status` | Update complaint status, assigned staff, and resolution notes |

---

## 8. Installation & Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- *(Optional)* MongoDB URI (local or MongoDB Atlas)
- *(Optional)* Google Gemini API Key

### Step 1: Clone or Navigate to the Project
```bash
cd campusfix-ai
```

### Step 2: Configure Environment Variables (Optional)
In `backend/`:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` if you have MongoDB or a Gemini API key:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusfix
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If `MONGODB_URI` or `GEMINI_API_KEY` are left blank, CampusFix AI automatically activates the **In-Memory Store** and **Deterministic Rule AI Analyzer** so everything works right out of the box!

### Step 3: Install & Start Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### Step 4: Install & Start Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 9. Demo Walkthrough Script

Follow these steps for an interactive demonstration:

1. **Open Application**: Navigate to `http://localhost:5173`.
2. **Explore Student Dashboard**: Click **"Student Dashboard"** to see live complaint metrics.
3. **Submit a Complaint**:
   - Click **"Report an Issue"**.
   - Select the preset **"📶 WiFi Outage in Block A"** (or type manually):
     - **Title**: `WiFi not working in Block A`
     - **Description**: `Students in Block A are unable to access the college WiFi since morning. Multiple students are affected.`
     - **Location**: `Block A`
     - **Category**: `WiFi / Network`
   - Click **"Submit Complaint"**.
4. **Trigger AI Triage**:
   - On the complaint details page, click **"Analyze with AI"**.
   - Observe the structured AI triage card update with:
     - **Category**: `WiFi / Network`
     - **Priority**: `High`
     - **Department**: `IT Support`
     - **Summary**: `WiFi connectivity is unavailable or degraded in Block A.`
     - **Suggested Action**: `IT support team should inspect the network access points and verify gateway connectivity.`
5. **Admin Portal Workflow**:
   - Click **"Admin Portal"** in the top navigation.
   - Find the newly submitted ticket.
   - Click **"Manage"**.
   - Transition status from `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`.
   - Assign technician: `IT Network Team Lead`.
   - Add resolution note: `Replaced faulty switch in rack 2. WiFi restored with 100Mbps throughput.`
   - Click **"Save Status Update"**.
6. **Verify Dynamic Stats**: Check how dashboard counters update dynamically across the app.

---

## 10. Future Enhancements

- **Push Notifications & SMS/WhatsApp Alerts**: Automatic alerts to students when tickets change status.
- **Multimodal AI Analysis**: Image upload support for photos of broken pipes/projectors analyzed by Gemini Vision.
- **Campus Map Integration**: Interactive heatmap showing issue densities across campus zones.
- **SLA Escalation Timers**: Automatic priority escalation if high/critical issues remain unassigned past 4 hours.
