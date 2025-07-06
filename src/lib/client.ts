import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.OPENCHESS_SUPABASE_URL!,
  process.env.OPENCHESS_SUPABASE_SERVICE_ROLE_KEY!,
);
