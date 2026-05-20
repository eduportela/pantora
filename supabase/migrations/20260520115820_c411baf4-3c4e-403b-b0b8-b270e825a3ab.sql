
CREATE TABLE public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  blocked_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, blocked_user_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own blocks"
  ON public.blocked_users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own blocks"
  ON public.blocked_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own blocks"
  ON public.blocked_users FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_blocked_users_user ON public.blocked_users(user_id);
CREATE INDEX idx_blocked_users_target ON public.blocked_users(blocked_user_id);

CREATE POLICY "Participants can delete conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE OR REPLACE FUNCTION public.delete_conversation_messages()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.messages WHERE conversation_id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER conversations_before_delete
BEFORE DELETE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.delete_conversation_messages();
