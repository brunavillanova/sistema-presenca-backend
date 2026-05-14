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

  const [presencas, setPresencas] =
    useState<any[]>([]);

  const [confirmacao, setConfirmacao] =
    useState<any>(null);

  const [erro, setErro] =
    useState("");

  async function carregarPresencas() {

    try {

      const response =
        await api.get("/presencas");

      setPresencas(response.data);

    } catch (error) {

      console.log(error);

    }
  }

  async function limparPresencas() {

    const confirmar = window.confirm(
      "Deseja apagar todas as presenças do dia?"
    );

    if (!confirmar) return;

    try {

      await api.delete(
        "/limpar-presencas"
      );

      setPresencas([]);

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

  }, []);

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
              }}
            >

              <Button
                variant="outlined"

                onClick={() => {

                  window.open(
                      "https://sistema-presenca-backend.onrender.com/exportar-excel"
                    );

                }}
              >
                Baixar Excel
              </Button>

              <Button
                variant="contained"

                color="error"

                onClick={
                  limparPresencas
                }
              >
                Limpar Presenças
              </Button>

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

                      </TableRow>
                    </TableHead>

                    <TableBody>

                      {presencas
                        .slice(-10)
                        .reverse()
                        .map(
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