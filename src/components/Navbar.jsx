import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Home, Sparkles, Palette } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Homelytics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/ai-generate"
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                isActive('/ai-generate')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              AI Generate
            </Link>
            <Link
              to="/customize"
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                isActive('/customize')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Palette className="w-4 h-4 mr-1.5" />
              Customize
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/ai-generate" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium ${
                  isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/ai-generate"
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  isActive('/ai-generate') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Link>
              <Link
                to="/customize"
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  isActive('/customize') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Palette className="w-4 h-4 mr-2" />
                Customize
              </Link>
              <Link to="/ai-generate" className="btn-primary mt-4 text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
