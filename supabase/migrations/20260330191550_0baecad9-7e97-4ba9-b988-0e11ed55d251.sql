
-- Allow admins to delete any listing
CREATE POLICY "Admins can delete any listing"
ON public.listings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete any comment
CREATE POLICY "Admins can delete any comment"
ON public.comments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
