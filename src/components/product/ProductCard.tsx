import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, style }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <article 
      className={cn(
        "group bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden",
        className
      )}
      style={style}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Offer badge */}
        {product.isOffer && product.offerPercent && (
          <span className="absolute top-3 left-3 bg-offer text-offer-foreground text-xs font-bold px-2 py-1 rounded-lg">
            {product.offerPercent}% ছাড়
          </span>
        )}

        {/* Best seller badge */}
        {product.isBestSeller && (
          <span className="absolute top-3 right-3 bg-success text-success-foreground text-xs font-bold px-2 py-1 rounded-lg">
            বেস্ট সেলার
          </span>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="secondary" size="sm" className="gap-1">
            <Eye className="h-4 w-4" />
            দেখুন
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </p>

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Unit */}
        <p className="text-sm text-muted-foreground">{product.unit}</p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">৳{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock status */}
        {product.stock <= 0 ? (
          <p className="text-sm text-destructive font-medium">স্টকে নেই</p>
        ) : product.stock <= 10 ? (
          <p className="text-sm text-warning font-medium">মাত্র {product.stock}টি বাকি</p>
        ) : null}

        {/* Add to cart button */}
        <Button
          variant={inCart ? "secondary" : "gradient"}
          className="w-full"
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {inCart ? 'আবার যোগ করুন' : 'কার্টে যোগ করুন'}
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
