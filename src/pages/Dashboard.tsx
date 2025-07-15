import { useState } from 'react';
import { Header } from '@/components/Header';
import { JobCard } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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

export const Dashboard = () => {
  const [savedJobs] = useState([
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
    }
  ]);

  const [applications] = useState([
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      appliedAt: '2 days ago',
      status: 'Under Review',
      statusColor: 'bg-warning'
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'StartupCo',
      appliedAt: '1 week ago',
      status: 'Interview Scheduled',
      statusColor: 'bg-success'
    },
    {
      id: '3',
      jobTitle: 'Product Manager',
      company: 'ProductCorp',
      appliedAt: '2 weeks ago',
      status: 'Rejected',
      statusColor: 'bg-destructive'
    }
  ]);

  const profileCompleteness = 75;

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
                <CardTitle>John Doe</CardTitle>
                <CardDescription>Frontend Developer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>john.doe@email.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completeness</span>
                    <span className="text-sm text-muted-foreground">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                </div>
                
                <Button className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John! Here's what's happening with your job search.</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                  <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">+5 from last week</p>
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
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply to More Jobs
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{app.jobTitle}</h4>
                            <p className="text-sm text-muted-foreground">{app.company}</p>
                            <p className="text-xs text-muted-foreground">Applied {app.appliedAt}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${app.statusColor} text-white`}>
                              {app.status}
                            </Badge>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button variant="outline" size="sm">
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
              </TabsContent>
              
              <TabsContent value="saved" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Saved Jobs</h3>
                  <Button variant="outline" size="sm">
                    Browse More Jobs
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job}
                      onApply={(jobId) => console.log('Apply to job:', jobId)}
                      onSave={(jobId) => console.log('Remove from saved:', jobId)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="interviews" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Technical Interview</h4>
                        <p className="text-sm text-muted-foreground">Full Stack Engineer - StartupCo</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Tomorrow, 2:00 PM
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-success text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmed
                        </Badge>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            Join Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};