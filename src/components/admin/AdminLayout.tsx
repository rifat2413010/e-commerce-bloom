import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Settings, 
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/admin2413/dashboard' 
  },
  { 
    name: 'Products', 
    icon: Package, 
    path: '/admin2413/products' 
  },
  { 
    name: 'Categories', 
    icon: FolderTree, 
    path: '/admin2413/categories' 
  },
  { 
    name: 'Orders', 
    icon: ShoppingCart, 
    path: '/admin2413/orders' 
  },
  { 
    name: 'Customers', 
    icon: Users, 
    path: '/admin2413/customers' 
  },
  { 
    name: 'Content', 
    icon: FileText, 
    path: '/admin2413/content' 
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/admin2413/settings' 
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin2413');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-md"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="font-semibold">Admin Panel</span>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-200 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link to="/admin2413/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive(item.path) && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="min-h-screen p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
