
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
          <a
            href="#demo"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Demo
          </a>
          <Link
            to="/pricing"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/roadmap"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Roadmap
          </Link>
          <Link
            to="/about"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            About Us
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
            <a
              href="#demo"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </a>
            <Link
              to="/pricing"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/roadmap"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roadmap
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
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
