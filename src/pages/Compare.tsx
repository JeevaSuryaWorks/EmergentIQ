import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Search, Share2, Loader2 } from "lucide-react";
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
  student_count: number | null;
  acceptance_rate: number | null;
  rankings: Array<{
    ranking_body: string;
    rank_position: number;
    year: number;
  }>;
  fees: Array<{
    fee_type: string;
    amount: number;
    currency: string;
    per_period: string;
  }>;
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load colleges from URL params on mount
  useEffect(() => {
    const collegeIds = searchParams.get("colleges")?.split(",").filter(Boolean) || [];
    if (collegeIds.length > 0) {
      loadColleges(collegeIds);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadColleges = async (ids: string[]) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("colleges")
      .select(`
        *,
        rankings (*),
        fees (*)
      `)
      .in("id", ids);

    if (error) {
      toast.error("Failed to load colleges");
      console.error(error);
    } else if (data) {
      setSelectedColleges(data as unknown as College[]);
    }
    setIsLoading(false);
  };

  const searchColleges = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const { data, error } = await supabase
      .from("colleges")
      .select(`*, rankings (*), fees (*)`)
      .ilike("name", `%${query}%`)
      .limit(10);

    if (error) {
      console.error(error);
    } else {
      const filtered = (data || []).filter(
        (c) => !selectedColleges.find((s) => s.id === c.id)
      );
      setSearchResults(filtered as unknown as College[]);
    }
    setIsSearching(false);
  };

  const addCollege = (college: College) => {
    if (selectedColleges.length >= 5) {
      toast.error("Maximum 5 colleges can be compared");
      return;
    }
    const newColleges = [...selectedColleges, college];
    setSelectedColleges(newColleges);
    updateUrlParams(newColleges);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeCollege = (id: string) => {
    const newColleges = selectedColleges.filter((c) => c.id !== id);
    setSelectedColleges(newColleges);
    updateUrlParams(newColleges);
  };

  const updateUrlParams = (colleges: College[]) => {
    if (colleges.length > 0) {
      setSearchParams({ colleges: colleges.map((c) => c.id).join(",") });
    } else {
      setSearchParams({});
    }
  };

  const shareComparison = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Comparison link copied to clipboard!");
  };

  const getLatestRanking = (college: College) => {
    if (!college.rankings?.length) return null;
    return college.rankings.reduce((latest, current) =>
      current.year > latest.year ? current : latest
    );
  };

  const getTuitionFee = (college: College) => {
    const tuition = college.fees?.find((f) => f.fee_type === "tuition");
    if (!tuition) return "N/A";
    return `${tuition.currency} ${tuition.amount.toLocaleString()}/${tuition.per_period}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
            <h1 className="text-xl font-semibold">Compare Colleges</h1>
          </div>
          {selectedColleges.length > 0 && (
            <Button variant="outline" onClick={shareComparison}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              Add Colleges to Compare (2-5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges by name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchColleges(e.target.value);
                }}
                className="pl-10"
              />
              {(searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto z-10">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : (
                    searchResults.map((college) => (
                      <button
                        key={college.id}
                        onClick={() => addCollege(college)}
                        className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{college.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {college.city}, {college.country}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-primary" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected colleges badges */}
            {selectedColleges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedColleges.map((college) => (
                  <Badge
                    key={college.id}
                    variant="secondary"
                    className="text-sm py-1.5 px-3"
                  >
                    {college.name}
                    <button
                      onClick={() => removeCollege(college.id)}
                      className="ml-2 hover:text-destructive"
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-muted font-medium text-muted-foreground">
                    Attribute
                  </th>
                  {selectedColleges.map((college) => (
                    <th
                      key={college.id}
                      className="text-left p-4 bg-muted font-medium min-w-[200px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>{college.name}</span>
                        <button
                          onClick={() => removeCollege(college.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Location</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      {[college.city, college.state, college.country]
                        .filter(Boolean)
                        .join(", ")}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-4 font-medium">Type</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4 capitalize">
                      {college.type || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Established</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      {college.established_year || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-4 font-medium">Students</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      {college.student_count?.toLocaleString() || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Acceptance Rate</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      {college.acceptance_rate
                        ? `${college.acceptance_rate}%`
                        : "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-4 font-medium">Ranking</td>
                  {selectedColleges.map((college) => {
                    const ranking = getLatestRanking(college);
                    return (
                      <td key={college.id} className="p-4">
                        {ranking
                          ? `#${ranking.rank_position} (${ranking.ranking_body} ${ranking.year})`
                          : "N/A"}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Tuition Fee</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      {getTuitionFee(college)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-4 font-medium">Website</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      {college.website ? (
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Site
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
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {selectedColleges.length === 0
                  ? "Search and add at least 2 colleges to compare"
                  : "Add one more college to start comparing"}
              </p>
              {selectedColleges.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Use the search box above to find colleges
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
