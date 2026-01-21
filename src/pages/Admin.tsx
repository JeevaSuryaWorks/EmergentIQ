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
}

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    await Promise.all([loadColleges(), loadFeedback(), loadAnalytics()]);
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

  const loadAnalytics = async () => {
    const [collegesCount, coursesCount, chatsCount, feedbackCount] =
      await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("chat_history").select("id", { count: "exact", head: true }),
        supabase
          .from("feedback")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

    setAnalytics({
      totalColleges: collegesCount.count || 0,
      totalCourses: coursesCount.count || 0,
      totalChats: chatsCount.count || 0,
      pendingFeedback: feedbackCount.count || 0,
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
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
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.pendingFeedback}</p>
                    <p className="text-sm text-muted-foreground">Pending Feedback</p>
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
          </TabsList>

          <TabsContent value="colleges">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Colleges</CardTitle>
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
                <CardTitle>User Feedback</CardTitle>
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
        </Tabs>
      </main>
    </div>
  );
}
