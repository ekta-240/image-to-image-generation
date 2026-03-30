# 🏠 Homelytics - AI-Powered Interior Design Platform

Transform your room ideas into stunning visualizations using AI-powered image generation with smart budget planning and direct purchase links. Optimized for local GPU execution with NVIDIA RTX 3050 6GB.

## ✨ Features

### 🎨 AI-Powered Generation
- **Local GPU Processing**: Runs on your NVIDIA GPU (RTX 3050/3060/4060+) - no cloud dependency
- **2D Layout Generator**: Converts Total Area + Room Count input into 4 distinct professional, top-down architectural floor plans in blueprint style using Stable Diffusion v1.5 and a FloorPlan LoRA adapter.
- **Style Enforcement**: Uses Hardcoded layout tokens + LoRA for black-and-white CAD-like lines, room divisions, and clean architectural precision.
- **Hardware Optimization**: Tuned for 6GB RTX 3050 with torch.float16, model CPU offload, attention slicing, and VAE slicing to avoid OOM.
- **Structure Preservation**: Maintains your room's architecture (walls, windows, layout) while adding furniture
- **Multiple Styles**: Modern, Contemporary, Minimalist, Industrial, Bohemian, Scandinavian, Traditional, Rustic
- **Room Types**: Living Room, Bedroom, Kitchen, Bathroom, Office, Dining Room, Kids Room, Outdoor

### 💰 Smart Budget Planning
- **Budget Suggestions**: Get furniture recommendations based on your budget (₹10,000 - ₹5,00,000)
- **Room Dimensions**: Input Length × Width × Height in feet for area calculations
- **Priority-Based Selection**: Algorithm picks essential items first for each room type
- **Budget Utilization**: See real-time breakdown of costs and remaining budget

### 🛒 E-Commerce Integration
- **Purchase Links**: Direct Amazon & Flipkart links for all 28 furniture items
- **Real Pricing**: All prices in Indian Rupees (₹) based on market averages
- **Instant Checkout**: Click to buy buttons for seamless shopping experience

### 🎯 Advanced Features
- **Auto-Prompt**: Budget suggestions automatically fill the prompt field
- **Case-Insensitive Matching**: Robust keyword detection ensures 100% price accuracy
- **Custom Items Support**: Unknown furniture gets ₹35,000 fallback pricing
- **Download & Share**: Save generated designs as PNG images

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Python 3.10+**
- **NVIDIA GPU** with 6GB+ VRAM (RTX 3050, 3060, 4060, or better)
- **CUDA 12.1+** ([Download here](https://developer.nvidia.com/cuda-downloads))
- **Hugging Face account** ([Sign up free](https://huggingface.co/join))

### Setup (15 minutes)

**1. Clone Repository**
```bash
git clone https://github.com/ekta-240/image-to-image-generation.git
cd homelytics
```

**2. Install Frontend Dependencies**
```bash
npm install
```

**3. Setup Backend (Local GPU)**

Navigate to backend:
```bash
cd backend
```

Create virtual environment:
```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

Install dependencies:
```bash
pip install -r requirements.txt
```

**4. Set Hugging Face Token (Required for first-time model download)**
```bash
# Windows PowerShell
$env:HF_TOKEN="your_token_here"

# Linux/macOS
export HF_TOKEN="your_token_here"
```
Get your free token at: https://huggingface.co/settings/tokens

**5. Start Backend**
```bash
python app.py
```

Wait for: `✅ Model loaded successfully on cuda` (first run downloads ~5GB model)
Backend runs on: **http://localhost:5000**

**6. Start Frontend (new terminal)**
🏠 Homelytics - AI-Powered Interior Design Platform
Transform your room ideas into stunning visualizations using AI-powered image generation with smart budget planning, direct purchase links, and a cloud-synced furniture library.

## ✨ Features
### 🎨 AI-Powered Generation
- Local GPU Processing: Optimized for NVIDIA RTX 3050 6GB/3060/4060+ using Stable Diffusion.

- Structure Preservation: Maintains original architecture (walls/windows) via ControlNet-style strength parameters.

- Style & Room Variety: 8 styles and 7 room types for diverse design needs.

### 🛋️ Manual Customization (New!)
- Drag & Drop Workspace: Manually place furniture over your uploaded room image.

- Dynamic Controls: Rotate, resize, and delete items with a real-time selection ring.

- Canvas Zoom: Scale the workspace from 50% to 200% for precision.

### 💰 Smart Pricing & Database
- Firebase Firestore Integration: Furniture library is now synced to the cloud for easy updates.

- 50-Item Library: Expanded 50 items across 8 categories (Seating, Lighting, Office, etc.).

- Live Pricing (₹): Real-time price calculation and budget utilization tracking.

## 🚀 Setup & Installation
1. Prerequisites
- Node.js 18+ & Python 3.10+

- NVIDIA GPU (6GB+ VRAM) with CUDA 12.1+

2. Firebase Database Setup (New)
- Go to the Firebase Console.

- Create a new project named Homelytics.

- In the sidebar, click Firestore Database > Create Database.

- Select Start in test mode (for development) and pick a location.

- Go to Project Settings (gear icon) > Your Apps > Click the Web (</>) icon.

- Copy the firebaseConfig object.

3. Frontend Configuration
- Install Firebase:

```bash
npm install firebase
```

- Create src/firebase.js and paste your config (Copy paste the code from firebase_example.js):

```bash
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* PASTE_YOUR_CONFIG_HERE */ };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```
4. Data Migration (One-Time)
- To move the 50 hardcoded items into your database:

- Create src/Migration.jsx using the Migration_example.jsx script provided in the documentation.

- In App.jsx, temporarily render <Migration /> instead of <Home />.

- Open the browser, click "Push Library to Firestore".

- Important: Once successful, delete Migration.jsx to prevent duplicate data.

## 📁 Project Structure
```bash
homelytics/
├── src/
│   ├── firebase.js              # Firebase initialization
│   ├── pages/
│   │   ├── AIGeneration.jsx     # AI generation module
│   │   └── DragDropCustomize.jsx# Canvas with Firestore data fetching
│   └── Migration.jsx            # Temporary data upload script (Delete after use)
├── backend/
│   ├── app.py                   # Flask API for local AI generation
│   └── requirements.txt         # GPU/AI dependencies
├── public/assets/               # 50+ furniture PNG transparent assets
└── README.md
🛠️ Execution
```

6. Start Backend (AI Model)
```bash
cd backend
.\\.venv\\Scripts\\activate
python app.py
```
- Wait for: ✅ Model loaded successfully on cuda

7. Start Frontend (UI)
```bash
npm run dev
```
- Visit: http://localhost:3002

## 📊 Furniture Library Overview
- The system now fetches 50 items from Firestore including:

- Seating: Modern Sofas, Recliners, Bean Bags, Bar Stools.

- Tables: Coffee, Nesting, Console, and Study Tables.

- Lighting: Floor Lamps, Chandeliers, Smart Bulbs.

- Bedroom/Storage: Wardrobes, Dressers, Chests, and Bookshelves.

- Decor: Wall Art, Area Rugs, Mirrors, and Vases.

## 🔧 AI Calibration
- Settings in backend/app.py for RTX 3050 6GB:

- Strength (0.65): Balance between prompt accuracy and room layout.

- Steps (70): High-detail output.

- Memory: enable_model_cpu_offload() is active to prevent VRAM crashes.

