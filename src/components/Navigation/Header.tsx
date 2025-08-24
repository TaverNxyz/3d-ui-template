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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-white">VI</span>
          </div>
          <span className="text-xl font-bold gradient-text">VISIONARY</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Ground
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Ocean
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Expedited
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Services
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
              placeholder="Search analytics..." 
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