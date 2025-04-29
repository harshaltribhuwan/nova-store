import { useState } from "react";
import { Link } from "wouter";

export default function Logout() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    // Call your logout logic here (e.g., clearing auth tokens)
    setTimeout(() => {
      setLoading(false);
      // After logout, redirect to the home page
    }, 1500);
  };

  return (
    <div className="logout-container p-6 bg-background rounded-lg shadow-md text-center mt-32">
      {" "}
      {/* Add margin-top for spacing */}
      <h2 className="text-xl font-semibold text-white mb-4">
        Are you sure you want to logout?
      </h2>
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handleLogout}
          className="btn-animated bg-danger text-white py-3 px-8 rounded-lg font-medium transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
        <Link
          href="/profile"
          className="btn-animated bg-transparent border-2 border-border hover:border-primary text-white hover:text-primary py-3 px-8 rounded-lg font-medium transition-all duration-300"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
