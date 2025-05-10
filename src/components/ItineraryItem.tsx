import { useState } from "react";
import { Itinerary } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ItineraryItemProps {
  item: Itinerary;
  tripId: number;
}

const itineraryFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  title: z.string().min(2, { message: "Title is required" }).max(100),
  location: z.string().optional(),
  description: z.string().optional(),
});

type ItineraryFormValues = z.infer<typeof itineraryFormSchema>;

export default function ItineraryItem({ item, tripId }: ItineraryItemProps) {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Format the date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Delete itinerary mutation
  const { mutate: deleteItinerary, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/itinerary/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/itinerary`] });
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully deleted from your itinerary.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Setup form for editing
  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      date: new Date(item.date).toISOString().split('T')[0],
      time: item.time,
      title: item.title,
      location: item.location || "",
      description: item.description || "",
    },
  });

  // Update itinerary mutation
  const { mutate: updateItinerary, isPending: isUpdating } = useMutation({
    mutationFn: async (data: ItineraryFormValues) => {
      const payload = {
        ...data,
        tripId,
        date: new Date(data.date).toISOString(),
      };
      return apiRequest('PUT', `/api/itinerary/${item.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/itinerary`] });
      toast({
        title: "Activity updated",
        description: "The activity has been successfully updated.",
      });
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: ItineraryFormValues) {
    updateItinerary(data);
  }

  return (
    <>
      <div className="flex space-x-3 border-l-2 border-primary-500 pl-4">
        <div className="flex-none w-16 text-sm text-gray-500">
          {item.time}
        </div>
        <div className="flex-1 bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium">{item.title}</h5>
              {item.location && (
                <p className="text-sm text-gray-600">{item.location}</p>
              )}
            </div>
            <div className="flex">
              <button 
                className="text-gray-400 hover:text-gray-500 mr-2"
                onClick={() => setIsEditModalOpen(true)}
                disabled={isDeleting}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button 
                className="text-gray-400 hover:text-red-500"
                onClick={() => deleteItinerary()}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {item.description && (
            <p className="text-sm text-gray-500 mt-2">{item.description}</p>
          )}
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
