import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

export function Dialog({ open, onOpenChange, children, title }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop - Light and Dark Mode */}
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" />
      
      {/* Dialog Content */}
      <div
        className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto anime-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5 relative transition-all overflow-hidden">
          {/* Close Button - Always visible with Premium Dark styling */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-white/5 pr-14 bg-white/5 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                {title}
              </h2>
            </div>
          )}
          <div className={`${title ? "p-8" : "p-8 pt-12"} bg-transparent ${title ? "rounded-b-2xl" : "rounded-2xl"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
