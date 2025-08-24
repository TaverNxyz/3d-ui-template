import React from 'react';
import { Header } from '@/components/Navigation/Header';
import { Sidebar } from '@/components/Navigation/Sidebar';
import { Globe3D } from '@/components/Globe3D';
import { AnalyticsGrid } from '@/components/Dashboard/AnalyticsGrid';
import { ToolsGrid } from '@/components/Dashboard/ToolsGrid';
import { TrackingHistory } from '@/components/Dashboard/TrackingHistory';
import { useGlobalActivity } from '@/hooks/useSupabaseData';

const Index = () => {
  const { activities } = useGlobalActivity();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
            {/* Left Column - Analytics */}
            <div className="xl:col-span-1 space-y-6">
              <AnalyticsGrid />
            </div>
            
            {/* Center Column - 3D Globe */}
            <div className="xl:col-span-1 flex items-center justify-center">
              <div className="w-full h-[500px] relative">
                <Globe3D activityData={activities} />
              </div>
            </div>
            
            {/* Right Column - Tools & History */}
            <div className="xl:col-span-1 space-y-6">
              <TrackingHistory />
            </div>
          </div>
          
          {/* Full Width Tools Grid */}
          <div className="mt-8">
            <ToolsGrid />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
