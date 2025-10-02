// src/pages/DashboardPage.tsx
import { clearToken, getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = getToken();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4 text-gray-700">JWT Token: {token?.substring(0, 20)}...</p>
      <button
        onClick={() => {
          clearToken();
          navigate("/");
        }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Log out
      </button>
    </div>
  );
}
