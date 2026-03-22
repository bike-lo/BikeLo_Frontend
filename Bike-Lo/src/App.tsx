import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/hooks/use-theme'
import { AuthProvider } from '@/hooks/use-auth'
import { BackgroundComponents } from '@/components/ui/background-components'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Bikes from '@/pages/Bikes'
import Buy from '@/pages/Buy'
import Sell from '@/pages/Sell'
import Service from '@/pages/Service'
import Parts from '@/pages/Parts'
import About from '@/pages/About'
import Auth from '@/pages/Auth'
import Profile from '@/pages/Profile'
import VerifyOTP from '@/pages/VerifyOTP'
import Admin from '@/pages/Admin'
import AdminAddBike from '@/pages/AdminAddBike'
import AdminUsers from '@/pages/AdminUsers'
import BikeDetails from '@/pages/BikeDetails'
import ProtectedRoute from '@/components/ProtectedRoute'
import '@/App.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  const location = useLocation();
  const shouldShowFooter = location.pathname === '/' || location.pathname === '/about';
  const isBikeDetails = location.pathname.startsWith('/buy/') && location.pathname.length > 5;
  const shouldShowNavbar = !isBikeDetails;

  return (
    <ThemeProvider>
      <AuthProvider>
        <BackgroundComponents>
          {shouldShowNavbar && <Navbar />}
          <main className="min-h-screen">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/bikes" element={<ProtectedRoute><Bikes /></ProtectedRoute>} />
                <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
                <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                <Route path="/service" element={<ProtectedRoute><Service /></ProtectedRoute>} />
                <Route path="/parts" element={<ProtectedRoute><Parts /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/admin/add-bike" element={<ProtectedRoute><AdminAddBike /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="/buy/:id" element={<ProtectedRoute><BikeDetails /></ProtectedRoute>} />
              </Routes>
            </ErrorBoundary>
          </main>
          {shouldShowFooter && <Footer />}
          <Toaster position="bottom-right" theme="system" />
        </BackgroundComponents>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
