import { useEffect, useRef } from 'react';
import { ShoppingBag, X, Minus, Plus, Trash } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';
import { useCartStore } from '@/store/cart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { gsap, animate } = useGSAP();
  const cartRef = useRef<HTMLDivElement>(null);
  
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 12 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (isOpen) {
      // Open cart animation
      animate(cartRef.current, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      });

      // Animate cart items
      const cartItems = document.querySelectorAll('.cart-item');
      animate(cartItems, {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.out',
      });
    } else if (cartRef.current) {
      // Close cart animation
      animate(cartRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [isOpen, animate]);

  return (
    <div 
      ref={cartRef}
      className="fixed top-0 right-0 w-full md:w-96 h-full bg-background/95 backdrop-blur-lg z-50 transform translate-x-full transition-transform duration-500 shadow-xl"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold text-white">Your Cart</h2>
          <button 
            className="text-white hover:text-primary transition-colors"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X />
          </button>
        </div>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}-${item.color}`} 
                className="cart-item flex items-center space-x-4 pb-4 border-b border-border"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.size && `Size: ${item.size} | `}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex border border-border rounded-md">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-white"
                        onClick={() => decreaseQuantity(item.id, item.size, item.color)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 h-6 flex items-center justify-center text-white">
                        {item.quantity}
                      </span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-white"
                        onClick={() => increaseQuantity(item.id, item.size, item.color)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-primary font-medium">${item.price}</span>
                  </div>
                </div>
                <button 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  aria-label="Remove from cart"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-white font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-white font-medium">Total</span>
                <span className="text-2xl text-primary font-heading font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="btn-animated w-full bg-primary hover:bg-opacity-90 text-white py-3 rounded-lg font-medium transition-all duration-300 mb-4">
                Checkout
              </button>
              <button 
                className="btn-animated w-full bg-transparent border-2 border-border hover:border-primary text-white hover:text-primary py-3 rounded-lg font-medium transition-all duration-300"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
