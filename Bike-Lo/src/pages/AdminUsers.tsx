import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { listUsersApi, deleteUserApi, updateUserApi, createUserApi } from "@/services/authService";
import type { UserResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Trash2, 
  Edit3, 
  ChevronLeft,
  Shield,
  User as UserIcon,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    status: "active",
  });

  const loadUsers = () => {
    setLoading(true);
    listUsersApi()
      .then(setUsers)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load users";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const handleDelete = async (u: UserResponse) => {
    try {
      await deleteUserApi(u.id);
      setUsers(users.filter(x => x.id !== u.id));
      toast.success(`User ${u.name} deleted successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(null);
    }
  };

  const openEdit = (u: UserResponse) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: "",
      phone: u.phone,
      role: u.role,
      status: u.status,
    });
    setIsEditOpen(true);
  };

  const openAdd = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
      status: "active",
    });
    setIsAddOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const updated = await updateUserApi(editingUser.id, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      });
      setUsers(users.map(u => (u.id === updated.id ? updated : u)));
      setIsEditOpen(false);
      toast.success("User updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to edit user");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createUserApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      });
      setUsers([...users, created]);
      setIsAddOpen(false);
      toast.success("User created successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const filteredUsers = users
    .filter((u) => u.role !== "admin")
    .filter((u) => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen px-4 py-24 bg-transparent">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/admin")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 
                className="text-4xl font-bold text-white mb-2" 
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                User Control Center
              </h1>
              <p className="text-gray-400">Manage platform access, roles, and administrative statuses.</p>
            </div>
          </div>
          <Button 
            onClick={openAdd}
            className="bg-[#f7931e] hover:bg-[#e0821a] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-orange-500/20"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Provision New User
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-neutral-900/50 backdrop-blur-md border-white/10 text-white placeholder:text-gray-500 rounded-2xl focus:ring-[#f7931e]/50"
            />
          </div>
          <div className="flex items-center gap-3 bg-neutral-900/50 backdrop-blur-md border border-white/10 px-6 rounded-2xl">
            <Filter className="w-5 h-5 text-[#f7931e]" />
            <span className="text-sm font-medium text-gray-300">
              Showing {filteredUsers.length} of {users.filter(u => u.role !== 'admin').length} users
            </span>
          </div>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#f7931e]/30 border-t-[#f7931e] rounded-full animate-spin" />
            <p className="text-gray-400 font-medium">Synchronizing User Records...</p>
          </div>
        ) : error && users.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Syncrhonization Failure</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <Button onClick={loadUsers} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
              Retry Connection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <Card 
                  key={u.id} 
                  className="bg-neutral-900/50 backdrop-blur-md border-white/5 hover:border-[#f7931e]/30 transition-all duration-300 group overflow-hidden ring-1 ring-white/5 shadow-2xl"
                >
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#f7931e]/10 border border-[#f7931e]/20 flex items-center justify-center text-[#f7931e]">
                          {u.role === 'admin' ? <Shield className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white group-hover:text-[#f7931e] transition-colors">{u.name}</CardTitle>
                          <Badge 
                            className={`mt-1 capitalize ${
                              u.status === 'active' 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}
                          >
                            {u.status}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-gray-300 uppercase tracking-wider text-[10px]">
                        {u.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{u.phone || 'No phone recorded'}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex items-center gap-3 border-t border-white/5">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEdit(u)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsDeleting(u.id)}
                        className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Revoke Access
                      </Button>
                    </div>
                  </CardContent>

                  {/* Inline Delete Confirmation */}
                  {isDeleting === u.id && (
                    <div className="absolute inset-0 z-10 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                      <div className="bg-red-500/20 p-3 rounded-full border border-red-500/30 mb-4 text-red-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">Confirm Revocation?</h4>
                      <p className="text-gray-400 text-sm mb-6">This will permanently remove <strong>{u.name}</strong> from the platform data.</p>
                      <div className="flex items-center gap-3 w-full">
                        <Button 
                          variant="destructive" 
                          className="flex-1 h-11 font-bold"
                          onClick={() => handleDelete(u)}
                        >
                          Confirm
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="flex-1 h-11 text-gray-300 hover:text-white bg-white/5"
                          onClick={() => setIsDeleting(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-gray-600">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>No Personnel Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">No user records matches your search criteria. Try refining your keywords.</p>
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="text-[#f7931e] mt-4 hover:text-[#e0821a]"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen} title="Manage User Permissions">
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-400">Display Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Communication Node (Phone)</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Platform Responsibility (Role)</Label>
              <select
                className="flex h-12 w-full rounded-md border border-white/10 bg-neutral-800 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#f7931e]/50 outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">Standard Agent</option>
                <option value="admin">Platform Director (Admin)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Account Operational Status</Label>
              <select
                className="flex h-12 w-full rounded-md border border-white/10 bg-neutral-800 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#f7931e]/50 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active & Authorized</option>
                <option value="inactive">Suspended / Deactivated</option>
              </select>
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-[#f7931e] hover:bg-[#e0821a] text-white font-bold h-12 shadow-lg shadow-orange-500/20">
              Authorize Personnel Profile
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen} title="Initialize New Personnel Profile">
        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-400">Full Operational Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: John Doe"
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Contact Identifier (Email)</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="johndoe@example.com"
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Access Key (Password)</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="********"
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Direct Secondary Node (Phone)</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Clearance Level (Role)</Label>
              <select
                className="flex h-12 w-full rounded-md border border-white/10 bg-neutral-800 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#f7931e]/50 outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">Standard Agent</option>
                <option value="admin">Platform Director (Admin)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Initial Activation Status</Label>
              <select
                className="flex h-12 w-full rounded-md border border-white/10 bg-neutral-800 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#f7931e]/50 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active Entry</option>
                <option value="inactive">Initialize as Suspended</option>
              </select>
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-[#f7931e] hover:bg-[#e0821a] text-white font-bold h-12 shadow-lg shadow-orange-500/20">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Finalize Personnel Record
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

