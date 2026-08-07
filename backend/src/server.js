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
  situacao,
} = req.body;

  const { data, error } =
    await supabase
      .from("funcionarios")
      .insert([
        {
          nome,
          matricula,
          cargo,
          situacao,
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
      situacao,
    } = req.body;

    const { error } =
      await supabase
        .from("funcionarios")
        .update({
          nome,
          matricula,
          cargo,
          situacao,
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

    // Verifica se o funcionário está em algum afastamento
const hojeISO = new Date().toISOString().split("T")[0];

const { data: afastamento, error: erroAfastamento } =
  await supabase
    .from("afastamentos")
    .select("*")
    .eq("matricula", matricula)
    .lte("data_inicio", hojeISO)
    .gte("data_fim", hojeISO)
    .maybeSingle();

if (erroAfastamento) {
  return res.status(500).json({
    mensagem: "Erro ao verificar afastamentos.",
  });
}

if (afastamento) {
  return res.status(400).json({
    mensagem: `Funcionário está em ${afastamento.tipo}.`,
    afastamento,
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

    const {
      data: funcionarios
    } = await supabase
      .from("funcionarios")
      .select("*");

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
      {
      header: "Situação",
      key: "situacao",
      width: 20,
    },

     
    ];
presencas.forEach(
  (presenca) => {

    const funcionario =
      funcionarios.find(
        (f) =>
          f.matricula ===
          presenca.matricula
      );

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

      situacao:
        funcionario?.situacao ||
        "Ativo",

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

// CADASTRAR AFASTAMENTO
app.post("/afastamentos", async (req, res) => {

  const {
    matricula,
    tipo,
    data_inicio,
    data_fim,
    observacao,
  } = req.body;
// Verifica se já existe um afastamento para o funcionário no mesmo período
const { data: afastamentoExistente } = await supabase
  .from("afastamentos")
  .select("*")
  .eq("matricula", matricula)
  .lte("data_inicio", data_fim)
  .gte("data_fim", data_inicio)
  .maybeSingle();

if (afastamentoExistente) {
  return res.status(400).json({
    mensagem:
      "Este funcionário já possui um afastamento nesse período.",
  });
}
  const { data, error } = await supabase
    .from("afastamentos")
    .insert([
      {
        matricula,
        tipo,
        data_inicio,
        data_fim,
        observacao,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data[0]);

});

// LISTAR AFASTAMENTOS
app.get("/afastamentos", async (req, res) => {

  const { data, error } = await supabase
    .from("afastamentos")
    .select("*")
    .order("data_inicio", { ascending: false });

 if (error) {
  console.error("Erro ao cadastrar afastamento:", error);

  return res.status(500).json({
    mensagem: error.message,
    erro: error,
  });
}

  res.json(data);

});

// EXCLUIR AFASTAMENTO
app.delete("/afastamentos/:id", async (req, res) => {

  const { id } = req.params;

  const { error } = await supabase
    .from("afastamentos")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json(error);
  }

  res.json({
    mensagem: "Afastamento removido com sucesso"
  });

});
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