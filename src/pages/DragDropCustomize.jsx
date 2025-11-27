import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Download, Share2, IndianRupee, Trash2, RotateCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function DragDropCustomize() {
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [furnitureItems, setFurnitureItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPricing, setShowPricing] = useState(false)
  const canvasRef = useRef(null)
  const [scale, setScale] = useState(1)

  const furnitureLibrary = [
    { id: 'sofa-modern', name: 'Modern Sofa', category: 'Seating', price: 107800, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop' },
    { id: 'armchair', name: 'Armchair', category: 'Seating', price: 41400, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop' },
    { id: 'coffee-table', name: 'Coffee Table', category: 'Tables', price: 29000, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=200&h=200&fit=crop' },
    { id: 'side-table', name: 'Side Table', category: 'Tables', price: 16500, image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=200&h=200&fit=crop' },
    { id: 'floor-lamp', name: 'Floor Lamp', category: 'Lighting', price: 19000, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop' },
    { id: 'table-lamp', name: 'Table Lamp', category: 'Lighting', price: 7400, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop' },
    { id: 'bed-queen', name: 'Queen Bed', category: 'Bedroom', price: 157600, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=200&fit=crop' },
    { id: 'nightstand', name: 'Nightstand', category: 'Bedroom', price: 24800, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&h=200&fit=crop' },
    { id: 'bookshelf', name: 'Bookshelf', category: 'Storage', price: 37300, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&h=200&fit=crop' },
    { id: 'tv-stand', name: 'TV Stand', category: 'Storage', price: 33100, image: 'https://images.unsplash.com/photo-1593089251955-1d9ce62c4e23?w=200&h=200&fit=crop' },
    { id: 'plant-large', name: 'Large Plant', category: 'Decor', price: 6600, image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200&h=200&fit=crop' },
    { id: 'wall-art', name: 'Wall Art', category: 'Decor', price: 13200, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop' },
    { id: 'rug-modern', name: 'Modern Rug', category: 'Decor', price: 24800, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop' },
    { id: 'dining-table', name: 'Dining Table', category: 'Dining', price: 74600, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=200&h=200&fit=crop' },
    { id: 'dining-chair', name: 'Dining Chair', category: 'Dining', price: 14900, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=200&h=200&fit=crop' },
    { id: 'desk', name: 'Office Desk', category: 'Office', price: 49700, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&h=200&fit=crop' },
  ]

  const categories = ['All', 'Seating', 'Tables', 'Lighting', 'Bedroom', 'Storage', 'Decor', 'Dining', 'Office']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      setBackgroundImage(reader.result)
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

  const handleFurnitureDragStart = (e, furniture) => {
    e.dataTransfer.setData('furniture', JSON.stringify(furniture))
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    const furnitureData = e.dataTransfer.getData('furniture')
    if (!furnitureData) return

    const furniture = JSON.parse(furnitureData)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    const newItem = {
      ...furniture,
      uniqueId: `${furniture.id}-${Date.now()}`,
      x,
      y,
      width: 150,
      height: 150,
      rotation: 0
    }

    setFurnitureItems([...furnitureItems, newItem])
  }

  const handleItemDrag = (e, itemId) => {
    if (!selectedItem || selectedItem !== itemId) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setFurnitureItems(furnitureItems.map(item =>
      item.uniqueId === itemId ? { ...item, x: x - item.width / 2, y: y - item.height / 2 } : item
    ))
  }

  const handleDeleteItem = (itemId) => {
    setFurnitureItems(furnitureItems.filter(item => item.uniqueId !== itemId))
    if (selectedItem === itemId) setSelectedItem(null)
  }

  const handleRotateItem = (itemId, direction = 'cw') => {
    setFurnitureItems(furnitureItems.map(item =>
      item.uniqueId === itemId ? { 
        ...item, 
        rotation: direction === 'cw' 
          ? (item.rotation + 15) % 360 
          : (item.rotation - 15 + 360) % 360 
      } : item
    ))
  }

  const calculateTotalPrice = () => {
    return furnitureItems.reduce((sum, item) => sum + item.price, 0)
  }

  const handleSaveImage = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2
      })

      const link = document.createElement('a')
      link.download = `homelytics-custom-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Failed to save image')
    }
  }

  const handleShare = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2
      })

      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'room-design.png', { type: 'image/png' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Custom Room Design',
            text: 'Check out my custom room design created with Homelytics!'
          })
        } else {
          await navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }
      })
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  const filteredFurniture = selectedCategory === 'All'
    ? furnitureLibrary
    : furnitureLibrary.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Drag & Drop Customization
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your room and customize it by dragging furniture items
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Furniture Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Furniture Library
            </h2>

            {/* Category Filter */}
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Furniture Items */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredFurniture.map(furniture => (
                <div
                  key={furniture.id}
                  draggable
                  onDragStart={(e) => handleFurnitureDragStart(e, furniture)}
                  className="bg-gray-50 rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={furniture.image}
                    alt={furniture.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <p className="font-medium text-gray-900 text-sm">{furniture.name}</p>
                  <p className="text-blue-600 font-semibold text-sm">${furniture.price}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveImage}
                  disabled={!backgroundImage}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleShare}
                  disabled={!backgroundImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setShowPricing(!showPricing)}
                  disabled={furnitureItems.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <IndianRupee className="w-5 h-5" />
                  <span>Pricing</span>
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {!backgroundImage ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors min-h-[500px] flex items-center justify-center ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <Upload className="w-20 h-20 mx-auto text-gray-400" />
                    <div>
                      <p className="text-xl font-medium text-gray-900">
                        {isDragActive ? 'Drop room image here' : 'Upload your room image'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Drag and drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  ref={canvasRef}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleCanvasDrop}
                  className="relative overflow-hidden rounded-lg"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    minHeight: '500px'
                  }}
                >
                  <img
                    src={backgroundImage}
                    alt="Room"
                    className="w-full h-auto"
                    draggable={false}
                  />
                  
                  {/* Furniture Items */}
                  {furnitureItems.map(item => (
                    <div
                      key={item.uniqueId}
                      draggable
                      onDrag={(e) => handleItemDrag(e, item.uniqueId)}
                      onClick={() => setSelectedItem(item.uniqueId)}
                      className={`absolute cursor-move ${
                        selectedItem === item.uniqueId ? 'ring-4 ring-blue-500' : ''
                      }`}
                      style={{
                        left: item.x,
                        top: item.y,
                        width: item.width,
                        height: item.height,
                        transform: `rotate(${item.rotation}deg)`
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                        draggable={false}
                      />
                      
                      {selectedItem === item.uniqueId && (
                        <div className="absolute -top-10 left-0 right-0 flex gap-1 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRotateItem(item.uniqueId, 'ccw')
                            }}
                            className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            title="Rotate Counter-Clockwise (15°)"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRotateItem(item.uniqueId, 'cw')
                            }}
                            className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            title="Rotate Clockwise (15°)"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteItem(item.uniqueId)
                            }}
                            className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Panel */}
            {showPricing && furnitureItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Furniture Pricing
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {furnitureItems.map((item, index) => (
                    <div key={item.uniqueId} className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-700">
                        {index + 1}. {item.name}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">
                      ₹{calculateTotalPrice().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
