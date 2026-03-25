import { Route, Routes, Navigate } from "react-router";
import Navbar from "./components/layout/Navbar";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import PublicOnlyRoutes from "./components/layout/PublicOnlyRoutes";

function App() {
  return (
    <div className="min-h-screen bg-base-100">
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<PublicOnlyRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
export default App;
