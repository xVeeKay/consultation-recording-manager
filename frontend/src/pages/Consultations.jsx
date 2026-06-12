import { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  Clock,
  Download,
  Headphones,
  Trash2,
  Loader2,
  FileText,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/api/apiFetch.js";
import { toast } from "sonner";

export default function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch("/consultations")
      .then((res) => setConsultations(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (consultationId) => {
    if (
      !confirm(
        "Are you sure? This will permanently delete the session and its recording.",
      )
    ) {
      return;
    }
    try {
      await apiFetch(`/consultations/${consultationId}`, {
        method: "DELETE",
      });
      setConsultations((prev) => prev.filter((c) => c._id !== consultationId));
      toast.success("Consultation deleted successfully");
    } catch (error) {
      toast.error("Error during deletion: " + error.message);
      console.log(error);
    }
  };

  const getDownloadUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return "";
    return cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  const filteredConsultations = consultations.filter((c) => {
    const searchTerm = search.toLowerCase();
    const customerName = c.customerId?.name?.toLowerCase() || "unknown";
    const title = c.title?.toLowerCase() || "";
    return customerName.includes(searchTerm) || title.includes(searchTerm);
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
              Consultations
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
                  Session Ledger
                  {/* Dynamic Count Badge */}
                  {!loading && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
                      {filteredConsultations.length}{" "}
                      {filteredConsultations.length === 1
                        ? "Session"
                        : "Sessions"}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage notes, track history, and listen to recordings.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer or title..."
                  className="pl-8 bg-muted/20 border-border/50 focus-visible:ring-primary/50 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/40 bg-muted/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-b border-border/40 hover:bg-transparent">
                      <TableHead className="w-[15%]">Customer</TableHead>
                      <TableHead className="w-[20%]">Session Details</TableHead>
                      <TableHead className="w-[25%]">Notes</TableHead>
                      <TableHead className="w-[15%]">Tags</TableHead>
                      <TableHead className="text-right w-[25%] pr-6">
                        Recording & Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-40 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="text-sm font-medium">
                              Loading ledger...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredConsultations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-40 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="h-8 w-8 mb-3 opacity-20" />
                            <span className="text-sm font-medium">
                              No sessions found.
                            </span>
                            {search && (
                              <span className="text-xs opacity-70 mt-1">
                                Adjust your search to find what you're looking
                                for.
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConsultations.map((c) => (
                        <TableRow
                          key={c._id}
                          className="border-b border-border/20 hover:bg-primary/[0.02] transition-colors"
                        >
                          {/* Customer Name */}
                          <TableCell className="font-medium text-primary">
                            {c.customerId?.name || "Unknown"}
                          </TableCell>

                          {/* Combined Session Details */}
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              <span className="font-semibold text-sm text-foreground leading-none">
                                {c.title}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="size-3" />{" "}
                                  {new Date(
                                    c.consultationDate,
                                  ).toLocaleDateString()}
                                </span>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3" /> {c.duration || 0}
                                  m
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Truncated Notes */}
                          <TableCell className="max-w-[200px]">
                            {c.notes ? (
                              <p
                                className="text-xs text-muted-foreground line-clamp-2"
                                title={c.notes}
                              >
                                {c.notes}
                              </p>
                            ) : (
                              <span className="text-xs text-muted-foreground/40 italic">
                                No notes
                              </span>
                            )}
                          </TableCell>

                          {/* Tags */}
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {c.tags?.length > 0 ? (
                                c.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-[10px] text-primary uppercase font-mono tracking-tight"
                                  >
                                    {t}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground/40">
                                  -
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Audio Player & Actions */}
                          <TableCell>
                            <div className="flex items-center justify-end gap-2 pr-2">
                              {c.recordingUrl ? (
                                <>
                                  <audio
                                    controls
                                    controlsList="nodownload noplaybackrate"
                                    className="h-8 w-[180px] grayscale opacity-90 hover:opacity-100 transition-opacity"
                                  >
                                    <source
                                      src={c.recordingUrl}
                                      type="audio/mpeg"
                                    />
                                    Your browser does not support audio.
                                  </audio>

                                  <Separator
                                    orientation="vertical"
                                    className="h-5 mt-2 mx-1 opacity-50"
                                  />

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    asChild
                                    title="Download Audio"
                                  >
                                    <a
                                      href={getDownloadUrl(c.recordingUrl)}
                                      download
                                    >
                                      <Download className="size-4" />
                                    </a>
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 opacity-50 mr-4">
                                  <Headphones className="size-3" /> No Audio
                                </span>
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                onClick={() => handleDelete(c._id)}
                                title="Delete Session"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
