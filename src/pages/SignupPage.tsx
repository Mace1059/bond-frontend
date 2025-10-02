import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setToken } from "../utils/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Handle traditional email/password signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/auth/signup", { email, password });
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  // ✅ Handle Google signup/login
  const handleGoogleSignup = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    try {
      const res = await axios.post("http://localhost:8000/auth/google", { token: credential });
      setToken(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google signup failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="w-full max-w-sm bg-neutral-800 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {/* 🌐 Google Signup */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => console.log("Google Signup Failed")}
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
            useOneTap
          />
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-800 px-2 text-neutral-400">or</span>
          </div>
        </div>

        {/* 📧 Email + Password Signup */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg bg-neutral-700 text-white px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg bg-neutral-700 text-white px-3 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
