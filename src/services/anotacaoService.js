// src/services/anotacaoService.js
import axios from "axios";

const API_URL = "http://localhost:8080/anotacoes"; // ajuste para sua rota do backend

export default {
  listarTodos() {
    return axios.get(API_URL);
  },
  buscarPorTexto(texto) {
    return axios.get(`${API_URL}/buscar`, { params: { texto } });
  },
  criar(anotacao) {
    return axios.post(API_URL, anotacao);
  },
};
