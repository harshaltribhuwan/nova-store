import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

export default function LoadingScreen() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);
  const { animate } = useGSAP();

  useEffect(() => {
    const timeline = animate.timeline();
    
    // Text animation
    timeline.to(loaderTextRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      repeat: 1,
      yoyo: true,
    });
    
    // Then fade out the loader
    timeline.to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
    });
    
    return () => {
      timeline.kill();
    };
  }, [animate]);

  return (
    <div
      ref={loaderRef}
      className="fixed top-0 left-0 w-full h-full bg-background flex justify-center items-center z-[9999]"
    >
      <div
        ref={loaderTextRef}
        className="text-[10vw] text-primary font-heading font-black tracking-tighter"
      >
        NOVA
      </div>
    </div>
  );
}
