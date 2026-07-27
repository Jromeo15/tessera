import { supabase } from "./supabaseClient";

export async function getDailyPuzzle(id) {
  const { data, error } = await supabase
    .from("daily_puzzles")
    .select("shapes")
    .eq("id", id)
    .maybeSingle();

  return { data, error };
}

export async function createDailyPuzzle(id, shapes) {
    const { data, error } = await supabase
      .from("daily_puzzles")
      .insert({
        id,
        shapes,
      })
      .select()
      .single();
  
    return { data, error };
  }