"use client";

import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    // Clear local storage and redirect after logout is complete
    localStorage.removeItem("user");

    router.replace("/login"); // ✅ Prevents glitching by ensuring smooth transition
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#2c3e50" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Personal Finance Dashboard
        </Typography>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
      </Toolbar>
    </AppBar>
  );
}
