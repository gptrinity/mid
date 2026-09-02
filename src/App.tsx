import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Practice from './pages/Practice'
import ExamSelect from './pages/ExamSelect'
import ExamActive from './pages/ExamActive'
import ExamResult from './pages/ExamResult'
import AITutor from './pages/AITutor'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      <Route path="/dashboard" element={<ProtectedRoute><AuthenticatedLayout><Dashboard /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><AuthenticatedLayout><Subjects /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><AuthenticatedLayout><Practice /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/practice/:subjectId" element={<ProtectedRoute><AuthenticatedLayout><Practice /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/subjects/exam" element={<ProtectedRoute><AuthenticatedLayout><ExamSelect /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/exam/active" element={<ProtectedRoute><AuthenticatedLayout><ExamActive /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/exam-result" element={<ProtectedRoute><AuthenticatedLayout><ExamResult /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/ai-tutor" element={<ProtectedRoute><AuthenticatedLayout><AITutor /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><AuthenticatedLayout><Leaderboard /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AuthenticatedLayout><Profile /></AuthenticatedLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
