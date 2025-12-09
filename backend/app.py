from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from io import BytesIO
from PIL import Image
import torch
from diffusers import StableDiffusionImg2ImgPipeline
import random
import re

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# Model Configuration
MODEL_ID = "SG161222/Realistic_Vision_V5.1_noVAE"
device = "cuda" if torch.cuda.is_available() else "cpu"
USE_LOCAL_MODEL = True  # Set to True to load model locally (optimized for RTX 3050)

# Hugging Face token (get from: https://huggingface.co/settings/tokens)
HF_TOKEN = os.environ.get("HF_TOKEN", None)  # Set as environment variable or paste here

# HF_TOKEN = " " # Alternatively, paste your token here

# Load model only if local mode is enabled
pipe = None
if USE_LOCAL_MODEL:
    print(f"⏳ Loading model on {device}...")
    if device == "cpu":
        print("⚠️ WARNING: Running on CPU will be VERY slow (30-60 seconds per image)")
        print("💡 Recommended: Use GPU or set USE_LOCAL_MODEL=False")
    
    try:
        # RTX 3050 6GB Optimizations
        print("🎮 Optimizing for RTX 3050 (6GB VRAM)...")

        my_dtype = torch.float16 if device == "cuda" else torch.float32
        
        pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=my_dtype,  
            use_auth_token=HF_TOKEN,
            low_cpu_mem_usage=True,
            safety_checker=None,  # Disable safety checker to save VRAM
            requires_safety_checker=False
        )
        
        # Move to GPU
        pipe = pipe.to(device)
        
        if device == "cuda":
            # Enable memory optimizations
            try:
                pipe.enable_xformers_memory_efficient_attention()
                print("✅ xFormers memory efficient attention enabled")
            except:
                print("⚠ xFormers not available, using standard attention")
            
            # Enable model CPU offload for 6GB VRAM
            try:
                pipe.enable_model_cpu_offload()
                print("✅ Model CPU offload enabled (saves VRAM)")
            except:
                print("⚠ CPU offload not available")
            
            # Enable attention slicing (reduces memory usage)
            try:
                pipe.enable_attention_slicing(1)
                print("✅ Attention slicing enabled")
            except:
                pass
            
            # Enable VAE slicing
            try:
                pipe.enable_vae_slicing()
                print("✅ VAE slicing enabled")
            except:
                pass
        
        print(f"✅ Model loaded successfully on {device}")
        print(f"💾 VRAM usage optimized for 6GB GPU")
        
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        print("💡 Make sure you have:")
        print("   1. Installed PyTorch with CUDA support")
        print("   2. Set your Hugging Face token (HF_TOKEN)")
        print("   3. Enough disk space (~7GB for model)")
        import traceback
        traceback.print_exc()
else:
    print("📡 Local model disabled. Demo mode active.")

# Furniture pricing database (in Indian Rupees)
FURNITURE_PRICES = {
    'sofa': {'name': 'Modern Sofa', 'price': 107800},
    'armchair': {'name': 'Armchair', 'price': 41400},
    'coffee_table': {'name': 'Coffee Table', 'price': 29000},
    'side_table': {'name': 'Side Table', 'price': 16500},
    'floor_lamp': {'name': 'Floor Lamp', 'price': 19000},
    'table_lamp': {'name': 'Table Lamp', 'price': 7400},
    'bed': {'name': 'Bed', 'price': 157600},
    'nightstand': {'name': 'Nightstand', 'price': 24800},
    'bookshelf': {'name': 'Bookshelf', 'price': 37300},
    'tv_stand': {'name': 'TV Stand', 'price': 33100},
    'plant': {'name': 'Decorative Plant', 'price': 6600},
    'artificial_plant': {'name': 'Artificial Plant', 'price': 4500},
    'wall_art': {'name': 'Wall Art', 'price': 13200},
    'rug': {'name': 'Area Rug', 'price': 24800},
    'dining_table': {'name': 'Dining Table', 'price': 74600},
    'dining_chair': {'name': 'Dining Chair (set of 4)', 'price': 59400},
    'desk': {'name': 'Office Desk', 'price': 49700},
    'office_chair': {'name': 'Office Chair', 'price': 33100},
    'curtains': {'name': 'Window Curtains', 'price': 10700},
    'bathtub': {'name': 'Bathtub', 'price': 65000},
    'shower': {'name': 'Shower', 'price': 45000},
    'sink': {'name': 'Sink', 'price': 18000},
    'mirror': {'name': 'Mirror', 'price': 8500},
    'gas_stove': {'name': 'Gas Stove', 'price': 42000},
    'kitchen_cabinet': {'name': 'Kitchen Cabinet Set', 'price': 58000},
    'refrigerator': {'name': 'Refrigerator', 'price': 72000},
    'dishwasher': {'name': 'Dishwasher', 'price': 48000},
    'microwave': {'name': 'Microwave Oven', 'price': 22000},
}

