
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { Home, Info, Briefcase, MapPin, Sparkles, Mail, ChevronDown, Menu, Wand2, HelpCircle, CheckSquare, MessageCircleQuestion, Share2, Newspaper } from 'lucide-react'; // Added Newspaper
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/country-guides', label: 'Country Guides', icon: MapPin },
  // { href: '/blog', label: 'Blog', icon: Newspaper }, // NEW top-level Blog link
  {
    label: 'Student Hub',
    icon: Sparkles,
    subItems: [
      { href: '/ai-assistants', label: 'Smart Tools', icon: Wand2 },
      { href: '/book-appointment', label: 'English Test Guide', icon: HelpCircle },
      { href: '/pre-departure-toolkit', label: 'Pre-Departure Toolkit', icon: CheckSquare },
      { href: '/interview-qa', label: 'Interview Q&A', icon: MessageCircleQuestion },
    ],
  },
  { href: '/connect', label: 'Social Media', icon: Share2 },
  { href: '/contact', label: 'Contact Us', icon: Mail },
];

const MD_BREAKPOINT = 768; // Tailwind's 'md' breakpoint

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to close mobile menu if window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MD_BREAKPOINT && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ElementType }) => (
    <Link href={href} passHref>
      <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => setIsMobileMenuOpen(false)}>
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </Button>
    </Link>
  );

  const NavDropdown = ({ label, icon: Icon, subItems }: { label: string; icon: React.ElementType; subItems: { href: string; label: string; icon: React.ElementType }[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsOpen(true);
    };

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 200);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
        <DropdownMenu open={isOpen} >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground">
              <Icon className="h-5 w-5" />
              <span>{label}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border shadow-lg w-56">
            {subItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground px-2 py-1.5"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const renderNavItems = (isMobile: boolean = false) => navItems.map((item: any) => {
    if (item.subItems) {
      if (isMobile) {
        return (
          <div key={item.label} className="flex flex-col w-full">
            <div className="flex items-center space-x-2 text-foreground px-4 py-2.5 font-medium">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
            {item.subItems.map((subItem: any) => (
               <Link key={subItem.href} href={subItem.href} passHref>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground pl-8 py-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                  <subItem.icon className="h-5 w-5" />
                  <span>{subItem.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        );
      }
      return <NavDropdown key={item.label} label={item.label} icon={item.icon} subItems={item.subItems} />;
    }
    return <NavLink key={item.href || item.label} href={item.href!} icon={item.icon}>{item.label}</NavLink>;
  });


  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src="/logo.png" alt="Pixar Educational Consultancy Logo" width={120} height={50} priority />
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
            <SheetContent side="right" className="w-[280px] bg-card p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="text-lg font-semibold text-primary flex items-center">
                  <Image src="/logo.png" alt="Pixar Logo" width={24} height={24} className="mr-2"/>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-0.5 pt-2">
                {renderNavItems(true)}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
    
