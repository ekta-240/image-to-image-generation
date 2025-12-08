# 🏠 Homelytics - AI-Powered Interior Design Platform

Transform your room ideas into stunning visualizations using AI-powered image generation with smart budget planning and direct purchase links. Optimized for local GPU execution with NVIDIA RTX 3050 6GB.

## ✨ Features

### 🎨 AI-Powered Generation
- **Local GPU Processing**: Runs on your NVIDIA GPU (RTX 3050/3060/4060+) - no cloud dependency
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
```bash
cd ..  # back to root folder
npm run dev
```
Frontend runs on: **http://localhost:3002**

**7. Start Designing!**
- Visit http://localhost:3002
- Navigate to "AI Generation"
- **Option A: Budget-Based Generation**
  1. Set budget (₹50,000 - ₹200,000 recommended)
  2. Enter room dimensions (optional): 15ft × 12ft × 10ft
  3. Click "Get Budget Suggestions"
  4. Review furniture list with prices and purchase links
  5. Upload your room image
  6. Click "Generate with Suggested Items" (auto-fills prompt)
  7. Wait 20-30 seconds for AI generation
- **Option B: Manual Generation**
  1. Upload room image
  2. Select room type and style
  3. Type furniture items: "sofa, coffee table, lamp, rug"
  4. Click "Generate Room Design"
  5. View pricing breakdown with purchase links

## 📁 Project Structure

```
homelytics/
├── src/
│   ├── components/
│   │   └── Navbar.jsx           # Navigation bar with routing
│   ├── pages/
│   │   ├── Home.jsx             # Landing page with features showcase
│   │   ├── AIGeneration.jsx     # AI room generation with budget features
│   │   └── DragDropCustomize.jsx # Manual furniture customization
│   ├── App.jsx                  # Main app router
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
├── backend/
│   ├── app.py                   # Flask API (3 endpoints)
│   │                           # - POST /api/suggest-furniture (budget recommendations)
│   │                           # - POST /api/generate (AI image generation)
│   │                           # - GET /api/health (server status)
│   ├── requirements.txt         # Python dependencies
│   ├── uploads/                 # User uploaded images (gitignored)
│   └── generated/               # AI generated images (gitignored)
├── docs/
│   └── Homelytics_Presentation.md # Complete project presentation
├── package.json                 # Node dependencies
├── vite.config.js              # Vite config (port 3002)
├── tailwind.config.js          # Tailwind configuration
├── LAUNCHER.bat                # Windows quick start script
└── README.md                    # This file
```

## 🎨 AI Generation Settings

**Current Configuration (Optimized for RTX 3050 6GB):**
- Model: `SG161222/Realistic_Vision_V5.1_noVAE` (Photorealistic Stable Diffusion)
- **Strength: `0.65`** (Preserves 35% of original room structure - walls, windows, layout)
- **Guidance Scale: `15.0`** (Balanced prompt following while maintaining structure)
- **Steps: `70`** (High quality generation with detailed rendering)
- Resolution: `512x512` (Optimal for 6GB VRAM)
- Precision: `FP16` (Memory efficient)
- Optimizations: Model CPU offload, attention slicing, VAE slicing

**Why These Settings?**
- **Low Strength (0.65)**: Keeps your room's original architecture intact while adding furniture
- **High Guidance (15.0)**: Ensures AI follows your prompt accurately
- **High Steps (70)**: Better quality and detail in generated images

**Memory Optimizations Applied:**
```python
# In backend/app.py
pipe.enable_model_cpu_offload()          # Offloads to CPU when needed (saves 2GB VRAM)
pipe.enable_attention_slicing(1)         # Reduces VRAM for attention mechanism
pipe.enable_vae_slicing()                # Reduces VRAM for VAE decoder
torch.cuda.empty_cache()                 # Clears GPU cache after generation
```

**Adjusting Settings:**
Edit `backend/app.py` around line 565:
```python
strength=0.65,            # 0.3-0.9 (lower = more original structure preserved)
guidance_scale=15.0,      # 7-20 (higher = follows prompt more strictly)
num_inference_steps=70    # 30-100 (higher = better quality, slower)
```

## 💰 Smart Pricing & Budget System

### Furniture Database (28 Items in ₹ INR)
**Living Room:**
- Sofa: ₹107,800 | Coffee Table: ₹29,000 | TV Stand: ₹47,000 | Floor Lamp: ₹12,000
- Armchair: ₹41,400 | Side Table: ₹16,500 | Rug: ₹18,000 | Wall Art: ₹8,500

**Bedroom:**
- King Bed: ₹70,200 | Nightstand: ₹33,200 | Table Lamp: ₹7,400 | Mirror: ₹8,500
- Curtains: ₹10,700 | Bookshelf: ₹43,000

