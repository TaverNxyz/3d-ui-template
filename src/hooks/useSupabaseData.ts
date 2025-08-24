import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OSINTTool {
  id: string;
  name: string;
  category: string;
  status: string;
  success_rate: number;
  total_queries: number;
  response_time_ms?: number;
  last_check?: string;
}

export interface GlobalActivity {
  id: string;
  activity_type: string;
  latitude: number;
  longitude: number;
  country_code: string;
  city: string;
  tool_used: string;
  severity: string;
  created_at: string;
}

export interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  metric_type: string;
  recorded_at: string;
}

export function useOSINTTools() {
  const [tools, setTools] = useState<OSINTTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        const { data, error } = await supabase
          .from('osint_tools')
          .select('*')
          .order('total_queries', { ascending: false });

        if (error) throw error;
        setTools(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tools');
      } finally {
        setLoading(false);
      }
    }

    fetchTools();

    // Set up real-time subscription
    const subscription = supabase
      .channel('osint_tools_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'osint_tools' 
      }, (payload) => {
        console.log('Tools updated:', payload);
        fetchTools(); // Refetch on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { tools, loading, error };
}

export function useGlobalActivity() {
  const [activities, setActivities] = useState<GlobalActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from('global_activity')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();

    // Set up real-time subscription for new activities
    const subscription = supabase
      .channel('global_activity_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'global_activity' 
      }, (payload) => {
        console.log('New activity:', payload);
        setActivities(prev => [payload.new as GlobalActivity, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { activities, loading, error };
}

export function useSystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data, error } = await supabase
          .from('system_metrics')
          .select('*')
          .order('recorded_at', { ascending: false });

        if (error) throw error;
        setMetrics(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();

    // Update metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { metrics, loading, error };
}

// Helper function to get specific metric value
export function useMetric(metricName: string) {
  const { metrics } = useSystemMetrics();
  
  const metric = metrics.find(m => m.metric_name === metricName);
  return metric ? {
    value: metric.metric_value,
    unit: metric.metric_unit,
    type: metric.metric_type,
    updated: metric.recorded_at
  } : null;
}

// Analytics event tracking
export async function trackAnalyticsEvent(
  eventType: string, 
  eventData?: any, 
  userId?: string
) {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        ip_address: '127.0.0.1', // Would be real IP in production
        user_agent: navigator.userAgent,
        geolocation: null // Would include real geolocation if available
      });

    if (error) throw error;
  } catch (err) {
    console.error('Failed to track analytics event:', err);
  }
}