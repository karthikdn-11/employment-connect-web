import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { JobSearch } from '@/components/JobSearch';
import { JobCard } from '@/components/JobCard';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Filter, SlidersHorizontal, MapPin, Building2, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const JOBS_PER_PAGE = 6;

  // Initial jobs data as fallback
  const fallbackJobs = [
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
    },
    {
      id: '4',
      title: 'Data Scientist',
      company: 'DataTech',
      location: 'Seattle, WA',
      type: 'Full Time',
      salary: '$130k - $170k',
      description: 'Analyze complex data sets to drive business decisions and build machine learning models.',
      postedAt: '5 days ago',
      isRemote: true,
      isFeatured: false,
      tags: ['Python', 'Machine Learning', 'SQL', 'R']
    },
    {
      id: '5',
      title: 'Product Manager',
      company: 'ProductCorp',
      location: 'Boston, MA',
      type: 'Full Time',
      salary: '$110k - $150k',
      description: 'Lead product development and strategy for our growing SaaS platform.',
      postedAt: '1 week ago',
      isRemote: false,
      isFeatured: false,
      tags: ['Product Strategy', 'Agile', 'Analytics', 'User Research']
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Remote',
      type: 'Full Time',
      salary: '$115k - $145k',
      description: 'Manage cloud infrastructure and deployment pipelines for high-scale applications.',
      postedAt: '4 days ago',
      isRemote: true,
      isFeatured: true,
      tags: ['AWS', 'Kubernetes', 'Docker', 'Terraform']
    }
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentOffset = loadMore ? offset : 0;
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + JOBS_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching jobs:', error);
        // Use fallback data on error
        if (!loadMore) {
          setJobs(fallbackJobs);
        }
        return;
      }

      const transformedJobs = data?.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`
          : 'Competitive',
        description: job.description,
        postedAt: new Date(job.created_at).toLocaleDateString(),
        isRemote: job.is_remote,
        isFeatured: job.is_featured,
        tags: job.tags || []
      })) || [];

      if (loadMore) {
        setJobs(prev => [...prev, ...transformedJobs]);
        setOffset(currentOffset + JOBS_PER_PAGE);
      } else {
        setJobs(transformedJobs.length > 0 ? transformedJobs : fallbackJobs);
        setOffset(JOBS_PER_PAGE);
      }

      setHasMore(transformedJobs.length === JOBS_PER_PAGE);
    } catch (error) {
      console.error('Error:', error);
      if (!loadMore) {
        setJobs(fallbackJobs);
      }
      toast({
        title: "Error",
        description: "Failed to load jobs. Showing sample data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchJobs(true);
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
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

  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salary: '',
    isRemote: false,
    selectedJobTypes: [] as string[],
    selectedLocations: [] as string[],
    selectedSalaryRanges: [] as string[]
  });

  const handleSearch = (searchFilters: any) => {
    setFilters(searchFilters);
    console.log('Search filters:', searchFilters);
  };

  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Remote'];
  const salaryRanges = ['$0 - $50k', '$50k - $100k', '$100k - $150k', '$150k+'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Your Next Opportunity
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore thousands of job opportunities from top companies worldwide
            </p>
          </div>
          <JobSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Type Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>Job Type</span>
                    </h3>
                    <div className="space-y-2">
                      {jobTypes.map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300" 
                            checked={filters.selectedJobTypes?.includes(type) || false}
                            onChange={(e) => {
                              const currentSelected = filters.selectedJobTypes || [];
                              const updated = e.target.checked 
                                ? [...currentSelected, type]
                                : currentSelected.filter(t => t !== type);
                              setFilters({...filters, selectedJobTypes: updated});
                            }}
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Location Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </h3>
                    <div className="space-y-2">
                      {locations.map((location) => (
                        <label key={location} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Salary Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Salary Range</span>
                    </h3>
                    <div className="space-y-2">
                      {salaryRanges.map((range) => (
                        <label key={range} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-sm">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Remote Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Work Type</span>
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">Remote</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">On-site</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">Hybrid</span>
                      </label>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {jobs.length} Jobs Found
                  </h2>
                  <Badge variant="secondary">
                    New jobs added daily
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Sort by: Relevance
                </Button>
              </div>
              
              <div className="space-y-4">
                {loading && jobs.length === 0 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-48 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} onClick={() => handleJobClick(job.id)} className="cursor-pointer">
                      <JobCard 
                        job={job}
                        onApply={handleApply}
                        onSave={handleSave}
                      />
                    </div>
                  ))
                )}
              </div>
              
              {/* Load More */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Jobs'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};