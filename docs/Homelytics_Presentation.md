# Homelytics – End-to-End Project Presentation

## Table of Contents
- Executive Summary
- System Architecture
- Frontend (React + Vite)
- Backend (Flask + Stable Diffusion in Colab)
- ngrok Tunnel (Deep Dive)
- Request–Response Flow
- Smart Pricing Logic
- Drag & Drop Customization
- Daily Runbook / Demo Script
- Security, Limits, and Trade-offs
- Alternatives Considered
- Q&A Backup Slides

---

## Executive Summary
Homelytics is an AI-powered interior design platform with two ways to design rooms:
- AI Generation: Upload an empty-room photo + describe your vision → AI generates a furnished image.
- Drag & Drop: Manually customize by placing furniture on your room image with live pricing.

We run the frontend locally (React + Vite) and the backend in Google Colab (Flask + Stable Diffusion) with a secure public URL via ngrok.

---

## System Architecture

- Frontend
  - React 18 + Vite 5 on Windows (localhost:3000)
  - Pages: Home, AI Generation (`AIGeneration.jsx`), Customize
  - Axios for HTTP requests; Framer Motion for animations
- Backend
  - Flask 3.0 API (Python) running in Google Colab with GPU (T4/A100)
  - Diffusers Stable Diffusion model: `SG161222/Realistic_Vision_V5.1_noVAE`
  - Endpoint: `/api/generate` (img2img transformation)
- Connectivity
  - ngrok tunnel exposes Colab’s Flask server at a public HTTPS URL
  - Local React posts to `https://<ngrok-subdomain>.ngrok-free.dev/api/generate`

Diagram:
Browser (React) → ngrok (public edge) → Colab (Flask+GPU) → AI generates → Response returns via ngrok → Browser displays

---

## Frontend (React + Vite)
- Tech stack
  - React 18, Vite 5, React Router, Axios, Framer Motion
- Primary flow (AIGeneration)
  - `const BACKEND_URL = 'https://<ngrok>/api/generate'`
  - Build `FormData` with uploaded image + form fields (room type, style, prompt)
  - `axios.post(BACKEND_URL, formData)` → await JSON { image(base64), cost, furniture_detected }
  - Render generated image; show cost breakdown
- Landing page
  - Clear explanation of two modes: AI Generation vs Drag & Drop
  - Before/After visualization for both methods
  - Inspiration Gallery with authentic examples

---

## Backend (Flask + Stable Diffusion in Colab)
- Flask 3 + CORS enabled
- Stable Diffusion (img2img) pipeline with GPU acceleration (PyTorch CUDA)
- Default settings tuned for strong adherence to prompts:
  - strength = 0.95 (95% transformation)
  - guidance_scale = 9.0
  - num_inference_steps = 50
- Endpoint `/api/generate` steps
  1) Read multipart form: image, room_type, style, prompt
  2) Prepare/resize image (512x512), build `full_prompt`
  3) Run pipeline to generate furnished image
  4) Smart pricing: parse furniture keywords and sum prices
  5) Return JSON with base64 image and pricing

---

## ngrok Tunnel (Deep Dive)
- What it is: A secure reverse proxy tunnel that gives a public URL to a local/private server
- Why we need it: Colab VMs don’t have public IPs; ngrok creates a public HTTPS URL and forwards traffic through an encrypted tunnel to Colab
- How it works:
  - Colab (client) establishes an outbound WebSocket to ngrok cloud
  - ngrok assigns a public subdomain like `https://abc.ngrok-free.dev`
  - Browser sends HTTPS to ngrok; ngrok forwards through tunnel to Flask :5000
  - Responses travel back the same path
- Overhead: ~20–100 ms (negligible vs ~30–60 s AI processing)
- Free tier limits: URL changes on restart; basic rate limits; good for development/demos

---

## Request–Response Flow (Step-by-Step)
1) User opens `http://localhost:3000` (Vite dev server)
2) User uploads `empty_room.jpg`, enters prompt: “modern living room with grey sofa, plants”
3) Frontend → `axios.post(<ngrok>/api/generate, formData)`
4) ngrok edge receives request → forwards via tunnel → Colab VM → Flask
5) Flask runs Stable Diffusion on GPU → generates furnished image
6) Smart pricing evaluates prompt → totals cost
7) Flask responds with JSON: { image(base64), cost, furniture_detected }
8) Frontend updates UI with generated image + pricing + download

---

## Smart Pricing Logic
- Dictionary of 40+ item names and typical prices (e.g., sofa $1299, TV $799, chair $299)
- Parse prompt/metadata to detect items (e.g., “king bed”, “nightstands”, “rug”, “lamp”)
- Apply room-type defaults when no items are detected (e.g., living room → sofa/table/rug)
- Return total estimate + list of detected furniture

---

## Drag & Drop Customization
- User can upload their room background
- Choose items (sofa, chair, lamp, etc.) and place/resize/arrange them
- Live price updates as items are added
- Complements AI Generation; both methods are explained side-by-side on landing page with before/after visuals

---

## Daily Runbook / Demo Script
1) Start Backend in Colab
   - Run `COLAB_BACKEND_COPY_THIS.py`
   - Enter Hugging Face token and ngrok token when prompted
   - Copy the printed ngrok URL, e.g., `https://ada-unjudging-ethyl.ngrok-free.dev`
2) Update Frontend URL
   - In Windows terminal at `c:\homelytics`:
     ```powershell
     python update_url.py
     ```
   - Choose “1”, paste ngrok URL → script updates `src/pages/AIGeneration.jsx` (BACKEND_URL)
3) Start Frontend
   ```powershell
   npm run dev
   ```
   - Open `http://localhost:3000`
4) Demo
   - Go to AI Generation, upload a room image, enter a prompt, click Generate
   - Show pricing and download
   - Optionally, showcase Drag & Drop with live price updates

---

## Security, Limits, and Trade-offs
- Security
  - HTTPS from browser to ngrok; encrypted tunnel to Colab
  - Optionally add basic auth or API token checks
- Limits
  - Colab sessions expire/idle; ngrok URL changes on restart (use `update_url.py` to switch)
- Trade-offs
  - Zero infra cost and super-fast iteration vs reconfiguring URL on session restarts

---

## Alternatives Considered
- Cloudflare Tunnel (very strong option; free custom domain support)
- SSH reverse tunnels (manual and fragile)
- Hosting backend on AWS/GCP/Azure with GPU (reliable but costly)

---

## Q&A Backup Slides
- Why strength=0.95? → Ensures strong adherence to prompt for img2img
- Why guidance=9.0? → Stricter prompt following; balances realism and control
- Why not run backend locally? → GPU cost/availability; Colab provides free GPUs
- What happens if ngrok URL changes? → Run `python update_url.py` and paste the new URL
- How is pricing calculated? → Keyword mapping + room-type defaults

---

## Appendix: Helpful Commands
```powershell
# Update frontend to new ngrok URL (paste when prompted)
python update_url.py

# Revert to local backend (if needed)
python update_url.py local

# Start frontend
npm run dev

# (In Colab) Run backend script cell to start Flask + ngrok
```
