import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useGSAP } from '@/hooks/use-gsap';

export default function About() {
  const { animate } = useGSAP();
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const imageGrid1Ref = useRef<HTMLDivElement>(null);
  const imageGrid2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aboutSectionRef.current) {
      animate(aboutSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, { from: { opacity: 0, y: 50 } });
    }

    // Animate the image grids with a stagger
    if (imageGrid1Ref.current && imageGrid2Ref.current) {
      animate([imageGrid1Ref.current, imageGrid2Ref.current], {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        delay: 0.5,
      }, { from: { opacity: 0, x: 100 } });
    }
  }, [animate]);

  return (
    <section
      id="about"
      ref={aboutSectionRef}
      className="py-20 px-8 bg-gradient-to-b from-background/90 to-background"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-heading font-bold mb-6">
              <span className="text-white">Our </span>
              <span className="text-primary">Story</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              NOVA emerged from the convergence of cutting-edge technology and
              visionary fashion design. Founded in 2020, we set out to redefine
              what's possible when innovation meets style.
            </p>
            <p className="text-xl text-muted-foreground mb-8">
              Our team of designers, engineers, and digital artists collaborate
              to create pieces that exist at the intersection of the physical
              and digital worlds, pushing the boundaries of what fashion can be
              in the 21st century.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-background/50 p-6 rounded-xl">
                <h3 className="text-4xl font-heading text-accent mb-2">50+</h3>
                <p className="text-muted-foreground">
                  Innovative designs launched
                </p>
              </div>
              <div className="bg-background/50 p-6 rounded-xl">
                <h3 className="text-4xl font-heading text-accent mb-2">15+</h3>
                <p className="text-muted-foreground">
                  Countries shipping worldwide
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-animated inline-block bg-transparent border-2 border-primary hover:bg-primary text-primary hover:text-white transition-all duration-300 py-3 px-8 rounded-full text-lg font-medium"
            >
              Get In Touch
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 h-auto md:h-[600px]">
            <div
              ref={imageGrid1Ref}
              className="space-y-4"
              style={{ opacity: 0, transform: "translateX(100px)" }}
            >
              <div className="h-3/5 rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover hover-rotate"
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3"
                  alt="Fashion design process"
                />
              </div>
              <div className="h-2/5 rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover hover-rotate"
                  src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-4.0.3"
                  alt="Creative workspace"
                />
              </div>
            </div>
            <div
              ref={imageGrid2Ref}
              className="space-y-4"
              style={{ opacity: 0, transform: "translateX(100px)" }}
            >
              <div className="h-2/5 rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover hover-rotate"
                  src="https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-4.0.3"
                  alt="Fashion technology"
                />
              </div>
              <div className="h-3/5 rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover hover-rotate"
                  src="https://images.unsplash.com/photo-1675435970366-f1299ff2ff3f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Studio photoshoot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
