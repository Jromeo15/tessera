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

  console.log("USER SETTINGS:", { userId, data });

  return data?.piece_style ?? "basic";
}
