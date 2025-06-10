import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode; // To allow for actions like buttons next to the title
}

export default function SectionTitle({ title, subtitle, className, children }: SectionTitleProps) {
  return (
    <div className={cn("mb-8 md:mb-12 text-center", className)}>
      <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">{title}</h2>
      {subtitle && <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
