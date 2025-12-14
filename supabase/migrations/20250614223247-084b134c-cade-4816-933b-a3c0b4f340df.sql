-- Enable realtime for admin_activity_logs table as well
ALTER TABLE public.admin_activity_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_activity_logs;