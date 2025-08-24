import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Package } from 'lucide-react';
import { useGlobalActivity } from '@/hooks/useSupabaseData';

export function TrackingHistory() {
  const { activities, loading } = useGlobalActivity();

  if (loading) {
    return (
      <Card className="card-glow border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="gradient-text">Activity History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-card/30 rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'osint_scan': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'vulnerability_check': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'social_analysis': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'email_harvest': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'image_search': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'analytics_track': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'monitoring_alert': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'threat_detection': return 'bg-red-600/20 text-red-300 border-red-600/30';
      case 'metric_collection': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'network_monitor': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('scan') || type.includes('search')) return MapPin;
    if (type.includes('analysis') || type.includes('harvest')) return Package;
    return Clock;
  };

  return (
    <Card className="card-glow border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="gradient-text">Global Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.slice(0, 10).map((activity, index) => {
          const IconComponent = getTypeIcon(activity.activity_type);
          return (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-card/30 border border-border/20 hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{activity.tool_used || 'Unknown Tool'}</p>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className={getTypeColor(activity.activity_type)}>
                      {activity.activity_type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(activity.severity || 'low')}>
                      {activity.severity || 'low'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {activity.city || 'Unknown'}, {activity.country_code || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}