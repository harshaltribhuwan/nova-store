import { useState } from "react";
import { Trip } from "@shared/schema";
import { format, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import TripForm from "./TripForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TripDetailsHeaderProps {
  trip: Trip;
}

// Trip images for different destinations
const tripImages: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  japan: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  italy: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  thailand: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  greece: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  switzerland: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
  indonesia: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400"
};

export default function TripDetailsHeader({ trip }: TripDetailsHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to get trip image based on destination
  const getTripImage = (destination: string) => {
    const lowerDest = destination.toLowerCase();
    for (const [key, url] of Object.entries(tripImages)) {
      if (lowerDest.includes(key)) {
        return url;
      }
    }
    return tripImages.default;
  };

  // Format dates
  const formattedStartDate = format(new Date(trip.startDate), 'MMM dd, yyyy');
  const formattedEndDate = format(new Date(trip.endDate), 'MMM dd, yyyy');
  
  // Calculate trip duration
  const durationDays = differenceInDays(
    new Date(trip.endDate),
    new Date(trip.startDate)
  ) + 1; // Include both start and end days

  // Function to determine trip status badge color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Trips
          </Button>
        </Link>
        <Button 
          size="sm" 
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Trip
        </Button>
      </div>

      <div className="h-56 w-full rounded-lg overflow-hidden relative mb-6">
        <img 
          src={trip.imageUrl || getTripImage(trip.destination)} 
          alt={`${trip.title}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
          <h3 className="text-white text-2xl font-bold">{trip.title}</h3>
          <p className="text-white flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> {trip.destination}
          </p>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Trip Overview</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Dates</p>
            <p className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              {formattedStartDate} - {formattedEndDate}
            </p>
            <p className="text-primary-500 text-sm">{durationDays} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Travelers</p>
            <p className="font-medium flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-400" />
              {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge className={getStatusColor(trip.status)}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
        </div>
        {trip.notes && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm">{trip.notes}</p>
          </div>
        )}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <TripForm 
            onClose={() => setIsEditModalOpen(false)} 
            initialData={trip} 
            isEditing={true} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
