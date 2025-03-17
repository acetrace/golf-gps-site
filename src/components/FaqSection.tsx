
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Badge from "./ui-custom/Badge";

const faqs = [
  {
    question: "Which courses are currently available?",
    answer:
      "Our initial release includes over 500 popular courses across the United States, with focus on major metropolitan areas. We're adding new courses weekly, and you can request course additions directly through the app.",
  },
  {
    question: "Does the app work offline on the course?",
    answer:
      "Yes! Ace Trace downloads course data when you're connected to WiFi or cellular data. Once downloaded, you can access all course information and distance calculations without an internet connection, perfect for courses with limited signal.",
  },
  {
    question: "How accurate are the distance measurements?",
    answer:
      "Ace Trace utilizes high-precision GPS technology with accuracy within 2-3 yards under optimal conditions. The app also accounts for elevation changes when calculating distances, providing you with the most accurate information possible.",
  },
  {
    question: "Can I track my scores and statistics?",
    answer:
      "Absolutely! Ace Trace allows you to track scores, fairways hit, greens in regulation, putts, and much more. The premium version offers advanced analytics to help identify patterns and improve your game.",
  },
  {
    question: "Is there a subscription fee?",
    answer:
      "Ace Trace offers both free and premium versions. The free version provides essential distance measurements and basic course information. The premium subscription unlocks advanced features like shot tracking, club recommendations, and detailed analytics.",
  },
];

const FaqSection = () => {
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
      id="faq"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent -z-10 opacity-70"></div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          ref={headingRef}
          className="reveal text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <Badge>FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Ace Trace and how it can improve your
            golf game.
          </p>
        </div>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="reveal">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Help text */}
        <div className="mt-12 text-center reveal">
          <p className="text-muted-foreground">
            Have more questions? Feel free to{" "}
            <a
              href="mailto:support@acetrace.com"
              className="text-primary hover:underline"
            >
              contact us
            </a>{" "}
            and we'll be happy to help.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
