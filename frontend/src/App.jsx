import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Topbar from './components/Topbar'
import Subnav from './components/Subnav'
import Footer from './components/Footer'
import PublicHome from './pages/PublicHome'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Topbar />
        <Subnav />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/collaborators" element={<PublicHome defaultTab="collaborators" />} />
            {/* 404 fallback */}
            <Route path="*" element={<PublicHome />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
