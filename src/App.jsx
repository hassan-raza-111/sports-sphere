import { Routes, Route } from 'react-router-dom';

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
import AthleteProgress from './pages/athelte/athelte-progress';
import AthleteBooking from './pages/athelte/booking';
import AthleteFeedback from './pages/athelte/feedback';
import AthleteFindCoaches from './pages/athelte/find-coaches';
import AthleteGeneralProgress from './pages/athelte/progress';

// Vendor pages
import Vendor from './pages/vendor/vendor';
import VendorFeedback from './pages/vendor/feedback';
import VendorMarketplace from './pages/vendor/marketplace';
import VendorMessages from './pages/vendor/message';
import VendorProgress from './pages/vendor/progress';
import VendorReport from './pages/vendor/report';
import VendorProfile from './pages/vendor/vendor-profile';

// Coach pages
import Coach from './pages/coach/coach';
import CoachBooking from './pages/coach/booking';
import CoachProfile from './pages/coach/coach-profile';
import CoachProfileEdit from './pages/coach/coach-profile-edit.jsx';
import CoachMarketplace from './pages/coach/marketplace';
import CoachMessages from './pages/coach/message';
import CoachProgress from './pages/coach/progress';

// Admin pages
import Admin from './pages/admin/admin';
import AdminPaymentManagement from './pages/admin/payment-managment';
import AdminReport from './pages/admin/report';
import AdminUserManagement from './pages/admin/user-managment';
import AdminAddUser from './pages/admin/admin-add-user.jsx';
import ProfilePage from './pages/athelte/ProfilePage.jsx';

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
      <Route path='/athlete/find-coaches' element={<AthleteFindCoaches />} />
      <Route path='/athlete/progress' element={<AthleteProgress />} />
      <Route path='/athlete/marketplace' element={<VendorMarketplace />} />
      <Route
        path='/athlete/general-progress'
        element={<AthleteGeneralProgress />}
      />

      {/* Vendor */}
      <Route path='/vendor/dashboard' element={<Vendor />} />
      <Route path='/vendor/profile' element={<VendorProfile />} />
      <Route path='/vendor/feedback' element={<VendorFeedback />} />
      <Route path='/vendor/marketplace' element={<VendorMarketplace />} />
      <Route path='/vendor/messages' element={<VendorMessages />} />
      <Route path='/vendor/progress' element={<VendorProgress />} />
      <Route path='/vendor/report' element={<VendorReport />} />

      {/* Coach */}
      <Route path='/coach/dashboard' element={<Coach />} />
      <Route path='/coach/profile' element={<CoachProfile />} />
      <Route path='/coach/profile/edit' element={<CoachProfileEdit />} />
      <Route path='/coach/marketplace' element={<CoachMarketplace />} />
      <Route path='/coach/messages' element={<CoachMessages />} />
      <Route path='/coach/booking' element={<CoachBooking />} />
      <Route path='/coach/progress' element={<CoachProgress />} />

      {/* Admin */}
      <Route path='/admin/dashboard' element={<Admin />} />
      <Route
        path='/admin/payment-management'
        element={<AdminPaymentManagement />}
      />
      <Route path='/admin/report' element={<AdminReport />} />
      <Route path='/admin/user-management' element={<AdminUserManagement />} />
      <Route path='/admin/add-user' element={<AdminAddUser />} />

      {/* Not Found (404) */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
