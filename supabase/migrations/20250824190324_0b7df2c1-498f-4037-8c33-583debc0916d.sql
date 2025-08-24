-- Create tables for sintsation.io analytics and OSINT platform

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  geolocation JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- OSINT tools status and metrics
CREATE TABLE public.osint_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  api_endpoint TEXT,
  last_check TIMESTAMP WITH TIME ZONE,
  response_time_ms INTEGER,
  success_rate NUMERIC(5,2) DEFAULT 0.00,
  total_queries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time global activity tracking
CREATE TABLE public.global_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type VARCHAR(50) NOT NULL,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  country_code VARCHAR(3),
  city VARCHAR(100),
  tool_used VARCHAR(100),
  severity VARCHAR(20) DEFAULT 'low',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System metrics for dashboard
CREATE TABLE public.system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC,
  metric_unit VARCHAR(20),
  metric_type VARCHAR(50),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osint_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analytics events" 
ON public.analytics_events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics events" 
ON public.analytics_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view OSINT tools" 
ON public.osint_tools FOR SELECT 
USING (true);

CREATE POLICY "Public can view global activity" 
ON public.global_activity FOR SELECT 
USING (true);

CREATE POLICY "Public can view system metrics" 
ON public.system_metrics FOR SELECT 
USING (true);

-- Insert initial OSINT tools data
INSERT INTO public.osint_tools (name, category, status, success_rate, total_queries) VALUES
('Criminal IP', 'OSINT', 'active', 98.50, 15420),
('Shodan', 'OSINT', 'active', 99.20, 28940),
('Maltego', 'OSINT', 'active', 96.80, 12340),
('TheHarvester', 'OSINT', 'active', 94.20, 8920),
('Recon-Ng', 'OSINT', 'inactive', 89.40, 3450),
('TinEye', 'OSINT', 'active', 97.60, 19830),
('PostHog', 'Analytics', 'active', 99.80, 45230),
('Matomo', 'Analytics', 'active', 98.90, 34120),
('Metabase', 'Analytics', 'active', 97.30, 21450),
('Plausible Analytics', 'Analytics', 'active', 99.10, 18760),
('Apache Superset', 'Analytics', 'inactive', 91.20, 5430),
('Grafana', 'Monitoring', 'active', 99.50, 52340),
('Datadog', 'Monitoring', 'active', 98.70, 41230),
('Prometheus', 'Monitoring', 'active', 99.20, 38940),
('Netdata', 'Monitoring', 'active', 96.80, 29340),
('SigNoz', 'Monitoring', 'inactive', 88.90, 4320),
('Thingsboard', 'IoT', 'active', 94.60, 12890),
('Countly', 'Analytics', 'active', 96.40, 15670);

-- Insert sample global activity data
INSERT INTO public.global_activity (activity_type, latitude, longitude, country_code, city, tool_used, severity) VALUES
(40.7128, -74.0060, 'USA', 'New York', 'Criminal IP', 'high'),
(51.5074, -0.1278, 'GBR', 'London', 'Shodan', 'medium'),
(35.6762, 139.6503, 'JPN', 'Tokyo', 'Maltego', 'low'),
(48.8566, 2.3522, 'FRA', 'Paris', 'TheHarvester', 'medium'),
(-33.8688, 151.2093, 'AUS', 'Sydney', 'TinEye', 'low'),
(37.7749, -122.4194, 'USA', 'San Francisco', 'PostHog', 'low'),
(52.5200, 13.4050, 'DEU', 'Berlin', 'Grafana', 'medium'),
(55.7558, 37.6176, 'RUS', 'Moscow', 'Datadog', 'high'),
(19.4326, -99.1332, 'MEX', 'Mexico City', 'Prometheus', 'low'),
(1.3521, 103.8198, 'SGP', 'Singapore', 'Netdata', 'medium');

-- Insert system metrics
INSERT INTO public.system_metrics (metric_name, metric_value, metric_unit, metric_type) VALUES
('total_searches', 2847, 'count', 'analytics'),
('active_sessions', 156, 'count', 'analytics'),
('data_sources', 42, 'count', 'system'),
('global_coverage', 99.2, 'percentage', 'system'),
('security_score', 98, 'score', 'security'),
('active_users', 1234, 'count', 'analytics'),
('avg_response_time', 245, 'milliseconds', 'performance'),
('uptime', 99.95, 'percentage', 'system');

-- Create function to update tool metrics
CREATE OR REPLACE FUNCTION update_tool_metrics()
RETURNS void AS $$
BEGIN
  UPDATE public.osint_tools 
  SET updated_at = now(),
      last_check = now(),
      response_time_ms = (random() * 500 + 50)::integer
  WHERE status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_osint_tools_updated_at
BEFORE UPDATE ON public.osint_tools
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();