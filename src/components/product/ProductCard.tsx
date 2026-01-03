import { Link } from 'react-router-dom';
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
  const { addToCart } = useCart();

  return (
    <article 
      className={cn(
        "group bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-300 overflow-hidden",
        className
      )}
      style={style}
    >
      {/* Image container */}
      <Link to={`/product/${product.id}`} className="block relative p-3">
        {/* ON SALE badge */}
        {product.isOffer && (
          <span className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1 rounded">
            ON SALE
          </span>
        )}

        {/* Product image */}
        <div className="aspect-square flex items-center justify-center bg-muted/30 rounded">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="px-3 pb-3 space-y-2">
        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>


        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-primary">Tk {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              Tk {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quick Add button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded"
          size="sm"
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
        >
          Quick Add
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
