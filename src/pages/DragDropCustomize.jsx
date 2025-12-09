import { useState, useCallback, useRef, useEffect } from 'react'
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

  // Toggle to make single-click open Flipkart (default: false = select on single-click)
  const OPEN_ON_SINGLE_CLICK = false

  // --- Resizing snapshot state (stable) ---
  // { id, corner, origX, origY, origW, origH, startMouseX, startMouseY, aspect }
  const [resizing, setResizing] = useState(null)
  const MIN_ITEM_SIZE = 60
  const MAX_ITEM_SIZE = 600

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

  // --- Library (15 essentials, Flipkart links) ---
  const furnitureLibrary = [
    { id: 'sofa', name: 'Modern Sofa', category: 'Seating', price: 7055, image: '/assets/sofa.png', links: 'https://www.flipkart.com/chandrika-enterprises-contemporary-fabric-2-seater-sofa/p/itm5015be0c98c05?pid=SOFGCGPEGBVYKUJF&lid=LSTSOFGCGPEGBVYKUJFEU0N9B&marketplace=FLIPKART&q=modern+sofa&store=wwe%2Fc3z&srno=s_1_13&otracker=search&fm=organic&iid=bb85760d-1eac-46e8-a474-a921b7aadec8.SOFGCGPEGBVYKUJF.SEARCH&ppt=sp&ppn=sp&ssid=ceedcpf8lc0000001765253044761&qH=3c281ee50eb55715' },
    { id: 'armchair', name: 'Armchair', category: 'Seating', price: 7989, image: '/assets/armchair.png', links: 'https://www.flipkart.com/chairtech-leatherette-office-adjustable-arm-chair/p/itm0b4b20678cea2?pid=OSCH9NNEF5PPHHD6&lid=LSTOSCH9NNEF5PPHHD6UTZYMD&marketplace=FLIPKART&q=armchair&store=wwe%2Fy7b&srno=s_1_20&otracker=search&fm=organic&iid=637e0632-73e5-4fcd-8495-3269e14df367.OSCH9NNEF5PPHHD6.SEARCH&ppt=sp&ppn=sp&qH=7d7ad4cff5c999a8' },
    { id: 'coffee_table', name: 'Coffee Table', category: 'Tables', price: 1499, image: '/assets/coffee_table.png', links: 'https://www.flipkart.com/online-decor-shoppee-aaira-crafts-round-modern-marble-design-coffee-table-living-room-engineered-wood/p/itma46992f9c71d1?pid=CFTGWUBJZQTHHFAX&lid=LSTCFTGWUBJZQTHHFAX23WTAI&marketplace=FLIPKART&q=coffee+table&store=wwe%2Fki7%2Fot1&spotlightTagId=default_FkPickId_wwe%2Fki7%2Fot1&srno=s_1_3&otracker=search&fm=organic&iid=b98d9fd4-7b2a-46c9-900a-f773427d0002.CFTGWUBJZQTHHFAX.SEARCH&ppt=sp&ppn=sp&ssid=4qxgpt53g00000001765253725494&qH=97a3439baa7bdfe9' },
    { id: 'side_table', name: 'Side Table', category: 'Tables', price: 4499, image: '/assets/side_table.png', links: 'https://www.flipkart.com/globia-creations-engineered-wood-bedside-table/p/itm7637d465b2713?pid=SITFWCZVVKPR68J2&lid=LSTSITFWCZVVKPR68J2PW6FLZ&marketplace=FLIPKART&q=side+table&store=wwe%2Fki7%2Fyso&srno=s_2_61&otracker=search&fm=organic&iid=651e1887-6b95-41fb-851b-7ef2249f58fb.SITFWCZVVKPR68J2.SEARCH&ppt=sp&ppn=sp&qH=e1ed857aaff58f11' },
    { id: 'floor_lamp', name: 'Floor Lamp', category: 'Lighting', price: 1399, image: '/assets/floor_lamp.png', links: 'https://www.flipkart.com/flipkart-perfect-homes-tripod-floor-lamp/p/itm437d3d5272cda?pid=FIOH92DFTGDMXGYP&lid=LSTFIOH92DFTGDMXGYPDTDRMQ&marketplace=FLIPKART&q=floor+lamp&store=jhg%2F6w8%2Fikw&srno=s_1_5&otracker=search&fm=organic&iid=b85a08de-beb4-4865-b796-89d608850e9e.FIOH92DFTGDMXGYP.SEARCH&ppt=sp&ppn=sp&ssid=8tq7mlea0w0000001765254377798&qH=e72038b0459fc0a4' },
    { id: 'table_lamp', name: 'Table Lamp', category: 'Lighting', price: 436, image: '/assets/table_lamp.png', links: 'https://www.flipkart.com/homesake-retro-matt-metal-table-lamp-off-white-fabric-cone-bedroom-living-room-lamp/p/itm8dee2c642a3d7?pid=TLPH8WUBRGSK6XBA&lid=LSTTLPH8WUBRGSK6XBAVFQHFE&marketplace=FLIPKART&q=table+lamp&store=jhg%2F6w8%2Fgde&srno=s_1_33&otracker=search&fm=organic&iid=14230478-00a0-4cfd-9db0-5b3bfe1d6e25.TLPH8WUBRGSK6XBA.SEARCH&ppt=sp&ppn=sp&ssid=r0v0b8zvpc0000001765254598610&qH=8accf1a968c3576a' },
    { id: 'bed', name: 'Bed', category: 'Bedroom', price: 12499, image: '/assets/bed.png', links: 'https://www.flipkart.com/flipkart-perfect-homes-opus-engineered-wood-king-box-bed/p/itm7b85ec40e7073?pid=BDDHDVJCQ9XSHX9F&lid=LSTBDDHDVJCQ9XSHX9FEF9DI6&marketplace=FLIPKART&q=bed&store=wwe&srno=s_1_7&otracker=search&fm=organic&iid=91aff01e-0569-4582-b1db-daa6b0a5cd44.BDDHDVJCQ9XSHX9F.SEARCH&ppt=sp&ppn=sp&ssid=1wabmn5o4w0000001765254773476&qH=001cbc059a402b3b' },
    { id: 'nightstand', name: 'Nightstand', category: 'Bedroom', price:3649, image: '/assets/nightstand.png', links: 'https://www.flipkart.com/true-furniture-sheesham-wood-3-drawer-bed-side-table-night-stand-table-solid/p/itm7a0dbbd76ccb0?pid=SITGUFZWGDYY6SNG&lid=LSTSITGUFZWGDYY6SNGZIYAF4&marketplace=FLIPKART&q=nightstand&store=search.flipkart.com&srno=s_1_7&otracker=search&otracker1=search&fm=Search&iid=7c793ac7-cf49-4ac2-9d0e-751203921c6c.SITGUFZWGDYY6SNG.SEARCH&ppt=sp&ppn=sp&ssid=8c07jzv2xc0000001765254839736&qH=c8e0b8a9684caf64' },
    { id: 'bookshelf', name: 'Bookshelf', category: 'Storage', price: 1753, image: '/assets/bookshelf.png', links: 'https://www.flipkart.com/ew-wooden-large-4-tier-open-bookshelf-rack-showcase-organizer-living-study-room-engineered-wood-book-shelf/p/itm53202f094407e?pid=BSFHD5UZ4QCMTFHA&lid=LSTBSFHD5UZ4QCMTFHAJLBRZ4&marketplace=FLIPKART&q=bookshelf&store=wwe%2Fvmc%2F1qe&srno=s_1_3&otracker=search&otracker1=search&fm=Search&iid=d6ae03c5-138c-48a4-b2af-c9674db33e13.BSFHD5UZ4QCMTFHA.SEARCH&ppt=sp&ppn=sp&ssid=48b2bj9uqo0000001765254879992&qH=b75624ce7f285ca1' },
    { id: 'tv_stand', name: 'TV Stand', category: 'Storage', price: 999, image: '/assets/tv_stand.png', links: 'https://www.flipkart.com/home-wood-engineered-tv-entertainment-unit/p/itm6c9f487c4f2cb?pid=TVUGEUGCKTEUDHRM&lid=LSTTVUGEUGCKTEUDHRM7B3BL3&marketplace=FLIPKART&q=tv+stand&store=wwe%2F243%2Fkoe&srno=s_1_13&otracker=search&otracker1=search&fm=Search&iid=c18e8b42-a8b2-4fa9-b8c1-b1eda005dbaa.TVUGEUGCKTEUDHRM.SEARCH&ppt=sp&ppn=sp&ssid=iik1kf7bhc0000001765254993775&qH=02e2ee73299f55c5' },
    { id: 'plant', name: 'Decorative Plant', category: 'Decor', price: 295, image: '/assets/plant.png', links: 'https://www.flipkart.com/reiki-crystal-products-artificial-plants-pot-home-office-decoration-dinning-table-bedroom-etc-bonsai-wild-plant-pot/p/itm93541338a601c?pid=ARPFZH8MMAHKJXWT&lid=LSTARPFZH8MMAHKJXWTQCIZAF&marketplace=FLIPKART&q=decorative+plant&store=arb%2Fg0v%2F6vh&srno=s_1_16&otracker=search&otracker1=search&fm=Search&iid=57a8e679-8765-4bc9-809c-a6ae6f80b960.ARPFZH8MMAHKJXWT.SEARCH&ppt=sp&ppn=sp&ssid=o0tbmcbgds0000001765255173963&qH=01206f6d4a03d3df' },
    { id: 'wall_art', name: 'Wall Art', category: 'Decor', price: 871, image: '/assets/wall_art.png', links: 'https://www.flipkart.com/zahara-metal-wall-art-set-3-deer-hanging-home-office-living-room-pack/p/itm97d74e99d0833?pid=WDCGTSJ7MPX9V4C5&lid=LSTWDCGTSJ7MPX9V4C5DT3CSJ&marketplace=FLIPKART&q=wall+art&store=arb&srno=s_1_16&otracker=search&otracker1=search&fm=Search&iid=cd8d4715-32f0-49dd-8cc4-9d0e58ad67eb.WDCGTSJ7MPX9V4C5.SEARCH&ppt=sp&ppn=sp&ssid=rvx6gw4z0g0000001765256258855&qH=3d1d9718cd6df6fc' },
    { id: 'rug', name: 'Area Rug', category: 'Decor', price: 2674, image: '/assets/rug.png', links: 'https://www.flipkart.com/shag-weaving-4-ft-x-6-polyester-carpet/p/itm4b03a86d8b9e0?pid=CPGGFSQW8ESZHHMV&lid=LSTCPGGFSQW8ESZHHMVREDZHT&marketplace=FLIPKART&q=rug&store=jra%2Fkwq%2Fz3j&srno=s_1_4&otracker=search&otracker1=search&fm=Search&iid=e0335db6-f050-4ba7-a5b3-9adce59718ba.CPGGFSQW8ESZHHMV.SEARCH&ppt=sp&ppn=sp&ssid=0vvu4yzh680000001765256039515&qH=717de68e813c2596' },
    { id: 'dining_table', name: 'Dining Table', category: 'Dining', price: 1291, image: '/assets/dining_table.png', links: 'https://www.flipkart.com/euroqon-space-saver-foldable-imported-wood-engineered-4-seater-dining-table/p/itm0ef8ab00ef975?pid=DNTGKDGFFYFPGW8U&lid=LSTDNTGKDGFFYFPGW8UT15TXA&marketplace=FLIPKART&q=dining+table&store=wwe%2Fur9&spotlightTagId=default_FkPickId_wwe%2Fur9&srno=s_1_3&otracker=search&otracker1=search&fm=Search&iid=6260db42-523c-4363-92f1-fe050cd4d2cb.DNTGKDGFFYFPGW8U.SEARCH&ppt=sp&ppn=sp&ssid=2myjyxrib40000001765256056831&qH=8eb0b3aa74071f8b' },
    { id: 'desk', name: 'Office Desk', category: 'Office', price: 1398, image: '/assets/desk.png', links: 'https://www.flipkart.com/limraz-furniture-engineered-wood-computer-desk/p/itm9bc4aa1538e18?pid=CPTFZZKBZWYTUZYA&lid=LSTCPTFZZKBZWYTUZYAHRENIT&marketplace=FLIPKART&q=desk&store=wwe&srno=s_1_9&otracker=search&otracker1=search&fm=Search&iid=d49cb5ab-5a1d-4923-91b5-7f7aa70934de.CPTFZZKBZWYTUZYA.SEARCH&ppt=sp&ppn=sp&qH=b506e098cf253ce0' },
  ]

  const categories = ['All', 'Seating', 'Tables', 'Lighting', 'Bedroom', 'Storage', 'Decor', 'Dining', 'Office']
  const [selectedCategory, setSelectedCategory] = useState('All')

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
      uniqueId: `${furniture.id}-${Date.now()}`,
      x,
      y,
      width: 150,
      height: 150,
      rotation: 0
    }

    setFurnitureItems(prev => [...prev, newItem])
    setSelectedItem(null) // optional: clear selection on new drop
  }

  // Drag within canvas (only when selected)
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
          await navigator.share({ files: [file], title: 'My Custom Room Design', text: 'Check out my custom room design created with Homelytics!' })
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

  // ---------- Begin resize (snapshot) ----------
  const beginResize = (e, item, corner) => {
    e.stopPropagation()
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const startMouseX = (e.clientX - rect.left) / scale
    const startMouseY = (e.clientY - rect.top) / scale

    setResizing({
      id: item.uniqueId,
      corner,
      origX: item.x,
      origY: item.y,
      origW: item.width,
      origH: item.height,
      startMouseX,
      startMouseY,
      aspect: item.width / item.height,
    })
  }

  // ---------- Mouse move during resize (stable, keep aspect) ----------
  const onWindowMouseMove = useCallback((e) => {
    if (!resizing || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / scale
    const mouseY = (e.clientY - rect.top) / scale

    const {
      id, corner,
      origX, origY, origW, origH,
      startMouseX, startMouseY, aspect
    } = resizing

    const dx = mouseX - startMouseX
    const dy = mouseY - startMouseY

    let newX = origX
    let newY = origY
    let newW = origW
    let newH = origH

    switch (corner) {
      case 'se':
        newW = origW + dx
        newH = origH + dy
        break
      case 'sw':
        newW = origW - dx
        newH = origH + dy
        newX = origX + dx
        break
      case 'ne':
        newW = origW + dx
        newH = origH - dy
        newY = origY + dy
        break
      case 'nw':
        newW = origW - dx
        newH = origH - dy
        newX = origX + dx
        newY = origY + dy
        break
      default:
        break
    }

    // Keep aspect
    const byWidthH = newW / aspect
    const byHeightW = newH * aspect
    if (Math.abs(byWidthH - newH) < Math.abs(byHeightW - newW)) {
      const oldH = newH
      newH = byWidthH
      if (corner === 'ne' || corner === 'nw') newY += (oldH - newH)
    } else {
      const oldW = newW
      newW = byHeightW
      if (corner === 'sw' || corner === 'nw') newX += (oldW - newW)
    }

    newW = Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, newW))
    newH = Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, newH))

    setItemSize(id, newW, newH, newX, newY)
  }, [resizing, scale])

  const onWindowMouseUp = useCallback(() => setResizing(null), [])

  useEffect(() => {
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', onWindowMouseUp)
    }
  }, [onWindowMouseMove, onWindowMouseUp])

  // ---------- Open Flipkart ----------
  const openFlipkart = (url) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // ---------- Clear selection with Esc ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
          {/* Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Furniture Library</h2>

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
                    className="w-full h-24 object-contain rounded-md mb-2"
                  />
                  <p className="font-medium text-gray-900 text-sm">{furniture.name}</p>
                  <p className="text-blue-600 font-semibold text-sm">₹{furniture.price.toLocaleString('en-IN')}</p>
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
              <div className="flex gap-2 items-center">
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

              {/* Size slider for selected item */}
              {selectedItem && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Size</span>
                  <input
                    type="range"
                    min={MIN_ITEM_SIZE}
                    max={MAX_ITEM_SIZE}
                    value={(() => {
                      const it = furnitureItems.find(i => i.uniqueId === selectedItem)
                      return it ? Math.round(it.width) : 150
                    })()}
                    onChange={(e) => {
                      const it = furnitureItems.find(i => i.uniqueId === selectedItem)
                      if (!it) return
                      const newW = parseInt(e.target.value, 10)
                      const newH = Math.round(newW / (it.width / it.height)) // keep aspect
                      setItemSize(selectedItem, newW, newH)
                    }}
                    className="w-40"
                  />
                  <button
                    onClick={() => resizeByFactor(selectedItem, 0.9)}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    title="Shrink 10%"
                  >
                    –
                  </button>
                  <button
                    onClick={() => resizeByFactor(selectedItem, 1.1)}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    title="Grow 10%"
                  >
                    +
                  </button>
                </div>
              )}

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
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <Upload className="w-20 h-20 mx-auto text-gray-400" />
                    <div>
                      <p className="text-xl font-medium text-gray-900">
                        {isDragActive ? 'Drop room image here' : 'Upload your room image'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Drag and drop or click to browse</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  ref={canvasRef}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleCanvasDrop}
                  onMouseDown={(e) => {
                    // Clear selection only if clicking empty space (the container itself)
                    if (e.target === e.currentTarget) setSelectedItem(null)
                  }}
                  className="relative overflow-hidden rounded-lg"
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top left', minHeight: '500px' }}
                >
                  <img
                    src={backgroundImage}
                    alt="Room"
                    className="w-full h-auto pointer-events-none"  // ← allow clicks to pass through to container
                    draggable={false}
                  />

                  {/* Placed Items */}
                  {furnitureItems.map(item => (
                    <div
                      key={item.uniqueId}
                      draggable
                      onDrag={(e) => handleItemDrag(e, item.uniqueId)}
                      onClick={() => {
                        if (OPEN_ON_SINGLE_CLICK) openFlipkart(item.links)
                        else setSelectedItem(item.uniqueId)
                      }}
                      onDoubleClick={() => openFlipkart(item.links)}
                      className={`absolute cursor-move ${selectedItem === item.uniqueId ? 'ring-4 ring-blue-500' : ''}`}
                      style={{
                        left: item.x,
                        top: item.y,
                        width: item.width,
                        height: item.height,
                        transform: `rotate(${item.rotation}deg)`
                      }}
                      title="Double-click to open Flipkart"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-lg shadow-lg"
                        draggable={false}
                      />

                      {/* Price badge REMOVED here */}

                      {selectedItem === item.uniqueId && (
                        <>
                          {/* Top toolbar */}
                          <div className="absolute -top-10 left-0 right-0 flex gap-1 justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRotateItem(item.uniqueId, 'ccw') }}
                              className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              title="Rotate Counter-Clockwise (15°)"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRotateItem(item.uniqueId, 'cw') }}
                              className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              title="Rotate Clockwise (15°)"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>

                            {/* View on Flipkart */}
                            <button
                              onClick={(e) => { e.stopPropagation(); openFlipkart(item.links) }}
                              className="px-2 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
                              title="Open Flipkart"
                            >
                              View
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.uniqueId) }}
                              className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Corner resize handles */}
                          {['nw','ne','sw','se'].map(corner => (
                            <div
                              key={corner}
                              onMouseDown={(e) => beginResize(e, item, corner)}
                              className={`absolute w-3 h-3 bg-white border border-blue-600 rounded-sm shadow
                                ${corner === 'nw' ? '-top-1 -left-1 cursor-nwse-resize' : ''}
                                ${corner === 'ne' ? '-top-1 -right-1 cursor-nesw-resize' : ''}
                                ${corner === 'sw' ? '-bottom-1 -left-1 cursor-nesw-resize' : ''}
                                ${corner === 'se' ? '-bottom-1 -right-1 cursor-nwse-resize' : ''}`}
                            />
                          ))}
                        </>
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Furniture Pricing</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {furnitureItems.map((item, index) => (
                    <div key={item.uniqueId} className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-700">{index + 1}. {item.name}</span>
                      <span className="font-semibold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">₹{calculateTotalPrice().toLocaleString('en-IN')}</span>
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