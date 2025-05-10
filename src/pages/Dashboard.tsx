import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trip } from "@shared/schema";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import TripCard from "@/components/TripCard";
import TripFilters from "@/components/TripFilters";
import QuickTools from "@/components/QuickTools";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TripForm from "@/components/TripForm";
import { Loader2, Plus } from "lucide-react";

// Sample/mock data (replace with your fetched data later)
const mockTrips: Trip[] = [
  {
    id: "1",
    title: "Spring in Japan",
    destination: "Japan",
    startDate: "2025-04-10",
    endDate: "2025-04-20",
    travelers: 2,
    status: "upcoming",
    imageUrl: "",
  },
  {
    id: "2",
    title: "Romantic Paris",
    destination: "France",
    startDate: "2024-09-15",
    endDate: "2024-09-22",
    travelers: 1,
    status: "completed",
    imageUrl: "",
  },
  {
    id: "3",
    title: "Greek Adventure",
    destination: "Greece",
    startDate: "2025-07-01",
    endDate: "2025-07-10",
    travelers: 4,
    status: "planning",
    imageUrl: "",
  },
  {
    id: "4",
    title: "Bali Beaches",
    destination: "Indonesia",
    startDate: "2025-06-05",
    endDate: "2025-06-15",
    travelers: 2,
    status: "planning",
    imageUrl: "",
  },
  {
    id: "5",
    title: "Love In Italy",
    destination: "Italy",
    startDate: "2025-12-01",
    endDate: "2025-12-10",
    travelers: 3,
    status: "upcoming",
    imageUrl: "",
  },
  {
    id: "6",
    title: "Santorini Escape",
    destination: "Greece",
    startDate: "2024-07-10",
    endDate: "2024-07-18",
    travelers: 2,
    status: "completed",
    imageUrl: "",
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    filter: "all", // planning | upcoming | completed | all
    sort: "dateDesc", // dateAsc | dateDesc | destinationAsc
  });

  const trips = mockTrips;
  const isLoading = false;
  const error = null;

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredTrips = () => {
    let filtered = [...trips];

    // status filter
    if (filters.filter !== "all") {
      filtered = filtered.filter(
        (trip: Trip) =>
          trip.status.toLowerCase() === filters.filter.toLowerCase()
      );
    }

    // search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (trip: Trip) =>
          trip.title.toLowerCase().includes(searchLower) ||
          trip.destination.toLowerCase().includes(searchLower)
      );
    }

    // sorting
    filtered.sort((a: Trip, b: Trip) => {
      if (filters.sort === "dateDesc") {
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      } else if (filters.sort === "dateAsc") {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      } else if (filters.sort === "destinationAsc") {
        return a.destination.localeCompare(b.destination);
      }
      return 0;
    });

    return filtered;
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading trips",
        description:
          "There was a problem loading your trips. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader />

        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-3xl font-heading font-bold text-gradient">
                My Trips
              </h2>
              <Button
                onClick={() => setIsNewTripModalOpen(true)}
                className="button-premium mt-4 md:mt-0 inline-flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Button>
            </div>

            {/* Filters Component (search, sort, status) */}
            <TripFilters onFilterChange={handleFilterChange} />

            {/* Trip Cards or Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : filteredTrips().length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-500 mb-6">
                  {trips.length > 0
                    ? "Try adjusting your filters to see more results."
                    : "You haven't created any trips yet. Click 'New Trip' to get started."}
                </p>
                <Button onClick={() => setIsNewTripModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Trip
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredTrips().map((trip: Trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}

            <QuickTools />
          </div>
        </main>
      </div>

      <Dialog open={isNewTripModalOpen} onOpenChange={setIsNewTripModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <TripForm onClose={() => setIsNewTripModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