**Kitchen:**
- Refrigerator: ₹72,000 | Gas Stove: ₹42,000 | Kitchen Cabinet: ₹58,000
- Microwave: ₹22,000 | Dishwasher: ₹48,000 | Sink: ₹15,000

**Office:**
- Office Desk: ₹35,000 | Office Chair: ₹28,000

**Dining:**
- Dining Table: ₹65,000 | Dining Chairs: ₹20,000 (set of 4)

**Bathroom:**
- Bathtub: ₹125,000 | Shower: ₹18,000

**Decor:**
- Plants: ₹5,000 | Artificial Plants: ₹3,200

### Budget Suggestion Algorithm
```python
# Priority-based greedy selection
1. User sets budget (₹10,000 - ₹5,00,000)
2. Optionally inputs room dimensions (L×W×H in feet)
3. System picks highest-priority items for selected room type
4. Returns: items[], total_cost, budget_utilization%, remaining_budget
5. Each item includes Amazon & Flipkart purchase links
```

### Automatic Price Detection
**Case-Insensitive Keyword Matching:**
- Prompt: "Sofa, Coffee Table, lamp" → Detects all correctly
- Uses word boundaries to prevent partial matches
- Special handling: "artificial plant" vs "plant"
- Underscore support: "table_lamp", "coffee_table", "side_table"

**Examples:**
- Prompt: "sofa and TV stand" → ₹107,800 + ₹47,000 = **₹154,800**
- Prompt: "king bed with nightstands and lamp" → ₹70,200 + ₹33,200 + ₹7,400 = **₹110,800**
- Prompt: "refrigerator, gas stove, kitchen cabinet" → ₹72,000 + ₹42,000 + ₹58,000 = **₹172,000**
- Unknown item: "bamboo chair" → Fallback: **₹35,000** ("Custom: bamboo chair")

### E-Commerce Integration
**Direct Purchase Links:**
- **Amazon India**: Search links for each furniture item
- **Flipkart**: Alternative shopping links
- **One-Click Access**: Buttons in UI for instant shopping

**Price Consistency:**
- Auto-prompt uses database keys (e.g., `table_lamp`) for 100% matching
- Budget suggestions and pricing sections always show same prices
- No discrepancies between different parts of the app

## 🔧 Troubleshooting

**GPU not detected:**
```bash
nvidia-smi  # Verify GPU is visible
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}, GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else None}')"
```

**CUDA Out of Memory:**
- Close other GPU applications (games, video editing, etc.)
- Reduce resolution in `backend/app.py` (512x512 → 448x448)
- Lower steps (60 → 40)
- Restart backend to clear GPU cache

**Frontend won't start:**
```bash
npm install
npm run dev
```

**"Failed to generate image" error:**
- Check backend is running (should show "Model loaded successfully on cuda")
- Verify http://localhost:5000 is accessible
- Check backend terminal for error logs
- Ensure uploads/ and generated/ folders exist in backend/

**Generation doesn't follow prompt:**
- Use specific, descriptive furniture names (e.g., "large blue L-shaped sofa" not "furniture")
- List all items clearly: "bed, nightstand, lamp, rug"
- Avoid vague terms like "decorate" or "beautify"

**Pricing shows wrong items:**
- Backend uses regex word boundaries for accurate detection
- "table lamp" correctly matches only lamps, not tables
- Custom items default to ₹35,000

**Model download slow:**
- First run downloads ~5GB from Hugging Face
- Requires Hugging Face token (free account)
- Cached at `~/.cache/huggingface/`

## 📝 Daily Workflow

**Every time you want to use the app:**

