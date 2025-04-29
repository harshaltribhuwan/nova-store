import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { useGSAP } from '@/hooks/use-gsap';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import { getAllProducts, Product } from '@/data/products';

export default function Shop() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  
  const { animate } = useGSAP();
  const shopSectionRef = useRef<HTMLDivElement>(null);

  const totalPages = 3; // Just for demonstration
  const productsPerPage = 8;

  useEffect(() => {
    const allProducts = getAllProducts();
    let sortedProducts = [...allProducts];
    
    // Sort products based on selected option
    switch (sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => (b.dateAdded?.getTime() || 0) - (a.dateAdded?.getTime() || 0));
        break;
      default:
        // 'featured' is default, use the order from getAllProducts
        break;
    }
    
    // Paginate
    const start = (currentPage - 1) * productsPerPage;
    const paginatedProducts = sortedProducts.slice(start, start + productsPerPage);
    
    setProducts(paginatedProducts);
  }, [sortBy, currentPage]);

  // Animation for section
  useEffect(() => {
    if (shopSectionRef.current) {
      animate(shopSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, { from: { opacity: 0, y: 50 } });
    }
  }, [animate]);

  function openProductModal(productId: number) {
    setSelectedProduct(productId);
    setProductModalOpen(true);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    // Scroll to top of products section
    shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <section 
        id="shop" 
        ref={shopSectionRef}
        className="py-20 px-8 bg-background relative"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-5xl font-heading font-bold mb-6 md:mb-0">
              <span className="text-white">Shop </span>
              <span className="text-primary">Collection</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative w-48">
                <select 
                  className="w-full appearance-none bg-background/50 border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                  <ChevronDown size={16} />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  className={`bg-background/50 border rounded-lg p-3 transition-all ${view === 'grid' ? 'border-primary' : 'border-border hover:border-primary'}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} className="text-white" />
                </button>
                <button 
                  className={`bg-background/50 border rounded-lg p-3 transition-all ${view === 'list' ? 'border-primary' : 'border-border hover:border-primary'}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <List size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className={view === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" 
            : "flex flex-col space-y-6"
          }>
            {products.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onClick={openProductModal}
              />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-background/50 border border-border text-white hover:border-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
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
