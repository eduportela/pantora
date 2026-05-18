-- Add country column to existing tables (defaults to 'NO' for existing data)
ALTER TABLE public.listings ADD COLUMN country TEXT NOT NULL DEFAULT 'NO';
ALTER TABLE public.profiles ADD COLUMN country TEXT NOT NULL DEFAULT 'NO';
ALTER TABLE public.comments ADD COLUMN country TEXT NOT NULL DEFAULT 'NO';
ALTER TABLE public.notifications ADD COLUMN country TEXT NOT NULL DEFAULT 'NO';
ALTER TABLE public.reports ADD COLUMN country TEXT NOT NULL DEFAULT 'NO';
ALTER TABLE public.help_requests ADD COLUMN country TEXT NOT NULL DEFAULT 'NO';

CREATE INDEX idx_listings_country ON public.listings(country);
CREATE INDEX idx_profiles_country ON public.profiles(country);
CREATE INDEX idx_comments_country ON public.comments(country);
CREATE INDEX idx_notifications_country ON public.notifications(country);

-- Update handle_new_user to capture country from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', 'NO')
  );
  RETURN NEW;
END;
$function$;

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL DEFAULT 'NO',
  user_a UUID NOT NULL,
  user_b UUID NOT NULL,
  listing_id UUID,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conv_users_ordered CHECK (user_a < user_b),
  CONSTRAINT conv_unique UNIQUE (country, user_a, user_b, listing_id)
);
CREATE INDEX idx_conv_users ON public.conversations(user_a, user_b);
CREATE INDEX idx_conv_country ON public.conversations(country);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Participants can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Participants can update conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Admins can view all conversations"
  ON public.conversations FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete conversations"
  ON public.conversations FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  country TEXT NOT NULL DEFAULT 'NO',
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_msg_conv ON public.messages(conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
  ));

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
    )
  );

CREATE POLICY "Recipients can mark read"
  ON public.messages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.user_a OR auth.uid() = c.user_b)
  ));

CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete messages"
  ON public.messages FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Update conversation last_message_at on new message
CREATE OR REPLACE FUNCTION public.bump_conversation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bump_conversation
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation();

-- App settings table (global feature toggles)
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "App settings readable by everyone"
  ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "Admins manage app settings"
  ON public.app_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

INSERT INTO public.app_settings (key, value) VALUES ('chat_enabled', 'true'::jsonb);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;