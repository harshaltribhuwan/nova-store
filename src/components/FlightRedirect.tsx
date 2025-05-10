import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plane } from "lucide-react";
import { airports } from "@/lib/airports";

// Form validation schema
const flightSearchSchema = z.object({
  origin: z.string({
    required_error: "Please select origin airport",
  }),
  destination: z.string({
    required_error: "Please select destination airport",
  }),
  date: z.string({
    required_error: "Please select a date",
  }),
  affiliate: z.string().default("skyscanner"),
});

type FlightSearchValues = z.infer<typeof flightSearchSchema>;

// Map of affiliates and their URLs
const affiliateUrls: Record<string, string> = {
  skyscanner: "https://www.skyscanner.com/transport/flights/{origin}/{destination}/{date}",
  expedia: "https://www.expedia.com/Flights-Search?trip=oneway&leg1={origin},{destination},{date}",
  kayak: "https://www.kayak.com/flights/{origin}-{destination}/{date}",
};

export default function FlightRedirect() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<FlightSearchValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      origin: "",
      destination: "",
      date: new Date().toISOString().split('T')[0],
      affiliate: "skyscanner",
    },
  });

  // Log flight search mutation
  const { mutate: logFlightSearch } = useMutation({
    mutationFn: async (data: FlightSearchValues) => {
      return apiRequest('POST', '/api/flight-search', {
        ...data,
        date: new Date(data.date).toISOString(),
        searchDate: new Date().toISOString(),
      });
    },
    onError: (error) => {
      console.error("Failed to log flight search:", error);
    }
  });

  // Form submission handler
  function onSubmit(values: FlightSearchValues) {
    setIsSubmitting(true);
    
    // Log the flight search
    logFlightSearch(values);
    
    // Construct the affiliate URL
    let affiliateUrl = affiliateUrls[values.affiliate];
    if (!affiliateUrl) {
      affiliateUrl = affiliateUrls.skyscanner; // Fallback to Skyscanner
    }
    
    // Replace placeholders with actual values
    affiliateUrl = affiliateUrl
      .replace('{origin}', values.origin)
      .replace('{destination}', values.destination)
      .replace('{date}', values.date.replace(/-/g, ''));
    
    // Open the affiliate URL in a new tab
    window.open(affiliateUrl, '_blank');
    
    setIsSubmitting(false);
    
    toast({
      title: "Redirecting to flight search",
      description: `Searching for flights from ${values.origin} to ${values.destination} on ${values.date}`,
    });
  }

  return (
    <Card className="card-premium w-full">
      <CardHeader className="bg-gradient-to-r  to-indigo-600 text-black rounded-t-xl">
        <CardTitle className="text-xl font-heading font-semibold flex items-center">
          <Plane className="mr-2 h-5 w-5" /> Flight Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin airport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination airport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="affiliate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select search provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="skyscanner">Skyscanner</SelectItem>
                        <SelectItem value="expedia">Expedia</SelectItem>
                        <SelectItem value="kayak">Kayak</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="button-premium w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Plane className="mr-2 h-4 w-4" />
                  Search Flights
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-xs text-gray-500 text-center">
          Note: You will be redirected to our partner website to complete your flight booking. 
          TravelMate may receive a commission from these bookings.
        </div>
      </CardContent>
    </Card>
  );
}
