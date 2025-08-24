import React from 'react';
import { MetricCard } from './MetricCard';
import { Activity, Database, Globe, Shield, Search, Users } from 'lucide-react';

export function AnalyticsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Total Searches"
        value="2,847"
        change="+12.5%"
        icon={Search}
        trend="up"
      />
      <MetricCard
        title="Active Sessions"
        value="156"
        change="+3.2%"
        icon={Activity}
        trend="up"
      />
      <MetricCard
        title="Data Sources"
        value="42"
        change="Connected"
        icon={Database}
        trend="neutral"
      />
      <MetricCard
        title="Global Coverage"
        value="99.2%"
        change="Operational"
        icon={Globe}
        trend="up"
      />
      <MetricCard
        title="Security Score"
        value="98"
        change="Excellent"
        icon={Shield}
        trend="up"
      />
      <MetricCard
        title="Active Users"
        value="1,234"
        change="+8.7%"
        icon={Users}
        trend="up"
      />
    </div>
  );
}