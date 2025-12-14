import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/FileUpload';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface VideoUpdate {
  id: string;
  video_url: string;
  caption: string;
  created_at: string;
  sender_id: string;
  sender_name?: string;
}

interface VideoUpdateProps {
  petCareRequestId: string;
  updates: VideoUpdate[];
  canPost: boolean;
  onUpdate: () => void;
}

export const VideoUpdate: React.FC<VideoUpdateProps> = ({
  petCareRequestId,
  updates,
  canPost,
  onUpdate
}) => {
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleVideoUpload = async (files: File[]) => {
    if (files.length > 0) {
      setVideoFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || !caption.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a video and caption.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Upload video to storage
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${petCareRequestId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-documents')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pet-documents')
        .getPublicUrl(fileName);

      // Create video update record
      const { error: insertError } = await supabase
        .from('video_updates')
        .insert({
          pet_care_request_id: petCareRequestId,
          video_url: publicUrl,
          caption: caption.trim(),
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Video Update Posted",
        description: "Your video update has been shared successfully."
      });

      setCaption('');
      setVideoFile(null);
      onUpdate();
    } catch (error) {
      console.error('Error posting video update:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to post video update. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Post New Update */}
      {canPost && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Share Video Update</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setVideoFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90 file:transition-colors"
              />
            </div>
            
            {videoFile && (
              <div className="p-3 bg-muted rounded-md animate-scale-in">
                <p className="text-sm">Selected: {videoFile.name}</p>
              </div>
            )}

            <Textarea
              placeholder="Add a caption for your video update..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="transition-all duration-200 focus:scale-[1.02]"
            />

            <Button 
              onClick={handleSubmit}
              disabled={uploading || !videoFile || !caption.trim()}
              className="w-full transition-all duration-200 hover:scale-105"
            >
              {uploading ? 'Posting...' : 'Post Update'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Updates List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold animate-fade-in">Video Updates</h3>
        
        {updates.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="text-center py-8">
              <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-float" />
              <p className="text-muted-foreground">No video updates yet</p>
            </CardContent>
          </Card>
        ) : (
          updates.map((update, index) => (
            <Card 
              key={update.id} 
              className="animate-fade-in hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{update.sender_name || 'Pet Caregiver'}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                  </div>
                </div>

                <video 
                  controls 
                  className="w-full rounded-md mb-3 transition-transform duration-200 hover:scale-[1.02]"
                  style={{ maxHeight: '300px' }}
                >
                  <source src={update.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <p className="text-foreground">{update.caption}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};