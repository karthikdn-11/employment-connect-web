-- Fix issues with applications and job posting

-- First, ensure the applications table has proper RLS policies for employers to see applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.posted_by = auth.uid()
  )
);

-- Allow employers to update application status for their jobs
CREATE POLICY "Employers can update applications for their jobs" 
ON public.applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.posted_by = auth.uid()
  )
);

-- Allow users to delete (withdraw) their own applications
CREATE POLICY "Users can delete their own applications" 
ON public.applications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Ensure jobs posted by authenticated users have their posted_by field set correctly
-- This should happen automatically, but let's make sure there's a trigger for it
CREATE OR REPLACE FUNCTION public.set_job_posted_by()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set posted_by if it's not already set
  IF NEW.posted_by IS NULL THEN
    NEW.posted_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set posted_by when inserting jobs
DROP TRIGGER IF EXISTS set_job_posted_by_trigger ON public.jobs;
CREATE TRIGGER set_job_posted_by_trigger
  BEFORE INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_job_posted_by();

-- Update existing jobs that don't have posted_by set (for testing purposes)
-- This is just for the current test data
UPDATE public.jobs 
SET posted_by = (SELECT id FROM auth.users LIMIT 1)
WHERE posted_by IS NULL;