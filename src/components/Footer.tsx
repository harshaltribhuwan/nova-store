import { Link } from 'wouter';
import { Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';
import { useEffect } from 'react';

export default function Footer() {
  const { animate } = useGSAP();

  useEffect(() => {
    animate('#footer', {
      scrollTrigger: {
        trigger: '#footer',
        start: 'top 80%',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    }, { from: { opacity: 0, y: 50 } });
  }, [animate]);

  return (
    <footer id="footer" className="bg-background/70 backdrop-blur-lg pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-3xl font-heading font-black tracking-tighter text-primary mb-6">NOVA</div>
            <p className="text-muted-foreground mb-6">
              Redefining fashion through innovation and technology, creating immersive experiences that extend beyond the physical realm.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-foreground font-medium text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Featured</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Collections</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground font-medium text-lg mb-6">Help</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Customer Service</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground font-medium text-lg mb-6">Subscribe</h3>
            <p className="text-muted-foreground mb-4">Join our mailing list for the latest updates and exclusive offers.</p>
            <form className="flex mb-4">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 bg-background/50 border border-border rounded-l-lg py-2 px-4 text-foreground focus:outline-none focus:border-primary transition-all" 
              />
              <button 
                type="submit" 
                className="bg-primary text-white rounded-r-lg px-4 hover:bg-opacity-90 transition-all" 
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-muted-foreground text-sm">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">&copy; 2023 NOVA. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
