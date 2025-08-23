
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Hand, Tv, Users } from 'lucide-react';
import Image from 'next/image';

interface WelcomeData {
  studentNames?: string[];
}

export default function WelcomePage() {
  const [studentNames, setStudentNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'display', 'officeTV');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as WelcomeData;
          setStudentNames(data.studentNames || []);
          setError(null);
        } else {
          // Document doesn't exist, treat as empty list
          setStudentNames([]);
          console.log("Welcome document not found, displaying empty list.");
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching welcome screen data:", err);
        setError("Could not load student data. Please check the connection.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground p-8">
       {/* Header */}
       <header className="flex items-center justify-between pb-4 border-b-2 border-primary/20">
            <div className="flex items-center space-x-4">
                 <Image src="/navbar.png" alt="Pixar Educational Consultancy Logo" width={200} height={80} priority />
            </div>
            <div className="text-right">
                <h1 className="text-4xl font-bold text-primary">Student Welcome Board</h1>
                <p className="text-muted-foreground">Your Journey to Global Education Starts Here!</p>
            </div>
       </header>

      {/* Main Content */}
      <main className="flex-grow grid grid-cols-3 gap-8 pt-8">
        {/* Welcome Message Section */}
        <div className="col-span-2 flex flex-col items-center justify-center bg-card p-10 rounded-lg shadow-lg">
          <Hand className="h-24 w-24 text-accent animate-wave" style={{ animation: 'wave-animation 2.5s infinite', transformOrigin: '70% 70%' }} />
          <h2 className="mt-6 text-7xl font-headline font-bold text-primary text-center leading-tight">Welcome to Pixar Educational Consultancy!</h2>
          <p className="mt-4 text-2xl text-muted-foreground text-center max-w-3xl">
            We are delighted to have you here. Please have a seat, and one of our expert counselors will be with you shortly.
          </p>
        </div>

        {/* Student List Section */}
        <div className="col-span-1">
          <Card className="h-full bg-secondary/50 shadow-inner">
            <CardContent className="p-6">
              <h3 className="flex items-center text-3xl font-semibold text-primary mb-6">
                <Users className="mr-3 h-8 w-8" />
                Today's Visitors
              </h3>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading names...</div>
              ) : error ? (
                <div className="text-center text-destructive">{error}</div>
              ) : studentNames.length > 0 ? (
                <ul className="space-y-4">
                  {studentNames.map((name, index) => (
                    <li key={index} className="text-2xl font-medium text-foreground bg-background/50 p-4 rounded-md shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground pt-10">
                  <p className="text-xl">No visitors currently listed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-4 text-center text-muted-foreground text-sm border-t-2 border-primary/20">
        <p>If you have any questions, please feel free to ask our front desk staff for assistance.</p>
      </footer>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes wave-animation {
            0% { transform: rotate( 0.0deg) }
           10% { transform: rotate(14.0deg) }
           20% { transform: rotate(-8.0deg) }
           30% { transform: rotate(14.0deg) }
           40% { transform: rotate(-4.0deg) }
           50% { transform: rotate(10.0deg) }
           60% { transform: rotate( 0.0deg) }
          100% { transform: rotate( 0.0deg) }
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
            opacity: 0;
        }
      `}</style>
    </div>
  );
}
