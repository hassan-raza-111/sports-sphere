import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';

// Athlete pages
import Athlete from './pages/athelte/athelte';
import Profile from './pages/athelte/athelte-profile';
import Messages from './pages/athelte/message';
import AthleteProgress from './pages/athelte/athelte-progress';
import Booking from './pages/athelte/booking';
import Feedback from './pages/athelte/feedback';
import FindCoaches from './pages/athelte/find-coaches';
import Progress from './pages/athelte/progress';

// Vendor pages
import Vendor from './pages/vendor/vendor';
import FeedbackVendor from './pages/vendor/feedback'; // renamed for clarity
import Marketplace from './pages/vendor/marketplace';
import MessagesVendor from './pages/vendor/message';
import ProgressVendor from './pages/vendor/progress';
import Report from './pages/vendor/report';
import VendorProfile from './pages/vendor/vendor-profile';

// Coach pages
import Coach from './pages/coach/coach';
import BookingCoach from './pages/coach/booking'; // renamed for clarity
import CoachProfile from './pages/coach/coach-profile';
import MarketplaceCoach from './pages/coach/marketplace';
import MessagesCoach from './pages/coach/message';
import ProgressCoach from './pages/coach/progress';

// Admin pages
import Admin from './pages/admin/admin';
import PaymentManagement from './pages/admin/payment-managment';
import ReportAdmin from './pages/admin/report';
import UserManagement from './pages/admin/user-managment';

function App() {
  return (
    <Routes>
      {/* General */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />

      {/* Athlete */}
      <Route path='/athlete' element={<Athlete />} />
      <Route path='/athelte-profile' element={<Profile />} />
      <Route path='/message' element={<Messages />} />
      <Route path='/booking' element={<Booking />} />
      <Route path='/feedback' element={<Feedback />} />
      <Route path='/athelte/find-coaches' element={<FindCoaches />} />
      <Route path='/progress' element={<AthleteProgress />} />

      {/* Vendor */}
      <Route path='/vendor' element={<Vendor />} />
      <Route path='/vendor-profile' element={<VendorProfile />} />
      <Route path='/vendor-feedback' element={<FeedbackVendor />} />
      <Route path='/vendor-marketplace' element={<Marketplace />} />
      <Route path='/vendor-messages' element={<MessagesVendor />} />
      <Route path='/vendor-progress' element={<ProgressVendor />} />
      <Route path='/vendor-report' element={<Report />} />

      {/* Coach */}
      <Route path='/coach' element={<Coach />} />
      <Route path='/coach-profile' element={<CoachProfile />} />
      <Route path='/coach/coach-booking' element={<BookingCoach />} />
      <Route path='/coach/coach-marketplace' element={<MarketplaceCoach />} />
      <Route path='/coach-messages' element={<MessagesCoach />} />
      <Route path='/coach/progress' element={<ProgressCoach />} />

      {/* Admin */}
      <Route path='/admin' element={<Admin />} />
      <Route path='/admin/payment-management' element={<PaymentManagement />} />
      <Route path='/admin/report' element={<ReportAdmin />} />
      <Route path='/admin/user-management' element={<UserManagement />} />
    </Routes>
  );
}

export default App;
