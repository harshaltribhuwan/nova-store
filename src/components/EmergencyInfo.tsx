import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Phone, MapPin, Building, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryList } from "@/lib/countries";

interface EmergencyInfoProps {
  defaultCountry?: string;
}

export default function EmergencyInfo({ defaultCountry }: EmergencyInfoProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry || "");

  // Set default country if provided as prop
  useEffect(() => {
    if (defaultCountry && defaultCountry !== selectedCountry) {
      setSelectedCountry(defaultCountry);
    }
  }, [defaultCountry]);

  interface EmergencyContactInfo {
    emergency?: Record<string, string>;
    embassy?: {
      address?: string;
      phone?: string;
      email?: string;
    };
    hospitals?: Array<{
      name: string;
      address?: string;
      phone?: string;
      distance?: string;
    }>;
  }

  // Fetch emergency info
  const { data: emergencyInfo, isLoading } = useQuery<EmergencyContactInfo>({
    queryKey: [`/api/emergency-info?country=${selectedCountry}`],
    enabled: !!selectedCountry,
  });

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  if (!selectedCountry) {
    return (
      <Card className="card-premium w-full">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl">
          <CardTitle className="text-xl font-heading font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" /> Emergency Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 mb-5">
            <h3 className="font-heading text-lg text-blue-800 mb-3">Travel Safety Information</h3>
            <p className="text-sm text-blue-700 mb-4">
              Select a country to view emergency contact numbers, embassy details, and nearby healthcare facilities for your trip.
            </p>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-3">Choose a destination:</h4>
              <Select onValueChange={handleCountryChange} defaultValue={selectedCountry}>
                <SelectTrigger className="w-full input-premium">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countryList.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center max-w-md">
              <AlertTriangle className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <p className="text-sm text-red-700">
                Always save emergency information for your travel destination offline in case of limited internet access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find country name from code
  const countryName = countryList.find(c => c.code === selectedCountry)?.name || selectedCountry;

  if (isLoading) {
    return (
      <Card className="card-premium w-full">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl">
          <CardTitle className="text-xl font-heading font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" /> Emergency Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
            <p className="text-blue-700 font-medium">Loading emergency information for {countryName}...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-premium w-full">
      <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-heading font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" /> Emergency Information
          </CardTitle>
          <Select onValueChange={handleCountryChange} defaultValue={selectedCountry}>
            <SelectTrigger className="w-44 bg-white/10 border-white/30 text-white ring-offset-red-500 focus:ring-red-300">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-2">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-5 rounded-xl shadow-sm border border-red-200">
            <h5 className="font-heading font-semibold text-red-800 mb-3 flex items-center">
              <div className="bg-red-100 p-1.5 rounded-full mr-2 shadow-sm">
                <Phone className="h-4 w-4 text-red-700" />
              </div>
              Emergency Numbers
            </h5>
            {emergencyInfo && emergencyInfo.emergency ? (
              <ul className="space-y-3 text-sm">
                {Object.entries(emergencyInfo.emergency).map(([key, value]) => (
                  <li key={key} className="flex items-center bg-white p-2 rounded-lg border border-red-100">
                    <span className="font-medium w-24 capitalize text-red-700">{key.replace('_', ' ')}:</span>
                    <span className="text-gray-800 font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-800 bg-red-50 p-3 rounded-lg border border-red-200">Emergency information not available for this country.</p>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200">
            <h5 className="font-heading font-semibold text-blue-800 mb-3 flex items-center">
              <div className="bg-blue-100 p-1.5 rounded-full mr-2 shadow-sm">
                <Building className="h-4 w-4 text-blue-700" />
              </div>
              Embassy Information
            </h5>
            {emergencyInfo && emergencyInfo.embassy ? (
              <address className="not-italic text-sm bg-white p-3 rounded-lg border border-blue-100">
                {emergencyInfo.embassy.address && <p className="text-gray-800">{emergencyInfo.embassy.address}</p>}
                {emergencyInfo.embassy.phone && (
                  <p className="mt-2 flex items-center">
                    <Phone className="h-3.5 w-3.5 text-blue-600 mr-1" />
                    <span className="font-medium text-blue-700">Phone:</span> 
                    <span className="ml-1">{emergencyInfo.embassy.phone}</span>
                  </p>
                )}
                {emergencyInfo.embassy.email && (
                  <p className="flex items-center mt-1">
                    <span className="font-medium text-blue-700 mr-1">Email:</span> 
                    <span>{emergencyInfo.embassy.email}</span>
                  </p>
                )}
              </address>
            ) : (
              <p className="text-sm text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-200">Embassy information not available for this country.</p>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-5 rounded-xl border border-green-200 shadow-sm sm:col-span-2">
            <h5 className="font-heading font-semibold text-green-800 mb-3 flex items-center">
              <div className="bg-green-100 p-1.5 rounded-full mr-2 shadow-sm">
                <MapPin className="h-4 w-4 text-green-700" />
              </div>
              Nearest Hospitals
            </h5>
            {emergencyInfo && emergencyInfo.hospitals && emergencyInfo.hospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyInfo.hospitals.map((hospital, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <h6 className="font-semibold text-green-800 mb-2">{hospital.name}</h6>
                    <div className="space-y-2 text-sm">
                      {hospital.address && (
                        <div className="flex items-start">
                          <MapPin className="h-3.5 w-3.5 text-green-600 mr-1.5 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{hospital.address}</span>
                        </div>
                      )}
                      {hospital.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 text-green-600 mr-1.5 flex-shrink-0" />
                          <span className="text-gray-700">{hospital.phone}</span>
                        </div>
                      )}
                      {hospital.distance && (
                        <div className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full inline-block mt-1">
                          {hospital.distance} away
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-green-800 bg-green-50 p-3 rounded-lg border border-green-200">
                Hospital information not available for this country.
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <span>
            <span className="font-medium">Important:</span> This information is for reference only. In case of an emergency, always dial the local emergency number immediately. Information may change over time - verify with official sources when possible.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
