-- Fix the search path issue for the set_job_posted_by function
CREATE OR REPLACE FUNCTION public.set_job_posted_by()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set posted_by if it's not already set
  IF NEW.posted_by IS NULL THEN
    NEW.posted_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;