import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-foreground flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text">sintsation</span>
            <span className="text-xs text-muted-foreground">.io</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Intelligence
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Analytics
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Monitoring
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            OSINT Tools
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Support
          </Button>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search OSINT data..." 
              className="w-64 pl-10 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse-glow"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-8 w-8 border-2 border-primary/30">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary font-medium">SR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}