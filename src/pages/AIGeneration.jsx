import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Sparkles, Loader2, Download, Share2, IndianRupee } from 'lucide-react'
import axios from 'axios'

// Utility to convert data URI to blob URL for better performance
const dataURIToBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].match(/:(.*?);/)[1]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

const dataToBlobURL = (dataURI) => {
  try {
    const blob = dataURIToBlob(dataURI)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error converting data URI to blob URL:', error)
    return dataURI // Fallback to original data URI
  }
}

// Custom Before/After Comparison Component (replaces broken react-compare-image)
const BeforeAfterComparison = ({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }) => {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newPos = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(0, Math.min(100, newPos)))
  }

  const handleTouchMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const newPos = ((touch.clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(0, Math.min(100, newPos)))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={() => {}}
      style={{ cursor: 'col-resize', background: 'rgb(var(--bg-tertiary))' }}
    >
      {/* Container for images */}
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        {/* Before image (full background) */}
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* After image (overlaid, clipped by slider position) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={afterImage}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${100 / (sliderPos / 100)}%` }}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-1 shadow-lg"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)', background: 'rgb(var(--color-coral))' }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2"
            style={{ borderColor: 'rgb(var(--color-coral))' }}>
            <div className="flex gap-1">
              <div className="w-1 h-4 rounded-full" style={{ background: 'rgb(var(--color-coral))' }} />
              <div className="w-1 h-4 rounded-full" style={{ background: 'rgb(var(--color-coral))' }} />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-lg text-sm font-medium" style={{ background: 'rgba(26,26,46,0.70)' }}>
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 text-white px-3 py-1 rounded-lg text-sm font-medium" style={{ background: 'rgba(233,69,96,0.80)' }}>
          {afterLabel}
        </div>
      </div>
    </div>
  )
}

export default function AIGeneration() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [generatedImageBlobURL, setGeneratedImageBlobURL] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [roomType, setRoomType] = useState('living-room')
  const [style, setStyle] = useState('modern')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const blobURLRef = useRef(null)
  
  // Budget feature states
  const [budget, setBudget] = useState(100000)
  const [showBudgetSuggestions, setShowBudgetSuggestions] = useState(false)
  const [budgetSuggestions, setBudgetSuggestions] = useState(null)
  const [roomDimensions, setRoomDimensions] = useState({ length: '', width: '', height: '' })

    
  // ── IMPROVEMENT 7: Before/After comparison state ──
  const [originalImage, setOriginalImage] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  // Cleanup blob URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (blobURLRef.current) {
        URL.revokeObjectURL(blobURLRef.current)
      }
    }
  }, [])

  const roomTypes = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Bathroom',
    'Dining Room',
    'Office',
    'Kids Room',
    'Outdoor'
  ]

  const styles = [
    'Modern',
    'Contemporary',
    'Traditional',
    'Minimalist',
    'Industrial',
    'Scandinavian',
    'Bohemian',
    'Rustic'
  ]

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    setImage(file)
    
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
      // Store for before/after comparison (Improvement 7)
      setOriginalImage(reader.result)
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  })

  const fetchBudgetSuggestions = async () => {
    try {
      const dimensions = (roomDimensions.length && roomDimensions.width) 
        ? { 
            length: parseFloat(roomDimensions.length), 
            width: parseFloat(roomDimensions.width),
            height: parseFloat(roomDimensions.height) || 10
          }
        : null

      const response = await axios.post('http://localhost:5000/api/suggest-furniture', {
        room_type: roomType,
        budget: budget,
        dimensions: dimensions
      })

      const suggestions = response.data.suggestions
      setBudgetSuggestions(suggestions)
      setShowBudgetSuggestions(true)

      // Auto-populate prompt with suggested furniture (using clean names)
      if (suggestions && suggestions.items && suggestions.items.length > 0) {
        const furnitureNames = suggestions.items
          .map(item => item.key || item.name.replace(/^(Modern |Office |Dining |Window |Decorative |Area |Floor |Table |Custom: )/i, ''))
          .join(', ')
        setPrompt(furnitureNames)

        // Scroll to prompt section to show it's been filled
        setTimeout(() => {
          const promptElement = document.querySelector('textarea[placeholder*="Budget suggestions"]')
          if (promptElement) {
            promptElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            promptElement.focus()
          }
        }, 500)
      }
    } catch (error) {
      console.error('Budget suggestions error:', error)
      alert('Failed to fetch budget suggestions')
    }
  }

  const handleGenerate = async () => {
    if (!image) {
      alert('Please upload an image first!')
      return
    }

    let finalPrompt = prompt

    // Auto-populate prompt from budget suggestions if no manual prompt
    if (!finalPrompt && budgetSuggestions && budgetSuggestions.items) {
      finalPrompt = budgetSuggestions.items.map(item => 
        item.key || item.name.replace('Custom: ', '').toLowerCase()
      ).join(', ')
      setPrompt(finalPrompt)
    }

    setIsGenerating(true)
    setGeneratedImage(null)
    setGeneratedImageBlobURL(null)
    setEstimatedPrice(null)
    setShowComparison(false)

    // Clean up previous blob URL
    if (blobURLRef.current) {
      URL.revokeObjectURL(blobURLRef.current)
      blobURLRef.current = null
    }

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('prompt', finalPrompt)
      formData.append('room_type', roomType)
      formData.append('style', style)

      // LOCAL BACKEND: Running on your RTX 3050 GPU
      const BACKEND_URL = 'http://localhost:5000/api/generate'

      console.log('Sending generation request...')
      const response = await axios.post(BACKEND_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'json',
        timeout: 300000 // 5 minute timeout for generation
      })

      console.log('Response received:', {
        hasImage: !!response.data?.image,
        hasPricing: !!response.data?.pricing,
        mode: response.data?.mode,
        message: response.data?.message
      })

      // Check for errors in response
      if (response.data?.error) {
        throw new Error(response.data.error)
      }

      if (!response.data?.image) {
        throw new Error('No image in response. Backend may be in demo mode.')
      }

      // Validate that the image data is not empty
      if (response.data.image.length < 100) {
        throw new Error('Image data is too small or invalid')
      }

      console.log(`Image data received: ${response.data.image.substring(0, 50)}...`)

      // Convert data URI to blob URL for better performance
      const blobURL = dataToBlobURL(response.data.image)
      blobURLRef.current = blobURL

      setGeneratedImage(response.data.image) // Keep original for download
      setGeneratedImageBlobURL(blobURL) // Use blob URL for display
      setEstimatedPrice(response.data.pricing)
      setShowComparison(true)
      console.log('Image display state updated successfully')
    } catch (error) {
      console.error('Generation error:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to generate image'
      alert(`Generation failed: ${errorMsg}\n\nMake sure:\n1. Backend server is running\n2. GPU drivers are installed\n3. Models have finished downloading`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    try {
      const link = document.createElement('a')
      link.href = generatedImage // Use original data URI for download
      link.download = `homelytics-design-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download image')
    }
  }

  const handleShare = async () => {
    if (!generatedImage) return

    try {
      const blob = await fetch(generatedImage).then(r => r.blob())
      const file = new File([blob], 'room-design.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Room Design',
          text: 'Check out my room design created with Homelytics!'
        })
      } else {
        // Fallback: copy link
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'rgb(var(--bg-primary))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 mx-auto" style={{ color: 'rgb(var(--color-coral))' }} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">AI Room Generation</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>
            Upload your empty room and let AI transform it into a beautiful space
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Image Upload */}
            <div className="rounded-3xl p-6 transition-all duration-300" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(var(--fg-primary))' }}>
                <Upload className="w-6 h-6 mr-2" style={{ color: 'rgb(var(--color-coral))' }} />
                Upload Room Image
              </h2>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                {...getRootProps()}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
                style={{
                  borderColor: isDragActive ? 'rgb(var(--color-coral))' : 'rgb(var(--border-secondary))',
                  background: isDragActive ? 'rgba(233,69,96,0.05)' : 'transparent',
                  transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="space-y-4">
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm font-medium" style={{ color: 'rgb(var(--fg-secondary))' }}>
                      ✨ Click or drag to replace image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="w-16 h-16 mx-auto text-gray-400" />
                    </motion.div>
                    <div>
                      <p className="text-lg font-medium" style={{ color: 'rgb(var(--fg-primary))' }}>
                        {isDragActive ? '🎯 Drop image here' : '📸 Drag & drop your room image'}
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'rgb(var(--fg-tertiary))' }}>
                        or click to browse (PNG, JPG, JPEG, WEBP)
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Room Type Selection */}
            <div className="rounded-3xl p-6 transition-all duration-300" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>
                🏠 Room Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {roomTypes.map((type, index) => (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRoomType(type.toLowerCase().replace(' ', '-'))}
                    className="px-4 py-3 rounded-xl font-medium transition-all duration-200"
                    style={{
                      background: roomType === type.toLowerCase().replace(' ', '-')
                        ? 'rgb(var(--color-coral))' : 'rgb(var(--bg-secondary))',
                      color: roomType === type.toLowerCase().replace(' ', '-')
                        ? '#fff' : 'rgb(var(--fg-primary))',
                      boxShadow: roomType === type.toLowerCase().replace(' ', '-') ? 'var(--shadow-md)' : 'none',
                    }}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="rounded-xl p-6" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>
                🎨 Design Style
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((s, index) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStyle(s.toLowerCase())}
                    className="px-4 py-3 rounded-xl font-medium transition-all duration-200"
                    style={{
                      background: style === s.toLowerCase()
                        ? 'rgb(var(--color-coral))' : 'rgb(var(--bg-secondary))',
                      color: style === s.toLowerCase()
                        ? '#fff' : 'rgb(var(--fg-primary))',
                      boxShadow: style === s.toLowerCase() ? 'var(--shadow-md)' : 'none',
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Budget Section */}
            <div className="rounded-3xl p-6 transition-all duration-300" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(var(--fg-primary))' }}>
                <IndianRupee className="w-6 h-6 mr-2" style={{ color: 'rgb(var(--color-coral))' }} />
                Budget & Room Dimensions
              </h2>
              
              {/* Budget Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-primary))' }}>
                  Budget: ₹{budget.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: 'rgb(var(--color-coral))' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'rgb(var(--fg-tertiary))' }}>
                  <span>₹10K</span>
                  <span>₹500K</span>
                </div>
              </div>

              {/* Room Dimensions */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-primary))' }}>
                  Room Dimensions (Optional - in feet)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Length"
                    value={roomDimensions.length}
                    onChange={(e) => setRoomDimensions({...roomDimensions, length: e.target.value})}
                    className="input-base"
                  />
                  <input
                    type="number"
                    placeholder="Width"
                    value={roomDimensions.width}
                    onChange={(e) => setRoomDimensions({...roomDimensions, width: e.target.value})}
                    className="input-base"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={roomDimensions.height}
                    onChange={(e) => setRoomDimensions({...roomDimensions, height: e.target.value})}
                    className="input-base"
                  />
                </div>
              </div>

              {/* Suggest Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchBudgetSuggestions}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center text-white"
                style={{ background: 'rgb(var(--color-coral))', boxShadow: 'var(--shadow-md)' }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Budget Suggestions
              </motion.button>

              {/* Budget Suggestions Display */}
              {showBudgetSuggestions && budgetSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: 'rgba(233,69,96,0.06)', border: '1px solid rgba(233,69,96,0.20)' }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold" style={{ color: 'rgb(var(--fg-primary))' }}>Suggested Items ({budgetSuggestions.item_count})</h3>
                    <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-coral))' }}>
                      {budgetSuggestions.budget_utilization}% utilized
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {budgetSuggestions.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg" style={{ background: 'rgb(var(--bg-secondary))', border: '1px solid rgb(var(--border-primary))' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium" style={{ color: 'rgb(var(--fg-primary))' }}>
                            {item.name}
                            {item.priority === 'essential' && <span className="ml-2 text-xs px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: 'rgb(59 130 246)' }}>Essential</span>}
                          </span>
                          <span className="font-semibold" style={{ color: 'rgb(var(--color-coral))' }}>₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        {item.links && (
                          <div className="flex gap-2 text-xs mt-2">
                            <a 
                              href={item.links.amazon} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                            >
                              🛒 Amazon
                            </a>
                            <a 
                              href={item.links.flipkart} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              🛍️ Flipkart
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 grid grid-cols-2 gap-2 text-sm" style={{ borderTop: '1px solid rgb(var(--border-primary))' }}>
                    <div>
                      <span style={{ color: 'rgb(var(--fg-secondary))' }}>Total Cost:</span>
                      <p className="font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>₹{budgetSuggestions.total_cost.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span style={{ color: 'rgb(var(--fg-secondary))' }}>Remaining:</span>
                      <p className="font-bold" style={{ color: 'rgb(var(--color-coral))' }}>₹{budgetSuggestions.remaining_budget.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {budgetSuggestions.room_area && (
                    <div className="mt-2 text-xs" style={{ color: 'rgb(var(--fg-tertiary))' }}>
                      Room: {budgetSuggestions.room_area.length}ft × {budgetSuggestions.room_area.width}ft = {budgetSuggestions.room_area.area_sqft} sq ft ({budgetSuggestions.room_area.size_category})
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="rounded-3xl p-6 transition-all duration-300" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ color: 'rgb(var(--fg-primary))' }}>
                  ✍️ Furniture Items
                </h2>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                }}
                placeholder="Click 'Get Budget Suggestions' above, or manually type: sofa, coffee table, lamp, rug..."
                className="input-base h-32 rounded-2xl resize-none"
                style={{ borderWidth: '2px' }}
              />
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!image || isGenerating}
              whileHover={!image || isGenerating ? {} : { scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={!image || isGenerating ? {} : { scale: 0.98 }}
              className="w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: !image || isGenerating ? 'rgb(var(--bg-tertiary))' : 'rgb(var(--color-coral))',
                color: !image || isGenerating ? 'rgb(var(--fg-tertiary))' : '#fff',
                cursor: !image || isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: !image || isGenerating ? 'none' : 'var(--shadow-xl)',
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <span>Generating Your Dream Room...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7" />
                  <span>Generate Room Design</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Right Panel - Generated Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl p-6 transition-all duration-300"
            style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(var(--fg-primary))' }}>
              <Sparkles className="w-6 h-6 mr-2" style={{ color: 'rgb(var(--color-coral))' }} />
              Generated Design
            </h2>

            {isGenerating ? (
              <div className="h-96 flex flex-col items-center justify-center rounded-2xl relative overflow-hidden" style={{ background: 'rgb(var(--bg-secondary))' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-20 h-20 mb-6" style={{ color: 'rgb(var(--color-coral))' }} />
                </motion.div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-semibold text-lg"
                  style={{ color: 'rgb(var(--fg-primary))' }}
                >
                  Creating your perfect room...
                </motion.p>
                <div className="absolute inset-0 shimmer" />
              </div>
            ) : generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* ── IMPROVEMENT 7: Before/After Comparison Slider ── */}
                {showComparison && originalImage && generatedImageBlobURL ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgb(var(--fg-primary))' }}>
                      🔄 Before / After Comparison
                    </h3>
                    <div className="rounded-2xl overflow-hidden">
                      <BeforeAfterComparison
                        beforeImage={originalImage}
                        afterImage={generatedImageBlobURL}
                        beforeLabel="Original Room"
                        afterLabel="AI Furnished Room"
                      />
                    </div>
                    <button
                      onClick={() => setShowComparison(false)}
                      className="mt-3 text-sm font-medium underline"
                      style={{ color: 'rgb(var(--color-coral))' }}
                    >
                      Show generated image only
                    </button>
                  </div>
                ) : generatedImageBlobURL ? (
                  <div>
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={generatedImageBlobURL}
                      alt="Generated room"
                      className="w-full rounded-2xl shadow-2xl object-contain"
                      onError={(e) => {
                        console.error('Image failed to load:', e)
                        // Fallback to data URI if blob URL fails
                        if (generatedImage) {
                          e.target.src = generatedImage
                        }
                      }}
                    />
                    {originalImage && (
                      <button
                        onClick={() => setShowComparison(true)}
                        className="mt-3 text-sm font-medium underline"
                        style={{ color: 'rgb(var(--color-coral))' }}
                      >
                        🔄 Show before/after comparison
                      </button>
                    )}
                  </div>
                ) : null}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-white"
                    style={{ background: 'rgb(var(--color-coral))', boxShadow: 'var(--shadow-md)' }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-white"
                    style={{ background: 'rgb(var(--color-navy))', boxShadow: 'var(--shadow-md)' }}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPricing(!showPricing)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background: showPricing ? 'rgb(var(--color-navy))' : 'rgb(var(--bg-secondary))',
                      color: showPricing ? '#fff' : 'rgb(var(--fg-primary))',
                      border: '1px solid rgb(var(--color-card-border))',
                    }}
                  >
                    <IndianRupee className="w-5 h-5" />
                    <span>Pricing</span>
                  </motion.button>
                </div>

                {/* Pricing Details */}
                {showPricing && estimatedPrice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="rounded-2xl p-6"
                    style={{ background: 'rgb(var(--bg-secondary))', border: '1px solid rgb(var(--color-card-border))' }}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'rgb(var(--fg-primary))' }}>
                      <IndianRupee className="w-5 h-5 mr-2" style={{ color: 'rgb(var(--color-coral))' }} />
                      Estimated Pricing
                    </h3>
                    <div className="space-y-3">
                      {estimatedPrice.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="pb-3 last:border-0"
                          style={{ borderBottom: '1px solid rgb(var(--border-primary))' }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium" style={{ color: 'rgb(var(--fg-primary))' }}>{item.name}</span>
                            <span className="font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          {item.links && (
                            <div className="flex gap-2 text-xs">
                              <a 
                                href={item.links.amazon} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center gap-1"
                              >
                                🛒 Amazon
                              </a>
                              <a 
                                href={item.links.flipkart} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1"
                              >
                                🛍️ Flipkart
                              </a>
                            </div>
                          )}
                        </motion.div>
                      ))}
                      <div className="pt-3 mt-3" style={{ borderTop: '2px solid rgb(var(--border-primary))' }}>
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="flex justify-between items-center text-xl font-bold"
                        >
                          <span style={{ color: 'rgb(var(--fg-primary))' }}>Total</span>
                          <span className="gradient-text">
                            ₹{estimatedPrice.total.toLocaleString('en-IN')}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="h-96 flex items-center justify-center rounded-2xl border-2 border-dashed" style={{ background: 'rgb(var(--bg-secondary))', borderColor: 'rgb(var(--border-primary))' }}>
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-20 h-20 mx-auto mb-4" style={{ color: 'rgb(var(--color-coral))' }} />
                  </motion.div>
                  <p className="font-medium text-lg" style={{ color: 'rgb(var(--fg-secondary))' }}>
                    Your generated room will appear here
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'rgb(var(--fg-tertiary))' }}>
                    Upload an image and click generate to get started ✨
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
