import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import TripDetails from "@/components/TripDetails";
import { Loader2 } from "lucide-react";

export default function TripDetailsPage() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const tripId = parseInt(id);

  // Redirect if invalid ID
  if (isNaN(tripId)) {
    setLocation("/");
    return null;
  }

  // Fetch trip data
  const { data: trip, isLoading, error } = useQuery({
    queryKey: [`/api/trips/${tripId}`],
  });

  // Handle error and loading states
  if (error) {
    toast({
      title: "Error loading trip",
      description: "There was a problem loading this trip. Please try again later.",
      variant: "destructive",
    });
    
    // Redirect to dashboard after showing the error
    setTimeout(() => setLocation("/"), 3000);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <MobileHeader />
          <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <MobileHeader />
          <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
            <div className="flex flex-col justify-center items-center h-full">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Trip Not Found</h2>
              <p className="text-gray-500 mb-4">
                The trip you're looking for doesn't exist or has been deleted.
              </p>
              <button 
                onClick={() => setLocation("/")}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Return to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="px-4 sm:px-6 lg:px-8">
            <TripDetails trip={trip} />
          </div>
        </main>
      </div>
    </div>
  );
}
