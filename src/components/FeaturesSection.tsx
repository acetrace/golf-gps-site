
import { Target, Compass, MapPin, Eye } from "lucide-react";
import { useEffect, useRef } from "react";
import FeatureCard from "./ui-custom/FeatureCard";
import Badge from "./ui-custom/Badge";

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent/10 to-transparent -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/10 to-transparent -z-10 opacity-70"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          ref={headingRef}
          className="reveal text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <Badge>Powerful Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Precision Tools for Every Golfer
          </h2>
          <p className="text-lg text-muted-foreground">
            Ace Trace provides all the tools you need to visualize your game and make
            smarter decisions on the course.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Target}
            title="Real-Time Distance Calculation"
            description="Get precise yardage to any point on the course with our advanced GPS technology."
            delay={100}
          />
          <FeatureCard
            icon={MapPin}
            title="Course Visualization"
            description="View detailed hole layouts with hazards, bunkers, and green contours clearly marked."
            delay={200}
          />
          <FeatureCard
            icon={Compass}
            title="Strategic Shot Planning"
            description="Plan your approach with shot visualization and club recommendations based on your history."
            delay={300}
          />
          <FeatureCard
            icon={Eye}
            title="Easy-to-Read Interface"
            description="Intuitive design that provides critical information at a glance, even in bright sunlight."
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
