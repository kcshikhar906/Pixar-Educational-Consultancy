

'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { visaSuccesses } from '@/lib/data';
import { CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrophyStyle {
  id: number;
  x: string;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
}

// New component for the background animation
const AnimatedBackground = () => {
  const [trophies, setTrophies] = useState<TrophyStyle[]>([]);

  useEffect(() => {
    // Generate random values only on the client-side to prevent hydration mismatch
    const generatedTrophies = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 10, // Slower duration: 10s to 15s
      delay: Math.random() * 10, // Staggered start times
      scale: Math.random() * 0.4 + 0.3, // Smaller icons: 0.3x to 0.7x
      opacity: Math.random() * 0.2 + 0.05, // More subtle: 5% to 25% opacity
    }));
    setTrophies(generatedTrophies);
  }, []); // Empty dependency array ensures this runs only once on the client

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {trophies.map(trophy => (
        <motion.div
          key={trophy.id}
          className="absolute text-accent"
          style={{
            x: trophy.x,
            scale: trophy.scale,
            opacity: trophy.opacity,
            bottom: '-20%', // Start from below the screen
          }}
          animate={{
            y: ['0%', '-120vh'], // Animate to way above the screen
          }}
          transition={{
            duration: trophy.duration,
            delay: trophy.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          <Trophy />
        </motion.div>
      ))}
    </div>
  );
};

const Confetti = ({ isVisible }: { isVisible: boolean }) => {
  const numParticles = 30;
  const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7"];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-lg">
          {Array.from({ length: numParticles }).map((_, i) => {
            const size = Math.random() * 5 + 3;
            const initialY = -20;
            const finalY = 100 + Math.random() * 50;
            const initialX = Math.random() * 100;
            const finalX = initialX + (Math.random() - 0.5) * 80;
            const duration = Math.random() * 1 + 0.8;
            const delay = Math.random() * 0.5;
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={i}
                initial={{
                  x: `${initialX}%`,
                  y: initialY,
                  opacity: 1,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  x: `${finalX}%`,
                  y: finalY,
                  opacity: 0,
                  rotate: Math.random() * 360 + 360,
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  ease: "linear",
                }}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  backgroundColor: color,
                  top: 0,
                  left: 0,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};


export default function SuccessStoriesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [gridRef, isGridVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  const allSuccesses = useMemo(() => {
    return visaSuccesses;
  }, []);

  return (
    <div className="relative overflow-hidden space-y-12 md:space-y-16">
      <AnimatedBackground />
      <div className="relative z-10">
        <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <SectionTitle
            title="Our Student Success Stories"
            subtitle="We take pride in the achievements of our students. Here are some of the many who have successfully obtained their visas with our guidance."
          />
        </section>

        <section ref={gridRef} className={cn("transition-all duration-700 ease-out", isGridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allSuccesses.map((student, index) => {
                  const [itemRef, isItemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                  return (
                    <div
                      key={index}
                      ref={itemRef}
                      className={cn(
                        "relative overflow-hidden transition-all duration-500 ease-out",
                        isItemVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                      )}
                      style={{ transitionDelay: `${Math.min(index * 20, 1000)}ms` }}
                    >
                      <div
                        className="relative flex flex-col justify-center items-center text-center p-4 bg-secondary/30 rounded-lg h-full border border-transparent hover:border-primary/20 hover:shadow-md"
                      >
                        <Confetti isVisible={isItemVisible} />
                        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                        <p className="font-semibold text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.university}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {allSuccesses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Success stories will be updated soon!
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}