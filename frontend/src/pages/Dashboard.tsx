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

  const [totalFuncionarios, setTotalFuncionarios] = useState(0);

  const [presentesHoje, setPresentesHoje] = useState(0);

  const [funcionariosFerias, setFuncionariosFerias] = useState(0);

  const [funcionariosLicenca, setFuncionariosLicenca] = useState(0);



  async function carregarDados() {

    try {

      // FUNCIONÁRIOS
      const responseFuncionarios =
        await api.get("/funcionarios");

      setTotalFuncionarios(
        responseFuncionarios.data.length
      );

      // AFASTAMENTOS
      const responseAfastamentos =
        await api.get("/afastamentos");

      const hoje = new Date()
        .toISOString()
        .split("T")[0];

      const afastamentosAtivos =
        responseAfastamentos.data.filter(
          (a: any) =>
            a.data_inicio <= hoje &&
            a.data_fim >= hoje
        );

      const ferias = [
        ...new Set(
          afastamentosAtivos
            .filter(
              (a: any) => a.tipo === "Ferias"
            )
            .map(
              (a: any) => a.matricula
            )
        ),
      ];

      setFuncionariosFerias(
        ferias.length
      );

      const licencas = [
        ...new Set(
          afastamentosAtivos
            .filter(
              (a: any) => a.tipo === "Licenca"
            )
            .map(
              (a: any) => a.matricula
            )
        ),
      ];

      setFuncionariosLicenca(
        licencas.length
      );


      // PRESENÇAS
      const responsePresencas =
        await api.get("/presencas");

      setPresentesHoje(
        responsePresencas.data.length
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
          backgroundColor: "rgba(0,0,0,0.55)",
          backgroundBlendMode: "darken",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
          borderRadius: 3,
        }}
      >

        <Typography
          variant="h2"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            mb: 5,
            textShadow:
              "2px 2px 10px rgba(0,0,0,0.7)",
          }}
        >
          Painel
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >

          <Card sx={{ minWidth: 230, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Funcionários
              </Typography>

              <Typography variant="h3">
                {totalFuncionarios}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 230, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Presentes Hoje
              </Typography>

              <Typography variant="h3">
                {presentesHoje}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 230, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Faltas
              </Typography>

              <Typography variant="h3">
                {totalFuncionarios - presentesHoje}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 230, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Férias
              </Typography>

              <Typography variant="h3">
                {funcionariosFerias}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 230, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6">
                Licença
              </Typography>

              <Typography variant="h3">
                {funcionariosLicenca}
              </Typography>
            </CardContent>
          </Card>

        

        </Box>

      </Box>

    </MainLayout>

  );

}

export default Dashboard;