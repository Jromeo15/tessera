import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cbkxkncznylehxbsbqfj.supabase.co";

const supabaseKey =
  "sb_publishable_74MhzslRcPr3x8e-QBrqMA_HpNW9L2J";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);