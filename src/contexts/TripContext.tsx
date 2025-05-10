import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trip } from "@shared/schema";

interface TripContextType {
  selectedTripId: number | null;
  setSelectedTripId: (id: number | null) => void;
  selectedTrip: Trip | null;
  recentTrips: Trip[];
  upcomingTrips: Trip[];
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripContextProvider({ children }: { children: ReactNode }) {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch all trips
  const { data: trips, isLoading } = useQuery({
    queryKey: ["/api/trips"],
  });

  // Get selected trip
  const selectedTrip = selectedTripId
    ? trips?.find((trip: Trip) => trip.id === selectedTripId) || null
    : null;

  // Get recent and upcoming trips
  const recentTrips: Trip[] = trips 
    ? trips
        .filter((trip: Trip) => trip.status === "upcoming" || trip.status === "planning")
        .sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3)
    : [];

  const upcomingTrips: Trip[] = trips
    ? trips
        .filter((trip: Trip) => trip.status === "upcoming")
        .sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    : [];

  // Automatically select trip when viewing the trip details page
  useEffect(() => {
    if (selectedTripId) {
      // Prefetch trip details
      queryClient.prefetchQuery({
        queryKey: [`/api/trips/${selectedTripId}`],
      });
      
      // Prefetch trip itinerary
      queryClient.prefetchQuery({
        queryKey: [`/api/trips/${selectedTripId}/itinerary`],
      });
      
      // Prefetch trip documents
      queryClient.prefetchQuery({
        queryKey: [`/api/trips/${selectedTripId}/documents`],
      });
    }
  }, [selectedTripId, queryClient]);

  return (
    <TripContext.Provider
      value={{
        selectedTripId,
        setSelectedTripId,
        selectedTrip,
        recentTrips,
        upcomingTrips,
        isLoading,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripContextProvider");
  }
  return context;
}
