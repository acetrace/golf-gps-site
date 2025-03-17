
import { useState, useEffect } from 'react';
import { Menu, X, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import AnimatedButton from './ui-custom/AnimatedButton';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-4 bg-background/80 backdrop-blur-md shadow-sm'
          : 'py-6 bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-foreground">
            Golf GPS - <span className="text-primary">Ace Trace</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Features
          </a>
          <Link
            to="/privacy-policy"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
          <a 
            href="https://www.instagram.com/acetracegolf" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            <Instagram size={20} />
          </a>
          <AnimatedButton size="sm" withArrow>
            Download Now
          </AnimatedButton>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 rounded-full hover:bg-muted transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md p-4 shadow-md animate-fade-in-down">
          <nav className="flex flex-col space-y-4 py-4">
            <a
              href="#features"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <Link
              to="/privacy-policy"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Terms of Service
            </Link>
            <a 
              href="https://www.instagram.com/acetracegolf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Instagram size={20} />
                <span>Instagram</span>
              </div>
            </a>
            <div className="pt-4">
              <AnimatedButton size="sm" withArrow className="w-full">
                Download Now
              </AnimatedButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
