import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
  FileText,
  MoreHorizontal,
  Inbox,
  ArrowLeft,
} from "lucide-react";

import { AppSidebar } from "@/components/dashboard/app-sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { CreateCustomerDialog } from "@/components/CreateCustomerDialog.jsx";
import { CreateConsultationDialog } from "@/components/CreateConsultationDialog.jsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar.jsx";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/api/apiFetch.js";
import { toast } from "sonner";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadinghistory,setLoadingHistory]=useState(false)

  useEffect(() => {
    apiFetch("/customers")
      .then((res) => {
        setCustomers(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch customers:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(()=>{
    if(!selectedCustomer || !selectedCustomer._id) return
    if(selectedCustomer.consultations) return
    setLoadingHistory(true)
    apiFetch(`/consultations?customerId=${selectedCustomer._id}`)
      .then((res)=>{
        setSelectedCustomer((prev)=>({
          ...prev,
          consultations:res.data || []
        }))
      })
      .catch((err)=>{console.error("Failed to fetch history: ",err)})
      .finally(()=>{setLoadingHistory(false)})
  },[selectedCustomer?._id])

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

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery),
  );

  const handleDelete = async (e, customerId) => {
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure? This will permanently delete the customer and all associated consultations.",
      )
    ) {
      return;
    }

    try {
      await apiFetch(`/customers/${customerId}`, { method: "DELETE" });
      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      if (selectedCustomer?._id === customerId) {
        setSelectedCustomer(null);
      }
      toast.success("Customer deleted")
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete customer. Please try again.");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur z-10 sticky top-0 rounded-t-xl">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 mt-[0.35rem] h-4"
            />

            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="hover:text-foreground transition-colors"
              >
                Customers
              </button>
              {selectedCustomer && (
                <>
                  <span className="mx-2 text-border">/</span>
                  <span className="text-primary font-semibold">
                    {selectedCustomer.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {/* ========================================================= */}
            {/* DIRECTORY VIEW (Untouched)                                  */}
            {/* ========================================================= */}
            {!selectedCustomer && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                      Customer Directory
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a customer to view history and create
                      consultations.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search name or phone..."
                        className="pl-8 bg-muted/20 border-border/50 h-9 text-sm focus-visible:ring-primary/50 focus-visible:border-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <CreateCustomerDialog
                      onCustomerCreated={() => {
                        // Re-fetch your customers here to update the directory list automatically
                        setLoading(true);
                        apiFetch("/customers")
                          .then((res) => setCustomers(res.data))
                          .finally(() => setLoading(false));
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-muted/20 border border-border/40">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border/40 hover:bg-transparent">
                        <TableHead className="h-12 text-[11px] font-medium uppercase tracking-wider text-muted-foreground pb-2">
                          Name
                        </TableHead>
                        <TableHead className="h-12 text-[11px] font-medium uppercase tracking-wider text-muted-foreground pb-2">
                          Phone
                        </TableHead>
                        <TableHead className="h-12 text-[11px] font-medium uppercase tracking-wider text-muted-foreground pb-2">
                          Email
                        </TableHead>
                        <TableHead className="h-12 text-[11px] font-medium uppercase tracking-wider text-muted-foreground pb-2">
                          Birth Date
                        </TableHead>
                        <TableHead className="h-12 text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-right pb-2">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow className="hover:bg-transparent border-none">
                          <TableCell colSpan={5} className="h-32 text-center">
                            <span className="text-sm text-primary/70 animate-pulse">
                              Loading directory...
                            </span>
                          </TableCell>
                        </TableRow>
                      ) : filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <TableRow
                            key={customer._id}
                            onClick={() => setSelectedCustomer(customer)}
                            className="border-b border-border/20 hover:bg-primary/[0.03] cursor-pointer transition-colors group"
                          >
                            <TableCell className="py-4 text-sm font-medium text-foreground/90">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                  <UserRound className="size-4 text-primary" />
                                </div>
                                {customer.name}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 font-mono text-[11px] text-muted-foreground">
                              {customer.phone || "N/A"}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-muted-foreground">
                              {customer.email || "N/A"}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-muted-foreground">
                              {formatDate(customer.birthDate)}
                            </TableCell>
                            <TableCell
                              className="py-4 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[160px] border-border/40 shadow-xl bg-background/95 backdrop-blur-md"
                                >
                                  <DropdownMenuItem
                                    className="text-xs cursor-pointer"
                                    onClick={() =>
                                      setSelectedCustomer(customer)
                                    }
                                  >
                                    View Profile
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem className="text-xs cursor-pointer" onClick>
                                    Edit
                                  </DropdownMenuItem> */}
                                  <DropdownMenuSeparator className="bg-border/40" />
                                  <DropdownMenuItem
                                    className="text-xs cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={(e) =>
                                      handleDelete(e, customer._id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="border-none hover:bg-transparent">
                          <TableCell colSpan={5} className="h-48 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                              <UserRound className="h-8 w-8 opacity-20" />
                              <span className="text-sm">
                                No customers found.
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* CUSTOMER DETAIL VIEW (Beautifully Modularized)            */}
            {/* ========================================================= */}
            {selectedCustomer && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col gap-6">
                {/* Back Navigation */}
                {/* <button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex items-center w-fit gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  Back to Directory
                </button> */}

                {/* MODULE 1: The Core Identity & Meta Card */}
                <div className="rounded-2xl border border-border/40 bg-muted/10 p-6 sm:p-8 shadow-sm">
                  {/* Top: Identity */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-border/40">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                        <UserRound className="size-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                          {selectedCustomer.name}
                        </h1>
                        <p className="text-xs font-mono text-muted-foreground">
                          ID: {selectedCustomer._id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none h-9 border-border/50 hover:bg-primary/5 hover:text-primary"
                      >
                        Edit Profile
                      </Button> */}
                      <CreateConsultationDialog
                        customerId={selectedCustomer._id}
                        customerName={selectedCustomer.name}
                        onConsultationCreated={() => {
                          // Re-fetch this specific customer's history to update the ledger instantly
                          apiFetch(
                            `/consultations?customerId=${selectedCustomer._id}`,
                          ).then((res) =>
                            setSelectedCustomer((prev) => ({
                              ...prev,
                              consultations: res.data,
                            })),
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom: High-End Icon Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-10 rounded-full bg-background border border-border/50 shadow-sm shrink-0">
                        <Phone className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-0.5">
                          Contact
                        </p>
                        <p className="text-sm font-mono text-foreground/90">
                          {selectedCustomer.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-10 rounded-full bg-background border border-border/50 shadow-sm shrink-0">
                        <Mail className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-0.5">
                          Email Address
                        </p>
                        <p className="text-sm text-foreground/90 truncate">
                          {selectedCustomer.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-10 rounded-full bg-background border border-border/50 shadow-sm shrink-0">
                        <CalendarDays className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-0.5">
                          Birth Date
                        </p>
                        <p className="text-sm text-foreground/90">
                          {formatDate(selectedCustomer.birthDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE 2: Notes Document Block */}
                <div className="relative rounded-2xl border border-border/40 bg-muted/10 p-6 sm:p-8 overflow-hidden shadow-sm">
                  {/* Left edge accent line to make it look like a notebook */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40" />

                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      Astrological Baseline Notes
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground max-w-4xl whitespace-pre-wrap">
                    {selectedCustomer.notes ||
                      "No baseline notes recorded for this profile yet. Click 'Edit Profile' to add initial chart observations."}
                  </p>
                </div>

                {/* MODULE 3: Consultation History Table */}
                <div className="rounded-2xl border border-border/40 bg-muted/10 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      Consultation Ledger
                    </h3>
                  </div>

                  <div className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border/40 hover:bg-transparent">
                          <TableHead className="h-10 text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left pb-4">
                            Consultation
                          </TableHead>
                          <TableHead className="h-10 text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left pb-4">
                            Duration
                          </TableHead>
                          <TableHead className="h-10 text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left pb-4">
                            Date
                          </TableHead>
                          <TableHead className="h-10 text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left pb-4">
                            Tags
                          </TableHead>
                          <TableHead className="h-10 text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-right pb-4">
                            Notes
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.consultations &&
                        selectedCustomer.consultations.length > 0 ? (
                          selectedCustomer.consultations.map((c) => (
                            <TableRow
                              key={c._id}
                              className="border-b border-border/20 hover:bg-primary/[0.03] transition-colors group"
                            >
                              <TableCell className="py-4 text-sm font-medium text-foreground/90 text-left">
                                {c.title}
                              </TableCell>
                              <TableCell className="py-4 font-mono text-xs text-muted-foreground text-left">
                                {c.duration ? `${c.duration}m` : "Unknown"}
                              </TableCell>
                              <TableCell className="py-4 text-sm text-muted-foreground text-left">
                                {formatDate(c.consultationDate)}
                              </TableCell>
                              <TableCell className="py-4 text-left">
                                {c.tags && c.tags.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {c.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="font-mono text-xs text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-4 text-sm text-muted-foreground text-right">
                                {c.notes ? `${c.notes}` : "Unknown"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={5} className="h-32 text-center">
                              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Inbox className="h-6 w-6 opacity-20" />
                                <span className="text-xs">
                                  No prior consultations recorded.
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
