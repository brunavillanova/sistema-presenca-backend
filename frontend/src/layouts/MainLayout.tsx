import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/empresa.png";

const drawerWidth = 220;

function MainLayout({ children }: any) {

  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  function sair() {

    localStorage.removeItem("usuario");

    navigate("/login");
  }

  return (
    <Box sx={{ display: "flex" }}>

      {/* TOPO */}
      <AppBar
       position="fixed"
        sx={{
          backgroundColor: "#7b001c",
        }}
        >

        <Toolbar
          sx={{
            display: "flex",

            justifyContent:
              "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 2,
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: 40,
                height: 40,
                objectFit: "contain",
              }}
            />

            <Typography variant="h6">
              Sistema de Presença
            </Typography>
          </Box>

          <Button
            color="inherit"
            onClick={sair}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* MENU */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            backgroundColor: "#f5f5f5",
            borderRight: "1px solid #ddd",
            width: drawerWidth,

            boxSizing:
              "border-box",

            marginTop: "64px",
          },
        }}
      >
        <List>

          {/* DASHBOARD */}
          {usuario.tipo === "admin" && (

            <ListItemButton
              component={Link}
              to="/dashboard"
            >
              <ListItemText
                primary="Painel"
              />
            </ListItemButton>

          )}

          {/* FUNCIONÁRIOS */}
          {usuario.tipo === "admin" && (

            <ListItemButton
              component={Link}
              to="/funcionarios"
            >
              <ListItemText
                primary="Funcionários"
              />
            </ListItemButton>

          )}

          {/* AFASTAMENTOS */}
          {usuario.tipo === "admin" && (

            <ListItemButton
              component={Link}
              to="/afastamentos"
            >
              <ListItemText
                 primary="Controle de Ausências"
              />
            </ListItemButton>

          )}

          {/* PRESENÇAS */}
          <ListItemButton
            component={Link}
            to="/presencas"
          >
            <ListItemText
              primary="Presenças"
            />
          </ListItemButton>

        </List>
      </Drawer>

      {/* CONTEÚDO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,

          p: 3,

          marginTop: "64px",
        }}
      >
        {children}
      </Box>

    </Box>
  );
}

export default MainLayout;