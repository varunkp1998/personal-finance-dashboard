"use client";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: darkMode ? "#1e1e1e" : "#2c3e50" }}>
        <Toolbar>
          {/* ✅ Mobile Menu Button */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
            Personal Finance Dashboard
          </Typography>

          {/* ✅ Dark Mode Toggle */}
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* ✅ Desktop Navigation Links */}
          <div className="hidden md:flex">
            <Button color="inherit" component={Link} href="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} href="/transactions">Transactions</Button>
            <Button color="inherit" component={Link} href="/profile">Profile</Button>
            <Button onClick={handleLogout} variant="contained" color="error" sx={{ marginLeft: 2 }}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* ✅ Mobile Navigation Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }} onClick={toggleDrawer(false)}>
          <Link href="/dashboard" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link href="/transactions" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemText primary="Transactions" />
            </ListItem>
          </Link>
          <Link href="/profile" passHref legacyBehavior>
            <ListItem component="a">
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
          <ListItem component="button" onClick={handleLogout}>
  <ListItemText primary="Logout" />
</ListItem>

        </List>
      </Drawer>
    </>
  );
}
