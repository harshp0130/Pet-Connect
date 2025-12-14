import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Upload, Video, X } from 'lucide-react';

interface VideoUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  careRequestId: string;
  petName: string;
}

const VideoUpdateDialog = ({ isOpen, onClose, careRequestId, petName }: VideoUpdateDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video file must be smaller than 50MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive"
        });
        return;
      }

      setVideoFile(file);
    }
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('video-updates')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('video-updates')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast({
        title: "Caption required",
        description: "Please add a caption for your video update",
        variant: "destructive"
      });
      return;
    }

    if (!videoFile && !videoUrl.trim()) {
      toast({
        title: "Video required",
        description: "Please upload a video or provide a video URL",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      let finalVideoUrl = videoUrl;

      // Upload file if using file method
      if (uploadMethod === 'file' && videoFile) {
        finalVideoUrl = await uploadVideo(videoFile);
      }

      // Create video update record
      const { error } = await supabase
        .from('video_updates')
        .insert({
          pet_care_request_id: careRequestId,
          sender_id: user?.id,
          video_url: finalVideoUrl,
          caption: caption.trim()
        });

      if (error) throw error;

      toast({
        title: "Video update sent!",
        description: `Your video update for ${petName} has been sent to the owner`
      });

      // Reset form
      setCaption('');
      setVideoFile(null);
      setVideoUrl('');
      onClose();

    } catch (error: any) {
      console.error('Error sending video update:', error);
      toast({
        title: "Error",
        description: "Failed to send video update. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setCaption('');
      setVideoFile(null);
      setVideoUrl('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Send Video Update
          </DialogTitle>
          <DialogDescription>
            Send a video update to {petName}'s owner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Method Selection */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMethod('file')}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload File
            </Button>
            <Button
              type="button"
              variant={uploadMethod === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMethod('url')}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-1" />
              Video URL
            </Button>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="space-y-2">
              <Label htmlFor="video-file">Video File</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {videoFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span>{videoFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={uploading}
              />
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption *</Label>
            <Textarea
              id="caption"
              placeholder="Share what you're doing with the pet, how they're feeling, any updates..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || (!videoFile && !videoUrl.trim()) || !caption.trim()}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Send Update
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUpdateDialog;