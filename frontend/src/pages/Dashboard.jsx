import { useEffect, useState } from "react";
import {
  Users,
  Sparkles,
  Mic,
  Clock,
  CalendarDays,
  User,
  FileText,
} from "lucide-react";

import { AppSidebar } from "@/components/dashboard/app-sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar.jsx";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/api/apiFetch.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden bg-background">
        {/* Sticky Glassmorphism Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur z-10 sticky top-0 rounded-t-xl">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 mt-[0.35rem] h-4"
            />
            <span className="text-sm font-medium text-foreground">
              Dashboard
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Overview
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your high-level metrics and recent client activity.
              </p>
            </div>

            {/* Stats Cards Section */}
            <div className="grid gap-4 md:grid-cols-3">
              {loading ? (
                /* Stats Skeleton State */
                [1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="bg-card/50 border-border/40 shadow-sm rounded-xl animate-pulse"
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-muted-foreground/10 rounded w-24" />
                        <div className="h-7 bg-muted-foreground/20 rounded w-14" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-muted-foreground/10" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                /* Active Stats State */
                <>
                  <Card className="bg-card/50 border-border/40 shadow-sm rounded-xl">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total Customers
                        </p>
                        <p className="text-2xl font-semibold mt-1.5 text-foreground">
                          {data?.totalCustomers || 0}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="size-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/40 shadow-sm rounded-xl">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total Consultations
                        </p>
                        <p className="text-2xl font-semibold mt-1.5 text-foreground">
                          {data?.totalConsultations || 0}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="size-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/40 shadow-sm rounded-xl">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total Recordings
                        </p>
                        <p className="text-2xl font-semibold mt-1.5 text-foreground">
                          {data?.totalRecordings || 0}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mic className="size-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Recent Consultations Table Area */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Recent Consultations
              </h2>

              <div className="rounded-xl border border-border/40 bg-card/30 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow className="border-b border-border/40 hover:bg-transparent">
                        <TableHead className="w-[30%] font-medium">
                          Session Title
                        </TableHead>
                        <TableHead className="w-[20%] font-medium">
                          Customer
                        </TableHead>
                        <TableHead className="w-[15%] font-medium">
                          Duration
                        </TableHead>
                        <TableHead className="w-[15%] font-medium">
                          Date
                        </TableHead>
                        <TableHead className="w-[20%] font-medium">
                          Tags
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading ? (
                        /* Table Body Skeleton State */
                        [1, 2, 3, 4, 5].map((i) => (
                          <TableRow
                            key={i}
                            className="border-b border-border/10 animate-pulse hover:bg-transparent"
                          >
                            {/* Title Skeleton */}
                            <TableCell className="py-4">
                              <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                            </TableCell>
                            {/* Customer Skeleton */}
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-3.5 w-3.5 rounded-full bg-muted-foreground/10 shrink-0" />
                                <div className="h-3.5 bg-muted-foreground/10 rounded w-24" />
                              </div>
                            </TableCell>
                            {/* Duration Skeleton */}
                            <TableCell className="py-4">
                              <div className="flex items-center gap-1.5">
                                <div className="h-3.5 w-3.5 rounded-full bg-muted-foreground/10 shrink-0" />
                                <div className="h-3.5 bg-muted-foreground/10 rounded w-10" />
                              </div>
                            </TableCell>
                            {/* Date Skeleton */}
                            <TableCell className="py-4">
                              <div className="flex items-center gap-1.5">
                                <div className="h-3.5 w-3.5 rounded-full bg-muted-foreground/10 shrink-0" />
                                <div className="h-3.5 bg-muted-foreground/10 rounded w-20" />
                              </div>
                            </TableCell>
                            {/* Tags Skeleton */}
                            <TableCell className="py-4">
                              <div className="flex gap-1.5">
                                <div className="h-5 bg-muted-foreground/10 rounded w-12" />
                                <div className="h-5 bg-muted-foreground/10 rounded w-14" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : !data?.recentConsultations ||
                        data.recentConsultations.length === 0 ? (
                        /* Empty Data State */
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-8 w-8 mb-3 opacity-20" />
                              <span className="text-sm font-medium">
                                No recent consultations found.
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        /* Content Render State */
                        data.recentConsultations.map((c) => (
                          <TableRow
                            key={c._id}
                            className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                          >
                            {/* Title */}
                            <TableCell className="font-medium text-foreground">
                              {c.title}
                            </TableCell>

                            {/* Customer */}
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="size-3.5" />
                                {c.customerId
                                  ? c.customerId.name
                                  : "Deleted User"}
                              </div>
                            </TableCell>

                            {/* Duration */}
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="size-3.5" />
                                {c.duration ? `${c.duration}m` : "Unknown"}
                              </div>
                            </TableCell>

                            {/* Date */}
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CalendarDays className="size-3.5" />
                                {formatDate(c.consultationDate || c.date)}
                              </div>
                            </TableCell>

                            {/* Tags */}
                            <TableCell>
                              {c.tags && c.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {c.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-[10px] text-primary uppercase font-mono tracking-tight"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/40 italic">
                                  No tags
                                </span>
                              )}
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
