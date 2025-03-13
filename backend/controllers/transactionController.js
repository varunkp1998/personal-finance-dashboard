import { supabase } from "../../frontend/app/lib/supabase";

// ✅ Fetch all transactions for the logged-in user
export async function getTransactions() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData?.user?.id) {
    console.error("User not authenticated:", userError?.message);
    return { error: "User not logged in" };
  }

  console.log("Fetching transactions for user:", userData.user.id);

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching transactions:", error.message);
    return { error: error.message };
  }

  console.log("✅ Fetched Transactions:", data);
  return data;
}
