"use client";

import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

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

        {/* ✅ Navigation Links */}
        <Button color="inherit" component={Link} href="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/transactions">
          Transactions
        </Button>
        <Button color="inherit" component={Link} href="/profile">
          Profile
        </Button>

        {/* ✅ Logout Button */}
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          sx={{ marginLeft: 2 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
