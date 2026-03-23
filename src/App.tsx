import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import HomePage from './pages/public/HomePage'
import AnimalsPage from './pages/public/AnimalsPage'
import AnimalDetailPage from './pages/public/AnimalDetailPage'
import ReportPage from './pages/public/ReportPage'
import TrackReportPage from './pages/public/TrackReportPage'
import EducationPage from './pages/public/EducationPage'
import ArticlePage from './pages/public/ArticlePage'
import ContactPage from './pages/public/ContactPage'
import DonatePage from './pages/public/DonatePage'

import AdminLayout from './pages/admin/AdminLayout'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminAnimalsPage from './pages/admin/AdminAnimalsPage'
import AdminMeetingsPage from './pages/admin/AdminMeetingsPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminSurrenderPage from './pages/admin/AdminSurrenderPage'


function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#f7f4ef' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/adopto" element={<PublicLayout><AnimalsPage /></PublicLayout>} />
      <Route path="/adopto/:id" element={<PublicLayout><AnimalDetailPage /></PublicLayout>} />
      <Route path="/raporto" element={<PublicLayout><ReportPage /></PublicLayout>} />
      <Route path="/track" element={<PublicLayout><TrackReportPage /></PublicLayout>} />
      <Route path="/edukim" element={<PublicLayout><EducationPage /></PublicLayout>} />
      <Route path="/edukim/artikull/:id" element={<PublicLayout><ArticlePage /></PublicLayout>} />
      <Route path="/kontakt" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/donacion" element={<PublicLayout><DonatePage /></PublicLayout>} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="reports"   element={<AdminReportsPage />} />
        <Route path="animals"   element={<AdminAnimalsPage />} />
        <Route path="meetings"  element={<AdminMeetingsPage />} />
        <Route path="events"    element={<AdminEventsPage />} />
        <Route path="surrender" element={<AdminSurrenderPage />} />
      </Route>
    </Routes>
  )
}