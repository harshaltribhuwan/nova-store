import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { countryList } from "@/lib/countries";

// Form validation schema
const visaFormSchema = z.object({
  nationality: z.string({
    required_error: "Please select your nationality",
  }),
  destination: z.string({
    required_error: "Please select your destination",
  }),
});

type VisaFormValues = z.infer<typeof visaFormSchema>;

export default function VisaChecker() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form setup
  const form = useForm<VisaFormValues>({
    resolver: zodResolver(visaFormSchema),
    defaultValues: {
      nationality: "",
      destination: "",
    },
  });

  // Get form values
  const nationality = form.watch("nationality");
  const destination = form.watch("destination");

  // Demo visa information data
  const demoVisaInfo = {
    status: "Visa Required",
    nationality: nationality || "Unknown",
    destination: destination || "Unknown",
    requirements: [
      "Visa application form",
      "Passport with at least 6 months validity",
      "Travel insurance",
      "Hotel reservation",
      "Round trip flight tickets",
      "Proof of sufficient funds",
    ],
  };

  // Simulate loading delay
  const isLoading = false;

  // Form submission handler
  function onSubmit(values: VisaFormValues) {
    setIsSubmitted(true);
  }

  // Get status based on visa requirement
  function getStatusColor(status: string) {
    if (!status) return "bg-gray-100 text-gray-800";

    status = status.toLowerCase();
    if (status.includes("no visa") || status.includes("visa-free")) {
      return "bg-green-100 text-green-800";
    } else if (status.includes("evisa")) {
      return "bg-blue-100 text-blue-800";
    } else if (status.includes("required")) {
      return "bg-orange-100 text-orange-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  }

  // Get status icon
  function getStatusIcon(status: string) {
    if (!status) return <Info className="h-5 w-5 text-gray-500" />;

    status = status.toLowerCase();
    if (status.includes("no visa") || status.includes("visa-free")) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (status.includes("evisa")) {
      return <Info className="h-5 w-5 text-blue-600" />;
    } else if (status.includes("required")) {
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    } else {
      return <Info className="h-5 w-5 text-gray-500" />;
    }
  }

  return (
    <Card className="card-premium w-full">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
        <CardTitle className="text-xl font-heading font-semibold flex items-center">
          <Info className="mr-2 h-5 w-5" /> Visa Requirement Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Nationality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryList.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
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
                    <FormLabel>Destination Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryList.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
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
              disabled={isLoading || !nationality || !destination}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking requirements...
                </>
              ) : (
                "Check Visa Requirements"
              )}
            </Button>
          </form>
        </Form>

        {isSubmitted && demoVisaInfo && !isLoading && (
          <div className="mt-6 space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  {getStatusIcon(demoVisaInfo.status)}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-blue-900">
                    Visa Status
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium mt-1 inline-block ${getStatusColor(
                      demoVisaInfo.status
                    )}`}
                  >
                    {demoVisaInfo.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-blue-800 mb-4 bg-blue-100 p-3 rounded-lg border border-blue-200">
                For citizens of{" "}
                <span className="font-semibold">
                  {demoVisaInfo.nationality}
                </span>{" "}
                traveling to{" "}
                <span className="font-semibold">
                  {demoVisaInfo.destination}
                </span>
              </p>

              {demoVisaInfo.requirements &&
                demoVisaInfo.requirements.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <h4 className="font-medium text-blue-900 mb-3">
                      Requirements:
                    </h4>
                    <ul className="text-sm space-y-2">
                      {demoVisaInfo.requirements.map(
                        (req: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="flex-shrink-0 bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-blue-600 mr-2 mt-0.5">
                              •
                            </span>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>

            <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <span className="font-medium">Note:</span> Visa requirements may
              change. Always check with the official embassy or consulate of
              your destination country for the most up-to-date information.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
