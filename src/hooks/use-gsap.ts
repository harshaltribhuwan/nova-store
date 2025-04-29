import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface UseGSAPOptions {
  scope?: HTMLElement | null;
}

interface UseGSAPReturnType {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  animate: typeof gsap.to & {
    timeline: typeof gsap.timeline;
    fromTo: typeof gsap.fromTo;
  };
}

export function useGSAP(options: UseGSAPOptions = {}): UseGSAPReturnType {
  const [scrollTriggerRefresh, setScrollTriggerRefresh] = useState(0);
  
  // Set up context if scope is provided
  useEffect(() => {
    if (options.scope) {
      const ctx = gsap.context(() => {}, options.scope);
      return () => ctx.revert();
    }
  }, [options.scope]);
  
  // Refresh ScrollTrigger when window is resized
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
      setScrollTriggerRefresh(prev => prev + 1);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create animated function
  const animate = (
    targets: gsap.TweenTarget, 
    vars: gsap.TweenVars, 
    fromVars?: gsap.TweenVars
  ) => {
    if (fromVars) {
      gsap.set(targets, fromVars);
      return gsap.to(targets, vars);
    }
    return gsap.to(targets, vars);
  };

  // Add timeline method
  animate.timeline = (vars?: gsap.TimelineVars) => gsap.timeline(vars);
  animate.fromTo = gsap.fromTo;

  return { gsap, ScrollTrigger, animate };
}
