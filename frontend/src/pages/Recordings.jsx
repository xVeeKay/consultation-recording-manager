import { useEffect, useState } from "react";
import {
  Search,
  Mic,
  Download,
  Trash2,
  UploadCloud,
  Headphones,
  Loader2,
  CalendarDays,
  User,
  Activity,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar.jsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/api/apiFetch.js";
import { toast } from "sonner";
import { SpinnerCustom } from "@/components/ui/spinner.jsx";

export default function Recordings() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // New State for the Segmented Filter
  const [filter, setFilter] = useState("all"); // 'all' | 'uploaded' | 'missing'

  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    apiFetch("/consultations")
      .then((res) => setConsultations(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (consultationId) => {
    if (
      !confirm(
        "Are you sure? This will permanently delete the session and its audio.",
      )
    )
      return;

    try {
      await apiFetch(`/consultations/${consultationId}`, { method: "DELETE" });
      setConsultations((prev) => prev.filter((c) => c._id !== consultationId));
      toast.success("Recording deleted successfully");
    } catch (error) {
      toast.error("Error deleting recording");
    }
  };

  const handleFileUpload = async (event, consultationId) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingId(consultationId);
    const formData = new FormData();
    formData.append("recording", file);

    try {
      const res = await apiFetch(`/consultations/${consultationId}/upload`, {
        method: "POST",
        body: formData,
      });

      setConsultations((prev) =>
        prev.map((c) => (c._id === consultationId ? res.data : c)),
      );
      toast.success("Recording uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload recording.");
      console.error(error);
    } finally {
      setUploadingId(null);
    }
  };

  const getDownloadUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return "";
    return cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  const total = consultations.length;
  const uploaded = consultations.filter((c) => c.recordingUrl).length;
  const pending = total - uploaded;

  // Upgraded Filter Logic: Handles both the segmented control AND the search bar
  const filteredConsultations = consultations.filter((c) => {
    // 1. Text Search Check
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      c.title?.toLowerCase().includes(searchTerm) ||
      c.customerId?.name?.toLowerCase().includes(searchTerm);

    // 2. Status Filter Check
    if (filter === "uploaded") return matchesSearch && c.recordingUrl;
    if (filter === "missing") return matchesSearch && !c.recordingUrl;

    // Default: 'all'
    return matchesSearch;
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur z-10 sticky top-0 rounded-t-xl">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 mt-[0.35rem] h-4"
            />
            <span className="text-sm font-medium text-foreground">
              Recordings Library
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header Area */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Recordings Library
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage, upload, and listen to all your consultation audio.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/5 border-border/40 shadow-sm rounded-xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-semibold mt-1.5 text-foreground">
                      {loading ? "-" : total}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="size-5 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/5 border-border/40 shadow-sm rounded-xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Uploaded
                    </p>
                    <p className="text-2xl font-semibold mt-1.5 text-emerald-500/90">
                      {loading ? "-" : uploaded}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Headphones className="size-5 text-emerald-500/90" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/5 border-border/40 shadow-sm rounded-xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Pending Uploads
                    </p>
                    <p className="text-2xl font-semibold mt-1.5 text-amber-500/90">
                      {loading ? "-" : pending}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <UploadCloud className="size-5 text-amber-500/90" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table Controls: Segmented Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              {/* Premium Segmented Control */}
              <div className="flex items-center p-1 bg-muted/20 border border-border/50 rounded-lg">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    filter === "all"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("uploaded")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    filter === "uploaded"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  Uploaded
                </button>
                <button
                  onClick={() => setFilter("missing")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    filter === "missing"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  Missing
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recordings..."
                  className="pl-8 bg-muted/20 border-border/50 focus-visible:ring-primary/50 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Continuous List Layout */}
            <div className="rounded-xl border border-border/40 bg-muted/5 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mb-3" />
                  <p className="text-sm">Loading library...</p>
                </div>
              ) : filteredConsultations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center">
                  <Mic className="h-10 w-10 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No recordings found</p>
                  <p className="text-xs opacity-70 mt-1">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredConsultations.map((c) => (
                    <div
                      key={c._id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-border/20 last:border-0 hover:bg-primary/[0.02] transition-colors"
                    >
                      {/* Left Side: Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mic className="size-4 text-primary" />
                        </div>
                        <div className="truncate">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {c.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1 truncate">
                              <User className="size-3" />{" "}
                              {c.customerId?.name || "Unknown"}
                            </span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1 shrink-0">
                              <CalendarDays className="size-3" />{" "}
                              {new Date(
                                c.consultationDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Actions */}
                      <div className="flex items-center justify-end gap-3 shrink-0">
                        {c.recordingUrl ? (
                          <>
                            <audio
                              controls
                              controlsList="nodownload noplaybackrate"
                              className="h-8 w-[200px] grayscale opacity-90 hover:opacity-100 transition-opacity hidden sm:block"
                            >
                              <source src={c.recordingUrl} type="audio/mpeg" />
                            </audio>

                            <Separator
                              orientation="vertical"
                              className="h-5 mx-1 opacity-50 hidden sm:block"
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-primary/20 hover:bg-primary/10 hover:text-primary"
                              asChild
                            >
                              <a href={getDownloadUrl(c.recordingUrl)} download>
                                <Download className="size-3.5 mr-1.5" />{" "}
                                Download
                              </a>
                            </Button>
                          </>
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              id={`upload-${c._id}`}
                              className="hidden"
                              accept="audio/*"
                              onChange={(e) => handleFileUpload(e, c._id)}
                              disabled={uploadingId === c._id}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
                              asChild
                            >
                              <label
                                htmlFor={`upload-${c._id}`}
                                className="cursor-pointer"
                              >
                                {uploadingId === c._id ? (
                                  <>
                                    <SpinnerCustom /> Uploading...
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="size-3.5 mr-1.5" />{" "}
                                    Upload Audio
                                  </>
                                )}
                              </label>
                            </Button>
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(c._id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
    