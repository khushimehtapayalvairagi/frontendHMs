import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Toolbar,
  AppBar,
  CssBaseline,
  Paper,
} from "@mui/material";

import CreateSonography from "./CreateSonography";
import SonographyList from "./SonographyList";
import SonographyBulkUpload from "./SonographyBulkUpload";

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const drawerWidth = 240;

const SonographyDashboard = () => {
  const [selectedPage, setSelectedPage] =
    useState("dashboard");

  // =========================
  // PAGE RENDER
  // =========================


  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  localStorage.removeItem("currentVisitId");

  navigate("/");
};

  const renderPage = () => {
    switch (selectedPage) {
      case "create":
        return <CreateSonography />;

      case "list":
        return <SonographyList />;

          case "bulk":
      return <SonographyBulkUpload />;  

      default:
        return (
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Sonography Dashboard
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Welcome to Sonography Panel
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ========================= */}
      {/* TOP NAVBAR */}
      {/* ========================= */}

      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#1976d2",
        }}
      >


<Toolbar
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Typography variant="h6" noWrap>
    Sonography Panel
  </Typography>

  <Button
    variant="contained"
    color="error"
    onClick={handleLogout}
  >
    Logout
  </Button>
</Toolbar>


        {/* <Toolbar>
          <Typography variant="h6" noWrap>
            Sonography Panel
          </Typography>
        </Toolbar> */}
      </AppBar>

      {/* ========================= */}
      {/* LEFT SIDEBAR */}
      {/* ========================= */}

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#0f172a",
            color: "white",
          },
        }}
      >
        <Toolbar />

        <Box sx={{ overflow: "auto" }}>

          {/* TITLE */}

          <Typography
            variant="h5"
            sx={{
              p: 3,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Sonography
          </Typography>

          {/* MENU */}

          <List>

            <ListItemButton
              onClick={() =>
                setSelectedPage("dashboard")
              }
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton
              onClick={() =>
                setSelectedPage("create")
              }
            >
              <ListItemText primary="Create Sonography" />
            </ListItemButton>

            <ListItemButton
              onClick={() =>
                setSelectedPage("list")
              }
            >
              <ListItemText primary="Sonography List" />
            </ListItemButton>

            {/* <ListItemButton
  onClick={() =>
    setSelectedPage("bulk")
  }
>
  <ListItemText primary="Bulk Upload" />
</ListItemButton> */}

          </List>
        </Box>
      </Drawer>

      {/* ========================= */}
      {/* RIGHT CONTENT */}
      {/* ========================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f1f5f9",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Toolbar />

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          {renderPage()}
        </Paper>
      </Box>
    </Box>
  );
};

export default SonographyDashboard;











// import React from "react";
// import CreateSonography from "./CreateSonography";
// import ViewSonography from "./SonographyList";

// const SonographyDashboard = () => {
//   return (
//     <div>
//       <h2>Sonography Dashboard</h2>

//       <CreateSonography />

//       <hr />

//       <ViewSonography />
//     </div>
//   );
// };

// export default SonographyDashboard;