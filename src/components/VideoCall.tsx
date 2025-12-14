import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings,
  Monitor,
  MonitorOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  callId?: string;
  isInitiator?: boolean;
  participantName?: string;
  roomId?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  isOpen,
  onClose,
  callId,
  isInitiator = false,
  participantName = 'Unknown',
  roomId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isConnected, setIsConnected] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      initializeCall();
      callStartTimeRef.current = Date.now();
      
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }

    return () => {
      endCall();
    };
  }, [isOpen]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });

      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        if (state === 'connected') {
          setIsConnected(true);
          setCallStatus('connected');
        } else if (state === 'disconnected' || state === 'failed') {
          setCallStatus('ended');
        }
      };

      setCallStatus('connecting');

      toast({
        title: "Video Call",
        description: "Connecting to participant..."
      });

    } catch (error) {
      console.error('Error initializing call:', error);
      toast({
        title: "Error",
        description: "Failed to access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        if (peerConnectionRef.current && localStreamRef.current) {
          // Replace video track with screen share
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
          
          setIsScreenSharing(true);
          
          // Stop screen sharing when user ends it
          videoTrack.onended = () => {
            setIsScreenSharing(false);
            // Switch back to camera
            if (localStreamRef.current) {
              const cameraTrack = localStreamRef.current.getVideoTracks()[0];
              if (sender && cameraTrack) {
                sender.replaceTrack(cameraTrack);
              }
            }
          };
        }
      } else {
        // Stop screen sharing and return to camera
        if (peerConnectionRef.current && localStreamRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender && cameraTrack) {
            await sender.replaceTrack(cameraTrack);
          }
          
          setIsScreenSharing(false);
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        title: "Error",
        description: "Failed to toggle screen sharing",
        variant: "destructive"
      });
    }
  };

  const endCall = () => {
    // Clean up streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    setCallStatus('ended');
    setIsConnected(false);
    
    // Update call status in database if callId exists
    if (callId) {
      supabase
        .from('calls')
        .update({ status: 'ended' })
        .eq('id', callId);
    }
    
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Call with {participantName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={callStatus === 'connected' ? 'default' : 'secondary'}>
                {callStatus === 'connected' ? `Connected ${formatDuration(callDuration)}` : callStatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-black">
          {/* Remote Video (Main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ display: callStatus === 'connected' ? 'block' : 'none' }}
          />

          {/* Connection Status */}
          {callStatus !== 'connected' && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse mb-4">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium">
                    {callStatus === 'connecting' ? 'Connecting...' : 'Call Ended'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {callStatus === 'connecting' 
                      ? 'Waiting for participant to join'
                      : 'The call has been disconnected'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
              <Button
                variant={isAudioEnabled ? "default" : "destructive"}
                size="sm"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>

              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="sm"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenShare}
              >
                {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={endCall}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;