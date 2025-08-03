import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Building2, Users, Calendar, Globe, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobCard } from '@/components/JobCard';
import { useAuth } from '@/contexts/AuthContext';

interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logo_url?: string;
  founded_year?: number;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  is_remote: boolean;
  is_featured: boolean;
  tags?: string[];
  created_at: string;
}

export const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
      fetchCompanyJobs();
    }
  }, [companyId]);

  useEffect(() => {
    if (user && jobs.length > 0) {
      fetchUserJobStatus();
    }
  }, [user, jobs]);

  const fetchUserJobStatus = async () => {
    if (!user) return;

    try {
      const jobIds = jobs.map(job => job.id);

      // Fetch user's applications
      const { data: applications } = await supabase
        .from('applications')
        .select('job_id')
        .eq('user_id', user.id)
        .in('job_id', jobIds);

      // Fetch user's saved jobs
      const { data: savedJobsData } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id)
        .in('job_id', jobIds);

      setAppliedJobs(new Set(applications?.map(app => app.job_id) || []));
      setSavedJobs(new Set(savedJobsData?.map(saved => saved.job_id) || []));
    } catch (error) {
      console.error('Error fetching user job status:', error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        toast({
          title: "Error",
          description: "Company not found",
          variant: "destructive",
        });
        navigate('/companies');
        return;
      }

      setCompany(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load company details",
        variant: "destructive",
      });
      navigate('/companies');
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      // Get company name first
      const { data: companyData } = await supabase
        .from('companies')
        .select('name')
        .eq('id', companyId)
        .single();

      if (companyData) {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('company', companyData.name)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
        } else {
          setJobs(data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (appliedJobs.has(jobId)) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this job",
        variant: "destructive",
      });
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

      // Update local state
      setAppliedJobs(prev => new Set([...prev, jobId]));

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    } catch (error: any) {
      console.error('Error applying to job:', error);
      toast({
        title: "Error",
        description: error.message === 'duplicate key value violates unique constraint "applications_pkey"' 
          ? "You have already applied to this job"
          : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (savedJobs.has(jobId)) {
      toast({
        title: "Already Saved",
        description: "This job is already in your saved jobs",
        variant: "destructive",
      });
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

      // Update local state
      setSavedJobs(prev => new Set([...prev, jobId]));

      toast({
        title: "Job Saved",
        description: "Job saved to your favorites",
      });
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: error.message === 'duplicate key value violates unique constraint "saved_jobs_pkey"'
          ? "This job is already in your saved jobs"
          : "Failed to save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Company not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/companies')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>

        {/* Company Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center">
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-primary-foreground" />
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <CardTitle className="text-3xl mb-2">{company.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {company.industry || 'Technology Company'}
                  </CardDescription>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {company.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{company.size} employees</span>
                    </div>
                  )}
                  {company.founded_year && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Founded {company.founded_year}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <Button>
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Jobs ({jobs.length})
                  </Button>
                  <Button variant="outline">
                    Follow Company
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {company.description || `${company.name} is a leading company in the ${company.industry || 'technology'} industry. We are committed to innovation, excellence, and creating meaningful impact through our work.`}
                  </p>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Industry</h4>
                    <p className="text-muted-foreground">{company.industry || 'Technology'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Company Size</h4>
                    <p className="text-muted-foreground">{company.size || '100-500'} employees</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Founded</h4>
                    <p className="text-muted-foreground">{company.founded_year || '2015'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-muted-foreground">{company.location || 'San Francisco, CA'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Open Positions</h3>
                <Badge variant="secondary">{jobs.length} jobs available</Badge>
              </div>
              
              {jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={{
                          ...job,
                          salary: job.salary_min && job.salary_max 
                            ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`
                            : 'Competitive Salary',
                          postedAt: `${Math.ceil((new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`,
                          isRemote: job.is_remote,
                          isFeatured: job.is_featured,
                          tags: job.tags || []
                        }}
                        onApply={handleApply}
                        onSave={handleSave}
                      />
                    ))}
                  </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Open Positions</h3>
                    <p className="text-muted-foreground">
                      {company.name} doesn't have any open positions at the moment. 
                      Follow the company to get notified when new jobs are posted.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="culture">
            <Card>
              <CardHeader>
                <CardTitle>Company Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Our Values</h4>
                    <p className="text-muted-foreground">
                      We believe in innovation, collaboration, and creating a positive impact. 
                      Our team is passionate about building products that make a difference.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Work Environment</h4>
                    <p className="text-muted-foreground">
                      We offer a flexible work environment with remote options, competitive benefits, 
                      and opportunities for professional growth and development.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Health Insurance</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Remote Work</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">401(k) Matching</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Professional Development</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};