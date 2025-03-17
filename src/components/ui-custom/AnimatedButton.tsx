
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  withArrow?: boolean;
  className?: string;
}

const AnimatedButton = ({
  children,
  variant = "primary",
  size = "default",
  withArrow = false,
  className,
  ...props
}: AnimatedButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]",
        variant === "primary" && 
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg focus:ring-primary/50",
        variant === "outline" && 
          "border border-primary/20 bg-transparent text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5 focus:ring-primary/20",
        variant === "ghost" && 
          "bg-transparent text-foreground hover:bg-muted focus:ring-muted",
        size === "default" && "px-8 py-3",
        size === "sm" && "px-4 py-2 text-sm",
        size === "lg" && "px-10 py-4 text-lg",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          className={cn(
            "ml-2 h-4 w-4 transition-transform duration-300",
            isHovering && "translate-x-1"
          )}
        />
      )}
    </button>
  );
};

export default AnimatedButton;
