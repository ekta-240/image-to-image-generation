# 🏠 Homelytics — AI-Powered Interior Design Platform

Transform your empty rooms into beautifully furnished spaces using AI-powered image generation with ControlNet depth preservation, smart budget planning, and direct purchase links. Optimized for local GPU execution (NVIDIA RTX 3050 6GB).

---

## ✨ Features

### 🎨 AI Room Generation (Image-to-Image)
- **ControlNet + Depth Map**: Preserves your room's walls, windows, and floor structure using Midas depth estimation + ControlNet conditioning
- **Structured Prompts**: Your simple prompt is wrapped in a professional interior-design template for best SD results
- **Local Prompt Enhancement**: Prompts are auto-structured locally (no external API required)
- **Negative Prompt Protection**: Blocks unwanted artifacts (people, cartoon, blurry, wrong architecture, etc.)
- **Furniture Enforcement**: Automatically detects furniture items in your prompt and adds explicit enforcement so nothing is missing
- **Two-Stage Hi-Res Fix**: Stage 1 generates furniture layout → Stage 2 refines details for sharper output
- **Before/After Comparison Slider**: Drag-to-compare your original room vs the AI-furnished result
- **Multiple Styles**: Modern, Contemporary, Minimalist, Industrial, Bohemian, Scandinavian, Traditional, Rustic
- **Room Types**: Living Room, Bedroom, Kitchen, Bathroom, Office, Dining Room, Kids Room, Outdoor

### 🏗️ 2D Layout Generator
- Converts Total Area + Room Count into 4 professional top-down architectural floor plans
- Blueprint-style output using Stable Diffusion v1.5 with layout tokens
- Supports 1 BHK, 2 BHK, 3 BHK, 4 BHK, Studio, and Villa configurations

### 🛋️ Drag & Drop Customization
- Manually place furniture over your uploaded room image
- Rotate, resize, and delete items with real-time selection controls
- Canvas zoom from 50% to 200% for precision

### 💰 Smart Budget Planning
- Budget slider from ₹10,000 to ₹5,00,000
- Priority-based furniture selection for each room type
- Room dimensions input (Length × Width × Height in feet)
- Real-time cost breakdown and budget utilization percentage

### 🛒 E-Commerce Integration
- Direct Amazon & Flipkart purchase links for all 28 furniture items
- Prices in Indian Rupees (₹) based on market averages
- One-click "Buy" buttons in the pricing panel

---

## 📋 Prerequisites

Before starting, make sure you have:

