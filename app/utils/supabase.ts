import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database";

/**
 * Composable pour accéder au client Supabase typé
 * Utilise les variables d'environnement configurées dans nuxt.config.ts
 */
export const useSupabase = (): SupabaseClient<Database> => {
  const config = useRuntimeConfig();

  return createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
  );
};
