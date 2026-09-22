import { supabase } from "./supabaseClient";

export async function getDailyPuzzle(id) {
  const { data, error } = await supabase
    .from("daily_puzzles")
    .select("shapes, hint")
    .eq("id", id)
    .maybeSingle();

  return { data, error };
}

export async function createDailyPuzzle(id, shapes, hint) {
  const { data, error } = await supabase
    .from("daily_puzzles")
    .insert({
      id,
      shapes,
      hint,
    })
    .select()
    .single();

  return { data, error };
}

export async function setDailyCompleted(userId, puzzleId) {
  const { data, error } = await supabase
    .from("daily_puzzle_progress")
    .upsert(
      {
        user_id: userId,
        puzzle_id: puzzleId,
      },
      {
        onConflict: "user_id,puzzle_id",
      }
    )
    .select();

  console.log(error);
  return { data, error };
}