| Requirement | Version | Download Link |
|------------|---------|---------------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) |
| **NVIDIA GPU** | 6GB+ VRAM | RTX 3050 / 3060 / 4060 or better |
| **CUDA Toolkit** | 12.1+ | [NVIDIA CUDA](https://developer.nvidia.com/cuda-downloads) |
| **Git** | Any | [git-scm.com](https://git-scm.com/) |
| **Firebase Project** (optional) | Free | [console.firebase.google.com](https://console.firebase.google.com) |

> **Disk Space**: You need ~10GB free for model downloads (Realistic Vision + ControlNet + Midas).

---

## 🚀 Setup & Installation (Step-by-Step)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ekta-240/image-to-image-generation.git
cd image-to-image-generation
```

---

### Step 2 — Install Frontend Dependencies

```bash
npm install
```

This installs React, Vite, Tailwind CSS, Framer Motion, and all other frontend packages.

---

### Step 3 — Create Python Virtual Environment

```bash
# Create virtual environment in the project root
python -m venv .venv

# Activate it:
# Windows (PowerShell):
.\.venv\Scripts\activate

# Windows (CMD):
.venv\Scripts\activate.bat

# macOS / Linux:
source .venv/bin/activate
```

> ⚠️ Make sure your terminal shows `(.venv)` at the beginning of the prompt line before continuing.

---

### Step 4 — Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- `torch` — PyTorch with CUDA support
- `diffusers` — Stable Diffusion pipelines
- `controlnet_aux` — Midas depth estimator for ControlNet
- `transformers`, `accelerate`, `safetensors` — Hugging Face ecosystem
- `flask`, `flask-cors` — Backend web server
- `Pillow` — Image processing

No API keys are required for the default setup. Models download on the first run.

---

### Step 5 — Firebase Setup (For Drag & Drop Feature)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named **Homelytics**
3. Go to **Firestore Database** → Create Database → Start in test mode
4. Go to **Project Settings** → **Your Apps** → Click the Web (`</>`) icon
5. Copy the `firebaseConfig` object
6. Update `src/firebase.js` with your config:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* PASTE YOUR CONFIG HERE */ };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

> **Firestore data**: The drag & drop library reads from the `furniture` collection. Add documents with fields like `name`, `category`, `price`, `image`, and `links`.

---

## 🛠️ Running the Project

You need **two terminals** — one for the backend and one for the frontend.

### Terminal 1 — Start the Backend (AI Server)

```bash
# From the project root:
cd backend

# Activate virtual environment (if not already active):
# Windows:
..\.venv\Scripts\activate
# macOS/Linux:
source ../.venv/bin/activate

# Start the server:
python app.py
```

**What happens on first run:**
1. Midas depth estimator downloads (~400 MB) ← takes 1-2 minutes
2. ControlNet depth model downloads (~1.4 GB) ← takes 2-3 minutes
3. Realistic Vision V5.1 (SD 1.5 base) downloads (~5 GB) ← takes 5-15 minutes
4. 2D Layout pipeline loads

**Wait until you see this in the terminal:**
```
============================================================
HOMELYTICS BACKEND SERVER
============================================================
Device: cuda
Model: SG161222/Realistic_Vision_V5.1_noVAE
ControlNet: lllyasviel/sd-controlnet-depth
Depth Estimator: Ready
Layout Model: Loaded
============================================================
 * Running on http://127.0.0.1:5000
```

> ⏱️ First run: 10-20 minutes (model downloads). Subsequent runs: ~60 seconds (cached models).

---

### Terminal 2 — Start the Frontend (UI)

```bash
# From the project root (NOT the backend folder):
npm run dev
```

You should see:
```
VITE v5.x.x  ready in 500 ms
  ➜  Local:   http://localhost:3000/
```

---

### Open in Browser

Go to: **http://localhost:3000**

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:3000/ | Landing page |
| AI Generate | http://localhost:3000/ai-generate | Upload room → Generate furnished room |
| Customize | http://localhost:3000/customize | Drag & drop furniture placement |
| Layouts | http://localhost:3000/generate-layout | 2D floor plan generator |

---

## 🎮 How to Use the AI Generation Feature

1. **Upload** an empty room image (PNG, JPG, JPEG, or WEBP)
2. **Select** the room type (Living Room, Bedroom, etc.)
3. **Choose** a design style (Modern, Minimalist, etc.)
4. **(Optional)** Set your budget and click **"Get Budget Suggestions"** — this auto-fills the prompt
5. **Type** your furniture prompt, e.g., `Add a bed, sofa, table, and lamp`
6. Click **"Generate Room Design"**
7. Wait ~45 seconds (RTX 3050) for the two-stage generation
8. View the **Before/After comparison slider** to compare original vs furnished
9. **Download** or **Share** the result
10. Click **"Pricing"** to see estimated furniture costs with Amazon/Flipkart links

---

## 📁 Project Structure

```
homelytics/
├── src/
│   ├── App.jsx                    # Router setup
│   ├── firebase.js                # Firebase initialization
│   ├── index.css                  # Global styles
│   ├── main.jsx                   # React entry point
│   ├── components/
│   │   └── Navbar.jsx             # Navigation bar
│   └── pages/
│       ├── AIGeneration.jsx       # AI room generation with comparison slider
│       ├── DragDropCustomize.jsx  # Canvas-based furniture placement
│       ├── Home.jsx               # Landing page
│       └── LayoutGenerator.jsx    # 2D floor plan generator
├── backend/
│   ├── app.py                     # Flask API: ControlNet generation, prompt parsing, budget API
│   ├── requirements.txt           # Python dependencies
│   ├── uploads/                   # Uploaded images (auto-created)
│   └── generated/                 # Generated images (auto-created)
├── package.json                   # Frontend dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── README.md                      # This file
```

---

## 🔧 AI Pipeline Technical Details

### Models Used
| Model | Purpose | Size |
|-------|---------|------|
| `SG161222/Realistic_Vision_V5.1_noVAE` | Base image generation | ~5 GB |
| `lllyasviel/sd-controlnet-depth` | Room structure preservation | ~1.4 GB |
| `lllyasviel/Annotators` (Midas) | Depth map extraction | ~400 MB |

### Generation Pipeline
```
User Prompt
    ↓
detect_furniture_items() → detects: bed, sofa, table, lamp
    ↓
build_structured_prompt() → wraps in interior design template
    ↓
enforce_furniture_in_prompt() → adds "must contain: bed, sofa, table, lamp"
    ↓
MidasDetector → extracts depth map from uploaded room
    ↓
Stage 1: ControlNet generation (strength=0.70, 50 steps)
    ↓
Stage 2: Hi-res refinement (strength=0.25, 30 steps)
    ↓
Final furnished room image
```

### GPU Memory Optimizations (RTX 3050 6GB)
- `torch.float16` — Half precision to halve VRAM usage
- `enable_model_cpu_offload()` — Moves unused layers to RAM
- `enable_attention_slicing(1)` — Processes attention in slices
- `enable_vae_slicing()` — Decodes VAE in slices

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check — shows model status |
| `POST` | `/api/generate` | Generate furnished room image (multipart form) |
| `POST` | `/api/generate-layout` | Generate 4 floor plan layouts |
| `POST` | `/api/suggest-furniture` | Budget-based furniture suggestions |

---

## 📊 Furniture Library

Furniture items are loaded from the Firestore `furniture` collection. Counts depend on your data.

Example categories:

| Category | Items |
|----------|-------|
| **Seating** | Modern Sofa, Armchair, Recliner, Bean Bag, Bar Stool |
| **Tables** | Coffee Table, Side Table, Dining Table, Console Table, Study Table |
| **Lighting** | Floor Lamp, Table Lamp, Chandelier, Smart Bulb |
| **Bedroom** | Bed, Nightstand, Wardrobe, Dresser, Chest |
| **Storage** | Bookshelf, TV Stand, Cabinet, Shelf |
| **Kitchen** | Refrigerator, Gas Stove, Kitchen Cabinet, Microwave, Dishwasher |
| **Bathroom** | Bathtub, Shower, Sink, Mirror |
| **Decor** | Wall Art, Area Rug, Curtains, Plant, Artificial Plant |

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `CUDA out of memory` | Close other GPU apps. The pipeline uses CPU offload for 6GB cards. |
| `Model download fails` | Check your internet connection. If the model is gated, run `huggingface-cli login` or switch to a local model path. Models are cached in `~/.cache/huggingface/`. |
| `ModuleNotFoundError: controlnet_aux` | Run `pip install controlnet_aux` in your virtual environment. |
| `Port 5000 already in use` | Kill the existing process: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F` |
| `Port 3000 already in use` | Vite will auto-select the next available port (3001, 3002, etc.) |
| Backend shows `Demo mode active` | Either GPU is not available or `USE_LOCAL_MODEL=False`. Check `python -c "import torch; print(torch.cuda.is_available())"` |

---

## 📝 License

This project is for educational purposes (B.Tech final year project).

---

## 🙏 Credits

- [Realistic Vision V5.1](https://huggingface.co/SG161222/Realistic_Vision_V5.1_noVAE) — SG161222
- [ControlNet](https://huggingface.co/lllyasviel/sd-controlnet-depth) — lllyasviel
- [Midas Depth Estimation](https://huggingface.co/lllyasviel/Annotators) — lllyasviel
- [Diffusers](https://huggingface.co/docs/diffusers) — Hugging Face
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
