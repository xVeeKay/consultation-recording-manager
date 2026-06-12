import { useState } from "react";
import { Plus, Loader2, Mic } from "lucide-react";
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

export function CreateConsultationDialog({
  customerId,
  customerName,
  onConsultationCreated,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPhase, setUploadPhase] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadPhase("Saving session...");

    const formData = new FormData(e.target);
    const rawTags = formData.get("tags");
    const tagsArray = rawTags
      ? rawTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const payload = {
      customerId: customerId,
      title: formData.get("title"),
      notes: formData.get("notes"),
      consultationDate: formData.get("consultationDate"),
      duration: formData.get("duration")
        ? Number(formData.get("duration"))
        : undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    };

    const audioFile = formData.get("audioFile");

    try {

      const res = await apiFetch("/consultations", {
        method: "POST",
        body: payload
      });
      const newConsultationId = res.data._id;
      if (audioFile && audioFile.size > 0) {
        setUploadPhase("Uploading recording...");

        const audioFormData = new FormData();
        audioFormData.append("recording", audioFile);
        await apiFetch(`/consultations/${newConsultationId}/upload`,{
            method:"POST",
            body:audioFormData
        })
      }
      toast.success("Consultation is created")
      setIsOpen(false);
      if (onConsultationCreated) onConsultationCreated();
    } catch (error) {
        toast.error(error.message);
      console.error("Submission sequence failed:", error);
    } finally {
      setIsSubmitting(false);
      setUploadPhase("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-none"
        >
          <Plus className="size-4 mr-1.5" />
          Consultation
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Log Consultation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Record a new session for{" "}
              <span className="font-medium text-foreground">
                {customerName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-6">
            {/* Title (Spans both columns) */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="title"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Session Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Career Transit Analysis"
                required
                minLength={3}
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50"
              />
            </div>

            {/* Split Row: Date & Duration */}
            <div className="space-y-2">
              <Label
                htmlFor="consultationDate"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Date & Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="consultationDate"
                name="consultationDate"
                type="datetime-local"
                required
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50 w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Duration (Minutes)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="e.g. 45"
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50"
              />
            </div>

            {/* Optional Audio Upload (Spans both columns) */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="audioFile"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Mic className="size-3 text-primary" /> Audio Recording
              </Label>
              <Input
                id="audioFile"
                name="audioFile"
                type="file"
                accept="audio/*"
                // Premium file input styling using tailwind's 'file:' modifiers
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50 cursor-pointer
                           file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0
                           file:text-xs file:font-medium file:bg-primary/10 file:text-primary
                           hover:file:bg-primary/20 file:transition-colors text-muted-foreground"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Upload the Cloudinary-bound audio track. Supports MP3, WAV, M4A.
              </p>
            </div>

            {/* Tags (Spans both columns) */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="tags"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Tags (Comma Separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                placeholder="e.g. Career, Marriage, Sade Sati"
                className="bg-muted/20 border-border/50 focus-visible:ring-primary/50"
              />
            </div>

            {/* Notes (Spans both columns) */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="notes"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Session Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Document key astrological insights, remedies prescribed, or planetary transitions discussed..."
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

            {/* The Dynamic Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-40"
            >
              {isSubmitting ? (
                <>
                  <SpinnerCustom/>
                  <span className="truncate">{uploadPhase}</span>
                </>
              ) : (
                "Save Session"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
