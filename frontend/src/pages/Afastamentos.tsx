import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
    Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";

import { useEffect, useState } from "react";
import api from "../services/api";





interface Funcionario {
  id: number;
  nome: string;
  matricula: string;
}

interface Afastamento {
  id: number;
  matricula: string;
  tipo: string;
  data_inicio: string;
  data_fim: string;
  observacao: string;
}

function Afastamentos() {
const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const [afastamentos, setAfastamentos] =useState<Afastamento[]>([]);

  const [matricula, setMatricula] = useState("");

  const [tipo, setTipo] = useState("Ferias");

  const [dataInicio, setDataInicio] = useState("");

  const [dataFim, setDataFim] = useState("");

  const [observacao, setObservacao] = useState("");

  async function carregarFuncionarios() {
    const { data } = await api.get("/funcionarios");
    setFuncionarios(data);
  }



async function carregarAfastamentos() {
  const { data } = await api.get("/afastamentos");
  setAfastamentos(data);
}

async function salvar() {

  try {

    const response = await api.post("/afastamentos", {
      matricula,
      tipo,
      data_inicio: dataInicio,
      data_fim: dataFim,
      observacao,
    });

    console.log(response.data);

    alert("Afastamento cadastrado com sucesso!");

    carregarAfastamentos();

    setMatricula("");
    setTipo("Ferias");
    setDataInicio("");
    setDataFim("");
    setObservacao("");

  } catch (error: any) {

    console.log(error);
    console.log(error.response);

    alert(
      JSON.stringify(error.response?.data)
    );

  }

}

async function excluirAfastamento(id: number) {

  const confirmar = window.confirm(
    "Deseja realmente excluir este afastamento?"
  );

  if (!confirmar) return;

  try {

    await api.delete(`/afastamentos/${id}`);

    alert("Afastamento excluído com sucesso!");

    carregarAfastamentos();

  } catch (error) {

    console.log(error);

    alert("Erro ao excluir afastamento.");

  }

}

useEffect(() => {

  carregarFuncionarios();

  carregarAfastamentos();

}, []);

  return (
    <Box
  sx={{
    p: 4,
  }}
>

      <Paper sx={{ p: 3 }}>

       <Typography
        variant="h5"
        sx={{ mb: 3 }}
        >
        Gerenciar Afastamentos
        </Typography>

        <TextField
          fullWidth
          select
          label="Funcionário"
          sx={{ mb: 2 }}
          value={matricula}
          onChange={(e) =>
            setMatricula(e.target.value)
          }
        >

          {funcionarios.map((f) => (
            <MenuItem
              key={f.id}
              value={f.matricula}
            >
              {f.nome}
            </MenuItem>
          ))}

        </TextField>

        <TextField
          fullWidth
          select
          label="Tipo"
          sx={{ mb: 2 }}
          value={tipo}
          onChange={(e) =>
            setTipo(e.target.value)
          }
        >
          <MenuItem value="Ferias">
            Férias
          </MenuItem>

          <MenuItem value="Licenca">
            Licença
          </MenuItem>

          <MenuItem value="Atestado">
            Atestado
          </MenuItem>

          <MenuItem value="Folga">
            Folga
          </MenuItem>

        </TextField>

       <TextField
  fullWidth
  type="date"
  label="Data Início"
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
  sx={{ mb: 2 }}
  value={dataInicio}
  onChange={(e) =>
    setDataInicio(e.target.value)
  }
/>

<TextField
  fullWidth
  type="date"
  label="Data Fim"
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
  sx={{ mb: 2 }}
  value={dataFim}
  onChange={(e) =>
    setDataFim(e.target.value)
  }
/>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Observação"
          sx={{ mb: 3 }}
          value={observacao}
          onChange={(e) =>
            setObservacao(e.target.value)
          }
        />

        <Button
          variant="contained"
          onClick={salvar}
        >
          Salvar
        </Button>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
  Afastamentos cadastrados
</Typography>

<TableContainer
  component={Paper}
  sx={{
    mt: 3,
    borderRadius: 3,
    boxShadow: 3,
    overflow: "hidden",
  }}
>

  <Table>

  <TableHead
  sx={{
    backgroundColor: "#7b001c",
  }}
>

      <TableRow>

        <TableCell
        sx={{
            color: "#fff",
            fontWeight: "bold",
        }}
        >
        Funcionário
        </TableCell>

       <TableCell sx={{ color:"#fff", fontWeight:"bold" }}>
        Tipo
        </TableCell>

        <TableCell sx={{ color:"#fff", fontWeight:"bold" }}>
        Início
        </TableCell>

        <TableCell sx={{ color:"#fff", fontWeight:"bold" }}>
        Fim
        </TableCell>

        <TableCell sx={{ color:"#fff", fontWeight:"bold" }}>
        Observação
        </TableCell>

        <TableCell
        align="center"
        sx={{ color:"#fff", fontWeight:"bold" }}
        >
        Ações
        </TableCell>

     

      </TableRow>

    </TableHead>

    <TableBody>

      {afastamentos.map((a) => {

        const funcionario =
          funcionarios.find(
            (f) => f.matricula === a.matricula
          );

        return (

          <TableRow key={a.id} hover>

            <TableCell>
              {funcionario?.nome}
            </TableCell>

            <TableCell>

              <Chip
                label={a.tipo}
                color={
                  a.tipo === "Ferias"
                    ? "success"
                    : a.tipo === "Licenca"
                    ? "warning"
                    : a.tipo === "Atestado"
                    ? "error"
                    : "info"
                }
              />

            </TableCell>

            <TableCell>
              {a.data_inicio}
            </TableCell>

            <TableCell>
              {a.data_fim}
            </TableCell>

            <TableCell>
              {a.observacao || "-"}
            </TableCell>

            <TableCell align="center">

             <IconButton color="primary">
  ✏️
</IconButton>

<IconButton
  color="error"
  onClick={() => excluirAfastamento(a.id)}
>
  🗑️
</IconButton>

            </TableCell>

          </TableRow>

        );

      })}

    </TableBody>

  </Table>

</TableContainer>

      </Paper>

    </Box>
  );
}

export default Afastamentos;