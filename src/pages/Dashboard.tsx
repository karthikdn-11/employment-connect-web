import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { JobCard } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Briefcase, 
  BookmarkCheck, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Application {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
  resume_url?: string;
  jobs: {
    title: string;
    company: string;
  };
}

interface SavedJob {
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

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    experience_years: '',
    skills: ''
  });

  // Calculate dynamic profile completeness
  const calculateProfileCompleteness = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.phone,
      profile.bio,
      profile.experience_years,
      profile.skills && profile.skills.length > 0,
      user?.email // Email is always available from auth
    ];
    
    const filledFields = fields.filter(field => field && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompleteness = calculateProfileCompleteness();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user && profile) {
      if (profile.account_type === 'employer') {
        fetchPostedJobs();
        fetchJobApplications();
      } else {
        fetchApplications();
        fetchSavedJobs();
      }
    }
  }, [user, profile]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setProfileForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: (data as any).phone || '',
          bio: (data as any).bio || '',
          experience_years: (data as any).experience_years?.toString() || '',
          skills: (data as any).skills ? (data as any).skills.join(', ') : ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;

    try {
      // First get applications
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, job_id, status, applied_at')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (appsError) {
        console.error('Error fetching applications:', appsError);
        return;
      }

      // Then get job details for each application
      if (appsData && appsData.length > 0) {
        const jobIds = appsData.map(app => app.job_id);
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('id, title, company')
          .in('id', jobIds);

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          return;
        }

        // Combine applications with job data
        const appsWithJobs = appsData.map(app => {
          const job = jobsData?.find(j => j.id === app.job_id);
          return {
            ...app,
            jobs: job || { title: 'Unknown Job', company: 'Unknown Company' }
          };
        });

        setApplications(appsWithJobs);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;

    try {
      // First get saved jobs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_jobs')
        .select('id, job_id')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (savedError) {
        console.error('Error fetching saved jobs:', savedError);
        setLoading(false);
        return;
      }

      // Then get job details
      if (savedData && savedData.length > 0) {
        const jobIds = savedData.map(item => item.job_id);
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
        } else {
          const jobsWithSavedId = jobsData?.map(job => {
            const savedItem = savedData.find(item => item.job_id === job.id);
            return {
              ...job,
              savedId: savedItem?.id
            };
          }) || [];
          setSavedJobs(jobsWithSavedId);
        }
      } else {
        setSavedJobs([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostedJobs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('posted_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPostedJobs(data || []);
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async () => {
    if (!user) return;

    try {
      // Get all jobs posted by this employer
      const { data: employerJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('posted_by', user.id);

      if (jobsError) throw jobsError;

      if (!employerJobs || employerJobs.length === 0) {
        setJobApplications([]);
        return;
      }

      const jobIds = employerJobs.map(job => job.id);

      // Get applications for those jobs
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          user_id,
          status,
          applied_at
        `)
        .in('job_id', jobIds)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      // Get job details and applicant profiles
      const applicationsWithDetails = await Promise.all(
        (data || []).map(async (app) => {
          // Get job details
          const { data: jobData } = await supabase
            .from('jobs')
            .select('title, company')
            .eq('id', app.job_id)
            .single();

          // Get applicant profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', app.user_id)
            .single();

          return {
            ...app,
            job: jobData,
            applicant: profileData
          };
        })
      );

      setJobApplications(applicationsWithDetails);
    } catch (error) {
      console.error('Error fetching job applications:', error);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      fetchApplications(); // Refresh applications
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSaved = async (savedId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', savedId);

      if (error) throw error;

      toast({
        title: "Job Removed",
        description: "Job removed from saved jobs",
      });

      fetchSavedJobs(); // Refresh saved jobs
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove saved job",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'under review':
        return 'bg-warning';
      case 'interview scheduled':
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-destructive';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleEditProfile = async () => {
    if (!user) return;

    try {
      const skillsArray = profileForm.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const updateData = {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone: profileForm.phone,
        bio: profileForm.bio,
        experience_years: profileForm.experience_years ? parseInt(profileForm.experience_years) : null,
        skills: skillsArray.length > 0 ? skillsArray : null
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({ user_id: user.id, ...updateData }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });

      setEditProfileOpen(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  const handleViewApplication = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application withdrawn successfully",
      });

      // Refresh applications
      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw application",
        variant: "destructive",
      });
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status}`,
      });

      fetchJobApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle>
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : user?.email || 'User'}
                </CardTitle>
                <CardDescription>
                  {profile?.bio || (profile?.account_type === 'employer' ? 'Employer' : 'Job Seeker')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.experience_years && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile.experience_years} years experience</span>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completeness</span>
                    <span className="text-sm text-muted-foreground">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                </div>
                
                <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            value={profileForm.first_name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={profileForm.last_name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience_years">Years of Experience</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          value={profileForm.experience_years}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, experience_years: e.target.value }))}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                          id="skills"
                          value={profileForm.skills}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, skills: e.target.value }))}
                          placeholder="React, TypeScript, Node.js"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEditProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.first_name || 'there'}! 
                {profile?.account_type === 'employer' 
                  ? " Here's what's happening with your job postings." 
                  : " Here's what's happening with your job search."
                }
              </p>
            </div>
            
            {profile?.account_type === 'employer' ? (
              // Employer Dashboard
              <>
                {/* Employer Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Posted Jobs</CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{postedJobs.length}</div>
                      <p className="text-xs text-muted-foreground">Total job postings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Applications</CardTitle>
                      <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{jobApplications.length}</div>
                      <p className="text-xs text-muted-foreground">Total applications received</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{postedJobs.filter(job => job.status === 'active').length}</div>
                      <p className="text-xs text-muted-foreground">Currently hiring</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="posted-jobs" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="posted-jobs">Posted Jobs</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="posted-jobs" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Your Posted Jobs</h3>
                      <Button onClick={() => navigate('/post-job')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Job
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i}>
                            <CardContent className="pt-6">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-muted rounded w-48"></div>
                                <div className="h-3 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : postedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {postedJobs.map((job) => (
                          <Card key={job.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-medium">{job.title}</h4>
                                  <p className="text-sm text-muted-foreground">{job.company}</p>
                                  <p className="text-xs text-muted-foreground">Posted {formatDate(job.created_at)}</p>
                                  <p className="text-xs text-muted-foreground">{job.location} • {job.type}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className={job.status === 'active' ? 'bg-success text-white' : 'bg-secondary'}>
                                    {job.status}
                                  </Badge>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => navigate(`/jobs/${job.id}`)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">No Jobs Posted Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start by posting your first job to attract candidates.
                          </p>
                          <Button onClick={() => navigate('/post-job')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Post Your First Job
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="applications" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Applications Received</h3>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i}>
                            <CardContent className="pt-6">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-muted rounded w-48"></div>
                                <div className="h-3 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : jobApplications.length > 0 ? (
                      <div className="space-y-4">
                        {jobApplications.map((app) => (
                          <Card key={app.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-medium">{app.jobs?.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Applicant: {app.profiles?.first_name} {app.profiles?.last_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Applied {formatDate(app.applied_at)}</p>
                                  {app.cover_letter && (
                                    <p className="text-xs text-muted-foreground">Cover letter included</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(app.status)} text-white`}>
                                    {app.status}
                                  </Badge>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleUpdateApplicationStatus(app.id, 'reviewed')}
                                      disabled={app.status !== 'pending'}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Review
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                                      disabled={app.status === 'rejected'}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">No Applications Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Applications for your job postings will appear here.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              // Job Seeker Dashboard
              <>
                {/* Job Seeker Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Applications</CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{applications.length}</div>
                      <p className="text-xs text-muted-foreground">Total applications</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                      <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{savedJobs.length}</div>
                      <p className="text-xs text-muted-foreground">Jobs saved</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">+12 from last week</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="applications" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                    <TabsTrigger value="interviews">Interviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="applications" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Your Applications</h3>
                      <Button variant="outline" size="sm" onClick={handleBrowseJobs}>
                        <Plus className="h-4 w-4 mr-2" />
                        Apply to More Jobs
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i}>
                            <CardContent className="pt-6">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-muted rounded w-48"></div>
                                <div className="h-3 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <Card key={app.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-medium">{app.jobs.title}</h4>
                                  <p className="text-sm text-muted-foreground">{app.jobs.company}</p>
                                  <p className="text-xs text-muted-foreground">Applied {formatDate(app.applied_at)}</p>
                                  {app.cover_letter && (
                                    <p className="text-xs text-muted-foreground">Cover letter submitted</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(app.status)} text-white`}>
                                    {app.status}
                                  </Badge>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewApplication(app.job_id)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View Job
                                    </Button>
                                    {app.status === 'pending' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleWithdrawApplication(app.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Withdraw
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">No Applications Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start applying to jobs to track your applications here.
                          </p>
                          <Button onClick={handleBrowseJobs}>
                            <Plus className="h-4 w-4 mr-2" />
                            Browse Jobs
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="saved" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Saved Jobs</h3>
                      <Button variant="outline" size="sm" onClick={handleBrowseJobs}>
                        Browse More Jobs
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                          <Card key={i}>
                            <CardContent className="pt-6">
                              <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-muted rounded w-48"></div>
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-16 bg-muted rounded"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : savedJobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedJobs.map((job) => (
                          <JobCard 
                            key={job.id} 
                            job={{
                              ...job,
                              salary: job.salary_min && job.salary_max 
                                ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`
                                : 'Competitive Salary',
                              postedAt: formatDate(job.created_at),
                              isRemote: job.is_remote,
                              isFeatured: job.is_featured,
                              tags: job.tags || []
                            }}
                            onApply={handleApply}
                            onSave={() => handleRemoveSaved((job as any).savedId)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">No Saved Jobs</h3>
                          <p className="text-muted-foreground mb-4">
                            Save jobs you're interested in to keep track of them here.
                          </p>
                          <Button onClick={handleBrowseJobs}>
                            Browse More Jobs
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="interviews" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Card key={i}>
                            <CardContent className="pt-6">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-muted rounded w-48"></div>
                                <div className="h-3 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : applications.filter(app => app.status.toLowerCase() === 'interview scheduled').length > 0 ? (
                      <div className="space-y-4">
                        {applications
                          .filter(app => app.status.toLowerCase() === 'interview scheduled')
                          .map((app) => (
                            <Card key={app.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <h4 className="font-medium">Interview - {app.jobs.title}</h4>
                                    <p className="text-sm text-muted-foreground">{app.jobs.company}</p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Applied {formatDate(app.applied_at)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="bg-success text-white">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Interview Scheduled
                                    </Badge>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleViewApplication(app.job_id)}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">No Interviews Scheduled</h3>
                          <p className="text-muted-foreground mb-4">
                            When you get interview invitations, they'll appear here.
                          </p>
                          <Button onClick={handleBrowseJobs}>
                            <Plus className="h-4 w-4 mr-2" />
                            Apply to More Jobs
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};