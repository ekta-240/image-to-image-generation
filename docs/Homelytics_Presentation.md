# Homelytics – Complete Project Documentation

## Table of Contents
- Executive Summary
- System Architecture  
- Frontend (React + Vite)
- Backend (Flask + Stable Diffusion)
- Request–Response Flow
- Smart Pricing & Budget System
- Drag & Drop Customization
- Daily Runbook / Demo Script
- Security, Limits, and Trade-offs
- Alternatives Considered
- Q&A Backup Slides
- Appendix: Commands & New Features

---

## Executive Summary
Homelytics is an AI-powered interior design platform with two ways to design rooms:
- AI Generation: Upload a room photo + get smart budget-based furniture suggestions → AI generates a furnished image with automatic pricing and purchase links.
- Drag & Drop: Manually customize by placing furniture on your room image with live pricing.

**New Features:**
- 💰 Budget-based furniture suggestions (₹10,000 - ₹5,00,000)
- 📏 Room dimension inputs (Length × Width × Height in feet)
- 🛒 Purchase links (Amazon & Flipkart) for all furniture items
- 🎯 Smart auto-prompt from budget suggestions

The backend runs locally on Windows with RTX GPU (Flask + Stable Diffusion), and the frontend runs on Vite dev server.

---

## System Architecture

- Frontend
  - React 18 + Vite 5 on Windows (localhost:3002)
  - Pages: Home, AI Generation (`AIGeneration.jsx`), Drag & Drop Customize
  - Axios for HTTP requests; Framer Motion for animations; Tailwind CSS for styling
  - New: Budget slider, room dimensions inputs, purchase link buttons
- Backend
  - Flask 3.0 API (Python) running locally on Windows
  - RTX 3050 6GB GPU with CUDA 12.3, model CPU offload optimization
  - Diffusers Stable Diffusion model: `SG161222/Realistic_Vision_V5.1_noVAE`
  - Endpoints: 
    - `/api/generate` (img2img transformation)
    - `/api/suggest-furniture` (budget-based furniture recommendations)
    - `/api/estimate-price` (pricing with purchase links)
- Connectivity
  - Backend: `http://localhost:5000`
  - Frontend: `http://localhost:3002`

Diagram:
Browser (React on :3002) → HTTP Request → Flask Backend (:5000 on RTX 3050) → Stable Diffusion (GPU) → Response → Browser displays generated image

---

## Frontend (React + Vite)
- Tech stack
  - React 18, Vite 5, React Router, Axios, Framer Motion, Tailwind CSS
  - Lucide React icons for modern UI elements
- Primary flow (AIGeneration)
  - Backend URL: `const BACKEND_URL = 'http://localhost:5000'`
  - **Budget Workflow:**
    1. User sets budget (₹10,000 - ₹5,00,000) and room dimensions (L×W×H in feet)
    2. Click "Get Budget Suggestions" → calls `/api/suggest-furniture`
    3. Backend returns optimized furniture list with prices and purchase links
    4. Auto-populates prompt with suggested items (using database keys for exact matching)
    5. User can edit prompt or click "Generate with Suggested Items"
  - **Generation:**
    - Build `FormData` with uploaded image + form fields (room type, style, prompt)
    - `axios.post(BACKEND_URL + '/api/generate', formData)` → await JSON { image(base64), pricing }
    - Render generated image; show pricing breakdown with Amazon/Flipkart purchase buttons
- Landing page
  - Clear explanation of two modes: AI Generation vs Drag & Drop
  - Before/After visualization for both methods
  - Inspiration Gallery with authentic examples

---

## Backend (Flask + Stable Diffusion)
- Flask 3 + CORS enabled
- Stable Diffusion (img2img) pipeline with GPU acceleration (PyTorch CUDA)
- **Hardware:**
  - RTX 3050 6GB with VRAM optimization (model CPU offload, attention slicing, FP16)
  - CUDA 12.3, Driver 546.18
- **Optimized Settings for Structure Preservation:**
  - strength = 0.65 (preserves 35% of original image structure - walls, layout, perspective)
  - guidance_scale = 15.0 (balanced prompt following)
  - num_inference_steps = 70 (high quality generation)
- **Endpoints:**
  1. **POST `/api/suggest-furniture`** - Budget-based recommendations
     - Input: room_type, budget, dimensions (optional)
     - Logic: Priority-based greedy algorithm selects furniture for each room type
     - Returns: { items[], total_cost, budget_utilization%, area_sqft }
  2. **POST `/api/estimate-price`** - Enhanced pricing with purchase links
     - Input: prompt + detected furniture
     - Logic: Case-insensitive keyword matching with underscore variants support
     - Returns: { total_estimate, items[{name, price, links: {amazon, flipkart}}] }
  3. **POST `/api/generate`** - Image generation
     - Steps: Read multipart form → resize image (512x512) → build prompt → run SD pipeline → pricing → return base64 image + pricing

