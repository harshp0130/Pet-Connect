import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, User, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  sender_id: string;
  created_at: string;
  sender?: {
    full_name: string;
  };
}

interface ChatRoomProps {
  careRequestId: string;
  participants: Array<{
    user_id: string;
    full_name: string;
  }>;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ careRequestId, participants }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    initializeChatRoom();
  }, [careRequestId]);

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatRoom = async () => {
    try {
      // Check if chat room already exists
      const { data: existingRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('pet_care_request_id', careRequestId)
        .single();

      if (roomError && roomError.code !== 'PGRST116') {
        throw roomError;
      }

      if (existingRoom) {
        setChatRoomId(existingRoom.id);
      } else {
        // Create new chat room
        const { data: newRoom, error: createError } = await supabase
          .rpc('create_chat_room_for_request', { request_id: careRequestId });

        if (createError) throw createError;
        setChatRoomId(newRoom);
      }
    } catch (error) {
      console.error('Error initializing chat room:', error);
      toast({
        title: "Error",
        description: "Failed to initialize chat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoomId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name)
        `)
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as any) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!chatRoomId) return;

    const subscription = supabase
      .channel(`chat_room_${chatRoomId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `chat_room_id=eq.${chatRoomId}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: chatRoomId,
          sender_id: user.id,
          message: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isOwnMessage = (senderId: string) => user?.id === senderId;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Chat</span>
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {participants.map((participant) => (
            <Badge key={participant.user_id} variant="outline" className="text-xs animate-scale-in">
              {participant.full_name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 animate-fade-in">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50 animate-float" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex animate-fade-in ${isOwnMessage(message.sender_id) ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-sm ${
                    isOwnMessage(message.sender_id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {!isOwnMessage(message.sender_id) && (
                    <div className="flex items-center space-x-1 mb-1">
                      <User className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {message.sender?.full_name || 'Unknown'}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm break-words">{message.message}</p>
                  
                  {message.file_url && (
                    <div className="mt-2 animate-scale-in">
                      {message.message_type === 'image' ? (
                        <img
                          src={message.file_url}
                          alt="Shared image"
                          className="max-w-full h-auto rounded transition-transform duration-200 hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 text-xs">
                          <ImageIcon className="h-4 w-4" />
                          <span>File attachment</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 animate-slide-in-right">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={sending}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};