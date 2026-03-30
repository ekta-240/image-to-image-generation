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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.18),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_45%,#f8fafc_100%)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm backdrop-blur">
            <Building2 className="h-4 w-4" />
            2D Layout Generator
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Generate four floor plan directions in one pass
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 md:text-xl">
            Enter the total area, optionally lock the room count, and let Homelytics draft blueprint-style plan options for quick concept exploration.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/20 p-3">
                  <Wand2 className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Plan Inputs</h2>
                  <p className="text-sm text-slate-300">Optimized for blueprint-style ideation and quick comparisons.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label htmlFor="total-area" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Ruler className="h-4 w-4 text-cyan-600" />
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label htmlFor="room-count" className="mb-2 block text-sm font-semibold text-slate-800">
                  Room Count
                </label>
                <select
                  id="room-count"
                  value={roomCount}
                  onChange={(event) => setRoomCount(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                >
                  {ROOM_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-cyan-700" />
                  <div>
                    <h3 className="font-semibold text-slate-900">What the model will aim for</h3>
                    <p className="mt-1 text-sm text-slate-600">
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
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
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
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Generated Options</h2>
                <p className="text-sm text-slate-500">
                  The API returns four PNG layouts as base64 strings and each card can be downloaded directly.
                </p>
              </div>
              {promptUsed && (
                <div className="max-w-xl rounded-2xl bg-slate-50 px-4 py-3 text-xs font-medium leading-6 text-slate-600">
                  Prompt: {promptUsed}
                </div>
              )}
            </div>

            {layouts.length === 0 ? (
              <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,rgba(226,232,240,0.45),rgba(248,250,252,0.8))] p-8 text-center">
                <div className="max-w-md">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-900 text-white shadow-lg">
                    <Building2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Waiting for your brief</h3>
                  <p className="mt-3 text-base text-slate-600">
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
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Option {index + 1}</p>
                        <p className="text-sm text-slate-500">Blueprint-style PNG export</p>
                      </div>
                      <button
                        onClick={() => handleDownload(layout, index)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Download className="h-4 w-4" />
                        Download PNG
                      </button>
                    </div>

                    <div className="bg-white p-4">
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: index * 0.08 + 0.1 }}
                        src={layout}
                        alt={`Generated layout option ${index + 1}`}
                        className="aspect-square w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
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
