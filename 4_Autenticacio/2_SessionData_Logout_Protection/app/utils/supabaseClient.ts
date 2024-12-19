import * as dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Carregar variables d'entorn
dotenv.config();

const supabaseUrl: string = "https://vsyidbwwlamucmzjqpca.supabase.co";
const supabaseKey: string | undefined = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_KEY environment variable");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
