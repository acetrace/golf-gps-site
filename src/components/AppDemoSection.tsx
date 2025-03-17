
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AnimatedButton from "./ui-custom/AnimatedButton";
import Badge from "./ui-custom/Badge";
import PhoneMockup from "./ui-custom/PhoneMockup";

const demoScreens = [
  {
    id: 1,
    title: "Select Your Course",
    description: "Browse our extensive database of golf courses or use GPS to find courses near you.",
    imageSrc: "/placeholder.svg",
  },
  {
    id: 2,
    title: "View Hole Details",
    description: "See detailed hole layouts with precise distance measurements to key points.",
    imageSrc: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Plan Your Shot",
    description: "Visualize different shot paths and see exact distances for better decision making.",
    imageSrc: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Track Performance",
    description: "Review your shots and analyze your game with detailed statistics and insights.",
    imageSrc: "/placeholder.svg",
  },
];

const AppDemoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === demoScreens.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? demoScreens.length - 1 : prev - 1));
  };

  useEffect(() => {
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

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };

    // Auto-advance slides every 5 seconds
    // const interval = setInterval(nextSlide, 5000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="py-24 bg-secondary/50 relative overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          ref={headingRef}
          className="reveal text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <Badge variant="accent">App Demo</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            See Ace Trace in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Follow along with our step-by-step demonstration of how Ace Trace
            transforms your golf game.
          </p>
        </div>

        {/* Demo carousel */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Phone mockup */}
          <div className="lg:w-1/2 flex justify-center relative">
            <PhoneMockup
              imageSrc={demoScreens[activeIndex].imageSrc}
              alt={`Demo screen: ${demoScreens[activeIndex].title}`}
              className="z-10"
            />
            
            {/* Navigation arrows for mobile */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 lg:hidden">
              <button
                onClick={prevSlide}
                className="h-10 w-10 rounded-full bg-background/80 shadow-md flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="h-10 w-10 rounded-full bg-background/80 shadow-md flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Screen indicator dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2">
              {demoScreens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "bg-primary w-8"
                      : "bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="text-2xl font-bold">
                {demoScreens[activeIndex].title}
              </h3>
              <p className="text-lg text-muted-foreground">
                {demoScreens[activeIndex].description}
              </p>
            </div>

            {/* Screen selector */}
            <div className="hidden lg:flex flex-col space-y-4 mt-8">
              {demoScreens.map((screen, index) => (
                <button
                  key={screen.id}
                  onClick={() => setActiveIndex(index)}
                  className={`p-4 text-left rounded-lg transition-all ${
                    index === activeIndex
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "hover:bg-muted border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        index === activeIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium">{screen.title}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-8 text-center lg:text-left">
              <AnimatedButton withArrow>
                Watch Full Demo
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDemoSection;
