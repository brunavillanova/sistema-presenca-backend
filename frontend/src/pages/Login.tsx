import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [erro, setErro] =
    useState("");

  async function fazerLogin() {

    try {

      const response =
        await api.post("/login", {
          usuario,
          senha,
        });

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          response.data.usuario
        )
      );

      // ADMIN
      if (
        response.data.usuario.tipo ===
        "admin"
      ) {
        navigate("/dashboard");
      }

      // FUNCIONÁRIO
      else {
        navigate("/presencas");
      }

    } catch (error: any) {

      setErro(
        error.response?.data?.mensagem
      );
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#f5f5f5",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent>

          <Typography
            variant="h4"
            sx={{ mb: 3 }}
          >
            Login
          </Typography>

          <Box
            sx={{
              display: "flex",

              flexDirection: "column",

              gap: 2,
            }}
          >
            <TextField
              label="Usuário"
              value={usuario}
              onChange={(e) =>
                setUsuario(
                  e.target.value
                )
              }
            />

            <TextField
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
            />

            <Button
              variant="contained"
              onClick={fazerLogin}
            >
              Entrar
            </Button>

            {erro && (
              <Typography
                color="error"
              >
                {erro}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;