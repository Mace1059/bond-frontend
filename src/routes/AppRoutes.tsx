import { useRoutes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/ProtectedRoute";
import FlowPage from "../pages/FlowPage"
import FlowTemplate from "../pages/Templates/FlowTemplate"

export default function AppRoutes() {
  return useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),  
    },
    { path: "/flow",
      element: (
        <ProtectedRoute>
          <FlowTemplate/>
        </ProtectedRoute>
      ),
      children: [
        {
          path: '',
          element: <FlowPage/>,
        }
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);
}
