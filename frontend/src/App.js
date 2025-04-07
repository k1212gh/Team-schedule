import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SchedulePage from "./pages/SchedulePage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TeamListPage from "./pages/TeamListPage";
import TeamInfoPage from "./pages/TeamInfoPage";
import UploadPage from "./pages/UploadPage";
import NotificationBell from "./components/NotificationBell";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/schedule" /> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
	  <NotificationBell />
	  <Router>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
          <Route path="/task/:taskId" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><TeamListPage /></ProtectedRoute>} />
          <Route path="/team/:teamId" element={<ProtectedRoute><TeamInfoPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

