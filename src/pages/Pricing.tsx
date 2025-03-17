
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Pricing = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="antialiased">
      <NavBar />
      <main className="pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Pricing</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Explore our flexible pricing options designed to suit every golfer's needs.
          </p>
          
          <div className="text-center my-12 py-12">
            <p className="text-xl">Pricing information coming soon</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
