import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Heart, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary-light text-primary border-primary/20">
              <Heart className="h-3 w-3 mr-1" />
              About Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Connecting Talent with
              <span className="text-primary"> Opportunity</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              At JobConnect, we believe that finding the right job shouldn't be a job itself. 
              We're dedicated to making the hiring process more efficient, transparent, and rewarding for everyone involved.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                We're on a mission to revolutionize the way people find jobs and companies find talent. 
                By leveraging cutting-edge technology and human-centered design, we create meaningful 
                connections that drive careers forward and help businesses thrive.
              </p>
              <Button size="lg">
                Join Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>10,000+</CardTitle>
                  <CardDescription>Active Job Seekers</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>500+</CardTitle>
                  <CardDescription>Partner Companies</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>95%</CardTitle>
                  <CardDescription>Success Rate</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>24/7</CardTitle>
                  <CardDescription>Support Available</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience we create for our users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 text-primary mr-2" />
                  Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in open, honest communication throughout the entire hiring process. 
                  No hidden fees, no surprise requirements, just clear expectations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 text-primary mr-2" />
                  Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We continuously evolve our platform with the latest technology to provide 
                  the best possible experience for job seekers and employers alike.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 text-primary mr-2" />
                  Empowerment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We empower individuals to take control of their career journey and help 
                  companies build stronger, more diverse teams.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diverse team of passionate professionals is dedicated to creating the best job search experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>CEO & Founder</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Former tech executive with 15+ years of experience in building scalable platforms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle>Michael Chen</CardTitle>
                <CardDescription>CTO</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  AI and machine learning expert focused on creating intelligent matching algorithms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle>Emily Rodriguez</CardTitle>
                <CardDescription>Head of User Experience</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  UX designer passionate about creating intuitive and accessible user experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;