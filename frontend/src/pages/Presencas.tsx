import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import api from "../services/api";

function Presencas() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  const [matricula, setMatricula] =
    useState("");

  const [dataFiltro, setDataFiltro] =
    useState("");

  const [presencas, setPresencas] =
    useState<any[]>([]);

  const [confirmacao, setConfirmacao] =
    useState<any>(null);

  const [erro, setErro] =
    useState("");

  async function carregarPresencas() {

    try {

      const response =
        await api.get(
          `/presencas?data=${dataFiltro}`
        );

      setPresencas(response.data);

    } catch (error) {

      console.log(error);

    }
  }

  async function registrarPresenca() {

    try {

      setErro("");

      const response =
        await api.post(
          "/registrar-presenca",
          {
            matricula,
          }
        );

      setConfirmacao({
        nome:
          response.data.presenca.nome,

        matricula:
          response.data.presenca
            .matricula,

        data:
          response.data.presenca.data,

        hora:
          response.data.presenca.hora,

        status:
          response.data.presenca.status,

        atraso:
          response.data.presenca.atraso,
      });

      setMatricula("");

      carregarPresencas();

      setTimeout(() => {

        setConfirmacao(null);

      }, 5000);

    } catch (error: any) {

      setErro(
        error.response?.data
          ?.mensagem ||
        "Erro ao registrar presença"
      );

    }
  }

  useEffect(() => {

    carregarPresencas();

  }, [dataFiltro]);

  return (

    <MainLayout>

      <Box
        sx={{
          minHeight: "auto",

          display: "flex",

          alignItems: "center",

          flexDirection: "column",

          pt: 4,
        }}
      >

        {/* FUNCIONÁRIO */}
        {usuario.tipo !== "admin" && (

          <>

            <Typography
              variant="h4"
              sx={{
                mb: 4,

                fontWeight: "bold",
              }}
            >
              Registrar Presença
            </Typography>

            <Card
              sx={{
                mb: 3,

                width: 500,
              }}
            >
              <CardContent>

                <Box
                  sx={{
                    display: "flex",

                    flexDirection: "column",

                    gap: 2,
                  }}
                >

                  <TextField
                    label="Digite a matrícula"

                    value={matricula}

                    onChange={(e) =>
                      setMatricula(
                        e.target.value
                      )
                    }
                  />

                  <Button
                    variant="contained"

                    size="large"

                    onClick={
                      registrarPresenca
                    }
                  >
                    Registrar Presença
                  </Button>

                  {erro && (

                    <Typography
                      color="error"
                    >
                      {erro}
                    </Typography>

                  )}

                  {confirmacao && (

                    <Card
                      sx={{
                        backgroundColor:
                          "#d4edda",

                        border:
                          "1px solid #28a745",
                      }}
                    >
                      <CardContent>

                        <Typography
                          variant="h6"

                          sx={{
                            color:
                              "#155724",
                          }}
                        >
                          Presença Confirmada
                          ✅
                        </Typography>

                        <Typography>
                          Nome:
                          {" "}
                          {
                            confirmacao.nome
                          }
                        </Typography>

                        <Typography>
                          Matrícula:
                          {" "}
                          {
                            confirmacao.matricula
                          }
                        </Typography>

                        <Typography>
                          Data:
                          {" "}
                          {
                            confirmacao.data
                          }
                        </Typography>

                        <Typography>
                          Hora:
                          {" "}
                          {
                            confirmacao.hora
                          }
                        </Typography>

                        <Typography>
                          Status:
                          {" "}
                          {
                            confirmacao.status
                          }
                        </Typography>

                        <Typography>
                          Atraso:
                          {" "}
                          {
                            confirmacao.atraso
                          }
                        </Typography>

                      </CardContent>
                    </Card>

                  )}

                </Box>

              </CardContent>
            </Card>

          </>

        )}

        {/* ADMIN */}
        {usuario.tipo === "admin" && (

          <>

            <Typography
              variant="h4"
              sx={{
                mb: 3,

                fontWeight: "bold",
              }}
            >
              Painel de Presenças
            </Typography>

            <Box
              sx={{
                display: "flex",

                gap: 2,

                mb: 3,

                alignItems: "center",

                flexWrap: "wrap",
              }}
            >

              <TextField
                type="date"
                onChange={(e) => {

                  const data =
                    new Date(
                      e.target.value
                    );

                  const dia =
                    String(
                      data.getDate()
                    ).padStart(2, "0");

                  const mes =
                    String(
                      data.getMonth() + 1
                    ).padStart(2, "0");

                  const ano =
                    data.getFullYear();

                  const dataFormatada =
                    `${dia}/${mes}/${ano}`;

                  setDataFiltro(
                    dataFormatada
                  );
                }}
              />

             <Button
              variant="outlined"

              onClick={() => {

                const link =
                  document.createElement("a");

                link.href =
                  `https://sistema-presenca-backend.onrender.com/exportar-excel?data=${dataFiltro}`;

                link.download =
                  "presencas.xlsx";

                document.body.appendChild(
                  link
                );

                link.click();

                document.body.removeChild(
                  link
                );

              }}
            >
              Baixar Excel
            </Button>

              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                Total presentes:
                {" "}
                {presencas.length}
              </Typography>

            </Box>

            <Card
              sx={{
                width: "100%",
              }}
            >
              <CardContent>

                <TableContainer
                  component={Paper}
                >
                  <Table>

                    <TableHead>
                      <TableRow>

                        <TableCell>
                          Nome
                        </TableCell>

                        <TableCell>
                          Matrícula
                        </TableCell>

                        <TableCell>
                          Data
                        </TableCell>

                        <TableCell>
                          Hora
                        </TableCell>

                        <TableCell>
                          Status
                        </TableCell>

                        <TableCell>
                          Atraso
                        </TableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>

                      {presencas.map(
                        (
                          presenca,
                          index
                        ) => (

                          <TableRow
                            key={index}
                          >

                            <TableCell>
                              {
                                presenca.nome
                              }
                            </TableCell>

                            <TableCell>
                              {
                                presenca.matricula
                              }
                            </TableCell>

                            <TableCell>
                              {
                                presenca.data
                              }
                            </TableCell>

                            <TableCell>
                              {
                                presenca.hora
                              }
                            </TableCell>

                            <TableCell>
                              {
                                presenca.status
                              }
                            </TableCell>

                            <TableCell>
                              {
                                presenca.atraso
                              }
                            </TableCell>

                          </TableRow>

                        )
                      )}

                    </TableBody>

                  </Table>
                </TableContainer>

              </CardContent>
            </Card>

          </>

        )}

      </Box>

    </MainLayout>
  );
}

export default Presencas;