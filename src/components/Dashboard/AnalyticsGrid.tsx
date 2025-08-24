import React from 'react';
import { MetricCard } from './MetricCard';
import { Activity, Database, Globe, Shield, Search, Users } from 'lucide-react';
import { useSystemMetrics } from '@/hooks/useSupabaseData';

export function AnalyticsGrid() {
  const { metrics, loading } = useSystemMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-card/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const getMetricValue = (name: string) => {
    const metric = metrics.find(m => m.metric_name === name);
    return metric ? metric.metric_value : 0;
  };

  const formatValue = (name: string, value: number) => {
    if (name.includes('percentage') || name.includes('score')) {
      return `${value}%`;
    }
    if (name.includes('time')) {
      return `${value}ms`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Total Searches"
        value={formatValue('total_searches', getMetricValue('total_searches'))}
        change="+12.5%"
        icon={Search}
        trend="up"
      />
      <MetricCard
        title="Active Sessions"
        value={formatValue('active_sessions', getMetricValue('active_sessions'))}
        change="+3.2%"
        icon={Activity}
        trend="up"
      />
      <MetricCard
        title="Data Sources"
        value={formatValue('data_sources', getMetricValue('data_sources'))}
        change="Connected"
        icon={Database}
        trend="neutral"
      />
      <MetricCard
        title="Global Coverage"
        value={formatValue('global_coverage', getMetricValue('global_coverage'))}
        change="Operational"
        icon={Globe}
        trend="up"
      />
      <MetricCard
        title="Security Score"
        value={formatValue('security_score', getMetricValue('security_score'))}
        change="Excellent"
        icon={Shield}
        trend="up"
      />
      <MetricCard
        title="Active Users"
        value={formatValue('active_users', getMetricValue('active_users'))}
        change="+8.7%"
        icon={Users}
        trend="up"
      />
    </div>
  );
}