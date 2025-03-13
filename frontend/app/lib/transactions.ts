import { supabase } from "../lib/supabase";

// ✅ Fetch all transactions for the logged-in user
export async function getTransactions() {
  const user = await supabase.auth.getUser();
  if (!user.data.user) return { error: "User not logged in" };

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
export async function addTransaction(description, amount, type, category) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) return { error: "User not logged in" };

  const { error } = await supabase.from("transactions").insert([
    {
      description,
      amount,
      type,
      category,
      user_id: user.data.user.id, // Ensure user ID is stored
    },
  ]);

  if (error) {
    console.error("Error adding transaction:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

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
