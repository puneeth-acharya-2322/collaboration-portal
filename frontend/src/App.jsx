import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Subnav from './components/Subnav';
import Footer from './components/Footer';
import FindProjects from './pages/FindProjects';
import FindCollaborators from './pages/FindCollaborators';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
import Profile from './pages/Profile';
import Preferences from './pages/Preferences';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminPending from './pages/admin/AdminPending';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminActivities from './pages/admin/AdminActivities';
import AdminCourses from './pages/admin/AdminCourses';
import ProjectDetail from './pages/ProjectDetail';
import SeekerDetail from './pages/SeekerDetail';
import CollabForm from './pages/CollabForm';
import Requests from './pages/Requests';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Topbar />
          
          {/* Subnav mostly for public view, but fine to keep global for now */}
          <Routes>
            <Route path="/login" element={null} />
            <Route path="/register" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Subnav />} />
          </Routes>

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<FindProjects />} />
              <Route path="/collaborators" element={<FindCollaborators />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/collaborators/:id" element={<SeekerDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
              <Route path="/dashboard/add-project" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
              <Route path="/dashboard/edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
              <Route path="/dashboard/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="pending" element={<AdminPending />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="faculty" element={<AdminFaculty />} />
                <Route path="activities" element={<AdminActivities />} />
                <Route path="courses" element={<AdminCourses />} />
              </Route>

              {/* Requires Auth */}
              <Route path="/apply/:type/:id" element={<ProtectedRoute><CollabForm /></ProtectedRoute>} />

              {/* 404 fallback */}
              <Route path="*" element={<FindProjects />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
