import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@/hooks/use-gsap";
import { useThree } from "@/hooks/use-three";
import { X, Star, ShoppingBag, Heart, Share, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { getProductById } from "@/data/products";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  productId,
}: ProductDetailModalProps) {
  const { gsap, animate } = useGSAP();
  const modalRef = useRef<HTMLDivElement>(null);
  const productViewRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  const product = productId ? getProductById(productId) : null;

  const { setupThreeJSProductViewer } = useThree();

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);

      animate(
        modalRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        { from: { opacity: 0, scale: 0.9 } }
      );

      if (productViewRef.current) {
        setupThreeJSProductViewer(productViewRef.current, product.image);
      }
    }
  }, [isOpen, product, animate, setupThreeJSProductViewer]);

  useEffect(() => {
    if (isOpen && productViewRef.current) {
      const container = productViewRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = ((e.clientX - left - width / 2) / (width / 2)) * 10;
        const y = ((e.clientY - top - height / 2) / (height / 2)) * 10;

        gsap.to(container, {
          rotationY: x,
          rotationX: -y,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(container, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isOpen, gsap]);

  function closeModal() {
    animate(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power3.out",
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
      <div
        className="absolute inset-0 bg-background opacity-90"
        onClick={closeModal}
      ></div>

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card/90 backdrop-blur-md rounded-xl p-4 sm:p-6 m-4"
        style={{ opacity: 0, transform: "scale(0.9)" }}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
          {/* Product View */}
          <div className="flex flex-col items-center">
            <div
              ref={productViewRef}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden"
            >
              <img
                className="w-full h-full object-cover"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="flex mt-4 space-x-3 overflow-x-auto">
              {[product.image, ...(product.additionalImages || [])].map(
                (img, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                      i === 0 ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={img}
                      alt={`view ${i + 1}`}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
              {product.name}
            </h2>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.floor(product.rating) ? "fill-yellow-400" : ""
                      }
                      size={16}
                    />
                  ))}
              </div>
              <span className="ml-2 text-muted-foreground">
                {product.reviews || 0} reviews
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-heading text-primary mb-4">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-muted-foreground mb-4">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Colors</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                        selectedColor === color
                          ? "border-white"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      className={`w-10 h-10 flex items-center justify-center rounded-md border transition-all
                      ${
                        selectedSize === size
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-white">
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="flex-1 bg-primary text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-opacity-90 transition"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2" size={16} /> Add to Cart
              </button>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-4">
              <button className="flex items-center text-muted-foreground hover:text-white">
                <Heart className="mr-2" size={16} /> Wishlist
              </button>
              <button className="flex items-center text-muted-foreground hover:text-white">
                <Share className="mr-2" size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
