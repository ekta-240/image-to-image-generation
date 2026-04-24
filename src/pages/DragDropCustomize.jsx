import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Download, IndianRupee, Trash2, RotateCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
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

  const openFlipkart = (linksOrUrl) => {
    if (!linksOrUrl) return
    // Handle both string URL and object with flipkart key
    const url = typeof linksOrUrl === 'string' ? linksOrUrl : (linksOrUrl.flipkart || linksOrUrl.amazon)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedItem(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--bg-primary))' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'rgb(var(--color-coral))' }}></div>
          <p className="text-xl font-medium" style={{ color: 'rgb(var(--fg-secondary))' }}>Loading Furniture Library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'rgb(var(--bg-primary))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Drag &amp; Drop Customization</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>Customize your room with real products from the database</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 rounded-xl p-4 h-fit" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>Furniture Library</h2>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-base mb-4">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredFurniture.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'rgb(var(--fg-tertiary))' }}>
                  <p className="text-sm">No furniture in this category</p>
                </div>
              ) : (
                filteredFurniture.map(furniture => (
                  <div
                    key={furniture.dbId}
                    draggable
                    onDragStart={(e) => handleFurnitureDragStart(e, furniture)}
                    className="rounded-lg p-3 cursor-move transition-colors"
                    style={{ background: 'rgb(var(--bg-secondary))' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgb(var(--bg-tertiary))'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgb(var(--bg-secondary))'}
                  >
                    <div className="w-full h-24 rounded-md mb-2 overflow-hidden flex items-center justify-center" style={{ background: 'rgb(var(--bg-tertiary))' }}>
                      <img
                        src={furniture.image}
                        alt={furniture.name}
                        className="w-full h-24 object-contain rounded-md"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div
                        className="w-full h-24 rounded-md items-center justify-center text-center flex-col gap-1 hidden"
                        style={{ background: 'rgb(var(--bg-tertiary))', color: 'rgb(var(--fg-tertiary))' }}
                      >
                        <span className="text-2xl">🛋️</span>
                        <span className="text-xs">Image unavailable</span>
                      </div>
                    </div>
                    <p className="font-medium text-sm" style={{ color: 'rgb(var(--fg-primary))' }}>{furniture.name}</p>
                    <p className="font-semibold text-sm" style={{ color: 'rgb(var(--color-coral))' }}>₹{furniture.price.toLocaleString('en-IN')}</p>
                    {(furniture.links || furniture.flipkart) && (
                      <a
                        href={typeof (furniture.links || furniture.flipkart) === 'string' ? (furniture.links || furniture.flipkart) : ((furniture.links?.flipkart) || (furniture.links?.amazon))}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="mt-1 inline-block text-xs px-2 py-0.5 rounded text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                      >
                        View on Flipkart
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              <div className="flex gap-2 items-center">
                <button onClick={() => setScale(Math.max(0.5, scale - 0.1))} className="p-2 rounded-lg transition-colors" style={{ background: 'rgb(var(--bg-secondary))' }}><ZoomOut className="w-5 h-5" /></button>
                <button onClick={() => setScale(Math.min(2, scale + 0.1))} className="p-2 rounded-lg transition-colors" style={{ background: 'rgb(var(--bg-secondary))' }}><ZoomIn className="w-5 h-5" /></button>
                <span className="px-3 py-2 rounded-lg text-sm font-medium" style={{ background: 'rgb(var(--bg-secondary))', color: 'rgb(var(--fg-primary))' }}>{Math.round(scale * 100)}%</span>
              </div>
              {selectedItem && (
                 <div className="flex items-center gap-2">
                    <input type="range" min={MIN_ITEM_SIZE} max={MAX_ITEM_SIZE} 
                      value={furnitureItems.find(i => i.uniqueId === selectedItem)?.width || 150}
                      onChange={(e) => {
                        const it = furnitureItems.find(i => i.uniqueId === selectedItem)
                        if (it) setItemSize(selectedItem, parseInt(e.target.value), Math.round(parseInt(e.target.value) / (it.width / it.height)))
                      }}
                      style={{ accentColor: 'rgb(var(--color-coral))' }}
                    />
                 </div>
              )}
              <div className="flex gap-2">
                <button onClick={handleSaveImage} disabled={!backgroundImage} className="px-4 py-2 rounded-lg flex items-center gap-2 text-white transition-colors" style={{ background: 'rgb(var(--color-coral))' }}><Download className="w-5 h-5" />Save</button>
                <button onClick={() => setShowPricing(!showPricing)} className="px-4 py-2 rounded-lg flex items-center gap-2 text-white transition-colors" style={{ background: 'rgb(var(--color-navy))' }}><IndianRupee className="w-5 h-5" />Pricing</button>
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
              {!backgroundImage ? (
                <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer min-h-[500px] flex items-center justify-center transition-colors" style={{ borderColor: isDragActive ? 'rgb(var(--color-coral))' : 'rgb(var(--border-secondary))', background: isDragActive ? 'rgba(233,69,96,0.05)' : 'transparent' }}>
                  <input {...getInputProps()} />
                  <div><Upload className="w-20 h-20 mx-auto mb-4" style={{ color: 'rgb(var(--fg-tertiary))' }} /><p className="text-xl" style={{ color: 'rgb(var(--fg-secondary))' }}>Upload your room image</p></div>
                </div>
              ) : (
                <div ref={canvasRef} onDragOver={(e) => e.preventDefault()} onDrop={handleCanvasDrop} onMouseDown={(e) => e.target === e.currentTarget && setSelectedItem(null)} className="relative overflow-hidden rounded-lg" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', minHeight: '500px' }}>
                  <img src={backgroundImage} alt="Room" className="w-full h-auto pointer-events-none" draggable={false} />
                  {furnitureItems.map(item => (
                    <div key={item.uniqueId} draggable onDrag={(e) => handleItemDrag(e, item.uniqueId)} onClick={() => setSelectedItem(item.uniqueId)} onDoubleClick={() => openFlipkart(item.links)} className="absolute cursor-move" style={{ left: item.x, top: item.y, width: item.width, height: item.height, transform: `rotate(${item.rotation}deg)`, outline: selectedItem === item.uniqueId ? '3px solid rgb(var(--color-coral))' : 'none', outlineOffset: '2px' }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-lg shadow-lg" draggable={false} />
                      {selectedItem === item.uniqueId && (
                        <>
                          <div className="absolute -top-10 left-0 right-0 flex gap-1 justify-center">
                            <button onClick={(e) => { e.stopPropagation(); handleRotateItem(item.uniqueId, 'ccw') }} className="p-1 text-white rounded" style={{ background: 'rgb(var(--color-navy))' }}><RotateCcw className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleRotateItem(item.uniqueId, 'cw') }} className="p-1 text-white rounded" style={{ background: 'rgb(var(--color-navy))' }}><RotateCw className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); openFlipkart(item.links) }} className="px-2 py-1 text-white rounded text-xs" style={{ background: 'rgb(var(--color-coral))' }}>View</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.uniqueId) }} className="p-1 bg-red-600 text-white rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          {['nw','ne','sw','se'].map(c => (
                            <div key={c} onMouseDown={(e) => beginResize(e, item, c)} className={`absolute w-3 h-3 bg-white border ${c === 'nw' ? '-top-1 -left-1 cursor-nwse-resize' : c === 'ne' ? '-top-1 -right-1 cursor-nesw-resize' : c === 'sw' ? '-bottom-1 -left-1 cursor-nesw-resize' : '-bottom-1 -right-1 cursor-nwse-resize'}`} style={{ borderColor: 'rgb(var(--color-coral))' }} />
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showPricing && (
              <div className="rounded-xl p-6" style={{ background: 'rgb(var(--color-card))', border: '1px solid rgb(var(--color-card-border))', boxShadow: 'var(--shadow-base)' }}>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>Pricing</h3>
                {furnitureItems.map((item, i) => (
                  <div key={item.uniqueId} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgb(var(--border-primary))', color: 'rgb(var(--fg-primary))' }}>
                    <span>{i + 1}. {item.name}</span>
                    <span className="font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xl font-bold mt-4" style={{ color: 'rgb(var(--fg-primary))' }}><span>Total</span><span style={{ color: 'rgb(var(--color-coral))' }}>₹{calculateTotalPrice().toLocaleString('en-IN')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}