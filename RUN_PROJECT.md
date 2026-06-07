# 🚀 How to Run Mobile Prediction System

## Prerequisites
- Node.js installed
- npm installed
- Terminal/PowerShell access

---

## Step-by-Step Instructions

### **Step 1: Open Terminal**
Open PowerShell or Command Prompt and navigate to the project root:
```powershell
cd C:\Users\pawan\mobile-prediction-system
```

### **Step 2: Install Dependencies (First Time Only)**
Run this command once to install all required packages:
```powershell
npm run install-all
```
This installs dependencies for both `client/` and `server/`.

---

## Option A: Run Both Frontend & Backend Together (Recommended)

### **Step 3: Start the Full Project**
From the project root, run:
```powershell
npm run dev
```

This launches both services concurrently using `concurrently`:
- **Backend Server**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173` (or `5174` if `5173` is busy)

**Wait for both to start.** You'll see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected (or ⚠️ No MongoDB URI set)

VITE v6.4.3 ready in XXX ms
➜  Local:   http://localhost:5173/
```

Then open your browser and go to: **`http://localhost:5173`**

---

## Option B: Run Services Separately (Advanced)

### **Start Backend Only:**
```powershell
npm run server
```
Or directly:
```powershell
cd server
npm run start
```
Backend runs on: `http://localhost:5000`

### **Start Frontend Only (in a new terminal):**
```powershell
npm run client
```
Or directly:
```powershell
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## Stopping the Project
Press `Ctrl + C` in the terminal to stop the services.

---

## Troubleshooting

### ❌ Port Already in Use
If port `5000` or `5173` is in use:
- Close the conflicting application, or
- Vite will automatically try the next available port (e.g., `5174`)

### ❌ Dependencies Missing
Run again:
```powershell
npm run install-all
```

### ❌ MongoDB Connection Error
- If you see `⚠️ No MongoDB URI set`, the app runs **without persistence** (in-memory only)
- To enable persistence, add `MONGODB_URI` to `server/.env`

### ❌ Chat API Returns "Brain Error"
- Ensure backend is running on port `5000`
- Ensure frontend CORS is allowed (already configured for ports `5173`, `5174`, `3000`)
- Check `server/.env` has `OPENROUTER_API_KEY` set

---

## Environment Setup

### **Backend** (`server/.env`)
```
OPENROUTER_API_KEY=your_api_key_here
AI_MODEL=openai/gpt-4o-mini
PORT=5000
```

### **Frontend** (uses `http://localhost:5000` by default)
No additional setup needed unless you want to use a different API URL.

---

## Quick Summary
| What | Command |
|------|---------|
| **First Time** | `npm run install-all` |
| **Run Everything** | `npm run dev` |
| **Run Backend Only** | `npm run server` |
| **Run Frontend Only** | `npm run client` |
| **Stop Services** | `Ctrl + C` |

---

## Next Steps
1. Run `npm run dev` from project root
2. Wait for both services to start
3. Open `http://localhost:5173` in your browser
4. Start chatting with the AI mobile recommendation system!
