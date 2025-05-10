import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Document = {
  id: string;
  title: string;
  type: string;
  uploadedDate: string;
  fileUrl: string;
};

export default function Documents() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Simulate fetching documents from a server or database
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Replace with your document API or database fetch logic
        const mockDocuments = [
          {
            id: "1",
            title: "Passport",
            type: "ID",
            uploadedDate: "2025-05-01",
            fileUrl: "/docs/passport.pdf",
          },
          {
            id: "2",
            title: "Visa",
            type: "Visa",
            uploadedDate: "2025-04-15",
            fileUrl: "/docs/visa.pdf",
          },
          {
            id: "3",
            title: "Flight Ticket",
            type: "Ticket",
            uploadedDate: "2025-05-20",
            fileUrl: "/docs/flight_ticket.pdf",
          },
          {
            id: "4",
            title: "Travel Insurance",
            type: "Insurance",
            uploadedDate: "2025-04-01",
            fileUrl: "/docs/travel_insurance.pdf",
          },
        ];
        setDocuments(mockDocuments);
      } catch (error) {
        toast({
          title: "Error fetching documents",
          description: "Unable to load documents. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDocuments = documents.filter(
    (document) =>
      document.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || document.type === selectedCategory)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader />

        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold text-gradient">
                Documents
              </h2>
            </div>

            <div className="flex gap-4 mb-6">
              <Input
                className="w-full md:w-1/3"
                placeholder="Search documents"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ID">ID</SelectItem>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Ticket">Ticket</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-2xl p-5 bg-white shadow-md transition-transform duration-300 transform hover:shadow-xl"
                  >
                    <h3 className="text-lg font-semibold mb-1">
                      {document.title}
                    </h3>
                    <p className="text-gray-600 mb-1">Type: {document.type}</p>
                    <p className="text-gray-600 mb-1">
                      Uploaded on: {document.uploadedDate}
                    </p>
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No documents found. Please upload your documents.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