# Purchase links for furniture (Amazon, Flipkart)
FURNITURE_LINKS = {
    'sofa': {
        'amazon': 'https://www.amazon.in/s?k=modern+sofa+3+seater',
        'flipkart': 'https://www.flipkart.com/search?q=modern+sofa'
    },
    'armchair': {
        'amazon': 'https://www.amazon.in/s?k=armchair+living+room',
        'flipkart': 'https://www.flipkart.com/search?q=armchair'
    },
    'coffee_table': {
        'amazon': 'https://www.amazon.in/s?k=coffee+table+wooden',
        'flipkart': 'https://www.flipkart.com/search?q=coffee+table'
    },
    'side_table': {
        'amazon': 'https://www.amazon.in/s?k=side+table+living+room',
        'flipkart': 'https://www.flipkart.com/search?q=side+table'
    },
    'floor_lamp': {
        'amazon': 'https://www.amazon.in/s?k=floor+lamp+standing',
        'flipkart': 'https://www.flipkart.com/search?q=floor+lamp'
    },
    'table_lamp': {
        'amazon': 'https://www.amazon.in/s?k=table+lamp+bedside',
        'flipkart': 'https://www.flipkart.com/search?q=table+lamp'
    },
    'bed': {
        'amazon': 'https://www.amazon.in/s?k=king+size+bed+wooden',
        'flipkart': 'https://www.flipkart.com/search?q=king+bed'
    },
    'nightstand': {
        'amazon': 'https://www.amazon.in/s?k=nightstand+bedside+table',
        'flipkart': 'https://www.flipkart.com/search?q=nightstand'
    },
    'bookshelf': {
        'amazon': 'https://www.amazon.in/s?k=bookshelf+wooden',
        'flipkart': 'https://www.flipkart.com/search?q=bookshelf'
    },
    'tv_stand': {
        'amazon': 'https://www.amazon.in/s?k=tv+stand+unit',
        'flipkart': 'https://www.flipkart.com/search?q=tv+stand'
    },
    'plant': {
        'amazon': 'https://www.amazon.in/s?k=indoor+plants+natural',
        'flipkart': 'https://www.flipkart.com/search?q=indoor+plants'
    },
    'artificial_plant': {
        'amazon': 'https://www.amazon.in/s?k=artificial+plants+indoor',
        'flipkart': 'https://www.flipkart.com/search?q=artificial+plant'
    },
    'wall_art': {
        'amazon': 'https://www.amazon.in/s?k=wall+art+painting',
        'flipkart': 'https://www.flipkart.com/search?q=wall+art'
    },
    'rug': {
        'amazon': 'https://www.amazon.in/s?k=area+rug+carpet',
        'flipkart': 'https://www.flipkart.com/search?q=area+rug'
    },
    'dining_table': {
        'amazon': 'https://www.amazon.in/s?k=dining+table+6+seater',
        'flipkart': 'https://www.flipkart.com/search?q=dining+table'
    },
    'dining_chair': {
        'amazon': 'https://www.amazon.in/s?k=dining+chairs+set+of+4',
        'flipkart': 'https://www.flipkart.com/search?q=dining+chairs'
    },
    'desk': {
        'amazon': 'https://www.amazon.in/s?k=office+desk+computer+table',
        'flipkart': 'https://www.flipkart.com/search?q=office+desk'
    },
    'office_chair': {
        'amazon': 'https://www.amazon.in/s?k=office+chair+ergonomic',
        'flipkart': 'https://www.flipkart.com/search?q=office+chair'
    },
    'curtains': {
        'amazon': 'https://www.amazon.in/s?k=window+curtains+door',
        'flipkart': 'https://www.flipkart.com/search?q=curtains'
    },
    'bathtub': {
        'amazon': 'https://www.amazon.in/s?k=bathtub+freestanding',
        'flipkart': 'https://www.flipkart.com/search?q=bathtub'
    },
    'shower': {
        'amazon': 'https://www.amazon.in/s?k=shower+head+bathroom',
        'flipkart': 'https://www.flipkart.com/search?q=shower+head'
    },
    'sink': {
        'amazon': 'https://www.amazon.in/s?k=bathroom+sink+wash+basin',
        'flipkart': 'https://www.flipkart.com/search?q=wash+basin'
    },
    'mirror': {
        'amazon': 'https://www.amazon.in/s?k=wall+mirror+bathroom',
        'flipkart': 'https://www.flipkart.com/search?q=wall+mirror'
    },
    'gas_stove': {
        'amazon': 'https://www.amazon.in/s?k=gas+stove+3+burner',
        'flipkart': 'https://www.flipkart.com/search?q=gas+stove'
    },
    'kitchen_cabinet': {
        'amazon': 'https://www.amazon.in/s?k=kitchen+cabinet+modular',
        'flipkart': 'https://www.flipkart.com/search?q=kitchen+cabinet'
    },
    'refrigerator': {
        'amazon': 'https://www.amazon.in/s?k=refrigerator+double+door',
        'flipkart': 'https://www.flipkart.com/search?q=refrigerator'
    },
    'dishwasher': {
        'amazon': 'https://www.amazon.in/s?k=dishwasher+automatic',
        'flipkart': 'https://www.flipkart.com/search?q=dishwasher'
    },
    'microwave': {
        'amazon': 'https://www.amazon.in/s?k=microwave+oven',
        'flipkart': 'https://www.flipkart.com/search?q=microwave+oven'
    }
}

