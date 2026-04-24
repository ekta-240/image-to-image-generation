import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu, X, Home, Sparkles, Palette, Building2, Moon, Sun } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/ai-generate', label: 'AI Studio', icon: Sparkles },
  { to: '/generate-layout', label: 'Layouts', icon: Building2 },
  { to: '/customize', label: 'Customize', icon: Palette },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const storedTheme = localStorage.getItem('homelytics-theme')
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : true

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)
    document.documentElement.classList.toggle('dark', nextIsDark)
    localStorage.setItem('homelytics-theme', nextIsDark ? 'dark' : 'light')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgb(var(--bg-primary) / 0.9)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderColor: 'rgb(var(--border-primary))',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm"
              style={{ background: 'rgb(var(--color-coral))' }}
            >
              <Home className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: 'rgb(var(--fg-primary))' }}
            >
              Homelytics
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 text-sm font-medium transition-colors no-underline rounded-lg ${
                  isActive(to) ? 'nav-active-underline' : ''
                }`}
                style={{
                  color: isActive(to) ? 'rgb(var(--fg-primary))' : 'rgb(var(--fg-tertiary))',
                }}
                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.background = 'rgb(var(--bg-secondary))'; e.currentTarget.style.color = 'rgb(var(--fg-primary))'; }}
                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive(to) ? 'rgb(var(--fg-primary))' : 'rgb(var(--fg-tertiary))'; }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              to="/ai-generate"
              className="btn-primary text-sm py-2.5 px-5 no-underline inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start Designing
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-xl transition-colors"
            style={{
              background: 'rgb(var(--color-card))',
              border: '1px solid rgb(var(--border-primary))',
              color: 'rgb(var(--fg-primary))',
            }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl transition-colors"
              style={{
                background: 'rgb(var(--color-card))',
                border: '1px solid rgb(var(--border-primary))',
                color: 'rgb(var(--fg-primary))',
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              aria-label="Toggle navigation"
              style={{ color: 'rgb(var(--fg-primary))' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgb(var(--bg-secondary))'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'rgb(var(--border-primary))' }}>
            <div className="flex flex-col gap-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 rounded-lg font-medium flex items-center no-underline"
                  style={{
                    background: isActive(to) ? 'rgb(var(--bg-secondary))' : 'transparent',
                    color: isActive(to) ? 'rgb(var(--fg-primary))' : 'rgb(var(--fg-secondary))',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ))}
              <Link
                to="/ai-generate"
                className="btn-primary mt-4 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Designing
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
