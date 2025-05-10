import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File } from "lucide-react";
import { uploadFile } from "@/lib/firebase";

interface FileUploaderProps {
  tripId: number;
}

export default function FileUploader({ tripId }: FileUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Handle click on upload button
  const handleUploadClick = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
    } else {
      uploadDocument();
    }
  };

  // Upload document mutation
  const { mutate: createDocument } = useMutation({
    mutationFn: async (data: { name: string; url: string; type: string }) => {
      return apiRequest('POST', '/api/documents', {
        tripId,
        name: data.name,
        url: data.url,
        type: data.type,
        uploadDate: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/documents`] });
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
      clearSelectedFile();
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: `Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      setIsUploading(false);
    }
  });

  // Upload document to Firebase Storage and save to Firestore
  const uploadDocument = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Track upload progress
      const onProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      // Upload file to Firebase Storage
      const fileUrl = await uploadFile(
        `trips/${tripId}/documents/${selectedFile.name}`,
        selectedFile,
        onProgress
      );
      
      // Save document reference in Firestore
      createDocument({
        name: selectedFile.name,
        url: fileUrl,
        type: selectedFile.type,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: `Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="application/pdf,image/*,.doc,.docx"
      />
      
      {selectedFile ? (
        <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium truncate max-w-xs text-blue-800">
                {selectedFile.name}
              </span>
            </div>
            <button
              onClick={clearSelectedFile}
              className="bg-white p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-3 bg-blue-100" />
              <p className="text-xs text-blue-700 font-medium text-right">
                Uploading: {uploadProgress.toFixed(0)}%
              </p>
            </div>
          ) : (
            <Button 
              onClick={uploadDocument} 
              size="sm" 
              className="button-premium w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      ) : (
        <Button 
          onClick={handleUploadClick} 
          variant="outline" 
          className="w-full h-24 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all"
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-blue-800">Click to upload a document</span>
            <span className="text-xs text-gray-600 mt-1">PDF, Images, or Office Documents</span>
          </div>
        </Button>
      )}
    </div>
  );
}
