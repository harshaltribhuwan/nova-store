import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';
import { useCartStore } from '@/store/cart';
import { Star } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: (id: number) => void;
}

export default function ProductCard({ product, index, onClick }: ProductCardProps) {
  const { name, price, description, image, rating, colors } = product;
  const cardRef = useRef<HTMLDivElement>(null);
  const { animate, ScrollTrigger } = useGSAP();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (!cardRef.current) return;
    
    // Animation for product cards appearing with stagger
    animate(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out',
    }, { from: { y: 50, opacity: 0 } });
  }, [animate, index, ScrollTrigger]);

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(product.id, product.name, product.price, product.image, null, colors?.[0] || null);
  }

  return (
    <div 
      ref={cardRef} 
      className="product-card bg-card/50 rounded-xl overflow-hidden shadow-lg cursor-pointer opacity-0"
      onClick={() => onClick(product.id)}
      style={{ transform: 'translateY(50px)', opacity: 0 }}
    >
      <div className="product-image-container h-80 relative">
        <img 
          className="product-image w-full h-full object-cover" 
          src={image} 
          alt={name} 
        />
        <div 
          className="quick-add font-medium cursor-pointer"
          onClick={handleQuickAdd}
        >
          <span>QUICK ADD</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-xl font-heading text-primary">${price}</span>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between">
          <div className="flex space-x-2">
            {colors?.map((color, i) => (
              <span 
                key={i}
                className="w-4 h-4 rounded-full border-2 border-white cursor-pointer" 
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>
          <span className="text-muted-foreground text-sm flex items-center">
            {rating} <Star className="h-3 w-3 ml-1 fill-current" />
          </span>
        </div>
      </div>
    </div>
  );
}
