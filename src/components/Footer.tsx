
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/20 pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Column 1 - App Information */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-xl font-bold">Golf GPS - <span className="text-primary">Ace Trace</span></h3>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Precision distance tracking and course management for golfers of all levels. From the makers of the popular Ace Trace shot tracking application.
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/acetracegolf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={16} />
                <span>@acetracegolf</span>
              </a>
            </div>
          </div>

          {/* Column 2 - App Features */}
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">GPS Rangefinder</a>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">Course Management</a>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">Shot Planning</a>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">Score Tracking</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>© {currentYear} Golf GPS - Ace Trace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
