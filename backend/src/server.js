const express = require("express");
const cors = require("cors");

const fs = require("fs");
const path = require("path");

const ExcelJS = require("exceljs");

const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());

const caminhoUsuarios = path.join(
  __dirname,
  "usuarios.json"
);

const usuarios = JSON.parse(
  fs.readFileSync(
    caminhoUsuarios,
    "utf-8"
  )
);

// =========================
// FUNCIONÁRIOS
// =========================

// LISTAR FUNCIONÁRIOS
app.get("/funcionarios", async (req, res) => {

  const { data, error } =
    await supabase
      .from("funcionarios")
      .select("*")
      .order("nome", {
        ascending: true,
      });

  if (error) {

    console.log(error);

    return res
      .status(500)
      .json(error);

  }

  res.json(data);
});

// CADASTRAR FUNCIONÁRIO
app.post("/funcionarios", async (req, res) => {

  const {
    nome,
    matricula,
    cargo,
  } = req.body;

  const { data, error } =
    await supabase
      .from("funcionarios")
      .insert([
        {
          nome,
          matricula,
          cargo,
        },
      ])
      .select();

  if (error) {

    return res
      .status(500)
      .json(error);

  }

  res.json(data[0]);
});

// DELETAR FUNCIONÁRIO
app.delete(
  "/funcionarios/:id",
  async (req, res) => {

    const id =
      req.params.id;

    const { error } =
      await supabase
        .from("funcionarios")
        .delete()
        .eq("id", id);

    if (error) {

      return res
        .status(500)
        .json(error);

    }

    res.json({
      mensagem:
        "Funcionário removido",
    });
  }
);

// EDITAR FUNCIONÁRIO
app.put("/funcionarios/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nome,
      matricula,
      cargo,
    } = req.body;

    const { error } =
      await supabase
        .from("funcionarios")
        .update({
          nome,
          matricula,
          cargo,
        })
        .eq("id", id);

    if (error) {

      return res
        .status(500)
        .json(error);

    }

    res.json({
      mensagem:
        "Funcionário atualizado com sucesso",
    });

  } catch (error) {

    res
      .status(500)
      .json(error);

  }
});

// =========================
// PRESENÇAS
// =========================

// REGISTRAR PRESENÇA
app.post(
  "/registrar-presenca",
  async (req, res) => {

    const { matricula } =
      req.body;

    // procura funcionário
    const {
      data: funcionario,
      error:
        erroFuncionario,
    } = await supabase
      .from("funcionarios")
      .select("*")
      .eq(
        "matricula",
        matricula
      )
      .single();

    if (
      erroFuncionario ||
      !funcionario
    ) {

      return res
        .status(404)
        .json({
          mensagem:
            "Funcionário não encontrado",
        });

    }

    const agora =
      new Date();

    const data =
      agora.toLocaleDateString(
        "pt-BR",
        {
          timeZone:
            "America/Sao_Paulo",
        }
      );

    const hora =
      agora.toLocaleTimeString(
        "pt-BR",
        {
          timeZone:
            "America/Sao_Paulo",
          hour12: false,
        }
      );

    let status = "Presente";

    // verifica presença duplicada
    const {
      data:
        presencaExistente,
    } = await supabase
      .from("presencas")
      .select("*")
      .eq(
        "matricula",
        matricula
      )
      .eq("data", data)
      .single();

    if (
      presencaExistente
    ) {

      return res
        .status(400)
        .json({
          mensagem:
            "Presença já registrada hoje",
        });

    }

    const presenca = {
      nome:
        funcionario.nome,

      matricula:
        funcionario.matricula,

      data,

      hora,

      status,
    };

    // salva no banco
    const { error } =
      await supabase
        .from("presencas")
        .insert([
          presenca,
        ]);

    if (error) {

      return res
        .status(500)
        .json({
          mensagem:
            "Erro ao salvar presença",
        });

    }

    res.json({
      mensagem:
        "Presença registrada",

      presenca,
    });
  }
);

// LISTAR PRESENÇAS
app.get(
  "/presencas",
  async (req, res) => {

    const dataSelecionada =
      req.query.data;

    const hoje =
      new Date()
        .toLocaleDateString(
          "pt-BR",
          {
            timeZone:
              "America/Sao_Paulo",
          }
        );

    const dataFiltro =
      dataSelecionada || hoje;

    const {
      data,
      error,
    } = await supabase
      .from("presencas")
      .select("*")
      .eq("data", dataFiltro)
      .order("id", {
        ascending: false,
      });

    if (error) {

      return res
        .status(500)
        .json(error);

    }

    res.json(data);
  }
);

// EXPORTAR EXCEL
// EXPORTAR EXCEL
app.get(
  "/exportar-excel",
  async (req, res) => {

    const dataSelecionada =
      req.query.data;

    const hoje =
      new Date()
        .toLocaleDateString(
          "pt-BR",
          {
            timeZone:
              "America/Sao_Paulo",
          }
        );

    const dataFiltro =
      dataSelecionada || hoje;

    const {
      data: presencas,
      error,
    } = await supabase
      .from("presencas")
      .select("*")
      .eq("data", dataFiltro);

    if (
      error ||
      !presencas.length
    ) {

      return res
        .status(404)
        .json({
          mensagem:
            "Nenhuma presença encontrada",
        });

    }

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Presenças"
      );

    worksheet.columns = [

      {
        header: "Nome",
        key: "nome",
        width: 30,
      },

      {
        header:
          "Matrícula",
        key:
          "matricula",
        width: 20,
      },

      {
        header:
          "Data",
        key:
          "data",
        width: 20,
      },

      {
        header:
          "Hora Entrada",
        key:
          "hora",
        width: 20,
      },

      {
        header:
          "Status",
        key:
          "status",
        width: 20,
      },

     
    ];

    presencas.forEach(
      (presenca) => {

        worksheet.addRow({

          nome:
            presenca.nome,

          matricula:
            presenca.matricula,

          data:
            presenca.data,

          hora:
            presenca.hora,

          status:
            presenca.status,

        
        });

      }
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="presencas.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();
  }
);
// LOGIN
app.post(
  "/login",
  (req, res) => {

    const {
      usuario,
      senha,
    } = req.body;

    const usuarioEncontrado =
      usuarios.find(
        (u) =>
          u.usuario ===
            usuario &&
          u.senha ===
            senha
      );

    if (
      !usuarioEncontrado
    ) {

      return res
        .status(401)
        .json({
          mensagem:
            "Usuário ou senha inválidos",
        });

    }

    res.json({
      mensagem:
        "Login realizado",

      usuario: {
        id:
          usuarioEncontrado.id,

        usuario:
          usuarioEncontrado.usuario,

        tipo:
          usuarioEncontrado.tipo,
      },
    });
  }
);

// LIMPAR PRESENÇAS
app.delete(
  "/limpar-presencas",
  async (req, res) => {

    const hoje =
      new Date()
        .toLocaleDateString(
          "pt-BR",
          {
            timeZone:
              "America/Sao_Paulo",
          }
        );

    const { error } =
      await supabase
        .from("presencas")
        .delete()
        .eq("data", hoje);

    if (error) {

      return res
        .status(500)
        .json(error);

    }

    res.json({
      mensagem:
        "Presenças apagadas",
    });
  }
);

// =========================

app.listen(4000, () => {

  console.log(
    "Servidor rodando na porta 4000"
  );

});