# 🎮 Homelytics Local GPU Setup Guide

## ✅ Setup Complete!

Your Homelytics application is now configured to run on your **RTX 3050 GPU** locally!

---

## 📋 What Was Installed

### ✅ Software Installed
- **PyTorch 2.1.0** with CUDA 12.1 support (~2.5 GB)
- **Diffusers 0.24.0** - Stable Diffusion library
- **Transformers 4.35.0** - AI model library
- **Flask 3.0.0** - Web framework
- **All dependencies** - Pillow, accelerate, etc.

### ⚙️ Optimizations Applied
Your backend is optimized for 6GB VRAM:
- ✅ FP16 precision (half memory usage)
- ✅ CPU offloading for model parts
- ✅ Attention slicing
- ✅ VAE slicing
- ✅ GPU cache clearing after generation

---

## 🚀 How to Run

### Step 1: Get Hugging Face Token
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name (e.g., "Homelytics")
4. Select "Read" permission
5. Copy the token (starts with `hf_...`)

### Step 2: Start the Backend
1. **Double-click** `START_LOCAL_BACKEND.bat`
2. When prompted, **paste your Hugging Face token**
3. Wait for the model to download (~5-7 GB, first time only)
4. Wait for "Running on http://127.0.0.1:5000" message

### Step 3: Start the Frontend
Open a new terminal and run:
```bash
npm run dev
```

### Step 4: Use the App
1. Go to http://localhost:3000/ai-generate
2. Upload a room image
3. Choose room type and style
4. Add custom prompt (optional)
5. Click "Generate Design"

---

## ⏱️ Performance Expectations

### First Time
- **Model Download**: 5-7 GB (one-time, ~10-15 minutes)
- **Model Loading**: 30-60 seconds

### After Setup
- **Generation Time**: 15-30 seconds per image
- **VRAM Usage**: ~4-5 GB
- **Quality**: High (512x512 resolution)

---

## 🎨 Usage Tips

### For Best Results
- Use clear, well-lit room photos
- Be specific in your prompts
- Example prompts:
  - "elegant grey sofa with wooden coffee table"
  - "king-size bed with minimalist nightstands"
  - "modern white kitchen with marble countertops"

### Memory Management
- Close other GPU-heavy applications
- One generation at a time
- Backend automatically clears GPU cache

---

## 🔧 Troubleshooting

### "CUDA out of memory"
**Solution**: Close the backend and restart it. Try generating one image at a time.

### "Model failed to load"
**Solutions**:
1. Check your Hugging Face token is correct
2. Ensure you have ~10 GB free disk space
3. Check your internet connection

### "Backend not responding"
**Solutions**:
1. Make sure the backend terminal shows "Running on http://127.0.0.1:5000"
2. Check Windows Firewall isn't blocking port 5000
3. Restart the backend

### Frontend can't connect
**Check**:
1. Backend is running (terminal should be open)
2. URL is `http://localhost:5000/api/generate` (already configured)
3. No CORS errors in browser console

---

## 💡 Advantages of Local Setup

### Benefits
✅ **No session timeouts** - Run as long as you want  
✅ **Always available** - No reconnecting needed  
✅ **Privacy** - Your data stays local  
✅ **Free unlimited use** - No usage limits  
✅ **Faster startup** - Model stays loaded  

### Cost Savings
- **Free forever** - No monthly fees
- **No internet required** after model download

---

## 📊 System Requirements Met

✅ **GPU**: RTX 3050 Laptop (6GB VRAM)  
✅ **CUDA**: 12.3  
✅ **Python**: 3.10.0  
✅ **PyTorch**: 2.1.0+cu121  
✅ **RAM**: Should have 8GB+ system RAM  
✅ **Storage**: ~10 GB free space  

---

## 📁 File Structure

```
homelytics - Copy/
├── START_LOCAL_BACKEND.bat    ← Double-click to start backend
├── backend/
│   ├── app.py                  ← Optimized for RTX 3050
│   └── requirements.txt
├── src/
│   └── pages/
│       └── AIGeneration.jsx    ← Updated to localhost
└── LOCAL_GPU_SETUP.md          ← This file
```

---

## 🎯 Next Steps

1. ✅ **Start the backend** using `START_LOCAL_BACKEND.bat`
2. ✅ **Enter your HF token** when prompted
3. ✅ **Wait for model download** (first time only)
4. ✅ **Start the frontend** with `npm run dev`
5. ✅ **Generate your first design!**

---

## 🛟 Need Help?

### Check Backend Logs
- The terminal running `START_LOCAL_BACKEND.bat` shows detailed logs
- Look for "✅ Model loaded" message
- Any errors will appear in red

### Test Backend Directly
Visit in browser: http://localhost:5000/api/health

Should show:
```json
{
  "status": "healthy",
  "device": "cuda",
  "gpu_available": true
}
```

---

## 🎉 You're All Set!

Your local GPU-powered Homelytics is ready to use!

Enjoy unlimited AI-powered interior design! 🏠✨
