import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Activity, Database, Search, Shield } from 'lucide-react';

const analyticsTools = [
  { name: 'PostHog', category: 'Analytics', status: 'Active', icon: Activity },
  { name: 'Matomo', category: 'Analytics', status: 'Active', icon: Activity },
  { name: 'Metabase', category: 'Analytics', status: 'Active', icon: Database },
  { name: 'Plausible Analytics', category: 'Analytics', status: 'Active', icon: Activity },
  { name: 'Apache Superset', category: 'Analytics', status: 'Inactive', icon: Database },
  { name: 'Grafana', category: 'Monitoring', status: 'Active', icon: Activity },
];

const osintTools = [
  { name: 'Criminal IP', category: 'OSINT', status: 'Active', icon: Shield },
  { name: 'Shodan', category: 'OSINT', status: 'Active', icon: Search },
  { name: 'Maltego', category: 'OSINT', status: 'Active', icon: Search },
  { name: 'TheHarvester', category: 'OSINT', status: 'Active', icon: Search },
  { name: 'Recon-Ng', category: 'OSINT', status: 'Inactive', icon: Search },
  { name: 'TinEye', category: 'OSINT', status: 'Active', icon: Search },
];

const monitoringTools = [
  { name: 'Datadog', category: 'Monitoring', status: 'Active', icon: Activity },
  { name: 'Prometheus', category: 'Monitoring', status: 'Active', icon: Activity },
  { name: 'Netdata', category: 'Monitoring', status: 'Active', icon: Activity },
  { name: 'SigNoz', category: 'Monitoring', status: 'Inactive', icon: Activity },
  { name: 'Thingsboard', category: 'IoT', status: 'Active', icon: Activity },
  { name: 'Countly', category: 'Analytics', status: 'Active', icon: Activity },
];

const allTools = [...analyticsTools, ...osintTools, ...monitoringTools];

export function ToolsGrid() {
  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Analytics': return 'bg-blue-500/20 text-blue-400';
      case 'OSINT': return 'bg-purple-500/20 text-purple-400';
      case 'Monitoring': return 'bg-orange-500/20 text-orange-400';
      case 'IoT': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="card-glow border-border/50">
      <CardHeader>
        <CardTitle className="gradient-text">Connected Tools & Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div 
                key={index}
                className="p-4 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/30 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-md bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{tool.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getCategoryColor(tool.category)}>
                          {tool.category}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(tool.status)}>
                          {tool.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}