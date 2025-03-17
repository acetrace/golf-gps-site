
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Roadmap = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="antialiased">
      <NavBar />
      <main className="pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Product Roadmap</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Discover what's next for Golf GPS - Ace Trace and how we're continuously improving your golfing experience.
          </p>
          
          <div className="text-center my-12 py-12">
            <p className="text-xl">Roadmap details coming soon</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Roadmap;
