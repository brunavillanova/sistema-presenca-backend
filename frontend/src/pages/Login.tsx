import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function entrar() {
    navigate("/presencas");
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
      <Card
        sx={{
          width: 400,
          maxWidth: "90%",
        }}
      >
        <CardContent>

          {/* LOGO FICTÍCIO */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "#7b001c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              TP
            </Box>
          </Box>

          {/* NOME DA EMPRESA */}
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              textAlign: "center",
              fontWeight: 700,
              color: "#7b001c",
            }}
          >
            TechPoint
          </Typography>

          <Typography
            sx={{
              mb: 3,
              textAlign: "center",
              color: "#666",
            }}
          >
            Sistema de Presença
          </Typography>

          {/* BOTÃO */}
          <Button
            fullWidth
            variant="contained"
            onClick={entrar}
            sx={{
              backgroundColor: "#7b001c",
              py: 1.5,

              "&:hover": {
                backgroundColor: "#5f0016",
              },
            }}
          >
            Entrar
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;