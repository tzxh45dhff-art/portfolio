import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Offline from './pages/Offline'
import Online from './pages/Online'
import Contact from './pages/Contact'
import BrushCanvas from './components/BrushCanvas'
import CustomCursor from './components/CustomCursor'
import TransitionScreen from './components/TransitionScreen'
import { TransitionProvider } from './context/TransitionContext'
import './index.css'

export default function App() {
  return (
    <TransitionProvider>
      <TransitionScreen />
      <BrushCanvas />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offline" element={<Offline />} />
        <Route path="/online" element={<Online />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </TransitionProvider>
  )
}
