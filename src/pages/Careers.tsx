
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Careers = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="antialiased">
      <NavBar />
      <main className="pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Careers</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join our team and help shape the future of golf technology.
          </p>
          
          <div className="text-center my-12 py-12">
            <p className="text-xl">No open positions at this time</p>
            <p className="mt-4 text-muted-foreground">
              Please check back later or send your resume to careers@golfgps-acetrace.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
