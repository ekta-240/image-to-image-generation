import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, PaintBucket, IndianRupee, Share2, Star, ChevronRight, Zap, Heart, TrendingUp } from 'lucide-react'

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
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: PaintBucket,
      title: "Drag & Drop Customization",
      description: "Manually design your room by dragging and dropping furniture items to create your perfect layout.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: IndianRupee,
      title: "Price Estimation",
      description: "Get instant pricing for all furniture items in your designed room to plan your budget effectively.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Share2,
      title: "Save & Share",
      description: "Download your designs and share them with friends, family, or on social media.",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { icon: Heart, value: "50K+", label: "Happy Users" },
    { icon: Sparkles, value: "200K+", label: "Rooms Designed" },
    { icon: TrendingUp, value: "98%", label: "Satisfaction Rate" },
    { icon: Zap, value: "< 60s", label: "Avg. Generation Time" }
  ]

  const galleryImages = [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800",
    "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800"
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600"
        >
          {/* Animated Circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 glass-effect rounded-full text-white font-semibold text-sm mb-6 border border-white/30">
              ✨ AI-Powered Interior Design Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-white leading-tight"
          >
            Transform Your Space
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300">
              with AI Magic
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Design your dream room in minutes. Upload an empty room photo and watch AI bring it to life, 
            or customize it yourself with our intuitive drag-and-drop interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/ai-generate">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all group"
              >
                <Sparkles className="w-6 h-6 mr-2 text-blue-600 group-hover:rotate-12 transition-transform" />
                Start with AI
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>

            <Link to="/customize">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 glass-effect border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all group"
              >
                <PaintBucket className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                Customize Manually
              </motion.div>
            </Link>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.05 }}
                className="glass-effect rounded-2xl p-4 text-white"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Two Ways to Design Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Two Powerful Ways to Design
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose AI magic for instant results, or take full control with drag-and-drop customization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI Generation Method */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-full"
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200 shadow-xl h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Generation</h3>
                    <p className="text-blue-600 font-semibold">Fast & Automatic</p>
                  </div>
                </div>

                {/* Before/After Visual */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                      Before
                    </div>
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-gray-300">
                      <div className="text-center">
                        <div className="text-4xl mb-1">🏠</div>
                        <p className="text-xs text-gray-600">Empty Room</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                      After
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400"
                      alt="AI Generated Room"
                      className="w-full aspect-[4/3] object-cover rounded-xl shadow-lg border-2 border-green-500"
                    />
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start bg-white p-4 rounded-xl shadow">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Upload Your Room Image</h4>
                      <p className="text-sm text-gray-600">Take a picture of your empty room</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-4 rounded-xl shadow">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Describe Your Vision</h4>
                      <p className="text-sm text-gray-600">Tell AI your style: "Modern living room with grey sofa"</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-4 rounded-xl shadow">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Get Instant Results</h4>
                      <p className="text-sm text-gray-600">AI generates furnished room + smart pricing</p>
                    </div>
                  </div>
                </div>

                <Link to="/ai-generate">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group mt-auto"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Try AI Generation
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Drag & Drop Customization Method */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-full"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 shadow-xl h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                    <PaintBucket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Drag & Drop</h3>
                    <p className="text-green-600 font-semibold">Full Control</p>
                  </div>
                </div>

                {/* Before/After Visual */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                      Before
                    </div>
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-gray-300">
                      <div className="text-center">
                        <div className="text-4xl mb-1">🏠</div>
                        <p className="text-xs text-gray-600">Empty Room</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                      After
                    </div>
                    <div className="relative rounded-xl shadow-lg overflow-hidden border-2 border-green-500">
                      <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400"
                        alt="Drag & Drop Customized Room"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      {/* Furniture overlay badges */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <span className="text-lg bg-white/30 p-1 rounded backdrop-blur-sm">🛋️</span>
                        <span className="text-lg bg-white/30 p-1 rounded backdrop-blur-sm">🪑</span>
                        <span className="text-lg bg-white/30 p-1 rounded backdrop-blur-sm">🏮</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start bg-white p-4 rounded-xl shadow">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Upload Room Image</h4>
                      <p className="text-sm text-gray-600">Set your room as the canvas</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-4 rounded-xl shadow">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Drag Furniture Items</h4>
                      <p className="text-sm text-gray-600">Browse catalog & drag items (sofa, table, decor)</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-4 rounded-xl shadow">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Arrange & Get Pricing</h4>
                      <p className="text-sm text-gray-600">Position, resize & see live total cost</p>
                    </div>
                  </div>
                </div>

                <Link to="/customize">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center group mt-auto"
                  >
                    <PaintBucket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Start Customizing
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to design, visualize, and plan your perfect room
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Inspiration Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white font-semibold">View Design</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
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
              className="text-4xl md:text-6xl font-extrabold mb-6 text-white"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ready to Transform Your Space?
            </motion.h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Start designing your dream room today with AI or customize it yourself
            </p>
            <Link to="/ai-generate">
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl shadow-2xl group"
              >
                <Sparkles className="w-7 h-7 mr-3 text-blue-600 group-hover:rotate-12 group-hover:scale-110 transition-all" />
                Get Started Free
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
