import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import HomePage from './pages/public/HomePage'
import AnimalsPage from './pages/public/AnimalsPage'
import AnimalDetailPage from './pages/public/AnimalDetailPage'
import ReportPage from './pages/public/ReportPage'
import TrackReportPage from './pages/public/TrackReportPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminAnimalsPage from './pages/admin/AdminAnimalsPage'
import AdminMeetingsPage from './pages/admin/AdminMeetingsPage'

// PublicLayout wraps every public page with Navbar + Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/adopto" element={<PublicLayout><AnimalsPage /></PublicLayout>} />
      <Route path="/adopto/:id" element={<PublicLayout><AnimalDetailPage /></PublicLayout>} />
      <Route path="/raporto" element={<PublicLayout><ReportPage /></PublicLayout>} />
      <Route path="/track" element={<PublicLayout><TrackReportPage /></PublicLayout>} />

      {/* Admin pages — no Navbar/Footer */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="animals" element={<AdminAnimalsPage />} />
        <Route path="meetings" element={<AdminMeetingsPage />} />
      </Route>
    </Routes>
  )
}