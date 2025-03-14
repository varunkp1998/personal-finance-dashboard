"use client";

import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

interface NavbarProps {
  darkMode?: boolean; // ✅ Optional prop
  setDarkMode?: Dispatch<SetStateAction<boolean>>; // ✅ Optional prop
}

// ✅ Provide default props if not passed
export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (darkMode !== undefined) {
      setIsDark(darkMode);
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (setDarkMode) {
      setDarkMode(newMode);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: isDark ? "#1e1e1e" : "#2c3e50" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Personal Finance Dashboard
        </Typography>
        <DarkModeToggle darkMode={isDark} setDarkMode={handleToggleDarkMode} />

        <Button color="inherit" component={Link} href="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/transactions">
          Transactions
        </Button>
        <Button color="inherit" component={Link} href="/profile">
          Profile
        </Button>

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
