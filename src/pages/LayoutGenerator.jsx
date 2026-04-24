import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import { Building2, Download, Loader2, Ruler, Sparkles, Wand2 } from 'lucide-react'

const ROOM_OPTIONS = ['Let AI Decide', 'Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa']
const BACKEND_URL = 'http://localhost:5000/api/generate-layout'

export default function LayoutGenerator() {
  const [totalArea, setTotalArea] = useState('')
  const [roomCount, setRoomCount] = useState('Let AI Decide')
  const [layouts, setLayouts] = useState([])
  const [promptUsed, setPromptUsed] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!totalArea || Number(totalArea) <= 0) {
      setError('Enter a valid total area in square feet to generate layouts.')
      return
    }

    setIsGenerating(true)
    setError('')
    setLayouts([])

    try {
      const response = await axios.post(BACKEND_URL, {
        total_area: Number(totalArea),
        room_count: roomCount === 'Let AI Decide' ? null : roomCount,
      })

      setLayouts(response.data.images || [])
      setPromptUsed(response.data.prompt || '')
    } catch (requestError) {
      console.error('Layout generation error:', requestError)
      setError(requestError.response?.data?.error || 'Failed to generate layouts. Make sure the backend server is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (image, index) => {
    const link = document.createElement('a')
    link.href = image
    link.download = `homelytics-layout-${index + 1}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'rgb(var(--bg-primary))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm" style={{ border: '1px solid rgb(var(--color-coral) / 0.25)', background: 'rgb(var(--color-card) / 0.9)', color: 'rgb(var(--color-coral))', backdropFilter: 'blur(8px)' }}>
            <Building2 className="h-4 w-4" />
            2D Layout Generator
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
            <span className="gradient-text">Generate four floor plan directions in one pass</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl" style={{ color: 'rgb(var(--fg-secondary))' }}>
            Enter the total area, optionally lock the room count, and let Homelytics draft blueprint-style plan options for quick concept exploration.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-[32px] shadow-xl backdrop-blur"
            style={{ border: '1px solid rgb(var(--color-card-border))', background: 'rgb(var(--color-card) / 0.92)' }}
          >
            <div className="border-b px-6 py-5" style={{ borderColor: 'rgb(var(--color-card-border))', background: 'linear-gradient(135deg, rgb(var(--color-coral) / 0.15), rgb(var(--bg-tertiary) / 0.8))' }}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl p-3" style={{ background: 'rgb(var(--color-coral) / 0.20)' }}>
                  <Wand2 className="h-6 w-6" style={{ color: 'rgb(var(--color-coral))' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>Plan Inputs</h2>
                  <p className="text-sm" style={{ color: 'rgb(var(--fg-secondary))' }}>Optimized for blueprint-style ideation and quick comparisons.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label htmlFor="total-area" className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(var(--fg-primary))' }}>
                  <Ruler className="h-4 w-4" style={{ color: 'rgb(var(--color-coral))' }} />
                  Total Area (sq ft)
                </label>
                <input
                  id="total-area"
                  type="number"
                  min="100"
                  step="10"
                  value={totalArea}
                  onChange={(event) => setTotalArea(event.target.value)}
                  placeholder="e.g. 1200"
                  className="input-base w-full rounded-2xl px-4 py-3 text-lg font-medium outline-none transition"
                  style={{
                    border: '1px solid rgb(var(--color-card-border))',
                    background: 'rgb(var(--bg-secondary))',
                    color: 'rgb(var(--fg-primary))',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgb(var(--color-coral))'; e.target.style.background = 'rgb(var(--color-card))'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.10)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgb(var(--color-card-border))'; e.target.style.background = 'rgb(var(--bg-secondary))'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label htmlFor="room-count" className="mb-2 block text-sm font-semibold" style={{ color: 'rgb(var(--fg-primary))' }}>
                  Room Count
                </label>
                <select
                  id="room-count"
                  value={roomCount}
                  onChange={(event) => setRoomCount(event.target.value)}
                  className="input-base w-full rounded-2xl px-4 py-3 text-lg font-medium outline-none transition"
                  style={{
                    border: '1px solid rgb(var(--color-card-border))',
                    background: 'rgb(var(--bg-secondary))',
                    color: 'rgb(var(--fg-primary))',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgb(var(--color-coral))'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.10)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgb(var(--color-card-border))'; e.target.style.boxShadow = 'none'; }}
                >
                  {ROOM_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--color-coral) / 0.08), rgb(var(--bg-secondary) / 0.8))' }}>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5" style={{ color: 'rgb(var(--color-coral))' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: 'rgb(var(--fg-primary))' }}>What the model will aim for</h3>
                    <p className="mt-1 text-sm" style={{ color: 'rgb(var(--fg-secondary))' }}>
                      Top-down residential layouts, sharp wall lines, furniture hints, readable circulation, and four distinct plan directions returned together.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: isGenerating ? 1 : 1.01 }}
                whileTap={{ scale: isGenerating ? 1 : 0.99 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-lg font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: isGenerating ? 'rgb(var(--bg-tertiary))' : 'rgb(var(--color-coral))', color: isGenerating ? 'rgb(var(--fg-tertiary))' : '#fff' }}
              >
                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Building2 className="h-5 w-5" />}
                {isGenerating ? 'Generating 4 layout options...' : 'Generate Layouts'}
              </motion.button>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-2xl px-4 py-3 text-sm font-medium"
                    style={{
                      background: 'rgba(239,68,68,0.10)',
                      border: '1px solid rgba(239,68,68,0.30)',
                      color: 'rgb(239 68 68)',
                    }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-[32px] p-6 backdrop-blur"
            style={{ border: '1px solid rgb(var(--color-card-border))', background: 'rgb(var(--color-card) / 0.88)', boxShadow: 'var(--shadow-xl)' }}
          >
            <div className="mb-6 flex flex-col gap-3 pb-5 sm:flex-row sm:items-end sm:justify-between" style={{ borderBottom: '1px solid rgb(var(--color-card-border))' }}>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>Generated Options</h2>
                <p className="text-sm" style={{ color: 'rgb(var(--fg-secondary))' }}>
                  {/* The API returns four PNG layouts as base64 strings and each card can be downloaded directly. */}
                </p>
              </div>
              {promptUsed && (
                <div className="max-w-xl rounded-2xl px-4 py-3 text-xs font-medium leading-6" style={{ background: 'rgb(var(--bg-secondary))', color: 'rgb(var(--fg-secondary))' }}>
                  Prompt: {promptUsed}
                </div>
              )}
            </div>

            {layouts.length === 0 ? (
              <div className="grid min-h-[520px] place-items-center rounded-[28px] p-8 text-center" style={{ border: '2px dashed rgb(var(--border-secondary))', background: 'rgb(var(--bg-secondary))' }}>
                <div className="max-w-md">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] shadow-lg" style={{ background: 'rgb(var(--color-coral))', color: '#fff' }}>
                    <Building2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>Waiting for your brief</h3>
                  <p className="mt-3 text-base" style={{ color: 'rgb(var(--fg-secondary))' }}>
                    Your four floor plan options will appear here in a responsive 2x2 grid once generation finishes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {layouts.map((layout, index) => (
                  <motion.div
                    key={`${layout.slice(0, 32)}-${index}`}
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="overflow-hidden rounded-[28px] shadow-sm"
                    style={{ border: '1px solid rgb(var(--color-card-border))', background: 'rgb(var(--bg-secondary))' }}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgb(var(--color-card-border))', background: 'rgb(var(--color-card))' }}>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--color-coral))' }}>Option {index + 1}</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary))' }}>Blueprint-style PNG export</p>
                      </div>
                      <button
                        onClick={() => handleDownload(layout, index)}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
                        style={{
                          background: 'rgb(var(--color-coral))',
                          color: '#fff',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgb(var(--color-coral-hover))'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgb(var(--color-coral))'}
                      >
                        <Download className="h-4 w-4" />
                        Download PNG
                      </button>
                    </div>

                    <div className="p-4" style={{ background: 'rgb(var(--color-card))' }}>
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: index * 0.08 + 0.1 }}
                        src={layout}
                        alt={`Generated layout option ${index + 1}`}
                        className="aspect-square w-full rounded-2xl object-cover shadow-sm"
                        style={{ border: '1px solid rgb(var(--color-card-border))' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
