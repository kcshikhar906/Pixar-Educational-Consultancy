'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Globe, Users, Award, Milestone, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const timelineData = [
  { year: 2013, title: 'Founded', description: 'Pixar Educational Consultancy was established in Kathmandu with a mission to guide Nepalese students.', icon: Building },
  { year: 2015, title: 'First 100 Visas', description: 'Celebrated a major milestone, having successfully guided over 100 students to their study destinations.', icon: Award },
  { year: 2017, title: 'Expanded Services', description: 'Introduced comprehensive in-house IELTS and PTE preparation classes to better serve our students.', icon: TrendingUp },
  { year: 2019, title: 'New Office Branch', description: 'Opened a new branch in Lalitpur to increase accessibility for students in the valley.', icon: Milestone },
  { year: 2021, title: 'Digital Transformation', description: 'Launched our first website and digital counseling services to adapt to the new global environment.', icon: Globe },
  { year: 2024, title: 'AI-Powered Tools', description: 'Integrated AI tools like the Pathway Planner to provide instant, personalized guidance to students worldwide.', icon: Users },
];

export default function InteractiveTimeline() {
  const [selectedYear, setSelectedYear] = useState(timelineData[0].year);

  const selectedEvent = timelineData.find(event => event.year === selectedYear);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedYear(prevYear => {
        const currentIndex = timelineData.findIndex(event => event.year === prevYear);
        const nextIndex = (currentIndex + 1) % timelineData.length;
        return timelineData[nextIndex].year;
      });
    }, 4000); // Change year every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative mb-8">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2"></div>
        <div className="relative flex justify-between">
          {timelineData.map((event) => (
            <div key={event.year} className="flex flex-col items-center">
              <Button
                variant="ghost"
                className={cn(
                  "w-8 h-8 rounded-full p-0 border-2 transition-all duration-300 cursor-pointer", // Keep it looking like a button
                  selectedYear === event.year 
                    ? 'bg-primary border-primary-foreground text-primary-foreground scale-125' 
                    : 'bg-card border-border hover:bg-accent/20'
                )}
                onClick={() => setSelectedYear(event.year)} // Allow manual override
              >
                <span className="sr-only">{event.year}</span>
              </Button>
              <span className={cn(
                "mt-2 text-sm font-medium transition-colors",
                selectedYear === event.year ? 'text-primary' : 'text-muted-foreground'
              )}>{event.year}</span>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedEvent && (
            <Card className="bg-card shadow-lg text-center">
              <CardHeader className="flex flex-row items-center justify-center space-x-3">
                 <selectedEvent.icon className="h-8 w-8 text-accent" />
                 <CardTitle className="font-headline text-2xl text-accent">{selectedEvent.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{selectedEvent.description}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
