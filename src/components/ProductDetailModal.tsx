import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@/hooks/use-gsap';
import { useThree } from '@/hooks/use-three';
import { X, Star, ShoppingBag, Heart, Share, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { getProductById } from '@/data/products';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}

export default function ProductDetailModal({ isOpen, onClose, productId }: ProductDetailModalProps) {
  const { gsap, animate } = useGSAP();
  const modalRef = useRef<HTMLDivElement>(null);
  const productViewRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  // Get product data
  const product = productId ? getProductById(productId) : null;

  // Setup 3D view for product
  const { setupThreeJSProductViewer } = useThree();

  useEffect(() => {
    if (isOpen && product) {
      // Reset state when opening with a new product
      setQuantity(1);
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      
      // Animation for opening the modal
      animate(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
      }, { from: { opacity: 0, scale: 0.9 } });

      // Setup 3D product view if available
      if (productViewRef.current) {
        setupThreeJSProductViewer(productViewRef.current, product.image);
      }
    }
  }, [isOpen, product, animate, setupThreeJSProductViewer]);

  useEffect(() => {
    // Animation for product container rotation on mouse move
    if (isOpen && productViewRef.current) {
      const container = productViewRef.current;
      
      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / (width / 2) * 10;
        const y = (e.clientY - top - height / 2) / (height / 2) * 10;
        
        gsap.to(container, {
          rotationY: x,
          rotationX: -y,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out',
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(container, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      };
      
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isOpen, gsap]);

  function closeModal() {
    animate(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: onClose,
    });
  }

  function handleAddToCart() {
    if (product) {
      addToCart(
        product.id,
        product.name,
        product.price,
        product.image,
        selectedSize,
        selectedColor,
        quantity
      );
      closeModal();
    }
  }

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-background opacity-90" onClick={closeModal}></div>
      <div 
        ref={modalRef} 
        className="relative w-full max-w-6xl mx-auto bg-card/80 backdrop-blur-lg rounded-xl overflow-hidden z-10 p-6"
        style={{ opacity: 0, transform: 'scale(0.9)' }}
      >
        <button 
          className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="perspective-container">
            <div 
              ref={productViewRef} 
              className="w-full h-[500px] rounded-lg overflow-hidden"
            >
              <img 
                className="w-full h-full object-cover" 
                src={product.image} 
                alt={product.name} 
              />
            </div>
            <div className="flex mt-4 space-x-4 justify-center">
              {[product.image, ...product.additionalImages || []].map((img, i) => (
                <div 
                  key={i}
                  className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${i === 0 ? 'border-primary' : 'border-border'}`}
                >
                  <img 
                    className="w-full h-full object-cover" 
                    src={img} 
                    alt={`${product.name} view ${i+1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-heading font-bold mb-2">{product.name}</h2>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    className={i < Math.floor(product.rating) ? "fill-yellow-400" : ""}
                    size={16}
                  />
                ))}
              </div>
              <span className="ml-2 text-muted-foreground">
                {product.reviews || 0} reviews
              </span>
            </div>
            
            <p className="text-3xl font-heading text-primary mb-6">${product.price.toFixed(2)}</p>
            
            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>
            
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Colors</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, i) => (
                    <div 
                      key={i}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, i) => (
                    <button 
                      key={i}
                      className={`w-10 h-10 flex items-center justify-center border rounded-md transition-all
                        ${selectedSize === size 
                          ? 'border-primary text-primary' 
                          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-4 mb-8">
              <div className="flex border border-border rounded-md">
                <button 
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-white">{quantity}</span>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                className="btn-animated flex-1 bg-primary hover:bg-opacity-90 text-white py-2 px-6 rounded-md font-medium transition-all duration-300 flex items-center justify-center"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2" size={16} /> Add to Cart
              </button>
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-6">
              <button className="flex items-center text-muted-foreground hover:text-white transition-all">
                <Heart className="mr-2" size={16} /> Add to Wishlist
              </button>
              <button className="flex items-center text-muted-foreground hover:text-white transition-all">
                <Share className="mr-2" size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
