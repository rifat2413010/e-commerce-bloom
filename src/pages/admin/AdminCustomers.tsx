import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, Phone, Mail, MapPin, Package, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  notes: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

interface CustomerOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get order stats for each customer
      const customersWithStats = await Promise.all(
        (data || []).map(async (customer) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('customer_phone', customer.phone);

          return {
            ...customer,
            order_count: orders?.length || 0,
            total_spent: orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerOrders = async (phone: string) => {
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, created_at')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerOrders(data || []);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.phone);
  };

  const exportCustomers = () => {
    const headers = ['Name', 'Phone', 'Email', 'Address', 'City', 'Orders', 'Total Spent', 'Joined'];
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map(c => [
        `"${c.name}"`,
        c.phone,
        c.email || '',
        `"${c.address || ''}"`,
        c.city || '',
        c.order_count || 0,
        c.total_spent || 0,
        format(new Date(c.created_at), 'yyyy-MM-dd'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      processing: 'secondary',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'} className="capitalize">{status}</Badge>;
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">View and manage customer information</p>
        </div>
        <Button variant="outline" onClick={exportCustomers}>
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
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No customers found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.city || customer.address ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {customer.city || customer.address?.slice(0, 20)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Package className="h-3 w-3 mr-1" />
                          {customer.order_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">৳{customer.total_spent?.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(customer.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                    {selectedCustomer.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl font-bold">{selectedCustomer.order_count}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl font-bold">৳{selectedCustomer.total_spent?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl font-bold">
                      {format(new Date(selectedCustomer.created_at), 'MMM yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">Customer Since</p>
                  </CardContent>
                </Card>
              </div>

              {/* Orders */}
              <div>
                <h4 className="font-semibold mb-3">Order History</h4>
                {isLoadingOrders ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No orders found</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{order.total_amount}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;