import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2 } from "lucide-react";
import { ReportButton } from "@/components/ReportButton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { useLanguage } from "@/hooks/useLanguage";

interface CommentSectionProps {
  listingId: string;
}

export function CommentSection({ listingId }: CommentSectionProps) {
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const { t, lang } = useLanguage();
  const dateLocale = lang === "no" ? nb : enUS;

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles!comments_user_id_fkey(display_name, avatar_url)")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      if (!user || !content.trim()) return;
      const { error } = await supabase.from("comments").insert({ listing_id: listingId, user_id: user.id, content: content.trim() });
      if (error) throw error;
    },
    onSuccess: () => { setContent(""); queryClient.invalidateQueries({ queryKey: ["comments", listingId] }); },
    onError: () => toast.error(t("comments.error")),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["comments", listingId] }); },
  });

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground">{t("comments.title")} ({comments.length})</h4>
      {comments.map((comment: any) => (
        <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
            {comment.profiles?.avatar_url ? (
              <img src={comment.profiles.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
            ) : (
              <span className="text-xs font-bold text-accent-foreground">{(comment.profiles?.display_name || "?")[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{comment.profiles?.display_name || t("listing.anonymous")}</span>
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: dateLocale })}</span>
              <div className="ml-auto flex items-center gap-1">
                {user && user.id !== comment.user_id && <ReportButton reportType="comment" targetId={comment.id} />}
                {user?.id === comment.user_id && (
                  <button onClick={() => deleteComment.mutate(comment.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
            <p className="text-sm text-foreground mt-0.5">{comment.content}</p>
          </div>
        </div>
      ))}
      {user ? (
        <div className="flex gap-2">
          <Textarea placeholder={t("comments.placeholder")} value={content} onChange={(e) => setContent(e.target.value)} rows={2} className="resize-none" />
          <Button size="icon" variant="default" onClick={() => addComment.mutate()} disabled={!content.trim() || addComment.isPending}><Send className="w-4 h-4" /></Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">{t("comments.loginRequired")}</p>
      )}
    </div>
  );
}
