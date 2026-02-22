import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Download, Share2, IndianRupee, Trash2, RotateCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import html2canvas from 'html2canvas'

// --- FIREBASE IMPORTS ---
import { db } from '../firebase' // Adjust path based on your folder structure
import { collection, getDocs } from 'firebase/firestore'

export default function DragDropCustomize() {
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [furnitureItems, setFurnitureItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPricing, setShowPricing] = useState(false)
  const canvasRef = useRef(null)
  const [scale, setScale] = useState(1)

  // --- NEW DATABASE STATES ---
  const [furnitureLibrary, setFurnitureLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const OPEN_ON_SINGLE_CLICK = false
  const [resizing, setResizing] = useState(null)
  const MIN_ITEM_SIZE = 60
  const MAX_ITEM_SIZE = 600

  // --- FETCH FROM DATABASE ---
  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "furniture"));
        const items = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          dbId: doc.id // Store the firestore document ID
        }));
        setFurnitureLibrary(items);
      } catch (error) {
        console.error("Error fetching furniture library:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  const setItemSize = (itemId, newW, newH, newX, newY) => {
    setFurnitureItems(items =>
      items.map(it =>
        it.uniqueId === itemId
          ? {
              ...it,
              width: Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, newW)),
              height: Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, newH)),
              x: newX ?? it.x,
              y: newY ?? it.y,
            }
          : it
      )
    )
  }

  const resizeByFactor = (itemId, factor) => {
    setFurnitureItems(items => {
      const target = items.find(it => it.uniqueId === itemId)
      if (!target) return items
      const newW = target.width * factor
      const newH = target.height * factor
      return items.map(it =>
        it.uniqueId === itemId
          ? {
              ...it,
              width: Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, newW)),
              height: Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, newH)),
            }
          : it
      )
    })
  }

  const categories = ['All', 'Seating', 'Tables', 'Lighting', 'Bedroom', 'Storage', 'Decor', 'Dining', 'Office']

  // Background upload
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setBackgroundImage(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false
  })

  // Drag from library
  const handleFurnitureDragStart = (e, furniture) => {
    e.dataTransfer.setData('furniture', JSON.stringify(furniture))
  }

  // Drop to canvas
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
      uniqueId: `${furniture.id || 'item'}-${Date.now()}`,
      x,
      y,
      width: 150,
      height: 150,
      rotation: 0
    }

    setFurnitureItems(prev => [...prev, newItem])
    setSelectedItem(null)
  }

  // Drag within canvas
  const handleItemDrag = (e, itemId) => {
    if (!selectedItem || selectedItem !== itemId) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setFurnitureItems(items =>
      items.map(item =>
        item.uniqueId === itemId ? { ...item, x: x - item.width / 2, y: y - item.height / 2 } : item
      )
    )
  }

  const handleDeleteItem = (itemId) => {
    setFurnitureItems(items => items.filter(item => item.uniqueId !== itemId))
    if (selectedItem === itemId) setSelectedItem(null)
  }

  const handleRotateItem = (itemId, direction = 'cw') => {
    setFurnitureItems(items =>
      items.map(item =>
        item.uniqueId === itemId
          ? {
              ...item,
              rotation: direction === 'cw'
                ? (item.rotation + 15) % 360
                : (item.rotation - 15 + 360) % 360
            }
          : item
      )
    )
  }

  const calculateTotalPrice = () => furnitureItems.reduce((sum, item) => sum + item.price, 0)

  const handleSaveImage = async () => {
    if (!canvasRef.current) return
    try {
      const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 2 })
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
      const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 2 })
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'room-design.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'My Room Design', text: 'Created with Homelytics!' })
        } else {
          await navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }
      })
    } catch (error) { console.error('Share error:', error) }
  }

  const filteredFurniture = selectedCategory === 'All'
    ? furnitureLibrary
    : furnitureLibrary.filter(item => item.category === selectedCategory)

  const beginResize = (e, item, corner) => {
    e.stopPropagation()
    const rect = canvasRef.current.getBoundingClientRect()
    const startMouseX = (e.clientX - rect.left) / scale
    const startMouseY = (e.clientY - rect.top) / scale
    setResizing({
      id: item.uniqueId, corner, origX: item.x, origY: item.y,
      origW: item.width, origH: item.height, startMouseX, startMouseY,
      aspect: item.width / item.height,
    })
  }

  const onWindowMouseMove = useCallback((e) => {
    if (!resizing || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / scale
    const mouseY = (e.clientY - rect.top) / scale
    const { id, corner, origX, origY, origW, origH, startMouseX, startMouseY, aspect } = resizing
    const dx = mouseX - startMouseX
    const dy = mouseY - startMouseY
    let newX = origX, newY = origY, newW = origW, newH = origH

    switch (corner) {
      case 'se': newW = origW + dx; newH = origH + dy; break
      case 'sw': newW = origW - dx; newH = origH + dy; newX = origX + dx; break
      case 'ne': newW = origW + dx; newH = origH - dy; newY = origY + dy; break
      case 'nw': newW = origW - dx; newH = origH - dy; newX = origX + dx; newY = origY + dy; break
      default: break
    }

    const byWidthH = newW / aspect
    const byHeightW = newH * aspect
    if (Math.abs(byWidthH - newH) < Math.abs(byHeightW - newW)) {
      const oldH = newH; newH = byWidthH
      if (corner === 'ne' || corner === 'nw') newY += (oldH - newH)
    } else {
      const oldW = newW; newW = byHeightW
      if (corner === 'sw' || corner === 'nw') newX += (oldW - newW)
    }
    setItemSize(id, newW, newH, newX, newY)
  }, [resizing, scale])

  useEffect(() => {
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', () => setResizing(null))
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', () => setResizing(null))
    }
  }, [onWindowMouseMove])

  const openFlipkart = (url) => { if (url) window.open(url, '_blank', 'noopener,noreferrer') }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedItem(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-600">Loading Furniture Library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Drag & Drop Customization</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Customize your room with real products from the database</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 h-fit">
            <h2 className="text-xl font-semibold mb-4">Furniture Library</h2>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-4">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredFurniture.map(furniture => (
                <div key={furniture.dbId} draggable onDragStart={(e) => handleFurnitureDragStart(e, furniture)} className="bg-gray-50 rounded-lg p-3 cursor-move hover:bg-gray-100">
                  <img src={furniture.image} alt={furniture.name} className="w-full h-24 object-contain rounded-md mb-2" />
                  <p className="font-medium text-sm">{furniture.name}</p>
                  <p className="text-blue-600 font-semibold text-sm">₹{furniture.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2 items-center">
                <button onClick={() => setScale(Math.max(0.5, scale - 0.1))} className="p-2 bg-gray-100 rounded-lg"><ZoomOut className="w-5 h-5" /></button>
                <button onClick={() => setScale(Math.min(2, scale + 0.1))} className="p-2 bg-gray-100 rounded-lg"><ZoomIn className="w-5 h-5" /></button>
                <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">{Math.round(scale * 100)}%</span>
              </div>
              {selectedItem && (
                 <div className="flex items-center gap-2">
                    <input type="range" min={MIN_ITEM_SIZE} max={MAX_ITEM_SIZE} 
                      value={furnitureItems.find(i => i.uniqueId === selectedItem)?.width || 150}
                      onChange={(e) => {
                        const it = furnitureItems.find(i => i.uniqueId === selectedItem)
                        if (it) setItemSize(selectedItem, parseInt(e.target.value), Math.round(parseInt(e.target.value) / (it.width / it.height)))
                      }}
                    />
                 </div>
              )}
              <div className="flex gap-2">
                <button onClick={handleSaveImage} disabled={!backgroundImage} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><Download className="w-5 h-5" />Save</button>
                <button onClick={() => setShowPricing(!showPricing)} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><IndianRupee className="w-5 h-5" />Pricing</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {!backgroundImage ? (
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer min-h-[500px] flex items-center justify-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <input {...getInputProps()} />
                  <div><Upload className="w-20 h-20 mx-auto text-gray-400" /><p className="text-xl mt-4">Upload your room image</p></div>
                </div>
              ) : (
                <div ref={canvasRef} onDragOver={(e) => e.preventDefault()} onDrop={handleCanvasDrop} onMouseDown={(e) => e.target === e.currentTarget && setSelectedItem(null)} className="relative overflow-hidden rounded-lg" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', minHeight: '500px' }}>
                  <img src={backgroundImage} alt="Room" className="w-full h-auto pointer-events-none" draggable={false} />
                  {furnitureItems.map(item => (
                    <div key={item.uniqueId} draggable onDrag={(e) => handleItemDrag(e, item.uniqueId)} onClick={() => setSelectedItem(item.uniqueId)} onDoubleClick={() => openFlipkart(item.links)} className={`absolute cursor-move ${selectedItem === item.uniqueId ? 'ring-4 ring-blue-500' : ''}`} style={{ left: item.x, top: item.y, width: item.width, height: item.height, transform: `rotate(${item.rotation}deg)` }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-lg shadow-lg" draggable={false} />
                      {selectedItem === item.uniqueId && (
                        <>
                          <div className="absolute -top-10 left-0 right-0 flex gap-1 justify-center">
                            <button onClick={(e) => { e.stopPropagation(); handleRotateItem(item.uniqueId, 'ccw') }} className="p-1 bg-blue-600 text-white rounded"><RotateCcw className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleRotateItem(item.uniqueId, 'cw') }} className="p-1 bg-blue-600 text-white rounded"><RotateCw className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); openFlipkart(item.links) }} className="px-2 py-1 bg-amber-500 text-white rounded text-xs">View</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.uniqueId) }} className="p-1 bg-red-600 text-white rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          {['nw','ne','sw','se'].map(c => (
                            <div key={c} onMouseDown={(e) => beginResize(e, item, c)} className={`absolute w-3 h-3 bg-white border border-blue-600 ${c === 'nw' ? '-top-1 -left-1 cursor-nwse-resize' : c === 'ne' ? '-top-1 -right-1 cursor-nesw-resize' : c === 'sw' ? '-bottom-1 -left-1 cursor-nesw-resize' : '-bottom-1 -right-1 cursor-nwse-resize'}`} />
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showPricing && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Pricing</h3>
                {furnitureItems.map((item, i) => (
                  <div key={item.uniqueId} className="flex justify-between border-b py-2">
                    <span>{i + 1}. {item.name}</span>
                    <span className="font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xl font-bold mt-4"><span>Total</span><span className="text-blue-600">₹{calculateTotalPrice().toLocaleString('en-IN')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}