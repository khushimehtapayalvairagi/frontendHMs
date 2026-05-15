import React, { useState } from "react";
import {
  AppBar, Toolbar, Box, Drawer, List, ListItem, ListItemText,
  ListItemIcon, IconButton, Typography, useMediaQuery
} from "@mui/material";

import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Science as LabIcon,
  Assignment as TestIcon,
  UploadFile as UploadIcon,
  Payment as PaymentIcon,
  Dashboard as DashboardIcon
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useNavigate, Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const drawerWidth = 260;

const LabDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleNav = (path, label) => {
    const token = localStorage.getItem("jwt");

    if (token) {
      setActiveMenu(label);
      navigate(path);
      if (isMobile) setMobileOpen(false);
    } else {
      toast.error("Please login first");
    }
  };

  // ✅ Sidebar Menu
  const drawerContent = (
    <Box sx={{ height: "100%" }}>
      <List>
        {[
          { label: "Dashboard", path: "/lab-dashboard", icon: <DashboardIcon /> },
          { label: "All Tests", path: "/lab-dashboard/tests", icon: <TestIcon /> },
          { label: "Add Test", path: "/lab-dashboard/add-test", icon: <LabIcon /> },
          // { label: "Upload Report", path: "/lab-dashboard/upload-report", icon: <UploadIcon /> },
          { label: "Payments", path: "/lab-dashboard/payments", icon: <PaymentIcon /> },
        ].map(({ label, path, icon }) => (
          <ListItem
            key={label}
            onClick={() => handleNav(path, label)}
            sx={{
              cursor: "pointer",
              px: 3,
              py: 1,
              backgroundColor: activeMenu === label ? "#e3f2fd" : "transparent",
              borderLeft: activeMenu === label ? "4px solid #1976d2" : "none",
              "&:hover": { backgroundColor: "#f5f5f5" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      {/* 🔵 AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "purple" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Menu Button */}
          <IconButton
            color="inherit"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logout */}
          <IconButton
            color="inherit"
            onClick={() => {
              localStorage.removeItem("jwt");
              window.location.href = "/";
            }}
          >
            <LogoutIcon />
          </IconButton>

        </Toolbar>
      </AppBar>

      {/* 🟣 Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            paddingTop: "64px",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 🟢 Main Content */}
      <Box sx={{ p: 3 }}>
        <Toolbar />

        <Typography variant="h6">
          Lab Management System
        </Typography>

        <Outlet />

        <ToastContainer />
      </Box>
    </Box>
  );
};

export default LabDashboard;


