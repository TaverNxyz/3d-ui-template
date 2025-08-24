import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, CheckCircle, MoreHorizontal } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-80 p-6 space-y-6 bg-card/20 border-r border-border/30">
      {/* Metrics Cards */}
      <div className="space-y-4">
        <Card className="card-glow border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                +24.7%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total shipments</p>
            <p className="text-2xl font-bold gradient-text">791</p>
          </CardContent>
        </Card>

        <Card className="card-glow border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                <Activity className="h-5 w-5 text-orange-400" />
              </div>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                +2.5%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active tracking</p>
            <p className="text-2xl font-bold gradient-text">366</p>
          </CardContent>
        </Card>

        <Card className="card-glow border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                +13%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Delivered shipments</p>
            <p className="text-2xl font-bold gradient-text">222</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card className="card-glow border-border/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-4">Analytic view</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Average delivery time</span>
                <span className="text-xs text-muted-foreground">This week</span>
              </div>
              <p className="text-lg font-bold mb-2">5 - 10 days</p>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Average goods tracking</span>
              </div>
              <p className="text-lg font-bold mb-2">24h</p>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card className="card-glow border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Resource Usage</h3>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Queries</span>
                <span>122 / 250</span>
              </div>
              <Progress value={48} className="h-1.5" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Storage</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}