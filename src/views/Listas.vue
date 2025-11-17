<template>
  <div class="listas-page">
    <h1>Gerenciar Listas</h1>

    <!-- Cadastro -->
    <section class="cadastro">
      <h2>Cadastrar Lista</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Descrição *</label>
          <input v-model="form.descricao" required />
        </div>

        <div>
          <label>Anotação *</label>
          <select v-model="form.anotacaoId" required>
            <option value="" disabled>Selecione uma anotação</option>
            <option
              v-for="a in anotacoes"
              :key="a.id"
              :value="a.id"
            >
              {{ a.descricao }} — {{ a.texto }}
            </option>
          </select>
        </div>

        <div>
          <label>Comentário de Verificação (opcional)</label>
          <input v-model="form.comentarioVerificacao" />
        </div>

        <div>
          <label>Data/Hora Verificação (opcional)</label>
          <input type="datetime-local" v-model="form.dataHoraVerificacao" />
        </div>

        <button type="submit">Cadastrar</button>
        <button type="button" @click="limparForm">Limpar</button>
      </form>

      <div v-if="mensagemForm" class="mensagem">{{ mensagemForm }}</div>
    </section>

    <!-- Busca -->
    <section class="busca">
      <h2>Buscar Lista</h2>
      <div>
        <label>Texto da Anotação</label>
        <input v-model="buscaTexto" placeholder="Digite parte do texto da anotação" />
      </div>
      <div>
        <label>Descrição da Lista</label>
        <input v-model="buscaDescricao" placeholder="Digite parte da descrição" />
      </div>
      <button @click="buscarListas">Buscar</button>
      <button @click="carregarTodas">Listar Todas</button>
      <p v-if="mensagemBusca">{{ mensagemBusca }}</p>
    </section>

    <!-- Tabela -->
    <section class="tabela">
      <h2>Listas</h2>
      <table v-if="listas.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Comentário</th>
            <th>Anotação (Descrição)</th>
            <th>Anotação (Texto)</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in listas" :key="l.id">
            <td>{{ l.id }}</td>
            <td>{{ l.descricao }}</td>
            <td>{{ l.comentarioVerificacao || '-' }}</td>
            <td>{{ l.anotacaoDescricao }}</td>
            <td>{{ l.anotacaoTexto }}</td>
            <td>{{ l.situacao }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else>Nenhuma lista encontrada.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import listaService from "@/services/listaService";
import anotacaoService from "@/services/anotacaoService"; // serviço de anotações

const listas = ref([]);
const anotacoes = ref([]);
const mensagemForm = ref("");
const mensagemBusca = ref("");
const buscaTexto = ref("");
const buscaDescricao = ref("");

const form = reactive({
  descricao: "",
  comentarioVerificacao: "",
  dataHoraVerificacao: "",
  anotacaoId: ""
});

onMounted(() => {
  carregarTodas();
  carregarAnotacoes();
});

async function carregarTodas() {
  try {
    const resp = await listaService.listarTodos();
    listas.value = Array.isArray(resp.data) ? resp.data : [];
    mensagemBusca.value = listas.value.length
      ? ""
      : "Nenhuma lista cadastrada.";
  } catch (e) {
    mensagemBusca.value = "Erro ao carregar listas.";
  }
}

async function carregarAnotacoes() {
  try {
    const resp = await anotacaoService.listarTodos();
    anotacoes.value = resp.data;
  } catch (e) {
    console.error("Erro ao carregar anotações:", e);
  }
}

async function handleSubmit() {
  mensagemForm.value = "";

  if (!form.descricao || !form.anotacaoId) {
    mensagemForm.value = "Preencha todos os campos obrigatórios.";
    return;
  }

  try {
    const payload = {
      descricao: form.descricao,
      comentarioVerificacao: form.comentarioVerificacao,
      dataHoraVerificacao: form.dataHoraVerificacao
        ? new Date(form.dataHoraVerificacao).toISOString()
        : null,
      anotacao: { id: form.anotacaoId }
    };

    await listaService.criar(payload);
    mensagemForm.value = "Lista cadastrada com sucesso!";
    limparForm();
    carregarTodas();
  } catch (e) {
    console.error("Erro ao cadastrar lista:", e);
    mensagemForm.value = "Erro ao cadastrar lista.";
  }
}

function limparForm() {
  form.descricao = "";
  form.comentarioVerificacao = "";
  form.dataHoraVerificacao = "";
  form.anotacaoId = "";
}

async function buscarListas() {
  if (!buscaTexto.value && !buscaDescricao.value) {
    mensagemBusca.value = "Informe texto e/ou descrição para buscar.";
    return;
  }

  try {
    const resp = await listaService.buscar(buscaTexto.value, buscaDescricao.value);
    if (typeof resp.data === "string") {
      listas.value = [];
      mensagemBusca.value = resp.data;
    } else {
      listas.value = resp.data;
      mensagemBusca.value = listas.value.length
        ? ""
        : "Nenhum registro encontrado.";
    }
  } catch (e) {
    mensagemBusca.value = "Erro ao buscar listas.";
  }
}
</script>

<style scoped>
.listas-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}
h1, h2 {
  color: #333;
}
section {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
}
input, textarea, select {
  width: 100%;
  margin-bottom: 8px;
  padding: 6px;
}
button {
  margin-right: 8px;
  padding: 6px 10px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 6px;
}
.mensagem {
  color: green;
  font-weight: bold;
}
</style>