def get_purchase_links(furniture_key):
    """Get purchase links for a furniture item"""
    if furniture_key in FURNITURE_LINKS:
        return FURNITURE_LINKS[furniture_key]
    # Generate generic search links for unknown items
    search_query = furniture_key.replace('_', '+')
    return {
        'amazon': f'https://www.amazon.in/s?k={search_query}+furniture',
        'flipkart': f'https://www.flipkart.com/search?q={search_query}'
    }

# Room type priority mapping for budget suggestions
ROOM_PRIORITIES = {
    'living_room': [
        'sofa', 'coffee_table', 'tv_stand', 'rug', 'floor_lamp', 
        'curtains', 'plant', 'side_table', 'wall_art'
    ],
    'bedroom': [
        'bed', 'nightstand', 'table_lamp', 'rug', 'curtains', 
        'mirror', 'plant', 'bookshelf'
    ],
    'kitchen': [
        'refrigerator', 'gas_stove', 'kitchen_cabinet', 'microwave', 
        'sink', 'dishwasher', 'dining_table', 'dining_chair'
    ],
    'bathroom': [
        'bathtub', 'shower', 'sink', 'mirror', 'curtains'
    ],
    'office': [
        'desk', 'office_chair', 'bookshelf', 'floor_lamp', 
        'plant', 'rug', 'curtains'
    ],
    'dining_room': [
        'dining_table', 'dining_chair', 'rug', 'curtains', 
        'plant', 'wall_art', 'mirror'
    ]
}

