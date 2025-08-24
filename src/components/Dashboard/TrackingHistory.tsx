import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Package } from 'lucide-react';

interface TrackingItem {
  id: string;
  location: string;
  timestamp: string;
  type: 'search' | 'analysis' | 'monitoring';
}

const trackingHistory: TrackingItem[] = [
  { id: '#1729-C5-K6qtq', location: 'Current location: Ohio, Africa', timestamp: '4th Oct', type: 'search' },
  { id: '#1729-C5-K6qtq', location: 'Departure point: Texas, The USA', timestamp: '3rd Oct', type: 'analysis' },
  { id: '#1729-C5-K6qtq', location: 'Tokyo, Japan', timestamp: '2nd Oct', type: 'monitoring' },
  { id: '#1729-C5-K6qtq', location: 'Singapore', timestamp: '1st Oct', type: 'search' },
  { id: '#1729-C5-K6qtq', location: 'Dubai, UAE', timestamp: '30th Sep', type: 'analysis' },
];

export function TrackingHistory() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'search': return 'bg-blue-500/20 text-blue-400';
      case 'analysis': return 'bg-purple-500/20 text-purple-400';
      case 'monitoring': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'search': return MapPin;
      case 'analysis': return Package;
      case 'monitoring': return Clock;
      default: return MapPin;
    }
  };

  return (
    <Card className="card-glow border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="gradient-text">Activity History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trackingHistory.map((item, index) => {
          const IconComponent = getTypeIcon(item.type);
          return (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-card/30 border border-border/20 hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{item.id}</p>
                  <Badge variant="outline" className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.location}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}