import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ShelterProfile {
  id: string;
  user_id: string;
  shelter_name: string;
  capacity: number;
  rating: number;
  review_count: number;
}

interface ShelterStatsCardsProps {
  shelterProfile: ShelterProfile;
}

interface Stats {
  availableRequests: number;
  acceptedRequests: number;
  completedRequests: number;
  averageRating: number;
}

const ShelterStatsCards = ({ shelterProfile }: ShelterStatsCardsProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    availableRequests: 0,
    acceptedRequests: 0,
    completedRequests: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get available requests (city-based priority)
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', user.id)
        .single();

      // Count available requests prioritized by city
      const { count: availableCount } = await supabase
        .from('pet_care_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .is('shelter_id', null)
        .is('sitter_id', null);

      // Count accepted requests
      const { count: acceptedCount } = await supabase
        .from('pet_care_requests')
        .select('*', { count: 'exact', head: true })
        .eq('shelter_id', user.id)
        .eq('status', 'accepted');

      // Count completed requests
      const { count: completedCount } = await supabase
        .from('pet_care_requests')
        .select('*', { count: 'exact', head: true })
        .eq('shelter_id', user.id)
        .eq('status', 'completed');

      setStats({
        availableRequests: availableCount || 0,
        acceptedRequests: acceptedCount || 0,
        completedRequests: completedCount || 0,
        averageRating: shelterProfile.rating || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Available Requests',
      value: stats.availableRequests,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Care',
      value: stats.acceptedRequests,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed',
      value: stats.completedRequests,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ShelterStatsCards;