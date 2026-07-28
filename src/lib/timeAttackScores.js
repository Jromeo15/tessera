import { supabase } from "./supabaseClient";

const scoreTables = {
  easy: "time_attack_scores",
  medium: "time_attack_scores_medium",
  hard: "time_attack_scores_hard",
};

const leaderboardTables = {
  easy: "time_attack_leaderboard",
  medium: "time_attack_leaderboard_medium",
  hard: "time_attack_leaderboard_hard",
};

export async function saveTimeAttackScore({
  userId,
  score,
  difficulty = "easy",
}) {
  const { error } = await supabase
    .from(scoreTables[difficulty])
    .insert([
      {
        user_id: userId,
        score,
      },
    ]);

  return { error };
}

export async function getBestTimeAttackScore(
  userId,
  difficulty = "easy"
) {
  const { data, error } = await supabase
    .from(scoreTables[difficulty])
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

export async function getLeaderboard(
  difficulty = "easy"
) {
  const { data, error } = await supabase
    .from(leaderboardTables[difficulty])
    .select("*")
    .order("best_score", { ascending: false })
    .limit(10);

  return { data, error };
}