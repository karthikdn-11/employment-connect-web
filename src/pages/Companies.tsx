import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Users, Search, Filter, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  size: string;
  logo_url?: string;
  openJobs: number;
  website?: string;
  founded_year?: number;
}

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // Get all companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) throw companiesError;

      // Get job counts for each company
      const companiesWithJobCounts = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company', company.name)
            .eq('status', 'active');

          return {
            ...company,
            openJobs: count || 0
          };
        })
      );

      setCompanies(companiesWithJobCounts);
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Fallback to static data if database fails
      setCompanies([
        {
          id: '1',
          name: 'TechCorp Inc.',
          description: 'Leading technology company specializing in innovative software solutions and cutting-edge web development.',
          industry: 'Technology',
          location: 'San Francisco, CA',
          size: '1000-5000',
          openJobs: 15
        },
        {
          id: '2',
          name: 'StartupXYZ',
          description: 'Fast-growing startup revolutionizing the e-commerce space with AI-powered solutions.',
          industry: 'E-commerce',
          location: 'New York, NY',
          size: '50-200',
          openJobs: 8
        },
        {
          id: '3',
          name: 'DesignStudio',
          description: 'Creative agency focused on brand identity, UX/UI design, and digital marketing solutions.',
          industry: 'Design',
          location: 'Los Angeles, CA',
          size: '10-50',
          openJobs: 5
        },
        {
          id: '4',
          name: 'DataCorp',
          description: 'Data analytics company helping businesses make informed decisions through advanced analytics.',
          industry: 'Analytics',
          location: 'Seattle, WA',
          size: '500-1000',
          openJobs: 12
        },
        {
          id: '5',
          name: 'CloudTech',
          description: 'Cloud infrastructure provider offering scalable solutions for modern businesses.',
          industry: 'Cloud Services',
          location: 'Austin, TX',
          size: '200-500',
          openJobs: 20
        },
        {
          id: '6',
          name: 'AppStudio',
          description: 'Mobile app development company creating innovative solutions for iOS and Android platforms.',
          industry: 'Mobile Development',
          location: 'Boston, MA',
          size: '100-200',
          openJobs: 7
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const industries = ['Technology', 'E-commerce', 'Design', 'Analytics', 'Cloud Services', 'Mobile Development'];
  const companySizes = ['1-10', '10-50', '50-200', '200-500', '500-1000', '1000-5000', '5000+'];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = !selectedSize || selectedSize === 'all' || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-muted rounded mt-3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary-light text-primary border-primary/20">
              <Building2 className="h-3 w-3 mr-1" />
              Companies
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Discover Amazing
              <span className="text-primary"> Companies</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore top companies that are actively hiring and find your perfect workplace. 
              Browse through verified companies across various industries and company sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {companySizes.map(size => (
                  <SelectItem key={size} value={size}>{size} employees</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {company.size} employees
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{company.industry}</Badge>
                      <span className="text-sm font-medium text-primary">
                        {company.openJobs} open jobs
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
                      View Company
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find more companies.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Companies;