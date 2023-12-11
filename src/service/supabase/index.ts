import { createClient } from "@supabase/supabase-js";
import { config } from "@config/config";

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;
const jwtToken = config.JWT_SECRET;

const supabase = createClient(supabaseUrl, supabaseKey);

export const handleLoginSupabase = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: config.EMAIL,
    password: config.SENHA,
  });

  if (error) {
    return;
  }

  if (data) {
    const { session } = data;

    supabase.auth.setSession(session);
  }
};
