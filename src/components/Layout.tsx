import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import ProductDetailModal from './ProductDetailModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        openCart={() => setIsCartOpen(true)} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      <ProductDetailModal 
        isOpen={productModalOpen} 
        onClose={() => setProductModalOpen(false)}
        productId={selectedProduct}
      />
    </div>
  );
}
