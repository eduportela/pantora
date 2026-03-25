
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  phone_public BOOLEAN NOT NULL DEFAULT false,
  email_public BOOLEAN NOT NULL DEFAULT false,
  address_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER,
  location TEXT NOT NULL,
  bottle_count INTEGER DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'sell' CHECK (type IN ('sell', 'donate')),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by everyone" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Users can create listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own listings" ON public.listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own listings" ON public.listings FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment', 'interaction')),
  title TEXT NOT NULL,
  body TEXT,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Function to create notification on new comment
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  listing_owner_id UUID;
  commenter_name TEXT;
  listing_title TEXT;
BEGIN
  SELECT l.user_id, l.title INTO listing_owner_id, listing_title
  FROM public.listings l WHERE l.id = NEW.listing_id;

  IF listing_owner_id != NEW.user_id THEN
    SELECT p.display_name INTO commenter_name
    FROM public.profiles p WHERE p.user_id = NEW.user_id;

    INSERT INTO public.notifications (user_id, type, title, body, listing_id, from_user_id)
    VALUES (listing_owner_id, 'comment', 
      COALESCE(commenter_name, 'Noen') || ' kommenterte på annonsen din',
      LEFT(NEW.content, 100),
      NEW.listing_id, NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_new_comment
AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('listings', 'listings', true);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Listing images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'listings');
CREATE POLICY "Users can upload listing images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update listing images" ON storage.objects FOR UPDATE USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete listing images" ON storage.objects FOR DELETE USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
