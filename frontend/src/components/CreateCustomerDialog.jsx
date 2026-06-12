import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/api/apiFetch.js";
import { toast } from "sonner";
import { SpinnerCustom } from "./ui/spinner.jsx";

export function CreateCustomerDialog({ onCustomerCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extract all form data natively
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res=await apiFetch("/customers",{
        method:"POST",
        body:data
      })
      toast.success("Customer created")
      setIsOpen(false);
      if (onCustomerCreated) onCustomerCreated();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4 mr-1.5" />
          Add Customer
        </Button>
      </DialogTrigger>

      {/* sm:max-w-lg gives it the perfect width for a 2-column internal grid */}
      <DialogContent className="sm:max-w-lg border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Create Customer Profile
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new client to the directory. Required fields are marked with
              an asterisk.
            </DialogDescription>
          </DialogHeader>

          {/* Form Fields Grid */}
          <div className="grid gap-6 py-6">
            {/* Full Width: Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Rahul Sharma"
                required
                minLength={3}
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50"
              />
            </div>

            {/* Split Row: Phone & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  minLength={10}
                  className="bg-muted/20 border-border/50 focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rahul@example.com"
                  className="bg-muted/20 border-border/50 focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {/* Full Width: Birth Matrix */}
            <div className="space-y-2">
              <Label
                htmlFor="birthDate"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Birth Matrix (Date)
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50 w-full"
              />
            </div>

            {/* Full Width: Notes Textarea */}
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Initial Astrological Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any baseline observations, current dashas, or specific areas of concern..."
                className="min-h-[100px] resize-none bg-muted/20 border-border/50 focus-visible:ring-primary/50"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border/30 sm:space-x-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-border/50 hover:bg-muted/30"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <SpinnerCustom/>
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
