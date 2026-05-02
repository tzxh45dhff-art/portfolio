import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Offline from './pages/Offline'
import Online from './pages/Online'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offline" element={<Offline />} />
      <Route path="/online" element={<Online />} />
    </Routes>
  )
}
