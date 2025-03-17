
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "accent";
  className?: string;
}

const Badge = ({ children, variant = "default", className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset animate-fade-in-up",
        variant === "default" && "bg-primary/10 text-primary ring-primary/20",
        variant === "outline" && "bg-background text-foreground ring-border",
        variant === "accent" && "bg-accent/10 text-accent-foreground ring-accent/30",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
