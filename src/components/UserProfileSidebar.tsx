import { useState, useRef } from "react";
import Logout from "./Logout"; // ✅ import
import { X } from "lucide-react"; // Add X icon import (assuming you're using lucide-react for icons)
import { UserCircle } from "lucide-react"; // Add UserCircle import (assuming it's from lucide-react)

interface UserProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileSidebar({
  isOpen,
  onClose,
}: UserProfileSidebarProps) {
  const [currentPage, setCurrentPage] = useState<"profile" | "logout">(
    "profile"
  );

  const profileRef = useRef<HTMLDivElement | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return (
          <div className="space-y-6">
            <UserCircle size={64} className="text-primary" />
            <p className="text-white text-xl font-medium">John Doe</p>
            <p className="text-muted-foreground text-sm">johndoe@example.com</p>
          </div>
        );
      case "logout":
        return <Logout />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div
      ref={profileRef}
      className={`fixed top-0 right-0 w-full md:w-80 h-full bg-background/95 backdrop-blur-lg z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-500 shadow-xl`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Profile</h2>
          <button
            className="text-white hover:text-primary transition-colors"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X />
          </button>
        </div>

        {renderPage()}

        <div className="mt-10 space-y-4">
          {/* Profile and Logout buttons */}
          <button
            className="w-full flex items-center justify-start space-x-3 p-3 text-white hover:text-primary border border-border rounded-lg transition-colors"
            onClick={() => setCurrentPage("profile")}
          >
            <UserCircle size={18} />
            <span>Profile</span>
          </button>
          <button
            className="w-full flex items-center justify-start space-x-3 p-3 text-white hover:text-primary border border-border rounded-lg transition-colors"
            onClick={() => setCurrentPage("logout")}
          >
            <Logout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
