
"use client";

import { useState, useEffect, useRef, type RefObject } from 'react';

interface ScrollAnimationOptions extends IntersectionObserverInit {
  once?: boolean; // Animate only once
  triggerOnExit?: boolean; // Whether to set isVisible to false when exiting viewport
  initialVisible?: boolean; // Whether the element should be initially visible (e.g. for hero sections)
}

export function useScrollAnimation<T extends HTMLElement>(
  options?: ScrollAnimationOptions
): [RefObject<T>, boolean] {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(options?.initialVisible || false);

  useEffect(() => {
    // If initialVisible is true, don't set up observer unless triggerOnExit is also true
    if (options?.initialVisible && !options?.triggerOnExit && !options?.once) {
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options?.once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else {
          if (options?.triggerOnExit) {
            setIsVisible(false);
          }
        }
      },
      {
        root: options?.root,
        rootMargin: options?.rootMargin || '0px',
        threshold: options?.threshold || 0.1, // Default to 10% visibility
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
}
