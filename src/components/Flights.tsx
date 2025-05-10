import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Country = {
  name: {
    common: string;
  };
  cca2: string;
};

type Flight = {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  sensors: number[] | null;
  geo_altitude: number;
  squawk: string;
  spi: boolean;
  position_source: number;
};

export default function Flights() {
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);

  // Fetch country list on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            name: country.name,
            cca2: country.cca2,
          }))
          .sort((a: Country, b: Country) =>
            a.name.common.localeCompare(b.name.common)
          );
        setCountries(sortedCountries);
      } catch (error) {
        toast({
          title: "Error fetching countries",
          description: "Unable to load country list. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchCountries();
  }, [toast]);

  // Fetch flights when a country is selected
  useEffect(() => {
    const fetchFlights = async () => {
      if (!selectedCountry) return;

      setIsLoading(true);
      try {
        const response = await fetch("https://opensky-network.org/api/states/all");
        const data = await response.json();
        const filteredFlights = data.states
          .map((state: any) => ({
            icao24: state[0],
            callsign: state[1],
            origin_country: state[2],
            time_position: state[3],
            last_contact: state[4],
            longitude: state[5],
            latitude: state[6],
            baro_altitude: state[7],
            on_ground: state[8],
            velocity: state[9],
            true_track: state[10],
            vertical_rate: state[11],
            sensors: state[12],
            geo_altitude: state[13],
            squawk: state[14],
            spi: state[15],
            position_source: state[16],
          }))
          .filter((flight: Flight) => flight.origin_country === selectedCountry);
        setFlights(filteredFlights);
      } catch (error) {
        toast({
          title: "Error fetching flights",
          description: "Unable to load flight data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [selectedCountry, toast]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader />

        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold text-gradient">
                Find Flights
              </h2>
            </div>

            <div className="flex gap-4 mb-6">
              <Select onValueChange={(value) => setSelectedCountry(value)}>
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.cca2} value={country.name.common}>
                      {country.name.common}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : flights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flights.map((flight) => (
                  <div
                    key={flight.icao24}
                    className="border border-gray-200 rounded-2xl p-5 bg-white shadow-md transition-transform duration-300 transform hover:shadow-xl"
                  >
                    <h3 className="text-lg font-semibold mb-1">
                      {flight.callsign || "N/A"}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      Origin Country: {flight.origin_country}
                    </p>
                    <p className="text-gray-600 mb-1">
                      Latitude: {flight.latitude?.toFixed(2) || "N/A"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      Longitude: {flight.longitude?.toFixed(2) || "N/A"}
                    </p>
                    <p className="font-bold text-primary-600">
                      Altitude: {flight.baro_altitude?.toFixed(2) || "N/A"} m
                    </p>
                  </div>
                ))}
              </div>
            ) : selectedCountry ? (
              <div className="text-gray-500 text-center py-8">
                No flights found for {selectedCountry}.
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Select a country to view flights.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
