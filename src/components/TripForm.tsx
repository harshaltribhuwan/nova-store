import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trip } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryList } from "@/lib/countries";
import { X } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";

interface TripFormProps {
  onClose: () => void;
  initialData?: Trip;
  isEditing?: boolean;
}

// Form validation schema
const tripFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Trip title must be at least 2 characters" })
    .max(100),
  destination: z.string().min(1, { message: "Destination is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  travelers: z.coerce
    .number()
    .min(1, { message: "At least 1 traveler is required" })
    .max(50),
  notes: z.string().optional().nullable(),
  status: z.string().optional().default("upcoming"),
  imageUrl: z.string().optional().nullable(),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

export default function TripForm({
  onClose,
  initialData,
  isEditing = false,
}: TripFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      destination: initialData?.destination || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      travelers: initialData?.travelers || 1,
      notes: initialData?.notes || "",
      status: initialData?.status || "upcoming",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const { mutate: saveTrip } = useMutation({
    mutationFn: async (data: TripFormValues) => {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        travelers: Number(data.travelers),
      };

      // Simulate fake backend response
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            `${isEditing ? "Updated" : "Created"} trip (mock):`,
            payload
          );
          resolve(payload);
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });

      toast({
        title: isEditing ? "Trip updated" : "Trip created",
        description: isEditing
          ? "Your trip has been updated successfully (mock)."
          : "Your new trip has been created successfully (mock).",
      });

      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} trip: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(data: TripFormValues) {
    setIsSubmitting(true);
    saveTrip(data);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <DialogTitle className="text-xl font-semibold">
          {isEditing ? "Edit Trip" : "Create New Trip"}
        </DialogTitle>
        {/* Single close icon */}
        {/* <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button> */}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Summer Vacation"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryList.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="travelers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Travelers</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes or details about your trip..."
                    {...field}
                    value={field.value || ""}
                    rows={3}
                    disabled={isSubmitting}
                    className="input-premium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="button-premium"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Trip"
                : "Create Trip"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
