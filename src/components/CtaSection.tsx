
import { useEffect, useRef } from "react";
import AnimatedButton from "./ui-custom/AnimatedButton";

const CtaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-transparent to-primary/5 overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={contentRef}
          className="reveal glass rounded-3xl p-8 md:p-12 lg:p-16 text-center"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to Transform Your Golf Game?
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Join our early access program and be among the first to experience
              the future of golf course navigation and shot planning.
            </p>
            
            <div className="py-8">
              <AnimatedButton size="lg" withArrow>
                Get Early Access
              </AnimatedButton>
            </div>
            
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Limited spots available.</span> Be part of shaping
              the future of golf technology and receive exclusive benefits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
