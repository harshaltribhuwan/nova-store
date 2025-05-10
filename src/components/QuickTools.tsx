import { Link } from "wouter";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  Tickets, 
  RefreshCw, 
  Plane, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";

export default function QuickTools() {
  return (
    <div className="mt-4 mb-8">
      <h2 className="text-xl font-heading font-bold text-slate-800 mb-4">Quick Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visa Checker Tool Card */}
        <Card className="bg-white hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Tickets className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900">Visa Checker</h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">Check visa requirements for your nationality and destination.</p>
            <Link href="/tools#visa-checker">
              <span className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center cursor-pointer">
                Check visa requirements
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* Currency Converter Tool Card */}
        <Card className="bg-white hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900">Currency Converter</h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">Convert between currencies with real-time exchange rates.</p>
            <Link href="/tools#currency-converter">
              <span className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center cursor-pointer">
                Convert currency
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* Flight Search Tool Card */}
        <Card className="bg-white hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Plane className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900">Flight Search</h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">Find and compare flights from our partner websites.</p>
            <Link href="/tools#flight-search">
              <span className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center cursor-pointer">
                Search flights
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* Emergency Info Tool Card */}
        <Card className="bg-white hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900">Emergency Info</h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">Access emergency contacts and information for your destination.</p>
            <Link href="/tools#emergency-info">
              <span className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center cursor-pointer">
                View emergency info
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
