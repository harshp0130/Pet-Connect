-- Enable realtime for user_login_logs table
ALTER TABLE public.user_login_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_login_logs;

-- Enable realtime for pets table to update verification status in real-time
ALTER TABLE public.pets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pets;