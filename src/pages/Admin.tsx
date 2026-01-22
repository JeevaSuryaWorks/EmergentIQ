import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Shield,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface College {
  id: string;
  name: string;
  country: string;
  state: string | null;
  city: string | null;
  type: string | null;
  website: string | null;
  description: string | null;
  established_year: number | null;
  created_at: string;
}

interface Feedback {
  id: string;
  feedback_type: string | null;
  comment: string | null;
  status: string | null;
  created_at: string;
}

interface Analytics {
  totalColleges: number;
  totalCourses: number;
  totalChats: number;
  pendingFeedback: number;
  totalAdmins: number;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  // Form state for college
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
    type: "public" as "public" | "private" | "community",
    website: "",
    description: "",
    established_year: "",
  });

  // Form state for new admin
  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
      loadColleges(),
      loadFeedback(),
      loadAnalytics(),
      loadAdmins(),
    ]);
    setIsLoading(false);
  };

  const loadColleges = async () => {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load colleges");
    } else {
      setColleges(data || []);
    }
  };

  const loadFeedback = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
    } else {
      setFeedback(data || []);
    }
  };

  const loadAdmins = async () => {
    const { data: adminRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (roleError) {
      console.error(roleError);
      return;
    }

    const adminIds = adminRoles.map((r) => r.user_id);
    if (adminIds.length === 0) {
      setAdmins([]);
      return;
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, full_name, created_at")
      .in("user_id", adminIds);

    if (profileError) {
      console.error(profileError);
    } else {
      setAdmins(
        profiles.map((p) => ({
          id: p.user_id,
          email: "Verified Admin",
          full_name: p.full_name,
          created_at: p.created_at,
        }))
      );
    }
  };

  const loadAnalytics = async () => {
    const [collegesCount, coursesCount, chatsCount, feedbackCount, adminsCount] =
      await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("chat_history").select("id", { count: "exact", head: true }),
        supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin"),
      ]);

    setAnalytics({
      totalColleges: collegesCount.count || 0,
      totalCourses: coursesCount.count || 0,
      totalChats: chatsCount.count || 0,
      pendingFeedback: feedbackCount.count || 0,
      totalAdmins: adminsCount.count || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const collegeData = {
      name: formData.name,
      country: formData.country,
      state: formData.state || null,
      city: formData.city || null,
      type: formData.type,
      website: formData.website || null,
      description: formData.description || null,
      established_year: formData.established_year
        ? parseInt(formData.established_year)
        : null,
    };

    if (editingCollege) {
      const { error } = await supabase
        .from("colleges")
        .update(collegeData)
        .eq("id", editingCollege.id);

      if (error) {
        toast.error("Failed to update college");
        console.error(error);
      } else {
        toast.success("College updated successfully");
        loadColleges();
        closeModal();
      }
    } else {
      const { error } = await supabase.from("colleges").insert(collegeData);

      if (error) {
        toast.error("Failed to create college");
        console.error(error);
      } else {
        toast.success("College created successfully");
        loadColleges();
        loadAnalytics();
        closeModal();
      }
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("add-admin", {
        body: {
          email: adminFormData.email,
          password: adminFormData.password,
          fullName: adminFormData.fullName,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to create admin");
      } else {
        toast.success("Admin created successfully");
        setIsAdminModalOpen(false);
        setAdminFormData({ email: "", password: "", fullName: "" });
        loadAdmins();
        loadAnalytics();
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;

    const { error } = await supabase.from("colleges").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete college");
      console.error(error);
    } else {
      toast.success("College deleted");
      loadColleges();
      loadAnalytics();
    }
  };

  const openEditModal = (college: College) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      country: college.country,
      state: college.state || "",
      city: college.city || "",
      type: (college.type as "public" | "private" | "community") || "public",
      website: college.website || "",
      description: college.description || "",
      established_year: college.established_year?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollege(null);
    setFormData({
      name: "",
      country: "",
      state: "",
      city: "",
      type: "public",
      website: "",
      description: "",
      established_year: "",
    });
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("feedback")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update feedback");
    } else {
      toast.success("Feedback status updated");
      loadFeedback();
      loadAnalytics();
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Admin Dashboard</h1>
          <p className="text-white/40">Manage university data and user interactions.</p>
        </div>
      </div>

      <div>
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalColleges}</p>
                    <p className="text-sm text-muted-foreground">Colleges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalCourses}</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalChats}</p>
                    <p className="text-sm text-muted-foreground">Chat Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalAdmins}</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="colleges">
          <TabsList className="mb-6">
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="colleges">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Manage Colleges</CardTitle>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => closeModal()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add College
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCollege ? "Edit College" : "Add New College"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) =>
                              setFormData({ ...formData, country: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({ ...formData, state: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                type: value as "public" | "private" | "community",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="community">Community</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="established_year">Established Year</Label>
                          <Input
                            id="established_year"
                            type="number"
                            value={formData.established_year}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                established_year: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) =>
                            setFormData({ ...formData, website: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={closeModal}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingCollege ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colleges.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No colleges yet. Add your first college!
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      colleges.map((college) => (
                        <TableRow key={college.id}>
                          <TableCell className="font-medium">
                            {college.name}
                          </TableCell>
                          <TableCell>
                            {[college.city, college.state, college.country]
                              .filter(Boolean)
                              .join(", ")}
                          </TableCell>
                          <TableCell className="capitalize">
                            {college.type || "—"}
                          </TableCell>
                          <TableCell>
                            {new Date(college.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(college)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(college.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="text-white">User Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No feedback yet</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      feedback.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge
                              variant={
                                item.feedback_type === "positive"
                                  ? "default"
                                  : item.feedback_type === "negative"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {item.feedback_type || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {item.comment || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "resolved"
                                  ? "default"
                                  : item.status === "reviewed"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.status || "pending"}
                              onValueChange={(value) =>
                                updateFeedbackStatus(item.id, value)
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Manage Admins</CardTitle>
                <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdminSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminEmail">Email Address *</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          placeholder="admin@example.com"
                          value={adminFormData.email}
                          onChange={(e) =>
                            setAdminFormData({ ...adminFormData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminPassword">Password *</Label>
                        <Input
                          id="adminPassword"
                          type="password"
                          placeholder="••••••••"
                          value={adminFormData.password}
                          onChange={(e) =>
                            setAdminFormData({ ...adminFormData, password: e.target.value })
                          }
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminName">Full Name</Label>
                        <Input
                          id="adminName"
                          type="text"
                          placeholder="John Doe"
                          value={adminFormData.fullName}
                          onChange={(e) =>
                            setAdminFormData({ ...adminFormData, fullName: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAdminModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Admin"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <p className="text-muted-foreground">No admins found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      admins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">
                            {admin.full_name || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Admin</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(admin.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
