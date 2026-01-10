import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PageLoader from "@/components/layout/PageLoader";
import TrackingProvider from "@/components/TrackingProvider";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import CategoryForm from "./pages/admin/CategoryForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import OrderDetail from "./pages/admin/OrderDetail";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPixel from "./pages/admin/AdminPixel";
import AdminTrackingPixels from "./pages/admin/AdminTrackingPixels";
import AdminContent from "./pages/admin/AdminContent";
import ContentForm from "./pages/admin/ContentForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TrackingProvider>
            <PageLoader />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              
              {/* Admin Routes */}
              <Route path="/admin2413" element={<AdminLogin />} />
              <Route path="/admin2413/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin2413/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin2413/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
              <Route path="/admin2413/products/:id" element={<AdminRoute><ProductForm /></AdminRoute>} />
              <Route path="/admin2413/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin2413/categories/new" element={<AdminRoute><CategoryForm /></AdminRoute>} />
              <Route path="/admin2413/categories/:id" element={<AdminRoute><CategoryForm /></AdminRoute>} />
              <Route path="/admin2413/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin2413/orders/:id" element={<AdminRoute><OrderDetail /></AdminRoute>} />
              <Route path="/admin2413/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
              <Route path="/admin2413/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin2413/pixel" element={<AdminRoute><AdminPixel /></AdminRoute>} />
              <Route path="/admin2413/tracking-pixels" element={<AdminRoute><AdminTrackingPixels /></AdminRoute>} />
              <Route path="/admin2413/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
              <Route path="/admin2413/content/new" element={<AdminRoute><ContentForm /></AdminRoute>} />
              <Route path="/admin2413/content/:id" element={<AdminRoute><ContentForm /></AdminRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TrackingProvider>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
