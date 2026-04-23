import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { BackgroundComponents } from '@/components/ui/background-components'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { lazy, Suspense } from 'react'
const Home = lazy(() => import('@/pages/Home'))
const Bikes = lazy(() => import('@/pages/Bikes'))
const Buy = lazy(() => import('@/pages/Buy'))
const Sell = lazy(() => import('@/pages/Sell'))
const Parts = lazy(() => import('@/pages/Parts'))
const About = lazy(() => import('@/pages/About'))
const Auth = lazy(() => import('@/pages/Auth'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const Profile = lazy(() => import('@/pages/Profile'))
const VerifyOTP = lazy(() => import('@/pages/VerifyOTP'))
const Admin = lazy(() => import('@/pages/Admin'))
const AdminAddBike = lazy(() => import('@/pages/AdminAddBike'))
const AdminUsers = lazy(() => import('@/pages/AdminUsers'))
const AdminParts = lazy(() => import('@/pages/AdminParts'))
const AdminAddPart = lazy(() => import('@/pages/AdminAddPart'))
const BikeDetails = lazy(() => import('@/pages/BikeDetails'))
const PartDetails = lazy(() => import('@/pages/PartDetails'))
const Insurance = lazy(() => import('@/pages/Insurance'))
const Locations = lazy(() => import('@/pages/Locations'))
const Terms = lazy(() => import('@/pages/Terms'))
const Privacy = lazy(() => import('@/pages/Privacy'))
import ProtectedRoute from '@/components/ProtectedRoute'
import '@/App.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useLoading } from '@/hooks/use-loading'
import { useAuth } from '@/hooks/use-auth'
import LoadingScreen from '@/components/LoadingScreen'

function App() {
  const location = useLocation();
  const { isLoading: pageLoading } = useLoading();
  const { isLoading: authLoading } = useAuth();

  const shouldShowFooter =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname === '/terms' ||
    location.pathname === '/privacy' ||
    location.pathname === '/locations';
  const isBikeDetails = location.pathname.startsWith('/buy/') && location.pathname.length > 5;
  const isPartDetails = location.pathname.startsWith('/parts/') && location.pathname.split('/').length === 3;
  const shouldShowNavbar = !isBikeDetails && !isPartDetails;

  return (
    <>
      <LoadingScreen isVisible={pageLoading || authLoading} />
      <BackgroundComponents>
        {shouldShowNavbar && <Navbar />}
          <main className="min-h-screen">
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen isVisible={true} />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/bikes" element={<ProtectedRoute><Bikes /></ProtectedRoute>} />
                  <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
                  <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                  <Route path="/parts" element={<ProtectedRoute><Parts /></ProtectedRoute>} />
                  <Route path="/parts/:id" element={<ProtectedRoute><PartDetails /></ProtectedRoute>} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  <Route path="/admin/add-bike" element={<ProtectedRoute adminOnly><AdminAddBike /></ProtectedRoute>} />
                  <Route path="/admin/add-part" element={<ProtectedRoute adminOnly><AdminAddPart /></ProtectedRoute>} />
                  <Route path="/admin/parts" element={<ProtectedRoute adminOnly><AdminParts /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
                  <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
                  <Route path="/buy/:id" element={<ProtectedRoute><BikeDetails /></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          {shouldShowFooter && <Footer />}
          <Toaster position="bottom-right" theme="system" />
        </BackgroundComponents>
    </>
  )
}

export default App
