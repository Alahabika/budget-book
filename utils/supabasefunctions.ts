import { supabase } from "../utils/supabase"

export const getAllBudgets = async () => {
  return await supabase.from("transactions").select("*");
};
