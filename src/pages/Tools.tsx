import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import VisaChecker from "@/components/VisaChecker";
import CurrencyConverter from "@/components/CurrencyConverter";
import FlightRedirect from "@/components/FlightRedirect";
import EmergencyInfo from "@/components/EmergencyInfo";

export default function Tools() {
  const [location] = useLocation();
  
  // References for tool sections
  const visaCheckerRef = useRef<HTMLDivElement>(null);
  const currencyConverterRef = useRef<HTMLDivElement>(null);
  const flightSearchRef = useRef<HTMLDivElement>(null);
  const emergencyInfoRef = useRef<HTMLDivElement>(null);

  // Scroll to specific tool section based on URL hash
  useEffect(() => {
    if (location.includes('#')) {
      const hash = location.split('#')[1];
      
      setTimeout(() => {
        if (hash === 'visa-checker' && visaCheckerRef.current) {
          visaCheckerRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === 'currency-converter' && currencyConverterRef.current) {
          currencyConverterRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === 'flight-search' && flightSearchRef.current) {
          flightSearchRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === 'emergency-info' && emergencyInfoRef.current) {
          emergencyInfoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-slate-800">Travel Tools</h2>
              <p className="mt-2 text-gray-600">
                Essential tools to help plan and manage your trips more effectively.
              </p>
            </div>

            <div className="space-y-8">
              {/* Visa Checker */}
              <div ref={visaCheckerRef} id="visa-checker" className="scroll-mt-16">
                <VisaChecker />
              </div>

              {/* Currency Converter */}
              <div ref={currencyConverterRef} id="currency-converter" className="scroll-mt-16">
                <CurrencyConverter />
              </div>

              {/* Flight Search */}
              <div ref={flightSearchRef} id="flight-search" className="scroll-mt-16">
                <FlightRedirect />
              </div>

              {/* Emergency Info */}
              <div ref={emergencyInfoRef} id="emergency-info" className="scroll-mt-16">
                <EmergencyInfo />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
