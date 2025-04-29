import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';
import { useThree } from '@/hooks/use-three';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { getFeaturedProducts } from '@/data/products';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const hero3dRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const { animate, ScrollTrigger } = useGSAP();
  const { setupThreeJSHero } = useThree();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const featuredProducts = getFeaturedProducts();

  // Setup animations when component mounts
  useEffect(() => {
    // Hero section animation
    animate(heroTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.5,
    }, { from: { opacity: 0, y: 50 } });

    // Setup 3D element in hero
    if (hero3dRef.current) {
      setupThreeJSHero(hero3dRef.current);
    }

    // Parallax background effect
    if (parallaxBgRef.current) {
      animate(parallaxBgRef.current, {
        scrollTrigger: {
          trigger: parallaxBgRef.current.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -100,
        ease: 'none',
      });
    }

    // Scroll indicator animation
    animate('.scroll-indicator', {
      y: [0, -20, -10, 0],
      opacity: [1, 0.7, 0.9, 1],
      duration: 2,
      repeat: -1,
      ease: 'power1.inOut',
    });
  }, [animate, setupThreeJSHero, ScrollTrigger]);

  function openProductModal(productId: number) {
    setSelectedProduct(productId);
    setProductModalOpen(true);
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10"></div>
        
        <div className="container mx-auto px-8 z-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div ref={heroTextRef} className="opacity-0">
              <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter mb-4">
                <span className="block text-primary">Future</span>
                <span className="block text-white">of Fashion</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-md text-gray-300">
                Redefining style with cutting-edge designs that push boundaries and set trends.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/shop" className="btn-animated bg-primary hover:bg-opacity-90 text-white py-3 px-8 rounded-full font-medium text-lg transition-all duration-300 text-center">
                  Shop Now
                </Link>
                <Link href="/about" className="btn-animated border-2 border-white hover:border-primary hover:text-primary text-white py-3 px-8 rounded-full font-medium text-lg transition-all duration-300 text-center">
                  Our Story
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div ref={hero3dRef} className="w-full h-[600px]"></div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator text-white absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <ChevronDown size={24} className="opacity-70" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-8 relative bg-gradient-to-b from-background to-background/90">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="inline-block text-5xl font-heading font-bold relative">
              <span className="relative z-10">Featured Collection</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-accent opacity-30"></span>
            </h2>
            <p className="text-xl mt-4 text-muted-foreground max-w-2xl mx-auto">
              Discover our most coveted pieces that define this season's aesthetic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onClick={openProductModal}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/shop" className="btn-animated inline-block bg-transparent border-2 border-primary hover:bg-primary text-primary hover:text-white transition-all duration-300 py-3 px-8 rounded-full text-lg font-medium">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="parallax-section h-screen relative flex items-center justify-center overflow-hidden">
        <div 
          ref={parallaxBgRef}
          className="parallax-bg" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1559599189-fe84dea4eb79?ixlib=rb-4.0.3")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60"></div>
        
        <div className="container mx-auto px-8 z-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-heading font-black mb-6">
              Redefine <span className="text-accent">Reality</span>
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-200">
              Our designs blur the line between fashion and technology, creating immersive experiences that extend beyond the physical realm.
            </p>
            <Link href="/shop" className="btn-animated inline-block bg-accent hover:bg-opacity-90 text-background py-3 px-10 rounded-full font-medium text-xl transition-all duration-300">
              Explore The Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        isOpen={productModalOpen} 
        onClose={() => setProductModalOpen(false)}
        productId={selectedProduct}
      />
    </>
  );
}
