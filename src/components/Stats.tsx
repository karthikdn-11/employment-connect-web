import { Users, Briefcase, Building2, TrendingUp } from 'lucide-react';

export const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Job Seekers',
      color: 'text-primary'
    },
    {
      icon: Briefcase,
      value: '15K+',
      label: 'Job Listings',
      color: 'text-accent'
    },
    {
      icon: Building2,
      value: '2K+',
      label: 'Companies',
      color: 'text-success'
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Success Rate',
      color: 'text-warning'
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join thousands of professionals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with top companies and find your next opportunity in our thriving job marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-md mb-4 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};