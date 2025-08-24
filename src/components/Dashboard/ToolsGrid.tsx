import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Activity, Database, Search, Shield } from 'lucide-react';
import { useOSINTTools } from '@/hooks/useSupabaseData';

export function ToolsGrid() {
  const { tools, loading } = useOSINTTools();

  if (loading) {
    return (
      <Card className="card-glow border-border/50">
        <CardHeader>
          <CardTitle className="gradient-text">Connected Tools & Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-card/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Analytics': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'OSINT': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Monitoring': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'IoT': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Analytics': return Activity;
      case 'OSINT': return Search;
      case 'Monitoring': return Database;
      case 'IoT': return Shield;
      default: return Activity;
    }
  };

  return (
    <Card className="card-glow border-border/50">
      <CardHeader>
        <CardTitle className="gradient-text">Connected Tools & Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => {
            const IconComponent = getCategoryIcon(tool.category);
            return (
              <div 
                key={tool.id}
                className="p-4 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/30 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-md bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{tool.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getCategoryColor(tool.category)}>
                          {tool.category}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(tool.status)}>
                          {tool.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tool.success_rate.toFixed(1)}% success • {tool.total_queries.toLocaleString()} queries
                      </div>
                      {tool.response_time_ms && (
                        <div className="text-xs text-muted-foreground">
                          {tool.response_time_ms}ms response time
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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