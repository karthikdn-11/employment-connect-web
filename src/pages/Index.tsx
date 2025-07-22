import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { JobSearch } from '@/components/JobSearch';
import { JobCard } from '@/components/JobCard';
import { Stats } from '@/components/Stats';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Sample job data
  const [jobs] = useState([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full Time',
      salary: '$120k - $160k',
      description: 'Join our innovative team to build cutting-edge web applications using React, TypeScript, and modern development practices.',
      postedAt: '2 days ago',
      isRemote: true,
      isFeatured: true,
      tags: ['React', 'TypeScript', 'JavaScript', 'CSS']
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Full Time',
      salary: '$90k - $120k',
      description: 'Create beautiful and intuitive user experiences for web and mobile applications.',
      postedAt: '1 week ago',
      isRemote: false,
      isFeatured: false,
      tags: ['Figma', 'Adobe XD', 'User Research', 'Prototyping']
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'StartupCo',
      location: 'Austin, TX',
      type: 'Full Time',
      salary: '$100k - $140k',
      description: 'Build scalable web applications from front to back using modern technologies.',
      postedAt: '3 days ago',
      isRemote: true,
      isFeatured: true,
      tags: ['Node.js', 'React', 'PostgreSQL', 'AWS']
    }
  ]);

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // TODO: Implement actual search functionality
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/jobs');
    } else {
      navigate('/login');
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            job_id: jobId,
            user_id: user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert([
          {
            job_id: jobId,
            user_id: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Job Saved",
        description: "Job saved to your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary-light text-primary border-primary/20">
                <Star className="h-3 w-3 mr-1" />
                #1 Job Portal
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Find Your
                <span className="text-primary"> Dream Job</span>
                <br />
                Today
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Connect with top companies and discover opportunities that match your skills and aspirations. 
                Your next career move is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional team collaboration" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <JobSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Job Opportunities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover hand-picked job opportunities from top companies actively hiring talented professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                onApply={handleApply}
                onSave={handleSave}
              />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/jobs'}>
              View All Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose JobConnect?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make job searching and hiring easier with our innovative platform and dedicated support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our AI-powered algorithm matches you with the most relevant opportunities based on your skills and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Verified Companies</h3>
              <p className="text-muted-foreground">
                All companies are thoroughly verified to ensure legitimate opportunities and protect your privacy.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success text-success-foreground mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Fast Applications</h3>
              <p className="text-muted-foreground">
                Apply to multiple jobs with one click using your saved profile and get faster responses from employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
