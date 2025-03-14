import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
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
    <>
      <AppBar position="fixed" sx={{ backgroundColor: darkMode ? "#1e1e1e" : "#2c3e50" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* ✅ Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleToggleMobileMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* ✅ Responsive Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: { xs: "1rem", sm: "1.5rem" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Personal Finance Dashboard
          </Typography>

          {/* ✅ Dark Mode Toggle */}
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* ✅ Desktop Navigation Links - Hidden on Mobile */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button color="inherit" component={Link} href="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} href="/transactions">
              Transactions
            </Button>
            <Button color="inherit" component={Link} href="/profile">
              Profile
            </Button>
            <Button onClick={handleLogout} variant="contained" color="error">
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Mobile Drawer Menu */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleToggleMobileMenu}>
        <List sx={{ width: 250 }}>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/dashboard" onClick={handleToggleMobileMenu}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/transactions" onClick={handleToggleMobileMenu}>
              <ListItemText primary="Transactions" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/profile" onClick={handleToggleMobileMenu}>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "red" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
