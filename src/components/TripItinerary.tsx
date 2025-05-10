import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Itinerary } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,  
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import ItineraryItem from "./ItineraryItem";
import { format, parseISO, isValid } from "date-fns";

interface TripItineraryProps {
  tripId: number;
}

// Form validation schema
const itineraryFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  title: z.string().min(2, { message: "Title is required" }).max(100),
  location: z.string().optional(),
  description: z.string().optional(),
});

type ItineraryFormValues = z.infer<typeof itineraryFormSchema>;

export default function TripItinerary({ tripId }: TripItineraryProps) {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Fetch itinerary items
  const { data: itineraries, isLoading } = useQuery({
    queryKey: [`/api/trips/${tripId}/itinerary`],
  });

  // Create new itinerary mutation
  const { mutate: createItinerary, isPending: isCreating } = useMutation({
    mutationFn: async (data: ItineraryFormValues) => {
      const payload = {
        ...data,
        tripId,
        date: new Date(data.date).toISOString(),
      };
      return apiRequest('POST', '/api/itinerary', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/itinerary`] });
      toast({
        title: "Activity added",
        description: "The activity has been added to your itinerary.",
      });
      setIsAddModalOpen(false);
      form.reset({
        date: "",
        time: "",
        title: "",
        location: "",
        description: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Get unique sorted dates from itinerary items
  const getUniqueDates = (): string[] => {
    if (!itineraries) return [];
    
    const dateSet = new Set<string>();
    
    itineraries.forEach((item: Itinerary) => {
      const dateStr = format(new Date(item.date), 'yyyy-MM-dd');
      dateSet.add(dateStr);
    });
    
    return Array.from(dateSet).sort();
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string): string => {
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'MMM dd') : dateStr;
  };

  // Group itineraries by date
  const getItinerariesByDate = (dateStr: string): Itinerary[] => {
    if (!itineraries) return [];
    
    return itineraries.filter((item: Itinerary) => {
      const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
      return itemDate === dateStr;
    }).sort((a: Itinerary, b: Itinerary) => {
      return a.time.localeCompare(b.time);
    });
  };

  // Get current date itineraries
  const uniqueDates = getUniqueDates();
  
  // Set first date as active tab if none is selected
  if (uniqueDates.length > 0 && !activeTab) {
    setActiveTab(uniqueDates[0]);
  }

  // Setup form for adding new itinerary item
  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      date: "",
      time: "",
      title: "",
      location: "",
      description: "",
    },
  });

  function onSubmit(data: ItineraryFormValues) {
    createItinerary(data);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Itinerary</CardTitle>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
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
                            disabled={isCreating}
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
                            disabled={isCreating}
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
                          disabled={isCreating}
                          placeholder="e.g., Airport Arrival"
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
                          disabled={isCreating}
                          placeholder="e.g., Ngurah Rai International Airport"
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
                          disabled={isCreating}
                          placeholder="Add any notes or details about this activity..."
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
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Activity"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : uniqueDates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities in your itinerary yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Activity" to start building your trip schedule.</p>
          </div>
        ) : (
          <Tabs value={activeTab || uniqueDates[0]} onValueChange={setActiveTab}>
            <div className="mb-4 border-b border-gray-200 overflow-x-auto">
              <TabsList className="flex space-x-6 -mb-px">
                {uniqueDates.map((dateStr) => (
                  <TabsTrigger 
                    key={dateStr} 
                    value={dateStr}
                    className="border-b-2 py-2 px-1 whitespace-nowrap"
                  >
                    {formatDisplayDate(dateStr)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {uniqueDates.map((dateStr) => (
              <TabsContent key={dateStr} value={dateStr} className="space-y-4">
                {getItinerariesByDate(dateStr).map((item) => (
                  <ItineraryItem key={item.id} item={item} tripId={tripId} />
                ))}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add Activity for {formatDisplayDate(dateStr)}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                  value={dateStr}
                                  disabled={true}
                                  onChange={(e) => {
                                    field.onChange(dateStr);
                                  }}
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
                                  disabled={isCreating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Title</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={isCreating}
                                  placeholder="e.g., Airport Arrival"
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
                                  disabled={isCreating}
                                  placeholder="e.g., Ngurah Rai International Airport"
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
                                  disabled={isCreating}
                                  placeholder="Add any notes or details about this activity..."
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
                            onClick={() => setIsAddModalOpen(false)}
                            disabled={isCreating}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isCreating}
                          >
                            {isCreating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Add Activity"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
