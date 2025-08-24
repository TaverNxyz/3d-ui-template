import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, change, icon: Icon, trend = 'neutral' }: MetricCardProps) {
  const trendColor = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-muted-foreground'
  }[trend];

  return (
    <Card className="card-glow border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold gradient-text">{value}</p>
            {change && (
              <p className={`text-sm ${trendColor}`}>
                {change}
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}