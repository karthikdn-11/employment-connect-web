-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')) NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT,
  is_remote BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Jobs are viewable by everyone" 
ON public.jobs 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (auth.uid() = posted_by);

CREATE POLICY "Users can delete their own jobs" 
ON public.jobs 
FOR DELETE 
USING (auth.uid() = posted_by);

-- Add trigger for timestamps
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample job data
INSERT INTO public.jobs (title, company, location, type, salary_min, salary_max, description, requirements, is_remote, is_featured, tags) VALUES
('Senior Frontend Developer', 'TechCorp Inc.', 'San Francisco, CA', 'full-time', 120000, 160000, 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features using modern JavaScript frameworks.', 'React, TypeScript, 5+ years experience', true, true, ARRAY['React', 'TypeScript', 'JavaScript', 'CSS']),
('Full Stack Engineer', 'StartupXYZ', 'New York, NY', 'full-time', 100000, 140000, 'Join our fast-growing startup as a Full Stack Engineer. Work on cutting-edge technology and help shape the future of our platform.', 'Node.js, React, PostgreSQL, 3+ years experience', false, true, ARRAY['Node.js', 'React', 'PostgreSQL', 'AWS']),
('UI/UX Designer', 'DesignStudio', 'Los Angeles, CA', 'full-time', 80000, 110000, 'Create beautiful and intuitive user interfaces for our web and mobile applications. Collaborate with cross-functional teams to deliver exceptional user experiences.', 'Figma, Adobe Creative Suite, 3+ years experience', true, false, ARRAY['Figma', 'Design', 'UI/UX', 'Prototyping']),
('Data Scientist', 'DataCorp', 'Seattle, WA', 'full-time', 130000, 170000, 'Analyze large datasets to extract meaningful insights and build predictive models. Work with machine learning algorithms and statistical analysis.', 'Python, SQL, Machine Learning, 4+ years experience', true, true, ARRAY['Python', 'SQL', 'Machine Learning', 'Statistics']),
('DevOps Engineer', 'CloudTech', 'Austin, TX', 'full-time', 110000, 150000, 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability and scalability.', 'AWS, Docker, Kubernetes, 3+ years experience', true, false, ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD']),
('Mobile Developer', 'AppStudio', 'Boston, MA', 'full-time', 95000, 125000, 'Develop native mobile applications for iOS and Android platforms. Work with modern mobile development frameworks and tools.', 'React Native, Swift, Kotlin, 3+ years experience', false, false, ARRAY['React Native', 'Swift', 'Kotlin', 'Mobile']),
('Product Manager', 'InnovateCorp', 'Chicago, IL', 'full-time', 120000, 160000, 'Lead product development from conception to launch. Work with engineering, design, and business teams to deliver successful products.', 'Product Management, Agile, 5+ years experience', true, true, ARRAY['Product Management', 'Agile', 'Strategy', 'Analytics']),
('Backend Developer', 'ServerTech', 'Denver, CO', 'full-time', 105000, 135000, 'Design and implement scalable backend systems and APIs. Work with microservices architecture and cloud technologies.', 'Node.js, Python, MongoDB, 4+ years experience', true, false, ARRAY['Node.js', 'Python', 'MongoDB', 'Microservices']),
('Marketing Specialist', 'BrandCorp', 'Miami, FL', 'full-time', 60000, 80000, 'Develop and execute marketing campaigns across digital channels. Analyze campaign performance and optimize for better results.', 'Digital Marketing, Google Analytics, 2+ years experience', false, false, ARRAY['Digital Marketing', 'SEO', 'Social Media', 'Analytics']),
('Sales Representative', 'SalesPro', 'Phoenix, AZ', 'full-time', 50000, 90000, 'Build relationships with potential clients and drive revenue growth. Present products and services to prospects and close deals.', 'Sales experience, Communication skills, CRM experience', false, false, ARRAY['Sales', 'CRM', 'Communication', 'B2B']),
('Software Engineer Intern', 'TechCorp Inc.', 'Remote', 'internship', 25, 35, 'Join our engineering team as an intern and gain hands-on experience with modern web technologies. Work on real projects alongside senior developers.', 'Computer Science student, Basic programming knowledge', true, false, ARRAY['Internship', 'JavaScript', 'Learning', 'Mentorship']),
('Freelance Graphic Designer', 'Various Clients', 'Remote', 'contract', 40, 80, 'Create visual designs for various clients including logos, branding materials, and marketing collateral. Flexible hours and project-based work.', 'Adobe Creative Suite, Portfolio, 2+ years experience', true, false, ARRAY['Graphic Design', 'Freelance', 'Adobe', 'Branding']),
('Part-time Content Writer', 'ContentCorp', 'Remote', 'part-time', 25, 40, 'Write engaging content for blogs, websites, and social media. Research topics and create compelling narratives that resonate with target audiences.', 'Writing experience, SEO knowledge, Portfolio', true, false, ARRAY['Content Writing', 'SEO', 'Blogging', 'Research']);