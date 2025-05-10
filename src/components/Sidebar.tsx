import { Link, useLocation } from "wouter";
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

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (route: string): boolean => {
    if (route === "/") return location === "/";
    return location.startsWith(route);
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <div className="flex items-center">
            <i className="fas fa-globe-americas text-primary-500 text-2xl mr-2"></i>
            <h1 className="font-heading font-bold text-xl tracking-tight text-slate-800">
              TravelMate
            </h1>
          </div>
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {sidebarItems.map((item) => (
              <Link href={item.route} key={item.id}>
                <div
                  className={cn(
                    "sidebar-item flex items-center py-2 px-4 rounded-lg font-medium cursor-pointer",
                    isActive(item.route)
                      ? "active bg-primary-50 text-primary-500 border-l-3 border-primary-500"
                      : ""
                  )}
                >
                  <i
                    className={`${item.icon} sidebar-icon mr-3 ${
                      isActive(item.route)
                        ? "text-primary-500"
                        : "text-gray-500"
                    }`}
                  ></i>
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
