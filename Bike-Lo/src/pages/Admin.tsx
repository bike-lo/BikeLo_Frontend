import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { getBikes } from '@/services/bikeService';
import { listUsersApi } from '@/services/authService';
import { getSpareParts } from '@/services/sparePartService';
import { 
  Users, 
  Bike as BikeIcon, 
  PlusCircle, 
  LayoutDashboard, 
  ChevronRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBikes: 0,
    totalUsers: 0,
    activeAds: 0,
    totalParts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const [users, bikes, parts] = await Promise.all([
          listUsersApi(),
          getBikes(),
          getSpareParts()
        ]);
        
        setStats({
          totalBikes: bikes.length,
          totalUsers: users.length,
          activeAds: bikes.filter(b => b.is_ad).length,
          totalParts: parts.length
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 bg-transparent">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 
              className="text-4xl font-bold text-white mb-2 flex items-center gap-3" 
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <LayoutDashboard className="w-10 h-10 text-[#f7931e]" />
              Admin Control Center
            </h1>
            <p className="text-gray-400">
              Welcome back, <span className="text-white font-medium">{user.name}</span>. Manage your platform operations here.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/add-bike">
              <Button className="bg-[#f7931e] hover:bg-[#e0821a] text-white shadow-lg shadow-orange-500/20">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-white">
          <Card className="bg-neutral-900/50 backdrop-blur-md border-[#f7931e]/20 ring-1 ring-white/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">Total Inventory</p>
                  <h3 className="text-3xl font-bold tracking-tight">
                    {loading ? '...' : stats.totalBikes}
                  </h3>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 shadow-inner">
                  <BikeIcon className="w-6 h-6 text-[#f7931e]" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-400/80">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Inventory active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 backdrop-blur-md border-[#f7931e]/20 ring-1 ring-white/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">Registered Users</p>
                  <h3 className="text-3xl font-bold tracking-tight">
                    {loading ? '...' : stats.totalUsers}
                  </h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 shadow-inner">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-blue-400/80">
                <span>Total platform reach</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 backdrop-blur-md border-[#f7931e]/20 ring-1 ring-white/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">Spare Parts</p>
                  <h3 className="text-3xl font-bold tracking-tight">
                    {loading ? '...' : stats.totalParts}
                  </h3>
                </div>
                <div className="bg-green-400/10 p-3 rounded-xl border border-green-400/20 shadow-inner">
                  <Package className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-400/80">
                <span>Inventory in stock</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Grid */}
        <div className="grid gap-6 md:grid-cols-2 text-white">
          {/* Bikes Management Card */}
          <div className="group bg-neutral-900/50 backdrop-blur-md border border-white/5 hover:border-[#f7931e]/30 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5 ring-1 ring-white/5">
            <div className="bg-orange-500/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-orange-500/20 transition-colors border border-orange-500/10">
              <BikeIcon className="w-8 h-8 text-[#f7931e]" />
            </div>
            <h2 className="font-bold text-2xl mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
              Inventory Management
            </h2>
            <p className="text-gray-400 flex-1 leading-relaxed mb-8">
              Review, edit, and update your bike listings. Ensure your stock information is accurate and visuals are high-quality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                className="border-white/10 hover:bg-white/5 text-white"
                onClick={() => navigate('/buy')}
              >
                Browse Listings
              </Button>
              <Button 
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => navigate('/admin/add-bike')}
              >
                Add New Bike
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Management Card */}
          <div className="group bg-neutral-900/50 backdrop-blur-md border border-white/5 hover:border-blue-400/30 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 ring-1 ring-white/5">
            <div className="bg-blue-500/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="font-bold text-2xl mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
              User Administration
            </h2>
            <p className="text-gray-400 flex-1 leading-relaxed mb-8">
              Manage platform users, update roles, and review account statuses. Keep your platform secure and organized.
            </p>
            <div className="flex">
              <Button 
                variant="outline" 
                className="border-white/10 hover:bg-white/5 text-white w-full sm:w-auto"
                onClick={() => navigate('/admin/users')}
              >
                Access User Table
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Spare Parts Management Card */}
          <div className="group bg-neutral-900/50 backdrop-blur-md border border-white/5 hover:border-green-400/30 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5 ring-1 ring-white/5 md:col-span-2">
            <div className="bg-green-500/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-green-500/20 transition-colors border border-green-500/10">
              <Package className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="font-bold text-2xl mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
              Spare Parts Inventory
            </h2>
            <p className="text-gray-400 flex-1 leading-relaxed mb-8">
              Manage your stock of genuine bike spare parts. Add new items, update prices, and ensure compatibility lists are up to date.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                className="border-white/10 hover:bg-white/5 text-white"
                onClick={() => navigate('/admin/parts')}
              >
                Manage Inventory
              </Button>
              <Button 
                className="bg-[#f7931e] hover:bg-[#e0821a] text-white"
                onClick={() => navigate('/admin/add-part')}
              >
                Add New Spare Part
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

