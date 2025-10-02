// src/pages/LoginPage.tsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    try {
      // Send Google ID token to your FastAPI backend
      const res = await axios.post("http://localhost:8000/auth/google", { token: credential });
      setToken(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="w-full max-w-sm bg-neutral-800 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}
