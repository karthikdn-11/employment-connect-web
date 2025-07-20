import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Building2, MapPin, Clock, DollarSign, Star, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedAt: string;
    isRemote: boolean;
    isFeatured: boolean;
    logo?: string;
    tags: string[];
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

export const JobCard = ({ job, onApply, onSave }: JobCardProps) => {
  const { toast } = useToast();
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {job.logo ? (
              <img 
                src={job.logo} 
                alt={`${job.company} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors cursor-pointer">
                  {job.title}
                </h3>
                {job.isFeatured && (
                  <Star className="h-4 w-4 text-warning fill-current" />
                )}
              </div>
              <p className="text-muted-foreground font-medium">{job.company}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onSave?.(job.id)}
            className="text-muted-foreground hover:text-primary"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
            {job.isRemote && (
              <Badge variant="secondary" className="ml-1">Remote</Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{job.postedAt}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{job.salary}</span>
          </div>
        </div>

        <p className="text-foreground mb-3 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-primary-light text-primary border-primary/20">
            {job.type}
          </Badge>
          {job.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center space-x-2 w-full">
          <Button 
            className="flex-1" 
            onClick={() => onApply?.(job.id)}
          >
            Apply Now
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = `/jobs/${job.id}`}>
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};