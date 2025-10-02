import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline">Go back home</Link>
    </div>
  );
}