1. **Activate Python Environment**
   ```bash
   cd backend
   .\.venv\Scripts\activate  # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

2. **Start Backend**
   ```bash
   python app.py
   # Wait for: "✅ Model loaded successfully on cuda"
   # Backend: http://localhost:5000
   ```

3. **Start Frontend (in new terminal)**
   ```bash
   npm run dev
   # Frontend: http://localhost:3002
   ```

4. **Use the Application**
   
   **Method 1: Budget-Based Generation (Recommended)**
   - Go to http://localhost:3002 → Click "AI Generation"
   - Set budget slider (₹50,000 - ₹200,000 works well)
   - Enter room dimensions: 15ft × 12ft × 10ft (optional)
   - Click "Get Budget Suggestions"
   - Review furniture list with prices and purchase links
   - Upload your room image
   - Click "Generate with Suggested Items" (auto-fills prompt)
   - Wait 20-30 seconds
   - View generated image with pricing breakdown
   - Click Amazon/Flipkart buttons to purchase items
   
   **Method 2: Manual Generation**
   - Upload room image
   - Select room type (Living Room, Bedroom, etc.)
   - Select style (Modern, Contemporary, etc.)
   - Type furniture: "sofa, coffee table, floor lamp, rug"
   - Click "Generate Room Design"
   - View result with automatic pricing

5. **Download & Share**
   - Click download button to save as PNG
   - Share your designs on social media

## 🛠️ Tech Stack

**Frontend:**
- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3.3.5 + PostCSS
- **UI Components**: Lucide React (icons), Framer Motion 10 (animations)
- **HTTP**: Axios 1.6.2
- **Routing**: React Router DOM 6.20
- **File Upload**: React Dropzone 14.2.3
- **Image Export**: html2canvas 1.4.1

**Backend:**
- **Framework**: Flask 3.0.0 + Flask-CORS 4.0.0
- **AI Model**: Realistic Vision V5.1 (`SG161222/Realistic_Vision_V5.1_noVAE`)
- **Deep Learning**: PyTorch 2.1.0 (CUDA 12.1)
- **Diffusion**: diffusers 0.24.0, transformers 4.35.0, accelerate 0.25.0
- **Image Processing**: Pillow 10.1.0
- **Model Storage**: safetensors 0.4.1

**Hardware:**
- **GPU**: NVIDIA RTX 3050 6GB (Laptop GPU) - tested and optimized
- **CUDA**: 12.3, Driver 546.18
- **System**: Windows 11, Acer Nitro V15

**Database:**
- **Furniture Prices**: 28 items in-memory dict (Indian Rupees)
- **Purchase Links**: Amazon India + Flipkart URLs
- **Room Priorities**: 6 room types with priority lists

## Future Scope

- Drag and Drop

## 🎯 GPU Requirements

**Minimum:**
- NVIDIA RTX 3050 6GB (tested)
- CUDA 12.1+
- 8GB System RAM

**Recommended:**
- NVIDIA RTX 3060 12GB or better
- CUDA 12.1+
- 16GB System RAM

**Not Supported:**
- CPU-only (extremely slow, not recommended)
- AMD GPUs (requires ROCm, not tested)
- Intel Arc GPUs (requires DPC++, not tested)

## 📊 Performance Benchmarks

**RTX 3050 6GB Laptop (Acer Nitro V15):**
- Model Load Time: ~8-15 seconds (first run: ~3 minutes with 5GB download)
- Generation Time: 20-30 seconds per image (512x512, 70 steps)
- VRAM Usage: ~5.5GB during generation (with CPU offload optimization)
- Quality: High (strength 0.65, guidance 15.0, steps 70)
- Budget Suggestions: < 1 second response time
- Price Estimation: < 500ms response time

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test on your local GPU setup
5. Submit a pull request

## 💬 Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/ekta-240/image-to-image-generation/issues)
- Check `docs/Homelytics_Presentation.md` for complete documentation
- Email: ekta-240@github (repository owner)

## 🗺️ Roadmap

**Completed Features:**
- [x] Local GPU support (RTX 3050 6GB optimized)
- [x] Indian Rupee (₹) pricing with 28 furniture items
- [x] Budget-based furniture suggestions (₹10K - ₹5L)
- [x] Room dimension inputs (L×W×H in feet)
- [x] Purchase links (Amazon India + Flipkart)
- [x] Auto-prompt from budget suggestions
- [x] Case-insensitive keyword matching
- [x] Structure preservation (strength=0.65)
- [x] Custom furniture fallback pricing
- [x] Kitchen appliance support
- [x] Priority-based room furnishing algorithm

**Upcoming Features:**
- [ ] User authentication and saved designs
- [ ] Design history and favorites
- [ ] 3D room visualization preview
- [ ] AR room preview (mobile)
- [ ] Multi-GPU support for faster generation
- [ ] Batch generation (multiple styles at once)
- [ ] Higher resolution output (768x768, 1024x1024)
- [ ] ControlNet integration (better structure control)
- [ ] Fine-tuning for Indian interior styles
- [ ] Mobile app (React Native)
- [ ] Real furniture price API integration
- [ ] Social sharing features

## Acknowledgments

- **Stable Diffusion** - AI image generation
- **Hugging Face** - Model hosting and diffusers library
- **Realistic Vision V5.1** - High-quality photorealistic model
- **Tailwind CSS** - Styling system
- **React & Vite** - Frontend framework and tooling
- **NVIDIA** - GPU compute platform (CUDA)

---

**Hardware Tested:** Acer Nitro V15 (RTX 3050 6GB Laptop GPU, CUDA 12.3)
