import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Document } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Upload, FileText, Image, File, Download, Trash2 } from "lucide-react";
import FileUploader from "./FileUploader";
import { format } from "date-fns";

interface TripDocumentsProps {
  tripId: number;
}

export default function TripDocuments({ tripId }: TripDocumentsProps) {
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: [`/api/trips/${tripId}/documents`],
  });

  // Delete document mutation
  const { mutate: deleteDocument } = useMutation({
    mutationFn: async (documentId: number) => {
      return apiRequest('DELETE', `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/documents`] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Handle document delete
  const handleDeleteDocument = (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      deleteDocument(documentId);
    }
  };

  // Helper function to get icon based on file type
  const getFileIcon = (type: string | undefined) => {
    if (!type) return <File className="h-5 w-5 text-primary-500" />;
    
    if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-primary-500" />;
    } else if (type.includes('image')) {
      return <Image className="h-5 w-5 text-primary-500" />;
    } else {
      return <File className="h-5 w-5 text-primary-500" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card className="card-premium">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-heading font-semibold text-gradient">Documents</CardTitle>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="button-premium">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <FileUploader tripId={tripId} />
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-800">
                  Upload travel-related documents such as flight tickets, hotel reservations, passport copies, or travel insurance.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : !documents || documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No documents uploaded yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Click "Upload" to add your travel documents.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document: Document) => (
              <div 
                key={document.id} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 transition-all hover:shadow-md"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                    {getFileIcon(document.type || '')}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-900">{document.name}</p>
                    <p className="text-xs text-gray-600">Added {formatDate(document.uploadDate)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    asChild
                  >
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 text-gray-400 hover:text-primary-500" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
