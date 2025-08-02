import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  X, 
  MapPin, 
  Building2, 
  DollarSign, 
  Calendar, 
  Users, 
  Briefcase,
  Check,
  Star
} from 'lucide-react';

export const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
    isRemote: false,
    isFeatured: false
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to post a job');
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse salary range or use as single value
      let salaryMin = null;
      let salaryMax = null;
      
      if (jobData.salary) {
        const salaryMatch = jobData.salary.match(/\$?(\d+)(?:k?)?\s*-?\s*\$?(\d+)?(?:k?)?/i);
        if (salaryMatch) {
          salaryMin = parseInt(salaryMatch[1]) * (jobData.salary.toLowerCase().includes('k') ? 1000 : 1);
          if (salaryMatch[2]) {
            salaryMax = parseInt(salaryMatch[2]) * (jobData.salary.toLowerCase().includes('k') ? 1000 : 1);
          }
        } else {
          // Single number
          const singleSalary = parseInt(jobData.salary.replace(/\D/g, ''));
          if (singleSalary) {
            salaryMin = singleSalary * (jobData.salary.toLowerCase().includes('k') ? 1000 : 1);
          }
        }
      }

      const jobToInsert = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        description: jobData.description,
        requirements: jobData.requirements,
        salary_min: salaryMin,
        salary_max: salaryMax,
        is_remote: jobData.isRemote,
        is_featured: jobData.isFeatured,
        tags: skills,
        posted_by: user.id,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert([jobToInsert])
        .select()
        .single();

      if (error) throw error;

      console.log('Job posted:', { ...jobData, skills });
      toast.success('Job posted successfully!');
      
      // Reset form
      setJobData({
        title: '',
        company: '',
        location: '',
        type: '',
        salary: '',
        description: '',
        requirements: '',
        benefits: '',
        deadline: '',
        isRemote: false,
        isFeatured: false
      });
      setSkills([]);
      
      // Navigate to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Post a Job
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Connect with talented professionals and find your next great hire
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5" />
                        <span>Job Details</span>
                      </CardTitle>
                      <CardDescription>
                        Provide the basic information about the job position
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g. Senior Frontend Developer"
                            value={jobData.title}
                            onChange={(e) => setJobData({...jobData, title: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company *</Label>
                          <Input
                            id="company"
                            placeholder="e.g. TechCorp Inc."
                            value={jobData.company}
                            onChange={(e) => setJobData({...jobData, company: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              placeholder="e.g. San Francisco, CA"
                              value={jobData.location}
                              onChange={(e) => setJobData({...jobData, location: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Job Type *</Label>
                          <Select value={jobData.type} onValueChange={(value) => setJobData({...jobData, type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full Time</SelectItem>
                              <SelectItem value="part-time">Part Time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="freelance">Freelance</SelectItem>
                              <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salary">Salary Range *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="salary"
                              placeholder="e.g. $80k - $120k"
                              value={jobData.salary}
                              onChange={(e) => setJobData({...jobData, salary: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deadline">Application Deadline</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="deadline"
                              type="date"
                              value={jobData.deadline}
                              onChange={(e) => setJobData({...jobData, deadline: e.target.value})}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remote"
                            checked={jobData.isRemote}
                            onCheckedChange={(checked) => setJobData({...jobData, isRemote: checked as boolean})}
                          />
                          <Label htmlFor="remote">Remote work available</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="featured"
                            checked={jobData.isFeatured}
                            onCheckedChange={(checked) => setJobData({...jobData, isFeatured: checked as boolean})}
                          />
                          <Label htmlFor="featured">Featured listing (+$50)</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Job Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                      <CardDescription>
                        Describe the role and what you're looking for
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Job Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                          value={jobData.description}
                          onChange={(e) => setJobData({...jobData, description: e.target.value})}
                          rows={6}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="requirements">Requirements *</Label>
                        <Textarea
                          id="requirements"
                          placeholder="List the required qualifications, skills, and experience..."
                          value={jobData.requirements}
                          onChange={(e) => setJobData({...jobData, requirements: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="benefits">Benefits</Label>
                        <Textarea
                          id="benefits"
                          placeholder="Describe the benefits, perks, and what makes your company great..."
                          value={jobData.benefits}
                          onChange={(e) => setJobData({...jobData, benefits: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Skills & Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Tags</CardTitle>
                      <CardDescription>
                        Add relevant skills and technologies
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a skill or technology"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Job Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Job Title:</span>
                          <span className="text-sm font-medium">{jobData.title || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Company:</span>
                          <span className="text-sm font-medium">{jobData.company || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Location:</span>
                          <span className="text-sm font-medium">{jobData.location || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="text-sm font-medium">{jobData.type || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Salary:</span>
                          <span className="text-sm font-medium">{jobData.salary || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Pricing</h4>
                        <div className="flex justify-between">
                          <span className="text-sm">Standard Listing:</span>
                          <span className="text-sm font-medium">$99</span>
                        </div>
                        {jobData.isFeatured && (
                          <div className="flex justify-between">
                            <span className="text-sm">Featured Listing:</span>
                            <span className="text-sm font-medium">+$50</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${jobData.isFeatured ? '149' : '99'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">What's Included</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center space-x-2">
                            <Check className="h-3 w-3 text-success" />
                            <span>30-day job listing</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="h-3 w-3 text-success" />
                            <span>Unlimited applications</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="h-3 w-3 text-success" />
                            <span>Applicant management</span>
                          </li>
                          {jobData.isFeatured && (
                            <li className="flex items-center space-x-2">
                              <Star className="h-3 w-3 text-warning" />
                              <span>Featured placement</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Publishing...' : 'Post Job'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};