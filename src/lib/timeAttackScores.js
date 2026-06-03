import { supabase } from "./supabaseClient";

export async function saveTimeAttackScore({ userId, score }) {
  const { error } = await supabase
    .from("time_attack_scores")
    .insert([
      {
        user_id: userId,
        score,
      },
    ]);

  return { error };
}

export async function getBestTimeAttackScore(userId) {
  const { data, error } = await supabase
    .from("time_attack_scores")
    .select("score")
    .eq("user_id", userId)
    .order("score", { ascending: false });

  console.log("RAW DATA:", data);
  console.log("ERROR:", error);

  return {
    bestScore: data?.[0]?.score ?? 0,
    error,
  };
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("time_attack_leaderboard")
    .select("*")
    .order("best_score", { ascending: false })
    .limit(10);

  return { data, error };
}