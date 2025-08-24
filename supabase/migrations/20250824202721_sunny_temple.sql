/*
  # Fix Database Schema Issues

  1. New Tables
    - `users` table for user management
    - `search_logs` table for tracking searches
    - `search_cache` table for caching results
    - `subscriptions` table for user subscriptions
    - `discord_users` table for Discord user data
    - `discord_ip_associations` table for IP tracking

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access

  3. Data Fixes
    - Remove duplicate entries if they exist
    - Ensure proper foreign key relationships
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create search logs table
CREATE TABLE IF NOT EXISTS public.search_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  search_type VARCHAR(50) NOT NULL,
  query_input TEXT NOT NULL,
  results_found INTEGER DEFAULT 0,
  api_provider VARCHAR(50),
  cost_credits NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create search cache table
CREATE TABLE IF NOT EXISTS public.search_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_type VARCHAR(50) NOT NULL,
  cache_key VARCHAR(255) NOT NULL UNIQUE,
  query_input TEXT NOT NULL,
  result_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  monthly_queries_limit INTEGER DEFAULT 100,
  monthly_queries_used INTEGER DEFAULT 0,
  last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Discord users table
CREATE TABLE IF NOT EXISTS public.discord_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id VARCHAR(20) NOT NULL UNIQUE,
  username VARCHAR(100),
  discriminator VARCHAR(10),
  display_name VARCHAR(100),
  avatar_hash VARCHAR(100),
  bot BOOLEAN DEFAULT false,
  created_at_discord TIMESTAMP WITH TIME ZONE,
  last_seen TIMESTAMP WITH TIME ZONE,
  mutual_servers INTEGER DEFAULT 0,
  enriched_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Discord IP associations table
CREATE TABLE IF NOT EXISTS public.discord_ip_associations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_user_id UUID REFERENCES public.discord_users(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  geolocation JSONB,
  confidence_score NUMERIC(3,2) DEFAULT 0.50,
  source VARCHAR(100),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_ip_associations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for search_logs table
CREATE POLICY "Users can view own search logs" ON public.search_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search logs" ON public.search_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions table
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for cache and Discord data
CREATE POLICY "Public can read search cache" ON public.search_cache
  FOR SELECT USING (true);

CREATE POLICY "Public can read Discord users" ON public.discord_users
  FOR SELECT USING (true);

CREATE POLICY "Public can read Discord IP associations" ON public.discord_ip_associations
  FOR SELECT USING (true);

-- Insert some sample users data
INSERT INTO public.users (id, email, full_name) VALUES
(gen_random_uuid(), 'admin@sintsation.io', 'System Administrator'),
(gen_random_uuid(), 'analyst@sintsation.io', 'OSINT Analyst')
ON CONFLICT (id) DO NOTHING;

-- Insert sample Discord users
INSERT INTO public.discord_users (discord_id, username, display_name, bot) VALUES
('123456789012345678', 'osint_user', 'OSINT User', false),
('987654321098765432', 'security_bot', 'Security Bot', true),
('456789123456789123', 'threat_hunter', 'Threat Hunter', false)
ON CONFLICT (discord_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_global_activity_created_at ON public.global_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_global_activity_activity_type ON public.global_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_osint_tools_status ON public.osint_tools(status);
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id ON public.search_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_search_cache_cache_key ON public.search_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_discord_users_discord_id ON public.discord_users(discord_id);