def suggest_furniture_by_budget(room_type, budget, room_dimensions=None):
    """
    Suggest furniture items based on budget and room type
    Uses priority-based selection to maximize value
    
    Args:
        room_type: Type of room (living_room, bedroom, etc.)
        budget: Total budget in INR
        room_dimensions: Optional dict with 'length', 'width', 'height' in feet
    
    Returns:
        Dict with suggested items, total cost, and remaining budget
    """
    room_type_normalized = room_type.lower().replace(' ', '_')
    priorities = ROOM_PRIORITIES.get(room_type_normalized, ROOM_PRIORITIES['living_room'])
    
    selected = []
    remaining_budget = budget
    
    # Priority items first
    for item_key in priorities:
        if item_key in FURNITURE_PRICES:
            item_info = FURNITURE_PRICES[item_key]
            price = item_info['price']
            
            if price <= remaining_budget:
                selected.append({
                    'name': item_info['name'],
                    'key': item_key,
                    'price': price,
                    'priority': 'essential' if priorities.index(item_key) < 4 else 'optional',
                    'links': get_purchase_links(item_key)
                })
                remaining_budget -= price
    
    # Calculate room area if dimensions provided
    area_info = None
    if room_dimensions:
        length = room_dimensions.get('length', 0)
        width = room_dimensions.get('width', 0)
        height = room_dimensions.get('height', 0)
        
        if length and width:
            area_sqft = length * width
            area_info = {
                'area_sqft': area_sqft,
                'length': length,
                'width': width,
                'height': height,
                'size_category': 'small' if area_sqft < 100 else 'medium' if area_sqft < 200 else 'large'
            }
    
    return {
        'items': selected,
        'total_cost': budget - remaining_budget,
        'remaining_budget': remaining_budget,
        'budget_utilization': round(((budget - remaining_budget) / budget) * 100, 1) if budget > 0 else 0,
        'item_count': len(selected),
        'room_area': area_info
    }

def estimate_furniture_pricing(room_type, style, prompt, uploaded_image=None):
    """
    Estimate furniture items and pricing based ONLY on items explicitly mentioned in the prompt
    Uses very strict matching to avoid false positives
    """
    items = []
    prompt_lower = prompt.lower().strip()
    
    # If prompt is empty, return empty pricing
    if not prompt_lower:
        return {'items': [], 'total': 0}
    
    # Manual keyword mapping with very specific terms to avoid false matches
    # Format: furniture_key: [list of specific phrases that should match]
    # All keywords are lowercase for case-insensitive matching
    keyword_mapping = {
        'sofa': ['sofa', 'couch'],
        'armchair': ['armchair', 'arm chair'],
        'coffee_table': ['coffee_table', 'coffee table'],
        'side_table': ['side_table', 'side table'],
        'floor_lamp': ['floor_lamp', 'floor lamp', 'standing lamp'],
        'table_lamp': ['table_lamp', 'table lamp', 'desk lamp'],
        'bed': ['bed'],
        'nightstand': ['nightstand', 'night stand', 'bedside table'],
        'bookshelf': ['bookshelf', 'book shelf'],
        'tv_stand': ['tv_stand', 'tv stand', 'television stand', 'media console'],
        'plant': ['plant'],  # Will match "plant" but we'll handle "artificial plant" separately
        'artificial_plant': ['artificial_plant', 'artificial plant'],
        'wall_art': ['wall_art', 'wall art', 'painting', 'art frame'],
        'rug': ['rug', 'carpet'],
        'dining_table': ['dining_table', 'dining table'],
        'dining_chair': ['dining_chair', 'dining chair'],
        'desk': ['desk'],
        'office_chair': ['office_chair', 'office chair', 'task chair'],
        'curtains': ['curtains', 'curtain', 'drape', 'drapes', 'window curtain'],
        'bathtub': ['bathtub', 'bath tub', 'tub'],
        'shower': ['shower'],
        'sink': ['sink'],
        'mirror': ['mirror'],
        'gas_stove': ['gas_stove', 'gas stove', 'stove', 'cooktop', 'range'],
        'kitchen_cabinet': ['kitchen_cabinet', 'cabinet', 'kitchen cabinet', 'cabinets'],
        'refrigerator': ['refrigerator', 'fridge'],
        'dishwasher': ['dishwasher'],
        'microwave': ['microwave', 'oven'],
    }
    
    mentioned_items = set()
    matched_keywords = set()
    
    # Check each furniture item
    for item_key, keywords in keyword_mapping.items():
        for keyword in keywords:
            keyword = keyword.lower()
            # Use word boundary matching that supports multi-word phrases
            pattern = r'(?<!\w)' + re.escape(keyword) + r'(?!\w)'
            
            if re.search(pattern, prompt_lower):
                # Special handling for "plant" vs "artificial plant"
                if item_key == 'plant' and 'artificial plant' in prompt_lower:
                    continue  # Skip regular plant if artificial plant is mentioned
                
                mentioned_items.add(item_key)
                matched_keywords.add(keyword)
                break  # Found match, no need to check other keywords for this item
    
    # Build pricing list for known items
    for item_key in mentioned_items:
        if item_key in FURNITURE_PRICES:
            items.append({
                'name': FURNITURE_PRICES[item_key]['name'],
                'price': FURNITURE_PRICES[item_key]['price'],
                'custom': False,
                'links': get_purchase_links(item_key)
            })
    
    # Detect custom items (phrases not in our database)
    filler_words = {'add','please','show','include','room','my','the','a','an','to','in','with','and','make','have','should','be','needs','want','like','color','coloured','colored','paint','of','for','on','at','this','that'}
    raw_segments = re.split(r',|/|\band\b|\bwith\b|\bplus\b|\b&\b', prompt)
    custom_counter = 1
    for segment in raw_segments:
        original_segment = segment.strip()
        if not original_segment:
            continue
        segment_lower = original_segment.lower()
        # Skip if this segment already matched a known keyword
        if any(re.search(r'(?<!\w)' + re.escape(keyword) + r'(?!\w)', segment_lower) for keyword in matched_keywords):
            continue
        # Remove filler words
        filtered_words = [w for w in re.split(r'\s+', original_segment) if w and w.lower() not in filler_words]
        if not filtered_words:
            continue
        custom_name = ' '.join(filtered_words).strip()
        if len(custom_name) < 3:
            continue
        custom_display = custom_name.title()
        # Generate generic search links for custom items
        search_query = custom_name.replace(' ', '+')
        items.append({
            'name': f"Custom: {custom_display}",
            'price': 35000,
            'custom': True,
            'links': {
                'amazon': f'https://www.amazon.in/s?k={search_query}+furniture',
                'flipkart': f'https://www.flipkart.com/search?q={search_query}',
                'pepperfry': f'https://www.pepperfry.com/search?q={search_query}'
            }
        })
        custom_counter += 1
    
    total = sum(item['price'] for item in items)
    
    return {
        'items': items,
        'total': total
    }

