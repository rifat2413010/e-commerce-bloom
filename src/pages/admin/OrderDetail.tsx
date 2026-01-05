import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, TrendingUp, Truck, CheckCircle, XCircle, Loader2, User, Phone, MapPin, Package } from 'lucide-react';
import { format } from 'date-fns';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_size: string | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  customer_city: string | null;
  customer_district: string | null;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const [orderRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).single(),
        supabase.from('order_items').select('*').eq('order_id', id),
      ]);

      if (orderRes.error) throw orderRes.error;
      
      setOrder(orderRes.data);
      setOrderItems(itemsRes.data || []);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive',
      });
      navigate('/admin2413/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      setOrder({ ...order, status: newStatus });
      toast({
        title: 'Success',
        description: 'Order status updated',
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; className?: string }> = {
      pending: { variant: 'outline', icon: <Clock className="h-3 w-3" />, className: 'border-warning text-warning' },
      processing: { variant: 'secondary', icon: <TrendingUp className="h-3 w-3" /> },
      shipped: { variant: 'default', icon: <Truck className="h-3 w-3" />, className: 'bg-primary' },
      delivered: { variant: 'default', icon: <CheckCircle className="h-3 w-3" />, className: 'bg-success' },
      cancelled: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
    };

    const config = statusConfig[status];
    
    return (
      <Badge variant={config.variant} className={`gap-1 capitalize text-base px-3 py-1 ${config.className || ''}`}>
        {config.icon}
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin2413/orders')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.order_number}</h1>
            <p className="text-muted-foreground">
              Placed on {format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}
            </p>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.product_image ? (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_name}</p>
                      {item.selected_size && (
                        <p className="text-sm text-muted-foreground">Size: {item.selected_size}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        ৳{item.unit_price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">৳{item.total_price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span>৳{order.delivery_charge}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">৳{order.total_amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={order.status} onValueChange={(val) => updateOrderStatus(val as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{order.customer_phone}</p>
                  {order.customer_email && (
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{order.customer_address}</p>
                  {(order.customer_city || order.customer_district) && (
                    <p className="text-sm text-muted-foreground">
                      {[order.customer_district, order.customer_city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
