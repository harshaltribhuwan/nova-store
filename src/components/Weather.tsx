import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaWind,
} from "react-icons/fa";

type Country = {
  name: {
    common: string;
  };
  cca2: string;
};

type City = {
  name: string;
  lat: number;
  lon: number;
};

export default function Weather() {
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // City list for each country (can be expanded as needed)
  const cityList: { [key: string]: City[] } = {
    Australia: [
      { name: "Sydney", lat: -33.8688, lon: 151.2093 },
      { name: "Melbourne", lat: -37.8136, lon: 144.9631 },
      { name: "Brisbane", lat: -27.4698, lon: 153.0251 },
      { name: "Perth", lat: -31.9505, lon: 115.8605 },
    ],
    India: [
      { name: "Mumbai", lat: 19.076, lon: 72.8777 },
      { name: "Delhi", lat: 28.6139, lon: 77.209 },
      { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
      { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
    ],
    France: [
      { name: "Paris", lat: 48.8566, lon: 2.3522 },
      { name: "Marseille", lat: 43.2965, lon: 5.3698 },
      { name: "Lyon", lat: 45.764, lon: 4.8357 },
      { name: "Nice", lat: 43.7102, lon: 7.262 },
    ],
    Germany: [
      { name: "Berlin", lat: 52.52, lon: 13.405 },
      { name: "Munich", lat: 48.1351, lon: 11.582 },
      { name: "Hamburg", lat: 53.5511, lon: 9.9937 },
      { name: "Frankfurt", lat: 50.1109, lon: 8.6821 },
    ],
    Italy: [
      { name: "Rome", lat: 41.9028, lon: 12.4964 },
      { name: "Milan", lat: 45.4642, lon: 9.19 },
      { name: "Florence", lat: 43.7696, lon: 11.2558 },
      { name: "Venice", lat: 45.4408, lon: 12.3155 },
    ],
    Spain: [
      { name: "Madrid", lat: 40.4168, lon: -3.7038 },
      { name: "Barcelona", lat: 41.3784, lon: 2.1922 },
      { name: "Seville", lat: 37.3886, lon: -5.9823 },
      { name: "Valencia", lat: 39.4699, lon: -0.3763 },
    ],
    Canada: [
      { name: "Toronto", lat: 43.6532, lon: -79.3832 },
      { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
      { name: "Montreal", lat: 45.5017, lon: -73.5673 },
      { name: "Calgary", lat: 51.0447, lon: -114.0719 },
    ],
    Japan: [
      { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      { name: "Osaka", lat: 34.6937, lon: 135.5023 },
      { name: "Kyoto", lat: 35.0116, lon: 135.7681 },
      { name: "Sapporo", lat: 43.0667, lon: 141.35 },
    ],
  };

  // Fetch countries on mount
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

  // Fetch cities when a country is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) return;
      try {
        // Use cityList to set the cities for the selected country
        const availableCities = cityList[selectedCountry] || [];
        setCities(availableCities);
      } catch (error) {
        toast({
          title: "Error fetching cities",
          description: "Unable to load city list. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchCities();
  }, [selectedCountry, toast]);

  // Fetch weather data when a city is selected
  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`
        );
        const data = await response.json();
        setWeatherData(data.current_weather);
      } catch (error) {
        toast({
          title: "Error fetching weather",
          description: "Unable to load weather data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity, toast]);

  // Weather description function
  const getWeatherDescription = (code: number) => {
    switch (code) {
      case 1:
        return "Clear Sky";
      case 2:
        return "Partly Cloudy";
      case 3:
        return "Cloudy";
      case 4:
        return "Overcast";
      case 5:
        return "Rain";
      case 6:
        return "Heavy Rain";
      case 7:
        return "Snow";
      case 8:
        return "Heavy Snow";
      case 9:
        return "Thunderstorm";
      default:
        return "Unknown";
    }
  };

  // Weather icon based on weather code
  const getWeatherIcon = (code: number) => {
    switch (code) {
      case 1:
        return <FaSun className="text-yellow-500" />;
      case 2:
        return <FaCloud className="text-gray-500" />;
      case 3:
        return <FaCloud className="text-gray-600" />;
      case 4:
        return <FaCloud className="text-gray-700" />;
      case 5:
        return <FaCloudRain className="text-blue-500" />;
      case 6:
        return <FaCloudRain className="text-blue-600" />;
      case 7:
        return <FaSnowflake className="text-white" />;
      case 8:
        return <FaSnowflake className="text-white" />;
      case 9:
        return <FaWind className="text-green-500" />;
      default:
        return <FaCloud className="text-gray-500" />;
    }
  };

  // Determine travel recommendation based on weather
  const getRecommendation = () => {
    if (!weatherData) return "";
    const temp = weatherData.temperature;
    const wind = weatherData.windspeed;
    if (temp >= 15 && temp <= 30 && wind < 10) {
      return "Good time to visit.";
    } else {
      return "Consider postponing your trip.";
    }
  };

  // Filter out countries with no cities
  const countriesWithCities = countries.filter((country) => {
    const citiesForCountry = cityList[country.name.common];
    return citiesForCountry && citiesForCountry.length > 0;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader />

        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-gradient mb-6">
              Weather Insights
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select onValueChange={(value) => setSelectedCountry(value)}>
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countriesWithCities.map((country) => (
                    <SelectItem key={country.cca2} value={country.name.common}>
                      {country.name.common}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setSelectedCity(
                    cities.find((city) => city.name === value) || null
                  )
                }
                disabled={!cities.length}
              >
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : weatherData ? (
              <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-2">
                  Weather in {selectedCity?.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  {getWeatherIcon(weatherData.weathercode)}
                  <p className="text-gray-700">
                    {getWeatherDescription(weatherData.weathercode)}
                  </p>
                </div>
                <p className="text-gray-700 mb-1">
                  Temperature: {weatherData.temperature}°C
                </p>
                <p className="text-gray-700 mb-1">
                  Wind Speed: {weatherData.windspeed} km/h
                </p>
                <p className="font-medium text-primary-600">
                  {getRecommendation()}
                </p>
              </Card>
            ) : selectedCity ? (
              <div className="text-gray-500 text-center py-8">
                No weather data available for {selectedCity.name}.
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Select a country and city to view weather information.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
