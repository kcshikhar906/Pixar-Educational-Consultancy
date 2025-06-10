
'use client';

import Link from 'next/link';
import { Home, Info, Briefcase, MapPin, GraduationCap, Mail, ChevronDown, Menu, Wand2 } from 'lucide-react'; // Added Wand2
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/services', label: 'Services', icon: Briefcase },
  {
    label: 'Country Guides',
    icon: MapPin,
    subItems: [
      { href: '/countries/europe', label: 'Europe', icon: MapPin },
      { href: '/countries/australia', label: 'Australia', icon: MapPin },
      { href: '/countries/usa', label: 'USA', icon: MapPin },
      { href: '/countries/new-zealand', label: 'New Zealand', icon: MapPin },
    ],
  },
  { href: '/ai-assistants', label: 'AI Assistants', icon: Wand2 }, // Changed
  { href: '/contact', label: 'Contact Us', icon: Mail },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ElementType }) => (
    <Link href={href} passHref>
      <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-accent-foreground hover:bg-accent/10" onClick={() => setIsMobileMenuOpen(false)}>
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </Button>
    </Link>
  );

  const NavDropdown = ({ label, icon: Icon, subItems }: { label: string; icon: React.ElementType; subItems: { href: string; label: string; icon: React.ElementType }[] }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:text-accent-foreground hover:bg-accent/10">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border shadow-lg">
        {subItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} passHref>
              <Button variant="ghost" className="w-full justify-start flex items-center space-x-2 text-foreground hover:text-accent-foreground hover:bg-accent/10" onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  const renderNavItems = (isMobile: boolean = false) => navItems.map((item) => {
    if (item.subItems) {
      if (isMobile) {
        return (
          <div key={item.label} className="flex flex-col w-full">
            <div className="flex items-center space-x-2 text-foreground px-4 py-2 font-semibold">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
            {item.subItems.map(subItem => (
              <NavLink key={subItem.href} href={subItem.href} icon={subItem.icon}>
                {subItem.label}
              </NavLink>
            ))}
          </div>
        );
      }
      return <NavDropdown key={item.label} label={item.label} icon={item.icon} subItems={item.subItems} />;
    }
    return <NavLink key={item.href} href={item.href} icon={item.icon}>{item.label}</NavLink>;
  });


  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-primary">Pixar Edu</span>
          </div>
        </Link>
        <nav className="hidden md:flex space-x-1 items-center">
          {renderNavItems()}
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-4">
              <div className="flex flex-col space-y-2">
                {renderNavItems(true)}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

    