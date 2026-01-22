import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Globe, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

interface CollegeCardProps {
    college: {
        id: string;
        name: string;
        country: string;
        city: string | null;
        type: string | null;
        website: string | null;
        logo_url?: string | null;
    };
}

export const CollegeCard = ({ college }: CollegeCardProps) => {
    const { isBookmarked, isLoading, toggleBookmark } = useBookmarks(college.id);

    return (
        <Card className="overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 border-white/5 bg-white/[0.03] backdrop-blur-xl group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-xl text-white break-words">{college.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-white/40 mt-2 transition-colors group-hover:text-white/60">
                            <MapPin className="w-3 h-3 text-primary/60" />
                            <span>{college.city ? `${college.city}, ` : ""}{college.country}</span>
                        </div>
                    </div>
                    {college.logo_url ? (
                        <img src={college.logo_url} alt={college.name} className="w-12 h-12 rounded-lg object-contain bg-white p-1" />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                {college.type && (
                    <Badge variant="outline" className="capitalize bg-white/5 border-white/10 text-white/60 hover:text-white transition-colors">
                        {college.type}
                    </Badge>
                )}
            </CardContent>

            <CardFooter className="pt-2 flex justify-between gap-3 relative z-10">
                {college.website && (
                    <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all" asChild>
                        <a href={college.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4" />
                            Portal
                        </a>
                    </Button>
                )}
                <Button
                    variant={isBookmarked ? "default" : "outline"}
                    size="sm"
                    className={cn(
                        "gap-2 rounded-xl px-4 transition-all duration-300",
                        isBookmarked
                            ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                            : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    )}
                    onClick={toggleBookmark}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                    ) : (
                        <Bookmark className="w-4 h-4" />
                    )}
                    {isBookmarked ? "Saved" : "Save"}
                </Button>
            </CardFooter>
        </Card>
    );
};