## Request–Response Flow (Step-by-Step)

**Budget Suggestions Flow:**
1) User opens `http://localhost:3002` → navigates to AI Generation page
2) User sets budget slider (e.g., ₹150,000) and selects room type (e.g., Bedroom)
3) Optionally inputs room dimensions: 15ft × 12ft × 10ft
4) Clicks "Get Budget Suggestions"
5) Frontend → `axios.post('http://localhost:5000/api/suggest-furniture', {room_type, budget, dimensions})`
6) Backend runs priority-based algorithm → selects items fitting budget
7) Returns JSON: `{suggestions: {items[], total_cost, budget_utilization%, remaining_budget, area_sqft}}`
8) Frontend displays furniture list with prices and Amazon/Flipkart links
9) Auto-fills prompt field with database keys (e.g., "bed, nightstand, table_lamp, rug")

**AI Generation Flow:**
1) User uploads `bedroom.jpg`
2) Reviews auto-filled prompt (or manually types: "sofa, coffee table, lamp")
3) Clicks "Generate Room Design"
4) Frontend → `axios.post('http://localhost:5000/api/generate', FormData{image, prompt, room_type, style})`
5) Backend receives multipart form → extracts image and parameters
6) Resizes image to 512×512 → builds full prompt with style/room context
7) Runs Stable Diffusion pipeline on RTX 3050 GPU (~20-30 seconds)
   - Uses strength=0.65 to preserve room structure
   - Uses guidance=15.0 to follow prompt accurately  
   - Runs for 70 steps for high quality
8) Estimates pricing using keyword matching → detects "sofa", "coffee table", "lamp"
9) Returns JSON: `{image: 'data:image/png;base64,...', pricing: {total, items[]}}`
10) Frontend displays generated image + pricing breakdown with purchase buttons
11) User can download PNG or click Amazon/Flipkart links to buy items

---

## Smart Pricing & Budget System
- **Furniture Database:** 28 items in Indian Rupees (₹)
  - Examples: Sofa ₹107,800 | Table Lamp ₹7,400 | Curtains ₹10,700 | King Bed ₹70,200
- **Purchase Links Database:** Amazon & Flipkart URLs for each item
- **Keyword Matching System:**
  - Case-insensitive matching (converts prompt to lowercase)
  - Multiple keyword variants per item (e.g., 'table_lamp': ['table_lamp', 'table lamp', 'desk lamp'])
  - Underscore support for auto-generated prompts (table_lamp, coffee_table, side_table)
  - Word boundary regex: `r'(?<!\w)keyword(?!\w)'` prevents partial matches
  - Special handling: "artificial plant" vs "plant"
  - Fallback: Custom items default to ₹35,000
- **Room-Type Priorities:** Each room has a priority list (Living Room: sofa, coffee_table, tv_stand, etc.)
- **Budget Algorithm:**
  - Greedy selection: Pick highest-priority items that fit within budget
  - Area calculation: Length × Width in square feet (when dimensions provided)
  - Returns: Item list with keys (for exact matching), prices, purchase links, budget utilization %
- **Price Consistency:** Auto-prompt uses item.key (e.g., "table_lamp") ensuring 100% match with keyword database

---

## Drag & Drop Customization
- User can upload their room background
- Choose items (sofa, chair, lamp, etc.) and place/resize/arrange them
- Live price updates as items are added
- Complements AI Generation; both methods are explained side-by-side on landing page with before/after visuals

---

## Daily Runbook / Demo Script

1) **Start Backend**
   - Open terminal in `c:\homelytics - Copy\backend`
   - Activate virtual environment: `.venv\Scripts\Activate.ps1`
   - Run: `python app.py`
   - Wait for "Model loaded successfully on cuda" message
   - Server runs on `http://localhost:5000`

2) **Start Frontend**
   - Open terminal in `c:\homelytics - Copy`
   - Run: `npm run dev`
   - Open `http://localhost:3002`

3) **Demo Flow**
   - **Budget-Based Generation:**
     1. Set budget slider (e.g., ₹150,000 for bedroom)
     2. Enter room dimensions: Length 15ft × Width 12ft × Height 10ft
     3. Click "Get Budget Suggestions" → shows optimized furniture list
     4. Review suggestions with prices and purchase links (Amazon/Flipkart)
     5. Click "Generate with Suggested Items" → auto-fills prompt
     6. Upload room image → Click "Generate Room Design"
     7. View generated image with pricing breakdown and purchase buttons
   - **Manual Generation:**
     1. Upload room image
     2. Select room type and style
     3. Type custom prompt: "sofa, coffee table, lamp, rug"
     4. Click Generate → view result with pricing

---

