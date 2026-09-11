import { supabase } from "./supabaseClient";

export async function getUserPieceStyle(userId) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("piece_style")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo el estilo de piezas:", error);
    return "basic";
  }

  return data?.piece_style ?? "basic";
}
