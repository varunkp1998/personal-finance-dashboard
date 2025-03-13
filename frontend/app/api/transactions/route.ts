import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");

  console.log("Received Auth Header:", authHeader); // ✅ Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No auth token provided" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1].trim();
  
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const user = data.user;

  const { data: transactions, error: dbError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json(transactions);
}
