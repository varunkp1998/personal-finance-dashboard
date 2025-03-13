import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; // Ensure correct import

export async function GET() {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "User not logged in" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
