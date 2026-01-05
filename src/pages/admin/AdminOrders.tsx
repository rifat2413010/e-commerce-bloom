import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, Download, Clock, TrendingUp, Truck, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));

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

  const exportOrders = () => {
    const csvContent = [
      ['Order Number', 'Customer', 'Phone', 'Address', 'Total', 'Status', 'Date'],
      ...filteredOrders.map(o => [
        o.order_number,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.total_amount.toString(),
        o.status,
        format(new Date(o.created_at), 'yyyy-MM-dd HH:mm'),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Orders exported successfully',
    });
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
      <Badge variant={config.variant} className={`gap-1 capitalize ${config.className || ''}`}>
        {config.icon}
        {status}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button variant="outline" onClick={exportOrders}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order #, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell className="font-semibold">৳{order.total_amount}</TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            {getStatusBadge(order.status)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(order.created_at), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin2413/orders/${order.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
