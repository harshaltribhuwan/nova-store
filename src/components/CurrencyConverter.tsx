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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { currencies } from "@/lib/currencies";

// Form validation schema
const currencyFormSchema = z.object({
  from: z.string({
    required_error: "Please select source currency",
  }),
  to: z.string({
    required_error: "Please select target currency",
  }),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Please enter a valid number",
    })
    .positive({
      message: "Amount must be positive",
    }),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

interface RateData {
  rate: number;
  timestamp?: number;
  from: string;
  to: string;
}

export default function CurrencyConverter() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form setup
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      from: "USD",
      to: "EUR",
      amount: 100,
    },
  });

  // Get form values
  const from = form.watch("from");
  const to = form.watch("to");
  const amount = form.watch("amount");

  // Fetch exchange rate from external API
  const { data: rateData, isLoading } = useQuery<RateData>({
    queryKey: [`/api/exchange-rate?from=${from}&to=${to}`],
    enabled: isSubmitted && !!from && !!to,
    queryFn: async () => {
      const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await response.json();
      return {
        rate: data.rates[to],
        from,
        to,
        timestamp: data.time_last_update_unix,
      };
    },
  });

  // Form submission handler
  function onSubmit(values: CurrencyFormValues) {
    setIsSubmitted(true);
  }

  // Swap currencies
  function swapCurrencies() {
    const currentFrom = form.getValues("from");
    const currentTo = form.getValues("to");

    form.setValue("from", currentTo);
    form.setValue("to", currentFrom);

    if (isSubmitted) {
      form.handleSubmit(onSubmit)();
    }
  }

  // Format date
  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Card className="card-premium w-full">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
        <CardTitle className="text-xl font-heading font-semibold flex items-center">
          <ArrowRightLeft className="mr-2 h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-5 gap-4 items-end">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="From currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                            >
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={swapCurrencies}
                  className="self-center"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="To currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                            >
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert"
              )}
            </Button>
          </form>
        </Form>

        {isSubmitted && rateData && !isLoading && (
          <div className="mt-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-md">
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {Number(amount).toFixed(2)} {from} =
                </p>
                <p className="text-2xl font-bold text-gradient my-2">
                  {(Number(amount) * rateData.rate).toFixed(2)} {to}
                </p>
                <p className="text-sm text-gray-500">
                  1 {from} = {rateData.rate.toFixed(6)} {to}
                </p>
              </div>
            </div>

            {rateData.timestamp && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Rates updated on {formatDate(rateData.timestamp)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
