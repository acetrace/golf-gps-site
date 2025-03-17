
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 bg-primary/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and description */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                Golf GPS - <span className="text-primary">Ace Trace</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              Precision GPS technology for golfers, designed to help you make
              smarter decisions on the course and improve your game.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.instagram.com/acetracegolf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/roadmap"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Download */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Download</h3>
            <div className="space-y-3">
              <a
                href="https://apps.apple.com/us/app/golf-gps-ace-trace"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <span className="block text-xs text-muted-foreground">
                  Download on the
                </span>
                <span className="block font-semibold">App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.acetrace.golfgps"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <span className="block text-xs text-muted-foreground">
                  Get it on
                </span>
                <span className="block font-semibold">Google Play</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Golf GPS - Ace Trace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
