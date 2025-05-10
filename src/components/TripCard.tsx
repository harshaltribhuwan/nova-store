import { Trip } from "@shared/schema";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical, MapPin, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import TripForm from "./TripForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type TripCardProps = {
  trip: Trip;
};

// Function to determine trip status badge color
function getTripStatusColor(status: string): string {
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
}

// Trip images for different destinations
const tripImages: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  japan: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  italy: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  greece: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  switzerland: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  indonesia: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
};

export default function TripCard({ trip }: TripCardProps) {
  const { toast } = useToast();
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

  // Delete trip mutation
  const { mutate: deleteTrip, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/trips/${trip.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: "Trip deleted",
        description: "The trip has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete trip: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      deleteTrip();
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Card className="card-premium card-shadow-hover overflow-hidden rounded-xl">
        <div className="h-48 w-full overflow-hidden relative">
          <img 
            src={trip.imageUrl || getTripImage(trip.destination)} 
            alt={`${trip.title}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 mt-3 mr-3">
            <Badge className={getTripStatusColor(trip.status)}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-heading font-semibold text-gradient mb-1">{trip.title}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-blue-500" /> {trip.destination}
              </p>
            </div>
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit} disabled={isDeleting}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium">{formattedStartDate} - {formattedEndDate}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-blue-500" />
                  <span>{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="text-right flex items-center">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium text-xs">
                  {durationDays} day{durationDays !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
          <Link href={`/`} className="block">
            <button className="button-premium w-full mt-4 text-sm">
              View Details
            </button>
          </Link>
        </CardContent>
      </Card>

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
