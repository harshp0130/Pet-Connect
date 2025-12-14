import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, Calendar, Video, Star, Plus, User, PawPrint, DollarSign, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PetLover = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [profileComplete, setProfileComplete] = useState(65);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkUserProfile();
    }
  }, [user]);

  const checkUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setUserProfile(data);

      // If user is already a pet sitter, redirect to dashboard
      if (data?.user_type === 'pet_sitter') {
        navigate('/pet-sitter-dashboard');
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking user profile:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setProfileComplete(100);
      setIsSubmitting(false);
    }, 1500);
  };

  const mockBookings = [
    {
      id: 1,
      petName: "Buddy",
      petType: "Golden Retriever",
      owner: "John Smith",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      status: "Active",
      price: "$125",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200"
    },
    {
      id: 2,
      petName: "Whiskers",
      petType: "Persian Cat",
      owner: "Maria Garcia",
      startDate: "2024-01-22",
      endDate: "2024-01-25",
      status: "Upcoming",
      price: "$75",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200"
    },
    {
      id: 3,
      petName: "Rex",
      petType: "Labrador",
      owner: "Michael Brown",
      startDate: "2024-02-05",
      endDate: "2024-02-10",
      status: "Pending",
      price: "$110",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=200"
    }
  ];

  const mockRequests = [
    {
      id: 1,
      petName: "Max",
      petType: "German Shepherd",
      owner: "David Wilson",
      duration: "3 days",
      price: "$90",
      distance: "2.1 km away",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=200"
    },
    {
      id: 2,
      petName: "Luna",
      petType: "Siamese Cat",
      owner: "Sarah Johnson",
      duration: "1 week",
      price: "$175",
      distance: "1.5 km away",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200"
    },
    {
      id: 3,
      petName: "Charlie",
      petType: "Beagle",
      owner: "Robert Taylor",
      duration: "2 days",
      price: "$60",
      distance: "3.2 km away",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=200"
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="font-bold text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">PetConnect</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6">
              <Link 
                to="/pet-owner" 
                className="text-sm font-medium transition-colors hover:text-rose-500 text-gray-600 hover:text-rose-500"
              >
                For Pet Owners
              </Link>
              <Link 
                to="/pet-lover" 
                className="text-sm font-medium text-rose-500 relative group"
              >
                For Pet Lovers
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 transform scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/products" 
                className="text-sm font-medium transition-colors hover:text-rose-500 text-gray-600 hover:text-rose-500"
              >
                Pet Products
              </Link>
            </nav>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-rose-500" />
                  </div>
                  <span className="text-sm font-medium">{user?.user_metadata?.full_name || "Pet Lover"}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-rose-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-gray-300">
                  Login
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Profile Setup */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeIn}>
              <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Your Profile</CardTitle>
                    <motion.div 
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      className="relative w-12 h-12"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full"></div>
                      <User className="absolute inset-0 m-auto text-rose-500" size={20} />
                    </motion.div>
                  </div>
                  <CardDescription>Complete your profile to get more bookings</CardDescription>
                  <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${profileComplete}%` }}
                        transition={{ duration: 1 }}
                        className="bg-gradient-to-r from-rose-400 to-pink-400 h-2 rounded-full" 
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{profileComplete}% complete</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleProfileSubmit}>
                    <motion.div variants={slideIn} className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      {isLoading ? (
                        <Skeleton className="h-9 w-full rounded-md" />
                      ) : (
                        <Input 
                          id="name" 
                          placeholder="Enter your full name" 
                          className="border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                          defaultValue={user?.user_metadata?.full_name || ""}
                        />
                      )}
                    </motion.div>

                    <motion.div variants={slideIn} className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700">Location</Label>
                      {isLoading ? (
                        <Skeleton className="h-9 w-full rounded-md" />
                      ) : (
                        <div className="relative">
                          <Input 
                            id="location" 
                            placeholder="Enter your city/area" 
                            className="border-gray-300 focus:ring-rose-500 focus:border-rose-500 pl-10"
                          />
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      )}
                    </motion.div>

                    <motion.div variants={slideIn} className="space-y-2">
                      <Label htmlFor="experience" className="text-gray-700">Years of Experience</Label>
                      {isLoading ? (
                        <Skeleton className="h-9 w-full rounded-md" />
                      ) : (
                        <Select>
                          <SelectTrigger className="border-gray-300 focus:ring-rose-500 focus:border-rose-500">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-200 shadow-lg">
                            <SelectItem value="1">1 year</SelectItem>
                            <SelectItem value="2">2 years</SelectItem>
                            <SelectItem value="3">3 years</SelectItem>
                            <SelectItem value="5">5+ years</SelectItem>
                            <SelectItem value="10">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </motion.div>

                    <motion.div variants={slideIn} className="space-y-3">
                      <Label className="text-gray-700">Pet Types You Care For</Label>
                      {isLoading ? (
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Skeleton className="h-4 w-4 rounded" />
                              <Skeleton className="h-4 w-20 rounded" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="dogs" className="text-rose-500 border-gray-300" />
                            <Label htmlFor="dogs" className="text-gray-700">Dogs</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cats" className="text-rose-500 border-gray-300" />
                            <Label htmlFor="cats" className="text-gray-700">Cats</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="birds" className="text-rose-500 border-gray-300" />
                            <Label htmlFor="birds" className="text-gray-700">Birds</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="small-animals" className="text-rose-500 border-gray-300" />
                            <Label htmlFor="small-animals" className="text-gray-700">Small Animals</Label>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    <motion.div variants={slideIn} className="space-y-2">
                      <Label htmlFor="daily-rate" className="text-gray-700">Daily Rate ($)</Label>
                      {isLoading ? (
                        <Skeleton className="h-9 w-full rounded-md" />
                      ) : (
                        <div className="relative">
                          <Input 
                            id="daily-rate" 
                            type="number" 
                            placeholder="25" 
                            className="border-gray-300 focus:ring-rose-500 focus:border-rose-500 pl-10"
                          />
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      )}
                    </motion.div>

                    <motion.div variants={slideIn} className="space-y-2">
                      <Label htmlFor="bio" className="text-gray-700">About You</Label>
                      {isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full rounded" />
                          <Skeleton className="h-4 w-3/4 rounded" />
                          <Skeleton className="h-4 w-1/2 rounded" />
                        </div>
                      ) : (
                        <Textarea 
                          id="bio"
                          placeholder="Tell pet owners about yourself, your experience, and why you love caring for pets..."
                          className="min-h-[100px] border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                        />
                      )}
                    </motion.div>

                    <motion.div variants={scaleUp} className="pt-2">
                      {isLoading ? (
                        <Skeleton className="h-10 w-full rounded-md" />
                      ) : userProfile?.user_type === 'pet_sitter' ? (
                        <Button 
                          onClick={() => navigate('/pet-sitter-dashboard')}
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                        >
                          Go to Sitter Dashboard
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => navigate('/profile-setup')}
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Complete Pet Sitter Setup
                        </Button>
                      )}
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[1, 2, 3].map((item, index) => (
                <motion.div key={index} variants={fadeIn}>
                  {isLoading ? (
                    <Skeleton className="h-32 rounded-xl" />
                  ) : (
                    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            whileHover={{ rotate: 10 }}
                            className="p-3 rounded-full"
                            style={{
                              background: index === 0 ? '#ffe4e6' : index === 1 ? '#fce7f3' : '#dcfce7',
                            }}
                          >
                            {index === 0 ? (
                              <Star className="h-6 w-6 text-rose-500" />
                            ) : index === 1 ? (
                              <PawPrint className="h-6 w-6 text-pink-500" />
                            ) : (
                              <DollarSign className="h-6 w-6 text-green-500" />
                            )}
                          </motion.div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">
                              {index === 0 ? '4.9' : index === 1 ? '24' : '$450'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {index === 0 ? 'Average Rating' : index === 1 ? 'Pets Cared For' : 'This Month'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div 
              variants={fadeIn}
              className="flex border-b border-gray-200"
            >
              {['bookings', 'requests'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium relative capitalize ${activeTab === tab ? 'text-rose-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'bookings' ? 'Your Bookings' : 'New Requests'}
                  {activeTab === tab && (
                    <motion.span 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' ? (
                <motion.div
                  key="bookings"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Your Bookings</CardTitle>
                      <CardDescription>Manage your current and upcoming pet care bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <motion.div 
                          variants={staggerContainer}
                          className="space-y-4"
                        >
                          {[1, 2, 3].map((i) => (
                            <motion.div 
                              key={i}
                              variants={fadeIn}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-3 w-24" />
                                  <Skeleton className="h-3 w-36" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Skeleton className="h-6 w-20 ml-auto" />
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-32" />
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          variants={staggerContainer}
                          className="space-y-4"
                        >
                          {mockBookings.map((booking) => (
                            <motion.div 
                              key={booking.id}
                              variants={fadeIn}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow gap-4 sm:gap-0"
                            >
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                                >
                                  <img 
                                    src={booking.image} 
                                    alt={booking.petName} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </motion.div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{booking.petName}</h4>
                                  <p className="text-sm text-gray-600">{booking.petType}</p>
                                  <p className="text-sm text-gray-500">Owner: {booking.owner}</p>
                                  <div className="flex items-center mt-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500 ml-1">{booking.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center sm:text-right w-full sm:w-auto">
                                <Badge 
                                  variant={booking.status === "Active" ? "default" : booking.status === "Upcoming" ? "secondary" : "outline"} 
                                  className={`${
                                    booking.status === "Active" ? 'bg-green-100 text-green-800' : 
                                    booking.status === "Upcoming" ? 'bg-blue-100 text-blue-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {booking.status}
                                </Badge>
                                <p className="text-sm text-gray-500 mt-1">
                                  {booking.startDate} - {booking.endDate}
                                </p>
                                <p className="font-semibold text-rose-500 text-lg">{booking.price}</p>
                              </div>
                              
                              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                <Button size="sm" variant="outline" className="border-gray-300">
                                  <Video className="h-4 w-4 mr-2" />
                                  Video Call
                                </Button>
                                <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                                  Contact Owner
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="requests"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">New Booking Requests</CardTitle>
                      <CardDescription>Pet owners near you looking for care</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <motion.div 
                          variants={staggerContainer}
                          className="space-y-4"
                        >
                          {[1, 2, 3].map((i) => (
                            <motion.div 
                              key={i}
                              variants={fadeIn}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-3 w-24" />
                                  <Skeleton className="h-3 w-36" />
                                  <Skeleton className="h-3 w-28" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Skeleton className="h-6 w-16 ml-auto" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-28" />
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          variants={staggerContainer}
                          className="space-y-4"
                        >
                          {mockRequests.map((request) => (
                            <motion.div 
                              key={request.id}
                              variants={fadeIn}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow gap-4 sm:gap-0"
                            >
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                                >
                                  <img 
                                    src={request.image} 
                                    alt={request.petName} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </motion.div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{request.petName}</h4>
                                  <p className="text-sm text-gray-600">{request.petType}</p>
                                  <p className="text-sm text-gray-500">Owner: {request.owner}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">{request.distance}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500 ml-1">{request.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center sm:text-right w-full sm:w-auto">
                                <p className="font-semibold text-rose-500 text-lg">{request.price}</p>
                                <p className="text-sm text-gray-500">{request.duration}</p>
                              </div>
                              
                              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                <Button size="sm" variant="outline" className="border-gray-300">
                                  View Details
                                </Button>
                                <motion.div whileHover={{ scale: 1.03 }}>
                                  <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                                    Accept Request
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PetLover;