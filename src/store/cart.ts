import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string | null;
  color: string | null;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (
    id: number, 
    name: string, 
    price: number, 
    image: string, 
    size: string | null, 
    color: string | null,
    quantity?: number
  ) => void;
  removeFromCart: (id: number, size: string | null, color: string | null) => void;
  increaseQuantity: (id: number, size: string | null, color: string | null) => void;
  decreaseQuantity: (id: number, size: string | null, color: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  
  addToCart: (id, name, price, image, size, color, quantity = 1) => {
    set((state) => {
      // Check if item already exists in cart
      const existingItemIndex = state.cart.findIndex(
        item => item.id === id && item.size === size && item.color === color
      );
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += quantity;
        return { cart: updatedCart };
      } else {
        // Add new item to cart
        return { 
          cart: [...state.cart, { 
            id, 
            name, 
            price, 
            image, 
            size, 
            color, 
            quantity 
          }] 
        };
      }
    });
  },
  
  removeFromCart: (id, size, color) => {
    set((state) => ({
      cart: state.cart.filter(
        item => !(item.id === id && item.size === size && item.color === color)
      )
    }));
  },
  
  increaseQuantity: (id, size, color) => {
    set((state) => {
      const updatedCart = state.cart.map(item => {
        if (item.id === id && item.size === size && item.color === color) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      return { cart: updatedCart };
    });
  },
  
  decreaseQuantity: (id, size, color) => {
    set((state) => {
      const itemIndex = state.cart.findIndex(
        item => item.id === id && item.size === size && item.color === color
      );
      
      if (itemIndex === -1) return state;
      
      const item = state.cart[itemIndex];
      
      if (item.quantity === 1) {
        // Remove item if quantity will be 0
        return {
          cart: state.cart.filter((_, index) => index !== itemIndex)
        };
      } else {
        // Decrease quantity
        const updatedCart = [...state.cart];
        updatedCart[itemIndex] = { 
          ...updatedCart[itemIndex], 
          quantity: updatedCart[itemIndex].quantity - 1 
        };
        return { cart: updatedCart };
      }
    });
  },
  
  clearCart: () => {
    set({ cart: [] });
  }
}));
