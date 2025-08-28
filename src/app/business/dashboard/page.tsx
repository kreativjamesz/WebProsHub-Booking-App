'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchBusinesses } from '@/lib/stores/features/businesses/businessesSlice';
import { fetchServicesByBusiness, createService, updateService, deleteService } from '@/lib/stores/features/services/servicesSlice';
import { fetchBusinessBookings, updateBookingStatus } from '@/lib/stores/features/bookings/bookingsSlice';
import { fetchPromosByBusiness, createPromo, updatePromo, deletePromo } from '@/lib/stores/features/promos/promosSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Building, 
    Plus, 
    Edit, 
    Trash2, 
    Calendar, 
    DollarSign, 
    Clock, 
    Users,
    Star,
    Loader2,
    AlertTriangle
} from 'lucide-react';

export default function BusinessDashboard() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { businesses } = useAppSelector(state => state.businesses);
    const { services, isLoading: servicesLoading } = useAppSelector(state => state.services);
    const { bookings, isLoading: bookingsLoading } = useAppSelector(state => state.bookings);
    const { promos, isLoading: promosLoading } = useAppSelector(state => state.promos);

    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
    const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [editingPromo, setEditingPromo] = useState<any>(null);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        categoryId: ''
    });
    const [promoForm, setPromoForm] = useState({
        title: '',
        description: '',
        discountPercentage: '',
        startDate: '',
        endDate: ''
    });

    const userBusiness = businesses.find(b => b.ownerId === user?.$id);

    useEffect(() => {
        if (userBusiness) {
            dispatch(fetchServicesByBusiness(userBusiness.$id));
            dispatch(fetchBusinessBookings(userBusiness.$id));
            dispatch(fetchPromosByBusiness(userBusiness.$id));
        }
    }, [dispatch, userBusiness]);

    // Redirect if not business owner or no business
    useEffect(() => {
        if (user && user.role !== 'business_owner') {
            window.location.href = '/';
        }
    }, [user]);

    if (!user || user.role !== 'business_owner' || !userBusiness) {
        return null;
    }

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userBusiness) return;

        const serviceData = {
            name: serviceForm.name,
            description: serviceForm.description,
            price: parseFloat(serviceForm.price),
            duration: parseInt(serviceForm.duration),
            businessId: userBusiness.$id,
            categoryId: serviceForm.categoryId,
            isActive: true
        };

        if (editingService) {
            await dispatch(updateService({ serviceId: editingService.$id, serviceData }));
        } else {
            await dispatch(createService(serviceData));
        }

        resetServiceForm();
        setIsServiceDialogOpen(false);
    };

    const handlePromoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userBusiness) return;

        const promoData = {
            title: promoForm.title,
            description: promoForm.description,
            discountPercentage: parseInt(promoForm.discountPercentage),
            businessId: userBusiness.$id,
            startDate: promoForm.startDate,
            endDate: promoForm.endDate,
            isActive: true
        };

        if (editingPromo) {
            await dispatch(updatePromo({ promoId: editingPromo.$id, promoData }));
        } else {
            await dispatch(createPromo(promoData));
        }

        resetPromoForm();
        setIsPromoDialogOpen(false);
    };

    const resetServiceForm = () => {
        setServiceForm({
            name: '',
            description: '',
            price: '',
            duration: '',
            categoryId: ''
        });
        setEditingService(null);
    };

    const resetPromoForm = () => {
        setPromoForm({
            title: '',
            description: '',
            discountPercentage: '',
            startDate: '',
            endDate: ''
        });
        setEditingPromo(null);
    };

    const handleEditService = (service: any) => {
        setEditingService(service);
        setServiceForm({
            name: service.name,
            description: service.description,
            price: service.price.toString(),
            duration: service.duration.toString(),
            categoryId: service.categoryId
        });
        setIsServiceDialogOpen(true);
    };

    const handleEditPromo = (promo: any) => {
        setEditingPromo(promo);
        setPromoForm({
            title: promo.title,
            description: promo.description,
            discountPercentage: promo.discountPercentage.toString(),
            startDate: promo.startDate.split('T')[0],
            endDate: promo.endDate.split('T')[0]
        });
        setIsPromoDialogOpen(true);
    };

    const handleDeleteService = async (serviceId: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            await dispatch(deleteService(serviceId));
        }
    };

    const handleDeletePromo = async (promoId: string) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            await dispatch(deletePromo(promoId));
        }
    };

    const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
        await dispatch(updateBookingStatus({ bookingId, status: status as any }));
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            pending: 'outline',
            confirmed: 'secondary',
            completed: 'default',
            cancelled: 'destructive'
        };
        return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
    };

    const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Business Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Welcome back, {userBusiness.name}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{services.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Active services
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingBookings}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting confirmation
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedBookings}</div>
                            <p className="text-xs text-muted-foreground">
                                Total completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                From completed bookings
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="bookings" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="promos">Promotions</TabsTrigger>
                    </TabsList>

                    {/* Bookings Tab */}
                    <TabsContent value="bookings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>
                                    Manage and update booking statuses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {bookingsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : bookings.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Service</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.map((booking) => {
                                                const service = services.find(s => s.$id === booking.serviceId);
                                                return (
                                                    <TableRow key={booking.$id}>
                                                        <TableCell className="font-medium">
                                                            Customer #{booking.customerId.slice(-6)}
                                                        </TableCell>
                                                        <TableCell>{service?.name || 'Unknown Service'}</TableCell>
                                                        <TableCell>
                                                            {new Date(booking.scheduledDate).toLocaleDateString()}
                                                            <br />
                                                            <span className="text-sm text-gray-500">
                                                                {booking.scheduledTime}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>${booking.totalPrice}</TableCell>
                                                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={booking.status}
                                                                onValueChange={(value) => handleUpdateBookingStatus(booking.$id, value)}
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="pending">Pending</SelectItem>
                                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No bookings yet
                                        </h3>
                                        <p className="text-gray-600">
                                            Bookings will appear here once customers start booking your services
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Services</CardTitle>
                                        <CardDescription>
                                            Manage your business services
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => setIsServiceDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Service
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {servicesLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : services.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Service Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Duration</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service.$id}>
                                                    <TableCell className="font-medium">{service.name}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {service.description}
                                                    </TableCell>
                                                    <TableCell>${service.price}</TableCell>
                                                    <TableCell>{service.duration} min</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditService(service)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteService(service.$id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No services yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Add your first service to start accepting bookings
                                        </p>
                                        <Button onClick={() => setIsServiceDialogOpen(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Service
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Promos Tab */}
                    <TabsContent value="promos">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Promotions</CardTitle>
                                        <CardDescription>
                                            Manage your business promotions and offers
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => setIsPromoDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Promotion
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {promosLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : promos.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Discount</TableHead>
                                                <TableHead>Valid Period</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {promos.map((promo) => (
                                                <TableRow key={promo.$id}>
                                                    <TableCell className="font-medium">{promo.title}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {promo.description}
                                                    </TableCell>
                                                    <TableCell>{promo.discountPercentage}% OFF</TableCell>
                                                    <TableCell>
                                                        {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditPromo(promo)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeletePromo(promo.$id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No promotions yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Create promotions to attract more customers
                                        </p>
                                        <Button onClick={() => setIsPromoDialogOpen(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Promotion
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Service Dialog */}
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingService ? 'Update your service details' : 'Create a new service for your business'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="serviceName">Service Name</Label>
                            <Input
                                id="serviceName"
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                placeholder="Enter service name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="serviceDescription">Description</Label>
                            <Textarea
                                id="serviceDescription"
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                placeholder="Describe your service"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="servicePrice">Price ($)</Label>
                                <Input
                                    id="servicePrice"
                                    type="number"
                                    step="0.01"
                                    value={serviceForm.price}
                                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                                <Input
                                    id="serviceDuration"
                                    type="number"
                                    value={serviceForm.duration}
                                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                                    placeholder="60"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsServiceDialogOpen(false);
                                    resetServiceForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingService ? 'Update Service' : 'Add Service'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promo Dialog */}
            <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPromo ? 'Update your promotion details' : 'Create a new promotion to attract customers'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePromoSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="promoTitle">Promotion Title</Label>
                            <Input
                                id="promoTitle"
                                value={promoForm.title}
                                onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                                placeholder="Enter promotion title"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="promoDescription">Description</Label>
                            <Textarea
                                id="promoDescription"
                                value={promoForm.description}
                                onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                                placeholder="Describe your promotion"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="promoDiscount">Discount (%)</Label>
                                <Input
                                    id="promoDiscount"
                                    type="number"
                                    value={promoForm.discountPercentage}
                                    onChange={(e) => setPromoForm({ ...promoForm, discountPercentage: e.target.value })}
                                    placeholder="20"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="promoStartDate">Start Date</Label>
                                <Input
                                    id="promoStartDate"
                                    type="date"
                                    value={promoForm.startDate}
                                    onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="promoEndDate">End Date</Label>
                                <Input
                                    id="promoEndDate"
                                    type="date"
                                    value={promoForm.endDate}
                                    onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsPromoDialogOpen(false);
                                    resetPromoForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingPromo ? 'Update Promotion' : 'Add Promotion'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
