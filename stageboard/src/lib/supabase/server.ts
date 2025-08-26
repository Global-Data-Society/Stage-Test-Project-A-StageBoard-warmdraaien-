import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseURL, supabaseServiceKey);