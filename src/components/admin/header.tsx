
'use client';

import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle, LayoutDashboard, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

interface AdminHeaderProps {
  onAddNew: () => void;
}

export default function AdminHeader({ onAddNew }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Logout Failed', description: 'An error occurred during logout.', variant: 'destructive' });
    }
  };
  
  const navItems = [
    { href: '/admin', label: 'Analytics', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Student Management', icon: List },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-auto flex-col sm:flex-row items-center gap-4 border-b bg-background px-4 sm:px-6 py-4">
      <div className="flex w-full sm:w-auto items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Pixar Edu Logo" width={28} height={28} />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
      </div>
      
      <nav className="flex-grow flex items-center justify-center gap-2">
         {navItems.map(item => (
            <Button key={item.href} asChild variant={pathname === item.href ? "secondary" : "ghost"} size="sm">
                <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                </Link>
            </Button>
         ))}
      </nav>

      <div className="flex w-full sm:w-auto items-center justify-end gap-2">
         <Button onClick={onAddNew} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
        </Button>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
