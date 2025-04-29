import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (!cursorDotRef.current || !cursorOutlineRef.current) return;

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    // Initial set of cursor dot and outline position
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });

    // Function to move cursor dot and outline
    const moveMouseFollower = (e: MouseEvent) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power3.out',
      });
      
      gsap.to(cursorOutline, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    // Add mousemove event listener to move cursor
    window.addEventListener('mousemove', moveMouseFollower);

    // Cursor grow effect on hoverable elements
    const handleMouseEnter = () => {
      gsap.to(cursorDot, {
        scale: 1.5,
        duration: 0.3,
        ease: 'power3.out',
      });
      
      gsap.to(cursorOutline, {
        scale: 1.5,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    // Cursor return to normal size
    const handleMouseLeave = () => {
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
      
      gsap.to(cursorOutline, {
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    // Get all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .product-card, input, select, textarea'
    );

    // Add event listeners to each interactive element
    interactiveElements.forEach((elem) => {
      elem.addEventListener('mouseenter', handleMouseEnter);
      elem.addEventListener('mouseleave', handleMouseLeave);
    });

    // Clean up
    return () => {
      window.removeEventListener('mousemove', moveMouseFollower);
      
      interactiveElements.forEach((elem) => {
        elem.removeEventListener('mouseenter', handleMouseEnter);
        elem.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [gsap]);

  // Don't show custom cursor on touch devices
  useEffect(() => {
    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    if (isTouchDevice()) {
      document.body.style.cursor = 'auto';
      if (cursorDotRef.current) cursorDotRef.current.style.display = 'none';
      if (cursorOutlineRef.current) cursorOutlineRef.current.style.display = 'none';
    } else {
      document.body.style.cursor = 'none';
    }
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot"></div>
      <div ref={cursorOutlineRef} className="cursor-outline"></div>
    </>
  );
}
