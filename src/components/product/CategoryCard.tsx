import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
  style?: React.CSSProperties;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, className, style }) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className={cn(
        "group block bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden",
        className
      )}
      style={style}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <div className="p-4 text-center bg-gradient-to-t from-card to-transparent">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground">{category.nameEn}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
