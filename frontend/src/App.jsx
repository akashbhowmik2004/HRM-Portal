import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { Route, Routes } from "react-router";
import { ToastProvider } from "./components/ToastProvider";
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <ToastProvider>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ToastProvider>
  );
};

export default App;
