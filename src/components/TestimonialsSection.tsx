import { useEffect, useState, useRef } from "react";
import yaml from "js-yaml";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  imagePrompt: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Use a relative path to ensure it's correctly loaded
        const response = await fetch("./data/testimonials.yaml");
        console.log("Fetching testimonials from", "./data/testimonials.yaml");
        const yamlText = await response.text();
        const parsedTestimonials = yaml.load(yamlText) as Testimonial[];
        setTestimonials(parsedTestimonials);
        console.log("Loaded testimonials:", parsedTestimonials);
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Manually add the visible class after component mounts
  useEffect(() => {
    if (sectionRef.current && !isLoading) {
      // Small delay to ensure the section is rendered before adding the visible class
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.classList.add("visible");
          console.log("Added visible class to testimonials section");
        }
      }, 300);
    }
  }, [isLoading]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">What Our Users Say</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Hear from golfers who have improved their game with AceTRACE</p>
          <div className="flex justify-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }
  
  console.log("Rendering testimonials section with", testimonials.length, "testimonials");

  return (
    <section ref={sectionRef} id="testimonials" className="py-16 bg-gradient-to-b from-gray-50 to-white" style={{ opacity: 1, transform: 'none' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">What Our Users Say</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Hear from golfers who have improved their game with AceTRACE</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 mr-4 rounded-full overflow-hidden shadow-md border-2 border-gray-100">
                  <img 
                    src={`/images/testimonials/${testimonial.id}.jpg`} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                      console.log(`Failed to load image for ${testimonial.id}`);
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <div className="flex mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic text-sm md:text-base">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
