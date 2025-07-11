import { Routes, Route } from 'react-router-dom';
import './css/find-coaches.css';

import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Athlete pages
import Athlete from './pages/athelte/athelte';
import AthleteMessages from './pages/athelte/message';
import AthleteProgress from './pages/athelte/progress.jsx';
import AthleteBooking from './pages/athelte/booking';
import AthleteGeneralProgress from './pages/athelte/progress';
import AthleteFeedback from './pages/athelte/feedback.jsx';
import MarketplacePage from './pages/athelte/MarketplacePage.jsx';
import CheckoutPage from './pages/athelte/CheckoutPage.jsx';
import CheckoutSuccess from './pages/athelte/CheckoutSuccess.jsx';
import MyOrders from './pages/athelte/MyOrders.jsx';

// Vendor pages
import Vendor from './pages/vendor/vendor';
import VendorFeedback from './pages/vendor/feedback';
import VendorMarketplace from './pages/vendor/marketplace';
import VendorMessages from './pages/vendor/message';
import VendorProgress from './pages/vendor/progress';
import VendorReport from './pages/vendor/report';
import VendorProfile from './pages/vendor/vendor-profile';
import VendorProfileForm from './pages/vendor/VendorProfileForm';
import VendorPanel from './pages/vendor/VendorPanel';
import OrderManagement from './pages/vendor/OrderManagement';
import EarningsOverview from './pages/vendor/EarningsOverview';
import FeedbackManagement from './pages/vendor/FeedbackManagement';

// Coach pages
import CoachBooking from './pages/coach/booking';
import CoachProfile from './pages/coach/coach-profile';
import CoachProfileEdit from './pages/coach/coach-profile-edit.jsx';
import CoachMarketplace from './pages/coach/marketplace';
import CoachMessages from './pages/coach/message';
import CoachDashboard from './pages/coach/CoachDashboard';

// Admin pages
import Admin from './pages/admin/admin';
import AdminPaymentManagement from './pages/admin/payment-managment';
import AdminReport from './pages/admin/report';
import AdminUserManagement from './pages/admin/user-managment';
import AdminAddUser from './pages/admin/admin-add-user.jsx';
import ProfilePage from './pages/athelte/ProfilePage.jsx';
import FindCoaches from './pages/athelte/find-coaches.jsx';
import CoachAthleteProgress from './pages/coach/athelte-progress.jsx';
import AdminPayouts from './pages/admin/admin-payouts.jsx';

function App() {
  return (
    <Routes>
      {/* General - Protected from logged-in users */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path='/login'
        element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password/:token'
        element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        }
      />

      {/* Athlete */}
      <Route path='/athlete/dashboard' element={<Athlete />} />
      <Route path='/athlete/profile' element={<ProfilePage />} />
      <Route path='/athlete/messages' element={<AthleteMessages />} />
      <Route path='/athlete/booking' element={<AthleteBooking />} />
      <Route path='/athlete/feedback' element={<AthleteFeedback />} />
      <Route path='/athlete/find-coaches' element={<FindCoaches />} />
      <Route path='/athlete/progress' element={<AthleteProgress />} />
      <Route path='/athlete/marketplace' element={<MarketplacePage />} />
      <Route path='/athlete/checkout' element={<CheckoutPage />} />
      <Route path='/athlete/checkout/success' element={<CheckoutSuccess />} />
      <Route
        path='/athlete/general-progress'
        element={<AthleteGeneralProgress />}
      />
      <Route path='/athlete/orders' element={<MyOrders />} />

      {/* Vendor */}
      <Route path='/vendor/dashboard' element={<Vendor />} />
      <Route path='/vendor/profile' element={<VendorProfile />} />
      <Route path='/vendor/profile/edit' element={<VendorProfileForm />} />
      <Route path='/vendor/feedback' element={<VendorFeedback />} />
      <Route path='/vendor/marketplace' element={<VendorMarketplace />} />
      <Route path='/vendor/messages' element={<VendorMessages />} />
      <Route path='/vendor/progress' element={<VendorProgress />} />
      <Route path='/vendor/report' element={<VendorReport />} />
      <Route path='/vendor/panel' element={<VendorPanel />} />
      <Route path='/vendor/orders' element={<OrderManagement />} />
      <Route path='/vendor/earnings' element={<EarningsOverview />} />
      <Route
        path='/vendor/feedback-management'
        element={<FeedbackManagement />}
      />

      {/* Coach */}
      <Route path='/coach/dashboard' element={<CoachDashboard />} />
      <Route path='/coach/profile' element={<CoachProfile />} />
      <Route path='/coach/profile/edit' element={<CoachProfileEdit />} />
      <Route path='/coach/marketplace' element={<CoachMarketplace />} />
      <Route path='/coach/messages' element={<CoachMessages />} />
      <Route path='/coach/booking' element={<CoachBooking />} />
      <Route
        path='/coach/athlete-progress'
        element={<CoachAthleteProgress />}
      />

      {/* Admin */}
      <Route path='/admin/dashboard' element={<Admin />} />
      <Route
        path='/admin/payment-management'
        element={<AdminPaymentManagement />}
      />
      <Route path='/admin/payouts' element={<AdminPayouts />} />
      <Route path='/admin/report' element={<AdminReport />} />
      <Route path='/admin/user-management' element={<AdminUserManagement />} />
      <Route path='/admin/add-user' element={<AdminAddUser />} />

      {/* Not Found (404) */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
