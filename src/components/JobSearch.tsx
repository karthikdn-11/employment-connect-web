import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';

interface JobSearchProps {
  onSearch?: (filters: {
    query: string;
    location: string;
    jobType: string;
    salary: string;
  }) => void;
}

export const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');

  const handleSearch = () => {
    onSearch?.({
      query,
      location,
      jobType,
      salary
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Job title, keywords, or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Job Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={salary} onValueChange={setSalary}>
          <SelectTrigger>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Salary Range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-30k">$0 - $30k</SelectItem>
            <SelectItem value="30k-50k">$30k - $50k</SelectItem>
            <SelectItem value="50k-70k">$50k - $70k</SelectItem>
            <SelectItem value="70k-100k">$70k - $100k</SelectItem>
            <SelectItem value="100k+">$100k+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSearch}
          className="flex-1 sm:flex-none"
          size="lg"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Jobs
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setQuery('');
            setLocation('');
            setJobType('');
            setSalary('');
          }}
          size="lg"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};