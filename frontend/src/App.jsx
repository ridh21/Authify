import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";
import { Toaster } from "react-hot-toast";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupPage from "./pages/Signup";

function App() {
  return (
    <Router>
      <Provider store={store}>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="bottom-right" />
          <Navbar />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify-otp" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/page1"
              element={
                <ProtectedRoute>
                  <Page1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/page2"
              element={
                <ProtectedRoute>
                  <Page2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/page3"
              element={
                <ProtectedRoute>
                  <Page3 />
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </div>
      </Provider>
    </Router>
  );
}

export default App;
