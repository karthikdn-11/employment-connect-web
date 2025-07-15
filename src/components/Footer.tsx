import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">JobConnect</span>
            </Link>
            <p className="text-muted-foreground">
              Connecting talented professionals with their dream opportunities. 
              Build your career with the best companies worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">For Job Seekers</h3>
            <nav className="space-y-2">
              <Link to="/jobs" className="block text-muted-foreground hover:text-primary transition-colors">
                Browse Jobs
              </Link>
              <Link to="/companies" className="block text-muted-foreground hover:text-primary transition-colors">
                Companies
              </Link>
              <Link to="/career-advice" className="block text-muted-foreground hover:text-primary transition-colors">
                Career Advice
              </Link>
              <Link to="/salary-guide" className="block text-muted-foreground hover:text-primary transition-colors">
                Salary Guide
              </Link>
            </nav>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">For Employers</h3>
            <nav className="space-y-2">
              <Link to="/post-job" className="block text-muted-foreground hover:text-primary transition-colors">
                Post a Job
              </Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/employer-resources" className="block text-muted-foreground hover:text-primary transition-colors">
                Resources
              </Link>
              <Link to="/hire-talent" className="block text-muted-foreground hover:text-primary transition-colors">
                Hire Talent
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@jobconnect.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};