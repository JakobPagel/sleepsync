import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage        from "./pages/HomePage";
import AuthPage        from "./pages/AuthPage";
import MorningCheckIn  from "./pages/MorningCheckIn";
import ResultsPage     from "./pages/ResultsPage";
import HistoryPage     from "./pages/HistoryPage";

// Wrapper that redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  { path: "/",       element: <HomePage /> },
  { path: "/login",  element: <AuthPage /> },
  {
    path: "/log",
    element: <ProtectedRoute><MorningCheckIn /></ProtectedRoute>,
  },
  {
    path: "/results",
    element: <ProtectedRoute><ResultsPage /></ProtectedRoute>,
  },
  {
    path: "/history",
    element: <ProtectedRoute><HistoryPage /></ProtectedRoute>,
  },
]);

export default router;