import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TripContextProvider } from "./contexts/TripContext";

import Dashboard from "./pages/Dashboard";
import TripDetailsPage from "./pages/TripDetailsPage";
import Tools from "./pages/Tools";
import NotFound from "@/pages/not-found";
import Flights from "./components/Flights";
import Weather from "./components/Weather";
import Documents from "./components/Documents";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/trip/:id" component={TripDetailsPage} />
      <Route path="/tools" component={Tools} />
      <Route path="/flights" component={Flights} />
      <Route path="/weather" component={Weather} />
      <Route path="/documents" component={Documents} />
      <Route path="/trip/:id" component={TripDetailsPage}  />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TripContextProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </TripContextProvider>
    </QueryClientProvider>
  );
}

export default App;
