import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  route: string;
};

const sidebarItems: SidebarItem[] = [
  { id: "trips", label: "Trips", icon: "fas fa-suitcase", route: "/" },
  { id: "tools", label: "Tools", icon: "fas fa-tools", route: "/tools" },
  {
    id: "weather",
    label: "Weather",
    icon: "fas fa-cloud-sun",
    route: "/weather",
  },
  {
    id: "flights",
    label: "Flights",
    icon: "fas fa-plane-departure",
    route: "/flights",
  },

  {
    id: "documents",
    label: "Documents",
    icon: "fas fa-file-alt",
    route: "/documents",
  },
];

export default function MobileHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (route: string): boolean => {
    if (route === '/') return location === '/';
    return location.startsWith(route);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <i className="fas fa-globe-americas text-primary-500 text-xl mr-2"></i>
          <h1 className="font-heading font-bold text-lg text-slate-800">TravelMate</h1>
        </div>
      </Link>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6 text-gray-500" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="border-b border-gray-200 pb-4 -mx-5 px-5">
            <SheetTitle className="flex items-center">
              <i className="fas fa-globe-americas text-primary-500 text-2xl mr-2"></i>
              <span className="font-heading font-bold text-xl text-slate-800">TravelMate</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex-1 px-1 py-6 space-y-1">
            {sidebarItems.map((item) => (
              <Link href={item.route} key={item.id}>
                <div 
                  className={cn(
                    "sidebar-item flex items-center py-2 px-4 rounded-lg font-medium cursor-pointer",
                    isActive(item.route) ? "active bg-primary-50 text-primary-500 border-l-3 border-primary-500" : ""
                  )}
                  onClick={handleLinkClick}
                >
                  <i className={`${item.icon} sidebar-icon mr-3 ${isActive(item.route) ? 'text-primary-500' : 'text-gray-500'}`}></i>
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
