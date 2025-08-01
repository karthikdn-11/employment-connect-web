import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Building2, Clock, DollarSign, Calendar, Users, Star, Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  is_remote: boolean;
  is_featured: boolean;
  tags?: string[];
  created_at: string;
}

export const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      checkIfSaved();
    }
  }, [jobId, user]);

  const checkIfSaved = async () => {
    if (!user || !jobId) return;

    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .single();

      if (!error && data) {
        setIsSaved(true);
      }
    } catch (error) {
      // Job not saved, which is fine
      setIsSaved(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        toast({
          title: "Error",
          description: "Job not found",
          variant: "destructive",
        });
        navigate('/jobs');
        return;
      }

      setJob(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
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

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      console.log('Save job attempt:', { jobId, userId: user.id, isSaved });
      
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('job_id', jobId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Delete saved job error:', error);
          throw error;
        }
        setIsSaved(false);
        toast({
          title: "Job Removed",
          description: "Job removed from saved jobs",
        });
      } else {
        const { data, error } = await supabase
          .from('saved_jobs')
          .insert([
            {
              job_id: jobId,
              user_id: user.id
            }
          ])
          .select();

        if (error) {
          console.error('Insert saved job error:', error);
          throw error;
        }
        console.log('Saved job successfully:', data);
        setIsSaved(true);
        toast({
          title: "Job Saved",
          description: "Job saved to your favorites",
        });
      }
    } catch (error) {
      console.error('Handle save error:', error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSalaryDisplay = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`;
    }
    return 'Competitive Salary';
  };

  const getPostedTime = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-12 bg-muted rounded w-96"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Job not found</p>
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
          onClick={() => navigate('/jobs')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {job.is_featured && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="secondary">{job.type}</Badge>
                      {job.is_remote && (
                        <Badge variant="outline">Remote</Badge>
                      )}
                    </div>
                    <CardTitle className="text-3xl">{job.title}</CardTitle>
                    <CardDescription className="text-lg">{job.company}</CardDescription>
                    
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{getSalaryDisplay(job)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {getPostedTime(job.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills & Tags */}
            {job.tags && job.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this job</CardTitle>
                <CardDescription>
                  Join {job.company} and start your journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleApply} className="w-full" size="lg">
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSave}
                  className="w-full"
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{job.company}</h4>
                    <p className="text-sm text-muted-foreground">Technology Company</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Company Size</span>
                    <span>500-1000 employees</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <span>Technology</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Founded</span>
                    <span>2015</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Find company by name in companies table
                    supabase
                      .from('companies')
                      .select('id')
                      .eq('name', job?.company)
                      .single()
                      .then(({ data, error }) => {
                        if (data && !error) {
                          navigate(`/companies/${data.id}`);
                        } else {
                          navigate('/companies');
                        }
                      });
                  }}
                >
                  View Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Job Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Job Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applications</span>
                  <span>47 candidates</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Views</span>
                  <span>234 views</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Posted</span>
                  <span>{getPostedTime(job.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};