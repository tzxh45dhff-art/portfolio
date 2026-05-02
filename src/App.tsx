import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Offline from './pages/Offline'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offline" element={<Offline />} />
    </Routes>
  )
}
