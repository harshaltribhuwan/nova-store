import { useState } from "react";
import { Trip } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripDetailsHeader from "./TripDetailsHeader";
import TripItinerary from "./TripItinerary";
import TripDocuments from "./TripDocuments";
import EmergencyInfo from "./EmergencyInfo";

interface TripDetailsProps {
  trip: Trip;
}

export default function TripDetails({ trip }: TripDetailsProps) {
  return (
    <div>
      <TripDetailsHeader trip={trip} />
      
      <Tabs defaultValue="itinerary" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary">
          <TripItinerary tripId={trip.id} />
        </TabsContent>
        
        <TabsContent value="documents">
          <TripDocuments tripId={trip.id} />
        </TabsContent>
        
        <TabsContent value="emergency">
          <EmergencyInfo defaultCountry={trip.destination} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
