
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface PhoneMockupProps {
  imageSrc: string;
  className?: string;
  alt?: string;
}

const PhoneMockup = ({ imageSrc, className, alt = "App screenshot" }: PhoneMockupProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "reveal relative mx-auto w-[280px] rounded-[3rem] border-[14px] border-foreground/90 bg-foreground/90 shadow-xl",
        className
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-6 w-36 -translate-x-1/2 -translate-y-[2px] rounded-b-xl bg-foreground/90"></div>
      
      {/* Screen */}
      <div className="relative z-0 flex h-[540px] w-full overflow-hidden rounded-[2.3rem] bg-muted">
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "progressive-img h-full w-full object-cover",
            imageLoaded && "loaded"
          )}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-white/20"></div>
    </div>
  );
};

export default PhoneMockup;
