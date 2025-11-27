# 🏠 Homelytics - AI-Powered Room Design Platform

Transform empty rooms into stunning interior designs using AI-powered image generation and smart furniture pricing. Optimized for local GPU execution with NVIDIA RTX 3050 6GB.

## ✨ Features

- **Local GPU AI Generation**: Runs on your NVIDIA GPU (RTX 3050/3060/4060+) - no cloud dependency
- **Smart Furniture Detection**: Automatically detects furniture from your prompt and calculates real costs in ₹ (INR)
- **Enhanced Accuracy**: Advanced prompt engineering ensures all requested items are generated with accurate colors
- **Multiple Styles**: Modern, Contemporary, Minimalist, Industrial, Bohemian, Scandinavian, Traditional
- **Room Types**: Living Room, Bedroom, Kitchen, Bathroom, Office, Dining Room
- **Custom Items Support**: Handles furniture not in database with intelligent fallback pricing
- **Professional UI**: Clean blue theme with minimal animations
- **Download & Share**: Save and share your generated designs

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Python 3.10+**
- **NVIDIA GPU** with 6GB+ VRAM (RTX 3050, 3060, 4060, or better)
- **CUDA 12.1+** ([Download here](https://developer.nvidia.com/cuda-downloads))
- **Hugging Face account** ([Sign up free](https://huggingface.co/join))

### Setup (10 minutes)

**1. Clone Repository**
```bash
git clone https://github.com/ekta-240/image-to-image-generation.git
cd image-to-image-generation
```

**2. Install Frontend Dependencies**
```bash
npm install
```

**3. Start Frontend**
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

**4. Setup Backend (Local GPU)**

Navigate to backend:
```bash
cd backend
```

Create virtual environment:
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

Install dependencies:
```bash
pip install torch==2.1.0 torchvision==0.16.0 --index-url https://download.pytorch.org/whl/cu121
pip install diffusers==0.24.0 transformers==4.35.0 accelerate==0.25.0
pip install flask flask-cors pillow safetensors
```

**5. Start Backend**
```bash
python app.py
```

Wait for: `Model loaded successfully on cuda` (first run downloads ~5GB model)

**6. Generate Designs**
- Visit http://localhost:3000/ai-generate
- Upload a room image
- Type what you want (e.g., "blue sofa, coffee table, TV, artificial plant")
- Click **Generate Room Design**
- Wait ~20-30 seconds for GPU generation

## 📁 Project Structure

```
homelytics/
├── src/
│   ├── components/
│   │   └── Navbar.jsx           # Navigation bar
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── AIGeneration.jsx     # AI room generation
│   │   └── DragDropCustomize.jsx # Furniture customization
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── backend/
│   ├── app.py                   # Flask API with RTX 3050 optimizations
│   ├── requirements.txt         # Python dependencies
│   ├── uploads/                 # User uploaded images (gitignored)
│   └── generated/               # AI generated images (gitignored)
├── docs/
│   ├── LOCAL_GPU_SETUP.md       # Detailed GPU setup guide
│   └── TESTING_GUIDE.md         # Testing scenarios
├── package.json                 # Node dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── README.md                    # This file
```

## 🎨 AI Generation Settings

**Current Configuration (Optimized for RTX 3050 6GB):**
- Model: `SG161222/Realistic_Vision_V5.1_noVAE` (Photorealistic Stable Diffusion)
- Strength: `0.75` (75% transformation - preserves room structure, adds furniture)
- Guidance Scale: `15.0` (Strong prompt adherence for accurate item generation)
- Steps: `60` (High quality generation)
- Resolution: `512x512` (Optimal for 6GB VRAM)
- Precision: `FP16` (Memory efficient)
- Optimizations: CPU offload, attention slicing, VAE slicing

**Memory Optimizations Applied:**
```python
# In backend/app.py
pipe.enable_attention_slicing()           # Reduces VRAM for attention
pipe.enable_vae_slicing()                 # Reduces VRAM for VAE
pipe.enable_model_cpu_offload()           # Offloads to CPU when needed
torch.cuda.empty_cache()                  # Clears GPU cache
```

**Adjusting Settings:**
Edit `backend/app.py` lines 270-295:
```python
strength=0.75,            # 0.1-0.99 (higher = more changes)
guidance_scale=15.0,      # 1-20 (higher = follows prompt more)
num_inference_steps=60    # 20-100 (higher = better quality)
```

## 💰 Smart Pricing (INR - Indian Rupees)

The app automatically detects furniture mentioned in your prompt and calculates costs in ₹:

**Examples:**
- Prompt: "sofa and TV" → Detects: Sofa (₹107,800) + TV (₹66,317) = **₹174,117**
- Prompt: "king bed with nightstands" → Detects: Bed (₹157,600) + Nightstand (₹33,200) = **₹190,800**
- Prompt: "gas stove, kitchen cabinet, refrigerator" → Detects: Gas Stove (₹42,000) + Cabinet (₹83,000) + Refrigerator (₹125,000) = **₹250,000**
- No prompt → Shows default furniture for selected room type
- Unknown items → Auto-assigns ₹35,000 (e.g., "Custom: bamboo chair")

**Supported Furniture (28+ items):**
Sofas, Beds, Tables, Chairs, Desks, Cabinets, TVs, Lamps, Rugs, Shelves, Mirrors, Plants, Curtains, Gas Stoves, Kitchen Cabinets, Refrigerators, Dishwashers, Microwaves, and more.

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
   .\venv\Scripts\activate  # Windows
   ```

2. **Start Backend**
   ```bash
   python app.py
   # Wait for: "Model loaded successfully on cuda"
   ```

3. **Start Frontend (in new terminal)**
   ```bash
   npm run dev
   ```

4. **Generate Designs**
   - Go to http://localhost:3000/ai-generate
   - Upload → Enter detailed prompt → Generate
   - Wait 20-30 seconds

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + Framer Motion
- **Backend**: Flask 3.0.0 + PyTorch 2.1.0 (CUDA 12.1)
- **AI Model**: Realistic Vision V5.1 (SG161222/Realistic_Vision_V5.1_noVAE)
- **GPU**: NVIDIA RTX 3050 6GB (Laptop GPU) - tested and optimized
- **Libraries**: diffusers 0.24.0, transformers 4.35.0, accelerate 0.25.0
- **Currency**: Indian Rupees (₹) with en-IN locale formatting

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

**RTX 3050 6GB Laptop:**
- Model Load Time: ~15 seconds (first run: ~2 minutes with download)
- Generation Time: 20-30 seconds per image (512x512, 60 steps)
- VRAM Usage: ~5.2GB during generation
- Quality: High (guidance 15.0, steps 60)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test on your local GPU setup
5. Submit a pull request

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/ekta-240/image-to-image-generation/issues)
- Check `docs/LOCAL_GPU_SETUP.md` for detailed setup
- Check `docs/TESTING_GUIDE.md` for testing scenarios

## Roadmap

For issues or questions:
- Open an issue on [GitHub](https://github.com/ekta-240/image-to-image-generation/issues)
- Check `docs/LOCAL_GPU_SETUP.md` for detailed setup
- Check `docs/TESTING_GUIDE.md` for testing scenarios

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

**RTX 3050 6GB Laptop:**
- Model Load Time: ~15 seconds (first run: ~2 minutes with download)
- Generation Time: 20-30 seconds per image (512x512, 60 steps)
- VRAM Usage: ~5.2GB during generation
- Quality: High (guidance 15.0, steps 60)

## Roadmap

- [x] Local GPU support (RTX 3050 optimized)
- [x] Indian Rupee (₹) pricing
- [x] Custom furniture item support
- [x] Enhanced prompt accuracy
- [x] Kitchen appliance support
- [ ] User authentication and saved designs
- [ ] 3D room visualization
- [ ] Multi-GPU support
- [ ] Batch generation
- [ ] Higher resolution output (768x768, 1024x1024)
- [ ] Mobile app

## Acknowledgments

- **Stable Diffusion** - AI image generation
- **Hugging Face** - Model hosting and diffusers library
- **Realistic Vision V5.1** - High-quality photorealistic model
- **Tailwind CSS** - Styling system
- **React & Vite** - Frontend framework and tooling
- **NVIDIA** - GPU compute platform (CUDA)

## Contributors

- **ekta-240** - Main developer
- **yuvi-source** - Contributor

---

Built with ❤️ for local GPU-powered interior design

**Hardware Tested:** Acer Nitro V15 (RTX 3050 6GB Laptop GPU, CUDA 12.3)
