
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import AnimatedButton from "./ui-custom/AnimatedButton";
import Badge from "./ui-custom/Badge";
import PhoneMockup from "./ui-custom/PhoneMockup";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in elements on load
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.classList.add("active");
      }
    }, 300);

    setTimeout(() => {
      if (imageRef.current) {
        imageRef.current.classList.add("active");
      }
    }, 600);

    // Parallax scroll effect
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = 1 - Math.min(1, scrollY / 500);
      
      if (textRef.current) {
        textRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
        textRef.current.style.opacity = opacity.toString();
      }
      
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
        imageRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-screen pt-28 pb-16 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent -z-10"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <div 
            ref={textRef}
            className="reveal lg:w-1/2 text-center lg:text-left space-y-6"
          >
            <Badge className="mb-4">Rangefinder, GPS & Scorecards</Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Plan Your Perfect Golf Shot with Precision Distance Mapping
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Visualize distances to the hole and optimize your approach for lower scores. Make data-driven decisions that improve your game.
            </p>
            
            <p className="text-sm text-muted-foreground">
              From the makers of <span className="font-medium">Ace Trace</span>, the leading golf shot trajectory app. 
              Golf GPS - Ace Trace is our dedicated solution for rangefinding and course management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start pt-4">
              <AnimatedButton size="lg" withArrow>
                Download Now
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" href="#features">
                Learn More
              </AnimatedButton>
            </div>
          </div>
          
          {/* Phone mockup */}
          <div 
            ref={imageRef}
            className="reveal lg:w-1/2 flex justify-center"
          >
            <PhoneMockup
              imageSrc="/placeholder.svg"
              alt="Golf GPS - Ace Trace app showing golf course map with distance visualization"
              className="animate-float"
            />
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-subtle hidden md:block">
          <a 
            href="#features" 
            className="flex flex-col items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="mb-2">Scroll to explore</span>
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