@app.route('/api/suggest-furniture', methods=['POST'])
def suggest_furniture():
    """
    Endpoint to suggest furniture based on budget and room type
    """
    try:
        data = request.get_json()
        room_type = data.get('room_type', 'living_room')
        budget = data.get('budget', 100000)  # Default 1 lakh
        room_dimensions = data.get('dimensions')  # Optional: {length, width, height}
        
        suggestions = suggest_furniture_by_budget(room_type, budget, room_dimensions)
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        }), 200
        
    except Exception as e:
        print(f"Error in suggest_furniture: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_room():
    try:
        # Get uploaded image
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        
        image_file = request.files['image']
        prompt = request.form.get('prompt', '')
        room_type = request.form.get('room_type', 'living-room')
        style = request.form.get('style', 'modern')
        
        # Load and process the image
        input_image = Image.open(image_file).convert('RGB').resize((512, 512))
        
        # Detect items upfront so we can reuse results for prompt + pricing
        pricing_preview = estimate_furniture_pricing(room_type, style, prompt, input_image)
        requested_items_text = ', '.join(item['name'] for item in pricing_preview['items'])
        
        # Build enhanced prompt for realistic results
        style_adjectives = {
            'modern': 'sleek modern',
            'contemporary': 'contemporary elegant',
            'traditional': 'classic traditional',
            'minimalist': 'minimalist clean',
            'industrial': 'industrial urban',
            'scandinavian': 'scandinavian cozy',
            'bohemian': 'bohemian eclectic',
            'rustic': 'rustic warm'
        }
        
        style_desc = style_adjectives.get(style, style)
        room_name = room_type.replace('-', ' ')
        
        # Parse items from prompt for better control
        prompt_clean = prompt.strip()
        items_reference = requested_items_text if requested_items_text else prompt_clean
        
        # Build highly detailed and explicit prompt
        if prompt_clean:
            full_prompt = (
                f"professional interior design photography, {style_desc} {room_name}, "
                f"MUST include every furniture piece listed: {items_reference or 'user requested items'}, "
                f"follow user instructions exactly: {prompt_clean}, "
                f"show every listed item clearly and completely, "
                f"maintain exact colors and finishes from the prompt, "
                f"{style} style decor, "
                f"preserve room walls and structure, "
                f"ultra detailed, 8k resolution, photorealistic, perfect composition"
            )
            
            # Very specific negative prompt
            negative_prompt = (
                f"missing furniture, missing items, incomplete furniture, invisible items, "
                f"blurry, low quality, distorted, deformed, cartoon, painting, drawing, "
                f"extra items not listed, wrong furniture, different furniture, "
                f"incorrect colors, wrong colors, different colors, "
                f"missing {items_reference or prompt_clean}, incomplete {items_reference or prompt_clean}, "
                f"abstract, artistic, unrealistic, partial objects"
            )
        else:
            # No specific items - just apply style transformation
            full_prompt = (
                f"professional interior design photography, {style_desc} {room_name}, "
                f"{style} style interior, "
                f"preserve room structure and layout, "
                f"photorealistic, highly detailed, 8k, perfect lighting"
            )
            
            negative_prompt = (
                f"blurry, low quality, distorted, deformed, cartoon, painting, drawing, "
                f"extra furniture, random objects, unrealistic"
            )
        
        # Generate image
        if USE_LOCAL_MODEL and pipe is not None:
            print(f"🎨 Generating with local model on {device}...")
            print(f"💬 Full Prompt: {full_prompt}")
            print(f"🚫 Negative: {negative_prompt[:80]}...")
            
            if device == "cpu":
                print("⏳ This will take 30-60 seconds on CPU...")
            
            # Generate with optimized settings to preserve structure and add items
            generated_image = pipe(
                prompt=full_prompt,
                negative_prompt=negative_prompt,
                image=input_image,
                strength=0.65,           # Lowered to 0.65 to better preserve original structure
                guidance_scale=15.0,     # Balanced at 15.0 for good prompt following while maintaining structure
                num_inference_steps=70   # 70 steps for high quality generation
            ).images[0]
            
            # Clear GPU cache after generation
            if device == "cuda":
                torch.cuda.empty_cache()
                print("🧹 GPU cache cleared")
            
            print("✅ Generation complete!")
        else:
            # Demo mode: Return enhanced original image with overlay
            print("📸 Demo mode: Returning processed input image")
            generated_image = input_image
            # You could add simple PIL filters here for demo purposes
        
        # Convert to base64
        buffered = BytesIO()
        generated_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Use previously calculated pricing
        pricing = pricing_preview
        
        return jsonify({
            'image': f'data:image/png;base64,{img_str}',
            'pricing': pricing,
            'message': 'Image generated successfully' if USE_LOCAL_MODEL else 'Demo mode active',
            'mode': 'local' if USE_LOCAL_MODEL else 'demo'
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'device': device,
        'model': MODEL_ID,
        'mode': 'local' if USE_LOCAL_MODEL else 'demo',
        'gpu_available': torch.cuda.is_available()
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🏠 HOMELYTICS BACKEND SERVER")
    print("="*60)
    print(f"Device: {device}")
    print(f"Model: {MODEL_ID}")
    print(f"Local Model: {'Loaded' if USE_LOCAL_MODEL and pipe else 'Disabled (Demo Mode)'}")
    if device == "cpu" and USE_LOCAL_MODEL:
        print("\n⚠️  WARNING: Running on CPU!")
        print("💡 For fast generation:")
        print("   Option 1: Use NVIDIA GPU (recommended)")
        print("   Option 2: Rent cloud GPU (RunPod, Paperspace, etc.)")
        print("   Option 3: Set USE_LOCAL_MODEL=False for demo mode")
    print("="*60 + "\n")
    
    app.run(debug=False, port=5000)
