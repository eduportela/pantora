import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function useAppSetting<T = any>(key: string, defaultValue: T) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["app-setting", key],
    queryFn: async () => {
      const { data } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
      return (data?.value ?? defaultValue) as T;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`app-setting-${key}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings", filter: `key=eq.${key}` }, () => {
        qc.invalidateQueries({ queryKey: ["app-setting", key] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [key, qc]);

  return query;
}

export function useUpdateAppSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["app-setting", vars.key] });
    },
  });
}

export function useChatEnabled() {
  const { data } = useAppSetting<boolean>("chat_enabled", true);
  return data ?? true;
}
