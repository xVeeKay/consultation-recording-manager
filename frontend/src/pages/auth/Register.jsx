import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm.jsx";

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-sm transition-colors group-hover:border-primary/40 overflow-hidden">
            <img
              src="/favicon.png"
              alt="AstroLedger Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          AstroLedger
        </a>
        <RegisterForm />
      </div>
    </div>
  );
}
