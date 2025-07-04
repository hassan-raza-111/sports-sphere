import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/Admin";
import UserManagement from "../pages/UserManagement";
import PaymentManagement from "../pages/PaymentManagement";
import AthleteProgress from "../pages/AthleteProgress";
import Vendors from "../pages/Vendor";
import VendorProfile from "../pages/VendorProfile";
import TrainingProgress from "../pages/TrainingProgress";
import RegistrationForm from "../pages/RegistrationForm";
import CoachProfile from "../pages/CoachProfile";
import MarketplacePage from "../pages/MarketplacePage";
import Messages from "../pages/Messages";
import HomePage from "../pages/Home";
import FindCoaches from "../pages/FindCoaches";
import FeedbackApp from "../pages/FeedbackApp";
import CoachDashboard from "../pages/CoachDashboard";
import CheckoutPage from "../pages/CheckoutPage";
import BookSessionPage from "../pages/BookSessionPage";
import ProfilePage from "../pages/ProfilePage";

export default function NavigationStack() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/find-coaches" element={<FindCoaches />} />
        <Route path="/book-session" element={<BookSessionPage />} />
        <Route path="/feed-back" element={<FeedbackApp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/coach-dashboard" element={<CoachDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/marketPlace" element={<MarketplacePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/coach-profile" element={<CoachProfile />} />
        <Route path="/payment-management" element={<PaymentManagement />} />
        <Route path="/athlete-progress" element={<AthleteProgress />} />
        <Route path="/vendor" element={<Vendors />} />
        <Route path="/check-out" element={<CheckoutPage />} />
        <Route path="/vendor-profile" element={<VendorProfile />} />
        <Route path="/training-progress" element={<TrainingProgress />} />
        <Route path="/registration-form" element={<RegistrationForm />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </div>
  );
}
