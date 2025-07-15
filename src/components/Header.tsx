import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, User, Briefcase, Building2 } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">JobConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/jobs" 
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link 
              to="/companies" 
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Companies
            </Link>
            <Link 
              to="/post-job" 
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Post a Job
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="space-y-4">
              <Link 
                to="/jobs" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Find Jobs</span>
              </Link>
              <Link 
                to="/companies" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="h-4 w-4" />
                <span>Companies</span>
              </Link>
              <Link 
                to="/post-job" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="h-4 w-4" />
                <span>Post a Job</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>About</span>
              </Link>
              <div className="pt-4 border-t border-border space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="w-full" asChild>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};