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

import DeleteIcon from "@mui/icons-material/Delete";

import MainLayout from "../layouts/MainLayout";

import { useEffect, useState } from "react";

import api from "../services/api";

function Funcionarios() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cargo, setCargo] = useState("");

  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  async function carregarFuncionarios() {
    try {
      const response = await api.get("/funcionarios");

      setFuncionarios(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  async function cadastrarFuncionario() {
    try {
      const novoFuncionario = {
        nome,
        matricula,
        cargo,
      };

      await api.post("/funcionarios", novoFuncionario);

      await carregarFuncionarios();

      setNome("");
      setMatricula("");
      setCargo("");

    } catch (error) {
      console.log(error);
    }
  }

  async function deletarFuncionario(id: number) {
    try {
      await api.delete(`/funcionarios/${id}`);

      await carregarFuncionarios();

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Funcionários
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <TextField
              label="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />

            <TextField
              label="Cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={cadastrarFuncionario}
            >
              Cadastrar
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {funcionarios.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell>
                      {funcionario.nome}
                    </TableCell>

                    <TableCell>
                      {funcionario.matricula}
                    </TableCell>

                    <TableCell>
                      {funcionario.cargo}
                    </TableCell>

                    <TableCell>
                      <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          deletarFuncionario(funcionario.id)
                        }
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

export default Funcionarios;