import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Trash2, Image, Calendar, Tag, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  banner_type: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  discount_percentage: number;
  target_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface BannersTabProps {
  adminId: string;
}

export const BannersTab = ({ adminId }: BannersTabProps) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingBanners, setFetchingBanners] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    banner_type: 'sale',
    is_active: true,
    start_date: '',
    end_date: '',
    discount_percentage: 0,
    target_url: '',
    display_order: 0,
    selected_products: [] as string[]
  });

  const [products, setProducts] = useState<any[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);

  useEffect(() => {
    if (adminId) {
      fetchBanners();
      fetchProducts();
    }
  }, [adminId]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, images, price')
        .eq('is_active', true);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBanners = async () => {
    if (!adminId) return;
    
    setFetchingBanners(true);
    try {
      // Use the RPC function to get banners for admin
      const { data, error } = await supabase.rpc('get_banners_for_admin', {
        admin_id: adminId
      });
      
      if (error) throw error;
      
      setBanners(data || []);
    } catch (error: any) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners: " + error.message,
        variant: "destructive"
      });
    } finally {
      setFetchingBanners(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Upload file directly without session token dependency
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Banner image uploaded successfully",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    toast({
      title: "Image removed",
      description: "Banner image has been removed"
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      banner_type: 'sale',
      is_active: true,
      start_date: '',
      end_date: '',
      discount_percentage: 0,
      target_url: '',
      display_order: 0,
      selected_products: []
    });
    setShowProductSelector(false);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url || '',
      banner_type: banner.banner_type,
      is_active: banner.is_active,
      start_date: banner.start_date ? banner.start_date.split('T')[0] : '',
      end_date: banner.end_date ? banner.end_date.split('T')[0] : '',
      discount_percentage: banner.discount_percentage,
      target_url: banner.target_url || '',
      display_order: banner.display_order,
      selected_products: []
    });
    setShowAddBanner(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminId) {
      toast({
        title: "Error",
        description: "Admin ID is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Banner title is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (editingBanner) {
        // Update banner using RPC function
        const { error } = await supabase.rpc('update_banner_as_admin', {
          p_admin_id: adminId,
          p_banner_id: editingBanner.id,
          p_title: formData.title.trim(),
          p_description: formData.description.trim() || null,
          p_image_url: formData.image_url || null,
          p_banner_type: formData.banner_type,
          p_is_active: formData.is_active,
          p_start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
          p_end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
          p_discount_percentage: Math.max(0, Math.min(100, formData.discount_percentage)),
          p_target_url: formData.target_url.trim() || null,
          p_display_order: Math.max(0, formData.display_order)
        });

        if (error) throw error;

        toast({
          title: "Banner updated",
          description: "Banner has been updated successfully.",
          className: "bg-green-50 border-green-200 text-green-800"
        });
      } else {
        // Create banner using RPC function
        const { error } = await supabase.rpc('create_banner_as_admin', {
          p_admin_id: adminId,
          p_title: formData.title.trim(),
          p_description: formData.description.trim() || null,
          p_image_url: formData.image_url || null,
          p_banner_type: formData.banner_type,
          p_is_active: formData.is_active,
          p_start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
          p_end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
          p_discount_percentage: Math.max(0, Math.min(100, formData.discount_percentage)),
          p_target_url: formData.target_url.trim() || null,
          p_display_order: Math.max(0, formData.display_order)
        });

        if (error) throw error;

        toast({
          title: "Banner created",
          description: "Banner has been created successfully.",
          className: "bg-green-50 border-green-200 text-green-800"
        });
      }

      resetForm();
      setEditingBanner(null);
      setShowAddBanner(false);
      await fetchBanners();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save banner. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      // Use RPC function to delete banner as admin
      const { error } = await supabase.rpc('delete_banner_as_admin', {
        p_admin_id: adminId,
        p_banner_id: bannerId
      });

      if (error) throw error;

      toast({
        title: "Banner deleted",
        description: "Banner has been removed successfully.",
        className: "bg-green-50 border-green-200 text-green-800"
      });

      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete banner",
        variant: "destructive"
      });
    }
  };

  const toggleBannerStatus = async (bannerId: string, currentStatus: boolean) => {
    try {
      // Use RPC function to update banner status as admin
      const { error } = await supabase.rpc('update_banner_status_as_admin', {
        p_admin_id: adminId,
        p_banner_id: bannerId,
        p_is_active: !currentStatus
      });

      if (error) throw error;

      toast({
        title: `Banner ${!currentStatus ? 'activated' : 'deactivated'}`,
        description: `Banner has been ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update banner status",
        variant: "destructive"
      });
    }
  };

  if (fetchingBanners) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading banners...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Banner Management</CardTitle>
              <CardDescription>Manage promotional banners and sales campaigns</CardDescription>
            </div>
            <Dialog open={showAddBanner} onOpenChange={(open) => {
              setShowAddBanner(open);
              if (!open) {
                resetForm();
                setEditingBanner(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBanner ? 'Update banner information' : 'Create a new promotional banner'}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Banner Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                          placeholder="Enter banner title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner_type">Banner Type</Label>
                        <Select value={formData.banner_type} onValueChange={(value) => setFormData(prev => ({ ...prev, banner_type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter banner description"
                        rows={3}
                      />
                    </div>
                    
                     <div>
                       <Label htmlFor="image">Banner Image</Label>
                       <div className="space-y-4">
                         <div className="flex items-center gap-2">
                           <Input
                             id="image-file"
                             type="file"
                             accept="image/*"
                             onChange={handleImageUpload}
                             disabled={uploading}
                           />
                           <Button type="button" variant="outline" disabled={uploading}>
                             {uploading ? (
                               <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Uploading...
                               </>
                             ) : (
                               <>
                                 <Upload className="h-4 w-4 mr-2" />
                                 Upload
                               </>
                             )}
                           </Button>
                         </div>
                         <div className="text-center text-sm text-muted-foreground">or</div>
                         <div>
                           <Label htmlFor="image-url">Image URL (Optional)</Label>
                           <Input
                             id="image-url"
                             type="url"
                             value={formData.image_url}
                             onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                             placeholder="https://example.com/image.jpg"
                           />
                         </div>
                        {formData.image_url && (
                          <div className="relative">
                            <img 
                              src={formData.image_url} 
                              alt="Banner preview" 
                              className="h-32 w-auto rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="discount_percentage">Discount %</Label>
                        <Input
                          id="discount_percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount_percentage}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            discount_percentage: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input
                          id="display_order"
                          type="number"
                          min="0"
                          value={formData.display_order}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            display_order: Math.max(0, parseInt(e.target.value) || 0)
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                          min={formData.start_date}
                        />
                      </div>
                    </div>
                    
                     <div>
                       <Label htmlFor="target_url">Target URL (optional)</Label>
                       <Input
                         id="target_url"
                         value={formData.target_url}
                         onChange={(e) => setFormData(prev => ({ ...prev, target_url: e.target.value }))}
                         placeholder="/products?category=special-offers"
                       />
                     </div>
                     
                     <div>
                       <div className="flex items-center justify-between">
                         <Label>Featured Products (optional)</Label>
                         <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => setShowProductSelector(!showProductSelector)}
                         >
                           {showProductSelector ? 'Hide Products' : 'Select Products'}
                         </Button>
                       </div>
                       {showProductSelector && (
                         <div className="mt-2 border rounded-lg p-4 max-h-64 overflow-y-auto">
                           <div className="grid grid-cols-1 gap-2">
                             {products.map((product) => (
                               <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                                 <input
                                   type="checkbox"
                                   checked={formData.selected_products.includes(product.id)}
                                   onChange={(e) => {
                                     const productId = product.id;
                                     if (e.target.checked) {
                                       setFormData(prev => ({
                                         ...prev,
                                         selected_products: [...prev.selected_products, productId]
                                       }));
                                     } else {
                                       setFormData(prev => ({
                                         ...prev,
                                         selected_products: prev.selected_products.filter(id => id !== productId)
                                       }));
                                     }
                                   }}
                                   className="rounded"
                                 />
                                 <div className="flex items-center gap-2">
                                   <img
                                     src={product.images[0] || '/placeholder.svg'}
                                     alt={product.name}
                                     className="w-8 h-8 object-cover rounded"
                                   />
                                   <span className="text-sm">{product.name}</span>
                                 </div>
                               </label>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="active">Banner is active</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddBanner(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingBanner ? 'Update Banner' : 'Create Banner'
                        )}
                      </Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No banners yet</h3>
              <p className="text-muted-foreground">Create your first banner to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            {banner.image_url ? (
                              <img 
                                src={banner.image_url} 
                                alt={banner.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Image className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{banner.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Order: {banner.display_order}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {banner.banner_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {banner.discount_percentage > 0 ? (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {banner.discount_percentage}%
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {banner.start_date && banner.end_date ? (
                            <span>
                              {new Date(banner.start_date).toLocaleDateString()} - {new Date(banner.end_date).toLocaleDateString()}
                            </span>
                          ) : (
                            'Always'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={banner.is_active ? "default" : "secondary"}>
                            {banner.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={banner.is_active}
                            onCheckedChange={() => toggleBannerStatus(banner.id, banner.is_active)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(banner.id)}
                          >
                            <Trash2 className="h-3 w-3" />
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
    </div>
  );
};
