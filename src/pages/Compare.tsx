import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, Share2, Loader2, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const BookmarkButton = ({ collegeId }: { collegeId: string }) => {
  const { isBookmarked, isLoading, toggleBookmark } = useBookmarks(collegeId);
  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      className="w-full gap-2 h-8"
      onClick={toggleBookmark}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck className="h-3 w-3" />
      ) : (
        <Bookmark className="h-3 w-3" />
      )}
      {isBookmarked ? "Saved" : "Save"}
    </Button>
  );
};

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

interface Ranking {
  ranking_body: string;
  rank_position: number;
  year: number;
}

interface Fee {
  fee_type: string;
  amount: number;
  currency: string;
  per_period: string;
}

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
  student_count: number | null;
  acceptance_rate: number | null;
  logo_url?: string | null;
  rankings?: Ranking[];
  fees?: Fee[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialColleges = async () => {
      const ids = searchParams.get("ids")?.split(",") || [];
      if (ids.length > 0) {
        const { data, error } = await supabase
          .from("colleges")
          .select("*, rankings:college_rankings(*), fees:college_fees(*)")
          .in("id", ids);

        if (!error && data) {
          setSelectedColleges(data as unknown as College[]);
        } else if (error) {
          console.error("Fetch Initial Error:", error.message);
        }
      }
      setIsLoading(false);
    };

    fetchInitialColleges();
  }, [searchParams]);

  const searchColleges = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const { data, error } = await supabase
      .from("colleges")
      .select("*, rankings:college_rankings(*), fees:college_fees(*)")
      .ilike("name", `%${query}%`)
      .limit(5);

    if (!error && data) {
      setSearchResults(data as unknown as College[]);
    } else if (error) {
      console.error("Search Error:", error.message);
    }
    setIsSearching(false);
  };

  const addCollege = (college: College) => {
    if (selectedColleges.length >= 5) {
      toast.error("You can compare up to 5 colleges");
      return;
    }
    if (selectedColleges.some((c) => c.id === college.id)) {
      toast.error("College already added");
      return;
    }
    const newColleges = [...selectedColleges, college];
    setSelectedColleges(newColleges);
    setSearchResults([]);
    setSearchQuery("");

    const ids = newColleges.map((c) => c.id).join(",");
    setSearchParams({ ids });
  };

  const removeCollege = (id: string) => {
    const newColleges = selectedColleges.filter((c) => c.id !== id);
    setSelectedColleges(newColleges);

    if (newColleges.length > 0) {
      const ids = newColleges.map((c) => c.id).join(",");
      setSearchParams({ ids });
    } else {
      setSearchParams({});
    }
  };

  const shareComparison = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Comparison link copied to clipboard");
  };

  const getLatestRanking = (college: College) => {
    if (!college.rankings?.length) return null;
    return college.rankings.reduce((latest, current) =>
      current.year > latest.year ? current : latest
    );
  };

  const getTuitionFee = (college: College) => {
    const tuition = college.fees?.find((f) => f.fee_type === "tuition" || f.fee_type === "Tuition");
    if (!tuition) return "N/A";
    const amount = typeof tuition.amount === 'number' ? tuition.amount.toLocaleString() : tuition.amount;
    return `${tuition.currency || '₹'} ${amount}/${tuition.per_period || 'year'}`;
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-xl">
          <p className="text-white font-medium text-sm mb-1">{label}</p>
          <p className="text-primary text-sm">
            {payload[0].value?.toLocaleString()}
            {payload[0].name === "Acceptance Rate" ? "%" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = selectedColleges.map((college) => ({
    name: college.name,
    student_count: college.student_count || 0,
    acceptance_rate: college.acceptance_rate || 0,
  }));

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-32">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 md:px-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 text-white">Compare Colleges</h1>
            <p className="text-white/40 text-xs md:text-sm">Benchmarking global institutions for your future.</p>
          </div>
          {selectedColleges.length > 0 && (
            <Button variant="outline" onClick={shareComparison} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 h-10 md:h-11 px-4 md:px-6 w-full sm:w-auto text-xs md:text-sm transition-all">
              <Share2 className="h-4 w-4 mr-2" />
              Share Comparison
            </Button>
          )}
        </div>

        <section>
          {/* Search Section */}
          <Card className="mb-6 md:mb-8 bg-white/5 border-white/10 overflow-visible relative mx-2 md:mx-0">
            <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg text-white">
                Add Colleges to Compare (2-5)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  placeholder="Search colleges by name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchColleges(e.target.value);
                  }}
                  className="pl-10 bg-black/20 border-white/10 h-12"
                />
                {(searchResults.length > 0 || isSearching || searchQuery.trim().length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-auto z-50 backdrop-blur-xl">
                    {isSearching ? (
                      <div className="p-4 text-center text-white/30">
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((college) => (
                        <button
                          key={college.id}
                          onClick={() => addCollege(college)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between transition-colors border-b border-white/5 last:border-0"
                        >
                          <div>
                            <div className="font-medium text-white">{college.name}</div>
                            <div className="text-sm text-white/40">
                              {college.city}, {college.country}
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-primary" />
                        </button>
                      ))
                    ) : (
                      <div className="p-2">
                        <button
                          onClick={() => navigate(`/chat?initialMessage=Tell me details about ${encodeURIComponent(searchQuery)}`)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between transition-colors rounded-lg group"
                        >
                          <div>
                            <div className="font-medium text-white">College not found?</div>
                            <div className="text-sm text-primary group-hover:underline">
                              Chat with Emily about "{searchQuery}"
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-xs">AI</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected colleges badges */}
              {selectedColleges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedColleges.map((college) => (
                    <Badge
                      key={college.id}
                      variant="secondary"
                      className="text-sm py-2 px-4 rounded-full bg-white/10 text-white border-white/10"
                    >
                      {college.name}
                      <button
                        onClick={() => removeCollege(college.id)}
                        className="ml-2 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comparison Table */}
          {selectedColleges.length >= 2 ? (
            <div className="flex flex-col gap-12">
              {/* Metric Comparison Charts (Recharts) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-0">
                <Card className="bg-white/5 border-white/10 p-4 md:p-6">
                  <h3 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-widest mb-4 md:mb-6 leading-none">Acceptance Rate (%)</h3>
                  <div className="h-48 md:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#ffffff40"
                          tick={{ fill: '#ffffff40', fontSize: 10 }}
                          tickFormatter={(value) => value.split(' ')[0]}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#ffffff40"
                          tick={{ fill: '#ffffff40', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                        <Bar dataKey="acceptance_rate" name="Acceptance Rate" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-4 md:p-6">
                  <h3 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-widest mb-4 md:mb-6 leading-none">Total Students</h3>
                  <div className="h-48 md:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#ffffff40"
                          tick={{ fill: '#ffffff40', fontSize: 10 }}
                          tickFormatter={(value) => value.split(' ')[0]}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#ffffff40"
                          tick={{ fill: '#ffffff40', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                        <Bar dataKey="student_count" name="Students" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden mx-2 md:mx-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-6 bg-white/5 font-bold uppercase tracking-widest text-[10px] text-white/40 min-w-[150px]">
                          Attribute
                        </th>
                        {selectedColleges.map((college) => (
                          <th
                            key={college.id}
                            className="text-left p-6 bg-white/5 font-bold min-w-[250px]"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-start justify-between">
                                <span className="text-lg tracking-tight leading-tight text-white">{college.name}</span>
                                <button
                                  onClick={() => removeCollege(college.id)}
                                  className="text-white/20 hover:text-red-400 transition-colors"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                              <BookmarkButton collegeId={college.id} />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-white/5">
                        <td className="p-6 font-semibold text-white/60">Location</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6 text-white/80">
                            {[college.city, college.state, college.country]
                              .filter(Boolean)
                              .join(", ")}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <td className="p-6 font-semibold text-white/60">Type</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6 text-white/80 capitalize">
                            {college.type || "N/A"}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-6 font-semibold text-white/60">Established</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6 text-white/80">
                            {college.established_year || "N/A"}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <td className="p-6 font-semibold text-white/60">Students</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6 text-white/80">
                            {college.student_count?.toLocaleString() || "N/A"}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-6 font-semibold text-white/60">Acceptance</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6 text-white/80">
                            {college.acceptance_rate
                              ? `${college.acceptance_rate}%`
                              : "N/A"}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <td className="p-6 font-semibold text-white/60">Global Rank</td>
                        {selectedColleges.map((college) => {
                          const ranking = getLatestRanking(college);
                          return (
                            <td key={college.id} className="p-6 text-white/80">
                              {ranking
                                ? `#${ranking.rank_position} (${ranking.ranking_body} ${ranking.year})`
                                : "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-6 font-semibold text-white/60">Tuition Fee</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6 text-white/80">
                            {getTuitionFee(college)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-6 font-semibold text-white/60">Platform</td>
                        {selectedColleges.map((college) => (
                          <td key={college.id} className="p-6">
                            {college.website ? (
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:primary/80 underline underline-offset-4"
                              >
                                Academic Portal
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <Card className="text-center py-20 bg-white/5 border-white/10 rounded-[2rem]">
              <CardContent>
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChartIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-xl font-medium text-white mb-2">
                  {selectedColleges.length === 0
                    ? "Search and add at least 2 colleges to compare"
                    : "Add one more college to start comparing"}
                </p>
                <p className="text-sm text-white/30 max-w-xs mx-auto">
                  Our AI-driven benchmarking tool helps you evaluate multiple institutions across key performance indicators.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </ScrollArea>
  );
};

export default Compare;
