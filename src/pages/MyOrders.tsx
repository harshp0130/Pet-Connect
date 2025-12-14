import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Package, Truck, Calendar, DollarSign, MapPin, RefreshCw, X, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/currency";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: any;
  contact_info: any;
  tracking_number?: string;
  estimated_delivery?: string;
  order_items: OrderItem[];
}

export default function MyOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [rescheduleOrder, setRescheduleOrder] = useState<Order | null>(null);
  const [newDeliveryDate, setNewDeliveryDate] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              id,
              name,
              images
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!cancelReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for cancellation",
        variant: "destructive"
      });
      return;
    }

    setCancellingOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          cancellation_reason: cancelReason,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
        className: "bg-green-50 border-green-200 text-green-800"
      });

      fetchOrders();
      setCancelReason('');
    } catch (error: any) {
      toast({
        title: "Error cancelling order",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleRescheduleOrder = async () => {
    if (!rescheduleOrder || !newDeliveryDate) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          estimated_delivery: newDeliveryDate,
          reschedule_count: (rescheduleOrder as any).reschedule_count ? (rescheduleOrder as any).reschedule_count + 1 : 1
        })
        .eq('id', rescheduleOrder.id);

      if (error) throw error;

      toast({
        title: "Order rescheduled",
        description: "Your delivery date has been updated",
        className: "bg-green-50 border-green-200 text-green-800"
      });

      fetchOrders();
      setRescheduleOrder(null);
      setNewDeliveryDate('');
    } catch (error: any) {
      toast({
        title: "Error rescheduling order",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            My Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your orders
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                              {item.product.images.length > 0 ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × {formatINR(item.unit_price)}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                {formatINR(item.total_price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">Total Amount</p>
                          <p className="text-primary font-semibold">
                            {formatINR(order.total_amount)}
                          </p>
                        </div>
                      </div>
                      
                      {order.tracking_number && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <p className="font-medium">Tracking Number</p>
                            <p className="text-muted-foreground">{order.tracking_number}</p>
                          </div>
                        </div>
                      )}
                      
                      {order.estimated_delivery && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <p className="font-medium">Estimated Delivery</p>
                            <p className="text-muted-foreground">
                              {new Date(order.estimated_delivery).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="text-sm">
                          <p className="font-medium">Shipping Address</p>
                          <p className="text-muted-foreground">
                            {order.shipping_address.street}<br />
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}<br />
                            {order.shipping_address.country}
                          </p>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="pt-4 border-t">
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel Order
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancel Order</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for cancelling this order
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="cancel-reason">Cancellation Reason</Label>
                                    <Textarea
                                      id="cancel-reason"
                                      value={cancelReason}
                                      onChange={(e) => setCancelReason(e.target.value)}
                                      placeholder="Why are you cancelling this order?"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleCancelOrder(order.id)}
                                      disabled={cancellingOrder === order.id}
                                      variant="destructive"
                                    >
                                      {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {(order.status === 'confirmed' || order.status === 'shipped') && order.estimated_delivery && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Reschedule
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reschedule Delivery</DialogTitle>
                                  <DialogDescription>
                                    Choose a new delivery date for your order
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="new-date">New Delivery Date</Label>
                                    <Input
                                      id="new-date"
                                      type="date"
                                      value={newDeliveryDate}
                                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                                      min={new Date().toISOString().split('T')[0]}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => {
                                        setRescheduleOrder(order);
                                        handleRescheduleOrder();
                                      }}
                                      disabled={!newDeliveryDate}
                                    >
                                      Reschedule
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle>No orders yet</CardTitle>
              <p className="text-muted-foreground">
                Start shopping to see your orders here
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
