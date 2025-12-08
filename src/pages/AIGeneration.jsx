import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Sparkles, Loader2, Download, Share2, IndianRupee } from 'lucide-react'
import axios from 'axios'

export default function AIGeneration() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [roomType, setRoomType] = useState('living-room')
  const [style, setStyle] = useState('modern')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  
  // Budget feature states
  const [budget, setBudget] = useState(100000)
  const [showBudgetSuggestions, setShowBudgetSuggestions] = useState(false)
  const [budgetSuggestions, setBudgetSuggestions] = useState(null)
  const [roomDimensions, setRoomDimensions] = useState({ length: '', width: '', height: '' })

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
    
    // Auto-populate prompt from budget suggestions if no manual prompt
    if (!prompt && budgetSuggestions && budgetSuggestions.items) {
      // Use the item keys (e.g., 'table_lamp') instead of display names to ensure exact matching
      const furnitureKeys = budgetSuggestions.items.map(item => 
        item.key || item.name.replace('Custom: ', '').toLowerCase()
      ).join(', ')
      setPrompt(furnitureKeys)
    }

    setIsGenerating(true)
    setGeneratedImage(null)
    setEstimatedPrice(null)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('prompt', prompt)
      formData.append('room_type', roomType)
      formData.append('style', style)

      // LOCAL BACKEND: Running on your RTX 3050 GPU
      const BACKEND_URL = 'http://localhost:5000/api/generate'
      
      const response = await axios.post(BACKEND_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'json'
      })

      setGeneratedImage(response.data.image)
      setEstimatedPrice(response.data.pricing)
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate image. Make sure the backend server is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `homelytics-design-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
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
            <Sparkles className="w-16 h-16 mx-auto text-blue-600" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">AI Room Generation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-6 h-6 mr-2 text-blue-600" />
                Upload Room Image
              </h2>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
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
                    <p className="text-sm text-gray-600 font-medium">
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
                      <p className="text-lg font-medium text-gray-900">
                        {isDragActive ? '🎯 Drop image here' : '📸 Drag & drop your room image'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse (PNG, JPG, JPEG, WEBP)
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Room Type Selection */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
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
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      roomType === type.toLowerCase().replace(' ', '-')
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
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
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      style === s.toLowerCase()
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Budget Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <IndianRupee className="w-6 h-6 mr-2 text-green-600" />
                Budget & Room Dimensions
              </h2>
              
              {/* Budget Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget: ₹{budget.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹10K</span>
                  <span>₹500K</span>
                </div>
              </div>

              {/* Room Dimensions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Dimensions (Optional - in feet)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Length"
                    value={roomDimensions.length}
                    onChange={(e) => setRoomDimensions({...roomDimensions, length: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Width"
                    value={roomDimensions.width}
                    onChange={(e) => setRoomDimensions({...roomDimensions, width: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={roomDimensions.height}
                    onChange={(e) => setRoomDimensions({...roomDimensions, height: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Suggest Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchBudgetSuggestions}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Budget Suggestions
              </motion.button>

              {/* Budget Suggestions Display */}
              {showBudgetSuggestions && budgetSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-green-900">Suggested Items ({budgetSuggestions.item_count})</h3>
                    <span className="text-sm font-medium text-green-700">
                      {budgetSuggestions.budget_utilization}% utilized
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {budgetSuggestions.items.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-green-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">
                            {item.name}
                            {item.priority === 'essential' && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Essential</span>}
                          </span>
                          <span className="font-semibold text-green-900">₹{item.price.toLocaleString('en-IN')}</span>
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
                  
                  <div className="mt-3 pt-3 border-t border-green-200 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Total Cost:</span>
                      <p className="font-bold text-green-900">₹{budgetSuggestions.total_cost.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining:</span>
                      <p className="font-bold text-green-900">₹{budgetSuggestions.remaining_budget.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {budgetSuggestions.room_area && (
                    <div className="mt-2 text-xs text-gray-600">
                      Room: {budgetSuggestions.room_area.length}ft × {budgetSuggestions.room_area.width}ft = {budgetSuggestions.room_area.area_sqft} sq ft ({budgetSuggestions.room_area.size_category})
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ✍️ Furniture Items
              </h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Click 'Get Budget Suggestions' above, or manually type: sofa, coffee table, lamp, rug..."
                className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-blue-300"
              />
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!image || isGenerating}
              whileHover={!image || isGenerating ? {} : { scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={!image || isGenerating ? {} : { scale: 0.98 }}
              className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                !image || isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl'
              }`}
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
            className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
              Generated Design
            </h2>

            {isGenerating ? (
              <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-20 h-20 text-blue-600 mb-6" />
                </motion.div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-700 font-semibold text-lg"
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
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={generatedImage}
                  alt="Generated room"
                  className="w-full rounded-2xl shadow-2xl"
                />
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPricing(!showPricing)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
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
                    className="glass-effect rounded-2xl p-6 border border-white/30"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <IndianRupee className="w-5 h-5 mr-2 text-purple-600" />
                      Estimated Pricing
                    </h3>
                    <div className="space-y-3">
                      {estimatedPrice.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 pb-3 last:border-0"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">{item.name}</span>
                            <span className="font-bold text-gray-900">
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
                      <div className="border-t-2 border-gray-200 pt-3 mt-3">
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="flex justify-between items-center text-xl font-bold"
                        >
                          <span className="text-gray-900">Total</span>
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
              <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-600 font-medium text-lg">
                    Your generated room will appear here
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
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
