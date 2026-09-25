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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/empresa.png";

const drawerWidth = 220;

function MainLayout({ children }: any) {
  const navigate = useNavigate();

  // Verifica o usuário salvo no navegador
  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  // Estados do modal de administrador
  const [modalAdmin, setModalAdmin] = useState(false);
  const [adminUsuario, setAdminUsuario] = useState("");
  const [adminSenha, setAdminSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  // ================================
  // SAIR DO SISTEMA
  // ================================
  function sair() {
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  // ================================
  // ABRIR MODAL ADMINISTRADOR
  // ================================
  function abrirLoginAdmin() {
    setAdminUsuario("");
    setAdminSenha("");
    setErroLogin("");
    setModalAdmin(true);
  }

  // ================================
  // FECHAR MODAL
  // ================================
  function fecharLoginAdmin() {
    setModalAdmin(false);
    setAdminUsuario("");
    setAdminSenha("");
    setErroLogin("");
  }

  // ================================
  // LOGIN ADMINISTRADOR
  // ================================
  function entrarComoAdministrador() {
    setErroLogin("");

    if (
      adminUsuario === "admin" &&
      adminSenha === "123456"
    ) {
      const usuarioAdmin = {
        usuario: "admin",
        tipo: "admin",
      };

      // Salva o administrador no localStorage
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioAdmin)
      );

      // Fecha o modal
      setModalAdmin(false);

      // Limpa os campos
      setAdminUsuario("");
      setAdminSenha("");

      // Vai para o painel
      navigate("/dashboard");

      // Atualiza o layout para mostrar o menu de administrador
      window.location.reload();

      return;
    }

    setErroLogin("Usuário ou senha incorretos.");
  }

  return (
    <Box sx={{ display: "flex" }}>

      {/* =========================================
          BARRA SUPERIOR
      ========================================= */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#7b001c",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          {/* LOGO + TÍTULO */}
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

          {/* BOTÃO SAIR */}
          <Button
            color="inherit"
            onClick={sair}
          >
            Sair
          </Button>

        </Toolbar>
      </AppBar>

      {/* =========================================
          MENU LATERAL
      ========================================= */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            backgroundColor: "#f5f5f5",
            borderRight: "1px solid #ddd",
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "64px",
          },
        }}
      >
        <List>

          {/* =====================================
              PAINEL
          ===================================== */}
          {usuario.tipo === "admin" && (
            <ListItemButton
              component={Link}
              to="/dashboard"
            >
              <ListItemText primary="Painel" />
            </ListItemButton>
          )}

          {/* =====================================
              FUNCIONÁRIOS
          ===================================== */}
          {usuario.tipo === "admin" && (
            <ListItemButton
              component={Link}
              to="/funcionarios"
            >
              <ListItemText primary="Funcionários" />
            </ListItemButton>
          )}

          {/* =====================================
              CONTROLE DE AUSÊNCIAS
          ===================================== */}
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

          {/* =====================================
              PRESENÇAS
          ===================================== */}
          <ListItemButton
            component={Link}
            to="/presencas"
          >
            <ListItemText primary="Presenças" />
          </ListItemButton>

          {/* =====================================
              ADMINISTRADOR - USUÁRIO NORMAL
          ===================================== */}
          {usuario.tipo !== "admin" && (
            <ListItemButton
              onClick={abrirLoginAdmin}
              sx={{
                mt: 1,
                borderTop: "1px solid #ddd",
                pt: 2,
                color: "#7b001c",

                "&:hover": {
                  backgroundColor: "#fcecef",
                },
              }}
            >

              <Box
                component="span"
                sx={{
                  mr: 1.5,
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                🔐
              </Box>

              <ListItemText
                primary="Administrador"
                secondary="Acesso restrito"
              />

            </ListItemButton>
          )}

          {/* =====================================
              ADMINISTRADOR - LOGADO
          ===================================== */}
          {usuario.tipo === "admin" && (
            <ListItemButton
              sx={{
                mt: 1,
                borderTop: "1px solid #ddd",
                pt: 2,
                color: "#7b001c",
                cursor: "default",

                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >

              <Box
                component="span"
                sx={{
                  mr: 1.5,
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                🔐
              </Box>

              <ListItemText
                primary="Administrador"
                secondary="Acesso ativo"
              />

            </ListItemButton>
          )}

        </List>
      </Drawer>

      {/* =========================================
          CONTEÚDO DA PÁGINA
      ========================================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "64px",
          minWidth: 0,
        }}
      >
        {children}
      </Box>

      {/* =========================================
          MODAL DE LOGIN DO ADMINISTRADOR
      ========================================= */}
      <Dialog
        open={modalAdmin}
        onClose={fecharLoginAdmin}
        fullWidth
        maxWidth="xs"
      >

        {/* TÍTULO DO MODAL */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >

            <Box
              component="span"
              sx={{
                fontSize: 22,
              }}
            >
              🔒
            </Box>

            <Box
              component="span"
              sx={{
                fontWeight: 700,
              }}
            >
              Acesso Administrador
            </Box>

          </Box>

          {/* BOTÃO X */}
          <IconButton
            onClick={fecharLoginAdmin}
          >
            <Box
              component="span"
              sx={{
                fontSize: 25,
              }}
            >
              ×
            </Box>
          </IconButton>

        </DialogTitle>

        <Divider />

        {/* =====================================
            CAMPOS DO LOGIN
        ===================================== */}
        <DialogContent
          sx={{
            pt: 3,
          }}
        >

          {/* USUÁRIO */}
          <TextField
            fullWidth
            label="Usuário"
            value={adminUsuario}
            onChange={(e) =>
              setAdminUsuario(e.target.value)
            }
            autoFocus
            sx={{
              mb: 2,
            }}
          />

          {/* SENHA */}
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={adminSenha}
            onChange={(e) =>
              setAdminSenha(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                entrarComoAdministrador();
              }
            }}
          />

          {/* ERRO DE LOGIN */}
          {erroLogin && (
            <Box
              component="div"
              sx={{
                color: "#d32f2f",
                mt: 2,
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {erroLogin}
            </Box>
          )}

        </DialogContent>

        {/* =====================================
            BOTÕES DO MODAL
        ===================================== */}
        <DialogActions
          sx={{
            p: 2,
          }}
        >

          <Button
            onClick={fecharLoginAdmin}
          >
            CANCELAR
          </Button>

          <Button
            variant="contained"
            onClick={entrarComoAdministrador}
            sx={{
              backgroundColor: "#8b001f",

              "&:hover": {
                backgroundColor: "#6d0018",
              },

              fontWeight: 700,
            }}
          >
            ENTRAR
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default MainLayout;