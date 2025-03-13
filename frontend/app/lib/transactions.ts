import { supabase } from "../lib/supabase";

// ✅ Fetch all transactions for the logged-in user
export async function getTransactions() {
  const user = await supabase.auth.getUser();
  if (!user.data.user) return { error: "User not logged in" };
  console.log(user)
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.data.user.id) // Fetch transactions for logged-in user
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }
  return data;
}

// ✅ Add a new transaction
export const addTransaction = async (description: string, amount: number, type: string, category: string) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log(userData)
    if (userError || !userData?.user?.id) {
      console.error("User not authenticated:", userError?.message);
      return { error: "User not authenticated" };
    }
  
    const userId = userData.user.id; // ✅ Ensure user ID is fetched
  
    const transactionData = {
      user_id: userId, // ✅ Now user_id will not be null
      description: description.trim() || "No Description",
      amount: parseFloat(amount.toString()),
      type: type.trim().charAt(0).toUpperCase() + type.trim().slice(1).toLowerCase(), // Ensure "Income" or "Expense"
      category: category.trim(),
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  
    console.log("Inserting transaction:", transactionData);
  
    const { data, error } = await supabase.from("transactions").insert([transactionData]);
  
    if (error) {
      console.error("Insert Error:", error.message);
    } else {
      console.log("Insert Success:", data);
    }
  
    return { data, error };
  };
      
  
// ✅ Edit a transaction
export async function updateTransaction(id, description, amount, type, category) {
  const { error } = await supabase
    .from("transactions")
    .update({ description, amount, type, category })
    .eq("id", id);

  if (error) {
    console.error("Error updating transaction:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

// ✅ Delete a transaction
export async function deleteTransaction(id) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error.message);
    return { error: error.message };
  }

  return { success: true };
}
