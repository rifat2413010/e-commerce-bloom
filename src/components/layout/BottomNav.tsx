import { Link, useLocation } from 'react-router-dom';
import { Home, Headphones, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const { getItemCount } = useCart();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/support', icon: Headphones, label: 'Support' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: getItemCount() },
    { path: '/search', icon: Search, label: 'Search' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", active && "fill-primary/20")} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn("text-xs", active && "font-medium")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
