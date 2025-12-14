import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Eye, Edit, Truck, Calendar, User, MapPin } from "lucide-react";
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
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipping_address: any;
  contact_info: any;
  tracking_number?: string;
  estimated_delivery?: string;
  profiles: {
    full_name: string;
    email: string;
  };
  order_items: OrderItem[];
}

interface OrdersTabProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export const OrdersTab = ({ orders, onOrderUpdate }: OrdersTabProps) => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [updating, setUpdating] = useState(false);

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

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.tracking_number || "");
    setEstimatedDelivery(order.estimated_delivery || "");
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    
    setUpdating(true);
    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (trackingNumber) {
        updates.tracking_number = trackingNumber;
      }

      if (estimatedDelivery) {
        updates.estimated_delivery = estimatedDelivery;
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', editingOrder.id);

      if (error) throw error;

      // Auto-update product stock when order is delivered
      if (newStatus === 'delivered' && editingOrder.status !== 'delivered') {
        for (const item of editingOrder.order_items) {
          const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product.id)
            .single();

          if (product) {
            await supabase
              .from('products')
              .update({ 
                stock_quantity: Math.max(0, product.stock_quantity - item.quantity),
                updated_at: new Date().toISOString()
              })
              .eq('id', item.product.id);
          }
        }
      }

      toast({
        title: "Order updated",
        description: `Order #${editingOrder.id.slice(-8)} has been updated successfully.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

      setEditingOrder(null);
      onOrderUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Management
          </CardTitle>
          <CardDescription>
            Manage customer orders, update status, and track deliveries with automatic stock management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{order.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{formatINR(order.total_amount)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order Details - #{selectedOrder?.id.slice(-8)}</DialogTitle>
                                <DialogDescription>
                                  Complete order information and items
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Customer Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedOrder.contact_info.fullName}</p>
                                        <p><span className="font-medium">Email:</span> {selectedOrder.contact_info.email}</p>
                                        <p><span className="font-medium">Phone:</span> {selectedOrder.contact_info.phone}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Shipping Address
                                      </h4>
                                      <div className="text-sm text-muted-foreground">
                                        <p>{selectedOrder.shipping_address.street}</p>
                                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                                        <p>{selectedOrder.shipping_address.country}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                      {selectedOrder.order_items.map((item) => (
                                        <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
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
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <h5 className="font-medium">{item.product.name}</h5>
                                            <p className="text-sm text-muted-foreground">
                                              Quantity: {item.quantity} × {formatINR(item.unit_price)}
                                            </p>
                                            <p className="text-sm font-semibold text-primary">
                                              Total: {formatINR(item.total_price)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Order - #{editingOrder?.id.slice(-8)}</DialogTitle>
                                <DialogDescription>
                                  Update order status and tracking information
                                </DialogDescription>
                              </DialogHeader>
                              {editingOrder && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="status">Order Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="tracking">Tracking Number</Label>
                                    <Input
                                      id="tracking"
                                      value={trackingNumber}
                                      onChange={(e) => setTrackingNumber(e.target.value)}
                                      placeholder="Enter tracking number"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="delivery">Estimated Delivery Date</Label>
                                    <Input
                                      id="delivery"
                                      type="date"
                                      value={estimatedDelivery}
                                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2 pt-4">
                                    <Button onClick={handleUpdateOrder} disabled={updating} className="flex-1">
                                      {updating ? 'Updating...' : 'Update Order'}
                                    </Button>
                                    <Button variant="outline" onClick={() => setEditingOrder(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
