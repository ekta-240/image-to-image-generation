import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AIGeneration from './pages/AIGeneration'
import DragDropCustomize from './pages/DragDropCustomize'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-generate" element={<AIGeneration />} />
          <Route path="/customize" element={<DragDropCustomize />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