## Security, Limits, and Trade-offs
- **Security**
  - Backend runs on localhost:5000 (local network only)
  - For production deployment, use reverse proxy (nginx) with HTTPS
  - Optionally add basic auth or API token checks for API endpoints
- **Limits**
  - **Hardware:**
    - VRAM: 6GB limit (RTX 3050) - optimized with model CPU offload
    - Generation time: ~15-30 seconds per image
    - Single concurrent request at a time
  - **AI Model Limitations:**
    - CLIP 77-token limit: Long prompts get truncated
    - Stable Diffusion can reliably generate 2-4 items per image
    - Some items may not appear if prompt is too complex
- **Trade-offs**
  - **Local Development:** Fast, consistent, full control, but requires RTX GPU hardware
  - **Structure Preservation (strength=0.65):** Better maintains original room layout but may add fewer new items
  - **Price Consistency:** Using database keys ensures 100% accuracy but requires strict keyword matching
  - **VRAM Optimization:** Model CPU offload reduces VRAM usage but slightly increases generation time

---

## Alternatives Considered
- **Cloud Hosting:** AWS/GCP/Azure with GPU instances (reliable, scalable, but $500-2000/month)
- **Serverless GPUs:** Replicate, Banana.dev, RunPod (pay-per-use, but adds API latency)
- **Google Colab + ngrok:** Free GPU but session limits, URL changes on restart
- **Local RTX GPU (Current Choice):** Zero ongoing cost, fast, full control, requires hardware investment

---

## Q&A Backup Slides
- **Why strength=0.65?** → Preserves the original room structure (walls, layout, perspective) while adding furniture. Lower values maintain more of the uploaded image.
- **Why guidance=15.0?** → Balanced between following the prompt and maintaining realistic room structure
- **Why 70 steps?** → Higher quality generation with better detail rendering
- **Why local backend instead of cloud?** → Zero ongoing costs, faster response times, full control over hardware and model
- **Can others access the application?** → Currently localhost-only. For production, deploy on cloud with proper domain and HTTPS
- **How is pricing calculated?** → 28-item database in INR with case-insensitive keyword matching + room-type priorities + budget optimization algorithm
- **Why use item.key instead of item.name?** → Database keys (table_lamp, coffee_table) ensure exact keyword matching for 100% price consistency
- **How does budget suggestion work?** → Greedy algorithm picks highest-priority items for the room type that fit within budget
- **Why Amazon & Flipkart only?** → Pepperfry links were broken/unreliable; focused on 2 major Indian e-commerce platforms
- **What if furniture doesn't appear in generated image?** → AI has limitations; works best with 2-4 main items. Higher strength values add more items but change structure more.
- **Can I edit auto-filled prompts?** → Yes, budget suggestions auto-populate but you can edit the prompt before generating
- **How accurate are room dimensions?** → Currently manual input; used for area calculation and furniture size recommendations

---

## Appendix: Helpful Commands
```powershell
# BACKEND
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Start backend (from backend/ folder)
python app.py

# FRONTEND
# Start frontend (from root folder)
npm run dev

# DEVELOPMENT
# Install Python dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
npm install

# Build frontend for production
npm run build

# Check Python/Node processes
Get-Process | Where-Object {$_.ProcessName -like "*python*" -or $_.ProcessName -like "*node*"} | Format-Table
```

---

## New Features Summary (November 2025)

### 💰 Budget-Based Furniture Suggestions
- **Slider:** ₹10,000 - ₹5,00,000 with live display
- **Algorithm:** Priority-based greedy selection per room type
- **Output:** Optimized furniture list, total cost, budget utilization %, remaining budget

### 📏 Room Dimensions Input
- **Fields:** Length × Width × Height (in feet)
- **Usage:** Area calculation (sq ft), better furniture size recommendations
- **Optional:** Works without dimensions (uses budget only)

### 🛒 Purchase Links Integration
- **Platforms:** Amazon & Flipkart (removed Pepperfry due to broken links)
- **Location:** Budget suggestions display + Pricing breakdown section
- **Direct:** Click to buy button for each furniture item

### 🎯 Auto-Prompt from Budget Suggestions
- **Workflow:** Get suggestions → Auto-fills prompt field → Generate
- **Benefit:** No manual typing, guaranteed price consistency
- **Editable:** Users can modify auto-filled prompts

### 🏗️ Structure Preservation
- **strength=0.65:** Maintains original room architecture (walls, windows, perspective)
- **Use Case:** Transform existing rooms while keeping layout intact
- **Balance:** Adds furniture without drastically changing the uploaded image

### 💯 Price Consistency Fix
- **Issue:** Different prices in suggestions vs pricing sections
- **Solution:** Auto-prompt uses database keys (table_lamp) not display names (Table Lamp)
- **Result:** 100% price accuracy across all sections
