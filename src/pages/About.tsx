
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const About = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="antialiased">
      <NavBar />
      <main className="pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Us</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
            Learn more about the team behind Golf GPS - Ace Trace and our mission to improve your golf game.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Golf GPS - Ace Trace was developed by a team of passionate golfers and technology enthusiasts who wanted to create the most accurate, 
                user-friendly golf GPS rangefinder application available.
              </p>
              <p className="text-muted-foreground mb-6">
                As the makers of the popular Ace Trace shot tracking application, we brought our expertise in golf technology 
                to create a dedicated GPS solution that helps golfers of all skill levels make better decisions on the course.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                We're committed to helping golfers improve their game through accurate distance measurement and course mapping. 
                Our goal is to provide tools that enhance the golfing experience while respecting the traditions of the game.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe that technology should be a seamless part of the golfing experience, providing valuable information 
                without getting in the way of what matters most: enjoying the game you love.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold mb-8">Our Team</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Team information coming soon
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
