import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCartStore } from '@/store/cart';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';

interface NavbarProps {
  openCart: () => void;
}

export default function Navbar({ openCart }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const { animate, gsap } = useGSAP();
  const [location] = useLocation();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      animate('#mobile-menu', {
        height: '100%',
        x: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    } else {
      animate('#mobile-menu', {
        x: '100%',
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set('#mobile-menu', { height: 0 });
        }
      });
    }
  }, [isMobileMenuOpen, animate, gsap]);

  // Initial animation
  useEffect(() => {
    animate('nav', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    }, { from: { y: -100, opacity: 0 } });
  }, [animate]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full ${isScrolled ? 'py-4 bg-background/90 backdrop-blur-lg shadow-lg' : 'py-6'} px-8 flex justify-between items-center z-50 transition-all duration-500`}
        style={{ opacity: 0, transform: 'translateY(-100px)' }}
      >
        <div className="logo text-4xl font-heading font-black tracking-tighter text-primary">
          <Link href="/">NOVA</Link>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className={`nav-link text-lg font-medium ${location === '/' ? 'text-primary' : ''}`}>Home</Link>
          <Link href="/shop" className={`nav-link text-lg font-medium ${location === '/shop' ? 'text-primary' : ''}`}>Shop</Link>
          <Link href="/about" className={`nav-link text-lg font-medium ${location === '/about' ? 'text-primary' : ''}`}>About</Link>
          <Link href="/contact" className={`nav-link text-lg font-medium ${location === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-xl" aria-label="Search">
            <Search />
          </button>
          <button className="text-xl" aria-label="Account">
            <User />
          </button>
          <button className="text-xl relative" onClick={openCart} aria-label="Cart">
            <ShoppingBag />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button 
            className="md:hidden text-xl" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu />
          </button>
        </div>
      </nav>

      <div 
        id="mobile-menu" 
        className="fixed top-0 left-0 w-full h-0 bg-background/95 backdrop-blur-lg z-40 overflow-hidden transform translate-x-full transition-transform duration-500"
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl">
          <Link href="/" className="nav-link font-heading" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/shop" className="nav-link font-heading" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link href="/about" className="nav-link font-heading" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/contact" className="nav-link font-heading" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </div>
        <button 
          className="absolute top-6 right-8 text-2xl" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X />
        </button>
      </div>
    </>
  );
}
