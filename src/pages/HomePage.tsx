import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="max-w-2xl text-center p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Bond</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          A modern B2B SaaS platform to connect businesses and users securely.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="rounded-lg border border-blue-600 px-5 py-2.5 text-blue-600 font-medium hover:bg-blue-50 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      <footer className="mt-auto py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} Bond Inc. All rights reserved.
      </footer>
    </div>
  );
}
