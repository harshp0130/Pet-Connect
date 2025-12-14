import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileImage, FileText, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  onRemove: (url: string) => void;
  uploadedFiles: string[];
  maxFiles?: number;
  acceptedTypes?: string[];
  bucketName: 'pet-images' | 'pet-documents';
  label: string;
  description?: string;
}

const FileUpload = ({ 
  onUpload, 
  onRemove, 
  uploadedFiles, 
  maxFiles = 5, 
  acceptedTypes = ['image/*'],
  bucketName,
  label,
  description 
}: FileUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check file limits
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    if (!user) return;

    setUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        const isValidType = acceptedTypes.some(type => {
          if (type === 'image/*') return file.type.startsWith('image/');
          if (type === 'application/pdf') return file.type === 'application/pdf';
          return file.type === type;
        });

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type`,
            variant: "destructive"
          });
          continue;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 5MB limit`,
            variant: "destructive"
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL for images, private URL for documents
        let fileUrl;
        if (bucketName === 'pet-images') {
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);
          fileUrl = urlData.publicUrl;
        } else {
          const { data: urlData, error: urlError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 year
          if (urlError) throw urlError;
          fileUrl = urlData.signedUrl;
        }

        uploadedUrls.push(fileUrl);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      if (uploadedUrls.length > 0) {
        onUpload(uploadedUrls);
        toast({
          title: "Upload successful",
          description: `${uploadedUrls.length} file(s) uploaded`,
          className: "bg-green-50 border-green-200 text-green-800"
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (url: string) => {
    try {
      // Extract file path from URL for deletion
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user?.id}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error && !error.message.includes('not found')) {
        throw error;
      }

      onRemove(url);
      toast({
        title: "File removed",
        description: "File has been deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error removing file",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (url: string) => {
    if (bucketName === 'pet-images') {
      return <Image className="h-4 w-4" />;
    }
    if (url.includes('.pdf')) {
      return <FileText className="h-4 w-4" />;
    }
    return <FileImage className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">{label}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>

      {/* Upload Button */}
      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="space-y-3">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uploading files...</p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadedFiles.length >= maxFiles}
              >
                Choose Files
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {acceptedTypes.includes('image/*') && 'Images: JPG, PNG, GIF'}
                {acceptedTypes.includes('application/pdf') && ' • PDFs'}
                <br />
                Max {maxFiles} files, 5MB each
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="grid gap-2">
            {uploadedFiles.map((url, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getFileIcon(url)}
                <div className="flex-1 min-w-0">
                  {bucketName === 'pet-images' ? (
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-sm truncate">
                      Document {index + 1}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(url)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;