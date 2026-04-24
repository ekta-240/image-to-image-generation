import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, PaintBucket, IndianRupee, Share2, Star, ChevronRight, Zap, Heart, TrendingUp, Building2 } from 'lucide-react'

export default function Home() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "Homelytics transformed my empty apartment into a dream home! The AI suggestions were spot-on and helped me visualize everything before buying furniture."
    },
    {
      name: "Mike Chen",
      role: "Interior Designer",
      image: "https://i.pravatar.cc/150?img=2",
      rating: 5,
      text: "As a professional designer, this tool saves me hours of work. My clients love seeing instant visualizations of their rooms."
    },
    {
      name: "Emily Rodriguez",
      role: "Real Estate Agent",
      image: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      text: "Perfect for staging properties virtually! It helps buyers imagine the potential of empty spaces. Highly recommend!"
    }
  ]

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Upload your empty room and let AI transform it into a fully furnished space with just a prompt.",
    },
    {
      icon: PaintBucket,
      title: "Drag & Drop Customization",
      description: "Manually design your room by dragging and dropping furniture items to create your perfect layout.",
    },
    {
      icon: Building2,
      title: "2D Layout Generator",
      description: "Generate four blueprint-style floor plan options from total area and room count in one click.",
    },
    {
      icon: IndianRupee,
      title: "Price Estimation",
      description: "Get instant pricing for all furniture items in your designed room to plan your budget effectively.",
    },
    {
      icon: Share2,
      title: "Save & Share",
      description: "Download your designs and share them with friends, family, or on social media.",
    }
  ]

  const stats = [
    { icon: Heart,       value: "50K+",  label: "Happy Users"         },
    { icon: Sparkles,    value: "200K+", label: "Rooms Designed"      },
    { icon: TrendingUp,  value: "98%",   label: "Satisfaction Rate"   },
    { icon: Zap,         value: "< 60s", label: "Avg. Generation Time"},
  ]

  const galleryImages = [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800",
    "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800",
  ]

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ─────────────────── Hero Section ─────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dark gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            y,
            background: 'linear-gradient(135deg, rgb(9 9 11) 0%, rgb(24 24 33) 50%, rgb(17 17 24) 100%)',
          }}
        >
          {/* Animated accent blobs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-10 left-10 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgb(var(--color-coral) / 0.15)' }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgb(var(--color-coral) / 0.08)' }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-8"
          >
            <span
              className="inline-block px-5 py-2 rounded-full font-semibold text-xs tracking-wider mb-8"
              style={{
                background: 'rgb(var(--color-coral) / 0.15)',
                border: '1px solid rgb(var(--color-coral) / 0.4)',
                backdropFilter: 'blur(12px)',
                color: 'rgb(var(--color-coral))',
              }}
            >
              TRANSFORM YOUR INTERIOR
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight tracking-tight"
          >
            AI-Powered Interior
            <br />
            <span
              className="text-transparent bg-clip-text font-black"
              style={{ backgroundImage: 'linear-gradient(90deg, rgb(var(--color-coral)), rgb(var(--primary-light)))' }}
            >
              Design Solutions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgb(var(--fg-secondary))' }}
          >
            Reimagine spaces instantly. Upload your room, get AI-powered designs, or customize with drag-and-drop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/ai-generate">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                style={{ background: 'rgb(var(--color-coral))', color: 'rgb(18, 18, 26)' }}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start with AI
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/customize">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-base transition-all group cursor-pointer border-2"
                style={{
                  background: 'transparent',
                  borderColor: 'rgb(var(--color-coral) / 0.5)',
                  color: 'rgb(var(--color-coral))',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <PaintBucket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Customize
              </motion.button>
            </Link>

            <Link to="/generate-layout">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-base transition-all group cursor-pointer border-2"
                style={{
                  background: 'transparent',
                  borderColor: 'rgb(var(--border-primary))',
                  color: 'rgb(var(--fg-secondary))',
                }}
              >
                <Building2 className="w-5 h-5 mr-2 group-hover:-rotate-6 transition-transform" />
                Generate Layout
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.04 }}
                className="rounded-xl p-4 backdrop-blur-sm border"
                style={{
                  background: 'rgb(var(--color-coral) / 0.08)',
                  borderColor: 'rgb(var(--color-coral) / 0.2)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'rgb(var(--color-coral))' }} />
                <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary))' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'rgb(var(--fg-secondary))' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full mt-2"
              style={{ background: 'rgb(var(--color-coral))' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─────────────────── Three Ways to Design ─────────────────── */}
      <section className="section-spacing" style={{ background: 'rgb(var(--bg-primary))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>
              Three Powerful Ways to Design
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>
              Choose instant AI furnishing, blueprint-style layout generation, or full manual control — your space, your way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

            {/* AI Generation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-full"
            >
              <div
                className="p-8 rounded-2xl border-2 shadow-xl h-full flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgb(var(--color-coral) / 0.04) 0%, rgb(var(--color-coral) / 0.08) 100%)',
                  borderColor: 'rgb(var(--color-coral) / 0.30)',
                }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                    style={{ background: 'rgb(var(--color-coral))' }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>AI Generation</h3>
                    <p className="font-semibold" style={{ color: 'rgb(var(--color-coral))' }}>Fast & Automatic</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 text-white px-3 py-1 rounded-full text-xs font-bold z-10" style={{ background: 'rgb(var(--color-coral))' }}>Before</div>
                    <div className="aspect-[4/3] rounded-xl flex items-center justify-center border-2" style={{ background: 'rgb(var(--bg-secondary))', borderColor: 'rgb(var(--border-primary))' }}>
                      <div className="text-center"><div className="text-4xl mb-1">🏠</div><p className="text-xs" style={{ color: 'rgb(var(--fg-tertiary))' }}>Empty Room</p></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 text-white px-3 py-1 rounded-full text-xs font-bold z-10" style={{ background: 'rgb(var(--color-coral))' }}>After</div>
                    <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400" alt="AI Generated" className="w-full aspect-[4/3] object-cover rounded-xl shadow-lg border-2" style={{ borderColor: 'rgb(var(--color-coral))' }} />
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {['Upload Your Room Image', 'Describe Your Vision', 'Get Instant Results'].map((step, i) => (
                    <div key={i} className="flex items-start p-4 rounded-xl shadow-sm" style={{ background: 'rgb(var(--color-card))' }}>
                      <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0" style={{ background: 'rgb(var(--color-coral))' }}>{i + 1}</div>
                      <div>
                        <h4 className="font-bold mb-1" style={{ color: 'rgb(var(--fg-primary))' }}>{step}</h4>
                        <p className="text-sm" style={{ color: 'rgb(var(--fg-secondary))' }}>
                          {['Take a picture of your empty room', 'Tell AI your style preferences', 'AI generates furnished room + smart pricing'][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/ai-generate">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 group mt-auto transition-all"
                    style={{ background: 'rgb(var(--color-coral))' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgb(var(--color-coral-hover))'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgb(var(--color-coral))'}
                  >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Try AI Generation
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* 2D Layouts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative h-full"
            >
              <div
                className="p-8 rounded-2xl border-2 shadow-xl h-full flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgb(var(--color-coral) / 0.03) 0%, rgb(var(--color-coral) / 0.07) 100%)',
                  borderColor: 'rgb(var(--color-coral) / 0.20)',
                }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: 'rgb(var(--color-coral))' }}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>2D Layouts</h3>
                    <p className="font-semibold" style={{ color: 'rgb(var(--fg-secondary))' }}>Fast Concept Planning</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border-2 p-4" style={{ borderColor: 'rgb(var(--border-primary))', background: 'rgb(var(--color-card))' }}>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgb(var(--fg-tertiary))' }}>Inputs</div>
                    <div className="space-y-2 text-sm">
                      {['1200 sq ft', '2 BHK', 'AI decides zoning'].map(t => (
                        <div key={t} className="rounded-lg px-3 py-2 font-semibold" style={{ background: 'rgb(var(--bg-secondary))', color: 'rgb(var(--fg-primary))' }}>{t}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border-2 p-4 shadow-lg" style={{ borderColor: 'rgba(26,26,46,0.25)', background: 'rgb(var(--color-card))' }}>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgb(var(--fg-primary))' }}>Output</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map(p => (
                        <div key={p} className="aspect-square rounded-lg border p-2" style={{ borderColor: 'rgb(var(--border-primary))', background: 'rgb(var(--bg-secondary))' }}>
                          <div className="h-full w-full rounded border-2 border-dashed" style={{ borderColor: 'rgb(var(--border-secondary))' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {['Enter Area & Room Count', 'Generate 4 Variations', 'Download the Best Option'].map((step, i) => (
                    <div key={i} className="flex items-start p-4 rounded-xl shadow-sm" style={{ background: 'rgb(var(--color-card))' }}>
                      <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0" style={{ background: 'rgb(var(--color-coral))' }}>{i + 1}</div>
                      <div>
                        <h4 className="font-bold mb-1" style={{ color: 'rgb(var(--fg-primary))' }}>{step}</h4>
                        <p className="text-sm" style={{ color: 'rgb(var(--fg-secondary))' }}>
                          {['Set the total footprint and BHK requirement.', 'Compare multiple plan directions in one shot.', 'Export any PNG floor plan for your next review.'][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/generate-layout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 group mt-auto transition-all"
                    style={{ background: 'rgb(var(--color-coral))' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgb(var(--color-coral-hover))'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgb(var(--color-coral))'}
                  >
                    <Building2 className="w-5 h-5 group-hover:-rotate-6 transition-transform" />
                    Generate Layouts
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Drag & Drop */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-full"
            >
              <div
                className="p-8 rounded-2xl border-2 shadow-xl h-full flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgb(var(--color-coral) / 0.04) 0%, rgb(var(--color-coral) / 0.08) 100%)',
                  borderColor: 'rgb(var(--color-coral) / 0.20)',
                }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                    style={{ background: 'linear-gradient(135deg, rgb(var(--color-coral)), rgb(var(--color-coral-hover)))' }}
                  >
                    <PaintBucket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>Drag & Drop</h3>
                    <p className="font-semibold" style={{ color: 'rgb(var(--color-coral))' }}>Full Control</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 text-white px-3 py-1 rounded-full text-xs font-bold z-10" style={{ background: 'rgb(var(--color-coral))' }}>Before</div>
                    <div className="aspect-[4/3] rounded-xl flex items-center justify-center border-2" style={{ background: 'rgb(var(--bg-secondary))', borderColor: 'rgb(var(--border-primary))' }}>
                      <div className="text-center"><div className="text-4xl mb-1">🏠</div><p className="text-xs" style={{ color: 'rgb(var(--fg-tertiary))' }}>Empty Room</p></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 text-white px-3 py-1 rounded-full text-xs font-bold z-10" style={{ background: 'rgb(var(--color-coral))' }}>After</div>
                    <div className="relative rounded-xl shadow-lg overflow-hidden border-2" style={{ borderColor: 'rgb(var(--color-coral))' }}>
                      <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400" alt="Customized Room" className="w-full aspect-[4/3] object-cover" />
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {['🛋️', '🪑', '🏮'].map(e => (
                          <span key={e} className="text-lg p-1 rounded backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.25)' }}>{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {['Upload Room Image', 'Drag Furniture Items', 'Arrange & Get Pricing'].map((step, i) => (
                    <div key={i} className="flex items-start p-4 rounded-xl shadow-sm" style={{ background: 'rgb(var(--color-card))' }}>
                      <div
                        className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgb(var(--color-coral)), rgb(var(--color-coral-hover)))' }}
                      >{i + 1}</div>
                      <div>
                        <h4 className="font-bold mb-1" style={{ color: 'rgb(var(--fg-primary))' }}>{step}</h4>
                        <p className="text-sm" style={{ color: 'rgb(var(--fg-secondary))' }}>
                          {['Set your room as the canvas', 'Browse catalog & drag items (sofa, table, decor)', 'Position, resize & see live total cost'][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/customize">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 group mt-auto transition-all"
                    style={{ background: 'linear-gradient(135deg, rgb(var(--color-coral)), rgb(var(--color-coral-hover)))' }}
                  >
                    <PaintBucket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Start Customizing
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────── Features Section ─────────────────── */}
      <section className="section-spacing" style={{ background: 'rgb(var(--bg-secondary))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>
              Powerful Features
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>
              Everything you need to design, visualize, and plan your perfect room.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`rounded-2xl p-6 md:p-7 border shadow-sm ${index === 0 ? 'sm:col-span-2 xl:col-span-1' : ''}`}
                style={{
                  background: 'rgb(var(--color-card))',
                  borderColor: 'rgb(var(--border-primary))',
                  boxShadow: 'var(--shadow-base)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgb(var(--color-coral))' }}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: 'rgb(var(--fg-tertiary))' }}>
                    0{index + 1}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: 'rgb(var(--fg-primary))' }}
                >
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgb(var(--fg-secondary))' }}>{feature.description}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 md:mt-10 rounded-2xl p-5 md:p-6 border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--color-coral) / 0.08), rgb(var(--color-navy) / 0.08))',
              borderColor: 'rgb(var(--border-primary))',
            }}
          >
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'rgb(var(--fg-primary))' }}>Built for Fast Decisions</h3>
              <p className="mt-1" style={{ color: 'rgb(var(--fg-secondary))' }}>Generate, compare, and iterate room concepts without leaving the workflow.</p>
            </div>
            <Link to="/ai-generate" className="no-underline self-start md:self-auto">
              <motion.span
                whileHover={{ x: 4 }}
                className="inline-flex items-center font-semibold"
                style={{ color: 'rgb(var(--color-coral))' }}
              >
                Explore AI Studio <ChevronRight className="w-4 h-4 ml-1" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── Gallery Section ─────────────────── */}
      <section className="section-spacing" style={{ background: 'rgb(var(--bg-primary))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>
              Inspiration Gallery
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>
              See what's possible with Homelytics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                style={{ border: '1px solid rgb(var(--color-card-border))' }}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
                  style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.75) 0%, transparent 100%)' }}
                >
                  <span className="text-white font-semibold">View Design</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Testimonials ─────────────────── */}
      <section className="section-spacing" style={{ background: 'rgb(var(--bg-secondary))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(var(--fg-primary))' }}>
              What Our Users Say
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>
              Join thousands of happy users transforming their spaces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-xl shadow-base interactive-surface"
                style={{
                  background: 'rgb(var(--color-card))',
                  border: '1px solid rgb(var(--color-card-border))',
                  boxShadow: 'var(--shadow-base)',
                }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    style={{ border: '2px solid rgb(var(--color-coral))' }}
                  />
                  <div>
                    <h4 className="font-semibold" style={{ color: 'rgb(var(--fg-primary))' }}>{testimonial.name}</h4>
                    <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary))' }}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: 'rgb(var(--color-coral))' }} />
                  ))}
                </div>
                <p className="italic text-sm leading-relaxed" style={{ color: 'rgb(var(--fg-secondary))' }}>
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA Section ─────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgb(9 9 11) 0%, rgb(18 18 26) 50%, rgb(24 24 33) 100%)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'rgb(var(--color-coral) / 0.15)' }}
          />
          <motion.div
            animate={{ scale: [1.3, 1, 1.3], rotate: [0, -90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'rgb(var(--color-coral) / 0.08)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ready to Transform Your Space?
            </motion.h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgb(var(--fg-secondary))' }}>
              Start designing your dream room today with AI or customize it yourself
            </p>
            <Link to="/ai-generate">
              <motion.button
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-10 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl group cursor-pointer"
                style={{ background: 'rgb(var(--color-coral))', color: 'rgb(18, 18, 26)' }}
              >
                <Sparkles className="w-7 h-7 mr-3 group-hover:rotate-12 group-hover:scale-110 transition-all" />
                Get Started Free
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
