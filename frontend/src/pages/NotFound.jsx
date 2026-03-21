import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-yellow-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 dark:text-gray-200 mb-8">
        Page Not Found
      </p>
      <Link
        to="/"
        className="px-6 py-2 rounded-xl bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
