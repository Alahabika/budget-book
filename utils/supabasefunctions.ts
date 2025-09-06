import { supabase } from "../utils/supabase"

export const getAllBudgets = async() =>{
    const budgets = await supabase.from("budget_book").select("*");
    return budgets;
};