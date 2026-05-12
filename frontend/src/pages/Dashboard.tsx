import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import MainLayout from "../layouts/MainLayout";



import fundo from "../assets/empresa1.jpg";

import { useEffect, useState } from "react";

import api from "../services/api";

function Dashboard() {
  const [totalFuncionarios, setTotalFuncionarios] =
    useState(0);

  const [presentesHoje, setPresentesHoje] =
    useState(0);

  async function carregarDados() {
    try {
      // FUNCIONÁRIOS
      const responseFuncionarios =
        await api.get("/funcionarios");

      setTotalFuncionarios(
        responseFuncionarios.data.length
      );

      // PRESENÇAS
      const responsePresencas =
        await api.get("/presencas");
        console.log(
        responsePresencas.data
      );

     const hoje = new Date();

      const mes =
        String(
          hoje.getMonth() + 1
        ).padStart(2, "0");

      const dia =
        String(
          hoje.getDate()
        ).padStart(2, "0");

      const ano =
        hoje.getFullYear();

      const dataHoje =
        `${mes}/${dia}/${ano}`;

      const presencasHoje =
        responsePresencas.data.filter(
          (presenca: any) =>
            presenca.data === dataHoje
        );

      setPresentesHoje(
        presencasHoje.length
      );

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: "100vh",

          backgroundImage: `url(${fundo})`,

          backgroundSize: "cover",

          backgroundPosition: "center",

          backgroundColor:
            "rgba(0,0,0,0.55)",

          backgroundBlendMode: "darken",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          padding: 3,

          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            justifyContent: "center",

            gap: 2,

            mb: 5,
          }}
        >
      

          <Typography
            variant="h2"
            sx={{
              color: "#fff",

              fontWeight: "bold",

              textShadow:
                "2px 2px 10px rgba(0,0,0,0.7)",
            }}
          >
            Painel
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",

            gap: 3,

            flexWrap: "wrap",

            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              minWidth: 250,

              backgroundColor:
                "rgba(255,255,255,0.9)",

              backdropFilter: "blur(5px)",

              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6">
                Funcionários
              </Typography>

              <Typography variant="h3">
                {totalFuncionarios}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              minWidth: 250,

              backgroundColor:
                "rgba(255,255,255,0.9)",

              backdropFilter: "blur(5px)",

              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6">
                Presentes Hoje
              </Typography>

              <Typography variant="h3">
                {presentesHoje}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              minWidth: 250,

              backgroundColor:
                "rgba(255,255,255,0.9)",

              backdropFilter: "blur(5px)",

              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6">
                Faltas
              </Typography>

              <Typography variant="h3">
                {totalFuncionarios -
                  presentesHoje}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default Dashboard;