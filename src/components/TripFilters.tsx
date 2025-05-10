import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TripFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  search: string;
  filter: string;
  sort: string;
}

export default function TripFilters({ onFilterChange }: TripFiltersProps) {
  const form = useForm<FilterValues>({
    defaultValues: {
      search: "",
      filter: "all",
      sort: "dateDesc",
    },
  });

  // Watch for changes and notify parent
  const search = form.watch("search");
  const filter = form.watch("filter");
  const sort = form.watch("sort");

  // React to form changes
  const handleFormChange = () => {
    onFilterChange({
      search,
      filter,
      sort,
    });
  };

  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <Form {...form}>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Search</FormLabel>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Search trips..."
                        className="pl-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormChange();
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <div className="w-full md:w-48">
            <FormField
              control={form.control}
              name="filter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Filter by</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFormChange();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Trips" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Trips</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <div className="w-full md:w-48">
            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Sort by</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFormChange();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Date (newest)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dateDesc">Date (newest)</SelectItem>
                      <SelectItem value="dateAsc">Date (oldest)</SelectItem>
                      <SelectItem value="destinationAsc">Destination (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
