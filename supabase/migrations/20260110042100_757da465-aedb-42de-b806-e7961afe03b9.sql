-- Create table for managing multiple tracking pixels per page
CREATE TABLE public.tracking_pixels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  pixel_type text NOT NULL DEFAULT 'facebook',
  pixel_id text NOT NULL,
  pages text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tracking_pixels ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage tracking pixels"
ON public.tracking_pixels
FOR ALL
USING (is_admin());

CREATE POLICY "Anyone can view active tracking pixels"
ON public.tracking_pixels
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_tracking_pixels_updated_at
BEFORE UPDATE ON public.tracking_pixels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_tracking_pixels_type ON public.tracking_pixels(pixel_type);
CREATE INDEX idx_tracking_pixels_pages ON public.tracking_pixels USING GIN(pages);