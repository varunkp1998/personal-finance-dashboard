import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ✅ Get Authorization token from request headers
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "No auth token provided" }, { status: 401 });
  }

  // ✅ Get user details using the provided token
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (!user) {
    return NextResponse.json({ error: "User not logged in" }, { status: 401 });
  }

  console.log("Authenticated User:", user);

  // ✅ Fetch transactions for the logged-in user
  const { data, error: fetchError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
